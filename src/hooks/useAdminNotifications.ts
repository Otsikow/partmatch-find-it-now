
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminNotificationsFetcher } from './useAdminNotificationsFetcher';
import { useAdminNotificationsRealtime } from './useAdminNotificationsRealtime';
import { useAdminNotificationsActions } from './useAdminNotificationsActions';

export const useAdminNotifications = () => {
  const { user } = useAuth();
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    addNotification,
    updateNotifications,
    updateUnreadCount,
    setLoading
  } = useAdminNotificationsFetcher();

  const { markAsRead, markAllAsRead } = useAdminNotificationsActions({
    updateNotifications,
    updateUnreadCount
  });

  useAdminNotificationsRealtime({ addNotification });

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id]); // Remove fetchNotifications from dependencies to prevent infinite loop

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    setLoading
  };
};
