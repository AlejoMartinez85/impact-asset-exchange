import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import ReportsPage from "./pages/ReportsPage";
import HardwarePage from "./pages/HardwarePage";
import DeveloperPage from "./pages/DeveloperPage";
import BillingPage from "./pages/BillingPage";
import TelemetryPage from "./pages/TelemetryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubscriptionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/hardware" element={<HardwarePage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </SubscriptionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
