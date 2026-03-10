import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Loader2, Sparkles, AlertCircle, Calendar, Brain, Eye, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { sponsorInfo, kpiData } from "@/data/mockData";
import { generatedPoles } from "@/data/generatePoles";
import PaywallGate from "@/components/PaywallGate";
import ESGReportDocument from "@/components/ESGReportDocument";
import { useToast } from "@/hooks/use-toast";
import { ESGFocus, ESG_FOCUS_OPTIONS } from "@/data/esgFocusData";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-esg-report`;

const TIMEFRAMES = [
  { value: "Q1 2026", label: "Q1 2026 (Jan – Mar)" },
  { value: "Q4 2025", label: "Q4 2025 (Oct – Dec)" },
  { value: "Q3 2025", label: "Q3 2025 (Jul – Sep)" },
  { value: "Q2 2025", label: "Q2 2025 (Apr – Jun)" },
  { value: "Q1 2025", label: "Q1 2025 (Jan – Mar)" },
];

const LOADING_MESSAGES = [
  "Analyzing Telemetry Data…",
  "Calculating Scope 3 Avoided Emissions…",
  "Mapping SDG Alignments…",
  "Aggregating Community Uptime Metrics…",
  "Drafting Executive Summary…",
];

const ReportsPage = () => {
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("Q1 2026");
  const [esgFocus, setEsgFocus] = useState<ESGFocus>("carbon_climate");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIdx(0);
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const activePoles = generatedPoles.filter((u) => u.status === "active").length;
  const wifiTotal = generatedPoles.reduce((s, u) => s + u.wifiUsers, 0);

  const handleGenerate = async () => {
    setLoading(true);
    setReport("");
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const sponsorData = {
      sponsor_name: sponsorInfo.name,
      reporting_period: timeframe,
      active_poles: activePoles,
      kwh_generated: kpiData.cleanEnergy,
      co2_avoided: kpiData.co2Avoided * 1000,
      wifi_connections: wifiTotal,
      beneficiaries: kpiData.totalBeneficiaries,
      total_investment: kpiData.totalInvestment,
      countries: 6,
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

  const handleDownloadPDF = () => {
    const docEl = document.getElementById("esg-report-document");
    if (!docEl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({ title: "Popup blocked", description: "Please allow popups to download PDF.", variant: "destructive" });
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>ESG Report – ${sponsorInfo.name} – ${timeframe}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; max-width: 900px; margin: 0 auto; color: #111827; }
        @media print { body { margin: 0; } @page { margin: 20mm; } }
      </style>
      <script src="https://cdn.tailwindcss.com"><\/script>
      </head><body>
      ${docEl.outerHTML}
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 600);
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-foreground mt-6 mb-3 pb-2 border-b border-border">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-base font-semibold text-foreground mt-8 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold text-primary mt-5 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) {
        const parts = line.slice(2).split(/\*\*(.*?)\*\*/g);
        return (
          <li key={i} className="text-xs text-foreground/80 ml-4 mb-1.5 list-disc">
            {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part))}
          </li>
        );
      }
      if (line.startsWith("---")) return <hr key={i} className="border-border my-6" />;
      if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="text-[10px] text-muted-foreground italic mt-3">{line.replace(/\*/g, "")}</p>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-xs text-foreground/80 mb-2 leading-relaxed">
          {parts.map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part))}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI ESG Reporting Hub</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Transform raw telemetry into investor-ready sustainability reports powered by AI
        </p>
      </div>

      <PaywallGate featureName="AI Report Generator">
        {/* ─── Control Panel ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated rounded-xl p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Generate AI Impact Report</h3>
              <p className="text-[11px] text-muted-foreground">
                Lovable AI analyzes {activePoles.toLocaleString()} active ELISA poles to produce a GRI/SASB-compliant executive summary
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-52 h-9 text-xs bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value} className="text-xs">
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Impact Report
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border text-muted-foreground hover:text-foreground"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide" : "Preview"} Report Template
            </Button>

            {loading && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => abortRef.current?.abort()}>
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
        </motion.div>

        {/* ─── Loading State ─── */}
        <AnimatePresence>
          {loading && !report && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="card-elevated rounded-xl p-6 border border-border space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <div className="absolute inset-0 h-5 w-5 rounded-full bg-primary/20 animate-ping" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={loadingMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium text-primary font-mono"
                  >
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-3/4 bg-secondary" />
                <Skeleton className="h-3 w-full bg-secondary/60" />
                <Skeleton className="h-3 w-5/6 bg-secondary/60" />
                <Skeleton className="h-3 w-4/6 bg-secondary/60" />
                <div className="pt-2" />
                <Skeleton className="h-4 w-1/2 bg-secondary" />
                <Skeleton className="h-3 w-full bg-secondary/60" />
                <Skeleton className="h-3 w-3/4 bg-secondary/60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── AI Streamed Report Output ─── */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated rounded-xl border border-border"
          >
            <div className="flex items-center justify-between p-5 pb-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {loading ? "Streaming Report…" : `${sponsorInfo.name} — ${timeframe} ESG Report`}
                </h3>
              </div>
              {!loading && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  onClick={handleDownloadPDF}
                >
                  <Download className="mr-1.5 h-3 w-3" /> Download PDF
                </Button>
              )}
            </div>
            <div ref={reportRef} className="p-5 pt-4 prose prose-invert prose-sm max-w-none text-foreground/90 leading-relaxed">
              {renderMarkdown(report)}
              {loading && <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5 rounded-sm" />}
            </div>
          </motion.div>
        )}

        {/* ─── Static Report Preview (PDF Template) ─── */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">📄 Report Template Preview</h3>
                <Button
                  onClick={handleDownloadPDF}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
              <ESGReportDocument />
            </motion.div>
          )}
        </AnimatePresence>
      </PaywallGate>
    </div>
  );
};

export default ReportsPage;
