import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Recycle, Wifi, HardDrive, Users, Moon, Lightbulb, Heart } from "lucide-react";
import { ESGFocus, FocusKPI } from "@/data/esgFocusData";
import AnimatedCounter from "./AnimatedCounter";

const FOCUS_ICONS: Record<ESGFocus, typeof Flame[]> = {
  carbon_climate: [Flame, Droplets, Recycle],
  digital_inclusion: [Wifi, HardDrive, Users],
  community_safety: [Moon, Lightbulb, Heart],
};

const FOCUS_COLORS: Record<ESGFocus, string[]> = {
  carbon_climate: [
    "from-emerald-500/20 to-emerald-900/10 border-emerald-500/20",
    "from-teal-500/20 to-teal-900/10 border-teal-500/20",
    "from-cyan-500/20 to-cyan-900/10 border-cyan-500/20",
  ],
  digital_inclusion: [
    "from-blue-500/20 to-blue-900/10 border-blue-500/20",
    "from-violet-500/20 to-violet-900/10 border-violet-500/20",
    "from-indigo-500/20 to-indigo-900/10 border-indigo-500/20",
  ],
  community_safety: [
    "from-amber-500/20 to-amber-900/10 border-amber-500/20",
    "from-orange-500/20 to-orange-900/10 border-orange-500/20",
    "from-yellow-500/20 to-yellow-900/10 border-yellow-500/20",
  ],
};

const ICON_COLORS: Record<ESGFocus, string[]> = {
  carbon_climate: ["text-emerald-400", "text-teal-400", "text-cyan-400"],
  digital_inclusion: ["text-blue-400", "text-violet-400", "text-indigo-400"],
  community_safety: ["text-amber-400", "text-orange-400", "text-yellow-400"],
};

interface DynamicESGKPICardsProps {
  focus: ESGFocus;
  kpis: FocusKPI[];
}

const DynamicESGKPICards = ({ focus, kpis }: DynamicESGKPICardsProps) => {
  const icons = FOCUS_ICONS[focus];
  const colors = FOCUS_COLORS[focus];
  const iconColors = ICON_COLORS[focus];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnimatePresence mode="wait">
        {kpis.map((kpi, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={`${focus}-${i}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colors[i]} p-6`}
            >
              {/* Background glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {kpi.title}
                  </span>
                  <div className="p-2.5 rounded-lg bg-secondary/60 border border-border/50">
                    <Icon className={`h-5 w-5 ${iconColors[i]}`} />
                  </div>
                </div>

                <div className="text-3xl font-bold text-foreground font-mono tracking-tight mb-1">
                  {kpi.value}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{kpi.subtitle}</span>
                  <span className={`text-xs font-semibold ${kpi.trendUp ? "text-primary" : "text-destructive"}`}>
                    {kpi.trendUp ? "↑" : "↓"} {kpi.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DynamicESGKPICards;
