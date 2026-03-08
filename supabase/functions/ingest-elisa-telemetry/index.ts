import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Grid emission factor: 0.42 kg CO₂ per kWh (global average)
const GRID_EMISSION_FACTOR = 0.42;

// Input validation schema
const telemetrySchema = z.object({
  serial_number: z.string().min(1).max(50),
  hardware_secret: z.string().min(1).max(128),
  kwh_generated: z.number().positive().max(100000),
  wifi_connections: z.number().int().nonnegative().max(10000),
  light_hours: z.number().nonnegative().max(24),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse and validate input
    const rawBody = await req.json();
    const parseResult = telemetrySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { serial_number, hardware_secret, kwh_generated, wifi_connections, light_hours } =
      parseResult.data;

    // Use service_role key — this function is called by IoT hardware, not browser users
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Verify pole exists, is active, and hardware_secret matches
    const { data: pole, error: poleError } = await supabase
      .from("elisa_poles")
      .select("id, status, hardware_secret")
      .eq("serial_number", serial_number)
      .maybeSingle();

    if (poleError) {
      console.error("DB lookup error:", poleError);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pole) {
      return new Response(
        JSON.stringify({ error: "Unknown device. Serial number not registered." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Constant-time-ish secret comparison (basic protection)
    if (pole.hardware_secret !== hardware_secret) {
      return new Response(
        JSON.stringify({ error: "Authentication failed. Invalid hardware secret." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (pole.status !== "active") {
      return new Response(
        JSON.stringify({ error: `Device is ${pole.status}. Only active devices can submit telemetry.` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Calculate ESG metrics
    const co2_avoided_kg = kwh_generated * GRID_EMISSION_FACTOR;

    // 3. Insert telemetry log
    const { error: insertError } = await supabase.from("telemetry_logs").insert({
      pole_id: pole.id,
      kwh_generated,
      wifi_connections,
      light_hours,
      co2_avoided_kg,
      raw_payload: rawBody,
    });

    if (insertError) {
      console.error("Telemetry insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store telemetry" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Update last_ping_at on the pole
    await supabase
      .from("elisa_poles")
      .update({ last_ping_at: new Date().toISOString() })
      .eq("id", pole.id);

    return new Response(
      JSON.stringify({
        status: "ok",
        pole_id: pole.id,
        co2_avoided_kg: Math.round(co2_avoided_kg * 100) / 100,
        message: `Telemetry recorded. ${co2_avoided_kg.toFixed(2)} kg CO₂ avoided.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ingest-elisa-telemetry error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
