
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SellerProtectedRoute from "@/components/SellerProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import AuthTypeSelector from "@/components/AuthTypeSelector";
import AdminAuth from "./pages/AdminAuth";
import BuyerAuth from "./pages/BuyerAuth";
import SellerAuth from "./pages/SellerAuth";
import BuyerDashboard from "./pages/BuyerDashboard";
import RequestPart from "./pages/RequestPart";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SearchParts from "./pages/SearchParts";
import SearchPartsWithMap from "./pages/SearchPartsWithMap";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthTypeSelector />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/buyer-auth" element={<BuyerAuth />} />
            <Route path="/seller-auth" element={<SellerAuth />} />
            <Route 
              path="/buyer-dashboard" 
              element={
                <ProtectedRoute>
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/request" element={<RequestPart />} />
            <Route path="/search" element={<SearchParts />} />
            <Route path="/search-map" element={<SearchPartsWithMap />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
