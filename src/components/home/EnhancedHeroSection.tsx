import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroLogo from "../HeroLogo";
const heroBackgrounds = ["linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)", "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)", "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)"];
const EnhancedHeroSection = () => {
  return <div className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
      {/* Hero Background Image */}
      <img 
        src="/hero-car-parts.png" 
        alt="Car parts marketplace"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      {/* Professional overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto text-center px-4 py-12">
        <div className="mb-6">
          <HeroLogo />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Buy & Sell Car Parts Fast
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">Compare prices, chat with sellers, and pick up or get parts delivered to your door.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
            <Link to="/search-parts-with-map">
              Browse Parts
            </Link>
          </Button>
          
          <Button asChild size="lg" className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary font-semibold shadow-lg transition-all">
            <Link to="/request-part">
              Request Part
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};
export default EnhancedHeroSection;