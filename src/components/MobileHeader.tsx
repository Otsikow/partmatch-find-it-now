import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const MobileHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 safe-area-pt">
      <div className="flex items-center justify-between px-3 py-2.5 min-h-[56px]">
        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="Logo" 
            className="h-8 w-auto bg-card dark:bg-white rounded-sm p-1.5 border flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-playfair font-bold bg-gradient-to-r from-red-600 to-green-700 bg-clip-text text-transparent truncate">
              {isHomePage ? 'PartMatch Ghana' : 'Ghana'}
            </h1>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
              <NotificationBell />
            </div>
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center min-w-[44px] min-h-[44px] touch-manipulation active:scale-95 transition-transform">
              <span className="text-primary font-semibold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;