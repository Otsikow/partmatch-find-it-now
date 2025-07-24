import { Package, MapPin, Phone, Mail } from "lucide-react";
const FooterCompanyInfo = () => {
  return <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Package className="h-8 w-8 text-orange-500" />
        <span className="text-xl font-playfair font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          PartMatch
        </span>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed font-crimson">
        Your trusted global partner for automotive parts. Connecting customers with verified local sellers for quality parts and exceptional service worldwide.
      </p>
      
    </div>;
};
export default FooterCompanyInfo;