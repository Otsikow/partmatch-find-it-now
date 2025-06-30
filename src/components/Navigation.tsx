
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MessageCircle, Home, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationAuth from "./NavigationAuth";
import NavigationLogo from "./NavigationLogo";
import NavigationMobile from "./NavigationMobile";
import ChatNotificationBadge from "./chat/ChatNotificationBadge";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavigationLogo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Home</span>
            </Link>
            <Link to="/search-parts" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Browse Parts</span>
            </Link>
            <Link to="/request-part" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline">Request Part</span>
            </Link>
            {user && (
              <Link to="/chat" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 relative">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">Messages</span>
                <ChatNotificationBadge />
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            <NavigationAuth />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <NavigationMobile 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;
