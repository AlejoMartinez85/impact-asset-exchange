import { hardwareHealth, elisaUnits } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const healthColor = (val: number) => {
  if (val >= 80) return "text-primary";
  if (val >= 50) return "text-yellow-400";
  return "text-destructive";
};

const progressColor = (val: number) => {
  if (val >= 80) return "bg-primary";
  if (val >= 50) return "bg-yellow-400";
  return "bg-destructive";
};

const HardwarePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Hardware Health Monitor</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time telemetry from ELISA solar units</p>
      </div>

      <div className="space-y-3">
        {hardwareHealth.map((hw, i) => {
          const unit = elisaUnits.find(u => u.id === hw.id);
          return (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-elevated rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${unit?.status === "active" ? "dot-active" : "dot-danger"}`} />
                  <div>
                    <span className="text-sm font-medium text-foreground">{unit?.name || hw.id}</span>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">{hw.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Last ping: {hw.lastPing}</span>
                  <Badge variant={unit?.status === "active" ? "default" : "destructive"} className="text-[10px] px-2 py-0">
                    {unit?.status || "unknown"}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Battery", value: hw.battery },
                  { label: "Solar Panel", value: hw.solar },
                  { label: "WiFi Module", value: hw.wifi },
                  { label: "Light Array", value: hw.light },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-mono font-medium ${healthColor(metric.value)}`}>{metric.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${progressColor(metric.value)}`} style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HardwarePage;
