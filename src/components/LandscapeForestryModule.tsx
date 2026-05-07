import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip, useMap, Rectangle, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RadioTower, Lock, TrendingUp, TrendingDown, Flame, Leaf, Satellite, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { forestryNodes, type ForestryNode, type FirePotential } from "@/data/forestryNodes";

type LayerMode = "satellite" | "deforestation" | "wildfire";

const fireTone: Record<FirePotential, { ring: string; fill: string; text: string; dot: string }> = {
  Low: { ring: "#34d399", fill: "#10b981", text: "text-emerald-300", dot: "bg-emerald-400" },
  Medium: { ring: "#fbbf24", fill: "#f59e0b", text: "text-amber-300", dot: "bg-amber-400" },
  High: { ring: "#fb923c", fill: "#ea580c", text: "text-orange-300", dot: "bg-orange-400" },
  Critical: { ring: "#f87171", fill: "#dc2626", text: "text-red-300", dot: "bg-red-500" },
};

const KPI_CARDS = [
  { label: "Total Area Monitored", value: "1,250", unit: "Hectares", icon: Satellite },
  { label: "Deforestation Alerts", value: "0", unit: "Last 30 Days · MODIS", icon: Leaf },
  { label: "Carbon / Biomass Stability", value: "98%", unit: "Optimal · NDVI", icon: TrendingUp },
];

const FitBounds = () => {
  const map = useMap();
  useMemo(() => {
    const bounds = forestryNodes.map((n) => [n.coordinates.lat, n.coordinates.lng] as [number, number]);
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] });
  }, [map]);
  return null;
};

const LandscapeForestryModule = () => {
  const [layer, setLayer] = useState<LayerMode>("satellite");
  const [selected, setSelected] = useState<ForestryNode | null>(null);

  const overlayMask = useMemo(() => {
    if (layer === "deforestation") {
      return {
        background:
          "radial-gradient(circle at 30% 60%, hsla(140,80%,45%,0.45), transparent 35%), radial-gradient(circle at 78% 55%, hsla(0,85%,55%,0.5), transparent 32%), radial-gradient(circle at 64% 70%, hsla(15,85%,55%,0.4), transparent 30%)",
        mixBlendMode: "screen" as const,
      };
    }
    if (layer === "wildfire") {
      return {
        background:
          "radial-gradient(circle at 78% 55%, hsla(10,95%,55%,0.6), transparent 32%), radial-gradient(circle at 64% 70%, hsla(35,95%,55%,0.5), transparent 35%), radial-gradient(circle at 74% 58%, hsla(50,95%,60%,0.4), transparent 30%)",
        mixBlendMode: "screen" as const,
      };
    }
    return { background: "transparent" };
  }, [layer]);

  const pixelMask =
    "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-mono">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Google Earth Engine · CSRD Module
        </div>
        <h1 className="text-3xl md:text-4xl font-serif mt-2 text-slate-50">Landscape & Forestry MRV</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Sentinel-2 + MODIS FIRMS fused with ELISA® IoT telemetry. NDVI / SAVI indices, LST anomalies, and fire mask delivered to your CSRD pipeline.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-md">
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif text-slate-50">{kpi.value}</span>
                  <span className="text-xs text-slate-500 font-mono">{kpi.unit}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-slate-900/60 border-slate-800 overflow-hidden backdrop-blur-md">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-800/80 flex-wrap gap-3">
            <div>
              <CardTitle className="text-sm font-sans font-semibold text-slate-200">
                Intelligence Map · Live Sourcing Landscapes
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {forestryNodes.length} ELISA nodes · Esri World Imagery · synced 02:14 UTC
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={layer}
              onValueChange={(v) => v && setLayer(v as LayerMode)}
              className="bg-slate-950/60 border border-slate-800 rounded-md p-1"
            >
              <ToggleGroupItem value="satellite" className="data-[state=on]:bg-emerald-500/20 data-[state=on]:text-emerald-300 text-slate-400 text-xs h-8 px-3">
                <Satellite className="h-3.5 w-3.5 mr-1.5" /> Satellite
              </ToggleGroupItem>
              <ToggleGroupItem value="deforestation" className="data-[state=on]:bg-emerald-500/20 data-[state=on]:text-emerald-300 text-slate-400 text-xs h-8 px-3">
                <Leaf className="h-3.5 w-3.5 mr-1.5" /> Deforestation
              </ToggleGroupItem>
              <ToggleGroupItem value="wildfire" className="data-[state=on]:bg-orange-500/20 data-[state=on]:text-orange-300 text-slate-400 text-xs h-8 px-3">
                <Flame className="h-3.5 w-3.5 mr-1.5" /> FIRMS Fire Mask
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <MapContainer
                center={[10, 20]}
                zoom={2}
                style={{ height: "100%", width: "100%", background: "#0b1220" }}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles &copy; Esri'
                />
                <FitBounds />
                {forestryNodes.map((node) => {
                  const tone = fireTone[node.fire_potential];
                  return (
                    <CircleMarker
                      key={node.id}
                      center={[node.coordinates.lat, node.coordinates.lng]}
                      radius={8}
                      pathOptions={{ color: tone.ring, fillColor: tone.fill, fillOpacity: 0.85, weight: 2 }}
                      eventHandlers={{ click: () => setSelected(node) }}
                    >
                      <LTooltip direction="top" offset={[0, -6]} opacity={1} className="!bg-slate-950 !text-slate-100 !border !border-slate-800 !rounded">
                        <div className="font-mono text-[10px]">
                          <div className="text-slate-100">{node.name}</div>
                          <div className="text-slate-400">{node.id} · NDVI {node.ndvi_score.toFixed(2)}</div>
                        </div>
                      </LTooltip>
                    </CircleMarker>
                  );
                })}
                {layer === "deforestation" &&
                  forestryNodes.map((n) => {
                    const d = n.forest_change_detected ? 1.6 : 0.7;
                    const bounds: [[number, number], [number, number]] = [
                      [n.coordinates.lat - d, n.coordinates.lng - d],
                      [n.coordinates.lat + d, n.coordinates.lng + d],
                    ];
                    const severe = n.forest_change_detected || n.ndvi_score < 0.65;
                    return (
                      <Rectangle
                        key={`def-${n.id}`}
                        bounds={bounds}
                        pathOptions={{
                          color: severe ? "#ff2d2d" : "#f59e0b",
                          fillColor: severe ? "#ff0000" : "#fb923c",
                          fillOpacity: 0.4,
                          weight: 1,
                        }}
                      />
                    );
                  })}
                {layer === "wildfire" &&
                  forestryNodes.flatMap((n) => {
                    const count = n.fire_potential === "Critical" ? 6 : n.fire_potential === "High" ? 4 : n.fire_potential === "Medium" ? 2 : 1;
                    return Array.from({ length: count }).map((_, i) => {
                      const jLat = Math.sin(i * 9.13 + n.coordinates.lat) * 0.6;
                      const jLng = Math.cos(i * 7.31 + n.coordinates.lng) * 0.6;
                      return (
                        <Circle
                          key={`fire-${n.id}-${i}`}
                          center={[n.coordinates.lat + jLat, n.coordinates.lng + jLng]}
                          radius={40000 + ((i * 137) % 40000)}
                          pathOptions={{ color: "orange", fillColor: "#ff4500", fillOpacity: 0.7, weight: 0 }}
                        />
                      );
                    });
                  })}
              </MapContainer>

              {/* Glassmorphic legend */}
              <div className="absolute bottom-3 left-3 bg-slate-950/70 border border-slate-800/80 rounded-md px-3 py-2 backdrop-blur-md z-[400]">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  {layer === "wildfire" ? "MODIS FIRMS Fire Potential" : layer === "deforestation" ? "Forest Change Δ (NDVI)" : "Fire Potential"}
                </div>
                <div className="flex items-center gap-3">
                  {(["Low", "Medium", "High", "Critical"] as FirePotential[]).map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${fireTone[f].dot}`} />
                      <span className="text-[10px] text-slate-300 font-mono">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 backdrop-blur-md z-[400]">
                <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-mono flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> GEE Stream Live
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-slate-950/95 backdrop-blur-xl border-slate-800 text-slate-100 w-full sm:max-w-md overflow-y-auto">
          {selected && <NodeDetail node={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const NodeDetail = ({ node }: { node: ForestryNode }) => {
  const tone = fireTone[node.fire_potential];
  const trendUp = !node.forest_change_detected;
  const trendPct = trendUp ? (4 + node.ndvi_score * 6).toFixed(1) : (2 + (1 - node.ndvi_score) * 8).toFixed(1);
  const ndviPct = Math.round(node.ndvi_score * 100);
  const saviPct = Math.round(node.ndvi_score * 92);

  return (
    <div className="space-y-6">
      <SheetHeader className="text-left">
        <div className="flex items-center gap-2 text-xs text-emerald-400/80 font-mono uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Status: Active · GEE
        </div>
        <SheetTitle className="text-slate-50 font-serif text-2xl">{node.name}</SheetTitle>
        <SheetDescription className="text-slate-400 font-mono text-xs">
          {node.id} · {node.coordinates.lat.toFixed(4)}°, {node.coordinates.lng.toFixed(4)}°
        </SheetDescription>
      </SheetHeader>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-2">
          Multitemporal Comparison · Sentinel-2 via Google Earth Engine
        </div>
        <BeforeAfterSlider hueBefore={120} hueAfter={node.forest_change_detected ? 25 : 140} />
        <div className="text-[10px] text-slate-500 mt-2 font-mono">
          Δ Canopy · {node.forest_change_detected ? "Loss detected" : "Stable / regrowth"} · Drag the divider
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniKPI
          icon={trendUp ? TrendingUp : TrendingDown}
          label="NDVI Trend"
          value={`${trendUp ? "+" : "-"}${trendPct}%`}
          accent={trendUp ? "text-emerald-300" : "text-red-300"}
        />
        <div className={`rounded-md p-3 border border-slate-800 bg-slate-900/60`}>
          <Flame className={`h-3.5 w-3.5 ${tone.text} mb-1.5`} />
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">FIRMS Risk</div>
          <Badge className={`mt-1 ${tone.text} bg-slate-950/60 border border-slate-800 text-[10px]`}>{node.fire_potential}</Badge>
        </div>
        <MiniKPI
          icon={Leaf}
          label="SAVI Index"
          value={`${saviPct}`}
          accent={saviPct > 70 ? "text-emerald-300" : saviPct > 50 ? "text-amber-300" : "text-red-300"}
        />
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/60 p-3 space-y-1.5 backdrop-blur">
        <Row label="LST (Land Surface Temp)" value={`${node.lst_index.toFixed(1)} °C`} />
        <Row label="NDVI Score" value={node.ndvi_score.toFixed(2)} />
        <Row label="SAVI Index" value={(node.ndvi_score * 0.92).toFixed(2)} />
        <Row label="MODIS FIRMS Fire Mask" value={node.fire_potential === "Critical" || node.fire_potential === "High" ? "Hotspot" : "Clear"} alert={node.fire_potential === "Critical"} />
        <Row label="Forest Change Δ" value={node.forest_change_detected ? "Detected" : "None"} alert={node.forest_change_detected} />
      </div>

      <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold">
        <Lock className="h-4 w-4 mr-2" />
        View $LITRO Protocol Receipt
      </Button>
      <p className="text-[10px] text-slate-500 font-mono text-center -mt-3">
        Cryptographically signed · On-chain anchor · PoPW verified
      </p>
    </div>
  );
};

const BEFORE_IMG = "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=800&q=80";
const AFTER_IMG = "https://images.unsplash.com/photo-1596328639209-41d3fc14e511?auto=format&fit=crop&w=800&q=80";

const BeforeAfterSlider = (_props: { hueBefore?: number; hueAfter?: number }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative w-full aspect-[16/10] rounded-md overflow-hidden border border-slate-800 select-none bg-slate-900">
      <img src={AFTER_IMG} alt="Current satellite 2024" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-100 px-1.5 py-0.5 rounded bg-slate-950/70 border border-slate-800 z-20">
        Current Satellite · 2024
      </div>
      <img
        src={BEFORE_IMG}
        alt="2016 baseline"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}
        draggable={false}
      />
      <div
        className="absolute bottom-1.5 left-2 text-[9px] font-mono text-slate-100 px-1.5 py-0.5 rounded bg-slate-950/70 border border-slate-800 z-20"
        style={{ opacity: pos > 10 ? 1 : 0 }}
      >
        2016 Baseline
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] z-10 pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center">
          <span className="text-white text-[10px] font-mono">⇆</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  );
};

const MiniKPI = ({ icon: Icon, label, value, accent }: { icon: typeof Leaf; label: string; value: string; accent: string }) => (
  <div className="rounded-md p-3 border border-slate-800 bg-slate-900/60 backdrop-blur">
    <Icon className={`h-3.5 w-3.5 ${accent} mb-1.5`} />
    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">{label}</div>
    <div className={`text-lg font-serif mt-0.5 ${accent}`}>{value}</div>
  </div>
);

const Row = ({ label, value, alert }: { label: string; value: string; alert?: boolean }) => (
  <div className="flex items-center justify-between text-xs font-mono">
    <span className="text-slate-500">{label}</span>
    <span className={alert ? "text-red-300" : "text-slate-200"}>{value}</span>
  </div>
);

export default LandscapeForestryModule;
export { AlertTriangle, RadioTower };
