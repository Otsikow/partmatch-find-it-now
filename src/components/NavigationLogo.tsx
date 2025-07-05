
import { Link } from "react-router-dom";

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
        src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
        alt="PartMatch Logo" 
        className="h-8 sm:h-9 lg:h-10 w-auto flex-shrink-0 bg-white rounded-sm p-1"
      />
      <h1 className="text-lg sm:text-xl lg:text-2xl font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent truncate">
        PartMatch Ghana
      </h1>
    </Link>
  );
};

export default NavigationLogo;
