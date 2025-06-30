
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminNotificationsFetcher } from './useAdminNotificationsFetcher';
import { useAdminNotificationsRealtime } from './useAdminNotificationsRealtime';
import { useAdminNotificationsActions } from './useAdminNotificationsActions';

export const useAdminNotifications = () => {
  const { userId } = useAuth();
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
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    setLoading
  };
};
