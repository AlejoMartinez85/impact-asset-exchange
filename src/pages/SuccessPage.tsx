import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Globe, Radio, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TIMELINE_STEPS = [
  {
    icon: Cpu,
    title: "Hardware Provisioning",
    subtitle: "In Progress — units being configured & tested",
    status: "active" as const,
  },
  {
    icon: Globe,
    title: "Community Deployment",
    subtitle: "ETA: 14 Days — logistics & site preparation",
    status: "upcoming" as const,
  },
  {
    icon: Radio,
    title: "IoT Sensors Online & Telemetry Sync",
    subtitle: "Live data streaming to your ESG dashboard",
    status: "upcoming" as const,
  },
];

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clusters = searchParams.get("clusters") || "1";
  const poles = Number(clusters) * 50;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/3 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-xl w-full space-y-8 relative z-10"
      >
        {/* Animated Checkmark */}
        <div className="flex flex-col items-center text-center space-y-5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150 animate-pulse" />
            <div className="relative p-4 rounded-full bg-primary/10 border border-primary/30">
              <CheckCircle2 className="h-14 w-14 text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.6)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Impact Cluster Successfully Funded.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Welcome to the Impact Exchange. Your ESG SaaS subscription is now active.
            </p>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/60">
            <CardContent className="pt-5 pb-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order Summary
                </span>
              </div>
              <Separator className="bg-border/50" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {clusters}× Corporate Impact Cluster ({poles} ELISA Poles)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initial Deployment (CapEx)</span>
                  <span className="font-mono font-medium text-foreground">
                    ${(15000 * Number(clusters)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual ESG Telemetry SaaS (OpEx)</span>
                  <span className="font-mono font-medium text-foreground">
                    ${(4995 * Number(clusters)).toLocaleString()}/yr
                  </span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">Total Funded</span>
                  <span className="font-mono text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]">
                    ${((15000 + 4995) * Number(clusters)).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-3"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            What Happens Next
          </h3>
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-3.5 relative">
                {/* Vertical connector line */}
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className="absolute left-[17px] top-9 bottom-0 w-px bg-border/60" />
                )}
                <div
                  className={`shrink-0 mt-0.5 p-2 rounded-lg border ${
                    step.status === "active"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted/50 border-border/50"
                  }`}
                >
                  <step.icon
                    className={`h-4 w-4 ${
                      step.status === "active" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="pb-5">
                  <p
                    className={`text-sm font-medium ${
                      step.status === "active" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="gap-2 text-sm font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
          >
            Enter Live Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
