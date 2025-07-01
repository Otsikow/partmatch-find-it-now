
import React from 'react';
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Buyer Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative",
              activeSection === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg",
              activeSection === item.id
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
            )}>
              <item.icon className="h-4 w-4" />
            </div>
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Auto Parts Platform
        </div>
      </div>
    </div>
  );
};

export default BuyerSidebar;
