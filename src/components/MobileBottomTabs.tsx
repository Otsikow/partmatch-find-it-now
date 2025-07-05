import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 relative ${
                active
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-500"}`} />
                {tab.hasNotification && <ChatNotificationBadge />}
              </div>
              <span className={`text-xs mt-1 truncate ${
                active ? "text-blue-600 font-medium" : "text-gray-500"
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