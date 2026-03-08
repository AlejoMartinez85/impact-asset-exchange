import { useSubscription } from "@/contexts/SubscriptionContext";
import { Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaywallGateProps {
  children: React.ReactNode;
  featureName?: string;
}

const PaywallGate = ({ children, featureName = "Premium Feature" }: PaywallGateProps) => {
  const { isFeatureGated } = useSubscription();
  const navigate = useNavigate();

  if (!isFeatureGated) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none opacity-40">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl shadow-primary/5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{featureName}</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your ESG subscription is inactive. Renew to unlock real-time telemetry dashboards, AI-powered reporting, and verified carbon credit data.
          </p>
          <Button
            onClick={() => navigate("/billing")}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            size="lg"
          >
            <CreditCard className="h-4 w-4" />
            Renew ESG Subscription
          </Button>
          <p className="text-[10px] text-muted-foreground mt-3">
            Starting at $699/year per ELISA pole
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaywallGate;
