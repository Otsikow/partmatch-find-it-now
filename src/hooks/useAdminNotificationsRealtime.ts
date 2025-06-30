
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminNotification } from '@/types/AdminNotification';

interface UseAdminNotificationsRealtimeProps {
  addNotification: (notification: AdminNotification) => void;
}

export const useAdminNotificationsRealtime = ({ addNotification }: UseAdminNotificationsRealtimeProps) => {
  useEffect(() => {
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
          
          addNotification(newNotification);
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
          
          addNotification(newNotification);

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
          
          addNotification(newNotification);

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
          
          addNotification(newNotification);

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

    return () => {
      supabase.removeAllChannels();
    };
  }, [addNotification]);
};
