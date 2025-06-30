import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const NavigationAuth = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState<string>('User');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        // Try to get seller verification info first
        const { data: verification } = await supabase
          .from('seller_verifications')
          .select('full_name, business_name')
          .eq('user_id', user.id)
          .single();

        if (verification && (verification.business_name || verification.full_name)) {
          setDisplayName(verification.business_name || verification.full_name);
          return;
        }

        // Fallback to profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setDisplayName(name || user.email?.split('@')[0] || 'User');
        } else {
          setDisplayName(user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setDisplayName(user.email?.split('@')[0] || 'User');
      }
    };

    fetchUserName();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/supplier-dashboard';
      case 'buyer':
        return '/buyer-dashboard';
      default:
        return '/dashboard';
    }
  };

  const getDashboardLabel = () => {
    switch (userType) {
      case 'admin':
        return 'Admin Panel';
      case 'seller':
        return 'Seller Dashboard';
      case 'buyer':
        return 'Buyer Dashboard';
      default:
        return 'Dashboard';
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
        <span className="text-xs lg:text-sm text-gray-600 font-medium hidden lg:block max-w-[120px] xl:max-w-none truncate">
          Welcome, {displayName}
        </span>
        <Link to={getDashboardLink()}>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-600 text-green-700 hover:bg-green-50 font-medium px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 h-8 lg:h-9 xl:h-10 text-xs lg:text-sm whitespace-nowrap"
          >
            {getDashboardLabel()}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="text-gray-700 hover:text-red-700 hover:bg-red-50/50 font-medium px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 h-8 lg:h-9 xl:h-10 text-xs lg:text-sm"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-700 hover:text-green-700 hover:bg-green-50/50 font-medium px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 h-8 lg:h-9 xl:h-10 text-xs lg:text-sm"
          >
            Sign In
            <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 ml-1 lg:ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 lg:w-56 mt-2 bg-white z-50">
          <DropdownMenuItem asChild>
            <Link to="/buyer-auth" className="w-full cursor-pointer py-2 lg:py-3 px-3 lg:px-4 text-sm">
              Sign In as Buyer
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/seller-auth" className="w-full cursor-pointer py-2 lg:py-3 px-3 lg:px-4 text-sm">
              Sign In as Seller
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin-auth" className="w-full cursor-pointer py-2 lg:py-3 px-3 lg:px-4 text-sm">
              Sign In as Administrator
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link to="/auth">
        <Button 
          size="sm"
          className="bg-gradient-to-r from-red-600 to-green-700 hover:from-red-700 hover:to-green-800 text-white shadow-md font-medium px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 h-8 lg:h-9 xl:h-10 text-xs lg:text-sm whitespace-nowrap"
        >
          Join Now
        </Button>
      </Link>
    </div>
  );
};

export default NavigationAuth;
