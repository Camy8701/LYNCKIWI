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

// Work Discovery Pages (US-030, US-031, US-032)
const FindWork = lazy(() => import("./pages/FindWork"));
const CategoryPools = lazy(() => import("./pages/CategoryPools"));
const PoolDetail = lazy(() => import("./pages/PoolDetail"));

// Worker Portal Pages (US-036, US-037, US-038, US-039, US-040)
const ProfileWizard = lazy(() => import("./pages/worker/ProfileWizard"));
const WorkerDashboard = lazy(() => import("./pages/worker/Dashboard"));
const MyPools = lazy(() => import("./pages/worker/MyPools"));
const WorkerMessages = lazy(() => import("./pages/worker/Messages"));
const WorkerNotifications = lazy(() => import("./pages/worker/Notifications"));

// Admin Pages (existing — will be rebuilt in US-043–050)
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminLeadDetail = lazy(() => import("./pages/AdminLeadDetail"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminCompanies = lazy(() => import("./pages/AdminCompanies"));
const AdminCompanyForm = lazy(() => import("./pages/AdminCompanyForm"));
const AdminServices = lazy(() => import("./pages/AdminServices"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

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

                {/* WORK DISCOVERY (US-030, US-031, US-032) */}
                <Route path="/find-work" element={<FindWork />} />
                <Route path="/find-work/:slug" element={<CategoryPools />} />
                <Route path="/pools/:id" element={<PoolDetail />} />

                {/* WORKER PORTAL (US-036–040) */}
                <Route path="/worker/profile-wizard" element={<ProtectedRoute requiredRole="worker"><ProfileWizard /></ProtectedRoute>} />
                <Route path="/worker/dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>} />
                <Route path="/worker/pools" element={<ProtectedRoute requiredRole="worker"><MyPools /></ProtectedRoute>} />
                <Route path="/worker/messages" element={<ProtectedRoute requiredRole="worker"><WorkerMessages /></ProtectedRoute>} />
                <Route path="/worker/notifications" element={<ProtectedRoute requiredRole="worker"><WorkerNotifications /></ProtectedRoute>} />

                {/* ADMIN ROUTES (existing — rebuilt in US-043–050) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/leads" element={<ProtectedRoute requiredRole="admin"><AdminLeads /></ProtectedRoute>} />
                <Route path="/admin/leads/:id" element={<ProtectedRoute requiredRole="admin"><AdminLeadDetail /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/companies" element={<ProtectedRoute requiredRole="admin"><AdminCompanies /></ProtectedRoute>} />
                <Route path="/admin/companies/:id" element={<ProtectedRoute requiredRole="admin"><AdminCompanyForm /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><AdminServices /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />

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
