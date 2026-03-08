export const sponsorInfo = {
  name: "AB-InBev",
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

export const sunlightAssetTimeline = [
  { month: "Apr '25", kwhGenerated: 32400, co2Avoided: 13608, wifiConnections: 4200, lightHours: 6800 },
  { month: "May '25", kwhGenerated: 35100, co2Avoided: 14742, wifiConnections: 4600, lightHours: 7100 },
  { month: "Jun '25", kwhGenerated: 38200, co2Avoided: 16044, wifiConnections: 5100, lightHours: 7500 },
  { month: "Jul '25", kwhGenerated: 41800, co2Avoided: 17556, wifiConnections: 5800, lightHours: 8200 },
  { month: "Aug '25", kwhGenerated: 43500, co2Avoided: 18270, wifiConnections: 6200, lightHours: 8600 },
  { month: "Sep '25", kwhGenerated: 40900, co2Avoided: 17178, wifiConnections: 5900, lightHours: 8100 },
  { month: "Oct '25", kwhGenerated: 37600, co2Avoided: 15792, wifiConnections: 5400, lightHours: 7600 },
  { month: "Nov '25", kwhGenerated: 34200, co2Avoided: 14364, wifiConnections: 4900, lightHours: 7000 },
  { month: "Dec '25", kwhGenerated: 31800, co2Avoided: 13356, wifiConnections: 4500, lightHours: 6600 },
  { month: "Jan '26", kwhGenerated: 33600, co2Avoided: 14112, wifiConnections: 4800, lightHours: 6900 },
  { month: "Feb '26", kwhGenerated: 36200, co2Avoided: 15204, wifiConnections: 5300, lightHours: 7300 },
  { month: "Mar '26", kwhGenerated: 39800, co2Avoided: 16716, wifiConnections: 5700, lightHours: 7900 },
];

export const emissionsTimeline = sunlightAssetTimeline.map((d) => ({
  month: d.month,
  avoided: Math.round(d.co2Avoided / 1000),
  cumulative: 0,
}));

export const sdgRadarData = [
  { sdg: "Quality Education", sdgNum: "SDG 4", score: 78, fullMark: 100 },
  { sdg: "Affordable Energy", sdgNum: "SDG 7", score: 95, fullMark: 100 },
  { sdg: "Infrastructure", sdgNum: "SDG 9", score: 82, fullMark: 100 },
  { sdg: "Reduced Inequality", sdgNum: "SDG 10", score: 70, fullMark: 100 },
  { sdg: "Sustainable Cities", sdgNum: "SDG 11", score: 88, fullMark: 100 },
  { sdg: "Climate Action", sdgNum: "SDG 13", score: 91, fullMark: 100 },
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
  { id: "ELISA-COL-089", name: "Buenaventura Solar Hub", lat: 3.88, lng: -77.02, status: "active", country: "Colombia", community: "Buenaventura", wifiUsers: 42, batteryHealth: 94, lightStatus: "on", kwhProduced: 2840, uptime: 99.2 },
  { id: "ELISA-COL-112", name: "Quibdó Light Tower", lat: 5.69, lng: -76.66, status: "active", country: "Colombia", community: "Quibdó", wifiUsers: 28, batteryHealth: 87, lightStatus: "on", kwhProduced: 1920, uptime: 97.8 },
  { id: "ELISA-COL-045", name: "Tumaco Beacon", lat: 1.80, lng: -78.76, status: "maintenance", country: "Colombia", community: "Tumaco", wifiUsers: 0, batteryHealth: 45, lightStatus: "dim", kwhProduced: 3100, uptime: 82.1 },
  { id: "ELISA-COL-078", name: "Leticia Amazon Post", lat: -4.21, lng: -69.94, status: "active", country: "Colombia", community: "Leticia", wifiUsers: 19, batteryHealth: 91, lightStatus: "on", kwhProduced: 1580, uptime: 98.5 },
  { id: "ELISA-COL-156", name: "San Andrés Node", lat: 12.58, lng: -81.70, status: "active", country: "Colombia", community: "San Andrés", wifiUsers: 35, batteryHealth: 92, lightStatus: "on", kwhProduced: 2650, uptime: 97.1 },
  { id: "ELISA-COL-201", name: "Mitú Rural Pole", lat: 1.25, lng: -70.23, status: "active", country: "Colombia", community: "Mitú", wifiUsers: 15, batteryHealth: 88, lightStatus: "on", kwhProduced: 1250, uptime: 95.8 },

  { id: "ELISA-MEX-034", name: "Oaxaca Community Pole", lat: 17.07, lng: -96.72, status: "active", country: "Mexico", community: "San Pablo", wifiUsers: 31, batteryHealth: 89, lightStatus: "on", kwhProduced: 2100, uptime: 98.0 },
  { id: "ELISA-MEX-067", name: "Chiapas Solar Station", lat: 16.75, lng: -93.12, status: "active", country: "Mexico", community: "Tuxtla Gutiérrez", wifiUsers: 38, batteryHealth: 93, lightStatus: "on", kwhProduced: 2780, uptime: 99.1 },
  { id: "ELISA-MEX-091", name: "Guerrero Light Post", lat: 17.55, lng: -99.50, status: "maintenance", country: "Mexico", community: "Acapulco Rural", wifiUsers: 5, batteryHealth: 52, lightStatus: "dim", kwhProduced: 1650, uptime: 85.3 },
  { id: "ELISA-MEX-118", name: "Tabasco Beacon", lat: 17.99, lng: -92.93, status: "active", country: "Mexico", community: "Villahermosa", wifiUsers: 22, batteryHealth: 90, lightStatus: "on", kwhProduced: 1890, uptime: 96.7 },
  { id: "ELISA-MEX-142", name: "Yucatán Hub", lat: 20.97, lng: -89.59, status: "active", country: "Mexico", community: "Mérida Rural", wifiUsers: 44, batteryHealth: 96, lightStatus: "on", kwhProduced: 3200, uptime: 99.5 },

  { id: "ELISA-PER-023", name: "Cusco Highland Unit", lat: -13.53, lng: -71.97, status: "active", country: "Peru", community: "Ollantaytambo", wifiUsers: 15, batteryHealth: 85, lightStatus: "on", kwhProduced: 1250, uptime: 95.8 },
  { id: "ELISA-PER-056", name: "Iquitos River Post", lat: -3.75, lng: -73.25, status: "active", country: "Peru", community: "Iquitos", wifiUsers: 26, batteryHealth: 82, lightStatus: "on", kwhProduced: 2340, uptime: 94.2 },
  { id: "ELISA-PER-088", name: "Puno Lake Station", lat: -15.84, lng: -70.02, status: "active", country: "Peru", community: "Puno", wifiUsers: 18, batteryHealth: 91, lightStatus: "on", kwhProduced: 1780, uptime: 97.3 },
  { id: "ELISA-PER-101", name: "Ayacucho Solar Pole", lat: -13.16, lng: -74.22, status: "maintenance", country: "Peru", community: "Ayacucho", wifiUsers: 3, batteryHealth: 38, lightStatus: "off", kwhProduced: 1800, uptime: 75.4 },
  { id: "ELISA-PER-134", name: "Madre de Dios Hub", lat: -12.59, lng: -69.19, status: "active", country: "Peru", community: "Puerto Maldonado", wifiUsers: 21, batteryHealth: 87, lightStatus: "on", kwhProduced: 2050, uptime: 96.9 },
];

export const hardwareHealth = elisaUnits.map((u) => ({
  id: u.id,
  battery: u.batteryHealth,
  solar: Math.min(100, u.batteryHealth + Math.floor(Math.random() * 8)),
  wifi: u.status === "active" ? 90 + Math.floor(Math.random() * 10) : 0,
  light: u.lightStatus === "on" ? 100 : u.lightStatus === "dim" ? 60 : 0,
  lastPing: u.status === "active" ? `${Math.floor(Math.random() * 10) + 1} min ago` : "3+ hrs ago",
}));

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
