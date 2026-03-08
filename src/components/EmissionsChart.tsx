import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { emissionsTimeline } from "@/data/mockData";

const EmissionsChart = () => {
  return (
    <div className="card-elevated rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sunshine to Financial Asset</h3>
          <p className="text-xs text-muted-foreground mt-1">Avoided Scope 3 emissions (tCO₂e) month-over-month</p>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-primary rounded" /> Monthly
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-primary/40 rounded" /> Cumulative
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={emissionsTimeline}>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(142, 72%, 48%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(142, 72%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 11 }} axisLine={{ stroke: "hsl(220, 14%, 18%)" }} />
          <YAxis tick={{ fill: "hsl(215, 14%, 52%)", fontSize: 11 }} axisLine={{ stroke: "hsl(220, 14%, 18%)" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Area type="monotone" dataKey="avoided" stroke="hsl(142, 72%, 48%)" fill="url(#greenGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsChart;
