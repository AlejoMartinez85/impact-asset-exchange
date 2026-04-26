import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import ReportsPage from "./pages/ReportsPage";
import HardwarePage from "./pages/HardwarePage";
import DeveloperPage from "./pages/DeveloperPage";
import BillingPage from "./pages/BillingPage";
import TelemetryPage from "./pages/TelemetryPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import SuccessPage from "./pages/SuccessPage";
import AdminOpsPage from "./pages/AdminOpsPage";
import SponsorManagementPage from "./pages/SponsorManagementPage";
import SponsorDashboardMain from "./pages/SponsorDashboardMain";
import NotFound from "./pages/NotFound";
import WhitepaperPage from "./pages/WhitepaperPage";
import LorealMRVDashboard from "./pages/LorealMRVDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/loreal" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          {/* Sponsor View */}
          <Route
            path="/dashboard/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<SponsorDashboardMain />} />
                  <Route path="/loreal" element={<LorealMRVDashboard />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/hardware" element={<HardwarePage />} />
                  <Route path="/telemetry" element={<TelemetryPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
          {/* L'Oréal View */}
          <Route
            path="/loreal/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LorealMRVDashboard />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/hardware" element={<HardwarePage />} />
                  <Route path="/telemetry" element={<TelemetryPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
          {/* Admin View */}
          <Route
            path="/admin/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/hardware" element={<HardwarePage />} />
                  <Route path="/telemetry" element={<TelemetryPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/users" element={<AdminUsersPage />} />
                  <Route path="/ops" element={<AdminOpsPage />} />
                  <Route path="/sponsors" element={<SponsorManagementPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
