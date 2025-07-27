import { Package, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FooterCompanyInfo = () => {
  return <div className="space-y-4">
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/7e314d66-25f8-4630-bc86-a9b606c241cb.png" 
          alt="PartMatch - Car Parts Marketplace" 
          className="h-10 w-auto"
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