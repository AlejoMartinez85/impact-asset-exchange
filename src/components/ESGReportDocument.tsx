import { Sun, Wifi, Lightbulb, Globe, Shield, Hash, Zap, Droplets, Trash2, Monitor, Clock, Users } from "lucide-react";
import { sponsorInfo, kpiData, sdgRadarData } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generatedPoles } from "@/data/generatePoles";
import { ESGFocus, ESG_FOCUS_OPTIONS, computeESGMetrics, type ESGDerivedMetrics } from "@/data/esgFocusData";

// ─── Focus-specific config ───
const FOCUS_CONFIG: Record<ESGFocus, {
  label: string;
  executiveSummary: string;
  heroKPIs: (m: ESGDerivedMetrics) => { label: string; value: string; sub: string }[];
  ancillaryKPIs: (m: ESGDerivedMetrics) => { label: string; value: string; sub: string }[];
  primarySDGs: number[];
  accentColor: string;
}> = {
  carbon_climate: {
    label: "Carbon & Climate Action",
    executiveSummary: `This report certifies the successful mitigation of Scope 3 emissions and the displacement of fossil fuels through the deployment of decentralized ELISA® solar infrastructure. By replacing kerosene lamps and diesel generators with clean energy solutions, ${sponsorInfo.name} has achieved measurable, IoT-verified carbon reductions aligned with the Paris Agreement and Science-Based Targets initiative (SBTi).`,
    heroKPIs: (m) => [
      { label: "Scope 3 CO₂ Avoided", value: `${m.co2AvoidedTons.toLocaleString()} Tons`, sub: "Verified emissions displacement vs. diesel baseline" },
      { label: "Fossil Fuels Displaced", value: `${(m.keroseneDisplacedLiters / 1000).toFixed(1)}K Liters`, sub: "Kerosene equivalent eliminated from communities" },
      { label: "E-Waste Avoided", value: `${m.ewasteAvoidedKg.toLocaleString()} kg`, sub: "Batteries & plastics kept from landfills" },
    ],
    ancillaryKPIs: (m) => [
      { label: "WiFi Uptime", value: `${(m.wifiUptimeHours / 1000).toFixed(0)}K hrs`, sub: "Connectivity delivered" },
      { label: "Community Beneficiaries", value: `${(m.communityBeneficiaries / 1000).toFixed(1)}K`, sub: "Direct impact" },
      { label: "Public Lighting", value: `${(m.publicLightingUptimeHours / 1000).toFixed(0)}K hrs`, sub: "Safe-lighting hours" },
    ],
    primarySDGs: [7, 13],
    accentColor: "#10b981",
  },
  digital_inclusion: {
    label: "Digital Inclusion & Education",
    executiveSummary: `This report certifies the expansion of digital equity, measuring exact gigabytes transferred and educational uptime delivered through the ELISA® network. By providing free, solar-powered WiFi connectivity to underserved communities, ${sponsorInfo.name} is bridging the digital divide and enabling access to education, healthcare, and economic opportunity for thousands of beneficiaries.`,
    heroKPIs: (m) => [
      { label: "Total WiFi Uptime", value: `${(m.wifiUptimeHours / 1000).toFixed(0)}K Hours`, sub: "Cumulative free connectivity delivered" },
      { label: "Data Transferred", value: `${(m.dataTransferredGB / 1000).toFixed(1)} TB`, sub: "Community bandwidth enabling digital access" },
      { label: "Unique Digital Beneficiaries", value: m.uniqueDigitalBeneficiaries.toLocaleString(), sub: "Individuals connected to the digital economy" },
    ],
    ancillaryKPIs: (m) => [
      { label: "CO₂ Avoided", value: `${m.co2AvoidedTons.toLocaleString()}t`, sub: "Scope 3 reduction" },
      { label: "Clean Energy", value: `${(kpiData.cleanEnergy / 1000).toFixed(0)}K kWh`, sub: "Solar output" },
      { label: "Nighttime Economy", value: `${(m.nighttimeEconomyHours / 1000).toFixed(0)}K hrs`, sub: "6PM–10PM window" },
    ],
    primarySDGs: [4, 9, 10],
    accentColor: "#3b82f6",
  },
  community_safety: {
    label: "Community Safety & Economy",
    executiveSummary: `This report certifies the economic and safety uplift provided by uninterrupted nighttime public lighting infrastructure powered by the ELISA® network. By delivering reliable solar-powered illumination during critical evening hours (6PM–10PM), ${sponsorInfo.name} has enabled extended economic activity, reduced nighttime incidents, and improved quality of life across ${sponsorInfo.communities} communities.`,
    heroKPIs: (m) => [
      { label: "Nighttime Economy Hours", value: `${(m.nighttimeEconomyHours / 1000).toFixed(0)}K Hours`, sub: "6PM–10PM economic activity window" },
      { label: "Public Lighting Uptime", value: `${(m.publicLightingUptimeHours / 1000).toFixed(0)}K Hours`, sub: "Continuous illumination for safety" },
      { label: "Community Beneficiaries", value: m.communityBeneficiaries.toLocaleString(), sub: "Direct safety & economic impact" },
    ],
    ancillaryKPIs: (m) => [
      { label: "CO₂ Avoided", value: `${m.co2AvoidedTons.toLocaleString()}t`, sub: "Scope 3 reduction" },
      { label: "WiFi Uptime", value: `${(m.wifiUptimeHours / 1000).toFixed(0)}K hrs`, sub: "Connectivity" },
      { label: "Data Transferred", value: `${(m.dataTransferredGB / 1000).toFixed(1)} TB`, sub: "Bandwidth" },
    ],
    primarySDGs: [11, 7],
    accentColor: "#f59e0b",
  },
};

const SDG_DONUT_DATA = [
  { name: "SDG 7 – Clean Energy", value: 28, color: "#FCC30B", num: 7 },
  { name: "SDG 13 – Climate Action", value: 22, color: "#3F7E44", num: 13 },
  { name: "SDG 9 – Infrastructure", value: 18, color: "#FD6925", num: 9 },
  { name: "SDG 11 – Sustainable Cities", value: 14, color: "#FD9D24", num: 11 },
  { name: "SDG 10 – Reduced Inequalities", value: 10, color: "#DD1367", num: 10 },
  { name: "SDG 4 – Quality Education", value: 8, color: "#C5192D", num: 4 },
];

const GOVERNANCE_DATA = [
  { category: "Data Transparency", telemetry: 92, audit: 88, compliance: 95 },
  { category: "Asset Traceability", telemetry: 98, audit: 96, compliance: 100 },
  { category: "Reporting Standards", telemetry: 85, audit: 90, compliance: 94 },
];

const MONTHLY_SOCIAL_DATA = [
  { month: "Jul", wifi: 4200, lighting: 3570 },
  { month: "Aug", wifi: 4800, lighting: 4080 },
  { month: "Sep", wifi: 4550, lighting: 3870 },
  { month: "Oct", wifi: 5100, lighting: 4335 },
  { month: "Nov", wifi: 5600, lighting: 4760 },
  { month: "Dec", wifi: 5300, lighting: 4505 },
  { month: "Jan", wifi: 3900, lighting: 3315 },
  { month: "Feb", wifi: 4100, lighting: 3485 },
  { month: "Mar", wifi: 4700, lighting: 3995 },
];

const MONTHLY_ENV_DATA = [
  { month: "Jul", kwh: 54200, co2: 210 },
  { month: "Aug", kwh: 61800, co2: 238 },
  { month: "Sep", kwh: 58400, co2: 225 },
  { month: "Oct", kwh: 67100, co2: 259 },
  { month: "Nov", kwh: 72500, co2: 280 },
  { month: "Dec", kwh: 69300, co2: 267 },
  { month: "Jan", kwh: 48900, co2: 189 },
  { month: "Feb", kwh: 52700, co2: 203 },
  { month: "Mar", kwh: 60320, co2: 232 },
];

const SDG_DATA = [
  { num: 4, title: "Quality Education", icon: "📚", color: "#C5192D", desc: "Free WiFi connectivity enabling remote education access for 12,400+ students in underserved communities." },
  { num: 7, title: "Affordable & Clean Energy", icon: "⚡", color: "#FCC30B", desc: "485,320 kWh of decentralized solar energy generated, powering lighting and connectivity infrastructure." },
  { num: 9, title: "Industry, Innovation & Infrastructure", icon: "🏗️", color: "#FD6925", desc: "Resilient, self-sustaining ELISA® poles deployed across 6 countries with 99.2% average uptime." },
  { num: 10, title: "Reduced Inequalities", icon: "⚖️", color: "#DD1367", desc: "Bridging the digital divide by providing free internet to last-mile communities with zero user cost." },
  { num: 11, title: "Sustainable Cities & Communities", icon: "🏘️", color: "#FD9D24", desc: "Public lighting infrastructure improving safety and mobility in 47 off-grid communities." },
  { num: 13, title: "Climate Action", icon: "🌍", color: "#3F7E44", desc: "1,872 tons of Scope 3 CO₂ emissions avoided through clean energy displacement of diesel generators." },
];

const REPORT_DATE = "March 10, 2026";
const AUDIT_HASH = "0xA3F7…C912-ESG-Q1-2026";

const activePoles = generatedPoles.filter((u) => u.status === "active");
const auditSample = activePoles.slice(0, 8);

const KPIBlock = ({ label, value, sub, highlighted }: { label: string; value: string; sub?: string; highlighted?: boolean }) => (
  <div className={`text-center px-4 py-5 border rounded-lg ${highlighted ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200" : "border-gray-200 bg-gray-50"}`}>
    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">{label}</p>
    <p className={`text-2xl font-bold font-serif ${highlighted ? "text-blue-900" : "text-gray-900"}`}>{value}</p>
    {sub && <p className="text-[10px] text-gray-500 mt-1">{sub}</p>}
  </div>
);

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3 mb-4 mt-10 border-b-2 border-gray-900 pb-2">
    <span className="text-xs font-bold text-gray-400 tracking-widest font-mono">{number}</span>
    <h2 className="text-lg font-bold text-gray-900 font-serif tracking-tight">{title}</h2>
  </div>
);

interface ESGReportDocumentProps {
  esgFocus?: ESGFocus;
  reportingPeriod?: string;
}

const ESGReportDocument = ({ esgFocus = "carbon_climate", reportingPeriod = "Q1 2026 (Jan – Mar)" }: ESGReportDocumentProps) => {
  const config = FOCUS_CONFIG[esgFocus];
  
  const metrics = computeESGMetrics({
    co2Avoided: kpiData.co2Avoided,
    cleanEnergy: kpiData.cleanEnergy,
    uptimeHours: kpiData.uptimeHours,
    totalBeneficiaries: kpiData.totalBeneficiaries,
    activePoles: activePoles.length,
  });

  const heroKPIs = config.heroKPIs(metrics);
  const ancillaryKPIs = config.ancillaryKPIs(metrics);

  // Sort SDGs: primary ones first and visually enlarged
  const sortedSDGs = [...SDG_DATA].sort((a, b) => {
    const aP = config.primarySDGs.includes(a.num) ? 0 : 1;
    const bP = config.primarySDGs.includes(b.num) ? 0 : 1;
    return aP - bP;
  });

  return (
    <div
      id="esg-report-document"
      className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl print:shadow-none"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ══════════ COVER PAGE ══════════ */}
      <div className="relative px-12 pt-16 pb-12 border-b-4 border-gray-900">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
              <Sun className="h-5 w-5 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-gray-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Litro de Luz</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Impact Exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2">
            <div className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">AB</div>
            <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{sponsorInfo.name}</span>
          </div>
        </div>

        {/* Title block with focus badge */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif", color: config.accentColor }}>Verified ESG Impact Report</p>
            <span
              className="text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: config.accentColor }}
            >
              {config.label}
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-2">
            Verified ESG Impact &<br />Scope 3 Telemetry Report
          </h1>
          <p className="text-base text-gray-500 italic mt-3">"Turning Sunlight into Measurable Progress"</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-6 text-[11px]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-[9px] mb-0.5">Sponsor</p>
            <p className="font-semibold text-gray-800">{sponsorInfo.name}</p>
          </div>
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-[9px] mb-0.5">Reporting Period</p>
            <p className="font-semibold text-gray-800">{reportingPeriod}</p>
          </div>
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-[9px] mb-0.5">Generated</p>
            <p className="font-semibold text-gray-800">{REPORT_DATE}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400" style={{ fontFamily: "'Courier New', monospace" }}>
          <Hash className="h-3 w-3" />
          <span>Audit Hash: {AUDIT_HASH}</span>
        </div>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div className="px-12 py-10" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* §1 EXECUTIVE SUMMARY — Context-Aware */}
        <SectionTitle number="01" title="Executive Summary" />
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          {config.executiveSummary}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          All metrics presented herein are derived from live telemetry transmitted by individual ELISA® poles across <strong className="text-gray-900">{sponsorInfo.communities} communities</strong> in <strong className="text-gray-900">{sponsorInfo.countries} countries</strong>, verified for auditability. This report is generated in compliance with GRI 305, SASB, and TCFD frameworks.
        </p>

        {/* §2 PRIMARY FOCUS KPIs — Hero Section */}
        <SectionTitle number="02" title={`Primary Focus — ${config.label}`} />
        <div className="grid grid-cols-3 gap-4 mb-5">
          {heroKPIs.map((kpi) => (
            <KPIBlock key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} highlighted />
          ))}
        </div>

        {/* Contextual callout */}
        <div className="border-l-4 rounded-r-lg p-4 text-sm leading-relaxed mb-6" style={{ borderColor: config.accentColor, backgroundColor: `${config.accentColor}10` }}>
          {esgFocus === "carbon_climate" && (
            <p className="text-gray-800"><strong>Carbon Offset Equivalent:</strong> The {kpiData.co2Avoided.toLocaleString()} tons of CO₂ avoided is equivalent to removing approximately <strong>{Math.round(kpiData.co2Avoided / 4.6).toLocaleString()} passenger vehicles</strong> from the road for one year, or preserving <strong>{Math.round(kpiData.co2Avoided * 16.5).toLocaleString()} trees</strong> worth of carbon sequestration.</p>
          )}
          {esgFocus === "digital_inclusion" && (
            <p className="text-gray-800"><strong>Digital Equity Impact:</strong> The {(metrics.dataTransferredGB / 1000).toFixed(1)} TB of data transferred has enabled access to educational resources for an estimated <strong>12,400+ students</strong>, with an average of <strong>32 concurrent WiFi users</strong> per ELISA® unit during peak hours.</p>
          )}
          {esgFocus === "community_safety" && (
            <p className="text-gray-800"><strong>Safety & Economic Uplift:</strong> Communities with ELISA® lighting infrastructure have reported an <strong>89% reduction in nighttime incidents</strong> and extended productive economic hours by an average of <strong>4.2 hours per household per day</strong>.</p>
          )}
        </div>

        {/* Ancillary ESG Impact */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Ancillary ESG Impact</h3>
          <div className="grid grid-cols-3 gap-3">
            {ancillaryKPIs.map((kpi) => (
              <KPIBlock key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} />
            ))}
          </div>
        </div>

        {/* §3 ENVIRONMENTAL TRENDS */}
        <SectionTitle number="03" title="Environmental Trends" />
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-widest">Monthly Environmental Output — kWh Generated vs CO₂ Avoided (Tons)</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ENV_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <YAxis yAxisId="kwh" tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="co2" orientation="right" tick={{ fontSize: 10, fill: "#6b7280" }} unit="t" />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="kwh" dataKey="kwh" name="kWh Generated" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="co2" dataKey="co2" name="CO₂ Avoided (t)" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* §4 SOCIAL ECOSYSTEM */}
        <SectionTitle number="04" title="Social Ecosystem Trends" />
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-widest">Monthly Social Output — WiFi Uptime & Lighting Hours</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_SOCIAL_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value: number) => `${value.toLocaleString()} hrs`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="wifi" name="WiFi Uptime (hrs)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lighting" name="Lighting Hours" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* §5 UN SDG ALIGNMENT — Focus-Aware */}
        <SectionTitle number="05" title="UN Sustainable Development Goal Alignment Matrix" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          {sortedSDGs.map((sdg) => {
            const isPrimary = config.primarySDGs.includes(sdg.num);
            return (
              <div
                key={sdg.num}
                className={`flex gap-3 p-3 border rounded-lg transition-all ${isPrimary ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-200 shadow-sm" : "border-gray-200 bg-white"}`}
              >
                <div
                  className={`rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 ${isPrimary ? "w-14 h-14 text-sm" : "w-11 h-11 text-xs"}`}
                  style={{ backgroundColor: sdg.color }}
                >
                  {sdg.num}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-gray-900 leading-tight mb-0.5 ${isPrimary ? "text-xs" : "text-[11px]"}`}>
                    SDG {sdg.num}: {sdg.title}
                    {isPrimary && <span className="ml-1.5 text-[9px] font-bold text-blue-600 uppercase">★ Primary</span>}
                  </p>
                  <p className="text-[10px] text-gray-600 leading-snug">{sdg.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SDG Donut */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-widest">Relative SDG Contribution Weight (%)</p>
          <div className="flex items-center gap-6">
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SDG_DONUT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2} strokeWidth={0}>
                    {SDG_DONUT_DATA.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        opacity={config.primarySDGs.includes(entry.num) ? 1 : 0.45}
                        strokeWidth={config.primarySDGs.includes(entry.num) ? 2 : 0}
                        stroke={config.primarySDGs.includes(entry.num) ? "#1e40af" : "none"}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-1.5 text-[10px]">
              {SDG_DONUT_DATA.map((entry, i) => {
                const isPrimary = config.primarySDGs.includes(entry.num);
                return (
                  <div key={i} className={`flex items-center gap-2 ${isPrimary ? "font-bold" : ""}`}>
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color, opacity: isPrimary ? 1 : 0.5 }} />
                    <span className={isPrimary ? "text-gray-900" : "text-gray-500"}>{entry.name}</span>
                    {isPrimary && <span className="text-[8px] text-blue-600 font-bold">★</span>}
                    <span className={`ml-auto ${isPrimary ? "text-gray-900" : "text-gray-500"}`}>{entry.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* §6 GOVERNANCE */}
        <SectionTitle number="06" title="Governance & Transparency — The 'G' in ESG" />
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          ELISA® infrastructure adheres to GRI 305, SASB, and TCFD disclosure frameworks. All telemetry data is cryptographically hashed and stored on tamper-evident ledgers, ensuring full auditability for corporate compliance teams.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-widest">Governance Compliance Scores (%)</p>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GOVERNANCE_DATA} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} unit="%" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: "#6b7280" }} width={75} />
                <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value: number) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="telemetry" name="Live Telemetry" stackId="a" fill="#3b82f6" />
                <Bar dataKey="audit" name="Audit Trail" stackId="a" fill="#10b981" />
                <Bar dataKey="compliance" name="Framework Compliance" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* §7 AUDIT LEDGER */}
        <SectionTitle number="07" title="Audit Ledger — Asset Traceability" />
        <p className="text-[11px] text-gray-500 mb-3">
          Sample of active ELISA® serial numbers with GPS coordinates and individual uptime, proving data is grounded in physical, auditable assets.
        </p>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-[10px]" style={{ fontFamily: "'Courier New', monospace" }}>
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-3 py-2 font-semibold">Serial Number</th>
                <th className="text-left px-3 py-2 font-semibold">Community</th>
                <th className="text-left px-3 py-2 font-semibold">Country</th>
                <th className="text-right px-3 py-2 font-semibold">Latitude</th>
                <th className="text-right px-3 py-2 font-semibold">Longitude</th>
                <th className="text-right px-3 py-2 font-semibold">Uptime %</th>
                <th className="text-right px-3 py-2 font-semibold">kWh</th>
              </tr>
            </thead>
            <tbody>
              {auditSample.map((pole, i) => (
                <tr key={pole.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-1.5 font-semibold text-gray-900">{pole.id}</td>
                  <td className="px-3 py-1.5 text-gray-700">{pole.community}</td>
                  <td className="px-3 py-1.5 text-gray-700">{pole.country}</td>
                  <td className="px-3 py-1.5 text-right text-gray-600">{pole.lat.toFixed(4)}</td>
                  <td className="px-3 py-1.5 text-right text-gray-600">{pole.lng.toFixed(4)}</td>
                  <td className="px-3 py-1.5 text-right font-semibold text-emerald-700">{pole.uptime.toFixed(1)}%</td>
                  <td className="px-3 py-1.5 text-right text-gray-700">{pole.kwhProduced.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-gray-400 mt-2 text-right italic">
          Showing 8 of {activePoles.length} active assets. Full ledger available via API.
        </p>

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t-2 border-gray-900 flex items-center justify-between">
          <div className="text-[9px] text-gray-400 leading-relaxed">
            <p>© {new Date().getFullYear()} Litro de Luz — Impact Exchange Platform</p>
            <p>This report is auto-generated from verified telemetry data. Not financial advice.</p>
            <p className="mt-0.5 font-semibold text-gray-500">ESG Focus: {config.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
            <Shield className="h-3 w-3" />
            <span>Tamper-evident · GRI 305 · SASB · TCFD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGReportDocument;
