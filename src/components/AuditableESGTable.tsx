import { useState, useMemo } from "react";
import { generatedPoles } from "@/data/generatePoles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, ChevronLeft, ChevronRight, Radio } from "lucide-react";

const ROWS_PER_PAGE = 10;

const downloadCSV = (data: typeof generatedPoles) => {
  const headers = ["Serial Number", "Country", "Community", "Status", "kWh Produced", "WiFi Users", "Battery %", "Uptime %"];
  const rows = data.map((p) => [p.id, p.country, p.community, p.status, p.kwhProduced, p.wifiUsers, p.batteryHealth, p.uptime]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `elisa-audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const AuditableESGTable = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return generatedPoles;
    const q = search.toLowerCase();
    return generatedPoles.filter(
      (p) => p.id.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.community.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  // Reset page when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
  };

  return (
    <div className="card-elevated rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Auditable ESG Ledger</h3>
            <p className="text-[11px] text-muted-foreground">
              {filtered.length} ELISA poles · Granular hardware-level telemetry
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search serial, country…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-8 text-xs w-full sm:w-56 bg-secondary/50 border-border"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-border text-muted-foreground hover:text-foreground hover:border-primary/40 shrink-0"
            onClick={() => downloadCSV(filtered)}
          >
            <Download className="mr-1.5 h-3 w-3" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Serial Number</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Location</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">Clean Energy</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">WiFi Users</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">Battery</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-right">Uptime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">
                  No poles match your search.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((pole, i) => (
                <TableRow
                  key={pole.id}
                  className={`border-border transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}`}
                >
                  <TableCell className="font-mono text-xs text-foreground">{pole.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{pole.country}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${
                        pole.status === "active"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)] border-[hsl(38,92%,55%)]/30"
                      }`}
                    >
                      {pole.status === "active" ? "Online" : "Maintenance"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground">{(pole.kwhProduced / 1000).toFixed(2)} kWh</TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground">{pole.wifiUsers}</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    <span className={pole.batteryHealth > 70 ? "text-primary" : "text-destructive"}>{pole.batteryHealth}%</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-foreground">{pole.uptime}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground">
          Showing {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-border"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const start = Math.max(0, Math.min(page - 2, totalPages - 5));
            const pageNum = start + i;
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="icon"
                className={`h-7 w-7 text-[11px] font-mono ${pageNum === page ? "bg-primary text-primary-foreground" : "border-border"}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum + 1}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 border-border"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditableESGTable;
