import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import CookieConsent from "./components/CookieConsent";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth Pages
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Work Discovery Pages
const FindWork = lazy(() => import("./pages/FindWork"));
const CategoryPools = lazy(() => import("./pages/CategoryPools"));
const PoolDetail = lazy(() => import("./pages/PoolDetail"));

// Worker Portal Pages
const ProfileWizard = lazy(() => import("./pages/worker/ProfileWizard"));
const WorkerDashboard = lazy(() => import("./pages/worker/Dashboard"));
const MyPools = lazy(() => import("./pages/worker/MyPools"));
const WorkerMessages = lazy(() => import("./pages/worker/Messages"));
const WorkerNotifications = lazy(() => import("./pages/worker/Notifications"));

// Employer Portal Pages (US-041, US-042)
const EmployerDashboard = lazy(() => import("./pages/employer/Dashboard"));
const EmployerPoolManagement = lazy(() => import("./pages/employer/PoolManagement"));

// Admin Pages (US-043–050)
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboardKYSS = lazy(() => import("./pages/admin/Dashboard"));
const AdminWorkers = lazy(() => import("./pages/admin/Workers"));
const AdminEmployers = lazy(() => import("./pages/admin/Employers"));
const AdminPools = lazy(() => import("./pages/admin/Pools"));
const AdminRevenue = lazy(() => import("./pages/admin/Revenue"));
const AdminProspects = lazy(() => import("./pages/admin/Prospects"));
const AdminFlaggedContent = lazy(() => import("./pages/admin/FlaggedContent"));
const AdminActivityLog = lazy(() => import("./pages/admin/ActivityLog"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <CookieConsent />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* AUTH ROUTES */}
                <Route path="/auth/sign-in" element={<SignIn />} />
                <Route path="/auth/sign-up" element={<SignUp />} />

                {/* WORK DISCOVERY */}
                <Route path="/find-work" element={<FindWork />} />
                <Route path="/find-work/:slug" element={<CategoryPools />} />
                <Route path="/pools/:id" element={<PoolDetail />} />

                {/* WORKER PORTAL */}
                <Route path="/worker/profile-wizard" element={<ProtectedRoute requiredRole="worker"><ProfileWizard /></ProtectedRoute>} />
                <Route path="/worker/dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>} />
                <Route path="/worker/pools" element={<ProtectedRoute requiredRole="worker"><MyPools /></ProtectedRoute>} />
                <Route path="/worker/messages" element={<ProtectedRoute requiredRole="worker"><WorkerMessages /></ProtectedRoute>} />
                <Route path="/worker/notifications" element={<ProtectedRoute requiredRole="worker"><WorkerNotifications /></ProtectedRoute>} />

                {/* EMPLOYER PORTAL */}
                <Route path="/employer/dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
                <Route path="/employer/pools" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
                <Route path="/employer/pools/:id" element={<ProtectedRoute requiredRole="employer"><EmployerPoolManagement /></ProtectedRoute>} />

                {/* ADMIN ROUTES */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardKYSS /></ProtectedRoute>} />
                <Route path="/admin/workers" element={<ProtectedRoute requiredRole="admin"><AdminWorkers /></ProtectedRoute>} />
                <Route path="/admin/employers" element={<ProtectedRoute requiredRole="admin"><AdminEmployers /></ProtectedRoute>} />
                <Route path="/admin/pools" element={<ProtectedRoute requiredRole="admin"><AdminPools /></ProtectedRoute>} />
                <Route path="/admin/revenue" element={<ProtectedRoute requiredRole="admin"><AdminRevenue /></ProtectedRoute>} />
                <Route path="/admin/prospects" element={<ProtectedRoute requiredRole="admin"><AdminProspects /></ProtectedRoute>} />
                <Route path="/admin/flagged" element={<ProtectedRoute requiredRole="admin"><AdminFlaggedContent /></ProtectedRoute>} />
                <Route path="/admin/activity" element={<ProtectedRoute requiredRole="admin"><AdminActivityLog /></ProtectedRoute>} />

                {/* CATCH-ALL */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
