
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
    if (!user) return;

    fetchNotifications();
    setupRealtimeSubscriptions();

    return () => {
      supabase.removeAllChannels();
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // For now, we'll create mock notifications based on real-time data
      // Once the database types are updated, we can query the admin_notifications table directly
      const mockNotifications: AdminNotification[] = [];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
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
          const newNotification: AdminNotification = {
            id: `offer_${payload.new.id}`,
            type: 'new_offer',
            title: 'New Supplier Offer',
            message: `New offer of GHS ${payload.new.price} submitted`,
            read: false,
            created_at: new Date().toISOString(),
            metadata: { offer_id: payload.new.id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
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
