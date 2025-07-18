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
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 safe-area-pt">
      <div className="flex items-center justify-between px-3 py-2.5 min-h-[56px]">
        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
          <img 
            src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png" 
            alt="PartMatch - Car Parts Marketplace" 
            className="h-12 w-auto flex-shrink-0 object-contain" 
          />
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
              <NotificationBell />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] touch-manipulation active:scale-95 transition-transform hover:bg-primary/20"
                >
                  <span className="text-primary font-semibold text-sm">
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
            <LanguageSelector showLabel={false} variant="button" />
          </div>
        )}
      </div>
    </div>
  );
};
export default MobileHeader;