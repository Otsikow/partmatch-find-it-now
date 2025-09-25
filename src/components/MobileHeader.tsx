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
    <div className="relative top-0 left-0 right-0 header-gradient backdrop-blur-sm shadow-lg border-b border-primary/20 z-40">
      <div className="relative flex items-center justify-between px-4 py-3 min-h-[64px] safe-area-pt">
        <div className="flex items-center min-w-0 flex-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-primary-foreground/30 transition-colors">
              <img 
                src="/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png" 
                alt="PartMatch Logo" 
                className="h-8 w-auto object-contain bg-primary-foreground rounded-lg p-1 transition-all duration-300"
              />
            </div>
            <span className="text-primary-foreground font-bold text-lg">PartMatch</span>
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <ThemeToggle />
            <div className="flex items-center justify-center bg-primary-foreground/10 rounded-full p-1">
              <NotificationBell />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center touch-manipulation active:scale-95 transition-all duration-200 hover:bg-primary-foreground/30 hover:scale-105 shadow-lg border border-primary-foreground/30"
                >
                  <span className="text-primary-foreground font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    const dashboardUrl =
                      userType === 'admin'
                        ? '/admin'
                        : userType === 'seller' || userType === 'supplier'
                        ? '/seller-dashboard'
                        : '/buyer-dashboard';
                    navigate(dashboardUrl);
                  }}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/blog')}
                >
                  <span className="h-4 w-4"></span>
                  <span>{t('Auto Insights')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <LanguageSelector showLabel={false} variant="select" />
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <CountryCurrencySelector trigger="button" showCurrencyInfo={true} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={(e) => {
                    console.log('🚪 DropdownMenuItem: Sign out clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    handleSignOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {!user && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <ThemeToggle />
            <LanguageSelector showLabel={false} variant="button" />
            <Link to="/auth">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground font-semibold hover:bg-primary-foreground/20"
              >
                <LogIn className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;