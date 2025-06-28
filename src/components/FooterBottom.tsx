
import { Link } from "react-router-dom";

const FooterBottom = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="text-sm text-gray-400 font-crimson text-center md:text-left">
        © {new Date().getFullYear()} PartMatch. All rights reserved. Built with automotive excellence in mind.
      </div>
      <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
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
    </div>
  );
};

export default FooterBottom;
