import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Wifi, Globe, BarChart3, Shield, Users, ChevronRight, X, Cpu, MapPin, ShieldCheck, FileText, ExternalLink, Satellite } from "lucide-react";
import logoHorizontal from "@/assets/logo-horizontal.png";

const stats = [
  { value: 7000, prefix: "", suffix: "+", label: "ELISAs Installed" },
  { value: 35, prefix: "", suffix: "", label: "Countries" },
  { value: 550728, prefix: "", suffix: "+", label: "Beneficiaries" },
  { value: 12, prefix: "$", suffix: "M+", label: "ESG Value Generated" },
];

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const sponsors = ["AB-InBev", "Nestlé", "Google", "PepsiCo", "Unilever", "Coca-Cola"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

type TelemetryMetric = {
  title: string;
  baseValue: number;
  unit: string;
  subtext: string;
  format: (n: number) => string;
  jitter: number;
  min?: number;
  max?: number;
};

function LiveTelemetryCard({ metric, seed }: { metric: TelemetryMetric; seed: number }) {
  const [value, setValue] = useState(metric.baseValue);
  const [packets, setPackets] = useState(1240 + seed * 137);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 2 * metric.jitter;
      let next = metric.baseValue + delta;
      if (metric.min !== undefined) next = Math.max(metric.min, next);
      if (metric.max !== undefined) next = Math.min(metric.max, next);
      setValue(next);
      setPackets((p) => p + Math.floor(Math.random() * 4) + 1);
      setTick((t) => t + 1);
    }, 10000 + seed * 400);
    return () => clearInterval(interval);
  }, [metric.baseValue, metric.jitter, metric.min, metric.max, seed]);

  return (
    <Card className="relative overflow-hidden p-5 bg-card/60 backdrop-blur-md border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(142,70%,45%)] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(142,70%,45%)] shadow-[0_0_8px_hsl(142,70%,45%)]" />
          </span>
          <h4 className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            {metric.title}
          </h4>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/70 tabular-nums">
          {packets.toLocaleString()} pkts
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2 font-serif">
        <motion.span
          key={tick}
          initial={{ opacity: 0.4, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight tabular-nums"
        >
          {metric.format(value)}
        </motion.span>
        <span className="text-xs text-muted-foreground font-sans font-medium">
          {metric.unit}
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground font-sans mb-3">
        {metric.subtext}
      </p>

      <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-border/40">
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[hsl(142,70%,45%)] to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 2.4 + seed * 0.3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </Card>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoHorizontal} alt="Litro de Luz" className="h-8 object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#exchange" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">The Exchange</a>
            <a href="#metrics" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">ESG Metrics</a>
            <a href="#impact" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">Global Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="text-xs gap-1 bg-gradient-to-r from-primary to-[hsl(178,65%,42%)] hover:from-primary/90 hover:to-[hsl(178,65%,42%)]/90 text-primary-foreground" onClick={() => navigate("/loreal")}>
              Enter Impact Exchange <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(205,40%,96%)] to-[hsl(178,25%,94%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,hsl(205_85%_42%/0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_60%,hsl(178_65%_42%/0.05),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(215 25% 17% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(215 25% 17% / 0.08) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_15px_hsl(var(--primary)/0.15)]">
                <Satellite className="h-3.5 w-3.5" />
                Powered by DePIN & IoT Telemetry
              </span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-7xl font-extrabold leading-[1.05] tracking-tight mb-7 font-serif"
            >
              The World's First{" "}
              <span className="text-gradient-gold">Impact Intelligence</span>{" "}
              Platform for the Last Mile.
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-[1.8] mx-auto lg:mx-0 font-sans"
            >
              We transform rugged solar infrastructure and satellite connectivity into immutable, AI-audited ESG data.
              No estimations. Just cryptographic <span className="font-semibold text-foreground">Proof of Physical Work</span>.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="gap-2 text-sm px-8 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all"
                onClick={() => navigate("/loreal")}
              >
                Deploy a Corporate Cluster <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-sm px-8 border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                onClick={() => navigate("/whitepaper")}
              >
                Read the $LITRO Tokenomics <ExternalLink className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3.5}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {([
                {
                  title: "Live Biodiversity Score",
                  baseValue: 88,
                  unit: "/ 100",
                  subtext: "AI-acoustic fauna monitoring in Shea & Argan ecosystems.",
                  format: (n: number) => n.toFixed(1),
                  jitter: 0.4,
                  min: 86,
                  max: 90,
                },
                {
                  title: "Ethical Sourcing Hubs",
                  baseValue: 100,
                  unit: "Verified",
                  subtext: "Women's cooperatives connected with Local Worker Voice telemetry.",
                  format: (n: number) => `${n.toFixed(1)}%`,
                  jitter: 0.05,
                  min: 99.8,
                  max: 100,
                },
                {
                  title: "DePIN Network Status",
                  baseValue: 94,
                  unit: "Hardware Verified",
                  subtext: "0% vandalism. Secured via community ownership and cryptographic attestation.",
                  format: (n: number) => `${n.toFixed(1)}%`,
                  jitter: 0.3,
                  min: 93.5,
                  max: 94.8,
                },
              ] as TelemetryMetric[]).map((m, i) => (
                <LiveTelemetryCard key={m.title} metric={m} seed={i} />
              ))}
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="mt-14 pt-8 border-t border-border/30"
            >
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Auditable metrics aligned with
                </span>
                {["CSRD", "GRI", "GHG Protocol"].map((std) => (
                  <span key={std} className="text-[10px] font-mono font-semibold text-primary/80 border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
                    {std}
                  </span>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-5 font-sans">
                Trusted by global leaders to illuminate the last mile
              </p>
              <div className="flex flex-wrap items-center gap-6 md:gap-10 justify-center lg:justify-start">
                {sponsors.map((name) => (
                  <span key={name} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors tracking-wide select-none font-sans">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ELISA® NODE ACRONYM SPEC ─── */}
      <section className="relative py-20 border-t border-border/40 bg-[hsl(210,35%,97%)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] [background-image:linear-gradient(hsl(var(--primary))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary))_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} custom={0}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-primary/80 border border-primary/20 rounded-full px-3 py-1 bg-primary/5 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Hardware Specification
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif">
                Powered by <span className="text-gradient-primary">ELISA® Nodes</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-xl font-sans">
                Our proprietary Decentralized Physical Infrastructure Network (DePIN) — purpose-built for verifiable, last-mile sustainability telemetry.
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <span className="h-px w-8 bg-border" />
              Spec Sheet · Rev. 4.2
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} custom={1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border/60 border border-border/60 rounded-xl overflow-hidden shadow-sm"
          >
            {[
              { letter: "E", title: "Edge Verified", desc: "Process data locally at the source, preventing manipulation." },
              { letter: "L", title: "Ledgered", desc: "Tied to an immutable blockchain record." },
              { letter: "I", title: "Inclusive Infrastructure", desc: "Providing light & internet to marginalized communities." },
              { letter: "S", title: "Supply Chain Scope", desc: "Built specifically to monitor Tier 2/3 remote origins." },
              { letter: "A", title: "Auditable & Autonomous", desc: "Self-sustaining energy, generating zero-touch reporting." },
            ].map((item, i) => (
              <motion.div
                key={item.letter}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="group relative bg-card p-6 flex flex-col hover:bg-[hsl(210,40%,98%)] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-6xl leading-none text-gradient-primary font-bold">
                    {item.letter}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    0{i + 1}
                  </span>
                </div>
                <div className="h-px w-8 bg-primary/40 mb-3 group-hover:w-12 transition-all" />
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-sans tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-6 flex flex-wrap items-center justify-center lg:justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>ISO 27001 · GDPR · SOC 2 aligned firmware</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Solar-powered · LoRaWAN + 4G fallback · Tamper-evident enclosure</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── COMPETITIVE ADVANTAGE ─── */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-serif">
              The Litro de Luz Advantage: <span className="text-gradient-primary">Physical Impact, Digital Proof.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-sans">
              Bridging the gap between grassroots field execution and enterprise-grade ESG compliance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              {
                icon: Cpu,
                title: "Proprietary Edge-IoT & Satellite Infrastructure",
                text: "We deploy military-grade (IP67) solar poles equipped with proprietary MPPT microcontrollers and Starlink connectivity. Autonomous data-mining nodes capable of surviving the world's harshest environments.",
                color: "text-primary",
              },
              {
                icon: MapPin,
                title: "Unmatched Last-Mile Deployment Capabilities",
                text: "Our operational DNA allows us to physically deploy and maintain infrastructure in the most isolated, off-grid regions of your global supply chain, bridging the physical-to-digital gap.",
                color: "text-[hsl(var(--ods-teal))]",
              },
              {
                icon: ShieldCheck,
                title: "Community Trust & Social License to Operate",
                text: "Our proven grassroots methodology ensures zero vandalism and 100% community adoption. By co-creating solutions, we secure the physical assets and guarantee long-term social impact.",
                color: "text-[hsl(var(--ods-green))]",
              },
              {
                icon: FileText,
                title: "Immutable ESG Data & Zero Greenwashing",
                text: "Our Impact Exchange platform provides real-time, AI-audited ESG metrics aligned with CSRD, GRI, and GHG standards, eliminating reliance on manual reporting.",
                color: "text-[hsl(var(--ods-orange))]",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-elevated rounded-xl p-7 group hover:glow-blue hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-5 group-hover:bg-primary/15 transition-colors">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-3 leading-snug font-serif">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 border-t border-border/30 bg-ods-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-serif">
              From Field to <span className="text-gradient-primary">Financial Instrument</span> in 4 Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-sans">
              Our end-to-end pipeline transforms physical solar infrastructure into auditable, tradeable ESG assets.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {[
              {
                step: "01",
                icon: MapPin,
                title: "Deploy",
                subtitle: "Physical Installation",
                text: "We deploy ruggedized ELISA solar poles with IoT sensors and Starlink connectivity in last-mile communities across your supply chain.",
              },
              {
                step: "02",
                icon: Cpu,
                title: "Mine",
                subtitle: "Continuous Data Collection",
                text: "Each pole autonomously mines environmental and social data — kWh generated, CO₂ avoided, WiFi sessions, light-hours — 24/7/365.",
              },
              {
                step: "03",
                icon: Shield,
                title: "Audit",
                subtitle: "AI-Powered Verification",
                text: "Our AI engine cross-references telemetry against GRI, CSRD, and GHG frameworks, producing cryptographic Proof of Physical Work.",
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Report",
                subtitle: "Compliance-Ready Output",
                text: "Export immutable ESG reports, XBRL digital tags, and carbon credit documentation ready for third-party assurance firms.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative text-center group"
              >
                <div className="relative z-10 mx-auto w-14 h-14 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center mb-5 group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all duration-300">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest mb-1 block">Step {item.step}</span>
                <h3 className="text-lg font-bold text-foreground mb-1 font-serif">{item.title}</h3>
                <p className="text-[11px] font-medium text-primary/70 mb-3 font-sans">{item.subtitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRACTION BAR ─── */}
      <section id="impact" className="relative border-y border-border/50 bg-ods-gradient">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={2.2} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-sans">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="border-t border-border/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-[10px] text-center uppercase tracking-[0.25em] text-muted-foreground mb-6 font-sans">Trusted by Global Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {sponsors.map((name) => (
                <span key={name} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-wide font-sans">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE EXCHANGE / VALUE PROP ─── */}
      <section id="exchange" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-serif">
              From Philanthropy to <span className="text-gradient-primary">Investment</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm font-sans">A paradigm shift in how the world funds sustainable infrastructure.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="rounded-xl border border-border bg-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-bl-full" />
              <span className="text-[10px] uppercase tracking-widest text-destructive font-medium mb-4 block font-sans">The Old Way</span>
              <h3 className="text-lg font-bold text-foreground mb-3 font-serif">Traditional Philanthropy</h3>
              <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Social projects rely on limited donation budgets</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> No measurable ROI for corporate sponsors</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Manual reporting, no real-time visibility</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Creates dependency, not sustainability</li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="rounded-xl border border-primary/30 bg-card p-8 relative overflow-hidden glow-blue">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
              <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-4 block font-sans">The Litro de Luz Way</span>
              <h3 className="text-lg font-bold text-foreground mb-3 font-serif">Impact as Infrastructure</h3>
              <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                <li className="flex gap-2"><Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Communities get free light, internet & energy</li>
                <li className="flex gap-2"><BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Verified ESG impact with automated reporting</li>
                <li className="flex gap-2"><Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Real-time telemetry from 7,000+ ELISA units</li>
                <li className="flex gap-2"><Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Scope 3 CO₂ reductions as financial assets</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ESG METRICS PREVIEW ─── */}
      <section id="metrics" className="py-24 border-t border-border/30 bg-ods-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-serif">
              Enterprise-Grade <span className="text-gradient-primary">ESG Metrics</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm font-sans">Every kWh, every WiFi connection, every gram of CO₂ avoided — measured, verified, and reported in real time.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Energy Generation", value: "1.2M kWh", desc: "Clean solar energy produced annually", color: "text-ods-teal" },
              { icon: Globe, title: "Carbon Avoided", value: "504K kg", desc: "Scope 3 CO₂ emissions reduced", color: "text-ods-green" },
              { icon: Wifi, title: "Digital Access", value: "2.3M", desc: "WiFi sessions enabling connectivity", color: "text-primary" },
              { icon: Users, title: "Lives Impacted", value: "550K+", desc: "Beneficiaries across communities", color: "text-ods-orange" },
            ].map((card, i) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card-elevated rounded-xl p-6 group hover:glow-blue transition-shadow duration-300">
                <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/15 transition-colors">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mb-1">{card.value}</div>
                <div className="text-xs font-medium text-foreground mb-1 font-sans">{card.title}</div>
                <div className="text-[11px] text-muted-foreground font-sans">{card.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 border-t border-border/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-serif">
              Ready to Turn Impact into <span className="text-gradient-primary">Investment?</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto font-sans">
              Join the world's leading brands using the Impact Exchange to transform ESG compliance into measurable social infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 text-sm px-8 bg-gradient-to-r from-primary to-[hsl(178,65%,42%)] hover:from-primary/90 hover:to-[hsl(178,65%,42%)]/90 text-primary-foreground" onClick={() => navigate("/loreal")}>
                View Live Demo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-sm px-8 border-border" onClick={() => document.getElementById("exchange")?.scrollIntoView({ behavior: "smooth" })}>
                Learn More <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/30 py-12 bg-ods-gradient">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logoHorizontal} alt="Litro de Luz" className="h-6 object-contain" />
            <span className="text-xs font-semibold text-foreground font-sans">Impact Exchange</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-sans">© {new Date().getFullYear()} Litro de Luz Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
