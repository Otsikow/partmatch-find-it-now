
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface NavigationLogoProps {
  onLinkClick?: () => void;
}

const NavigationLogo = ({ onLinkClick }: NavigationLogoProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 sm:gap-3 lg:gap-4 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0"
      onClick={onLinkClick}
    >
      <img 
        src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
        alt="PartMatch Logo" 
        className="h-8 sm:h-9 lg:h-10 w-auto flex-shrink-0"
      />
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Home className="h-4 w-4 sm:h-5 sm:w-5 text-green-700 flex-shrink-0" />
        <h1 className="text-lg sm:text-xl lg:text-2xl font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent truncate">
          PartMatch Ghana
        </h1>
      </div>
    </Link>
  );
};

export default NavigationLogo;
