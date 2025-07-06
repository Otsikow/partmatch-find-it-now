import { Home, Search, Plus, MessageCircle, User, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatNotificationBadge from "./chat/ChatNotificationBadge";

const MobileBottomTabs = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const tabs = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: Search,
      label: "Browse",
      path: "/search-parts",
    },
    {
      icon: Plus,
      label: "Request",
      path: "/request-part",
    },
    {
      icon: Package,
      label: "Sell Parts",
      path: "/seller-dashboard",
    },
    ...(user ? [{
      icon: MessageCircle,
      label: "Messages",
      path: "/chat",
      hasNotification: true,
    }] : []),
    {
      icon: User,
      label: user ? "Profile" : "Sign In",
      path: user ? "/buyer-dashboard" : "/auth",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around py-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 relative min-h-[60px] touch-manipulation active:scale-95 transition-all duration-200 rounded-lg ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {tab.hasNotification && <ChatNotificationBadge />}
              </div>
              <span className={`text-xs font-medium truncate ${
                active ? "text-primary" : "text-muted-foreground"
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomTabs;