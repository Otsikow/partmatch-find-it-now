
import { Home, Users, Wrench, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FooterQuickLinks = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-playfair font-semibold text-white">Quick Links</h3>
      <ul className="space-y-3">
        <li>
          <Link 
            to="/" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Home className="h-3 w-3" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Users className="h-3 w-3" />
            <span>About Us</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/services" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Wrench className="h-3 w-3" />
            <span>Our Services</span>
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
      </ul>
    </div>
  );
};

export default FooterQuickLinks;
