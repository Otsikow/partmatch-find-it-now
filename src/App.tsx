
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthTypeSelector from "./components/AuthTypeSelector";
import BuyerAuth from "./pages/BuyerAuth";
import SellerAuth from "./pages/SellerAuth";
import AdminAuth from "./pages/AdminAuth";
import UserDashboard from "./pages/UserDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RequestPart from "./pages/RequestPart";
import SearchParts from "./pages/SearchParts";
import SearchPartsWithMap from "./pages/SearchPartsWithMap";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import ButtonTestPage from "./pages/ButtonTestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SellerProtectedRoute from "./components/SellerProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthTypeSelector />} />
            <Route path="/buyer-auth" element={<BuyerAuth />} />
            <Route path="/seller-auth" element={<SellerAuth />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/request-part" element={<RequestPart />} />
            <Route path="/request" element={<RequestPart />} />
            <Route path="/search-parts" element={<SearchParts />} />
            <Route path="/search-parts-with-map" element={<SearchPartsWithMap />} />
            <Route path="/search-map" element={<SearchPartsWithMap />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
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
                  <UserDashboard />
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
              path="/supplier-dashboard" 
              element={
                <SellerProtectedRoute>
                  <SupplierDashboard />
                </SellerProtectedRoute>
              } 
            />
            <Route 
              path="/supplier" 
              element={
                <SellerProtectedRoute>
                  <SupplierDashboard />
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
            <Route path="/button-test" element={<ButtonTestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
