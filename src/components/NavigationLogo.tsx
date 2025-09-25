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
      className="flex items-center gap-2 sm:gap-3 lg:gap-4 hover:opacity-90 transition-all duration-300 min-w-0 flex-shrink-0 group"
      onClick={onLinkClick}
    >
      <div className="bg-white dark:bg-transparent rounded-xl p-2 shadow-lg dark:shadow-none border border-gray-200 dark:border-transparent transition-all duration-300 group-hover:shadow-xl">
        <img 
          src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
          alt="PartMatch - Car Parts Marketplace" 
          className="h-10 sm:h-12 lg:h-14 w-auto flex-shrink-0 logo-dark-invert transition-all duration-300"
        />
      </div>
      <div className="hidden lg:block">
        <span className="brand-title text-lg font-bold">PartMatch</span>
      </div>
    </Link>
  );
};

export default NavigationLogo;