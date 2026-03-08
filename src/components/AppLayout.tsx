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
import { Settings, Key, LogOut, ChevronRight, Circle } from "lucide-react";
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ─── Premium Header ─── */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/60 backdrop-blur-md shrink-0 z-10">
            {/* Left: Trigger + Breadcrumb */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <div className="h-4 w-px bg-border" />
              <nav className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">{meta.section}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-foreground font-medium">{meta.title}</span>
              </nav>
            </div>

            {/* Right: Status + Profile */}
            <div className="flex items-center gap-3">
              {/* Cluster Status Badge */}
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 text-[10px] font-medium border-primary/20 bg-primary/5 text-primary tracking-wide"
              >
                <Circle className="h-1.5 w-1.5 fill-primary text-primary animate-pulse" />
                Cluster Status: Online
              </Badge>

              {/* Tenant indicator */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground px-2.5 py-1 rounded-md bg-secondary/40 border border-border/50">
                <span className="font-medium text-foreground">{sponsorName}</span>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-secondary/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-[11px] font-medium text-foreground leading-none">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                        {isSuperAdmin ? "Super Admin" : "Sponsor"}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-2 border-b border-border mb-1">
                    <p className="text-xs font-medium text-foreground">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground">{sponsorName}</p>
                  </div>
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer"
                    onClick={() => toast({ title: "Company Settings", description: "Settings panel coming soon." })}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Company Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer"
                    onClick={() => toast({ title: "API Keys", description: "Manage keys on the Developer page." })}
                  >
                    <Key className="h-3.5 w-3.5" />
                    Manage API Keys
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-xs gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* ─── Main Content ─── */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
