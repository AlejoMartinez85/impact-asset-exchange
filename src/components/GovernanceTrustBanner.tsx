import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

const GovernanceTrustBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-[hsl(205,40%,96%)] via-card to-[hsl(178,30%,96%)] p-6"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--foreground)) 0, hsl(var(--foreground)) 1px, transparent 0, transparent 50%)`,
        backgroundSize: "12px 12px",
      }} />

      <div className="relative z-10 flex items-center gap-6 flex-wrap">
        {/* Shield icon cluster */}
        <div className="flex-shrink-0 relative">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Lock className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground tracking-tight font-sans">
              Data Integrity & Governance
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-ods-teal bg-[hsl(178,65%,42%)]/10 px-2 py-0.5 rounded-full border border-[hsl(178,65%,42%)]/20 font-sans">
              <CheckCircle2 className="h-2.5 w-2.5" />
              100% IoT Verified
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl font-sans">
            All telemetry data is generated directly by ELISA® edge-hardware nodes via immutable protocols.
            Zero manual data entry. Audit-ready for GRI, SASB, and TCFD compliance.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex-shrink-0 hidden lg:flex items-center gap-4">
          {["GRI", "SASB", "TCFD"].map((standard) => (
            <div
              key={standard}
              className="px-3 py-1.5 rounded-md border border-border bg-secondary/50 text-[10px] font-mono font-semibold text-muted-foreground tracking-wider"
            >
              {standard}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GovernanceTrustBanner;
