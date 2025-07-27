
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
        src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
        alt="PartMatch - Car Parts Marketplace" 
        className="h-10 sm:h-12 lg:h-14 w-auto flex-shrink-0 bg-white rounded-lg p-2 shadow-lg border border-gray-200"
      />
    </Link>
  );
};

export default NavigationLogo;
