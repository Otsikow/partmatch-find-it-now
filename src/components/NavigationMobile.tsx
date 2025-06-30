
import { Link } from "react-router-dom";
import { MessageCircle, Home, Search, Plus } from "lucide-react";
import NavigationAuth from "./NavigationAuth";
import ChatNotificationBadge from "./chat/ChatNotificationBadge";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationMobile = ({ isOpen, onClose }: NavigationMobileProps) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          onClick={onClose}
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link
          to="/search-parts"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          onClick={onClose}
        >
          <Search className="h-5 w-5" />
          Browse Parts
        </Link>
        <Link
          to="/request-part"
          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          onClick={onClose}
        >
          <Plus className="h-5 w-5" />
          Request Part
        </Link>
        {user && (
          <Link
            to="/chat"
            className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors relative"
            onClick={onClose}
          >
            <MessageCircle className="h-5 w-5" />
            Messages
            <ChatNotificationBadge />
          </Link>
        )}
        <div className="pt-4 pb-3 border-t border-gray-200 mt-4">
          <NavigationAuth />
        </div>
      </div>
    </div>
  );
};

export default NavigationMobile;
