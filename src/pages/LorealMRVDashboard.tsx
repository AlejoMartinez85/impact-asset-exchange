import { motion } from "framer-motion";
import { Leaf, AudioLines, Users, ShieldCheck, FileCheck, Lock, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LiveMap from "@/components/LiveMap";

/* ─── Premium gold/earth tokens (inline, scoped to this dashboard) ─── */
const gold = {
  accent: "45 80% 48%",
  accentMuted: "38 40% 72%",
  charcoal: "220 12% 18%",
  warmGray: "30 8% 56%",
};

/* ─── MRV KPI Data ─── */
const mrvKPIs = [
  {
    title: "Ecosystem MRV Tracker",
    value: "Active",
    subtitle: "Continuous telemetry on soil moisture & carbon across Shea/Argan cooperatives",
    icon: Leaf,
    trend: "24/7 Streaming",
  },
  {
    title: "Biodiversity Acoustic Score",
    value: "88/100",
    subtitle: "AI-verified ecosystem health (Flora & Fauna return)",
    icon: AudioLines,
    trend: "+14 pts YoY",
  },
  {
    title: "Women's Cooperative Inclusion",
    value: "1,200 Hours",
    subtitle: "Of Starlink connectivity and public lighting provided to harvesters",
    icon: Users,
    trend: "+320 hrs vs Q3",
  },
];

/* ─── Ingredient tags ─── */
const ingredientTags = [
  { label: "Shea Butter", region: "West Africa" },
  { label: "Argan Oil", region: "Morocco" },
  { label: "Sustainable Palm", region: "Southeast Asia" },
];

/* ─── 2030 Commitments ─── */
const commitments = [
  {
    icon: ShieldCheck,
    title: "Scope 3 Nature-Based Mitigation",
    description: "Automated Proof-of-Physical-Work certificates generated hourly from IoT telemetry, ready for SBTi FLAG verification.",
    progress: 42,
    metric: "4,860 tCO₂e verified",
  },
  {
    icon: FileCheck,
    title: "Third-Party Audit Readiness",
    description: "Cryptographic data provenance ensures every ESG claim is traceable from sensor to ledger — no manual reporting.",
    progress: 78,
    metric: "78% audit-ready data",
  },
  {
    icon: Lock,
    title: "Supply Chain Transparency",
    description: "Immutable telemetry records create a verifiable chain-of-custody for each botanical ingredient source.",
    progress: 65,
    metric: "3 supply chains digitized",
  },
];

const LorealMRVDashboard = () => {
  return (
    <div className="space-y-8">
      {/* ─── Client Identity Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            L'Oréal Ethical Sourcing & Nature-Based Solutions
          </h2>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            MRV Platform for Botanical Supply Chain Integrity — Cambridge CISL Accelerator
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className="h-7 px-3 text-[10px] font-semibold tracking-wide border font-sans"
            style={{
              backgroundColor: `hsla(${gold.accent}, 0.1)`,
              color: `hsl(${gold.accent})`,
              borderColor: `hsla(${gold.accent}, 0.25)`,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
              style={{ backgroundColor: `hsl(${gold.accent})` }}
            />
            Active MRV Pilot: Botanical Sourcing
          </Badge>
          <Avatar className="h-9 w-9 border-2" style={{ borderColor: `hsla(${gold.accent}, 0.3)` }}>
            <AvatarFallback
              className="text-sm font-bold font-sans"
              style={{
                backgroundColor: `hsla(${gold.accent}, 0.1)`,
                color: `hsl(${gold.accent})`,
              }}
            >
              L
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ─── Row 1: MRV & Social Impact KPI Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mrvKPIs.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: `linear-gradient(90deg, hsl(${gold.accent}), hsl(${gold.accentMuted}))`,
                }}
              />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                    {kpi.title}
                  </span>
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `hsla(${gold.accent}, 0.08)`,
                      boxShadow: `inset 0 0 0 1px hsla(${gold.accent}, 0.2)`,
                    }}
                  >
                    <kpi.icon className="h-4 w-4" style={{ color: `hsl(${gold.accent})` }} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold text-foreground font-mono tracking-tight">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-sans">{kpi.subtitle}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3" style={{ color: `hsl(${gold.accent})` }} />
                  <span
                    className="text-[10px] font-medium font-sans"
                    style={{ color: `hsl(${gold.accent})` }}
                  >
                    {kpi.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── Row 2: Supply Chain Traceability Map ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Botanical Ingredients Traceability Network
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                Real-time MRV telemetry across cooperative sourcing regions
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientTags.map((tag) => (
                <Badge
                  key={tag.label}
                  variant="outline"
                  className="text-[10px] font-semibold font-sans border-border"
                  style={{ color: `hsl(${gold.warmGray})` }}
                >
                  {tag.label}
                  <span className="ml-1 opacity-60">· {tag.region}</span>
                </Badge>
              ))}
            </div>
          </div>
          <Card className="border-border overflow-hidden">
            <CardContent className="p-0">
              <LiveMap />
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ─── Row 3: L'Oréal 2030 Commitments Tracker ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, hsl(${gold.accent}), hsl(${gold.accentMuted}), hsl(var(--ods-green)))`,
            }}
          />
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">
                  L'Oréal For the Future 2030 — Automated Compliance
                </CardTitle>
                <CardDescription className="text-xs font-sans">
                  Cryptographic Proof-of-Physical-Work powering nature-based targets and Scope 3 verification
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold font-sans"
                style={{
                  borderColor: `hsla(${gold.accent}, 0.25)`,
                  color: `hsl(${gold.accent})`,
                }}
              >
                SBTi FLAG · TNFD Aligned
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {commitments.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/40 border border-border/50 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `hsla(${gold.accent}, 0.08)`,
                        boxShadow: `inset 0 0 0 1px hsla(${gold.accent}, 0.2)`,
                      }}
                    >
                      <c.icon className="h-4 w-4" style={{ color: `hsl(${gold.accent})` }} />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {c.description}
                  </p>
                  <div className="space-y-1.5">
                    <Progress value={c.progress} className="h-2 bg-secondary" />
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[10px] font-semibold font-sans"
                        style={{ color: `hsl(${gold.accent})` }}
                      >
                        {c.metric}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {c.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LorealMRVDashboard;
