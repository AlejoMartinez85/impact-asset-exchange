import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEPLOYMENT_PRICE_ID = "price_1T8fS9Rxjg7KfXTpzvG7a9W4";
const SAAS_PRICE_ID = "price_1T8fT0Rxjg7KfXTpMpiAwlOe";

const VOLUME_DISCOUNTS: Record<number, number> = {
  1: 0,
  2: 5,
  3: 10,
  5: 15,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clusterQty } = await req.json();
    const quantity = Number(clusterQty) || 1;

    if (![1, 2, 3, 5].includes(quantity)) {
      throw new Error("Invalid cluster quantity. Must be 1, 2, 3, or 5.");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const discountPercent = VOLUME_DISCOUNTS[quantity] || 0;
    let couponId: string | undefined;

    if (discountPercent > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discountPercent,
        duration: "once",
        name: `${quantity} Cluster Volume Discount (${discountPercent}% off)`,
      });
      couponId = coupon.id;
    }

    const origin = req.headers.get("origin") || "https://lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer_email: "demo@ab-inbev.com",
      line_items: [
        { price: DEPLOYMENT_PRICE_ID, quantity },
        { price: SAAS_PRICE_ID, quantity },
      ],
      mode: "subscription",
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      success_url: `${origin}/dashboard/billing?success=true&clusters=${quantity}`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: {
        cluster_quantity: String(quantity),
        source: "demo",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
