import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import CookieConsent from "./components/CookieConsent";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load all pages for code splitting and better performance
const Index = lazy(() => import("./pages/Index"));
// const ForBusinesses = lazy(() => import("./pages/ForBusinesses")); // DELETED US-001 → ForEmployers US-051
// const About = lazy(() => import("./pages/About")); // DELETED US-001 → rewritten
const Contact = lazy(() => import("./pages/Contact"));
// const QuoteRequest = lazy(() => import("./pages/QuoteRequest")); // DELETED US-001 → pool join flow
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
// const Impressum = lazy(() => import("./pages/Impressum")); // DELETED US-001
const Cookies = lazy(() => import("./pages/Cookies"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
// const ServiceDetail = lazy(() => import("./pages/ServiceDetail")); // DELETED US-001 → WorkTypeDetail US-055
// const ThankYou = lazy(() => import("./pages/ThankYou")); // DELETED US-001
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminLeadDetail = lazy(() => import("./pages/AdminLeadDetail"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminCompanies = lazy(() => import("./pages/AdminCompanies"));
const AdminCompanyForm = lazy(() => import("./pages/AdminCompanyForm"));
const AdminServices = lazy(() => import("./pages/AdminServices"));
// const AdminAds = lazy(() => import("./pages/AdminAds")); // DELETED US-001
// const AdminAdDetail = lazy(() => import("./pages/AdminAdDetail")); // DELETED US-001
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
// const Advertise = lazy(() => import("./pages/Advertise")); // DELETED US-001
// const AdvertiseCreate = lazy(() => import("./pages/AdvertiseCreate")); // DELETED US-001

// Loading fallback component
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

                {/* ADMIN ROUTES (existing, will be rebuilt in US-043–050) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
                <Route path="/admin/leads/:id" element={<ProtectedRoute><AdminLeadDetail /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/companies" element={<ProtectedRoute><AdminCompanies /></ProtectedRoute>} />
                <Route path="/admin/companies/:id" element={<ProtectedRoute><AdminCompanyForm /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />

                {/* CATCH-ALL */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
