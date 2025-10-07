import { Bell, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import NotificationBell from "./NotificationBell";
import LanguageSelector from "./LanguageSelector";
import CountryCurrencySelector from "./CountryCurrencySelector";
import ThemeToggle from "./ThemeToggle";

const MobileHeader = () => {
  const { user, signOut, userType } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const dashboardUrl =
    userType === 'admin'
      ? '/admin-dashboard'
      : userType === 'seller' || userType === 'supplier'
      ? '/seller-dashboard'
      : '/buyer-dashboard';

  const handleSignOut = async () => {
    console.log('🚪 MobileHeader: handleSignOut clicked');
    try {
      console.log('🚪 MobileHeader: Calling supabase.auth.signOut directly');
      await supabase.auth.signOut();
      console.log('🚪 MobileHeader: signOut completed, navigating to /auth');
      navigate('/auth');
    } catch (error) {
      console.error('🚪 MobileHeader: Sign out error:', error);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="relative flex items-center justify-between px-4 py-3 pointer-events-auto">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
            alt="PartMatch Logo" 
            className="h-8 w-auto object-contain transition-all duration-300 brightness-0 invert"
          />
          <span className="text-white font-bold text-base md:text-lg drop-shadow-lg">PartMatch</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
              <NotificationBell />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                >
                  <span className="text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(dashboardUrl)}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <LanguageSelector showLabel={false} variant="select" />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LanguageSelector showLabel={false} variant="button" />
            <Link to="/auth">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all"
              >
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;