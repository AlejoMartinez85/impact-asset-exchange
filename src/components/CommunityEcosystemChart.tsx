import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, TooltipProps, Legend,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sunlightAssetTimeline } from "@/data/mockData";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-xl p-3 shadow-lg shadow-primary/10 text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "hsl(190, 90%, 50%)" }} />
        <span className="text-muted-foreground">WiFi Connections:</span>
        <span className="font-mono font-semibold text-foreground">{payload[0]?.value?.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "hsl(38, 92%, 55%)" }} />
        <span className="text-muted-foreground">Lighting Hours:</span>
        <span className="font-mono font-semibold text-foreground">{payload[1]?.value?.toLocaleString()}</span>
      </div>
    </div>
  );
};

const downloadCSV = () => {
  const header = "Month,WiFi Connections,Lighting Hours\n";
  const rows = sunlightAssetTimeline.map((d) => `${d.month},${d.wifiConnections},${d.lightHours}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "community-ecosystem.csv" });
  a.click();
  URL.revokeObjectURL(url);
};

const CommunityEcosystemChart = () => {
  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Community Ecosystem</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Digital & physical infrastructure uptime per month</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={downloadCSV} title="Download CSV">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-4 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-3 h-[3px] rounded-full" style={{ background: "hsl(190, 90%, 50%)" }} /> WiFi Connections
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-3 h-[3px] rounded-full" style={{ background: "hsl(38, 92%, 55%)" }} /> Public Lighting (hrs)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sunlightAssetTimeline} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 15%)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "hsl(215, 14%, 45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215, 14%, 45%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(220, 14%, 12%)" }} />
          <Bar dataKey="wifiConnections" stackId="community" fill="hsl(190, 90%, 50%)" radius={[0, 0, 0, 0]} fillOpacity={0.85} />
          <Bar dataKey="lightHours" stackId="community" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommunityEcosystemChart;
