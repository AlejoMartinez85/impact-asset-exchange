import React, { createContext, useContext, useState, ReactNode } from "react";

export type SubscriptionStatus = "active" | "inactive" | "past_due" | "trialing";

export interface SubscriptionPlan {
  name: string;
  status: SubscriptionStatus;
  renewalDate: string;
  activePolesCount: number;
  pricePerPole: number;
  annualTotal: number;
}

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isFeatureGated: boolean;
  setPlan: (plan: SubscriptionPlan) => void;
  toggleMockStatus: () => void;
}

const defaultPlan: SubscriptionPlan = {
  name: "ESG Impact Premium",
  status: "active",
  renewalDate: "2027-03-01",
  activePolesCount: 7,
  pricePerPole: 699,
  annualTotal: 4_995,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>(defaultPlan);

  const isFeatureGated = plan.status !== "active" && plan.status !== "trialing";

  const toggleMockStatus = () => {
    setPlan((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isFeatureGated, setPlan, toggleMockStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};
