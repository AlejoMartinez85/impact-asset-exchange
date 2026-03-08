import { LayoutDashboard, Map, FileText, Cpu, Settings, Sun, CreditCard, Activity, Users, Shield, Cog } from "lucide-react";
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

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Map", url: "/dashboard/map", icon: Map },
  { title: "AI Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Hardware Health", url: "/dashboard/hardware", icon: Cpu },
  { title: "Telemetry", url: "/dashboard/telemetry", icon: Activity },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
  { title: "Developer", url: "/dashboard/developer", icon: Settings },
];

const adminItems = [
  { title: "User Management", url: "/dashboard/admin/users", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Sun className="h-4 w-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight truncate">Litro de Luz</h1>
            <p className="text-[10px] text-sidebar-foreground uppercase tracking-widest">Impact Exchange</p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] text-sidebar-foreground uppercase tracking-widest flex items-center gap-1">
              <Shield className="h-3 w-3" /> Admin
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-[10px] text-sidebar-foreground space-y-1">
            <p className="font-medium text-sidebar-accent-foreground">Demo User</p>
            <p>AB-InBev</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
