import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PM</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">PartMatch</h1>
            <p className="text-xs text-gray-500">Ghana</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-500" />
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