
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
        src="/lovable-uploads/734b3dc6-3104-4232-88b5-ecdfdf766610.png" 
        alt="PartMatch - Car Parts Marketplace" 
        className="h-10 sm:h-12 lg:h-14 w-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg dark:shadow-white/10 border border-gray-200 dark:border-gray-700"
      />
    </Link>
  );
};

export default NavigationLogo;
