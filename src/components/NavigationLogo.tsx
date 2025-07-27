
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NavigationLogoProps {
  onLinkClick?: () => void;
}

const NavigationLogo = ({ onLinkClick }: NavigationLogoProps) => {
  const { t } = useTranslation();
  
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 sm:gap-3 lg:gap-4 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0"
      onClick={onLinkClick}
    >
      <img 
        src="/lovable-uploads/02ae2c2c-72fd-4678-8cef-3158e8e313f0.png" 
        alt="PartMatch - Car Parts Marketplace" 
        className="h-10 sm:h-12 lg:h-14 w-auto flex-shrink-0 rounded-xl bg-primary/10 p-2 shadow-lg backdrop-blur-sm border border-primary/20"
      />
    </Link>
  );
};

export default NavigationLogo;
