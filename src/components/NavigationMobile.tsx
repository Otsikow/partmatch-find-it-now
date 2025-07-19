
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
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-nav border-t border-border">
        <Link
          to="/"
          className="flex flex-col items-center gap-2 px-3 py-3 text-base font-medium text-nav-muted hover:text-nav-accent hover:bg-accent rounded-lg transition-colors"
          onClick={onClose}
        >
          <Home className="h-6 w-6" />
          <span className="text-sm">Home</span>
        </Link>
        <Link
          to="/search-parts"
          className="flex flex-col items-center gap-2 px-3 py-3 text-base font-medium text-nav-muted hover:text-nav-accent hover:bg-accent rounded-lg transition-colors"
          onClick={onClose}
        >
          <Search className="h-6 w-6" />
          <span className="text-sm">Browse Parts</span>
        </Link>
        <Link
          to="/request-part"
          className="flex flex-col items-center gap-2 px-3 py-3 text-base font-medium text-nav-muted hover:text-nav-accent hover:bg-accent rounded-lg transition-colors"
          onClick={onClose}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Request Part</span>
        </Link>
        <Link
          to="/post-part"
          className="flex flex-col items-center gap-2 px-3 py-3 text-base font-medium text-nav-muted hover:text-nav-accent hover:bg-accent rounded-lg transition-colors"
          onClick={onClose}
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Sell Part</span>
        </Link>
        {user && (
          <Link
            to="/chat"
            className="flex flex-col items-center gap-2 px-3 py-3 text-base font-medium text-nav-muted hover:text-nav-accent hover:bg-accent rounded-lg transition-colors relative"
            onClick={onClose}
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-sm">Messages</span>
            <ChatNotificationBadge />
          </Link>
        )}
        <div className="pt-4 pb-3 border-t border-border mt-4">
          <NavigationAuth />
        </div>
      </div>
    </div>
  );
};

export default NavigationMobile;
