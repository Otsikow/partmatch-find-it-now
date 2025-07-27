import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  user_id: string;
  online_at: string;
  user_type: string;
}

export const useUserPresence = (otherUserId?: string) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id || !otherUserId) return;

    // Create a unique channel for presence tracking
    const channel = supabase.channel('user_presence');
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const userPresence = presenceState[otherUserId];
        setIsOnline(!!userPresence && userPresence.length > 0);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key === otherUserId) {
          setIsOnline(true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (key === otherUserId) {
          setIsOnline(false);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's presence
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            user_type: user.user_metadata?.user_type || 'owner'
          });
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, otherUserId]);

  return isOnline;
};

// Hook to track current user's presence across the app
export const useTrackPresence = () => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel('user_presence');
    channelRef.current = channel;

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
          user_type: user.user_metadata?.user_type || 'owner'
        });
      }
    });

    // Handle page visibility changes
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User is away
        await channel.untrack();
      } else {
        // User is back
        await channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
          user_type: user.user_metadata?.user_type || 'owner'
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id]);
};