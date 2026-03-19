import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Key, LogOut, ChevronRight, Circle, UserCheck } from "lucide-react";
import ViewModeToggle from "@/components/ViewModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ROUTE_META: Record<string, { section: string; title: string }> = {
  "/dashboard": { section: "Overview", title: "Live Telemetry" },
  "/dashboard/map": { section: "Monitoring", title: "Live Map" },
  "/dashboard/reports": { section: "Intelligence", title: "AI Certifications" },
  "/dashboard/hardware": { section: "Operations", title: "Hardware Health" },
  "/dashboard/telemetry": { section: "Monitoring", title: "Real-Time Telemetry" },
  "/dashboard/billing": { section: "Account", title: "Billing & Plan" },
  "/dashboard/developer": { section: "Account", title: "Developer API" },
  "/dashboard/admin/users": { section: "Admin", title: "User Management" },
  "/dashboard/admin/ops": { section: "Admin", title: "Operations Console" },
  "/dashboard/admin/sponsors": { section: "Admin", title: "Sponsors Directory" },
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { profile, signOut, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [auditorDialogOpen, setAuditorDialogOpen] = useState(false);
  const [auditorEmail, setAuditorEmail] = useState("");

  const meta = ROUTE_META[location.pathname] || { section: "Dashboard", title: "Overview" };
  const displayName = profile?.display_name || "User";
  const sponsorName = profile?.sponsor_name || "Litro de Luz";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been logged out." });
  };

  const handleGenerateAuditorLink = () => {
    if (!auditorEmail.trim() || !auditorEmail.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid auditor email address.", variant: "destructive" });
      return;
    }
    toast({
      title: "Secure View Link Generated",
      description: `Read-only access link sent to ${auditorEmail}. Valid for 30 days.`,
    });
    setAuditorEmail("");
    setAuditorDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ─── Header ─── */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/80 backdrop-blur-md shrink-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <div className="h-4 w-px bg-border" />
              <nav className="flex items-center gap-1.5 text-xs font-sans">
                <span className="text-muted-foreground">{meta.section}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-foreground font-medium">{meta.title}</span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 text-[10px] font-medium border-ods-teal/20 bg-ods-teal/5 text-ods-teal tracking-wide font-sans"
              >
                <Circle className="h-1.5 w-1.5 fill-current animate-pulse" />
                Cluster Status: Online
              </Badge>

              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground px-2.5 py-1 rounded-md bg-secondary/40 border border-border/50 font-sans">
                <span className="font-medium text-foreground">{sponsorName}</span>
              </div>

              <div className="h-4 w-px bg-border" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-secondary/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold font-sans">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-medium text-foreground leading-none font-sans">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5 font-sans">
                        {isSuperAdmin ? "Super Admin" : "Sponsor"}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-2 border-b border-border mb-1">
                    <p className="text-xs font-medium text-foreground font-sans">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground font-sans">{sponsorName}</p>
                  </div>
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer font-sans"
                    onClick={() => toast({ title: "Company Settings", description: "Settings panel coming soon." })}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Company Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer font-sans"
                    onClick={() => toast({ title: "API Keys", description: "Manage keys on the Developer page." })}
                  >
                    <Key className="h-3.5 w-3.5" />
                    Manage API Keys
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer font-sans"
                    onClick={() => setAuditorDialogOpen(true)}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Manage Auditor Access (Read-Only)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive font-sans"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>

      {/* ─── External Auditor Access Dialog ─── */}
      <Dialog open={auditorDialogOpen} onOpenChange={setAuditorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-serif">External Auditor Access</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-sans">
              Give your third-party assurance firm (e.g., PwC, Deloitte) read-only access to the ESG Audit Ledger as required by CSRD mandates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground font-sans">Auditor's Email</label>
              <Input
                type="email"
                placeholder="auditor@pwc.com"
                value={auditorEmail}
                onChange={(e) => setAuditorEmail(e.target.value)}
                className="text-sm"
              />
            </div>
            <Button
              onClick={handleGenerateAuditorLink}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Generate Secure View Link
            </Button>
            <p className="text-[10px] text-muted-foreground text-center font-sans">
              Link grants 30-day read-only access to verified ESG telemetry and audit trail data.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AppLayout;
