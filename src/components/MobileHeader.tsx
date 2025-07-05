import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "./NotificationBell";

const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/bcd13b92-5d2a-4796-b9d3-29ff8bed43d9.png" 
            alt="PartMatch Logo" 
            className="h-8 w-auto"
          />
          <div>
            <p className="text-sm text-gray-600 font-playfair font-semibold">PartMatch Ghana</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
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