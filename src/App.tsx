
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Logs from "./pages/Logs";
import Metrics from "./pages/Metrics";
import Inventory from "./pages/Inventory";
import ServerDetail from "./pages/ServerDetail";
import SecurityGroups from "./pages/SecurityGroups";
import SecurityEvents from "./pages/SecurityEvents";
import Workflows from "./pages/Workflows";
import Executions from "./pages/Executions";
import Alerts from "./pages/Alerts";
import Templates from "./pages/Templates";
import Certificates from "./pages/Certificates";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

import "./App.css";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/metrics" element={<Metrics />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/:serverId" element={<ServerDetail />} />
                  <Route path="/security/groups" element={<SecurityGroups />} />
                  <Route path="/security/events" element={<SecurityEvents />} />
                  <Route path="/workflows" element={<Workflows />} />
                  <Route path="/executions" element={<Executions />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Route protégée pour les admins */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route element={<MainLayout />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
