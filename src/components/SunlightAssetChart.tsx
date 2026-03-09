import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, TooltipProps,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sunlightAssetTimeline } from "@/data/mockData";

const ranges = ["1M", "3M", "6M", "1Y"] as const;
type Range = (typeof ranges)[number];

const rangeSlice: Record<Range, number> = { "1M": 1, "3M": 3, "6M": 6, "1Y": 12 };

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-xl p-3 shadow-lg text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-ods-teal" />
        <span className="text-muted-foreground">Clean Energy:</span>
        <span className="font-mono font-semibold text-foreground">{payload[0]?.value?.toLocaleString()} kWh</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">CO₂ Avoided:</span>
        <span className="font-mono font-semibold text-foreground">{payload[1]?.value?.toLocaleString()} kg</span>
      </div>
    </div>
  );
};

const downloadCSV = () => {
  const header = "Month,kWh Generated,CO2 Avoided (kg)\n";
  const rows = sunlightAssetTimeline.map((d) => `${d.month},${d.kwhGenerated},${d.co2Avoided}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "sunlight-to-asset.csv" });
  a.click();
  URL.revokeObjectURL(url);
};

const SunlightAssetChart = () => {
  const [range, setRange] = useState<Range>("1Y");
  const data = useMemo(() => sunlightAssetTimeline.slice(-rangeSlice[range]), [range]);

  return (
    <div className="card-elevated rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight font-sans">Sunlight → Financial Asset</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">Clean energy generation & Scope 3 CO₂ avoided (AB-InBev portfolio)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-[10px] font-mono font-semibold tracking-wider transition-colors ${
                  range === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={downloadCSV} title="Download CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-4 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground font-sans">
          <span className="w-3 h-[3px] rounded-full bg-ods-teal" /> kWh Generated
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground font-sans">
          <span className="w-3 h-[3px] rounded-full bg-primary" /> CO₂ Avoided (kg)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradKwh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(178, 65%, 42%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(178, 65%, 42%)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradCo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(205, 85%, 42%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(205, 85%, 42%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="kwh" tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <YAxis yAxisId="co2" orientation="right" tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(205, 85%, 42%)", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area yAxisId="kwh" type="monotone" dataKey="kwhGenerated" stroke="hsl(178, 65%, 42%)" fill="url(#gradKwh)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "hsl(178, 65%, 42%)", stroke: "#fff", strokeWidth: 2 }} />
          <Area yAxisId="co2" type="monotone" dataKey="co2Avoided" stroke="hsl(205, 85%, 42%)" fill="url(#gradCo2)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "hsl(205, 85%, 42%)", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SunlightAssetChart;
