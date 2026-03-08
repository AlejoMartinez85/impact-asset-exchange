import { DollarSign, Leaf, Zap, Clock, Users } from "lucide-react";
import KPICard from "@/components/KPICard";
import EmissionsChart from "@/components/EmissionsChart";
import SDGRadarChart from "@/components/SDGRadarChart";
import LiveMap from "@/components/LiveMap";
import { kpiData, sponsorInfo } from "@/data/mockData";

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Impact Dashboard</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time ESG metrics for {sponsorInfo.communities} communities across {sponsorInfo.countries} countries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Investment" value={`$${(kpiData.totalInvestment / 1_000_000).toFixed(2)}M`} subtitle="Lifetime commitment" icon={DollarSign} trend="12.4%" trendUp delay={0} />
        <KPICard title="CO₂ Avoided" value={`${kpiData.co2Avoided.toLocaleString()}t`} subtitle="Scope 3 reduction" icon={Leaf} trend="15.2%" trendUp delay={0.05} />
        <KPICard title="Clean Energy" value={`${(kpiData.cleanEnergy / 1000).toFixed(0)} MWh`} subtitle="Cumulative output" icon={Zap} trend="8.7%" trendUp delay={0.1} />
        <KPICard title="Uptime Hours" value={`${(kpiData.uptimeHours / 1000).toFixed(0)}K`} subtitle="Light & connectivity" icon={Clock} trend="99.1%" trendUp delay={0.15} />
        <KPICard title="Beneficiaries" value={`${(kpiData.totalBeneficiaries / 1000).toFixed(1)}K`} subtitle="Direct impact" icon={Users} trend="2,400 new" trendUp delay={0.2} />
      </div>

      <LiveMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionsChart />
        <SDGRadarChart />
      </div>
    </div>
  );
};

export default Index;
