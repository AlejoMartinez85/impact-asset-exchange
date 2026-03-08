import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Sun, ArrowRight, Lock, Mail, Zap, Wifi, Globe, BarChart3, Shield, Users, ChevronRight, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
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
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setLoginOpen(false);
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setLoading(false);
    if (error) toast.error(error instanceof Error ? error.message : "Google sign-in failed");
  };

  const handleMagicLink = async () => {
    if (!email) { toast.error("Enter your email first"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Check your inbox for the login link");
  };

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
            <Button variant="outline" size="sm" className="border-border text-foreground text-xs" onClick={() => setLoginOpen(true)}>
              Login
            </Button>
            <Button size="sm" className="text-xs gap-1">
              Request Access <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 min-h-screen flex items-center">
        {/* Background */}
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
              <Button size="lg" className="gap-2 text-sm px-8" onClick={() => document.getElementById("exchange")?.scrollIntoView({ behavior: "smooth" })}>
                Explore the Ecosystem <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-sm px-8 border-border" onClick={() => setLoginOpen(true)}>
                <Lock className="h-4 w-4" /> Corporate Login
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ─── TRACTION BAR ─── */}
      <section id="impact" className="relative border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sponsor logos */}
        <div className="border-t border-border/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-[10px] text-center uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Trusted by Global Leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {sponsors.map((name) => (
                <span key={name} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors tracking-wide">
                  {name}
                </span>
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
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              A paradigm shift in how the world funds sustainable infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Old Way */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="rounded-xl border border-border bg-card p-8 relative overflow-hidden group"
            >
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

            {/* New Way */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="rounded-xl border border-primary/30 bg-card p-8 relative overflow-hidden group glow-green"
            >
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
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Every kWh, every WiFi connection, every gram of CO₂ avoided — measured, verified, and reported in real time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Energy Generation", value: "1.2M kWh", desc: "Clean solar energy produced annually" },
              { icon: Globe, title: "Carbon Avoided", value: "504K kg", desc: "Scope 3 CO₂ emissions reduced" },
              { icon: Wifi, title: "Digital Access", value: "2.3M", desc: "WiFi sessions enabling connectivity" },
              { icon: Users, title: "Lives Impacted", value: "550K+", desc: "Beneficiaries across communities" },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="card-elevated rounded-xl p-6 group hover:glow-green transition-shadow duration-300"
              >
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
              <Button size="lg" className="gap-2 text-sm px-8">
                Request a Demo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-sm px-8 border-border" onClick={() => setLoginOpen(true)}>
                Corporate Login
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
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Litro de Luz Global. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ─── LOGIN MODAL ─── */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">Corporate Login</DialogTitle>
            <p className="text-xs text-muted-foreground">Secure access to your ESG dashboard</p>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Google SSO */}
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary gap-2" onClick={handleGoogle} disabled={loading}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google (SSO)
            </Button>

            <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary gap-2 text-xs" onClick={handleMagicLink} disabled={loading || !email}>
              <Mail className="h-4 w-4" />
              Send Magic Link
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">or</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Corporate Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary border-border" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-secondary border-border" required />
                </div>
              </div>
              <div className="text-right">
                <a href="/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">Forgot password?</a>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </form>

            <p className="text-[10px] text-center text-muted-foreground">
              Access is invite-only. <a href="mailto:partners@litrodeluz.org" className="text-primary hover:underline">Contact us</a> for credentials.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
