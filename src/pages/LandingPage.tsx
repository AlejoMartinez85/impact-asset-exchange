import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, ArrowRight, Zap, Wifi, Globe, BarChart3, Shield, Users, ChevronRight, X } from "lucide-react";
import heroImage from "@/assets/hero-grid.jpg";

const stats = [
  { value: "7,000+", label: "ELISAs Installed" },
  { value: "35", label: "Countries" },
  { value: "550,728+", label: "Beneficiaries" },
  { value: "$12M+", label: "ESG Value Generated" },
];

const sponsors = ["AB-InBev", "Nestlé", "Google", "PepsiCo", "Unilever", "Coca-Cola"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sun className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              Litro de Luz <span className="text-primary">Impact Exchange</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#exchange" className="text-xs text-muted-foreground hover:text-foreground transition-colors">The Exchange</a>
            <a href="#metrics" className="text-xs text-muted-foreground hover:text-foreground transition-colors">ESG Metrics</a>
            <a href="#impact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Global Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="text-xs gap-1" onClick={() => navigate("/dashboard")}>
              Enter Impact Exchange <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Global solar infrastructure network" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live ESG Infrastructure
              </span>
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
            >
              Turn Sunlight into a{" "}
              <span className="text-gradient-primary">Verified Financial Asset.</span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            >
              We don't just audit ESG metrics. We build the physical infrastructure
              turning sustainability into tangible human progress.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="gap-2 text-sm px-8" onClick={() => navigate("/dashboard")}>
                Enter Impact Exchange <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-sm px-8 border-border" onClick={() => document.getElementById("exchange")?.scrollIntoView({ behavior: "smooth" })}>
                Explore the Ecosystem <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ─── TRACTION BAR ─── */}
      <section id="impact" className="relative border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="border-t border-border/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-[10px] text-center uppercase tracking-[0.25em] text-muted-foreground mb-6">Trusted by Global Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {sponsors.map((name) => (
                <span key={name} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-wide">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE EXCHANGE / VALUE PROP ─── */}
      <section id="exchange" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              From Philanthropy to <span className="text-gradient-primary">Investment</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">A paradigm shift in how the world funds sustainable infrastructure.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="rounded-xl border border-border bg-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-bl-full" />
              <span className="text-[10px] uppercase tracking-widest text-destructive font-medium mb-4 block">The Old Way</span>
              <h3 className="text-lg font-bold text-foreground mb-3">Traditional Philanthropy</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Social projects rely on limited donation budgets</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> No measurable ROI for corporate sponsors</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Manual reporting, no real-time visibility</li>
                <li className="flex gap-2"><X className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> Creates dependency, not sustainability</li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="rounded-xl border border-primary/30 bg-card p-8 relative overflow-hidden glow-green">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
              <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-4 block">The Litro de Luz Way</span>
              <h3 className="text-lg font-bold text-foreground mb-3">Impact as Infrastructure</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
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
      <section id="metrics" className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Enterprise-Grade <span className="text-gradient-primary">ESG Metrics</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Every kWh, every WiFi connection, every gram of CO₂ avoided — measured, verified, and reported in real time.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Energy Generation", value: "1.2M kWh", desc: "Clean solar energy produced annually" },
              { icon: Globe, title: "Carbon Avoided", value: "504K kg", desc: "Scope 3 CO₂ emissions reduced" },
              { icon: Wifi, title: "Digital Access", value: "2.3M", desc: "WiFi sessions enabling connectivity" },
              { icon: Users, title: "Lives Impacted", value: "550K+", desc: "Beneficiaries across communities" },
            ].map((card, i) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card-elevated rounded-xl p-6 group hover:glow-green transition-shadow duration-300">
                <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mb-1">{card.value}</div>
                <div className="text-xs font-medium text-foreground mb-1">{card.title}</div>
                <div className="text-[11px] text-muted-foreground">{card.desc}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to Turn Impact into <span className="text-gradient-primary">Investment?</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
              Join the world's leading brands using the Impact Exchange to transform ESG compliance into measurable social infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2 text-sm px-8" onClick={() => navigate("/dashboard")}>
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
      <footer className="border-t border-border/30 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Litro de Luz Impact Exchange</span>
          </div>
          <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} Litro de Luz Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
