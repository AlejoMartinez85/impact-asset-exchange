import { useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { generatedPoles } from "@/data/generatePoles";
import type { ELISAUnit } from "@/data/mockData";
import { Wifi, Battery, Sun, Zap, X, Radio, Activity, Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Cluster {
  lat: number;
  lng: number;
  count: number;
  activeCount: number;
  poles: ELISAUnit[];
}

function clusterPoles(poles: ELISAUnit[], gridSize: number): Cluster[] {
  const buckets = new Map<string, ELISAUnit[]>();
  for (const p of poles) {
    const key = `${Math.floor(p.lat / gridSize)}_${Math.floor(p.lng / gridSize)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(p);
  }
  const clusters: Cluster[] = [];
  for (const group of buckets.values()) {
    const lat = group.reduce((s, p) => s + p.lat, 0) / group.length;
    const lng = group.reduce((s, p) => s + p.lng, 0) / group.length;
    clusters.push({
      lat,
      lng,
      count: group.length,
      activeCount: group.filter((p) => p.status === "active").length,
      poles: group,
    });
  }
  return clusters;
}

const SummaryPanel = ({ activeCount, avgUptime, totalKwh, totalWifi, totalCount }: {
  activeCount: number; avgUptime: string; totalKwh: number; totalWifi: number; totalCount: number;
}) => (
  <div className="absolute top-4 left-4 z-20 w-48 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 space-y-3 shadow-xl">
    <div className="flex items-center gap-2 mb-1">
      <Radio className="h-3.5 w-3.5 text-primary" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary font-sans">Live Summary</span>
    </div>
    <div className="space-y-2.5">
      <div>
        <div className="text-lg font-bold font-mono text-foreground">{activeCount}<span className="text-xs text-muted-foreground font-normal">/{totalCount}</span></div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">Active Assets</div>
      </div>
      <div>
        <div className="text-lg font-bold font-mono text-foreground">{avgUptime}%</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">Global Uptime</div>
      </div>
      <div>
        <div className="text-lg font-bold font-mono text-primary">{(totalKwh / 1000).toFixed(0)}K</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">kWh Produced</div>
      </div>
      <div>
        <div className="text-lg font-bold font-mono text-foreground">{totalWifi.toLocaleString()}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">WiFi Users Now</div>
      </div>
    </div>
  </div>
);

const DetailPanel = ({ unit, onClose }: { unit: ELISAUnit; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
    className="absolute top-4 right-4 z-20 w-64 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="text-sm font-semibold text-foreground font-sans">{unit.name}</h4>
        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{unit.id}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
    <div className="mb-3">
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans ${
        unit.status === "active" ? "bg-ods-teal/15 text-ods-teal" : "bg-ods-orange/15 text-ods-orange"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${unit.status === "active" ? "bg-ods-teal animate-pulse" : "bg-ods-orange"}`} />
        {unit.status === "active" ? "Online" : "Maintenance"}
      </span>
    </div>
    <div className="space-y-1.5 text-xs">
      {[
        { icon: Zap, label: "Power Today", value: `${(unit.kwhProduced / 1000).toFixed(1)} kWh`, color: "text-primary" },
        { icon: Wifi, label: "WiFi Users", value: String(unit.wifiUsers), color: "text-foreground" },
        { icon: Battery, label: "Battery", value: `${unit.batteryHealth}%`, color: unit.batteryHealth > 70 ? "text-ods-teal" : "text-destructive" },
        { icon: Sun, label: "Light Status", value: unit.lightStatus.charAt(0).toUpperCase() + unit.lightStatus.slice(1), color: "text-foreground" },
        { icon: Activity, label: "Uptime", value: `${unit.uptime}%`, color: "text-foreground" },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
          <span className="flex items-center gap-1.5 text-muted-foreground font-sans">
            <row.icon className="h-3 w-3" /> {row.label}
          </span>
          <span className={`font-mono font-semibold ${row.color}`}>{row.value}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground font-sans">{unit.community}, {unit.country}</span>
        <span className="font-mono text-muted-foreground">{unit.lat.toFixed(2)}°, {unit.lng.toFixed(2)}°</span>
      </div>
    </div>
  </motion.div>
);

const MIN_ZOOM = 1;
const MAX_ZOOM = 16;

const LiveMap = () => {
  const [selected, setSelected] = useState<ELISAUnit | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-20, 5]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.6)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, z / 1.6)), []);
  const handleReset = useCallback(() => { setZoom(1); setCenter([-20, 5]); }, []);

  const poles = generatedPoles;

  const activeCount = useMemo(() => poles.filter((u) => u.status === "active").length, [poles]);
  const avgUptime = useMemo(() => (poles.reduce((s, u) => s + u.uptime, 0) / poles.length).toFixed(1), [poles]);
  const totalKwh = useMemo(() => poles.reduce((s, u) => s + u.kwhProduced, 0), [poles]);
  const totalWifi = useMemo(() => poles.reduce((s, u) => s + u.wifiUsers, 0), [poles]);

  const gridSize = useMemo(() => {
    if (zoom >= 8) return 0.5;
    if (zoom >= 4) return 2;
    if (zoom >= 2) return 5;
    return 10;
  }, [zoom]);

  const clusters = useMemo(() => clusterPoles(poles, gridSize), [poles, gridSize]);
  const countries = useMemo(() => new Set(poles.map((u) => u.country)).size, [poles]);

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setZoom(position.zoom);
    setCenter(position.coordinates);
  }, []);

  return (
    <div className="card-elevated rounded-xl relative overflow-hidden" style={{ minHeight: 520 }}>
      <div className="flex items-center justify-between p-5 pb-0 relative z-10">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight font-sans">Live Asset Tracker</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">
            {poles.length} ELISA poles across {countries} countries
          </p>
        </div>
        <div className="flex gap-4 text-[11px] text-muted-foreground font-sans">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full dot-active" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full dot-warning" /> Maintenance
          </span>
          <span className="flex items-center gap-1.5 font-mono text-primary">
            {zoom.toFixed(1)}×
          </span>
        </div>
      </div>

      <div className="relative w-full" style={{ height: 460 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-20, 5], scale: 200 }}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={zoom} center={center} onMoveEnd={handleMoveEnd} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "hsl(var(--muted))", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {clusters.map((cluster, i) => {
              const isSingle = cluster.count === 1;
              const pole = isSingle ? cluster.poles[0] : null;
              const activeRatio = cluster.activeCount / cluster.count;
              const isMostlyActive = activeRatio > 0.5;

              if (isSingle && pole) {
                const isActive = pole.status === "active";
                const isSel = selected?.id === pole.id;
                return (
                  <Marker
                    key={pole.id}
                    coordinates={[pole.lng, pole.lat]}
                    onClick={() => setSelected(pole)}
                    style={{ cursor: "pointer" }}
                  >
                    {isActive && (
                      <circle r={isSel ? 10 : 6} fill="none" stroke="hsl(var(--ods-teal))" strokeWidth={0.8} opacity={0.3}>
                        <animate attributeName="r" from="4" to="10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      r={isSel ? 5 : 3}
                      fill={isActive ? "hsl(178, 65%, 42%)" : "hsl(28, 85%, 55%)"}
                      stroke="hsl(var(--card))"
                      strokeWidth={1}
                      style={{
                        filter: isActive
                          ? "drop-shadow(0 0 4px hsl(178, 65%, 42%))"
                          : "drop-shadow(0 0 4px hsl(28, 85%, 55%))",
                      }}
                    />
                  </Marker>
                );
              }

              const radius = Math.min(28, Math.max(12, Math.sqrt(cluster.count) * 3));
              return (
                <Marker key={`cluster-${i}`} coordinates={[cluster.lng, cluster.lat]}>
                  <circle
                    r={radius + 4}
                    fill={isMostlyActive ? "hsl(205, 85%, 42%)" : "hsl(28, 85%, 55%)"}
                    opacity={0.15}
                  />
                  <circle
                    r={radius}
                    fill={isMostlyActive ? "hsl(205, 85%, 42%)" : "hsl(28, 85%, 55%)"}
                    opacity={0.3}
                    stroke={isMostlyActive ? "hsl(205, 85%, 42%)" : "hsl(28, 85%, 55%)"}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="hsl(var(--foreground))"
                    fontSize={radius < 16 ? 8 : 10}
                    fontWeight={700}
                    fontFamily="JetBrains Mono, monospace"
                    style={{ pointerEvents: "none" }}
                  >
                    {cluster.count}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        <SummaryPanel
          activeCount={activeCount}
          avgUptime={avgUptime}
          totalKwh={totalKwh}
          totalWifi={totalWifi}
          totalCount={poles.length}
        />

        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-card/90 backdrop-blur-xl border border-border hover:bg-secondary shadow-lg transition-all"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-card/90 backdrop-blur-xl border border-border hover:bg-secondary shadow-lg transition-all"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-card/90 backdrop-blur-xl border border-border hover:bg-secondary shadow-lg transition-all mt-1"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <AnimatePresence>
          {selected && <DetailPanel unit={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveMap;
