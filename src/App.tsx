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
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));

// Public Pages
const Index = lazy(() => import("./pages/Index"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// New Public Pages (US-051 to US-055)
const ForEmployers = lazy(() => import("./pages/ForEmployers"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Guide = lazy(() => import("./pages/Guide"));
const GuideArticle = lazy(() => import("./pages/GuideArticle"));
const WorkTypeDetail = lazy(() => import("./pages/WorkTypeDetail"));
const SeasonalCalendar = lazy(() => import("./pages/SeasonalCalendar"));

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
const WorkerSettings = lazy(() => import("./pages/worker/Settings"));
const WorkerProfile = lazy(() => import("./pages/worker/Profile"));

// Employer Portal Pages
const EmployerDashboard = lazy(() => import("./pages/employer/Dashboard"));
const EmployerPoolManagement = lazy(() => import("./pages/employer/PoolManagement"));
const EmployerProfile = lazy(() => import("./pages/employer/Profile"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboardKYSS = lazy(() => import("./pages/admin/Dashboard"));
const AdminWorkers = lazy(() => import("./pages/admin/Workers"));
const AdminEmployers = lazy(() => import("./pages/admin/Employers"));
const AdminPools = lazy(() => import("./pages/admin/Pools"));
const AdminRevenue = lazy(() => import("./pages/admin/Revenue"));
const AdminProspects = lazy(() => import("./pages/admin/Prospects"));
const AdminFlaggedContent = lazy(() => import("./pages/admin/FlaggedContent"));
const AdminActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const AdminBlogCMS = lazy(() => import("./pages/admin/BlogCMS"));

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

                {/* NEW PUBLIC PAGES (US-051 to US-055, US-059) */}
                <Route path="/for-employers" element={<ForEmployers />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/guide/:slug" element={<GuideArticle />} />
                <Route path="/work/:slug" element={<WorkTypeDetail />} />
                <Route path="/seasonal-calendar" element={<SeasonalCalendar />} />

                {/* AUTH ROUTES */}
                <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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
                <Route path="/worker/settings" element={<ProtectedRoute requiredRole="worker"><WorkerSettings /></ProtectedRoute>} />
                <Route path="/worker/profile" element={<ProtectedRoute requiredRole="worker"><WorkerProfile /></ProtectedRoute>} />

                {/* EMPLOYER PORTAL */}
                <Route path="/employer/dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
                <Route path="/employer/pools" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
                <Route path="/employer/pools/:id" element={<ProtectedRoute requiredRole="employer"><EmployerPoolManagement /></ProtectedRoute>} />
                <Route path="/employer/profile" element={<ProtectedRoute requiredRole="employer"><EmployerProfile /></ProtectedRoute>} />

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
                <Route path="/admin/blog-cms" element={<ProtectedRoute requiredRole="admin"><AdminBlogCMS /></ProtectedRoute>} />

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
