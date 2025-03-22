
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Workflows from "./pages/Workflows";
import Executions from "./pages/Executions";
import Templates from "./pages/Templates";
import Inventory from "./pages/Inventory";
import ServerDetail from "./pages/ServerDetail";
import Certificates from "./pages/Certificates";
import Alerts from "./pages/Alerts";
import SecurityEvents from "./pages/SecurityEvents";
import SecurityGroups from "./pages/SecurityGroups";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Metrics from "./pages/Metrics";
import Logs from "./pages/Logs";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/automation/workflows" element={<Workflows />} />
              <Route path="/automation/executions" element={<Executions />} />
              <Route path="/automation/templates" element={<Templates />} />
              <Route path="/inventory/servers" element={<Inventory />} />
              <Route path="/inventory/servers/:id" element={<ServerDetail />} />
              <Route path="/security/certificates" element={<Certificates />} />
              <Route path="/security/events" element={<SecurityEvents />} />
              <Route path="/security/groups" element={<SecurityGroups />} />
              <Route path="/monitoring/alerts" element={<Alerts />} />
              <Route path="/monitoring/metrics" element={<Metrics />} />
              <Route path="/monitoring/logs" element={<Logs />} />
              <Route path="/myaccount/settings" element={<Settings />} />
            </Route>
            
            {/* Route protégée pour admins uniquement */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
