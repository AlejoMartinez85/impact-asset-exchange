import { Sun, Wifi, Lightbulb, Globe, Shield, Hash } from "lucide-react";
import { sponsorInfo, kpiData, sdgRadarData } from "@/data/mockData";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SDG_DONUT_DATA = [
  { name: "SDG 7 – Clean Energy", value: 28, color: "#FCC30B" },
  { name: "SDG 13 – Climate Action", value: 22, color: "#3F7E44" },
  { name: "SDG 9 – Infrastructure", value: 18, color: "#FD6925" },
  { name: "SDG 11 – Sustainable Cities", value: 14, color: "#FD9D24" },
  { name: "SDG 10 – Reduced Inequalities", value: 10, color: "#DD1367" },
  { name: "SDG 4 – Quality Education", value: 8, color: "#C5192D" },
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
import { generatedPoles } from "@/data/generatePoles";

const REPORT_DATE = "March 8, 2026";
const AUDIT_HASH = "0xA3F7…C912-ESG-Q3-2026";
const REPORTING_PERIOD = "Q3 2026 (Jul – Sep)";

const SDG_DATA = [
  { num: 4, title: "Quality Education", icon: "📚", color: "#C5192D", desc: "Free WiFi connectivity enabling remote education access for 12,400+ students in underserved communities." },
  { num: 7, title: "Affordable & Clean Energy", icon: "⚡", color: "#FCC30B", desc: "485,320 kWh of decentralized solar energy generated, powering lighting and connectivity infrastructure." },
  { num: 9, title: "Industry, Innovation & Infrastructure", icon: "🏗️", color: "#FD6925", desc: "Resilient, self-sustaining ELISA® poles deployed across 6 countries with 99.2% average uptime." },
  { num: 10, title: "Reduced Inequalities", icon: "⚖️", color: "#DD1367", desc: "Bridging the digital divide by providing free internet to last-mile communities with zero user cost." },
  { num: 11, title: "Sustainable Cities & Communities", icon: "🏘️", color: "#FD9D24", desc: "Public lighting infrastructure improving safety and mobility in 47 off-grid communities." },
  { num: 13, title: "Climate Action", icon: "🌍", color: "#3F7E44", desc: "1,872 tons of Scope 3 CO₂ emissions avoided through clean energy displacement of diesel generators." },
];

const activePoles = generatedPoles.filter((u) => u.status === "active");
const auditSample = activePoles.slice(0, 8);

const KPIBlock = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="text-center px-4 py-5 border border-gray-200 rounded-lg bg-gray-50">
    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900 font-serif">{value}</p>
    {sub && <p className="text-[10px] text-gray-500 mt-1">{sub}</p>}
  </div>
);

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-baseline gap-3 mb-4 mt-10 border-b-2 border-gray-900 pb-2">
    <span className="text-xs font-bold text-gray-400 tracking-widest font-mono">{number}</span>
    <h2 className="text-lg font-bold text-gray-900 font-serif tracking-tight">{title}</h2>
  </div>
);

const ESGReportDocument = () => {
  return (
    <div
      id="esg-report-document"
      className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl print:shadow-none"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* ══════════ COVER PAGE ══════════ */}
      <div className="relative px-12 pt-16 pb-12 border-b-4 border-gray-900">
        {/* Logos */}
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

        {/* Title block */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-700 font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Verified ESG Impact Report</p>
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
            <p className="font-semibold text-gray-800">{REPORTING_PERIOD}</p>
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

        {/* §1 EXECUTIVE SUMMARY */}
        <SectionTitle number="01" title="Executive Summary" />
        <p className="text-sm text-gray-700 leading-relaxed mb-2">
          This document certifies the real-time ESG outcomes generated by the decentralized <strong className="text-gray-900">ELISA®</strong> (Energy-Light-Inclusive-Sustainable-Affordable) infrastructure network. By shifting from philanthropy to data-driven investment, <strong className="text-gray-900">{sponsorInfo.name}</strong> has successfully captured verified Scope 3 CO₂ reductions and community uptime across <strong className="text-gray-900">{sponsorInfo.communities} communities</strong> in <strong className="text-gray-900">{sponsorInfo.countries} countries</strong>.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          All metrics presented herein are derived from live telemetry transmitted by individual ELISA® poles and verified on-chain for auditability. This report is generated in compliance with GRI 305, SASB, and TCFD frameworks.
        </p>

        {/* §2 ENVIRONMENTAL IMPACT */}
        <SectionTitle number="02" title="Environmental Impact — The 'E' in ESG" />
        <div className="grid grid-cols-2 gap-4 mb-5">
          <KPIBlock label="Total Clean Energy Generated" value={`${kpiData.cleanEnergy.toLocaleString()} kWh`} sub="Cumulative solar output from active ELISA® fleet" />
          <KPIBlock label="Scope 3 CO₂ Avoided" value={`${kpiData.co2Avoided.toLocaleString()} Tons`} sub="Verified emissions displacement vs. diesel baseline" />
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900 leading-relaxed mb-4">
          <strong>Carbon Offset Equivalent:</strong> The {kpiData.co2Avoided.toLocaleString()} tons of CO₂ avoided is equivalent to removing approximately <strong>{Math.round(kpiData.co2Avoided / 4.6).toLocaleString()} passenger vehicles</strong> from the road for one year, or preserving <strong>{Math.round(kpiData.co2Avoided * 16.5).toLocaleString()} trees</strong> worth of carbon sequestration.
        </div>

        {/* Monthly Trends Chart */}
        <div className="border border-gray-200 rounded-lg p-4 mb-2">
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

        {/* §3 SOCIAL ECOSYSTEM */}
        <SectionTitle number="03" title="Social Ecosystem — The 'S' in ESG" />
        <div className="grid grid-cols-3 gap-4 mb-5">
          <KPIBlock label="Total Beneficiaries" value={kpiData.totalBeneficiaries.toLocaleString()} sub="Direct community members served" />
          <KPIBlock label="WiFi Uptime" value={`${Math.round(kpiData.uptimeHours / 1000).toLocaleString()}K hrs`} sub="Cumulative free connectivity hours" />
          <KPIBlock label="Public Lighting" value={`${Math.round(kpiData.uptimeHours * 0.85 / 1000).toLocaleString()}K hrs`} sub="Cumulative safe-lighting hours" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          By providing free, decentralized internet and lighting infrastructure, the ELISA® network bridges the digital divide and fosters safe, connected communities. Each pole serves as a dual-purpose public utility—delivering <strong className="text-gray-900">solar-powered LED lighting</strong> for pedestrian safety and <strong className="text-gray-900">free WiFi connectivity</strong> for education, commerce, and healthcare access.
        </p>

        {/* Social Trends Chart */}
        <div className="border border-gray-200 rounded-lg p-4">
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

        {/* §4 UN SDG ALIGNMENT */}
        <SectionTitle number="04" title="UN Sustainable Development Goal Alignment Matrix" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          {SDG_DATA.map((sdg) => (
            <div key={sdg.num} className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-white">
              <div
                className="w-11 h-11 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: sdg.color }}
              >
                {sdg.num}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-900 leading-tight mb-0.5">SDG {sdg.num}: {sdg.title}</p>
                <p className="text-[10px] text-gray-600 leading-snug">{sdg.desc}</p>
              </div>
            </div>
           ))}
        </div>

        {/* SDG Donut Chart */}
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-[11px] font-bold text-gray-900 mb-3 uppercase tracking-widest">Relative SDG Contribution Weight (%)</p>
          <div className="flex items-center gap-6">
            <div style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SDG_DONUT_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2} strokeWidth={0}>
                    {SDG_DONUT_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid gap-1.5 text-[10px]">
              {SDG_DONUT_DATA.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-gray-700">{entry.name}</span>
                  <span className="font-bold text-gray-900 ml-auto">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* §5 AUDIT LEDGER */}
        <SectionTitle number="05" title="Audit Ledger — Asset Traceability" />
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
