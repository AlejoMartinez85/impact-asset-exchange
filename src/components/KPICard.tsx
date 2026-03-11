import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
  auditStandard?: string;
}

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendUp, delay = 0, auditStandard }: KPICardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-elevated rounded-lg p-5 glow-blue group hover:glow-blue-strong transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-sans">{title}</span>
        <div className="p-2 rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground font-mono tracking-tight">{value}</div>
      {auditStandard && (
        <Badge variant="outline" className="mt-1.5 text-[9px] font-semibold tracking-wide bg-primary/5 text-primary/80 border-primary/20 font-sans">
          {auditStandard}
        </Badge>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground font-sans">{subtitle}</span>
        {trend && (
          <span className={`text-xs font-medium font-sans ${trendUp ? "text-ods-teal" : "text-destructive"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;
