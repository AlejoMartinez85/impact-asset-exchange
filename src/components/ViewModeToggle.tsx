import { Eye, Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const ViewModeToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminView = location.pathname.startsWith("/admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-[10px] font-semibold tracking-wide border-border bg-secondary/40 hover:bg-secondary/60 font-sans"
        >
          {isAdminView ? (
            <>
              <Shield className="h-3 w-3 text-primary" />
              Admin View
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 text-[hsl(var(--ods-green))]" />
              Sponsor View
            </>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="text-xs gap-2 cursor-pointer font-sans"
          onClick={() => navigate("/admin")}
        >
          <Shield className="h-3.5 w-3.5 text-primary" />
          Admin View
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs gap-2 cursor-pointer font-sans"
          onClick={() => navigate("/dashboard")}
        >
          <Eye className="h-3.5 w-3.5 text-[hsl(var(--ods-green))]" />
          Sponsor View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeToggle;
