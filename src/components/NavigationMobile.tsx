
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
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
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/search-parts"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
          onClick={onClose}
        >
          Browse Parts
        </Link>
        <Link
          to="/request-part"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
          onClick={onClose}
        >
          Request Part
        </Link>
        <Link
          to="/about"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
          onClick={onClose}
        >
          About
        </Link>
        <Link
          to="/contact"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
          onClick={onClose}
        >
          Contact
        </Link>
        {user && (
          <Link
            to="/chat"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
            onClick={onClose}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
            <ChatNotificationBadge />
          </Link>
        )}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <NavigationAuth />
        </div>
      </div>
    </div>
  );
};

export default NavigationMobile;
