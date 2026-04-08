import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Leaf, Coins, Database } from "lucide-react";

const metrics = [
  {
    label: "Required CapEx Investment",
    icon: DollarSign,
    suffix: " USD",
    prefix: "$",
    subtext: "One-time infrastructure cost",
    multiplier: 400,
    color: "ods-green" as const,
  },
  {
    label: "Monitored Ecosystem Area",
    icon: Leaf,
    suffix: " Hectares",
    prefix: "",
    subtext: "Coffee & Dairy land digitized",
    multiplier: 2,
    color: "ods-teal" as const,
  },
  {
    label: "Annual $LITRO Tokens Minted",
    icon: Coins,
    suffix: " Tokens/Year",
    prefix: "",
    subtext: "Cryptographic PoPW Certificates",
    multiplier: 12,
    color: "ods-blue" as const,
  },
  {
    label: "Soil & Water Data Points",
    icon: Database,
    suffix: " Data Points",
    prefix: "",
    subtext: "Auditable ESG ledger entries",
    multiplier: 8760,
    color: "ods-green" as const,
  },
];

const formatNumber = (n: number) => n.toLocaleString("en-US");

const RegenerativeROISimulator = () => {
  const [nodes, setNodes] = useState(50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[hsl(var(--ods-green))] via-[hsl(var(--ods-teal))] to-[hsl(var(--ods-blue))]" />
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">
                Net Zero 2050: Scale Your Regenerative Impact
              </CardTitle>
              <CardDescription className="text-xs font-sans">
                Adjust the deployment scale to project your automated ESG asset generation across coffee and dairy supply chains.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold border-[hsl(var(--ods-green))]/25 text-[hsl(var(--ods-green))] font-sans"
            >
              Interactive Simulator
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Slider */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-sans">Deployment Scale</p>
                <p className="text-3xl font-bold font-mono text-foreground tracking-tight">
                  {formatNumber(nodes)}
                  <span className="text-sm font-sans font-medium text-muted-foreground ml-2">
                    ELISA Nodes
                  </span>
                </p>
              </div>
              <div className="flex gap-3 text-[10px] text-muted-foreground font-sans">
                <span>Min: 50</span>
                <span>Max: 1,000</span>
              </div>
            </div>
            <Slider
              value={[nodes]}
              onValueChange={(v) => setNodes(v[0])}
              min={50}
              max={1000}
              step={50}
              className="[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-[hsl(var(--ods-green))] [&_[data-slot=slider-range]]:to-[hsl(var(--ods-teal))] [&_[data-slot=slider-thumb]]:border-[hsl(var(--ods-green))] [&>span>span]:bg-gradient-to-r [&>span>span]:from-[hsl(var(--ods-green))] [&>span>span]:to-[hsl(var(--ods-teal))]"
            />
          </div>

          {/* Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, i) => {
              const value = nodes * m.multiplier;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="p-4 rounded-lg bg-secondary/40 border border-border/50 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-[hsl(var(--${m.color}))]/10 ring-1 ring-[hsl(var(--${m.color}))]/20`}>
                      <m.icon className={`h-3.5 w-3.5 text-[hsl(var(--${m.color}))]`} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground font-sans">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-foreground tracking-tight">
                    {m.prefix}{formatNumber(value)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-sans">{m.suffix.trim()}</p>
                  <p className="text-[10px] text-muted-foreground/70 font-sans">{m.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegenerativeROISimulator;
