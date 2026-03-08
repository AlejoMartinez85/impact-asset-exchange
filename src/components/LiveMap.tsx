import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { elisaUnits, ELISAUnit } from "@/data/mockData";
import { Wifi, Battery, Sun, X } from "lucide-react";

const mapProjection = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
};

const LiveMap = () => {
  const [selected, setSelected] = useState<ELISAUnit | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="card-elevated rounded-lg p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Global ELISA Deployment</h3>
          <p className="text-xs text-muted-foreground mt-1">{elisaUnits.length} units across {new Set(elisaUnits.map(u => u.country)).size} countries</p>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full dot-active" /> Active</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full dot-danger" /> Maintenance</span>
        </div>
      </div>

      <div className="relative w-full rounded-md overflow-hidden bg-secondary/50" style={{ aspectRatio: "2/1" }}>
        {/* Simple world map outline using CSS gradient as background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 50%, hsl(var(--primary) / 0.08) 0%, transparent 35%),
            radial-gradient(circle at 45% 60%, hsl(var(--primary) / 0.06) 0%, transparent 30%)`,
        }} />
        
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[20, 40, 60, 80].map(p => (
            <g key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {elisaUnits.map((unit) => {
          const { x, y } = mapProjection(unit.lat, unit.lng);
          const isHovered = hovered === unit.id;
          return (
            <div key={unit.id}>
              <button
                className={`absolute z-10 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                  unit.status === "active" ? "dot-active" : "dot-danger"
                } ${isHovered ? "scale-[2]" : "scale-100"}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setHovered(unit.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(unit)}
              />
              {isHovered && (
                <div
                  className="absolute z-20 bg-card border border-border rounded-md p-2 text-xs pointer-events-none shadow-lg"
                  style={{ left: `${x}%`, top: `${y - 8}%`, transform: "translate(-50%, -100%)" }}
                >
                  <span className="font-medium text-foreground">{unit.name}</span>
                  <span className="block text-muted-foreground">{unit.country}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 w-72 bg-card border border-border rounded-lg p-4 shadow-xl z-30"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
                <p className="text-xs text-muted-foreground font-mono">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Wifi className="h-3 w-3" /> WiFi Users</span>
                <span className="font-mono font-medium text-foreground">{selected.wifiUsers}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Battery className="h-3 w-3" /> Battery</span>
                <span className={`font-mono font-medium ${selected.batteryHealth > 70 ? "text-primary" : "text-destructive"}`}>{selected.batteryHealth}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Sun className="h-3 w-3" /> Light</span>
                <span className="font-mono font-medium text-foreground capitalize">{selected.lightStatus}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-mono font-medium text-foreground">{selected.uptime}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <span className="text-muted-foreground">Energy Produced</span>
                <span className="font-mono font-medium text-primary">{selected.kwhProduced.toLocaleString()} kWh</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMap;
