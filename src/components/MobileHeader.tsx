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
import NotificationBell from "./NotificationBell";
import LanguageSelector from "./LanguageSelector";
const MobileHeader = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
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
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="Logo" 
            className="h-10 w-auto bg-card dark:bg-white rounded-sm p-1.5 border flex-shrink-0 object-contain" 
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent truncate text-lg sm:text-xl">
              {isHomePage ? 'PartMatch Ghana' : 'PartMatch'}
            </h1>
          </div>
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
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
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