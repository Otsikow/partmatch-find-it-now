import { Package, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FooterCompanyInfo = () => {
  return <div className="space-y-4">
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/734b3dc6-3104-4232-88b5-ecdfdf766610.png" 
          alt="PartMatch - Car Parts Marketplace" 
          className="h-10 w-auto bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg dark:shadow-white/10 border border-gray-200 dark:border-gray-700"
        />
        <span className="text-xl font-playfair font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          PartMatch
        </span>
      </Link>
      <p className="text-gray-300 text-sm leading-relaxed font-crimson">
        Your trusted global partner for automotive parts. Connecting customers with verified local sellers for quality parts and exceptional service worldwide.
      </p>
      
    </div>;
};
export default FooterCompanyInfo;