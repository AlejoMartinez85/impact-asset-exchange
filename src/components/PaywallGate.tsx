interface PaywallGateProps {
  children: React.ReactNode;
  featureName?: string;
}

const PaywallGate = ({ children }: PaywallGateProps) => {
  return <>{children}</>;
};

export default PaywallGate;
