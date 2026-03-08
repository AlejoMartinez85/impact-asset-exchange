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
  Lock,
  Package,
  Cpu,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const BillingPage = () => {
  const [isActive, setIsActive] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const currentPlan = {
    status: isActive ? "active" : "inactive",
    clusters: 1,
    poles: 50,
    nextBilling: "2027-10-12",
    yearStarted: 2026,
  };

  const statusColor: Record<string, string> = {
    active: "bg-primary/20 text-primary border-primary/30",
    inactive: "bg-destructive/20 text-destructive border-destructive/30",
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    // TODO: Replace with Stripe Checkout session via edge function
    await new Promise((r) => setTimeout(r, 1500));
    setCheckoutLoading(false);
    alert("In production, this redirects to Stripe Checkout for $19,995 (Deployment + Year 1 SaaS).");
  };

  const handleManageBilling = () => {
    alert("In production, this redirects to the Stripe Customer Portal for invoices and plan management.");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your Corporate Impact Cluster deployment and ESG SaaS subscription
        </p>
      </div>

      {/* Current Active Plan */}
      {currentPlan.status === "active" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">Corporate Impact Cluster</h3>
                      <Badge className={`text-[10px] uppercase tracking-wider border ${statusColor[currentPlan.status]}`}>
                        {currentPlan.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Active since {currentPlan.yearStarted}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleManageBilling} className="gap-2 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Manage Billing Portal (Stripe)
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Package className="h-3 w-3" /> Clusters Deployed
                  </p>
                  <p className="text-xl font-bold text-foreground">{currentPlan.clusters} Cluster</p>
                  <p className="text-[10px] text-muted-foreground">{currentPlan.poles} ELISA Poles</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Next Billing Date
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {new Date(currentPlan.nextBilling).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Annual SaaS renewal</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3" /> Annual SaaS Fee
                  </p>
                  <p className="text-xl font-bold text-foreground">$4,995</p>
                  <p className="text-[10px] text-muted-foreground">per year</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pricing Section Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Enterprise Pricing</h3>
        <p className="text-xs text-muted-foreground">
          Deploy a cluster of 50 ELISA® units with full ESG telemetry and AI certification
        </p>
      </div>

      {/* Pricing Cards - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Hardware Deployment (CapEx) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Package className="h-5 w-5 text-amber-500" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground border-border">
                  CapEx — One-Time
                </Badge>
              </div>
              <CardTitle className="text-lg">Corporate Impact Cluster</CardTitle>
              <CardDescription className="text-xs">(50 ELISA® Units)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-4xl font-bold text-foreground">$15,000</span>
                <p className="text-xs text-muted-foreground mt-1">One-time deployment fee</p>
              </div>

              <Separator className="bg-border/50" />

              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  Materials & Logistics
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  Physical Installation in Rural Communities
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-foreground">22.8-Year</strong> Certified Hardware Lifespan
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  GPS-Tagged Serial Numbers (Audit-Ready)
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2: ESG Software Platform (OpEx) - Highlighted */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full relative overflow-hidden border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/10">
            {/* Glowing top border */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] uppercase tracking-wider">
                  OpEx — Annual SaaS
                </Badge>
              </div>
              <CardTitle className="text-lg">Impact Exchange SaaS & AI Certification</CardTitle>
              <CardDescription className="text-xs">Full-stack ESG telemetry platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-4xl font-bold text-foreground">$4,995</span>
                <p className="text-xs text-muted-foreground mt-1">per year</p>
              </div>

              <Separator className="bg-border/50" />

              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Real-time Scope 3 CO₂ Telemetry
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Automated AI ESG Reports (Auditable)
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Continuous Community WiFi Maintenance
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  Dedicated Sponsor Dashboard
                </li>
                <li className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  UN SDG Alignment Scoring
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Checkout Summary & CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Initial Investment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">$19,995</span>
                  <span className="text-sm text-muted-foreground">(Deployment + Year 1 SaaS)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Then <strong className="text-foreground">$4,995/year</strong> for continued ESG telemetry & AI certification
                </p>
              </div>
              
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 px-8"
              >
                {checkoutLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Deploy Cluster & Subscribe with Stripe
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <Separator className="my-5 bg-border/50" />

            <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Secure Stripe Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Invoice & Tax Documentation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>Deployed in 6+ Countries</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dev Mode Toggle */}
      <Card className="border-dashed border-border bg-secondary/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-xs font-medium text-foreground">Dev Mode: Toggle Subscription Status</Label>
              <p className="text-[10px] text-muted-foreground">Simulate active / inactive to test paywall gating</p>
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
