import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sponsorInfo, kpiData, elisaUnits } from "@/data/mockData";
import PaywallGate from "@/components/PaywallGate";
import { useToast } from "@/hooks/use-toast";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-esg-report`;

const ReportsPage = () => {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setReport("");
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const wifiTotal = elisaUnits.reduce((s, u) => s + u.wifiUsers, 0);

    const sponsorData = {
      sponsor_name: sponsorInfo.name,
      reporting_period: "Q1 2025 (January – March)",
      active_poles: elisaUnits.filter((u) => u.status === "active").length,
      kwh_generated: kpiData.cleanEnergy,
      co2_avoided: kpiData.co2Avoided * 1000, // tons to kg
      wifi_connections: wifiTotal,
      beneficiaries: kpiData.totalBeneficiaries,
      total_investment: kpiData.totalInvestment,
      countries: sponsorInfo.countries,
      communities: sponsorInfo.communities,
    };

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ sponsorData }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        const msg = errData.error || `Error ${resp.status}`;
        if (resp.status === 429) toast({ title: "Rate Limited", description: msg, variant: "destructive" });
        else if (resp.status === 402) toast({ title: "Credits Exhausted", description: msg, variant: "destructive" });
        else toast({ title: "Generation Failed", description: msg, variant: "destructive" });
        setError(msg);
        setLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setReport(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError("Failed to generate report. Please try again.");
        toast({ title: "Error", description: "Failed to generate report.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold text-primary mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) {
        const parts = line.slice(2).split(/\*\*(.*?)\*\*/g);
        return (
          <li key={i} className="text-xs text-foreground/80 ml-4 mb-1">
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part))}
          </li>
        );
      }
      if (line.startsWith("---")) return <hr key={i} className="border-border my-4" />;
      if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="text-[10px] text-muted-foreground italic mt-2">{line.replace(/\*/g, "")}</p>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-xs text-foreground/80 mb-2">
          {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part))}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI-Powered ESG Reports</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate comprehensive sustainability reports powered by AI analysis of your impact data
        </p>
      </div>

      <PaywallGate featureName="AI Report Generator">
        <div className="card-elevated rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-md bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Generate AI Sustainability Report</h3>
              <p className="text-xs text-muted-foreground">
                Uses Lovable AI to analyze your telemetry data and produce an investor-ready ESG executive summary
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating report…
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Q1 2025 Report
                </>
              )}
            </Button>
            {loading && (
              <Button variant="outline" size="sm" onClick={() => abortRef.current?.abort()}>
                Cancel
              </Button>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </div>
          )}
        </div>

        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                {loading ? "Generating…" : "Generated Report"}
              </h3>
              {!loading && (
                <Button variant="outline" size="sm" className="text-xs border-border text-muted-foreground hover:text-foreground">
                  <Download className="mr-1.5 h-3 w-3" /> Export PDF
                </Button>
              )}
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
              {renderMarkdown(report)}
              {loading && <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5" />}
            </div>
          </motion.div>
        )}
      </PaywallGate>
    </div>
  );
};

export default ReportsPage;
