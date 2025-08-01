import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroLogo from "../HeroLogo";

const heroBackgrounds = [
  "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
  "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)",
  "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)"
];

const EnhancedHeroSection = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden"
      style={{ background: heroBackgrounds[currentBg] }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto text-center px-4 py-12">
        <div className="mb-6">
          <HeroLogo />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Find Car Parts Fast
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
          Compare prices, chat with sellers, and get parts delivered to your door.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
            <Link to="/search-parts-with-map">
              Browse Parts
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary font-semibold shadow-lg">
            <Link to="/request-part" className="text-white hover:text-primary">
              Request Part
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroBackgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBg(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentBg ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedHeroSection;