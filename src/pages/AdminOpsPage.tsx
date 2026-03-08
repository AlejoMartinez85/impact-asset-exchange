import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Warehouse,
  Building2,
  Rocket,
  Link2,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const COUNTRIES = ["Colombia", "Mexico", "Peru", "Philippines", "Kenya", "India", "Brazil", "Nigeria", "Indonesia", "Ghana"];

const AdminOpsPage = () => {
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [serialPrefix, setSerialPrefix] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteSponsorName, setInviteSponsorName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch sponsors
  const { data: sponsors, isLoading: sponsorsLoading } = useQuery({
    queryKey: ["admin-ops-sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sponsors").select("*").order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch pole count
  const { data: poleCount } = useQuery({
    queryKey: ["admin-ops-pole-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("elisa_poles")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      if (error) throw error;
      return count || 0;
    },
  });

  const handleProvision = async () => {
    if (!selectedSponsor || !quantity || !serialPrefix || !targetCountry) return;
    setProvisioning(true);
    await new Promise((r) => setTimeout(r, 1500));
    const sponsorName = sponsors?.find((s: any) => s.id === selectedSponsor)?.name || "Unknown";
    toast({
      title: "Cluster Provisioned",
      description: `Successfully allocated ${quantity} ELISA units to ${sponsorName}. Hardware status set to: Pending Installation.`,
    });
    setProvisioning(false);
    setSelectedSponsor("");
    setQuantity("");
    setSerialPrefix("");
    setTargetCountry("");
  };

  const handleGenerateInvite = (sponsorName: string) => {
    const mockToken = btoa(`invite-${sponsorName}-${Date.now()}`).slice(0, 24);
    setInviteLink(`https://impact.litrodeluz.org/invite/${mockToken}`);
    setInviteSponsorName(sponsorName);
    setInviteDialogOpen(true);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShieldCheck className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Access restricted to Super Admin users.</p>
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg border border-border bg-card">
          <Label htmlFor="admin-toggle" className="text-xs text-muted-foreground">View as Super Admin</Label>
          <Switch id="admin-toggle" checked={isSuperAdmin} onCheckedChange={setIsSuperAdmin} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-orange-500/10 border border-orange-500/20">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
            </div>
            <h2 className="text-base font-semibold text-foreground tracking-tight">
              Operations Dashboard
            </h2>
            <Badge className="text-[9px] bg-orange-500/10 text-orange-500 border-orange-500/20 uppercase tracking-widest">
              Internal
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-8">
            Global hardware inventory & corporate cluster provisioning
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-card border-border shadow-none">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="p-2 rounded-md bg-primary/8 border border-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground font-mono">{poleCount ?? "—"}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Poles Deployed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-none">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="p-2 rounded-md bg-blue-500/8 border border-blue-500/10">
              <Warehouse className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground font-mono">462</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Stock (Cali HQ)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-none">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="p-2 rounded-md bg-violet-500/8 border border-violet-500/10">
              <Building2 className="h-4 w-4 text-violet-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground font-mono">
                {sponsorsLoading ? "—" : sponsors?.filter((s: any) => s.subscription_status === "active").length ?? 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Sponsors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Provisioning Tool */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-semibold">Provision Corporate Impact Cluster</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Bulk-assign hardware units to a sponsor and generate serial numbers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Select Sponsor</Label>
              <Select value={selectedSponsor} onValueChange={setSelectedSponsor}>
                <SelectTrigger className="h-9 text-xs border-border bg-secondary/30">
                  <SelectValue placeholder="Choose sponsor…" />
                </SelectTrigger>
                <SelectContent>
                  {(sponsors || []).map((s: any) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Quantity to Assign</Label>
              <Input
                type="number"
                min={1}
                max={500}
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-9 text-xs border-border bg-secondary/30 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Serial Number Prefix</Label>
              <Input
                placeholder="e.g. ELISA-NES-"
                value={serialPrefix}
                onChange={(e) => setSerialPrefix(e.target.value)}
                className="h-9 text-xs border-border bg-secondary/30 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Target Country</Label>
              <Select value={targetCountry} onValueChange={setTargetCountry}>
                <SelectTrigger className="h-9 text-xs border-border bg-secondary/30">
                  <SelectValue placeholder="Select country…" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button
              onClick={handleProvision}
              disabled={provisioning || !selectedSponsor || !quantity || !serialPrefix || !targetCountry}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs h-9"
            >
              {provisioning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Rocket className="h-3.5 w-3.5" />
              )}
              {provisioning ? "Allocating…" : "Allocate & Provision Hardware"}
            </Button>
            {selectedSponsor && quantity && (
              <span className="text-[11px] text-muted-foreground">
                {quantity} units → {sponsors?.find((s: any) => s.id === selectedSponsor)?.name || "—"} in {targetCountry || "…"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sponsor Management Table */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Sponsor Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sponsorsLoading ? (
            <div className="p-8 text-center text-muted-foreground text-xs">Loading sponsors…</div>
          ) : !sponsors?.length ? (
            <div className="p-8 text-center text-muted-foreground text-xs">No sponsors registered yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Sponsor</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Created</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((s: any) => (
                  <TableRow key={s.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          {s.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="text-xs font-medium text-foreground">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          s.subscription_status === "active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {s.subscription_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(s.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] gap-1.5 border-border text-muted-foreground hover:text-foreground"
                        onClick={() => handleGenerateInvite(s.name)}
                      >
                        <Link2 className="h-3 w-3" />
                        Generate Invite Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Invite Link Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Invite Link for {inviteSponsorName}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Send this link to the sponsor's CSO or designated admin. It expires in 7 days.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Input
              readOnly
              value={inviteLink}
              className="text-xs font-mono bg-secondary/50 border-border"
            />
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={handleCopyLink}>
              {copiedLink ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedLink ? "Copied" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Super Admin Toggle */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
        <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border bg-muted/30">
          <Label htmlFor="admin-toggle-bottom" className="text-[11px] text-muted-foreground">
            View as Super Admin
          </Label>
          <Switch
            id="admin-toggle-bottom"
            checked={isSuperAdmin}
            onCheckedChange={setIsSuperAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOpsPage;
