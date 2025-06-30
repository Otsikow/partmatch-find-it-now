
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminNotification } from '@/types/AdminNotification';

export const useAdminNotificationsFetcher = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (userId?: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log('Fetching admin notifications for user:', userId);
      
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching admin notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.log('Fetched admin notifications:', data?.length || 0);
        const transformedNotifications: AdminNotification[] = (data || []).map(notification => ({
          id: notification.id,
          type: notification.type as AdminNotification['type'],
          title: notification.title,
          message: notification.message,
          read: notification.read || false,
          created_at: notification.created_at,
          metadata: notification.metadata as AdminNotification['metadata']
        }));
        
        setNotifications(transformedNotifications);
        setUnreadCount(transformedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: AdminNotification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const updateNotifications = (updater: (prev: AdminNotification[]) => AdminNotification[]) => {
    setNotifications(updater);
  };

  const updateUnreadCount = (updater: (prev: number) => number) => {
    setUnreadCount(updater);
  };

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    addNotification,
    updateNotifications,
    updateUnreadCount,
    setLoading
  };
};
