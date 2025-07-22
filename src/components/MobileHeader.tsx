import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
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
import NotificationBell from "./NotificationBell";
import LanguageSelector from "./LanguageSelector";
import CountryCurrencySelector from "./CountryCurrencySelector";
import ThemeToggle from "./ThemeToggle";
const MobileHeader = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t('signOut'),
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative top-0 left-0 right-0 bg-gradient-to-r from-primary via-primary to-primary/90 backdrop-blur-sm shadow-lg border-b border-white/20 z-40">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10"></div>
      <div className="relative flex items-center justify-between px-4 py-3 min-h-[64px] safe-area-pt">
        <div className="flex items-center min-w-0 flex-1">
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <ThemeToggle />
            <div className="flex items-center justify-center bg-white/10 rounded-full p-1">
              <NotificationBell />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center touch-manipulation active:scale-95 transition-all duration-200 hover:bg-white/30 hover:scale-105 shadow-lg border border-white/30"
                >
                  <span className="text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => window.location.href = '/buyer-dashboard'}
                >
                  <User className="h-4 w-4" />
                  <span>{t('dashboard')}</span>
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
                  onClick={handleSignOut}
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
            <Button
              variant="ghost"
              className="text-white font-semibold"
              onClick={() => window.location.href = '/buyer-auth'}
            >
              {t('dashboard')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MobileHeader;