import { Eye, Shield, ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const views = [
  { path: "/admin", label: "Admin Control Room", icon: Shield, colorClass: "text-primary" },
  { path: "/dashboard", label: "Nestlé: Regenerative Ag", icon: Eye, colorClass: "text-[hsl(var(--ods-green))]" },
  { path: "/loreal", label: "L'Oréal: Ethical Sourcing", icon: Sparkles, colorClass: "text-amber-500" },
] as const;

const ViewModeToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const current = views.find((v) => location.pathname.startsWith(v.path)) ?? views[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-[10px] font-semibold tracking-wide border-border bg-secondary/40 hover:bg-secondary/60 font-sans"
        >
          <current.icon className={`h-3 w-3 ${current.colorClass}`} />
          {current.label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {views.map((v) => (
          <DropdownMenuItem
            key={v.path}
            className="text-xs gap-2 cursor-pointer font-sans"
            onClick={() => navigate(v.path)}
          >
            <v.icon className={`h-3.5 w-3.5 ${v.colorClass}`} />
            {v.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeToggle;
