import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, TooltipProps,
} from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sdgRadarData } from "@/data/mockData";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-xl p-3 shadow-lg shadow-primary/10 text-xs space-y-1">
      <p className="font-semibold text-foreground">{d.payload.sdgNum}: {d.payload.sdg}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "hsl(190, 90%, 50%)" }} />
        <span className="text-muted-foreground">Impact Score:</span>
        <span className="font-mono font-bold text-foreground">{d.value}/100</span>
      </div>
    </div>
  );
};

const downloadCSV = () => {
  const header = "SDG,Name,Score\n";
  const rows = sdgRadarData.map((d) => `${d.sdgNum},${d.sdg},${d.score}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "sdg-alignment.csv" });
  a.click();
  URL.revokeObjectURL(url);
};

const SDGRadarChartComponent = () => {
  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">UN SDG Alignment</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Impact scoring against target Sustainable Development Goals</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={downloadCSV} title="Download CSV">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={sdgRadarData} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="hsl(220, 14%, 18%)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="sdg"
            tick={{ fill: "hsl(215, 14%, 55%)", fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "hsl(215, 14%, 35%)", fontSize: 9 }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Impact Score"
            dataKey="score"
            stroke="hsl(190, 90%, 50%)"
            fill="hsl(190, 90%, 50%)"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 3.5, fill: "hsl(190, 90%, 50%)", stroke: "hsl(220, 20%, 7%)", strokeWidth: 1.5 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SDGRadarChartComponent;
