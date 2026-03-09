import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Plus,
  MoreHorizontal,
  Link2,
  Eye,
  Ban,
  Loader2,
  Search,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const INDUSTRIES = ["Food & Beverage", "Technology", "Automotive", "Energy", "Consumer Goods", "Finance", "Telecommunications", "Healthcare"];

const MOCK_ENRICHMENT: Record<string, { hardware: string; arr: string; industry: string }> = {
  "Nestlé": { hardware: "50/50 Active", arr: "$4,995/yr", industry: "Food & Beverage" },
  "AB-InBev": { hardware: "75/80 Active", arr: "$7,995/yr", industry: "Food & Beverage" },
  "Google": { hardware: "30/30 Active", arr: "$2,995/yr", industry: "Technology" },
  "Unilever": { hardware: "40/40 Active", arr: "$3,995/yr", industry: "Consumer Goods" },
  "Coca-Cola": { hardware: "60/60 Active", arr: "$5,995/yr", industry: "Food & Beverage" },
};

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  pending_deployment: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  past_due: "bg-destructive/10 text-destructive border-destructive/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  pending_deployment: "Pending Deployment",
  past_due: "Past Due",
  suspended: "Suspended",
  inactive: "Inactive",
};

const SponsorManagementPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    industry: "",
    contact_email: "",
    plan: "corporate_50",
    esg_focus: "",
  });

  // Fetch sponsors from DB
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["sponsor-management"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sponsors").select("*").order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Create sponsor mutation
  const createMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data, error } = await supabase
        .from("sponsors")
        .insert({ name: payload.name, subscription_status: "active" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Sponsor Created", description: `${data.name} has been added to the directory.` });
      queryClient.invalidateQueries({ queryKey: ["sponsor-management"] });
      setAddOpen(false);
      setForm({ name: "", industry: "", contact_email: "", plan: "corporate_50", esg_focus: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  // Suspend mutation
  const suspendMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sponsors")
        .update({ subscription_status: "suspended" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Access Suspended", description: "Sponsor SaaS access has been frozen." });
      queryClient.invalidateQueries({ queryKey: ["sponsor-management"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createMutation.mutate({ name: form.name.trim() });
  };

  const handleGenerateInvite = (name: string) => {
    const token = btoa(`invite-${name}-${Date.now()}`).slice(0, 20);
    const link = `app.litrodeluz.com/invite/${token}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Invite Link Copied", description: `Invite link copied to clipboard: ${link}` });
  };

  const handleViewTelemetry = (name: string) => {
    toast({ title: "Switching Context", description: `Viewing telemetry dashboard as ${name}…` });
  };

  const filtered = (sponsors || []).filter(
    (s: any) => s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getEnrichment = (name: string) =>
    MOCK_ENRICHMENT[name] || { hardware: "0/0 Active", arr: "$0/yr", industry: "—" };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Briefcase className="h-4.5 w-4.5 text-muted-foreground" />
            Corporate Sponsors Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage enterprise tenants, subscriptions, and platform access
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs h-9"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Sponsor
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search sponsors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-8 text-xs border-border bg-secondary/30"
        />
      </div>

      {/* Sponsor Table */}
      <Card className="bg-card border-border shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading sponsors…
            </div>
          ) : !filtered.length ? (
            <div className="p-12 text-center text-muted-foreground text-xs">
              {search ? "No sponsors match your search." : "No sponsors registered yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Sponsor</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Industry</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Assigned Hardware</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">ARR / Value</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s: any) => {
                  const enrichment = getEnrichment(s.name);
                  const status = s.subscription_status || "active";
                  return (
                    <TableRow key={s.id} className="border-border group">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-muted border border-border flex items-center justify-center">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-medium text-foreground">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{enrichment.industry}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-foreground">{enrichment.hardware}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] border ${statusStyles[status] || statusStyles.inactive}`}
                        >
                          {statusLabels[status] || status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-foreground font-medium">
                        {enrichment.arr}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem
                              className="text-xs gap-2 cursor-pointer"
                              onClick={() => handleGenerateInvite(s.name)}
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Generate Magic Invite Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs gap-2 cursor-pointer"
                              onClick={() => handleViewTelemetry(s.name)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View Telemetry Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => suspendMutation.mutate(s.id)}
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Suspend SaaS Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Sponsor Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Add New Sponsor</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a new corporate tenant profile on the Impact Exchange platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Company Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Nestlé"
                className="h-9 text-xs border-border"
                required
                maxLength={100}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground font-medium">Industry</Label>
                <Select value={form.industry} onValueChange={(v) => setForm((f) => ({ ...f, industry: v }))}>
                  <SelectTrigger className="h-9 text-xs border-border">
                    <SelectValue placeholder="Select industry…" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i} className="text-xs">{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground font-medium">Primary Contact Email</Label>
                <Input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                  placeholder="cso@company.com"
                  className="h-9 text-xs border-border"
                  maxLength={255}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Subscription Plan</Label>
              <Select value={form.plan} onValueChange={(v) => setForm((f) => ({ ...f, plan: v }))}>
                <SelectTrigger className="h-9 text-xs border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate_50" className="text-xs">Corporate Impact Cluster — 50 Poles ($4,995/yr)</SelectItem>
                  <SelectItem value="corporate_100" className="text-xs">Enterprise Impact Cluster — 100 Poles ($8,995/yr)</SelectItem>
                  <SelectItem value="corporate_custom" className="text-xs">Custom Deployment — Contact Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground font-medium">Primary ESG Focus</Label>
              <Select value={form.esg_focus} onValueChange={(v) => setForm((f) => ({ ...f, esg_focus: v }))}>
                <SelectTrigger className="h-9 text-xs border-border">
                  <SelectValue placeholder="Select ESG focus…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carbon_climate" className="text-xs">Carbon & Climate Action</SelectItem>
                  <SelectItem value="digital_inclusion" className="text-xs">Digital Inclusion & Education</SelectItem>
                  <SelectItem value="community_safety" className="text-xs">Community Safety & Economy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="text-xs h-9">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !form.name.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-9 gap-1.5"
              >
                {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Sponsor Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorManagementPage;
