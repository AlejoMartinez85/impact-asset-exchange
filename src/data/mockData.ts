export const sponsorInfo = {
  name: "Global Beverage Co.",
  tier: "Platinum ESG Partner",
  since: "2022",
  communities: 47,
  countries: 12,
};

export const kpiData = {
  totalInvestment: 2_450_000,
  co2Avoided: 1_872,
  cleanEnergy: 485_320,
  uptimeHours: 1_246_800,
  totalBeneficiaries: 34_500,
};

export const emissionsTimeline = [
  { month: "Jul '24", avoided: 120, cumulative: 1200 },
  { month: "Aug '24", avoided: 135, cumulative: 1335 },
  { month: "Sep '24", avoided: 142, cumulative: 1477 },
  { month: "Oct '24", avoided: 128, cumulative: 1605 },
  { month: "Nov '24", avoided: 155, cumulative: 1760 },
  { month: "Dec '24", avoided: 148, cumulative: 1908 },
  { month: "Jan '25", avoided: 160, cumulative: 2068 },
  { month: "Feb '25", avoided: 172, cumulative: 2240 },
  { month: "Mar '25", avoided: 165, cumulative: 2405 },
];

export const sdgRadarData = [
  { sdg: "SDG 4\nEducation", score: 78, fullMark: 100 },
  { sdg: "SDG 7\nEnergy", score: 95, fullMark: 100 },
  { sdg: "SDG 9\nInfrastructure", score: 82, fullMark: 100 },
  { sdg: "SDG 10\nInequality", score: 70, fullMark: 100 },
  { sdg: "SDG 11\nCommunities", score: 88, fullMark: 100 },
  { sdg: "SDG 13\nClimate", score: 91, fullMark: 100 },
];

export interface ELISAUnit {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "maintenance" | "offline";
  country: string;
  community: string;
  wifiUsers: number;
  batteryHealth: number;
  lightStatus: "on" | "off" | "dim";
  kwhProduced: number;
  uptime: number;
}

export const elisaUnits: ELISAUnit[] = [
  { id: "ELISA-PH-001", name: "Barangay Solar Hub", lat: 14.5, lng: 121.0, status: "active", country: "Philippines", community: "Barangay Luz", wifiUsers: 42, batteryHealth: 94, lightStatus: "on", kwhProduced: 2840, uptime: 99.2 },
  { id: "ELISA-CO-012", name: "Villa Esperanza Pole", lat: 4.6, lng: -74.1, status: "active", country: "Colombia", community: "Villa Esperanza", wifiUsers: 28, batteryHealth: 87, lightStatus: "on", kwhProduced: 1920, uptime: 97.8 },
  { id: "ELISA-KE-005", name: "Kibera Light Tower", lat: -1.3, lng: 36.8, status: "maintenance", country: "Kenya", community: "Kibera South", wifiUsers: 0, batteryHealth: 45, lightStatus: "dim", kwhProduced: 3100, uptime: 82.1 },
  { id: "ELISA-IN-022", name: "Rajasthan Solar Post", lat: 26.9, lng: 75.8, status: "active", country: "India", community: "Jaipur Rural", wifiUsers: 56, batteryHealth: 91, lightStatus: "on", kwhProduced: 4200, uptime: 98.5 },
  { id: "ELISA-BR-008", name: "Amazônia Beacon", lat: -3.1, lng: -60.0, status: "active", country: "Brazil", community: "Rio Negro", wifiUsers: 19, batteryHealth: 88, lightStatus: "on", kwhProduced: 1580, uptime: 96.3 },
  { id: "ELISA-NG-003", name: "Lagos Outskirt Node", lat: 6.5, lng: 3.4, status: "active", country: "Nigeria", community: "Epe District", wifiUsers: 35, batteryHealth: 92, lightStatus: "on", kwhProduced: 2650, uptime: 97.1 },
  { id: "ELISA-MX-015", name: "Oaxaca Community Pole", lat: 17.1, lng: -96.7, status: "active", country: "Mexico", community: "San Pablo", wifiUsers: 31, batteryHealth: 89, lightStatus: "on", kwhProduced: 2100, uptime: 98.0 },
  { id: "ELISA-ID-009", name: "Flores Island Light", lat: -8.5, lng: 121.4, status: "maintenance", country: "Indonesia", community: "Ende Village", wifiUsers: 0, batteryHealth: 38, lightStatus: "off", kwhProduced: 1800, uptime: 75.4 },
  { id: "ELISA-GH-002", name: "Tamale Solar Station", lat: 9.4, lng: -0.8, status: "active", country: "Ghana", community: "Tamale North", wifiUsers: 22, batteryHealth: 96, lightStatus: "on", kwhProduced: 3400, uptime: 99.5 },
  { id: "ELISA-PE-011", name: "Cusco Highland Unit", lat: -13.5, lng: -72.0, status: "active", country: "Peru", community: "Ollantaytambo", wifiUsers: 15, batteryHealth: 85, lightStatus: "on", kwhProduced: 1250, uptime: 95.8 },
];

export const hardwareHealth = [
  { id: "ELISA-PH-001", battery: 94, solar: 98, wifi: 100, light: 100, lastPing: "2 min ago" },
  { id: "ELISA-CO-012", battery: 87, solar: 92, wifi: 95, light: 100, lastPing: "5 min ago" },
  { id: "ELISA-KE-005", battery: 45, solar: 78, wifi: 0, light: 60, lastPing: "3 hrs ago" },
  { id: "ELISA-IN-022", battery: 91, solar: 96, wifi: 98, light: 100, lastPing: "1 min ago" },
  { id: "ELISA-BR-008", battery: 88, solar: 90, wifi: 85, light: 100, lastPing: "8 min ago" },
  { id: "ELISA-NG-003", battery: 92, solar: 94, wifi: 97, light: 100, lastPing: "3 min ago" },
  { id: "ELISA-MX-015", battery: 89, solar: 93, wifi: 96, light: 100, lastPing: "4 min ago" },
  { id: "ELISA-ID-009", battery: 38, solar: 65, wifi: 0, light: 0, lastPing: "12 hrs ago" },
  { id: "ELISA-GH-002", battery: 96, solar: 99, wifi: 100, light: 100, lastPing: "1 min ago" },
  { id: "ELISA-PE-011", battery: 85, solar: 88, wifi: 82, light: 100, lastPing: "6 min ago" },
];

export const generateAIReport = (sponsor: typeof sponsorInfo, kpis: typeof kpiData): string => {
  return `# ESG Impact Report — ${sponsor.name}
## Q1 2025 Executive Summary

### Overview
${sponsor.name}, as a ${sponsor.tier} since ${sponsor.since}, continues to demonstrate exceptional commitment to measurable ESG outcomes through the Litro de Luz Impact Exchange platform. This quarter marks a significant milestone in your organization's sustainability journey.

### Environmental Impact (Scope 3 Emissions Reduction)
Your portfolio of ${sponsor.communities} funded communities across ${sponsor.countries} countries has collectively avoided **${kpis.co2Avoided.toLocaleString()} metric tons of CO₂** emissions. This represents a **15.2% increase** compared to Q4 2024, driven primarily by the commissioning of 8 new ELISA solar units in Southeast Asia.

The clean energy generation of **${kpis.cleanEnergy.toLocaleString()} kWh** directly displaces kerosene lighting and diesel generators, contributing to your organization's Scope 3 emissions reduction targets under the GHG Protocol framework.

### Social Impact
The platform has delivered **${kpis.uptimeHours.toLocaleString()} hours** of reliable light and internet connectivity, serving **${kpis.totalBeneficiaries.toLocaleString()} direct beneficiaries**. Key social metrics include:

- **Internet Access**: Average of 32 concurrent WiFi users per ELISA unit, enabling educational access for 12,400+ students
- **Safety**: 89% reduction in nighttime incidents in illuminated communities
- **Economic Uplift**: Extended productive hours by an average of 4.2 hours per household per day

### UN SDG Alignment
Your investment directly contributes to six UN Sustainable Development Goals:
- **SDG 7 (Clean Energy)**: 95/100 alignment score — Your portfolio operates at 97.1% average uptime
- **SDG 13 (Climate Action)**: 91/100 — CO₂ avoidance trajectory exceeds Paris Agreement community-level targets
- **SDG 11 (Sustainable Communities)**: 88/100 — Community resilience index improved by 22% YoY
- **SDG 9 (Infrastructure)**: 82/100 — Digital connectivity reaching previously unserved populations
- **SDG 4 (Quality Education)**: 78/100 — Extended study hours and internet-enabled learning
- **SDG 10 (Reduced Inequality)**: 70/100 — Energy equity gap narrowed in target demographics

### Governance & Data Integrity
All metrics are verified through real-time IoT telemetry from ELISA hardware sensors, ensuring full auditability. Data transmission integrity is maintained at 99.7%, with blockchain-anchored quarterly snapshots for regulatory compliance.

### Financial Summary
Total investment to date: **$${(kpis.totalInvestment / 1_000_000).toFixed(2)}M**
Cost per beneficiary per year: **$${(kpis.totalInvestment / kpis.totalBeneficiaries).toFixed(2)}**
Carbon credit equivalent value: **$${(kpis.co2Avoided * 45).toLocaleString()}** (at $45/tCO₂e market rate)

### Recommendation
Based on current trajectory modeling, we recommend expanding ELISA deployment to 3 additional communities in Sub-Saharan Africa in Q2 2025 to maximize ROI on ESG metrics and achieve your stated 2025 sustainability targets.

---
*Report generated by Litro de Luz Impact Exchange AI • Data as of March 2025 • Compliant with GRI, SASB, and TCFD frameworks*`;
};
