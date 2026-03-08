import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Leaf, Wifi, Activity, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import LiveIoTSimulator from "@/components/LiveIoTSimulator";

interface PoleTelemetry {
  pole_id: string;
  serial_number: string;
  sponsor_name: string;
  community: string;
  status: string;
  total_kwh: number;
  total_co2: number;
  total_wifi: number;
  total_light_hours: number;
  log_count: number;
  last_ping_at: string | null;
}

const fetchTelemetrySummary = async (): Promise<PoleTelemetry[]> => {
  const { data: poles, error: polesError } = await supabase
    .from("elisa_poles")
    .select("id, serial_number, sponsor_name, community, status, last_ping_at");

  if (polesError) throw polesError;
  if (!poles?.length) return [];

  const { data: logs, error: logsError } = await supabase
    .from("telemetry_logs")
    .select("pole_id, kwh_generated, co2_avoided_kg, wifi_connections, light_hours");

  if (logsError) throw logsError;

  const logsByPole = (logs || []).reduce<Record<string, { kwh: number; co2: number; wifi: number; light: number; count: number }>>((acc, log) => {
    if (!acc[log.pole_id]) acc[log.pole_id] = { kwh: 0, co2: 0, wifi: 0, light: 0, count: 0 };
    acc[log.pole_id].kwh += log.kwh_generated;
    acc[log.pole_id].co2 += log.co2_avoided_kg;
    acc[log.pole_id].wifi += log.wifi_connections;
    acc[log.pole_id].light += log.light_hours;
    acc[log.pole_id].count += 1;
    return acc;
  }, {});

  return poles.map((pole) => {
    const agg = logsByPole[pole.id] || { kwh: 0, co2: 0, wifi: 0, light: 0, count: 0 };
    return {
      pole_id: pole.id,
      serial_number: pole.serial_number,
      sponsor_name: pole.sponsor_name,
      community: pole.community,
      status: pole.status,
      total_kwh: agg.kwh,
      total_co2: agg.co2,
      total_wifi: agg.wifi,
      total_light_hours: agg.light,
      log_count: agg.count,
      last_ping_at: pole.last_ping_at,
    };
  });
};

const chartConfig = {
  kwh: { label: "kWh Generated", color: "hsl(142 72% 48%)" },
  co2: { label: "CO₂ Avoided (kg)", color: "hsl(38 92% 55%)" },
  wifi: { label: "WiFi Connections", color: "hsl(200 80% 55%)" },
};

const statusColor: Record<string, string> = {
  active: "bg-primary/20 text-primary border-primary/30",
  maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  offline: "bg-destructive/20 text-destructive border-destructive/30",
  decommissioned: "bg-muted text-muted-foreground border-border",
};

const TelemetryPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["telemetry-summary"],
    queryFn: fetchTelemetrySummary,
    refetchInterval: 15_000,
  });

  // Simulator overlay deltas
  const [simDeltas, setSimDeltas] = useState({ kwh: 0, co2: 0, wifi: 0 });
  const [flashKey, setFlashKey] = useState(0);

  const handleSimTick = useCallback((payload: { kwh_generated: number; co2_avoided_kg: number; wifi_connections: number }) => {
    setSimDeltas((prev) => ({
      kwh: prev.kwh + payload.kwh_generated,
      co2: prev.co2 + payload.co2_avoided_kg,
      wifi: prev.wifi + payload.wifi_connections,
    }));
    setFlashKey((k) => k + 1);
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("telemetry-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "telemetry_logs" }, () => {})
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const totals = data?.reduce(
    (acc, p) => ({
      kwh: acc.kwh + p.total_kwh,
      co2: acc.co2 + p.total_co2,
      wifi: acc.wifi + p.total_wifi,
      poles: acc.poles + 1,
    }),
    { kwh: 0, co2: 0, wifi: 0, poles: 0 }
  ) || { kwh: 0, co2: 0, wifi: 0, poles: 0 };

  // Merge sim deltas into display totals
  const displayTotals = {
    kwh: totals.kwh + simDeltas.kwh,
    co2: totals.co2 + simDeltas.co2,
    wifi: totals.wifi + simDeltas.wifi,
    poles: totals.poles || 255, // Show simulated pole count if no real data
  };

  const chartData = (data || [])
    .filter((p) => p.total_kwh > 0 || p.total_co2 > 0 || p.total_wifi > 0)
    .slice(0, 10)
    .map((p) => ({
      name: p.serial_number.length > 12 ? p.serial_number.slice(0, 12) + "…" : p.serial_number,
      kwh: +p.total_kwh.toFixed(2),
      co2: +p.total_co2.toFixed(2),
      wifi: p.total_wifi,
    }));

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>Failed to load telemetry data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Simulator */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-Time Telemetry
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live stats per ELISA pole · Auto-refreshes every 15s
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LiveIoTSimulator onTick={handleSimTick} />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))
        ) : (
          <>
            <FlashStatCard key={`poles-${flashKey}`} icon={Radio} label="Active Poles" value={String(displayTotals.poles)} delay={0} flash={simDeltas.kwh > 0} />
            <FlashStatCard key={`kwh-${flashKey}`} icon={Zap} label="Total kWh" value={displayTotals.kwh.toLocaleString(undefined, { maximumFractionDigits: 1 })} delay={0.05} flash={simDeltas.kwh > 0} />
            <FlashStatCard key={`co2-${flashKey}`} icon={Leaf} label="CO₂ Avoided" value={`${displayTotals.co2.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`} delay={0.1} flash={simDeltas.co2 > 0} />
            <FlashStatCard key={`wifi-${flashKey}`} icon={Wifi} label="WiFi Sessions" value={displayTotals.wifi.toLocaleString()} delay={0.15} flash={simDeltas.wifi > 0} />
          </>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Output by Pole (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215 14% 52%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 14% 52%)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kwh" fill="var(--color-kwh)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2" fill="var(--color-co2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wifi" fill="var(--color-wifi)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Per-pole table */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Per-Pole Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !data?.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No poles registered yet. Go to Hardware Health to provision ELISA units.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs">Serial Number</TableHead>
                  <TableHead className="text-xs">Sponsor</TableHead>
                  <TableHead className="text-xs">Community</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">kWh</TableHead>
                  <TableHead className="text-xs text-right">CO₂ (kg)</TableHead>
                  <TableHead className="text-xs text-right">WiFi</TableHead>
                  <TableHead className="text-xs text-right">Logs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pole) => (
                  <TableRow key={pole.pole_id} className="border-border">
                    <TableCell className="font-mono text-xs text-foreground">{pole.serial_number}</TableCell>
                    <TableCell className="text-xs">{pole.sponsor_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{pole.community}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] capitalize ${statusColor[pole.status] || ""}`}>
                        {pole.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{pole.total_kwh.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{pole.total_co2.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{pole.total_wifi.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{pole.log_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/** StatCard with green glow flash on simulator tick */
const FlashStatCard = ({ icon: Icon, label, value, delay, flash }: { icon: any; label: string; value: string; delay: number; flash: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card-elevated rounded-lg p-5 glow-green group hover:glow-green-strong transition-shadow duration-300 relative overflow-hidden"
  >
    {/* Flash overlay */}
    {flash && (
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-primary/15 rounded-lg pointer-events-none"
      />
    )}
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="p-2 rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
    <div className="text-2xl font-bold text-foreground font-mono tracking-tight">{value}</div>
  </motion.div>
);

export default TelemetryPage;
