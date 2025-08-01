import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { requestNotificationPermission } from '@/lib/firebase';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    loadPushNotificationStatus();
  }, [user]);

  const loadPushNotificationStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      // Only relevant for sellers
      if (profile?.user_type === 'supplier') {
        // TODO: Load actual push notification settings when types are ready
        // For now, use permission status
        setIsEnabled(permission === 'granted');
      }
    } catch (error) {
      console.error('Error loading push notification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const enablePushNotifications = async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    try {
      const token = await requestNotificationPermission();
      
      if (token && user) {
        setIsEnabled(true);
        setPermission('granted');
        
        // TODO: Save to database when types are ready
        console.log('Push token obtained:', token);
        
        return true;
      } else {
        setPermission('denied');
        return false;
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      throw error;
    }
  };

  const disablePushNotifications = async () => {
    try {
      setIsEnabled(false);
      
      // TODO: Update database when types are ready
      if (user) {
        console.log('Push notifications disabled for user:', user.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      throw error;
    }
  };

  return {
    isEnabled,
    isSupported,
    permission,
    loading,
    enablePushNotifications,
    disablePushNotifications,
  };
};

export default usePushNotifications;