import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Shield, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserType(null);
        setFirstName(null);
        return;
      }

      try {
        // First check user metadata
        const metadataUserType = user.user_metadata?.user_type;
        if (metadataUserType) {
          setUserType(metadataUserType);
        }

        // Fetch profile data for first name and user type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type, first_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Use metadata user_type if available, otherwise use profile user_type
          setUserType(metadataUserType || profile.user_type || null);
          setFirstName(profile.first_name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserType(null);
        setFirstName(null);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (userType === 'admin') return '/admin';
    if (userType === 'supplier') return '/supplier';
    return '/buyer-dashboard';
  };

  const getDashboardLabel = () => {
    if (userType === 'admin') return 'Admin Dashboard';
    if (userType === 'supplier') return 'Seller Dashboard';
    return 'Buyer Dashboard';
  };

  const getDisplayName = () => {
    if (firstName) return firstName;
    return user?.email || 'User';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between bg-white shadow-sm border-b border-gray-100 relative">
      {/* Logo Section */}
      <Link 
        to="/" 
        className="flex items-center gap-2 sm:gap-3 lg:gap-4 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0"
        onClick={closeMobileMenu}
      >
        <img 
          src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
          alt="PartMatch Logo" 
          className="h-8 sm:h-9 lg:h-10 w-auto flex-shrink-0"
        />
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-green-700 flex-shrink-0" />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent truncate">
            PartMatch Ghana
          </h1>
        </div>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-4 xl:gap-6">
        {user ? (
          <div className="flex items-center gap-4 xl:gap-6">
            <span className="text-sm text-gray-600 font-medium hidden xl:block">
              Welcome, {getDisplayName()}
            </span>
            <Link to={getDashboardLink()}>
              <Button 
                variant="outline" 
                size="default" 
                className="border-green-600 text-green-700 hover:bg-green-50 font-medium px-4 xl:px-6 py-2 h-9 xl:h-10 text-sm"
              >
                {getDashboardLabel()}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="default" 
              onClick={handleSignOut}
              className="text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium px-3 xl:px-4 py-2 h-9 xl:h-10 text-sm"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 xl:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="default" 
                  className="text-gray-700 hover:text-green-700 hover:bg-green-50/50 font-medium px-3 xl:px-4 py-2 h-9 xl:h-10 text-sm"
                >
                  Sign In
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem asChild>
                  <Link to="/buyer-auth" className="w-full cursor-pointer py-3 px-4">
                    Sign In as Buyer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/seller-auth" className="w-full cursor-pointer py-3 px-4">
                    Sign In as Seller
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-auth" className="w-full cursor-pointer py-3 px-4">
                    Sign In as Administrator
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/auth">
              <Button 
                size="default" 
                className="bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-md font-medium px-4 xl:px-6 py-2 h-9 xl:h-10 text-sm"
              >
                Join Now
              </Button>
            </Link>
          </div>
        )}
      </div>

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
                  onClick={handleSignOut}
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
    </nav>
  );
};

export default Navigation;
