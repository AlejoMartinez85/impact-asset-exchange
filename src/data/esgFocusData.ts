export type ESGFocus = "carbon_climate" | "digital_inclusion" | "community_safety";

export const ESG_FOCUS_OPTIONS: { value: ESGFocus; label: string }[] = [
  { value: "carbon_climate", label: "Carbon & Climate Action" },
  { value: "digital_inclusion", label: "Digital Inclusion & Education" },
  { value: "community_safety", label: "Community Safety & Economy" },
];

// Conversion factors
const KEROSENE_LITERS_PER_KWH = 0.28; // 1 kWh displaces ~0.28L kerosene
const EWASTE_KG_PER_POLE_YEAR = 4.2; // Each pole avoids ~4.2kg e-waste/year (batteries, plastics)
const DATA_GB_PER_WIFI_USER = 0.35; // ~350MB per session
const NIGHTTIME_HOURS_RATIO = 0.42; // 42% of light hours fall in 6PM-10PM window

export interface ESGDerivedMetrics {
  // Carbon & Climate
  co2AvoidedTons: number;
  keroseneDisplacedLiters: number;
  ewasteAvoidedKg: number;
  // Digital Inclusion
  wifiUptimeHours: number;
  dataTransferredGB: number;
  uniqueDigitalBeneficiaries: number;
  // Community Safety
  nighttimeEconomyHours: number;
  publicLightingUptimeHours: number;
  communityBeneficiaries: number;
}

export function computeESGMetrics(baseKpis: {
  co2Avoided: number;
  cleanEnergy: number;
  uptimeHours: number;
  totalBeneficiaries: number;
  activePoles: number;
}): ESGDerivedMetrics {
  return {
    co2AvoidedTons: baseKpis.co2Avoided,
    keroseneDisplacedLiters: Math.round(baseKpis.cleanEnergy * KEROSENE_LITERS_PER_KWH),
    ewasteAvoidedKg: Math.round(baseKpis.activePoles * EWASTE_KG_PER_POLE_YEAR * 10) / 10,
    wifiUptimeHours: Math.round(baseKpis.uptimeHours * 0.65),
    dataTransferredGB: Math.round(baseKpis.totalBeneficiaries * DATA_GB_PER_WIFI_USER),
    uniqueDigitalBeneficiaries: baseKpis.totalBeneficiaries,
    nighttimeEconomyHours: Math.round(baseKpis.uptimeHours * NIGHTTIME_HOURS_RATIO),
    publicLightingUptimeHours: baseKpis.uptimeHours,
    communityBeneficiaries: baseKpis.totalBeneficiaries,
  };
}

export interface FocusKPI {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
}

export function getKPIsForFocus(focus: ESGFocus, metrics: ESGDerivedMetrics): FocusKPI[] {
  switch (focus) {
    case "carbon_climate":
      return [
        {
          title: "Scope 3 CO₂ Avoided",
          value: `${metrics.co2AvoidedTons.toLocaleString()}t`,
          subtitle: "Verified carbon reduction",
          trend: "15.2%",
          trendUp: true,
        },
        {
          title: "Fossil Fuels Displaced",
          value: `${(metrics.keroseneDisplacedLiters / 1000).toFixed(1)}K L`,
          subtitle: "Kerosene equivalent",
          trend: "12.8%",
          trendUp: true,
        },
        {
          title: "E-Waste Avoided",
          value: `${metrics.ewasteAvoidedKg.toLocaleString()} kg`,
          subtitle: "Batteries & plastics",
          trend: "8.4%",
          trendUp: true,
        },
      ];
    case "digital_inclusion":
      return [
        {
          title: "Total WiFi Uptime",
          value: `${(metrics.wifiUptimeHours / 1000).toFixed(0)}K hrs`,
          subtitle: "Connectivity delivered",
          trend: "11.3%",
          trendUp: true,
        },
        {
          title: "Data Transferred",
          value: `${(metrics.dataTransferredGB / 1000).toFixed(1)} TB`,
          subtitle: "Community bandwidth",
          trend: "22.1%",
          trendUp: true,
        },
        {
          title: "Unique Digital Beneficiaries",
          value: `${(metrics.uniqueDigitalBeneficiaries / 1000).toFixed(1)}K`,
          subtitle: "Connected individuals",
          trend: "2,400 new",
          trendUp: true,
        },
      ];
    case "community_safety":
      return [
        {
          title: "Nighttime Economy Hours",
          value: `${(metrics.nighttimeEconomyHours / 1000).toFixed(0)}K hrs`,
          subtitle: "6PM – 10PM activity window",
          trend: "18.5%",
          trendUp: true,
        },
        {
          title: "Public Lighting Uptime",
          value: `${(metrics.publicLightingUptimeHours / 1000).toFixed(0)}K hrs`,
          subtitle: "Continuous illumination",
          trend: "99.1%",
          trendUp: true,
        },
        {
          title: "Community Beneficiaries",
          value: `${(metrics.communityBeneficiaries / 1000).toFixed(1)}K`,
          subtitle: "Safety & economic impact",
          trend: "3,100 new",
          trendUp: true,
        },
      ];
  }
}
