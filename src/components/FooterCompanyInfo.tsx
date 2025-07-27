import { Package, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FooterCompanyInfo = () => {
  return <div className="space-y-4">
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
          alt="PartMatch - Car Parts Marketplace" 
          className="h-10 w-auto bg-white rounded-lg p-2 shadow-lg border border-gray-200"
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