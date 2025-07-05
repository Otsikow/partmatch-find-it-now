import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "./NotificationBell";

const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-8 w-auto bg-card dark:bg-white rounded-sm p-1 border"
          />
          <div>
            <p className="text-sm text-foreground font-playfair font-semibold">PartMatch Ghana</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
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