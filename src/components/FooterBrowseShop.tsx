
import { Search, MapPin, Package, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const FooterBrowseShop = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-playfair font-semibold text-white">Browse & Shop</h3>
      <ul className="space-y-3">
        <li>
          <Link 
            to="/search-parts" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Search className="h-3 w-3" />
            <span>Search Parts</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/search-map" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <MapPin className="h-3 w-3" />
            <span>Find Parts Near You</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/request-part" 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Package className="h-3 w-3" />
            <span>Request Parts</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/seller-auth"
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm font-crimson flex items-center space-x-2"
          >
            <Shield className="h-3 w-3" />
            <span>Seller Dashboard</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterBrowseShop;
