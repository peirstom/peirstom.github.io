import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SecuringAwsLambda from "./pages/blog/SecuringAwsLambda";
import DevSecOpsPipeline from "./pages/blog/DevSecOpsPipeline";
import ReactPerformance from "./pages/blog/ReactPerformance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog/securing-aws-lambda-at-scale" element={<SecuringAwsLambda />} />
          <Route path="/blog/devsecops-pipeline-patterns-gitlab" element={<DevSecOpsPipeline />} />
          <Route path="/blog/react-performance-in-enterprise-apps" element={<ReactPerformance />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
