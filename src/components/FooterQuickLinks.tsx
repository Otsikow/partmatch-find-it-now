
import { Home, Search, MessageSquare, Store, UserPlus } from "lucide-react";
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
            to="/search-parts" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Search className="h-3 w-3" />
            <span>Browse Parts</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/request-part" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Request a Part</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/seller-auth" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Store className="h-3 w-3" />
            <span>Sell a Part</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/auth" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <UserPlus className="h-3 w-3" />
            <span>Sign In / Sign Up</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterQuickLinks;
