
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Shield, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!user) {
        setUserType(null);
        return;
      }

      try {
        // First check user metadata
        const metadataUserType = user.user_metadata?.user_type;
        if (metadataUserType) {
          setUserType(metadataUserType);
          return;
        }

        // Fallback to profile query
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        setUserType(profile?.user_type || null);
      } catch (error) {
        console.error('Error fetching user type:', error);
        setUserType(null);
      }
    };

    fetchUserType();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
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

  return (
    <nav className="p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-white/90 via-yellow-50/80 to-white/90 backdrop-blur-lg shadow-lg border-b">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img 
          src="/lovable-uploads/23312658-5ff6-4d89-a7cb-c0fbf631cd1c.png" 
          alt="PartMatch Logo" 
          className="h-12 w-auto"
        />
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-green-700" />
          <h1 className="text-xl sm:text-2xl font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent">
            PartMatch Ghana
          </h1>
        </div>
      </Link>
      
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user.email}
            </span>
            <Link to={getDashboardLink()}>
              <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50">
                {getDashboardLabel()}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700 hover:bg-green-50/50 font-medium">
                  Sign In
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/buyer-auth" className="w-full cursor-pointer">
                    Sign In as Buyer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/seller-auth" className="w-full cursor-pointer">
                    Sign In as Seller
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-auth" className="w-full cursor-pointer">
                    Sign In as Administrator
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-md font-medium">
                Join Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
