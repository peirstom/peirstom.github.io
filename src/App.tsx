import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogLayout from "./components/BlogLayout";
import RouteMeta from "./components/RouteMeta";

const SecuringAwsLambda = lazy(() => import("./pages/blog/SecuringAwsLambda"));
const DevSecOpsPipeline = lazy(() => import("./pages/blog/DevSecOpsPipeline"));
const ReactPerformance = lazy(() => import("./pages/blog/ReactPerformance"));
const DatadogStatusPagesSLOs = lazy(() => import("./pages/blog/DatadogStatusPagesSLOs"));
const KnowledgeBaseMCP = lazy(() => import("./pages/blog/KnowledgeBaseMCP"));
const TerraformFiveSigns = lazy(() => import("./pages/blog/TerraformFiveSigns"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RouteMeta />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<BlogLayout />}>
            <Route path="/blog/securing-aws-lambda-at-scale" element={<SecuringAwsLambda />} />
            <Route path="/blog/devsecops-pipeline-patterns-gitlab" element={<DevSecOpsPipeline />} />
            <Route path="/blog/react-performance-in-enterprise-apps" element={<ReactPerformance />} />
            <Route path="/blog/datadog-status-pages-and-slos" element={<DatadogStatusPagesSLOs />} />
            <Route path="/blog/knowledge-base-mcp-for-engineering-context" element={<KnowledgeBaseMCP />} />
            <Route path="/blog/five-signs-terraform-slowing-your-team" element={<TerraformFiveSigns />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
