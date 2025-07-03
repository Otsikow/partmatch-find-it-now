
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import HomeDashboard from "@/components/HomeDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard instead of landing page
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <HomeDashboard />
        </div>
        <Footer />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 font-inter">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
