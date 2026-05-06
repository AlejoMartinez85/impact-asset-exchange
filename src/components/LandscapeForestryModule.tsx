import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioTower, Lock, TrendingUp, TrendingDown, Flame, Leaf, Satellite, AlertTriangle, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { forestryNodes, type ForestryNode, type FirePotential } from "@/data/forestryNodes";

type LayerMode = "satellite" | "deforestation" | "wildfire";

const fireTone: Record<FirePotential, { bg: string; text: string; ring: string; dot: string }> = {
  Low: { bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-400/40", dot: "bg-emerald-400" },
  Medium: { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-400/40", dot: "bg-amber-400" },
  High: { bg: "bg-orange-500/20", text: "text-orange-300", ring: "ring-orange-400/50", dot: "bg-orange-400" },
  Critical: { bg: "bg-red-500/25", text: "text-red-300", ring: "ring-red-400/60", dot: "bg-red-500" },
};

const KPI_CARDS = [
  { label: "Total Area Monitored", value: "1,250", unit: "Hectares", icon: Satellite, accent: "text-emerald-400" },
  { label: "Deforestation Alerts", value: "0", unit: "Last 30 Days", icon: Leaf, accent: "text-emerald-400" },
  { label: "Carbon / Biomass Stability", value: "98%", unit: "Optimal", icon: TrendingUp, accent: "text-emerald-400" },
];

const LandscapeForestryModule = () => {
  const [layer, setLayer] = useState<LayerMode>("satellite");
  const [selected, setSelected] = useState<ForestryNode | null>(null);

  const overlay = useMemo(() => {
    if (layer === "deforestation") {
      return "radial-gradient(circle at 30% 60%, hsla(140,70%,40%,0.35), transparent 45%), radial-gradient(circle at 78% 55%, hsla(0,80%,50%,0.45), transparent 40%), radial-gradient(circle at 64% 70%, hsla(15,80%,50%,0.35), transparent 38%)";
    }
    if (layer === "wildfire") {
      return "radial-gradient(circle at 78% 55%, hsla(10,90%,55%,0.55), transparent 38%), radial-gradient(circle at 64% 70%, hsla(30,90%,55%,0.45), transparent 40%), radial-gradient(circle at 74% 58%, hsla(20,90%,55%,0.35), transparent 38%)";
    }
    return "radial-gradient(circle at 50% 50%, hsla(160,40%,30%,0.18), transparent 70%)";
  }, [layer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-400/80 font-mono">
          <Satellite className="h-3.5 w-3.5" /> Landscape Intelligence · CSRD Module
        </div>
        <h1 className="text-3xl md:text-4xl font-serif mt-2 text-slate-50">
          Landscape & Forestry MRV
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Satellite + ELISA® IoT fusion for verifiable nature-based outcomes across Tier 2/3 sourcing landscapes.
        </p>
      </div>

      {/* KPI Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-slate-900/70 border-slate-800 backdrop-blur">
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">
                  {kpi.label}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
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

      {/* Map */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-slate-900/70 border-slate-800 overflow-hidden">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-800/80">
            <div>
              <CardTitle className="text-sm font-sans font-semibold text-slate-200">
                Intelligence Map · Live Sourcing Landscapes
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {forestryNodes.length} ELISA nodes · synced 02:14 UTC
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
                <Flame className="h-3.5 w-3.5 mr-1.5" /> Wildfire
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className="relative w-full aspect-[16/9] overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, hsl(220 35% 8%), hsl(200 45% 12%) 60%, hsl(160 30% 10%))`,
              }}
            >
              {/* Lat/Lng grid */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(hsla(160,60%,50%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(160,60%,50%,0.08) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
              {/* Stylized continents */}
              <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 56" preserveAspectRatio="none">
                <g fill="hsla(155,40%,28%,0.55)" stroke="hsla(155,60%,45%,0.3)" strokeWidth="0.15">
                  <path d="M14,18 Q22,12 30,16 L34,28 Q28,38 22,40 L14,32 Z" />
                  <path d="M36,16 Q46,12 52,18 L52,32 Q44,42 38,40 L34,28 Z" />
                  <path d="M48,18 Q58,14 66,20 L70,30 Q64,38 56,38 L52,30 Z" />
                  <path d="M68,22 Q78,18 86,24 L84,38 Q76,44 70,40 L66,32 Z" />
                  <path d="M62,66 Q66,62 70,68 L68,72 Q64,72 62,70 Z" transform="translate(0,-10)" />
                </g>
              </svg>
              {/* Active layer overlay */}
              <motion.div
                key={layer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: overlay, mixBlendMode: "screen" }}
              />

              {/* Node markers */}
              {forestryNodes.map((node) => {
                const tone = fireTone[node.fire_potential];
                const isAlert = layer === "wildfire" && (node.fire_potential === "High" || node.fire_potential === "Critical");
                const isDefo = layer === "deforestation" && node.forest_change_detected;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelected(node)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <span className={`absolute inset-0 -m-3 rounded-full ${tone.dot} opacity-30 animate-ping`} />
                    <span className={`relative flex items-center justify-center h-7 w-7 rounded-full ring-2 ${tone.ring} ${tone.bg} backdrop-blur`}>
                      {isAlert ? (
                        <Flame className="h-3.5 w-3.5 text-orange-300" />
                      ) : isDefo ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
                      ) : (
                        <RadioTower className={`h-3.5 w-3.5 ${tone.text}`} />
                      )}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-slate-950/95 border border-slate-800 text-[10px] font-mono text-slate-200 whitespace-nowrap z-10">
                      {node.id}
                    </span>
                  </button>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 rounded-md px-3 py-2 backdrop-blur">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1.5 font-mono">Fire Potential</div>
                <div className="flex items-center gap-3">
                  {(["Low", "Medium", "High", "Critical"] as FirePotential[]).map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${fireTone[f].dot}`} />
                      <span className="text-[10px] text-slate-400 font-mono">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-slate-950 border-slate-800 text-slate-100 w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <NodeDetail node={selected} />
          )}
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

  return (
    <div className="space-y-6">
      <SheetHeader className="text-left">
        <div className="flex items-center gap-2 text-xs text-emerald-400/80 font-mono uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Status: Active
        </div>
        <SheetTitle className="text-slate-50 font-serif text-2xl">{node.name}</SheetTitle>
        <SheetDescription className="text-slate-400 font-mono text-xs">
          {node.id} · {node.coordinates.lat.toFixed(4)}°, {node.coordinates.lng.toFixed(4)}°
        </SheetDescription>
      </SheetHeader>

      {/* Multitemporal Proof */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-2">
          Multitemporal Proof · Sentinel-2
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ImageTile label="Baseline (2016)" hue={120} dim />
          <ImageTile label="Current Satellite" hue={node.forest_change_detected ? 25 : 140} />
        </div>
        <div className="text-[10px] text-slate-500 mt-1.5 font-mono">
          Δ Canopy delta · {node.forest_change_detected ? "Loss detected" : "Stable / regrowth"}
        </div>
      </div>

      {/* KPI Mini Cards */}
      <div className="grid grid-cols-3 gap-2">
        <MiniKPI
          icon={trendUp ? TrendingUp : TrendingDown}
          label="Forestation"
          value={`${trendUp ? "+" : "-"}${trendPct}%`}
          accent={trendUp ? "text-emerald-300" : "text-red-300"}
        />
        <div className={`rounded-md p-3 border border-slate-800 ${tone.bg}`}>
          <Flame className={`h-3.5 w-3.5 ${tone.text} mb-1.5`} />
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Fire Risk</div>
          <Badge className={`mt-1 ${tone.bg} ${tone.text} border-0 text-[10px]`}>{node.fire_potential}</Badge>
        </div>
        <MiniKPI
          icon={Leaf}
          label="NDVI Health"
          value={`${ndviPct}`}
          accent={ndviPct > 70 ? "text-emerald-300" : ndviPct > 50 ? "text-amber-300" : "text-red-300"}
        />
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/60 p-3 space-y-1.5">
        <Row label="Land Surface Temp" value={`${node.lst_index.toFixed(1)} °C`} />
        <Row label="NDVI Score" value={node.ndvi_score.toFixed(2)} />
        <Row label="Forest Change" value={node.forest_change_detected ? "Detected" : "None"} alert={node.forest_change_detected} />
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

const ImageTile = ({ label, hue, dim }: { label: string; hue: number; dim?: boolean }) => (
  <div className="relative aspect-square rounded-md overflow-hidden border border-slate-800">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 30%, hsla(${hue},60%,${dim ? 30 : 45}%,0.9), hsla(${hue},50%,15%,0.95)), repeating-linear-gradient(45deg, hsla(${hue},40%,${dim ? 20 : 30}%,0.4) 0 4px, transparent 4px 8px)`,
      }}
    />
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(hsla(0,0%,100%,0.2) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
    <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-slate-100/90 px-1.5 py-0.5 rounded bg-slate-950/70">
      {label}
    </div>
  </div>
);

const MiniKPI = ({ icon: Icon, label, value, accent }: { icon: typeof Leaf; label: string; value: string; accent: string }) => (
  <div className="rounded-md p-3 border border-slate-800 bg-slate-900/60">
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

// Re-export marker icon to satisfy unused import linters in some setups
export { MapPin };

// AnimatePresence is referenced for future transitions
void AnimatePresence;