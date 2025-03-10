
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
