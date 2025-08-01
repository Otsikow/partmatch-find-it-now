import { useAuth } from "@/contexts/AuthContext";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import EnhancedHeroSection from "./EnhancedHeroSection";
import TrustBenefitsSection from "./TrustBenefitsSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturedPartsSection from "./FeaturedPartsSection";
import PopularSearchesSection from "./PopularSearchesSection";
import TestimonialsSection from "./TestimonialsSection";
import CallToActionSection from "./CallToActionSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Heart, Clock } from "lucide-react";

const EnhancedHomePage = () => {
  const { user } = useAuth();
  const displayName = useUserDisplayName();

  return (
    <div className="min-h-screen">
      {/* Personalized Welcome for Logged-in Users */}
      {user && (
        <div className="bg-primary/10 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold text-foreground">
                  Welcome back, {displayName}! 👋
                </h2>
                <p className="text-muted-foreground">
                  Ready to find your next car part?
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/saved-parts">
                    <Heart className="w-4 h-4 mr-1" />
                    Saved Parts
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/recent-views">
                    <Clock className="w-4 h-4 mr-1" />
                    Recent Views
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-1" />
                    Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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