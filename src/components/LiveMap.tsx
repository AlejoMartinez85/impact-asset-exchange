import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { elisaUnits, ELISAUnit } from "@/data/mockData";
import { Wifi, Battery, Sun, Zap, X, Radio, Activity } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LiveMap = () => {
  const [selected, setSelected] = useState<ELISAUnit | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeCount = useMemo(() => elisaUnits.filter((u) => u.status === "active").length, []);
  const avgUptime = useMemo(
    () => (elisaUnits.reduce((s, u) => s + u.uptime, 0) / elisaUnits.length).toFixed(1),
    []
  );
  const totalKwh = useMemo(() => elisaUnits.reduce((s, u) => s + u.kwhProduced, 0), []);
  const totalWifi = useMemo(() => elisaUnits.reduce((s, u) => s + u.wifiUsers, 0), []);

  return (
    <div className="card-elevated rounded-xl relative overflow-hidden" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0 relative z-10">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Live Asset Tracker</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {elisaUnits.length} ELISA poles across {new Set(elisaUnits.map((u) => u.country)).size} countries
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full dot-active" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full dot-warning" /> Maintenance
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full" style={{ height: 460 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-72, 4], scale: 550 }}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(220, 16%, 13%)"
                    stroke="hsl(220, 14%, 20%)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "hsl(220, 16%, 16%)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {elisaUnits.map((unit) => {
              const isActive = unit.status === "active";
              const isHov = hovered === unit.id;
              const isSel = selected?.id === unit.id;
              return (
                <Marker
                  key={unit.id}
                  coordinates={[unit.lng, unit.lat]}
                  onMouseEnter={() => setHovered(unit.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(unit)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Pulse ring */}
                  {isActive && (
                    <circle
                      r={isHov || isSel ? 14 : 10}
                      fill="none"
                      stroke={isActive ? "hsl(142, 72%, 48%)" : "hsl(38, 92%, 55%)"}
                      strokeWidth={1}
                      opacity={0.3}
                    >
                      <animate attributeName="r" from={isHov ? "8" : "6"} to={isHov ? "18" : "14"} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Core dot */}
                  <circle
                    r={isHov || isSel ? 6 : 4}
                    fill={isActive ? "hsl(142, 72%, 48%)" : "hsl(38, 92%, 55%)"}
                    stroke="hsl(220, 20%, 7%)"
                    strokeWidth={1.5}
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 0 6px hsl(142, 72%, 48%))"
                        : "drop-shadow(0 0 6px hsl(38, 92%, 55%))",
                      transition: "r 0.2s ease",
                    }}
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* ─── Summary Overlay Panel ─── */}
        <div className="absolute top-4 left-4 z-20 w-48 rounded-xl border border-border bg-card/90 backdrop-blur-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Live Summary</span>
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="text-lg font-bold font-mono text-foreground">{activeCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Assets</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-foreground">{avgUptime}%</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Global Uptime</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-primary">{(totalKwh / 1000).toFixed(1)}K</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">kWh Produced</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-foreground">{totalWifi}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">WiFi Users Now</div>
            </div>
          </div>
        </div>

        {/* ─── Detail Panel ─── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="absolute top-4 right-4 z-20 w-64 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{selected.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selected.id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Status badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selected.status === "active"
                      ? "bg-primary/15 text-primary"
                      : "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      selected.status === "active" ? "bg-primary animate-pulse" : "bg-[hsl(38,92%,55%)]"
                    }`}
                  />
                  {selected.status === "active" ? "Online" : "Maintenance"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { icon: Zap, label: "Power Today", value: `${(selected.kwhProduced / 1000).toFixed(1)} kWh`, color: "text-primary" },
                  { icon: Wifi, label: "WiFi Users", value: String(selected.wifiUsers), color: "text-foreground" },
                  { icon: Battery, label: "Battery", value: `${selected.batteryHealth}%`, color: selected.batteryHealth > 70 ? "text-primary" : "text-destructive" },
                  { icon: Sun, label: "Light Status", value: selected.lightStatus.charAt(0).toUpperCase() + selected.lightStatus.slice(1), color: "text-foreground" },
                  { icon: Activity, label: "Uptime", value: `${selected.uptime}%`, color: "text-foreground" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <row.icon className="h-3 w-3" /> {row.label}
                    </span>
                    <span className={`font-mono font-semibold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">{selected.community}, {selected.country}</span>
                  <span className="font-mono text-muted-foreground">{selected.lat.toFixed(2)}°, {selected.lng.toFixed(2)}°</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveMap;
