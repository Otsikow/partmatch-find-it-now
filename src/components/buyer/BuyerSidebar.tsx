
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Star, 
  FileText, 
  User, 
  Bell, 
  Search, 
  MessageSquare,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BuyerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BuyerSidebar = ({ activeTab, onTabChange }: BuyerSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    {
      id: "overview",
      label: t('overview'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "saved",
      label: t('savedParts'),
      icon: Star,
      badge: null,
    },
    {
      id: "orders",
      label: t('myOrders'),
      icon: FileText,
      badge: null,
    },
    {
      id: "profile",
      label: t('profile'),
      icon: User,
      badge: null,
    },
  ];

  const quickLinks = [
    {
      label: t('searchParts'),
      icon: Search,
      href: "/search-parts",
    },
    {
      label: t('messages'),
      icon: MessageSquare,
      href: "/chat",
    },
    {
      label: t('home'),
      icon: Home,
      href: "/",
    },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="font-semibold text-gray-900">{t('buyerDashboard')}</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-2"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                {t('dashboard')}
              </p>
            )}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="space-y-1 pt-4">
            {!collapsed && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                {t('quickLinks')}
              </p>
            )}
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="text-xs text-gray-500">
              <p>{t('needHelp')}</p>
              <Link to="/contact" className="text-primary hover:underline">
                {t('contactSupport')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerSidebar;
