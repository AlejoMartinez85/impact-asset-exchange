import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/hardware" element={<HardwarePage />} />
                  <Route path="/telemetry" element={<TelemetryPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
