
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import StatsSection from "@/components/StatsSection";
import { Car } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-green-50 font-inter">
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
