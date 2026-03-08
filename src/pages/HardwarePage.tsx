import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Shield,
  Signal,
  Cpu,
  Search,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { hardwareHealth, elisaUnits } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

type ProvisionedPole = {
  serial: string;
  sponsor: string;
  community: string;
  country: string;
  status: "active" | "maintenance" | "offline" | "decommissioned";
  lastPing: string;
  secret: string;
};

const initialPoles: ProvisionedPole[] = [
  { serial: "ELISA-PH-001", sponsor: "Global Beverage Co.", community: "Barangay Luz", country: "Philippines", status: "active", lastPing: "2 min ago", secret: "sk_ph001_a7b3…" },
  { serial: "ELISA-CO-012", sponsor: "Global Beverage Co.", community: "Villa Esperanza", country: "Colombia", status: "active", lastPing: "5 min ago", secret: "sk_co012_f9e2…" },
  { serial: "ELISA-KE-005", sponsor: "AB-InBev", community: "Kibera South", country: "Kenya", status: "maintenance", lastPing: "3 hrs ago", secret: "sk_ke005_d4c1…" },
  { serial: "ELISA-IN-022", sponsor: "Nestlé", community: "Jaipur Rural", country: "India", status: "active", lastPing: "1 min ago", secret: "sk_in022_b8a6…" },
  { serial: "ELISA-BR-008", sponsor: "Global Beverage Co.", community: "Rio Negro", country: "Brazil", status: "active", lastPing: "8 min ago", secret: "sk_br008_e3f7…" },
  { serial: "ELISA-NG-003", sponsor: "AB-InBev", community: "Epe District", country: "Nigeria", status: "active", lastPing: "3 min ago", secret: "sk_ng003_c2d5…" },
  { serial: "ELISA-MX-015", sponsor: "Nestlé", community: "San Pablo", country: "Mexico", status: "active", lastPing: "4 min ago", secret: "sk_mx015_a1b9…" },
  { serial: "ELISA-ID-009", sponsor: "Global Beverage Co.", community: "Ende Village", country: "Indonesia", status: "offline", lastPing: "12 hrs ago", secret: "sk_id009_f6e8…" },
  { serial: "ELISA-GH-002", sponsor: "AB-InBev", community: "Tamale North", country: "Ghana", status: "active", lastPing: "1 min ago", secret: "sk_gh002_d7c3…" },
  { serial: "ELISA-PE-011", sponsor: "Nestlé", community: "Ollantaytambo", country: "Peru", status: "active", lastPing: "6 min ago", secret: "sk_pe011_b4a2…" },
];

const sponsors = ["Global Beverage Co.", "AB-InBev", "Nestlé", "Unilever", "Coca-Cola"];

const statusBadge: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/30",
  maintenance: "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,55%)] border-[hsl(38,92%,55%)]/30",
  offline: "bg-destructive/15 text-destructive border-destructive/30",
  decommissioned: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};

const healthColor = (val: number) => {
  if (val >= 80) return "text-primary";
  if (val >= 50) return "text-[hsl(38,92%,55%)]";
  return "text-destructive";
};

const progressColor = (val: number) => {
  if (val >= 80) return "bg-primary";
  if (val >= 50) return "bg-[hsl(38,92%,55%)]";
  return "bg-destructive";
};

const HardwarePage = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSerial, setNewSerial] = useState("");
  const [newSponsor, setNewSponsor] = useState("");
  const [newCommunity, setNewCommunity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [registering, setRegistering] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [poles, setPoles] = useState<ProvisionedPole[]>(initialPoles);
  const [activeTab, setActiveTab] = useState<"provisioning" | "health">("provisioning");
  const { toast } = useToast();

  const filtered = poles.filter(
    (p) =>
      p.serial.toLowerCase().includes(search.toLowerCase()) ||
      p.sponsor.toLowerCase().includes(search.toLowerCase()) ||
      p.community.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = async () => {
    if (!newSerial || !newSponsor || !newCommunity || !newCountry) return;
    setRegistering(true);
    // TODO: Replace with supabase insert to elisa_poles table
    await new Promise((r) => setTimeout(r, 1200));
    toast({
      title: "Pole Registered",
      description: `${newSerial} linked to ${newSponsor} in ${newCommunity}, ${newCountry}.`,
    });
    setRegistering(false);
    setDialogOpen(false);
    setNewSerial("");
    setNewSponsor("");
    setNewCommunity("");
    setNewCountry("");
  };

  const handleCopySecret = (serial: string, secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(serial);
    setTimeout(() => setCopiedSecret(null), 2000);
  };

  const activeCount = provisionedPoles.filter((p) => p.status === "active").length;
  const maintenanceCount = provisionedPoles.filter((p) => p.status === "maintenance").length;
  const offlineCount = provisionedPoles.filter((p) => p.status === "offline").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Hardware Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Provision, monitor, and manage ELISA solar unit fleet
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Register New ELISA Pole
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register ELISA Unit</DialogTitle>
              <DialogDescription>
                Provision a new solar pole and link it to a corporate sponsor. A hardware secret will
                be generated for IoT authentication.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-xs">Serial Number</Label>
                <Input
                  placeholder="ELISA-XX-000"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Assigned Sponsor</Label>
                <Select value={newSponsor} onValueChange={setNewSponsor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsors.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Community</Label>
                  <Input
                    placeholder="Village name"
                    value={newCommunity}
                    onChange={(e) => setNewCommunity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Country</Label>
                  <Input
                    placeholder="Country"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={registering || !newSerial || !newSponsor || !newCommunity || !newCountry}
                className="gap-2"
              >
                {registering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {registering ? "Provisioning…" : "Register & Generate Secret"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Signal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Poles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-[hsl(38,92%,55%)]/10">
              <Cpu className="h-5 w-5 text-[hsl(38,92%,55%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{maintenanceCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Maintenance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{offlineCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Offline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("provisioning")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === "provisioning"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Provisioning Registry
        </button>
        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === "health"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Health Monitor
        </button>
      </div>

      {activeTab === "provisioning" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">ELISA Pole Registry</CardTitle>
                  <CardDescription className="text-xs">
                    {provisionedPoles.length} units provisioned across {new Set(provisionedPoles.map((p) => p.country)).size} countries
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search serial, sponsor, community…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Serial Number</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Assigned Sponsor</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Community</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Ping</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">API Secret</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((pole, i) => (
                    <TableRow key={pole.serial} className="border-border">
                      <TableCell className="font-mono text-xs font-medium text-foreground">
                        {pole.serial}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">{pole.sponsor}</TableCell>
                      <TableCell className="text-xs text-foreground/80">{pole.community}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{pole.country}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] uppercase tracking-wider border ${statusBadge[pole.status]}`}
                        >
                          {pole.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{pole.lastPing}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleCopySecret(pole.serial, pole.secret)}
                          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedSecret === pole.serial ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {pole.secret}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "health" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {hardwareHealth.map((hw, i) => {
            const unit = elisaUnits.find((u) => u.id === hw.id);
            return (
              <motion.div
                key={hw.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-elevated rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        unit?.status === "active" ? "dot-active" : "dot-danger"
                      }`}
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {unit?.name || hw.id}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2 font-mono">{hw.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Last ping: {hw.lastPing}
                    </span>
                    <Badge
                      className={`text-[10px] px-2 py-0 border ${
                        statusBadge[unit?.status || "offline"]
                      }`}
                    >
                      {unit?.status || "unknown"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Battery", value: hw.battery },
                    { label: "Solar Panel", value: hw.solar },
                    { label: "WiFi Module", value: hw.wifi },
                    { label: "Light Array", value: hw.light },
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className={`font-mono font-medium ${healthColor(metric.value)}`}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${progressColor(metric.value)}`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default HardwarePage;
