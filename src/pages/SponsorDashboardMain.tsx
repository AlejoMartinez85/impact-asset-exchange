import { useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Zap, Users, Building2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DynamicESGKPICards from "@/components/DynamicESGKPICards";
import GovernanceTrustBanner from "@/components/GovernanceTrustBanner";
import LiveMap from "@/components/LiveMap";
import LiveIoTSimulator from "@/components/LiveIoTSimulator";
import { kpiData, sponsorInfo } from "@/data/mockData";
import { generateMockPoles } from "@/data/generatePoles";
import { ESGFocus, computeESGMetrics, getKPIsForFocus } from "@/data/esgFocusData";

// Generate a fixed set of 50 poles for this sponsor's cluster
const sponsorPoles = generateMockPoles(50);
const baseActivePoles = sponsorPoles.filter((p) => p.status === "active").length;

// Mock sponsor context
const SPONSOR = {
  name: "Nestlé",
  initials: "N",
  cluster: 50,
  activePoles: baseActivePoles,
  esgFocus: "carbon_climate" as ESGFocus,
};

const SponsorDashboardMain = () => {
  const [simDeltas, setSimDeltas] = useState({ kwh: 0, co2: 0, wifi: 0, activePoles: SPONSOR.activePoles });
  const simStarted = useRef(false);

  const handleSimTick = useCallback((payload: { kwh_generated: number; co2_avoided_kg: number; wifi_connections: number }) => {
    simStarted.current = true;
    setSimDeltas((prev) => ({
      kwh: prev.kwh + payload.kwh_generated,
      co2: prev.co2 + payload.co2_avoided_kg,
      wifi: prev.wifi + payload.wifi_connections,
      activePoles: SPONSOR.activePoles - 1 + Math.floor(Math.random() * 3),
    }));
  }, []);

  const activePoles = simStarted.current ? simDeltas.activePoles : SPONSOR.activePoles;
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

  const focusKPIs = getKPIsForFocus(SPONSOR.esgFocus, esgMetrics);

  return (
    <div className="space-y-6">
      {/* ─── Top Header: Identity & Status ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground font-sans">
            Welcome back, <span className="text-primary">{SPONSOR.name}</span> Sustainability Team
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">
            Your private ESG workspace &middot; {SPONSOR.cluster} ELISA poles deployed
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <LiveIoTSimulator onTick={handleSimTick} />
          <Badge className="bg-[hsl(152,60%,42%)]/10 text-[hsl(152,60%,35%)] border-[hsl(152,60%,42%)]/25 hover:bg-[hsl(152,60%,42%)]/15 font-sans text-xs font-semibold px-3 py-1">
            Clúster Activo {activePoles}/{SPONSOR.cluster} 🟢
          </Badge>
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm font-sans">
              {SPONSOR.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* ─── Row 1: Hero KPIs with Audit Standards ─── */}
      <DynamicESGKPICards focus={SPONSOR.esgFocus} kpis={focusKPIs} />

      {/* ─── Row 2: Live Map (Sponsor-Isolated 50 Poles) ─── */}
      <LiveMap />

      {/* ─── Row 3: Governance Trust Banner ─── */}
      <GovernanceTrustBanner />
    </div>
  );
};

export default SponsorDashboardMain;
