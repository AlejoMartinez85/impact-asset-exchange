import { useState } from "react";
import { motion } from "framer-motion";
import PaywallGate from "@/components/PaywallGate";
import { FileText, Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAIReport, sponsorInfo, kpiData } from "@/data/mockData";

const ReportsPage = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 2500));
    setReport(generateAIReport(sponsorInfo, kpiData));
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI-Powered ESG Reports</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate comprehensive sustainability reports powered by AI analysis of your impact data
        </p>
      </div>

      <div className="card-elevated rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Generate AI Sustainability Report</h3>
            <p className="text-xs text-muted-foreground">Analyzes your historical kWh, CO₂, and connectivity data to produce an executive-ready ESG summary</p>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing data...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Q1 2025 Report
            </>
          )}
        </Button>
      </div>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Generated Report</h3>
            <Button variant="outline" size="sm" className="text-xs border-border text-muted-foreground hover:text-foreground">
              <Download className="mr-1.5 h-3 w-3" /> Export PDF
            </Button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
            {report.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold text-primary mt-4 mb-1">{line.slice(4)}</h3>;
              if (line.startsWith("- ")) return <li key={i} className="text-xs text-foreground/80 ml-4 mb-1">{line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split(/(<strong>.*?<\/strong>)/).map((part, j) => part.startsWith('<strong>') ? <strong key={j} className="text-foreground">{part.replace(/<\/?strong>/g, '')}</strong> : part)}</li>;
              if (line.startsWith("---")) return <hr key={i} className="border-border my-4" />;
              if (line.startsWith("*")) return <p key={i} className="text-[10px] text-muted-foreground italic mt-2">{line.replace(/\*/g, "")}</p>;
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return <p key={i} className="text-xs text-foreground/80 mb-2">{line.replace(/\*\*(.*?)\*\*/g, '').split(/(\*\*.*?\*\*)/).map((part, j) => part.startsWith('**') ? <strong key={j} className="text-foreground">{part.replace(/\*\*/g, '')}</strong> : part)}</p>;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportsPage;
