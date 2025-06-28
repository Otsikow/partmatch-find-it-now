
import { Package, MapPin, Phone, Mail } from "lucide-react";

const FooterCompanyInfo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Package className="h-8 w-8 text-orange-500" />
        <span className="text-xl font-playfair font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          PartMatch
        </span>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed font-crimson">
        Your trusted partner for automotive parts. Connecting customers with verified local sellers for quality parts and exceptional service.
      </p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span>123 Auto Parts Street, Motor City, MC 12345</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span>+233 55 123-PART</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span>support@partmatchgh.com</span>
        </div>
      </div>
    </div>
  );
};

export default FooterCompanyInfo;
