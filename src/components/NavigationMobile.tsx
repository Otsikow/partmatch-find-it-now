
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavigationMobileProps {
  user: any;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onSignOut: () => void;
  getDashboardLink: () => string;
  getDashboardLabel: () => string;
  getDisplayName: () => string;
  closeMobileMenu: () => void;
}

const NavigationMobile = ({
  user,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onSignOut,
  getDashboardLink,
  getDashboardLabel,
  getDisplayName,
  closeMobileMenu
}: NavigationMobileProps) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-9 w-9 text-gray-700 hover:text-green-700 hover:bg-green-50/50"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-b border-gray-100 z-50">
          <div className="px-4 py-4 space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 font-medium border-b border-gray-100 pb-3">
                  Welcome, {getDisplayName()}
                </div>
                <Link to={getDashboardLink()} onClick={closeMobileMenu}>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="w-full border-green-600 text-green-700 hover:bg-green-50 font-medium h-11 text-base"
                  >
                    {getDashboardLabel()}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="default" 
                  onClick={onSignOut}
                  className="w-full text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium h-11 text-base"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Sign In As:</p>
                  <Link to="/buyer-auth" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:text-green-700 hover:bg-green-50/50 h-11 text-base"
                    >
                      Sign In as Buyer
                    </Button>
                  </Link>
                  <Link to="/seller-auth" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:text-green-700 hover:bg-green-50/50 h-11 text-base"
                    >
                      Sign In as Seller
                    </Button>
                  </Link>
                  <Link to="/admin-auth" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:text-green-700 hover:bg-green-50/50 h-11 text-base"
                    >
                      Sign In as Administrator
                    </Button>
                  </Link>
                </div>
                <Link to="/auth" onClick={closeMobileMenu}>
                  <Button 
                    size="default" 
                    className="w-full bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-md font-medium h-11 text-base"
                  >
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMobile;
