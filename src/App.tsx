import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWANotificationManager from "@/components/PWANotificationManager";
import PartMatchHelpBot from "@/components/PartMatchHelpBot";
import { LocationProvider } from "@/contexts/LocationContext";
import { useGeolocation } from "./hooks/useGeolocation";
import { useIsMobile } from "./hooks/use-mobile";
import { useTrackPresence } from "./hooks/useUserPresence";
import MobileBottomTabs from "./components/MobileBottomTabs";

import Index from "./pages/Index";
import AuthTypeSelector from "./components/AuthTypeSelector";
import BuyerAuth from "./pages/BuyerAuth";
import SellerAuth from "./pages/SellerAuth";
import AdminAuth from "./pages/AdminAuth";
import PhoneAuth from "./pages/PhoneAuth";
import UserDashboard from "./pages/UserDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardRouter from "./components/DashboardRouter";
import RequestPart from "./pages/RequestPart";
import PostPart from "./pages/PostPart";
import ListingSuccess from "./pages/ListingSuccess";
import RequestedCarParts from "./pages/RequestedCarParts";
import SearchParts from "./pages/SearchParts";
import SearchPartsWithMap from "./pages/SearchPartsWithMap";
import Chat from "./pages/Chat";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import SimpleAuth from "./pages/SimpleAuth";
import ButtonTestPage from "./pages/ButtonTestPage";
import SellerProfile from "./pages/SellerProfile";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

import ProtectedRoute from "./components/ProtectedRoute";
import SellerProtectedRoute from "./components/SellerProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Success from "./pages/Success";
import RequestSuccess from "./pages/RequestSuccess";

const queryClient = new QueryClient();

function App() {
  // Enable geolocation detection globally
  useGeolocation();
  // Track user presence across the app
  useTrackPresence();
  const isMobile = useIsMobile();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <LocationProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthTypeSelector />} />
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  {isMobile && <MobileBottomTabs />}
                  <PWANotificationManager />
                  {/* <PartMatchHelpBot /> */}
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
