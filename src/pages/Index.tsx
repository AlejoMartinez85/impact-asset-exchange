import { useState, useCallback, useRef } from "react";
import { Zap, Leaf, Clock, Users } from "lucide-react";
import KPICard from "@/components/KPICard";
import DynamicESGKPICards from "@/components/DynamicESGKPICards";
import GovernanceTrustBanner from "@/components/GovernanceTrustBanner";
import SunlightAssetChart from "@/components/SunlightAssetChart";
import SDGRadarChart from "@/components/SDGRadarChart";
import CommunityEcosystemChart from "@/components/CommunityEcosystemChart";
import LiveMap from "@/components/LiveMap";
import AuditableESGTable from "@/components/AuditableESGTable";
import LiveIoTSimulator from "@/components/LiveIoTSimulator";
import { kpiData, sponsorInfo } from "@/data/mockData";
import { generatedPoles } from "@/data/generatePoles";
import { ESGFocus, ESG_FOCUS_OPTIONS, computeESGMetrics, getKPIsForFocus } from "@/data/esgFocusData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseActivePoles = generatedPoles.filter((p) => p.status === "active").length;

const Index = () => {
  const [simDeltas, setSimDeltas] = useState({ kwh: 0, co2: 0, wifi: 0, activePoles: baseActivePoles });
  const [esgFocus, setEsgFocus] = useState<ESGFocus>("carbon_climate");
  const simStarted = useRef(false);

  const handleSimTick = useCallback((payload: { kwh_generated: number; co2_avoided_kg: number; wifi_connections: number }) => {
    simStarted.current = true;
    setSimDeltas((prev) => ({
      kwh: prev.kwh + payload.kwh_generated,
      co2: prev.co2 + payload.co2_avoided_kg,
      wifi: prev.wifi + payload.wifi_connections,
      activePoles: 98 + Math.floor(Math.random() * 3),
    }));
  }, []);

  const activePoles = simStarted.current ? simDeltas.activePoles : baseActivePoles;
  const totalCo2 = kpiData.co2Avoided + simDeltas.co2 / 1000;
  const totalEnergy = kpiData.cleanEnergy + simDeltas.kwh;
  const totalWifi = kpiData.totalBeneficiaries + simDeltas.wifi;

  const esgMetrics = computeESGMetrics({
    co2Avoided: totalCo2,
    cleanEnergy: totalEnergy,
    uptimeHours: kpiData.uptimeHours,
    totalBeneficiaries: totalWifi,
    activePoles,
  });

  const focusKPIs = getKPIsForFocus(esgFocus, esgMetrics);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Impact Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time ESG metrics for {sponsorInfo.communities} communities across {sponsorInfo.countries} countries
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">ESG Focus</span>
            <Select value={esgFocus} onValueChange={(v) => setEsgFocus(v as ESGFocus)}>
              <SelectTrigger className="h-8 w-56 text-xs border-border bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESG_FOCUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <LiveIoTSimulator onTick={handleSimTick} />
        </div>
      </div>

      {/* Dynamic ESG KPI Cards */}
      <DynamicESGKPICards focus={esgFocus} kpis={focusKPIs} />

      {/* Governance Trust Banner */}
      <GovernanceTrustBanner />

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Poles" value={String(activePoles)} subtitle="ELISA units online" icon={Zap} trend="99.1% uptime" trendUp delay={0} auditStandard="GRI 302 | CDP" />
        <KPICard title="CO₂ Avoided" value={`${totalCo2.toLocaleString(undefined, { maximumFractionDigits: 1 })}t`} subtitle="Scope 3 reduction" icon={Leaf} trend="15.2%" trendUp delay={0.05} auditStandard="GHG Protocol" />
        <KPICard title="Uptime Hours" value={`${(kpiData.uptimeHours / 1000).toFixed(0)}K`} subtitle="Light & connectivity" icon={Clock} trend="99.1%" trendUp delay={0.1} auditStandard="SASB TC-TL" />
        <KPICard title="Beneficiaries" value={`${(totalWifi / 1000).toFixed(1)}K`} subtitle="Direct impact" icon={Users} trend="2,400 new" trendUp delay={0.15} auditStandard="GRI 413" />
      </div>

      <SunlightAssetChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SDGRadarChart />
        <CommunityEcosystemChart />
      </div>

      <LiveMap />

      <AuditableESGTable />
    </div>
  );
};

export default Index;
