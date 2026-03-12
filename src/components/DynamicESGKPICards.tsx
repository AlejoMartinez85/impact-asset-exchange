import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Recycle, Wifi, HardDrive, Users, Moon, Lightbulb, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ESGFocus, FocusKPI } from "@/data/esgFocusData";
import AnimatedCounter from "./AnimatedCounter";

const FOCUS_ICONS: Record<ESGFocus, typeof Flame[]> = {
  carbon_climate: [Flame, Droplets, Recycle],
  digital_inclusion: [Wifi, HardDrive, Users],
  community_safety: [Moon, Lightbulb, Heart],
};

/* ODS-inspired gradient backgrounds for light mode */
const FOCUS_COLORS: Record<ESGFocus, string[]> = {
  carbon_climate: [
    "from-[hsl(152,60%,95%)] to-[hsl(178,65%,93%)] border-[hsl(152,60%,80%)]",
    "from-[hsl(178,65%,95%)] to-[hsl(205,85%,93%)] border-[hsl(178,65%,80%)]",
    "from-[hsl(205,85%,95%)] to-[hsl(152,60%,93%)] border-[hsl(205,85%,80%)]",
  ],
  digital_inclusion: [
    "from-[hsl(205,85%,95%)] to-[hsl(178,65%,93%)] border-[hsl(205,85%,80%)]",
    "from-[hsl(270,60%,95%)] to-[hsl(205,85%,93%)] border-[hsl(270,60%,80%)]",
    "from-[hsl(230,60%,95%)] to-[hsl(270,60%,93%)] border-[hsl(230,60%,80%)]",
  ],
  community_safety: [
    "from-[hsl(28,85%,95%)] to-[hsl(42,90%,93%)] border-[hsl(28,85%,80%)]",
    "from-[hsl(42,90%,95%)] to-[hsl(28,85%,93%)] border-[hsl(42,90%,80%)]",
    "from-[hsl(4,80%,95%)] to-[hsl(28,85%,93%)] border-[hsl(4,80%,80%)]",
  ],
};

const ICON_COLORS: Record<ESGFocus, string[]> = {
  carbon_climate: ["text-ods-green", "text-ods-teal", "text-primary"],
  digital_inclusion: ["text-primary", "text-ods-violet", "text-[hsl(230,60%,55%)]"],
  community_safety: ["text-ods-orange", "text-ods-yellow", "text-ods-red"],
};

const EU_TAXONOMY_BADGES: Record<ESGFocus, (string | null)[]> = {
  carbon_climate: ["EU Taxonomy: Climate Mitigation", "GHG Protocol Scope 3", "GRI 306"],
  digital_inclusion: ["SASB TC-TL", "EU Taxonomy: Transition", "GRI 413"],
  community_safety: ["GRI 416", "EU Taxonomy: Social", "GRI 203"],
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
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground font-sans">
                    {kpi.title}
                  </span>
                  <div className="p-2.5 rounded-lg bg-card/80 border border-border/50">
                    <Icon className={`h-5 w-5 ${iconColors[i]}`} />
                  </div>
                </div>

                <div className="text-3xl font-bold text-foreground font-mono tracking-tight mb-1">
                  {kpi.value}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground font-sans">{kpi.subtitle}</span>
                  <span className={`text-xs font-semibold font-sans ${kpi.trendUp ? "text-ods-teal" : "text-destructive"}`}>
                    {kpi.trendUp ? "↑" : "↓"} {kpi.trend}
                  </span>
                </div>
                {EU_TAXONOMY_BADGES[focus]?.[i] && (
                  <Badge variant="outline" className="mt-3 w-fit text-[9px] font-medium tracking-wide border-primary/20 bg-primary/5 text-primary font-sans">
                    {EU_TAXONOMY_BADGES[focus][i]}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DynamicESGKPICards;
