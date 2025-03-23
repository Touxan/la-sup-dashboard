
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
                <Route path="/" element={
                  <MainLayout>
                    <Index />
                  </MainLayout>
                } />
                <Route path="/logs" element={
                  <MainLayout>
                    <Logs />
                  </MainLayout>
                } />
                <Route path="/metrics" element={
                  <MainLayout>
                    <Metrics />
                  </MainLayout>
                } />
                <Route path="/inventory" element={
                  <MainLayout>
                    <Inventory />
                  </MainLayout>
                } />
                <Route path="/inventory/:serverId" element={
                  <MainLayout>
                    <ServerDetail />
                  </MainLayout>
                } />
                <Route path="/security/groups" element={
                  <MainLayout>
                    <SecurityGroups />
                  </MainLayout>
                } />
                <Route path="/security/events" element={
                  <MainLayout>
                    <SecurityEvents />
                  </MainLayout>
                } />
                <Route path="/workflows" element={
                  <MainLayout>
                    <Workflows />
                  </MainLayout>
                } />
                <Route path="/executions" element={
                  <MainLayout>
                    <Executions />
                  </MainLayout>
                } />
                <Route path="/alerts" element={
                  <MainLayout>
                    <Alerts />
                  </MainLayout>
                } />
                <Route path="/templates" element={
                  <MainLayout>
                    <Templates />
                  </MainLayout>
                } />
                <Route path="/certificates" element={
                  <MainLayout>
                    <Certificates />
                  </MainLayout>
                } />
                <Route path="/settings" element={
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                } />
              </Route>
              
              {/* Route protégée pour les admins */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                } />
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
