export type FirePotential = "Low" | "Medium" | "High" | "Critical";

export interface ForestryNode {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  ndvi_score: number; // 0..1 plant health
  lst_index: number; // °C land surface temp
  fire_potential: FirePotential;
  forest_change_detected: boolean;
  // Pixel position (0..100) on our stylized basemap
  x: number;
  y: number;
}

export const forestryNodes: ForestryNode[] = [
  { id: "ELISA-LRL-001", name: "Ashanti Shea Grove", coordinates: { lat: 7.7392, lng: -1.5208 }, ndvi_score: 0.84, lst_index: 27.4, fire_potential: "Low", forest_change_detected: false, x: 22, y: 38 },
  { id: "ELISA-LRL-002", name: "Souss-Massa Argan Belt", coordinates: { lat: 30.4278, lng: -9.5981 }, ndvi_score: 0.71, lst_index: 31.2, fire_potential: "Medium", forest_change_detected: false, x: 38, y: 24 },
  { id: "ELISA-LRL-003", name: "Madagascar Vanilla Edge", coordinates: { lat: -14.8833, lng: 49.6667 }, ndvi_score: 0.62, lst_index: 33.8, fire_potential: "High", forest_change_detected: true, x: 64, y: 70 },
  { id: "ELISA-LRL-004", name: "Amazon Açaí Floodplain", coordinates: { lat: -3.4653, lng: -62.2159 }, ndvi_score: 0.91, lst_index: 26.1, fire_potential: "Low", forest_change_detected: false, x: 30, y: 62 },
  { id: "ELISA-LRL-005", name: "Borneo Palm Buffer", coordinates: { lat: 1.55, lng: 110.35 }, ndvi_score: 0.48, lst_index: 36.5, fire_potential: "Critical", forest_change_detected: true, x: 78, y: 55 },
  { id: "ELISA-LRL-006", name: "Atlas Cedar Highlands", coordinates: { lat: 32.5, lng: -5.0 }, ndvi_score: 0.77, lst_index: 24.6, fire_potential: "Low", forest_change_detected: false, x: 42, y: 28 },
  { id: "ELISA-LRL-007", name: "Sumatra Patchouli Reserve", coordinates: { lat: 0.5897, lng: 101.3431 }, ndvi_score: 0.69, lst_index: 32.9, fire_potential: "High", forest_change_detected: false, x: 74, y: 58 },
  { id: "ELISA-LRL-008", name: "Kenyan Highlands Tea Buffer", coordinates: { lat: -0.3031, lng: 36.0800 }, ndvi_score: 0.82, lst_index: 22.4, fire_potential: "Low", forest_change_detected: false, x: 56, y: 60 },
];