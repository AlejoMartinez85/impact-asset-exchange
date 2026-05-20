import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapContainer, TileLayer, Marker, Tooltip as LTooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BarChart3,
  Bug,
  Clock,
  CloudRain,
  HeartPulse,
  MessageSquare,
  Users,
  Thermometer,
  Droplets,
  Wind,
  Wifi,
  Stethoscope,
  FileText,
  ShieldCheck,
  GraduationCap,
  Cross,
  Satellite,
  Radio,
  Signal,
  Sun,
  Flame,
  Activity,
  Lock,
  ShieldAlert,
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
type NodeKind = "school" | "clinic";

interface HealthNode {
  id: string;
  community: string;
  country: string;
  kind: NodeKind;
  coordinates: { lat: number; lng: number };
  temperatureC: number;
  humidity: number;
  pm25: number;
  lastTelehealth: string;
  feverReports: number;
  vulnerability: "Low" | "Medium" | "High" | "Critical";
}

const HEALTH_NODES: HealthNode[] = [
  { id: "ELISA-KEN-014", community: "Turkana North Rural School", country: "Kenya", kind: "school", coordinates: { lat: 3.12, lng: 35.6 }, temperatureC: 41.2, humidity: 22, pm25: 58, lastTelehealth: "2 hours ago", feverReports: 4, vulnerability: "Critical" },
  { id: "ELISA-GHA-021", community: "Bolgatanga Health Post", country: "Ghana", kind: "clinic", coordinates: { lat: 10.78, lng: -0.85 }, temperatureC: 38.4, humidity: 64, pm25: 47, lastTelehealth: "11 hours ago", feverReports: 3, vulnerability: "High" },
  { id: "ELISA-COL-009", community: "Leticia Amazonas School", country: "Colombia", kind: "school", coordinates: { lat: -4.21, lng: -69.94 }, temperatureC: 32.1, humidity: 88, pm25: 22, lastTelehealth: "1 day ago", feverReports: 2, vulnerability: "High" },
  { id: "ELISA-PER-031", community: "Madre de Dios Clinic", country: "Peru", kind: "clinic", coordinates: { lat: -12.59, lng: -69.18 }, temperatureC: 31.4, humidity: 84, pm25: 35, lastTelehealth: "3 hours ago", feverReports: 1, vulnerability: "Medium" },
  { id: "ELISA-MDG-007", community: "Mananjary Primary School", country: "Madagascar", kind: "school", coordinates: { lat: -21.23, lng: 48.34 }, temperatureC: 30.8, humidity: 79, pm25: 18, lastTelehealth: "6 hours ago", feverReports: 2, vulnerability: "Medium" },
  { id: "ELISA-MEX-018", community: "Chiapas Highlands Clinic", country: "Mexico", kind: "clinic", coordinates: { lat: 16.75, lng: -92.64 }, temperatureC: 28.6, humidity: 71, pm25: 26, lastTelehealth: "5 hours ago", feverReports: 0, vulnerability: "Low" },
];

const ANOMALY_FEED = [
  { time: "10:42 AM", tone: "rose", icon: "🔴", title: "Epidemiological Anomaly", body: "15 'Fever' responses clustered at Node ELISA-KEN-014 (Rural School). Encrypted alert dispatched to Frontline Health Worker via SMS." },
  { time: "09:15 AM", tone: "amber", icon: "🟠", title: "Heat-Stress Alert", body: "Temperature/Humidity threshold exceeded at Bolgatanga Health Post. Telemedicine bandwidth prioritized over Starlink uplink." },
  { time: "08:03 AM", tone: "cyan", icon: "🔵", title: "Air Quality Drift", body: "PM2.5 baseline at Leticia Amazonas drifted +18%. Cross-checked with MODIS aerosol; caregiver SMS queued." },
  { time: "07:21 AM", tone: "violet", icon: "🟣", title: "Vector-Borne Risk Model", body: "Humidity × LST signature consistent with Aedes proliferation window at Chiapas Highlands. Surveillance escalated." },
] as const;

const toneMap: Record<string, string> = {
  rose: "border-rose-200 bg-rose-50/80 text-rose-900",
  amber: "border-amber-200 bg-amber-50/80 text-amber-900",
  cyan: "border-cyan-200 bg-cyan-50/80 text-cyan-900",
  violet: "border-violet-200 bg-violet-50/80 text-violet-900",
};

const makeDivIcon = (kind: NodeKind) => {
  const Icon = kind === "school" ? GraduationCap : Cross;
  const ring = kind === "school" ? "ring-sky-300" : "ring-cyan-300";
  const bg = kind === "school" ? "bg-sky-500" : "bg-cyan-500";
  const svg = renderToStaticMarkup(<Icon size={14} color="white" strokeWidth={2.5} />);
  return L.divIcon({
    className: "unicef-marker",
    html: `<div class="relative flex items-center justify-center h-7 w-7 rounded-full ${bg} ring-4 ${ring} ring-opacity-60 shadow-md">${svg}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

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

/* ============= LIVE / ANIMATION HELPERS ============= */

const LiveBadge = () => (
  <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 text-[9px] uppercase tracking-[0.18em] font-mono px-1.5 py-0 h-4">
    <span className="relative flex h-1.5 w-1.5 mr-1">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
    Live
  </Badge>
);

/** Smoothly animates a number using a spring; rounds to integer */
const AnimatedPercent = ({ value, run }: { value: number; run: boolean }) => {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (v) => `${Math.round(v)}%`);
  useEffect(() => {
    mv.set(run ? value : 0);
  }, [run, value, mv]);
  return <motion.span>{rounded}</motion.span>;
};

/* ============= UNICEF SCORING CRITERIA ============= */

const SCORING_CRITERIA = [
  { label: "Climate Resilience Impact", value: 30, color: "bg-cyan-500", text: "text-cyan-700" },
  { label: "Health System Strengthening", value: 30, color: "bg-emerald-500", text: "text-emerald-700" },
  { label: "Technical & Open-Source Excellence", value: 20, color: "bg-violet-500", text: "text-violet-700" },
  { label: "Scalability & Venture Readiness", value: 20, color: "bg-amber-500", text: "text-amber-700" },
] as const;

const UnicefScoringSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div ref={ref} className="max-w-7xl mx-auto mt-10 mb-12">
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-serif text-slate-900">UNICEF Scoring Criteria Alignment</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Self-assessment against the Climate × Health Venture Programme rubric
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-600 border-slate-200">
              Total weighting · 100%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {SCORING_CRITERIA.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-slate-800">{c.label}</span>
                <span className={`text-lg font-mono font-semibold tabular-nums ${c.text}`}>
                  <AnimatedPercent value={c.value} run={inView} />
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${c.color}`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${c.value}%` } : { width: 0 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const UnicefClimateHealthDashboard = () => {
  const [layer, setLayer] = useState<LayerMode>("base");
  const [selected, setSelected] = useState<HealthNode | null>(null);
  const iot = useIoTDataStream();

  /* --- Live mock telemetry for the 6-Module Grid --- */
  const [pm25Live, setPm25Live] = useState(36);
  const [consultations, setConsultations] = useState(450);
  useEffect(() => {
    const pmId = setInterval(() => {
      setPm25Live(() => +(35 + Math.random() * 2).toFixed(1));
    }, 3500);
    const consultId = setInterval(() => {
      // Occasionally tick upward (~60% of ticks)
      setConsultations((prev) => (Math.random() > 0.4 ? prev + 1 : prev));
    }, 4500);
    return () => {
      clearInterval(pmId);
      clearInterval(consultId);
    };
  }, []);

  /* --- Sequential pipeline glow (0 → 1 → 2 → 3, repeat) --- */
  const [activeBlock, setActiveBlock] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveBlock((p) => (p + 1) % 4), 1200);
    return () => clearInterval(id);
  }, []);

  const schoolIcon = useMemo(() => makeDivIcon("school"), []);
  const clinicIcon = useMemo(() => makeDivIcon("clinic"), []);

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

      {/* AI ANOMALY DETECTION FEED */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card className="relative overflow-hidden bg-slate-950 text-slate-100 border-cyan-500/20 shadow-lg">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <CardHeader className="relative flex-row items-center justify-between space-y-0 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-cyan-500/10 ring-1 ring-cyan-400/30">
                <Activity className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <CardTitle className="text-sm font-mono uppercase tracking-[0.18em] text-cyan-200">
                  Live AI-Driven Anomalies · $LITRO Protocol
                </CardTitle>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Encrypted epidemiological command channel · zk-signed receipts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[10px] uppercase tracking-wider font-mono">
                <span className="relative flex h-1.5 w-1.5 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Channel Secure
              </Badge>
              <Badge variant="outline" className="border-cyan-400/30 text-cyan-300 text-[10px] uppercase tracking-wider font-mono">
                <Lock className="h-3 w-3 mr-1" /> AES-256
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative p-0">
            <div className="divide-y divide-cyan-500/10">
              {ANOMALY_FEED.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="grid grid-cols-[auto_auto_1fr] gap-3 items-start px-4 py-3 hover:bg-cyan-500/5 transition-colors"
                >
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5 tabular-nums">[{a.time}]</span>
                  <span className="text-sm leading-none mt-0.5">{a.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-100 font-mono tracking-wide">
                      {a.title}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{a.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
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
            <div className="relative h-[520px] w-full z-0">
              <MapContainer
                center={[0, 0]}
                zoom={2}
                scrollWheelZoom
                className="h-full w-full z-0"
                style={{ background: "#e2e8f0" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <FitBounds />
                {HEALTH_NODES.map((n) => (
                  <Marker
                    key={n.id}
                    position={[n.coordinates.lat, n.coordinates.lng]}
                    icon={n.kind === "school" ? schoolIcon : clinicIcon}
                    eventHandlers={{ click: () => setSelected(n) }}
                  >
                    <LTooltip>
                      {n.kind === "school" ? "🎓 School" : "✚ Clinic"} · {n.community} · {n.country}
                    </LTooltip>
                  </Marker>
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
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Node Types</div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-sky-500 ring-2 ring-sky-200">
                    <GraduationCap className="h-2.5 w-2.5 text-white" />
                  </span>
                  Schools ({HEALTH_NODES.filter((n) => n.kind === "school").length})
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-cyan-500 ring-2 ring-cyan-200">
                    <Cross className="h-2.5 w-2.5 text-white" />
                  </span>
                  Rural Clinics ({HEALTH_NODES.filter((n) => n.kind === "clinic").length})
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== SECTION 1: 6-MODULE IMPACT ARCHITECTURE GRID ========== */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-serif text-slate-900">Impact Architecture · 6-Module System</h2>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive climate-health intelligence stack powering last-mile communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* --- Module 1: Environmental Sentinels (Cyan) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-cyan-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-50 ring-1 ring-cyan-200">
                    <Wind className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-sans font-semibold text-slate-900">Real-Time Environmental Sentinels</CardTitle>
                      <LiveBadge />
                    </div>
                    <p className="text-[11px] text-cyan-600 uppercase tracking-wider font-medium">Continuous multi-sensor telemetry</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Activity className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800 flex items-baseline gap-2">
                      PM2.5 / PM10
                      <motion.span
                        key={pm25Live}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-xs text-cyan-700 tabular-nums"
                      >
                        {pm25Live.toFixed(1)} µg/m³
                      </motion.span>
                    </div>
                    <div className="text-[11px] text-slate-500">Real-time particulate monitoring · laser scattering method</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CloudRain className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">CO2 / VOCs</div>
                    <div className="text-[11px] text-slate-500">Indoor air quality sentinel · NDIR + MOS sensors</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Thermometer className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Temperature / Humidity / UV</div>
                    <div className="text-[11px] text-slate-500">Multi-sensor ambient tracking · SHT40 + VEML6075</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Flame className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Heat Stress Index (Derived)</div>
                    <div className="text-[11px] text-slate-500">Wet-bulb globe temperature proxy · population-adjusted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- Module 2: Predictive Risk (Violet) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-violet-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50 ring-1 ring-violet-200">
                    <BarChart3 className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-sans font-semibold text-slate-900">Predictive Climate-Health Risk</CardTitle>
                    <p className="text-[11px] text-violet-600 uppercase tracking-wider font-medium">AI-driven epidemiological forecasting</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Bug className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Malaria / Dengue Breeding Score</div>
                    <div className="text-[11px] text-slate-500">Rainfall + humidity vector proliferation model</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sun className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Heat-Illness Risk Band</div>
                    <div className="text-[11px] text-slate-500">Population vulnerability stratification by age</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Wind className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Respiratory Emergency Risk</div>
                    <div className="text-[11px] text-slate-500">PM2.5 exacerbation forecast · 48-hr horizon</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Environmental Anomaly Flag</div>
                    <div className="text-[11px] text-slate-500">AI deviation detection from 30-day rolling baseline</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- Module 3: Telemedicine (Emerald) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                    <Stethoscope className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-sans font-semibold text-slate-900">Telemedicine & Point-of-Care</CardTitle>
                    <p className="text-[11px] text-emerald-600 uppercase tracking-wider font-medium">Starlink-connected rural health delivery</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800 flex items-baseline gap-2">
                      Active Telemedicine Consultations
                      <motion.span
                        key={consultations}
                        initial={{ opacity: 0.4, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-mono text-xs text-emerald-700 tabular-nums"
                      >
                        {consultations}
                      </motion.span>
                    </div>
                    <div className="text-[11px] text-slate-500">Target: 675 sessions · live Starlink-connected</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Monthly Consultation Rate</div>
                    <div className="text-[11px] text-slate-500">67% increase vs. pre-ELISA baseline</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Triage-First-Response Rate</div>
                    <div className="text-[11px] text-slate-500">Nurse-led protocol compliance · 94% adherence</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Wifi className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Clinic Connectivity Uptime</div>
                    <div className="text-[11px] text-slate-500">&gt;95% · multi-mode fallback active (LoRa + LTE-M)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- Module 4: Community Voice (Amber) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-amber-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 ring-1 ring-amber-200">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-sans font-semibold text-slate-900">Community Voice & Epidemiology</CardTitle>
                      <LiveBadge />
                    </div>
                    <p className="text-[11px] text-amber-600 uppercase tracking-wider font-medium">Participatory disease surveillance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Wifi className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Household Symptom Reporting</div>
                    <div className="text-[11px] text-slate-500">Free Wi-Fi captive portal · symptom check-in</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Fever Cluster Detection</div>
                    <div className="text-[11px] text-slate-500">Spatial-temporal anomaly mapping · 5 km radius</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Droplets className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Diarrheal Disease Tracking</div>
                    <div className="text-[11px] text-slate-500">WASH + climate correlation · rainfall trigger</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <BarChart3 className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Symptom-to-Environment Correlation</div>
                    <div className="text-[11px] text-slate-500">Real-time regression pipeline · R² &gt; 0.82</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- Module 5: Infrastructure Resilience (Pink) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-pink-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-50 ring-1 ring-pink-200">
                    <ShieldCheck className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-sans font-semibold text-slate-900">Infrastructure Resilience</CardTitle>
                    <p className="text-[11px] text-pink-600 uppercase tracking-wider font-medium">Hardware durability & community stewardship</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Activity className="h-3.5 w-3.5 text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Node Uptime</div>
                    <div className="text-[11px] text-slate-500">&gt;94% · 6-sensor array redundancy per node</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="h-3.5 w-3.5 text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Zero-Vandalism Rate</div>
                    <div className="text-[11px] text-slate-500">100% · community stewardship + co-ownership model</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users className="h-3.5 w-3.5 text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Community Steward Active Status</div>
                    <div className="text-[11px] text-slate-500">12 local stewards certified · weekly check-in</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sun className="h-3.5 w-3.5 text-pink-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Energy Generation per Node</div>
                    <div className="text-[11px] text-slate-500">18W solar panel + 40Ah LiFePO₄ battery</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- Module 6: Child-Centered Outcomes (Rose) --- */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white border-slate-200 shadow-sm border-t-4 border-t-rose-500 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 ring-1 ring-rose-200">
                    <Baby className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-sans font-semibold text-slate-900">Child-Centered Impact Outcomes</CardTitle>
                    <p className="text-[11px] text-rose-600 uppercase tracking-wider font-medium">Pediatric health & climate safety metrics</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Users className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Children Under 5 in Catchment</div>
                    <div className="text-[11px] text-slate-500">13,500 total population · 2,700 U5 children (20%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">School Climate-Safety Protocols</div>
                    <div className="text-[11px] text-slate-500">Heat-dismissal protocols active · WBGT &gt; 32°C trigger</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Alert-to-Action Response Time</div>
                    <div className="text-[11px] text-slate-500">&lt;2 hrs · frontline worker SMS dispatch verified</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <HeartPulse className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Pediatric Emergency Admissions</div>
                    <div className="text-[11px] text-slate-500">Referral pathway to district hospital · GPS tagged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ========== SECTION 2: DATA FLOW PIPELINE ========== */}
      <div className="max-w-7xl mx-auto mt-10 mb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-serif text-slate-900">Data Flow Pipeline</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Hardware-Verified Telemetry → Cryptographic Proof → Predictive Intelligence → Health System Action
              </p>
            </CardHeader>
            <CardContent className="py-8 px-4 md:px-6">
              {(() => {
                const blocks = [
                  { layer: "Layer 1 · Edge", title: "ELISA® SENSORS", body: "IoT multi-sensor arrays\n6-in-1 environmental telemetry", border: "border-slate-200", bg: "bg-slate-50", titleColor: "text-slate-900", layerColor: "text-slate-400", bodyColor: "text-slate-500", glow: "56,189,248" },
                  { layer: "Layer 2 · Protocol", title: "$LITRO PROTOCOL", body: "Cryptographic proof-of-work\nzk-signed data receipts", border: "border-cyan-200", bg: "bg-gradient-to-br from-cyan-50 to-sky-50", titleColor: "text-cyan-900", layerColor: "text-cyan-500", bodyColor: "text-cyan-700", glow: "34,211,238" },
                  { layer: "Layer 3 · Intelligence", title: "AI RISK ENGINE", body: "Predictive health intelligence\nAnomaly + vector-borne models", border: "border-violet-200", bg: "bg-gradient-to-br from-violet-50 to-purple-50", titleColor: "text-violet-900", layerColor: "text-violet-500", bodyColor: "text-violet-700", glow: "139,92,246" },
                  { layer: "Layer 4 · Action", title: "DHIS2 / UNICEF", body: "Health system action\nDistrict + national dashboards", border: "border-emerald-200", bg: "bg-gradient-to-br from-emerald-50 to-teal-50", titleColor: "text-emerald-900", layerColor: "text-emerald-500", bodyColor: "text-emerald-700", glow: "16,185,129" },
                ];
                return (
                  <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
                    {blocks.map((b, i) => (
                      <div key={b.title} className="flex flex-col md:flex-row items-center flex-1 w-full">
                        <motion.div
                          className={`flex-1 w-full rounded-xl border ${b.border} ${b.bg} p-5 text-center relative transition-colors`}
                          animate={{
                            boxShadow:
                              activeBlock === i
                                ? `0 0 0 1px rgba(${b.glow},0.55), 0 8px 28px -8px rgba(${b.glow},0.45)`
                                : `0 0 0 0 rgba(${b.glow},0), 0 1px 2px rgba(15,23,42,0.04)`,
                          }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                          <div className={`text-[10px] uppercase tracking-[0.15em] ${b.layerColor} mb-2 font-medium`}>{b.layer}</div>
                          <div className={`text-sm font-sans font-bold ${b.titleColor}`}>{b.title}</div>
                          <div className={`text-[11px] ${b.bodyColor} mt-1.5 leading-relaxed whitespace-pre-line`}>{b.body}</div>
                        </motion.div>
                        {i < blocks.length - 1 && (
                          <motion.div
                            className="shrink-0 px-2 py-2 md:py-0"
                            animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                          >
                            <ArrowRight
                              className={`h-5 w-5 ${activeBlock === i ? "text-cyan-500" : "text-slate-300"} transition-colors md:rotate-0 rotate-90`}
                            />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ========== SECTION 3: UNICEF SCORING CRITERIA ALIGNMENT ========== */}
      <UnicefScoringSection />

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
                  Multi-Sensor Array · Live
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
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <Activity className="h-3.5 w-3.5 text-slate-500 mb-1" />
                    <div className="text-lg font-mono text-slate-900">410 <span className="text-xs text-slate-500">ppm</span></div>
                    <div className="text-[10px] text-slate-500">CO₂</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 mb-1" />
                    <div className="text-lg font-mono text-emerald-700">Normal</div>
                    <div className="text-[10px] text-slate-500">VOCs</div>
                  </div>
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                    <Sun className="h-3.5 w-3.5 text-amber-600 mb-1" />
                    <div className="text-lg font-mono text-amber-700">8 <span className="text-xs text-amber-600">High</span></div>
                    <div className="text-[10px] text-amber-700">UV Index</div>
                  </div>
                  <div className="col-span-3 rounded-md border border-rose-200 bg-rose-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-rose-600" />
                        <div className="text-[10px] uppercase tracking-wider text-rose-700">Heat Stress Index</div>
                      </div>
                      <Badge className="bg-rose-500 text-white border-0 text-[10px] uppercase tracking-wider">Warning</Badge>
                    </div>
                    <div className="text-2xl font-mono text-rose-700 mt-1">38°C</div>
                  </div>
                </div>
              </div>

              {/* Multi-mode Connectivity */}
              <div className="mt-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Multi-mode Connectivity</div>
                <div className="rounded-md border border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-cyan-600" />
                      <span className="text-sm font-medium text-slate-900">Starlink</span>
                      <Badge className="bg-emerald-500 text-white border-0 text-[10px] uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                        Active
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Primary</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">LoRaWAN</span>
                      <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px] uppercase tracking-wider">Standby</Badge>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Fallback</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">LTE-M</span>
                      <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px] uppercase tracking-wider">Standby</Badge>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Fallback</span>
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