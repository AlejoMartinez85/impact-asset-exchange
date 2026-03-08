import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, isSuperAdmin } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="h-5 w-px bg-border" />
              <span className="text-xs text-muted-foreground">
                Tenant: <span className="text-foreground font-medium">{profile?.sponsor_name || "Litro de Luz"}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isSuperAdmin && (
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/10 gap-1">
                  <Shield className="h-3 w-3" />
                  Super Admin
                </Badge>
              )}
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                {(profile?.display_name || "U")[0].toUpperCase()}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
