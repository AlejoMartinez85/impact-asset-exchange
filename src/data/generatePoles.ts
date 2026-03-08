import type { ELISAUnit } from "./mockData";

// Bounding boxes for each country [latMin, latMax, lngMin, lngMax]
const REGIONS: Record<string, { code: string; bounds: [number, number, number, number] }> = {
  Colombia: { code: "COL", bounds: [-4.2, 12.5, -79.0, -67.0] },
  Mexico: { code: "MEX", bounds: [14.5, 32.7, -118.4, -86.7] },
  Peru: { code: "PER", bounds: [-18.3, -0.04, -81.3, -68.7] },
  Ghana: { code: "GHA", bounds: [4.7, 11.2, -3.3, 1.2] },
  Kenya: { code: "KEN", bounds: [-4.7, 5.0, 33.9, 41.9] },
  Madagascar: { code: "MDG", bounds: [-25.6, -11.9, 43.2, 50.5] },
};

const COMMUNITIES: Record<string, string[]> = {
  Colombia: ["Buenaventura", "Quibdó", "Tumaco", "Leticia", "San Andrés", "Mitú", "Cali", "Medellín Rural", "Cartagena Sur"],
  Mexico: ["Oaxaca", "Chiapas", "Guerrero", "Tabasco", "Yucatán", "Veracruz", "Puebla Rural", "Michoacán"],
  Peru: ["Cusco", "Iquitos", "Puno", "Ayacucho", "Madre de Dios", "Loreto", "Huancavelica", "Amazonas"],
  Ghana: ["Tamale", "Bolgatanga", "Wa", "Cape Coast", "Kumasi Rural", "Sunyani", "Techiman"],
  Kenya: ["Turkana", "Marsabit", "Garissa", "Kilifi", "Kwale", "Tana River", "Samburu", "Isiolo"],
  Madagascar: ["Antsirabe", "Morondava", "Mananjary", "Ambanja", "Fort Dauphin", "Mahajanga Rural", "Nosy Be"],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateMockPoles(totalCount: number = 783): ELISAUnit[] {
  const rand = seededRandom(42);
  const countries = Object.keys(REGIONS);
  const poles: ELISAUnit[] = [];

  for (let i = 0; i < totalCount; i++) {
    const country = countries[Math.floor(rand() * countries.length)];
    const { code, bounds } = REGIONS[country];
    const comms = COMMUNITIES[country];
    const community = comms[Math.floor(rand() * comms.length)];

    const lat = bounds[0] + rand() * (bounds[1] - bounds[0]);
    const lng = bounds[2] + rand() * (bounds[3] - bounds[2]);

    const isActive = rand() < 0.95;
    const status = isActive ? "active" as const : "maintenance" as const;
    const batteryHealth = isActive
      ? Math.floor(75 + rand() * 25)
      : Math.floor(20 + rand() * 40);

    poles.push({
      id: `ELISA-${code}-${String(i + 1).padStart(3, "0")}`,
      name: `${community} Solar Unit ${Math.floor(rand() * 50) + 1}`,
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      status,
      country,
      community,
      wifiUsers: isActive ? Math.floor(5 + rand() * 55) : Math.floor(rand() * 5),
      batteryHealth,
      lightStatus: isActive ? "on" : rand() < 0.5 ? "dim" : "off",
      kwhProduced: Math.floor(500 + rand() * 4000),
      uptime: isActive
        ? parseFloat((92 + rand() * 8).toFixed(1))
        : parseFloat((50 + rand() * 35).toFixed(1)),
    });
  }

  return poles;
}

export const generatedPoles = generateMockPoles(100);
