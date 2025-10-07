import { ArrowLeft, Home, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from '@/components/Logo';

const RequestPartHeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary via-primary-glow to-primary overflow-hidden">
      {/* Background Image */}
      <img 
        src="/request-parts-hero.png" 
        alt="Request car parts"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
      
      {/* Back Arrow */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 p-2 hover:bg-white/20 rounded-full text-white hover:text-white flex-shrink-0 bg-white/10 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="p-2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm bg-white/10 border border-white/20"
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="p-2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm bg-white/10 border border-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center h-full flex flex-col justify-center">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-playfair drop-shadow-lg">
          {t("requestPart.welcomeTitle", "Find Your Car Part")}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto font-crimson drop-shadow-md">
          {t("requestPart.subtitle", "Tell us what you need and we'll connect you with verified sellers")}
        </p>

        {/* Quick Info */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <Search className="w-4 h-4" />
            <span>Free to Request</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <span>✓</span>
            <span>Verified Sellers</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <span>⚡</span>
            <span>Quick Response</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPartHeroSection;