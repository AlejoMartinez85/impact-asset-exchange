import { motion } from "framer-motion";
import { TrendingUp, Bug, Droplets, Factory, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LiveMap from "@/components/LiveMap";

/* ─── Regenerative KPI Data ─── */
const regenKPIs = [
  {
    title: "Soil Organic Carbon (SOC) Growth",
    value: "+1.2%",
    subtitle: "Verified via edge soil sensors",
    icon: TrendingUp,
    color: "ods-green" as const,
    trend: "+0.3% vs Q3",
  },
  {
    title: "Biodiversity Acoustic Score",
    value: "84/100",
    subtitle: "Avian & insect return index",
    icon: Bug,
    color: "ods-teal" as const,
    trend: "+12 pts YoY",
  },
  {
    title: "Water Retention Index",
    value: "Optimal",
    subtitle: "Monitoring coffee/dairy water cycles",
    icon: Droplets,
    color: "ods-blue" as const,
    trend: "Stable",
  },
];

const colorMap = {
  "ods-green": { bg: "bg-[hsl(var(--ods-green))]/10", text: "text-[hsl(var(--ods-green))]", ring: "ring-[hsl(var(--ods-green))]/20" },
  "ods-teal": { bg: "bg-[hsl(var(--ods-teal))]/10", text: "text-[hsl(var(--ods-teal))]", ring: "ring-[hsl(var(--ods-teal))]/20" },
  "ods-blue": { bg: "bg-[hsl(var(--ods-blue))]/10", text: "text-[hsl(var(--ods-blue))]", ring: "ring-[hsl(var(--ods-blue))]/20" },
};

const SponsorDashboardMain = () => {
  const scope3Progress = 34; // % toward 2050 goal

  return (
    <div className="space-y-8">
      {/* ─── Client Identity Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Welcome back, Nestlé Sustainability & Sourcing Team
          </h2>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Regenerative Agriculture & Net Zero 2050 — Coffee & Dairy Supply Chains
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="h-7 px-3 text-[10px] font-semibold tracking-wide bg-[hsl(var(--ods-green))]/10 text-[hsl(var(--ods-green))] border-[hsl(var(--ods-green))]/25 hover:bg-[hsl(var(--ods-green))]/15 font-sans">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[hsl(var(--ods-green))] mr-1.5 animate-pulse" />
            Active Pilot: Regenerative Ag
          </Badge>
          <Avatar className="h-9 w-9 border-2 border-[hsl(var(--ods-green))]/30">
            <AvatarFallback className="bg-[hsl(var(--ods-green))]/10 text-[hsl(var(--ods-green))] text-sm font-bold font-sans">
              N
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ─── Row 1: Regenerative KPI Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {regenKPIs.map((kpi, i) => {
          const colors = colorMap[kpi.color];
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="relative overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--${kpi.color}))] to-[hsl(var(--${kpi.color}))/60]`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                      {kpi.title}
                    </span>
                    <div className={`p-2 rounded-lg ${colors.bg} ring-1 ${colors.ring}`}>
                      <kpi.icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold text-foreground font-mono tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">{kpi.subtitle}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-3 w-3 text-[hsl(var(--ods-green))]" />
                    <span className="text-[10px] font-medium text-[hsl(var(--ods-green))] font-sans">
                      {kpi.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Row 2: Net Zero 2050 Tracker ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="border-border overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-[hsl(var(--ods-green))] via-[hsl(var(--ods-teal))] to-[hsl(var(--ods-blue))]" />
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[hsl(var(--ods-teal))]/10 ring-1 ring-[hsl(var(--ods-teal))]/20">
                  <Factory className="h-5 w-5 text-[hsl(var(--ods-teal))]" />
                </div>
                <div>
                  <CardTitle className="text-base">Net Zero 2050 Roadmap Contribution</CardTitle>
                  <CardDescription className="text-xs font-sans">
                    Scope 3 emissions mitigation from this regenerative cluster
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold border-[hsl(var(--ods-teal))]/25 text-[hsl(var(--ods-teal))] font-sans">
                GHG Protocol · SBTi Aligned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold font-mono text-foreground tracking-tight">{scope3Progress}%</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                  of 2050 Scope 3 target mitigated by this cluster
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-foreground font-sans">12,480 tCO₂e</p>
                <p className="text-[10px] text-muted-foreground font-sans">avoided this fiscal year</p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={scope3Progress} className="h-3 bg-secondary" />
              <div className="flex justify-between text-[10px] text-muted-foreground font-sans">
                <span>2024 Baseline</span>
                <span className="font-medium text-[hsl(var(--ods-teal))]">Current: {scope3Progress}%</span>
                <span>2050 Net Zero Target</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: "Coffee Supply Chain", value: "8,120 tCO₂e", pct: "65%" },
                { label: "Dairy Supply Chain", value: "4,360 tCO₂e", pct: "35%" },
                { label: "Verified Credits", value: "2,100", pct: "Verra VCS" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-secondary/40 border border-border/50">
                  <p className="text-[10px] text-muted-foreground font-sans">{item.label}</p>
                  <p className="text-sm font-bold font-mono text-foreground mt-0.5">{item.value}</p>
                  <p className="text-[10px] font-medium text-[hsl(var(--ods-teal))] font-sans">{item.pct}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Row 3: Supply Chain Map ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Coffee & Dairy Supply Chain Nodes</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                50 sensor nodes across this regenerative agriculture pilot
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-semibold border-border text-muted-foreground font-sans">
              Pilot Cluster · Isolated View
            </Badge>
          </div>
          <Card className="border-border overflow-hidden">
            <CardContent className="p-0">
              <LiveMap />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default SponsorDashboardMain;
