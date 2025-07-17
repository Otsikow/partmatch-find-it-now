
import { HelpCircle, Info, FileText, Handshake, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const FooterUsefulInfo = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-playfair font-semibold text-white">Useful Info</h3>
      <ul className="space-y-3">
        <li>
          <Link 
            to="/about" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Info className="h-3 w-3" />
            <span>About PartMatch</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/services" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <HelpCircle className="h-3 w-3" />
            <span>How It Works</span>
          </Link>
        </li>
        <li>
          <a 
            href="#faq" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <HelpCircle className="h-3 w-3" />
            <span>FAQs</span>
          </a>
        </li>
        <li>
          <Link 
            to="/seller-auth" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Handshake className="h-3 w-3" />
            <span>Partner with Us</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Mail className="h-3 w-3" />
            <span>Contact Us</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/terms-of-service" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <FileText className="h-3 w-3" />
            <span>Terms & Conditions</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/privacy-policy" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Shield className="h-3 w-3" />
            <span>Privacy Policy</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterUsefulInfo;
