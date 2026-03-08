import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  FileText,
  Globe,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Subscription context removed for demo mode
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const tiers = [
  {
    name: "ESG Starter",
    price: 699,
    unit: "per ELISA pole / year",
    description: "Continuous IoT telemetry & verified Scope 3 emissions data for each funded solar unit.",
    features: [
      "Real-time kWh & CO₂ dashboards",
      "Quarterly AI ESG summaries",
      "SDG alignment scoring",
      "CSV data exports",
    ],
    cta: "Start Monitoring",
    highlighted: false,
  },
  {
    name: "ESG Impact Premium",
    price: 4_995,
    unit: "per year (up to 10 poles)",
    description: "Full platform access with AI reporting, live maps, and executive-ready PDF certification.",
    features: [
      "Everything in Starter",
      "Unlimited AI report generation",
      "Live interactive map & alerts",
      "PDF export & stakeholder portal",
      "Dedicated ESG account manager",
      "Custom branding on reports",
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
  },
];

const BillingPage = () => {
  const plan = { name: "Platinum ESG Partner", status: "active" as const, annualTotal: 84_000, activePolesCount: 100, renewalDate: "2027-01-15" };
  const toggleMockStatus = () => {};
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (tierName: string) => {
    setCheckoutLoading(tierName);
    // TODO: Replace with Supabase Edge Function call to create Stripe Checkout Session
    // Example:
    // const { data } = await supabase.functions.invoke('create-checkout-session', {
    //   body: { priceId: 'price_xxx', tenantId: sponsor.id }
    // });
    // window.location.href = data.url;
    await new Promise((r) => setTimeout(r, 1500));
    setCheckoutLoading(null);
    alert("In production, this redirects to Stripe Checkout.");
  };

  const handleManageBilling = () => {
    // TODO: Replace with Supabase Edge Function call to create Stripe Customer Portal session
    // Example:
    // const { data } = await supabase.functions.invoke('create-portal-session', {
    //   body: { customerId: sponsor.stripeCustomerId }
    // });
    // window.location.href = data.url;
    alert("In production, this redirects to the Stripe Customer Portal for invoices and plan management.");
  };

  const statusColor: Record<string, string> = {
    active: "bg-primary/20 text-primary border-primary/30",
    trialing: "bg-accent/20 text-accent border-accent/30",
    inactive: "bg-destructive/20 text-destructive border-destructive/30",
    past_due: "bg-[hsl(var(--glow-warning))]/20 text-[hsl(var(--glow-warning))] border-[hsl(var(--glow-warning))]/30",
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your ESG data subscription, download invoices, and upgrade your plan
        </p>
      </div>

      {/* Current Plan Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription className="text-xs">Current active subscription</CardDescription>
                </div>
              </div>
              <Badge className={`text-[10px] uppercase tracking-wider border ${statusColor[plan.status]}`}>
                {plan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Annual Total</p>
                <p className="text-xl font-bold text-foreground">${plan.annualTotal.toLocaleString()}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Active ELISA Poles</p>
                <p className="text-xl font-bold text-foreground">{plan.activePolesCount}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Renewal Date</p>
                <p className="text-xl font-bold text-foreground">
                  {new Date(plan.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={handleManageBilling} className="gap-2 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                Manage Billing & Invoices
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Download Latest Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pricing Tiers */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card
                className={`relative overflow-hidden h-full ${
                  tier.highlighted
                    ? "border-primary/40 shadow-lg shadow-primary/5"
                    : "border-border"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tier.name}</CardTitle>
                    {tier.highlighted && (
                      <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px]">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <span className="text-3xl font-bold text-foreground">${tier.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">/{tier.unit}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCheckout(tier.name)}
                    disabled={checkoutLoading === tier.name}
                    className={`w-full gap-2 ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {checkoutLoading === tier.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        {tier.cta}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dev toggle */}
      <Card className="border-dashed border-border bg-secondary/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-xs font-medium text-foreground">Dev Mode: Toggle Subscription Status</Label>
              <p className="text-[10px] text-muted-foreground">Simulate active / inactive to test paywall gating</p>
            </div>
          </div>
          <Switch checked={plan.status === "active"} onCheckedChange={toggleMockStatus} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
