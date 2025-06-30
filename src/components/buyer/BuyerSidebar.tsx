
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  MessageCircle, 
  Heart, 
  Bell, 
  User, 
  Star,
  ShoppingCart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BuyerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  unreadMessages?: number;
  unreadNotifications?: number;
}

const BuyerSidebar = ({ 
  activeSection, 
  onSectionChange, 
  unreadMessages = 0,
  unreadNotifications = 0 
}: BuyerSidebarProps) => {
  const navigationItems = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: Package,
      description: 'View purchase history'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      description: 'Chat with sellers',
      badge: unreadMessages
    },
    {
      id: 'saved-parts',
      label: 'Saved Parts',
      icon: Heart,
      description: 'Your wishlist'
    },
    {
      id: 'rate-sellers',
      label: 'Rate Sellers',
      icon: Star,
      description: 'Rate completed orders'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Latest alerts',
      badge: unreadNotifications
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: User,
      description: 'Edit your profile'
    }
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Buyer Dashboard</h2>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors group",
              activeSection === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              activeSection === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
            )} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 min-w-[20px] text-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BuyerSidebar;
