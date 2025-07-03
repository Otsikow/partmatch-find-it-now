
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
        <div className="flex items-start space-x-2 text-sm text-gray-300">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div>AK-798-9707, Ampayo, Kumasi, Ghana</div>
            <div>Office 10, Seaview Business Centre, Redcar, UK TS10 1AZ</div>
          </div>
        </div>
        <div className="flex items-start space-x-2 text-sm text-gray-300">
          <Phone className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div>+233205934505</div>
            <div>+447360961803</div>
          </div>
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
