import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { sdgRadarData } from "@/data/mockData";

const SDGRadarChart = () => {
  return (
    <div className="card-elevated rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">UN SDG Alignment</h3>
        <p className="text-xs text-muted-foreground mt-1">Impact scoring against target Sustainable Development Goals</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={sdgRadarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(220, 14%, 18%)" />
          <PolarAngleAxis dataKey="sdg" tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(215, 14%, 40%)", fontSize: 9 }} />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Radar name="Impact Score" dataKey="score" stroke="hsl(142, 72%, 48%)" fill="hsl(142, 72%, 48%)" fillOpacity={0.2} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SDGRadarChart;
