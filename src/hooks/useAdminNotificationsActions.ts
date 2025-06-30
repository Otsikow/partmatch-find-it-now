
import { supabase } from '@/integrations/supabase/client';
import { AdminNotification } from '@/types/AdminNotification';

interface UseAdminNotificationsActionsProps {
  updateNotifications: (updater: (prev: AdminNotification[]) => AdminNotification[]) => void;
  updateUnreadCount: (updater: (prev: number) => number) => void;
}

export const useAdminNotificationsActions = ({ 
  updateNotifications, 
  updateUnreadCount 
}: UseAdminNotificationsActionsProps) => {
  const markAsRead = async (notificationId: string) => {
    try {
      // Update in database if it's a persistent notification
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
      }

      // Update local state
      updateNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      updateUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update local state even if database update fails
      updateNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      updateUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update all unread notifications in database
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      }

      // Update local state
      updateNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateUnreadCount(() => 0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Still update local state even if database update fails
      updateNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateUnreadCount(() => 0);
    }
  };

  return {
    markAsRead,
    markAllAsRead
  };
};
