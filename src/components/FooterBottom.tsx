
import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

const FooterBottom = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
      <div className="text-sm text-gray-400 font-crimson text-center lg:text-left">
        © {new Date().getFullYear()} PartMatch. All rights reserved. Built with automotive excellence in mind.
      </div>
      
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link 
            to="/privacy-policy"
            className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms-of-service"
            className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
          >
            Terms of Service
          </Link>
          <Link 
            to="/cookie-policy"
            className="text-gray-400 hover:text-orange-400 transition-colors duration-200 font-crimson"
          >
            Cookie Policy
          </Link>
        </div>
        
        <div className="flex items-center">
          <LanguageSelector showLabel={false} variant="button" />
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
