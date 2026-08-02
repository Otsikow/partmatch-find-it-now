import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { useIsMobile } from "./hooks/use-mobile";
import { useTrackPresence } from "./hooks/useUserPresence";
import MobileBottomTabs from "./components/MobileBottomTabs";
import AppRouteFallback from "./components/AppRouteFallback";

const Index = lazy(() => import("./pages/Index"));
const AuthTypeSelector = lazy(() => import("./components/AuthTypeSelector"));
const BuyerAuth = lazy(() => import("./pages/BuyerAuth"));
const SellerAuth = lazy(() => import("./pages/SellerAuth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const PhoneAuth = lazy(() => import("./pages/PhoneAuth"));
const BuyerDashboard = lazy(() => import("./pages/BuyerDashboard"));
const GuestDashboard = lazy(() => import("./pages/GuestDashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DashboardRouter = lazy(() => import("./components/DashboardRouter"));
const RequestPart = lazy(() => import("./pages/RequestPart"));
const PostPart = lazy(() => import("./pages/PostPart"));
const ListingSuccess = lazy(() => import("./pages/ListingSuccess"));
const RequestedCarParts = lazy(() => import("./pages/RequestedCarParts"));
const SearchParts = lazy(() => import("./pages/SearchParts"));
const SearchPartsWithMap = lazy(() => import("./pages/SearchPartsWithMap"));
const Chat = lazy(() => import("./pages/Chat"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SimpleAuth = lazy(() => import("./pages/SimpleAuth"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const ButtonTestPage = lazy(() => import("./pages/ButtonTestPage"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const Profile = lazy(() => import("./pages/Profile"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const SavedParts = lazy(() => import("./pages/SavedParts"));
const RecentViews = lazy(() => import("./pages/RecentViews"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
const PWANotificationManager = lazy(() => import("@/components/PWANotificationManager"));

import ProtectedRoute from "./components/ProtectedRoute";
import SellerProtectedRoute from "./components/SellerProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Success from "./pages/Success";
import RequestSuccess from "./pages/RequestSuccess";

const queryClient = new QueryClient();

const PresenceTracker = () => {
  useTrackPresence();
  return null;
};

function App() {
  const isMobile = useIsMobile();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PresenceTracker />
        <LocaleProvider>
          <LocationProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<AppRouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthTypeSelector />} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />
                    <Route path="/buyer-auth" element={<BuyerAuth />} />
                    <Route path="/seller-auth" element={<SellerAuth />} />
                    <Route path="/supplier" element={<SellerAuth />} />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route path="/phone-auth" element={<PhoneAuth />} />
                    <Route path="/guest-dashboard" element={<GuestDashboard />} />
                    <Route path="/request-part" element={<RequestPart />} />
                    <Route path="/request" element={<RequestPart />} />
                    <Route path="/post-part" element={<PostPart />} />
                    <Route
                      path="/requested-car-parts"
                      element={<RequestedCarParts />}
                    />
                    <Route path="/search-parts" element={<SearchParts />} />
                    <Route
                      path="/search-parts-with-map"
                      element={<SearchPartsWithMap />}
                    />
                    <Route
                      path="/search-map"
                      element={<SearchPartsWithMap />}
                    />
                    <Route
                      path="/seller/:sellerId"
                      element={<SellerProfile />}
                    />
                    <Route
                      path="/profile"
                      element={<Profile />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route
                      path="/privacy-policy"
                      element={<PrivacyPolicy />}
                    />
                    <Route
                      path="/terms-of-service"
                      element={<TermsOfService />}
                    />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />

                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardRouter />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/buyer-dashboard"
                      element={
                        <ProtectedRoute>
                          <BuyerDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller-dashboard"
                      element={
                        <SellerProtectedRoute>
                          <SellerDashboard />
                        </SellerProtectedRoute>
                      }
                    />
                    <Route
                      path="/seller"
                      element={
                        <SellerProtectedRoute>
                          <SellerDashboard />
                        </SellerProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminProtectedRoute>
                          <AdminDashboard />
                        </AdminProtectedRoute>
                      }
                    />
                    <Route path="/simple-auth" element={<SimpleAuth />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/button-test" element={<ButtonTestPage />} />
                    <Route path="/success" element={<Success />} />
                    <Route
                      path="/request-success"
                      element={<RequestSuccess />}
                    />
                    <Route
                      path="/listing-success"
                      element={<ListingSuccess />}
                    />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route 
                      path="/saved-parts" 
                      element={
                        <ProtectedRoute>
                          <SavedParts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/recent-views" 
                      element={
                        <ProtectedRoute>
                          <RecentViews />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </Suspense>

                  {isMobile && <MobileBottomTabs />}
                  <Suspense fallback={null}>
                    <PWANotificationManager />
                  </Suspense>
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </LocationProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
