import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroLogo from "../HeroLogo";
const heroBackgrounds = ["linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)", "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)", "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)"];
const EnhancedHeroSection = () => {
  return <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <img 
        src="/hero-car-parts.png" 
        alt="Car parts marketplace"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      {/* Professional overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/85 to-white/90"></div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto text-center px-4 py-12">
        <div className="mb-6">
          <HeroLogo />
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-4 drop-shadow-lg text-black">
          Buy & Sell Car Parts Fast
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-black">Compare prices, chat with sellers, and pick up or get parts delivered to your door.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
            <Link to="/search-parts-with-map">
              Browse Parts
            </Link>
          </Button>
          
          <Button asChild size="lg" className="w-full sm:w-auto bg-black/10 backdrop-blur-sm border-2 border-black text-black hover:bg-black hover:text-white font-semibold shadow-lg transition-all">
            <Link to="/request-part">
              Request Part
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};
export default EnhancedHeroSection;