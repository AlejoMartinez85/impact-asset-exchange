import { useState, useEffect, useRef, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Terminal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimulatorPayload {
  timestamp: string;
  serial_number: string;
  sponsor: string;
  kwh_generated: number;
  wifi_connections: number;
  co2_avoided_kg: number;
  light_hours: number;
  pole_index: number;
}

interface LiveIoTSimulatorProps {
  onTick: (payload: SimulatorPayload) => void;
}

const SPONSORS = [
  { name: "AB-InBev", poles: 110, prefix: "ELISA-ABI" },
  { name: "Nestlé", poles: 85, prefix: "ELISA-NES" },
  { name: "Unilever", poles: 60, prefix: "ELISA-UNI" },
];

const EMISSION_FACTOR = 0.42;

const LiveIoTSimulator = ({ onTick }: LiveIoTSimulatorProps) => {
  const [enabled, setEnabled] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState<SimulatorPayload[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const generatePayload = useCallback((): SimulatorPayload => {
    const sponsor = SPONSORS[Math.floor(Math.random() * SPONSORS.length)];
    const poleIndex = Math.floor(Math.random() * sponsor.poles) + 1;
    const kwh = +(Math.random() * 0.4 + 0.1).toFixed(3);
    const wifi = Math.floor(Math.random() * 5) + 1;
    const light = +(Math.random() * 0.8 + 0.2).toFixed(2);

    return {
      timestamp: new Date().toISOString(),
      serial_number: `${sponsor.prefix}-${String(poleIndex).padStart(4, "0")}`,
      sponsor: sponsor.name,
      kwh_generated: kwh,
      wifi_connections: wifi,
      co2_avoided_kg: +(kwh * EMISSION_FACTOR).toFixed(4),
      light_hours: light,
      pole_index: poleIndex,
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      const payload = generatePayload();
      setLogs((prev) => [...prev.slice(-30), payload]);
      onTick(payload);
    }, 3000);

    return () => clearInterval(id);
  }, [enabled, generatePayload, onTick]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) setLogs([]);
  };

  return (
    <div className="space-y-2">
      {/* Toggle Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={handleToggle} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
            Live Demo Mode
          </span>
        </div>
        <AnimatePresence>
          {enabled && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              SIMULATING
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Log */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Collapsible open={logOpen} onOpenChange={setLogOpen}>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Terminal className="h-3 w-3" />
                <span>Telemetry Stream</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${logOpen ? "rotate-180" : ""}`} />
                <span className="text-primary/60">({logs.length} events)</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-border bg-[hsl(215,25%,17%)] font-mono text-[11px] max-h-48 overflow-y-auto p-3 space-y-1">
                  {logs.length === 0 && (
                    <span className="text-[hsl(215,14%,60%)]">Waiting for telemetry…</span>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-[hsl(215,14%,60%)]">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{" "}
                      <span className="text-[hsl(205,85%,60%)]">IN</span>{" "}
                      <span className="text-[hsl(178,65%,55%)]">{log.serial_number}</span>{" "}
                      <span className="text-[hsl(215,14%,60%)]">→</span>{" "}
                      <span className="text-[hsl(0,0%,90%)]">
                        {`{ kWh: ${log.kwh_generated}, wifi: ${log.wifi_connections}, CO₂: ${log.co2_avoided_kg}kg }`}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveIoTSimulator;
