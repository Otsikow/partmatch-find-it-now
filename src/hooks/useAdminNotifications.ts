import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminNotification {
  id: string;
  type: 'new_verification' | 'new_request' | 'new_offer' | 'status_update';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: {
    verification_id?: string;
    request_id?: string;
    offer_id?: string;
  };
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchNotifications();
    setupRealtimeSubscriptions();

    return () => {
      supabase.removeAllChannels();
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching admin notifications for user:', user.id);
      
      // Fetch admin-specific notifications from the database
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

  const setupRealtimeSubscriptions = () => {
    console.log('Setting up admin notification real-time subscriptions');

    // Listen for new admin notifications
    const adminNotificationsChannel = supabase
      .channel('admin_notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('New admin notification received:', payload);
          const newNotification: AdminNotification = {
            id: payload.new.id,
            type: payload.new.type,
            title: payload.new.title,
            message: payload.new.message,
            read: payload.new.read || false,
            created_at: payload.new.created_at,
            metadata: payload.new.metadata
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Listen for new seller verifications
    const verificationsChannel = supabase
      .channel('seller_verifications_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'seller_verifications'
        },
        (payload) => {
          console.log('New seller verification detected:', payload);
          const newNotification: AdminNotification = {
            id: `verification_${payload.new.id}`,
            type: 'new_verification',
            title: 'New Seller Verification',
            message: `${payload.new.full_name} submitted a verification request`,
            read: false,
            created_at: new Date().toISOString(),
            metadata: { verification_id: payload.new.id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Also create a persistent notification in the database
          supabase
            .from('admin_notifications')
            .insert({
              type: 'new_verification',
              title: 'New Seller Verification',
              message: `${payload.new.full_name} submitted a verification request`,
              metadata: { verification_id: payload.new.id }
            })
            .then(({ error }) => {
              if (error) console.error('Error creating admin notification:', error);
            });
        }
      )
      .subscribe();

    // Listen for new part requests
    const requestsChannel = supabase
      .channel('part_requests_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'part_requests'
        },
        (payload) => {
          console.log('New part request detected:', payload);
          const newNotification: AdminNotification = {
            id: `request_${payload.new.id}`,
            type: 'new_request',
            title: 'New Part Request',
            message: `New request for ${payload.new.part_needed} - ${payload.new.car_make} ${payload.new.car_model}`,
            read: false,
            created_at: new Date().toISOString(),
            metadata: { request_id: payload.new.id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Also create a persistent notification in the database
          supabase
            .from('admin_notifications')
            .insert({
              type: 'new_request',
              title: 'New Part Request',
              message: `New request for ${payload.new.part_needed} - ${payload.new.car_make} ${payload.new.car_model}`,
              metadata: { request_id: payload.new.id }
            })
            .then(({ error }) => {
              if (error) console.error('Error creating admin notification:', error);
            });
        }
      )
      .subscribe();

    // Listen for new offers
    const offersChannel = supabase
      .channel('offers_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'offers'
        },
        (payload) => {
          console.log('New offer detected:', payload);
          const newNotification: AdminNotification = {
            id: `offer_${payload.new.id}`,
            type: 'new_offer',
            title: 'New Seller Offer',
            message: `New offer of GHS ${payload.new.price} submitted`,
            read: false,
            created_at: new Date().toISOString(),
            metadata: { offer_id: payload.new.id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Also create a persistent notification in the database
          supabase
            .from('admin_notifications')
            .insert({
              type: 'new_offer',
              title: 'New Seller Offer',
              message: `New offer of GHS ${payload.new.price} submitted`,
              metadata: { offer_id: payload.new.id }
            })
            .then(({ error }) => {
              if (error) console.error('Error creating admin notification:', error);
            });
        }
      )
      .subscribe();
  };

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
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update local state even if database update fails
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Still update local state even if database update fails
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
