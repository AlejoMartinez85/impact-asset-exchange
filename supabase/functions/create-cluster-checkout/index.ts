import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Stripe Price IDs
const DEPLOYMENT_PRICE_ID = "price_1T8fS9Rxjg7KfXTpzvG7a9W4"; // $15,000 one-time
const SAAS_PRICE_ID = "price_1T8fT0Rxjg7KfXTpMpiAwlOe"; // $4,995/year

// Volume discounts
const VOLUME_DISCOUNTS: Record<number, number> = {
  1: 0,
  2: 5,
  3: 10,
  5: 15,
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CLUSTER-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { clusterQty } = await req.json();
    const quantity = Number(clusterQty) || 1;
    
    if (![1, 2, 3, 5].includes(quantity)) {
      throw new Error("Invalid cluster quantity. Must be 1, 2, 3, or 5.");
    }
    
    logStep("Cluster quantity validated", { quantity });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Calculate discount
    const discountPercent = VOLUME_DISCOUNTS[quantity] || 0;
    let couponId: string | undefined;
    
    if (discountPercent > 0) {
      // Create a coupon for volume discount
      const coupon = await stripe.coupons.create({
        percent_off: discountPercent,
        duration: "once",
        name: `${quantity} Cluster Volume Discount (${discountPercent}% off)`,
      });
      couponId = coupon.id;
      logStep("Created volume discount coupon", { couponId, discountPercent });
    }

    const origin = req.headers.get("origin") || "https://lovable.app";

    // Create checkout session with both one-time deployment and subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: DEPLOYMENT_PRICE_ID,
          quantity: quantity,
        },
        {
          price: SAAS_PRICE_ID,
          quantity: quantity,
        },
      ],
      mode: "subscription", // Subscription mode allows mixing one-time and recurring
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url: `${origin}/dashboard/billing?success=true&clusters=${quantity}`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: {
        cluster_quantity: String(quantity),
        user_id: user.id,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
