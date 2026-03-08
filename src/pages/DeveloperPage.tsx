import { motion } from "framer-motion";

const endpoints = [
  { method: "POST", path: "/api/v1/telemetry/ingest", desc: "IoT sensor data ingestion endpoint. Accepts battery, solar, WiFi, and light telemetry." },
  { method: "GET", path: "/api/v1/units/{unit_id}/status", desc: "Retrieve real-time status of a specific ELISA unit." },
  { method: "GET", path: "/api/v1/sponsor/{sponsor_id}/metrics", desc: "Aggregated ESG metrics for a sponsor tenant." },
  { method: "POST", path: "/api/v1/reports/generate", desc: "Trigger AI-powered ESG report generation." },
  { method: "GET", path: "/api/v1/units/{unit_id}/history", desc: "Historical telemetry data for trend analysis." },
  { method: "PUT", path: "/api/v1/units/{unit_id}/config", desc: "Update ELISA unit configuration (Super Admin only)." },
];

const methodColor: Record<string, string> = {
  GET: "text-primary",
  POST: "text-yellow-400",
  PUT: "text-blue-400",
  DELETE: "text-destructive",
};

const DeveloperPage = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Developer Console</h2>
        <p className="text-xs text-muted-foreground mt-0.5">API endpoints and IoT data ingestion reference</p>
      </div>

      <div className="card-elevated rounded-lg p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">Data Ingestion Pipeline</h3>
        <p className="text-xs text-muted-foreground mb-4">ELISA solar units transmit telemetry every 60 seconds via MQTT → Edge Gateway → REST API</p>

        <div className="bg-secondary/50 rounded-md p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-muted-foreground">
{`// Example IoT payload from ELISA unit
{
  "unit_id": "ELISA-PH-001",
  "timestamp": "2025-03-08T14:30:00Z",
  "battery_pct": 94,
  "solar_output_w": 42.5,
  "wifi_clients": 42,
  "light_status": "on",
  "kwh_total": 2840.7,
  "gps": { "lat": 14.5, "lng": 121.0 },
  "firmware": "v3.2.1"
}`}
          </pre>
        </div>
      </div>

      <div className="card-elevated rounded-lg p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">API Reference</h3>
        <div className="space-y-2">
          {endpoints.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className={`font-mono text-xs font-bold w-12 shrink-0 ${methodColor[ep.method]}`}>{ep.method}</span>
              <div>
                <code className="text-xs text-foreground">{ep.path}</code>
                <p className="text-[10px] text-muted-foreground mt-0.5">{ep.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
