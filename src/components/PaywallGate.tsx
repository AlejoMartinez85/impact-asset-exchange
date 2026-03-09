import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallGateProps {
  children: React.ReactNode;
  featureName?: string;
  locked?: boolean;
}

const PaywallGate = ({ children, featureName = "this feature", locked = false }: PaywallGateProps) => {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[hsl(205,85%,42%)]/80 to-[hsl(178,65%,42%)]/80 backdrop-blur-sm rounded-xl">
        <div className="text-center text-primary-foreground space-y-4 max-w-sm px-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center border border-primary-foreground/30">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold font-sans">Upgrade Required</h3>
          <p className="text-sm opacity-90 font-sans">
            Access to {featureName} requires an active ESG SaaS subscription. Renew now to continue monitoring your impact portfolio.
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold gap-2"
          >
            Renew Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaywallGate;
