import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert ESG Corporate Analyst and Sustainability Auditor working for Litro de Luz. Your task is to generate a professional, investor-ready ESG Impact Report for a corporate sponsor based on their real-time telemetry data. You must shift the narrative from "corporate philanthropy" to "data-driven ESG financial investment" treating sunlight as a verifiable financial asset. Maintain a highly professional, data-centric, and inspiring corporate tone.

Report Structure Requirements: Generate a comprehensive report in markdown format following exactly this structure:

1. Executive Summary: A powerful opening paragraph summarizing the financial and social ROI of the sponsor's investment in decentralized infrastructure. Emphasize that these metrics are validated by physical infrastructure turning sustainability into tangible human progress.

2. Environmental Impact (E): Analyze the clean energy generated and the Scope 3 CO2 avoided. Explain what this means in practical terms (e.g., equivalent to planting X trees or removing X cars from the road).

3. Social Impact & Community Uptime (S): Analyze the WiFi connections and beneficiaries data. Frame the provision of free internet and lighting not as charity, but as building digital and physical ecosystems that empower communities and close the digital divide.

4. SDG Alignment: Explicitly state how these metrics map to specific UN Sustainable Development Goals, focusing primarily on SDG 4 (Quality Education), SDG 7 (Affordable and Clean Energy), SDG 9 (Industry, Innovation and Infrastructure), SDG 10 (Reduced Inequalities), SDG 11 (Sustainable Cities and Communities), and SDG 13 (Climate Action).

5. Strategic Outlook (Next Steps): A brief closing statement encouraging the continued scaling of this verifiable impact asset to further the sponsor's net-zero transition.

Format using markdown with # for title, ## for sections, ### for subsections, - for bullet points, and **bold** for emphasis. End with a --- separator and an italicized compliance note.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require an authenticated user before consuming AI credits
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sponsorData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Generate the ESG Impact Report using the following telemetry data:

Sponsor Name: ${sponsorData.sponsor_name}
Reporting Period: ${sponsorData.reporting_period}
Active ELISA Poles: ${sponsorData.active_poles}
Clean Energy Generated: ${sponsorData.kwh_generated} kWh
Scope 3 CO2 Emissions Avoided: ${sponsorData.co2_avoided} kg
Community WiFi Connections: ${sponsorData.wifi_connections}
Total Beneficiaries Impacted: ${sponsorData.beneficiaries}
Total Investment: $${sponsorData.total_investment}
Countries of Operation: ${sponsorData.countries}
Communities Served: ${sponsorData.communities}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please top up in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-esg-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
