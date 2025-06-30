
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, MessageCircle, Star, AlertCircle, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'rating' | 'promo' | 'system';
  read: boolean;
  created_at: string;
  metadata?: any;
}

const BuyerNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Since we don't have a buyer-specific notifications table, 
      // we'll create sample notifications for demonstration
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'Order Confirmed',
          message: 'Your order for Brake Pads has been confirmed by the seller.',
          type: 'order',
          read: false,
          created_at: new Date().toISOString(),
          metadata: { orderId: 'ord_123' }
        },
        {
          id: '2',
          title: 'New Message',
          message: 'You have a new message from John\'s Auto Parts.',
          type: 'message',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          metadata: { chatId: 'chat_456' }
        },
        {
          id: '3',
          title: 'Rate Your Recent Purchase',
          message: 'Please rate your experience with your recent order.',
          type: 'rating',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          metadata: { orderId: 'ord_789' }
        },
        {
          id: '4',
          title: 'Special Offer',
          message: 'Get 20% off on all brake components this week!',
          type: 'promo',
          read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          metadata: { promoCode: 'BRAKE20' }
        }
      ];

      setNotifications(sampleNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return Package;
      case 'message': return MessageCircle;
      case 'rating': return Star;
      case 'promo': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100';
      case 'message': return 'text-green-600 bg-green-100';
      case 'rating': return 'text-yellow-600 bg-yellow-100';
      case 'promo': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' || !notif.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 mt-1">Stay updated with your activities</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            size="sm"
          >
            Unread ({unreadCount})
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllAsRead} size="sm">
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'All caught up! You have no unread notifications.'
                : 'We\'ll notify you when something important happens.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {notification.title}
                            {!notification.read && (
                              <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                            )}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {format(new Date(notification.created_at), 'MMM dd, yyyy • h:mm a')}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerNotifications;
