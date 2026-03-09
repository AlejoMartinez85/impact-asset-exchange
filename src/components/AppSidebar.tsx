import {
  LayoutDashboard,
  Map,
  FileText,
  Cpu,
  Settings,
  CreditCard,
  Activity,
  Users,
  Shield,
  Cog,
  Building2,
  Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import logoClassic from "@/assets/logo-classic.png";

const navItems = [
  { title: "Live Telemetry", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Map", url: "/dashboard/map", icon: Map },
  { title: "Real-Time Data", url: "/dashboard/telemetry", icon: Activity },
  { title: "Hardware Health", url: "/dashboard/hardware", icon: Cpu },
];

const insightItems = [
  { title: "AI Certifications", url: "/dashboard/reports", icon: Sparkles },
];

const accountItems = [
  { title: "Billing & Plan", url: "/dashboard/billing", icon: CreditCard },
  { title: "Developer API", url: "/dashboard/developer", icon: Settings },
];

const adminItems = [
  { title: "User Management", url: "/dashboard/admin/users", icon: Users },
  { title: "Operations", url: "/dashboard/admin/ops", icon: Cog },
  { title: "Sponsors", url: "/dashboard/admin/sponsors", icon: Building2 },
];

const SidebarNavGroup = ({
  label,
  items,
  collapsed,
}: {
  label?: string;
  items: { title: string; url: string; icon: any }[];
  collapsed: boolean;
}) => (
  <SidebarGroup>
    {label && !collapsed && (
      <SidebarGroupLabel className="text-[9px] text-sidebar-foreground/60 uppercase tracking-[0.15em] font-semibold mb-1">
        {label}
      </SidebarGroupLabel>
    )}
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <NavLink
                to={item.url}
                end={item.url === "/dashboard"}
                className="hover:bg-sidebar-accent/50 transition-all duration-150 rounded-md"
                activeClassName="bg-primary/10 text-primary font-medium shadow-[inset_2px_0_0_hsl(var(--primary))]"
              >
                <item.icon className="mr-2.5 h-4 w-4 shrink-0 opacity-70" />
                {!collapsed && <span className="text-[13px]">{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { profile } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* ─── Brand ─── */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-sidebar-border">
        <img
          src={logoClassic}
          alt="Litro de Luz"
          className="w-9 h-9 rounded-lg object-contain shrink-0"
        />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-[13px] font-bold text-foreground tracking-tight truncate font-sans">
              Litro de Luz
            </h1>
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-medium font-sans">
              Impact Exchange
            </p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-3 px-2">
        <SidebarNavGroup label="Monitoring" items={navItems} collapsed={collapsed} />
        <SidebarNavGroup label="Intelligence" items={insightItems} collapsed={collapsed} />
        <SidebarNavGroup label="Account" items={accountItems} collapsed={collapsed} />

        {/* Admin Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[9px] text-sidebar-foreground/60 uppercase tracking-[0.15em] font-semibold mb-1 flex items-center gap-1.5 font-sans">
              <Shield className="h-3 w-3 text-primary/60" />
              Admin
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50 transition-all duration-150 rounded-md"
                      activeClassName="bg-primary/10 text-primary font-medium shadow-[inset_2px_0_0_hsl(var(--primary))]"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0 opacity-70" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ─── Footer ─── */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        {!collapsed && (
          <div className="space-y-1">
            <p className="text-[11px] font-medium text-foreground truncate font-sans">
              {profile?.display_name || "Demo User"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate font-sans">
              {profile?.sponsor_name || "Enterprise Tier"}
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
