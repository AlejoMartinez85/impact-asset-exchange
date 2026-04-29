import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Leaf, AudioLines, Users, ShieldCheck, FileCheck, Lock, ArrowUpRight, CheckCircle2, Wifi, FileBadge, Radar, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  TooltipProps,
} from "recharts";
import LiveMap from "@/components/LiveMap";
import AnimatedCounter from "@/components/AnimatedCounter";

/* ─── Premium gold/earth tokens ─── */
const gold = {
  accent: "45 80% 48%",
  accentMuted: "38 40% 72%",
  charcoal: "220 12% 18%",
  warmGray: "30 8% 56%",
};

/* ─── 24-Hour Mock Telemetry (bio-acoustics peak at dawn/dusk, insects at night) ─── */
const generate24hData = () => {
  const hours: { hour: string; bioAcoustics: number; dataTransfer: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const label = `${h.toString().padStart(2, "0")}:00`;
    // Dawn peak ~5-7, Dusk peak ~18-20, night plateau
    let bio: number;
    if (h >= 5 && h <= 7) bio = 70 + Math.sin((h - 5) * Math.PI / 2) * 25 + Math.random() * 5;
    else if (h >= 18 && h <= 20) bio = 65 + Math.sin((h - 18) * Math.PI / 2) * 20 + Math.random() * 5;
    else if (h >= 22 || h <= 3) bio = 30 + Math.random() * 8; // insect plateau
    else bio = 35 + Math.random() * 15;

    const data = 120 + Math.sin(h / 24 * Math.PI * 2) * 40 + Math.random() * 20;
    hours.push({ hour: label, bioAcoustics: Math.round(bio), dataTransfer: Math.round(data) });
  }
  return hours;
};

const telemetryData = generate24hData();

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

/* ─── Custom Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-xl p-3 shadow-lg text-xs space-y-1.5">
      <p className="font-semibold text-foreground font-sans">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground font-sans">{p.name}:</span>
          <span className="font-mono font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const LorealMRVDashboard = () => {
  /* ─── Live KPI fluctuation state ─── */
  const [soilMoisture, setSoilMoisture] = useState(42.1);
  const [acousticScore, setAcousticScore] = useState(88);
  const [coopHours, setCoopHours] = useState(1200);

  /* ─── Scanning line for the chart ─── */
  const [scanHour, setScanHour] = useState(() => new Date().getHours());

  const fluctuate = useCallback(() => {
    setSoilMoisture(+(41.8 + Math.random() * 0.8).toFixed(1));
    setAcousticScore(Math.floor(86 + Math.random() * 4));
    setCoopHours(Math.floor(1180 + Math.random() * 40));
  }, []);

  useEffect(() => {
    const id = setInterval(fluctuate, 3500);
    return () => clearInterval(id);
  }, [fluctuate]);

  useEffect(() => {
    const id = setInterval(() => {
      setScanHour((h) => (h + 1) % 24);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const mrvKPIs = [
    {
      title: "Ecosystem MRV Tracker",
      numericValue: soilMoisture,
      displaySuffix: "% Soil Moisture",
      subtitle: "Continuous telemetry on soil moisture & carbon across Shea/Argan cooperatives",
      icon: Leaf,
      trend: "24/7 Streaming",
      prefix: "",
    },
    {
      title: "Biodiversity Acoustic Score",
      numericValue: acousticScore,
      displaySuffix: "/100",
      subtitle: "AI-verified ecosystem health (Flora & Fauna return)",
      icon: AudioLines,
      trend: "+14 pts YoY",
      prefix: "",
    },
    {
      title: "Women's Cooperative Inclusion",
      numericValue: coopHours,
      displaySuffix: " Hours",
      subtitle: "Of Starlink connectivity and public lighting provided to harvesters",
      icon: Users,
      trend: "+320 hrs vs Q3",
      prefix: "",
    },
  ];

  const scanLabel = `${scanHour.toString().padStart(2, "0")}:00`;

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

      {/* ─── Row 1: MRV & Social Impact KPI Cards (Live) ─── */}
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
                    className="p-2 rounded-lg relative"
                    style={{
                      backgroundColor: `hsla(${gold.accent}, 0.08)`,
                      boxShadow: `inset 0 0 0 1px hsla(${gold.accent}, 0.2)`,
                    }}
                  >
                    <kpi.icon className="h-4 w-4" style={{ color: `hsl(${gold.accent})` }} />
                    {/* Live pulse dot */}
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "hsl(var(--ods-teal))", boxShadow: "0 0 6px hsl(var(--ods-teal) / 0.6)" }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold text-foreground font-mono tracking-tight">
                  <AnimatedCounter value={kpi.numericValue} duration={0.4} />
                  <span className="text-lg text-muted-foreground font-sans font-medium ml-1">
                    {kpi.displaySuffix}
                  </span>
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

      {/* ─── Row 1.5: 24-Hour Ecosystem Telemetry Chart ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, hsl(var(--ods-green)), hsl(var(--ods-teal)), hsl(${gold.accent}))`,
            }}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base">
                  24-Hour Ecosystem Activity
                </CardTitle>
                <CardDescription className="text-xs font-sans">
                  Bio-Acoustics & Data Transfer — live scanning
                </CardDescription>
              </div>
              <div className="flex gap-4 text-[10px] font-sans">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: "hsl(var(--ods-green))" }} /> Bio-Acoustic Index
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-3 h-[3px] rounded-full" style={{ backgroundColor: `hsl(${gold.accent})` }} /> Data Transfer (MB)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={telemetryData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradData" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`hsl(${gold.accent})`} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={`hsl(${gold.accent})`} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine
                  x={scanLabel}
                  stroke="hsl(var(--ods-teal))"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  label={{
                    value: "NOW",
                    position: "top",
                    fill: "hsl(178, 65%, 42%)",
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bioAcoustics"
                  name="Bio-Acoustics"
                  stroke="hsl(152, 60%, 42%)"
                  strokeWidth={2}
                  fill="url(#gradBio)"
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(152, 60%, 42%)", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="dataTransfer"
                  name="Data Transfer"
                  stroke={`hsl(${gold.accent})`}
                  strokeWidth={1.5}
                  fill="url(#gradData)"
                  dot={false}
                  activeDot={{ r: 4, fill: `hsl(${gold.accent})`, stroke: "hsl(var(--card))", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

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

      {/* ─── Row 2.1: Trust Moat Integrity KPIs ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Hardware-Verified Data Ratio — radial */}
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, hsl(${gold.accent}), hsl(var(--ods-teal)))` }}
          />
          <CardContent className="p-5 flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(210, 20%, 92%)" strokeWidth="9" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={`hsl(${gold.accent})`}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.94) }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono text-foreground">94%</span>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Radar className="h-3.5 w-3.5" style={{ color: `hsl(${gold.accent})` }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                    Trust Moat KPI
                  </span>
                </div>
                <HoverCard openDelay={100} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      aria-label="How is this calculated?"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="left" align="start" className="w-80 text-xs space-y-2.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Calculation Inputs</p>
                      <p className="font-semibold text-foreground mt-0.5">Hardware-Verified Data Ratio</p>
                    </div>
                    <div className="font-mono text-[11px] bg-secondary/60 border border-border rounded p-2 leading-relaxed">
                      ratio = telemetry_events / (telemetry_events + manual_entries)
                    </div>
                    <ul className="space-y-1.5 text-muted-foreground leading-relaxed">
                      <li><span className="text-foreground font-semibold">Telemetry source:</span> ELISA edge sensors (solar yield, battery, Wi-Fi, GPS) signed on-device.</li>
                      <li><span className="text-foreground font-semibold">Verification method:</span> Ed25519 cryptographic signatures verified at ingest; SHA-256 hash anchored to immutable ledger.</li>
                      <li><span className="text-foreground font-semibold">Ownership model:</span> Hardware secret held by community steward — sponsor cannot mint or alter readings.</li>
                      <li><span className="text-foreground font-semibold">Manual portion (6%):</span> Worker Voice surveys + auditor field notes, flagged as off-chain.</li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <h4 className="text-sm font-semibold text-foreground">Hardware-Verified Data Ratio</h4>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                IoT Telemetry vs. Manual Reporting — cryptographic proof from edge sensors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Zero-Vandalism Rate */}
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, hsl(var(--ods-green)), hsl(var(--ods-teal)))` }}
          />
          <CardContent className="p-5 flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(210, 20%, 92%)" strokeWidth="9" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(152, 60%, 42%)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono text-foreground">100%</span>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "hsl(152, 60%, 42%)" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                    Trust Moat KPI
                  </span>
                </div>
                <HoverCard openDelay={100} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      aria-label="How is this calculated?"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent side="left" align="start" className="w-80 text-xs space-y-2.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Calculation Inputs</p>
                      <p className="font-semibold text-foreground mt-0.5">Zero-Vandalism Rate</p>
                    </div>
                    <div className="font-mono text-[11px] bg-secondary/60 border border-border rounded p-2 leading-relaxed">
                      rate = 1 − (tamper_events / deployed_nodes) over rolling 90d
                    </div>
                    <ul className="space-y-1.5 text-muted-foreground leading-relaxed">
                      <li><span className="text-foreground font-semibold">Telemetry source:</span> Accelerometer + enclosure-breach reed switch + GPS displacement &gt; 5m on each ELISA pole.</li>
                      <li><span className="text-foreground font-semibold">Verification method:</span> Multi-sensor consensus (2-of-3) auto-files an incident; cross-checked against community steward sign-off.</li>
                      <li><span className="text-foreground font-semibold">Ownership model:</span> Community Stewardship — each node is co-owned by the local cooperative, who receives $LITRO yield for uptime, aligning incentives against tampering.</li>
                      <li><span className="text-foreground font-semibold">Scope:</span> 100% of deployed nodes across Brazil (Açaí), Indonesia (Palm) and West Africa (Shea) supply sheds.</li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <h4 className="text-sm font-semibold text-foreground">Zero-Vandalism Rate</h4>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Secured via Community Ownership Model — local stewardship of every node.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Row 2.2: SFDR & EU Taxonomy Compliance Matrix ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, hsl(217, 91%, 35%), hsl(${gold.accent}))` }}
          />
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base">Regulatory Compliance Engine (CSRD & SFDR)</CardTitle>
                <CardDescription className="text-xs font-sans">
                  Principal Adverse Impact (PAI) indicators and EU Taxonomy alignment, sourced directly from telemetry.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold font-sans"
                style={{ borderColor: `hsla(${gold.accent}, 0.25)`, color: `hsl(${gold.accent})` }}
              >
                ESMA · EFRAG Aligned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* EU Taxonomy progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground font-sans">
                  EU Taxonomy Alignment Rate
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  92% <span className="opacity-60">(Target &gt; 85%)</span>
                </span>
              </div>
              <Progress value={92} className="h-2 bg-secondary" />
            </div>

            {/* PAI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { code: "PAI 4", title: "Biodiversity-sensitive areas", status: "Active Monitoring" },
                { code: "PAI 9", title: "Human Rights Due Diligence", status: "Verified" },
                { code: "PAI 13", title: "Living Wage Gaps", status: "Tracking via Worker Voice" },
              ].map((pai) => (
                <div
                  key={pai.code}
                  className="p-4 rounded-lg border border-border/60 bg-secondary/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest font-mono text-muted-foreground">
                      {pai.code}
                    </span>
                    <Badge
                      className="text-[9px] font-semibold tracking-wide font-sans border"
                      style={{
                        backgroundColor: "hsla(152, 60%, 42%, 0.1)",
                        color: "hsl(152, 60%, 32%)",
                        borderColor: "hsla(152, 60%, 42%, 0.3)",
                      }}
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                      Compliant / Active
                    </Badge>
                  </div>
                  <h5 className="text-sm font-semibold text-foreground leading-snug">{pai.title}</h5>
                  <p className="text-[11px] text-muted-foreground font-sans">{pai.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Row 2.3: Local Worker Voice & Digital Inclusion ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Card className="border-border overflow-hidden">
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, hsl(var(--ods-teal)), hsl(${gold.accent}))` }}
          />
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `hsla(${gold.accent}, 0.08)`,
                    boxShadow: `inset 0 0 0 1px hsla(${gold.accent}, 0.2)`,
                  }}
                >
                  <Wifi className="h-4 w-4" style={{ color: `hsl(${gold.accent})` }} />
                </div>
                <div>
                  <CardTitle className="text-base">Local Worker Voice & Digital Inclusion</CardTitle>
                  <CardDescription className="text-xs font-sans">
                    Anonymous inputs collected via ELISA node Wi-Fi captive portals across the supply chain.
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold font-sans"
                style={{ borderColor: "hsla(178, 65%, 42%, 0.3)", color: "hsl(178, 65%, 32%)" }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: "hsl(178, 65%, 42%)" }} />
                Live Captive Portal Feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-widest">Location</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest">Metric</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    loc: "Burkina Faso (Shea Coop)",
                    icon: Scale,
                    metric: "Living Wage Survey",
                    status: "100% Above Poverty Line",
                  },
                  {
                    loc: "Indonesia (Palm)",
                    icon: ShieldCheck,
                    metric: "Grievance Mechanism",
                    status: "0 Reports (Zero Risk)",
                  },
                ].map((row) => (
                  <TableRow key={row.loc}>
                    <TableCell className="font-sans text-sm font-medium">{row.loc}</TableCell>
                    <TableCell className="font-sans text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <row.icon className="h-3.5 w-3.5" style={{ color: `hsl(${gold.accent})` }} />
                        {row.metric}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className="text-[10px] font-semibold font-sans border"
                        style={{
                          backgroundColor: "hsla(152, 60%, 42%, 0.1)",
                          color: "hsl(152, 60%, 32%)",
                          borderColor: "hsla(152, 60%, 42%, 0.3)",
                        }}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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

      {/* ─── Row 4: Digital Product Passport CTA ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card
          className="border-border overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, hsla(${gold.charcoal}, 1) 0%, hsla(220, 14%, 12%, 1) 100%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(${gold.accent}) 1px, transparent 0)`,
              backgroundSize: "18px 18px",
            }}
          />
          <CardContent className="relative p-6 flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `hsla(${gold.accent}, 0.12)`,
                  boxShadow: `inset 0 0 0 1px hsla(${gold.accent}, 0.3)`,
                }}
              >
                <FileBadge className="h-5 w-5" style={{ color: `hsl(${gold.accent})` }} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">
                  Digital Product Passport (DPP) Integration
                </h4>
                <p className="text-xs font-sans mt-0.5" style={{ color: "hsl(220, 8%, 70%)" }}>
                  EU Green Claims Directive Ready · Cryptographic provenance from sensor to SKU
                </p>
              </div>
            </div>
            <Button
              className="font-sans font-semibold tracking-wide border"
              style={{
                backgroundColor: `hsl(${gold.accent})`,
                color: `hsl(${gold.charcoal})`,
                borderColor: `hsla(${gold.accent}, 0.6)`,
                boxShadow: `0 0 24px hsla(${gold.accent}, 0.35)`,
              }}
            >
              <FileBadge className="h-4 w-4 mr-1" />
              Export Data to Digital Product Passport
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LorealMRVDashboard;
