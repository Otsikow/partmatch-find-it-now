import { useAuth } from "@/contexts/AuthContext";
import EnhancedHeroSection from "./EnhancedHeroSection";
import TrustBenefitsSection from "./TrustBenefitsSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturedPartsSection from "./FeaturedPartsSection";
import PopularSearchesSection from "./PopularSearchesSection";
import TestimonialsSection from "./TestimonialsSection";
import CallToActionSection from "./CallToActionSection";
import DynamicWelcomeMessage from "./DynamicWelcomeMessage";

const EnhancedHomePage = () => {

  return (
    <div className="min-h-screen">
      {/* Dynamic Welcome Message */}
      <DynamicWelcomeMessage />

      {/* Hero Section */}
      <EnhancedHeroSection />
      
      {/* Trust & Benefits */}
      <TrustBenefitsSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Featured Parts */}
      <FeaturedPartsSection />
      
      {/* Popular Searches */}
      <PopularSearchesSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Call to Action */}
      <CallToActionSection />
    </div>
  );
};

export default EnhancedHomePage;