import { Package, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FooterCompanyInfo = () => {
  return <div className="space-y-4">
      <Link to="/" className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/02ae2c2c-72fd-4678-8cef-3158e8e313f0.png" 
          alt="PartMatch - Car Parts Marketplace" 
          className="h-10 w-auto rounded-xl bg-primary/10 p-2 shadow-lg backdrop-blur-sm border border-primary/20"
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