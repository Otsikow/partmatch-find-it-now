
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
        src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png" 
        alt="PartMatch - Car Parts Marketplace" 
        className="h-10 sm:h-12 lg:h-14 w-auto flex-shrink-0"
      />
    </Link>
  );
};

export default NavigationLogo;
