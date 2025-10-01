import { ArrowLeft, Home, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from '@/components/Logo';

const ProfileHeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      {/* Background Image using img tag for better reliability */}
      <img 
        src="/profile-hero-bg.png" 
        alt="Profile background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        onError={(e) => {
          console.log('Image failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600"></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Back Arrow */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 p-2 hover:bg-background/20 rounded-full text-foreground hover:text-foreground flex-shrink-0 bg-background/10 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-foreground hover:bg-background/20 backdrop-blur-sm bg-background/10 border border-border/20"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="p-2 text-foreground hover:bg-background/20 rounded-full backdrop-blur-sm bg-background/10 border border-border/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center h-full flex flex-col justify-center">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-6">
          <Logo className="h-24 w-auto object-contain filter brightness-0 invert" />
        </Link>
        
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-playfair drop-shadow-lg">
          {t("profile.welcomeTitle", "Your Profile Dashboard")}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto font-crimson drop-shadow-md">
          {t("profile.subtitle", "Manage your account and explore PartMatch features")}
        </p>

        {/* Quick Info */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <User className="w-4 h-4" />
            <span>Manage Profile</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <span>📊</span>
            <span>Track Activity</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <span>⚙️</span>
            <span>Preferences</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroSection;