import { useState, useCallback, useRef } from "react";
import { DollarSign, Leaf, Zap, Clock, Users } from "lucide-react";
import KPICard from "@/components/KPICard";
import SunlightAssetChart from "@/components/SunlightAssetChart";
import SDGRadarChart from "@/components/SDGRadarChart";
import CommunityEcosystemChart from "@/components/CommunityEcosystemChart";
import LiveMap from "@/components/LiveMap";
import AuditableESGTable from "@/components/AuditableESGTable";
import LiveIoTSimulator from "@/components/LiveIoTSimulator";
import { kpiData, sponsorInfo } from "@/data/mockData";
import { generatedPoles } from "@/data/generatePoles";

const baseActivePoles = generatedPoles.filter((p) => p.status === "active").length;

const Index = () => {
  const [simDeltas, setSimDeltas] = useState({ kwh: 0, co2: 0, wifi: 0, activePoles: baseActivePoles });
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
  const totalCo2 = kpiData.co2Avoided + simDeltas.co2 / 1000; // sim is in kg, kpi in tons
  const totalEnergy = kpiData.cleanEnergy + simDeltas.kwh;
  const totalWifi = kpiData.totalBeneficiaries + simDeltas.wifi;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Impact Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time ESG metrics for {sponsorInfo.communities} communities across {sponsorInfo.countries} countries
          </p>
        </div>
        <LiveIoTSimulator onTick={handleSimTick} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Active Poles" value={String(activePoles)} subtitle="ELISA units online" icon={Zap} trend="99.1% uptime" trendUp delay={0} />
        <KPICard title="CO₂ Avoided" value={`${totalCo2.toLocaleString(undefined, { maximumFractionDigits: 1 })}t`} subtitle="Scope 3 reduction" icon={Leaf} trend="15.2%" trendUp delay={0.05} />
        <KPICard title="Clean Energy" value={`${(totalEnergy / 1000).toFixed(0)} MWh`} subtitle="Cumulative output" icon={Zap} trend="8.7%" trendUp delay={0.1} />
        <KPICard title="Uptime Hours" value={`${(kpiData.uptimeHours / 1000).toFixed(0)}K`} subtitle="Light & connectivity" icon={Clock} trend="99.1%" trendUp delay={0.15} />
        <KPICard title="Beneficiaries" value={`${(totalWifi / 1000).toFixed(1)}K`} subtitle="Direct impact" icon={Users} trend="2,400 new" trendUp delay={0.2} />
      </div>

      <SunlightAssetChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SDGRadarChart />
        <CommunityEcosystemChart />
      </div>

      <LiveMap />
    </div>
  );
};

export default Index;
