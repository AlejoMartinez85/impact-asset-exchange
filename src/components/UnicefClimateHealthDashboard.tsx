import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  HeartPulse,
  Users,
  Thermometer,
  Droplets,
  Wind,
  Wifi,
  Stethoscope,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useIoTDataStream } from "@/hooks/useIoTDataStream";

/* Live telemetry CSS transition */
import "./iot-telemetry.css";

type LayerMode = "base" | "heat" | "vector";

interface HealthNode {
  id: string;
  community: string;
  country: string;
  coordinates: { lat: number; lng: number };
  temperatureC: number;
  humidity: number;
  pm25: number;
  lastTelehealth: string;
  feverReports: number;
  vulnerability: "Low" | "Medium" | "High" | "Critical";
}

const HEALTH_NODES: HealthNode[] = [
  { id: "ELISA-KEN-014", community: "Turkana North", country: "Kenya", coordinates: { lat: 3.12, lng: 35.6 }, temperatureC: 41.2, humidity: 22, pm25: 58, lastTelehealth: "2 hours ago", feverReports: 4, vulnerability: "Critical" },
  { id: "ELISA-GHA-021", community: "Bolgatanga", country: "Ghana", coordinates: { lat: 10.78, lng: -0.85 }, temperatureC: 38.4, humidity: 64, pm25: 47, lastTelehealth: "11 hours ago", feverReports: 3, vulnerability: "High" },
  { id: "ELISA-COL-009", community: "Leticia Amazonas", country: "Colombia", coordinates: { lat: -4.21, lng: -69.94 }, temperatureC: 32.1, humidity: 88, pm25: 22, lastTelehealth: "1 day ago", feverReports: 2, vulnerability: "High" },
  { id: "ELISA-PER-031", community: "Madre de Dios", country: "Peru", coordinates: { lat: -12.59, lng: -69.18 }, temperatureC: 31.4, humidity: 84, pm25: 35, lastTelehealth: "3 hours ago", feverReports: 1, vulnerability: "Medium" },
  { id: "ELISA-MDG-007", community: "Mananjary", country: "Madagascar", coordinates: { lat: -21.23, lng: 48.34 }, temperatureC: 30.8, humidity: 79, pm25: 18, lastTelehealth: "6 hours ago", feverReports: 2, vulnerability: "Medium" },
  { id: "ELISA-MEX-018", community: "Chiapas Highlands", country: "Mexico", coordinates: { lat: 16.75, lng: -92.64 }, temperatureC: 28.6, humidity: 71, pm25: 26, lastTelehealth: "5 hours ago", feverReports: 0, vulnerability: "Low" },
];

const KPI_CARDS = [
  {
    label: "Climate Risk · Air & Heat",
    value: "Critical Alert",
    sub: "PM2.5 > 50µg/m³ detected. Triggering local SMS warnings.",
    icon: AlertTriangle,
    accent: "text-rose-600",
    ring: "ring-rose-200",
    bg: "bg-rose-50",
  },
  {
    label: "Health Access · Telemedicine",
    value: "450 Hours",
    sub: "Of Starlink Wi-Fi provided to rural clinics this month.",
    icon: Stethoscope,
    accent: "text-cyan-600",
    ring: "ring-cyan-200",
    bg: "bg-cyan-50",
  },
  {
    label: "Community Health Voice",
    value: "12 Fever Reports",
    sub: "Captured via Wi-Fi captive portals (Early Malaria / Dengue tracking).",
    icon: Users,
    accent: "text-sky-600",
    ring: "ring-sky-200",
    bg: "bg-sky-50",
  },
];

const vulnTone: Record<HealthNode["vulnerability"], string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Critical: "bg-rose-100 text-rose-700 border-rose-200",
};

const FitBounds = () => {
  const map = useMap();
  useMemo(() => {
    const bounds = HEALTH_NODES.map((n) => [n.coordinates.lat, n.coordinates.lng] as [number, number]);
    if (bounds.length) map.fitBounds(bounds, { padding: [50, 50] });
  }, [map]);
  return null;
};

const UnicefClimateHealthDashboard = () => {
  const [layer, setLayer] = useState<LayerMode>("base");
  const [selected, setSelected] = useState<HealthNode | null>(null);
  const iot = useIoTDataStream();

  const overlay = useMemo(() => {
    if (layer === "heat") {
      return "radial-gradient(circle at 28% 38%, hsla(0,85%,55%,0.55), transparent 30%), radial-gradient(circle at 55% 50%, hsla(20,90%,55%,0.5), transparent 32%), radial-gradient(circle at 78% 70%, hsla(35,95%,60%,0.45), transparent 30%)";
    }
    if (layer === "vector") {
      return "radial-gradient(circle at 40% 60%, hsla(270,75%,55%,0.5), transparent 32%), radial-gradient(circle at 70% 45%, hsla(220,80%,55%,0.45), transparent 32%), radial-gradient(circle at 22% 70%, hsla(250,75%,50%,0.4), transparent 30%)";
    }
    return "transparent";
  }, [layer]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-cyan-400/40">
              <AvatarFallback className="bg-cyan-500 text-white font-serif text-2xl">U</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-cyan-500 hover:bg-cyan-500 text-white border-0 text-[10px] tracking-wider uppercase font-semibold">
                  Active Pilot · Climate × Health Resilience 🔵
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-900 leading-tight">
                Early Warning & Community Health Intelligence
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                UNICEF Climate × Health Venture Programme · DePIN-powered last-mile telemetry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[10px] tracking-wider uppercase">
              <ShieldCheck className="h-3 w-3 mr-1 text-cyan-600" /> Open-Source · UNICEF Venture Fund Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[11px] uppercase tracking-wider text-slate-500 font-sans font-medium">
                  {kpi.label}
                </CardTitle>
                <div className={`p-2 rounded-md ${kpi.bg} ring-1 ${kpi.ring}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-serif ${kpi.accent}`}>{kpi.value}</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{kpi.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* MAP */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-serif text-slate-900">Last-Mile Climate Health Monitor</CardTitle>
              <p className="text-xs text-slate-500 mt-1">ELISA® IoT nodes · live heat & vector-borne disease risk</p>
            </div>
            <ToggleGroup
              type="single"
              value={layer}
              onValueChange={(v) => v && setLayer(v as LayerMode)}
              className="bg-slate-100 rounded-md p-1"
            >
              <ToggleGroupItem value="base" className="text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-cyan-700">
                Base
              </ToggleGroupItem>
              <ToggleGroupItem value="heat" className="text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-rose-700">
                Heat Vulnerability
              </ToggleGroupItem>
              <ToggleGroupItem value="vector" className="text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-violet-700">
                Vector-Borne Risk
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[520px] w-full">
              <MapContainer
                center={[0, 0]}
                zoom={2}
                scrollWheelZoom
                className="h-full w-full"
                style={{ background: "#e2e8f0" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <FitBounds />
                {HEALTH_NODES.map((n) => (
                  <CircleMarker
                    key={n.id}
                    center={[n.coordinates.lat, n.coordinates.lng]}
                    radius={9}
                    pathOptions={{
                      color: "#06b6d4",
                      fillColor: "#22d3ee",
                      fillOpacity: 0.85,
                      weight: 2,
                    }}
                    eventHandlers={{ click: () => setSelected(n) }}
                  >
                    <LTooltip>{n.community} · {n.country}</LTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>

              {/* Heatmap / vector overlay */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{ background: overlay, mixBlendMode: "multiply", opacity: layer === "base" ? 0 : 0.85 }}
              />

              {/* Pulsing aura for cyan markers */}
              <style>{`
                .leaflet-interactive { animation: unicefPulse 2.4s ease-in-out infinite; transform-origin: center; }
                @keyframes unicefPulse {
                  0%, 100% { filter: drop-shadow(0 0 0 rgba(34,211,238,0.7)); }
                  50% { filter: drop-shadow(0 0 8px rgba(34,211,238,0.9)); }
                }
              `}</style>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">Active Layer</div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-200" />
                  ELISA® Climate-Health Nodes ({HEALTH_NODES.length})
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NODE DETAIL SHEET */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-white text-slate-900 border-l border-slate-200 w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500 text-white border-0 text-[10px] uppercase tracking-wider">
                    ELISA® Node
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider border ${vulnTone[selected.vulnerability]}`}>
                    {selected.vulnerability} Vulnerability
                  </Badge>
                </div>
                <SheetTitle className="font-serif text-2xl text-slate-900">
                  {selected.community}
                </SheetTitle>
                <SheetDescription className="text-slate-500">
                  {selected.country} · {selected.id}
                </SheetDescription>
              </SheetHeader>

              {/* Climate Telemetry */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Climate Telemetry · Live
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Thermometer className="h-3.5 w-3.5 text-rose-500 mb-1" />
                    <div className="text-lg font-mono text-slate-900 iot-telemetry-value">{iot.temperature.toFixed(1)}°C</div>
                    <div className="text-[10px] text-slate-500">Temperature</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Droplets className="h-3.5 w-3.5 text-cyan-500 mb-1" />
                    <div className="text-lg font-mono text-slate-900 iot-telemetry-value">{iot.humidity.toFixed(1)}%</div>
                    <div className="text-[10px] text-slate-500">Humidity</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Wind className="h-3.5 w-3.5 text-amber-500 mb-1" />
                    <div className="text-lg font-mono text-slate-900 iot-telemetry-value">{iot.pm25.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-500">PM2.5 µg/m³</div>
                  </div>
                </div>
              </div>

              {/* Health Interventions */}
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Health Interventions · Log</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 rounded-md border border-cyan-200 bg-cyan-50 p-3">
                    <HeartPulse className="h-4 w-4 text-cyan-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Emergency Tele-health session established</div>
                      <div className="text-xs text-slate-500 mt-0.5">{selected.lastTelehealth} · Starlink uplink active</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Wifi className="h-4 w-4 text-sky-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Captive portal fever survey</div>
                      <div className="text-xs text-slate-500 mt-0.5">{selected.feverReports} reports captured this week</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Automated SMS heat warning dispatched</div>
                      <div className="text-xs text-slate-500 mt-0.5">Reach: 1,240 caregivers in 8 km radius</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Protocol */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                  <FileText className="h-4 w-4" />
                  View Open-Source Impact Receipt
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-2 uppercase tracking-wider">
                  UNICEF Venture Fund Ready · Public Goods Licensed
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UnicefClimateHealthDashboard;