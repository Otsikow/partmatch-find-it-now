import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RequestNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: {
    requestId: string;
    make: string;
    model: string;
    year: number;
    part: string;
    location: string;
    link: string;
  };
  created_at: string;
}

export const useRealtimeRequestNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time request notifications for user:', user.id);

    // Set up real-time subscription for new request notifications
    const channel = supabase
      .channel('request_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new as RequestNotification;
          console.log('New notification received:', notification);
          
          if (notification.type === 'new_request') {
            // Show toast notification with action buttons
            toast({
              title: notification.title,
              description: notification.message,
            });

            // Add vibration for mobile devices (PWA)
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }

            // Optional: Play notification sound (can be enabled later)
            // const audio = new Audio('/notification-sound.mp3');
            // audio.play().catch(() => {}); // Fail silently if audio can't play
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time request notifications');
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);
};