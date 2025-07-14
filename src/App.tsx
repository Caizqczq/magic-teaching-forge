
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { LazyRoute } from "@/components/common/LazyRoute";

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CreateWizard = React.lazy(() => import("./pages/CreateWizard"));
const EnhancedCreateWizard = React.lazy(() => import("./pages/EnhancedCreateWizard"));
const ProjectDetail = React.lazy(() => import("./pages/ProjectDetail"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const KnowledgeBase = React.lazy(() => import("./pages/KnowledgeBase"));
const Community = React.lazy(() => import("./pages/Community"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <LazyRoute>
                  <Dashboard />
                </LazyRoute>
              } />
              <Route path="/dashboard" element={
                <LazyRoute>
                  <Dashboard />
                </LazyRoute>
              } />
              <Route path="/create" element={
                <LazyRoute>
                  <CreateWizard />
                </LazyRoute>
              } />
              <Route path="/enhanced-create" element={
                <LazyRoute>
                  <EnhancedCreateWizard />
                </LazyRoute>
              } />
              <Route path="/project/:id" element={
                <LazyRoute>
                  <ProjectDetail />
                </LazyRoute>
              } />
              <Route path="/project/demo" element={
                <LazyRoute>
                  <ProjectDetail />
                </LazyRoute>
              } />
              <Route path="/analytics" element={
                <LazyRoute>
                  <Analytics />
                </LazyRoute>
              } />
              <Route path="/knowledge" element={
                <LazyRoute>
                  <KnowledgeBase />
                </LazyRoute>
              } />
              <Route path="/community" element={
                <LazyRoute>
                  <Community />
                </LazyRoute>
              } />
              <Route path="*" element={
                <LazyRoute>
                  <NotFound />
                </LazyRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
