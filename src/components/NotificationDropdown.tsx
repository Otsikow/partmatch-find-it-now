import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NotificationDropdown = () => {
  const { notifications, loading, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Enhanced navigation logic
    switch (notification.type) {
      case 'new_request': {
        navigate('/seller-dashboard?tab=requests');
        break;
      }
      case 'new_message': {
        // Navigate to chat with the sender to continue the conversation
        const senderId = notification.metadata?.sender_id || notification.metadata?.user_id || notification.metadata?.chat_id;
        console.log('📬 Message notification clicked:', { senderId, metadata: notification.metadata });
        if (senderId) {
          navigate(`/chat?userId=${senderId}`);
        } else {
          // If no sender ID, try to use chat_id
          const chatId = notification.metadata?.chat_id;
          if (chatId) {
            navigate(`/chat?id=${chatId}`);
          } else {
            navigate('/chat');
          }
        }
        break;
      }
      case 'new_offer': {
        navigate('/buyer-dashboard?tab=offers');
        break;
      }
      case 'offer_accepted': {
        navigate('/seller-dashboard?tab=offers');
        break;
      }
      case 'item_shipped': {
        navigate('/buyer-dashboard?tab=orders');
        break;
      }
      case 'new_review': {
        navigate('/seller-dashboard?tab=reviews');
        break;
      }
      case 'new_part_request': {
        navigate('/requested-car-parts');
        break;
      }
      default: {
        if (notification.metadata?.user_role === 'seller') {
          navigate('/seller-dashboard');
        } else if (notification.metadata?.user_role === 'buyer') {
          navigate('/buyer-dashboard');
        } else {
          navigate('/dashboard');
        }
        break;
      }
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    console.log('🔔 NotificationDropdown: Clear All button clicked');
    console.log('🔔 Current notifications count:', notifications.length);
    await clearAll();
    console.log('🔔 Clear all completed, closing dropdown');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-card/80 backdrop-blur-sm border-border hover:bg-card text-foreground hover:text-foreground transition-all duration-300 shadow-lg border p-2 sm:px-3 relative"
        >
          <Bell className="h-4 w-4 drop-shadow-lg" />
          <span className="hidden md:inline ml-1 drop-shadow-lg">Alerts</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={notifications.length === 0}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-semibold text-sm text-gray-800">{notification.title}</p>
                <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
