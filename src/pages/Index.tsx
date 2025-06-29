
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import StatsSection from "@/components/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-green-50 font-inter">
      <Navigation />
      <div className="px-2 sm:px-4 lg:px-6">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <StatsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
