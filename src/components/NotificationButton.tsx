import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getFCMToken } from '../firebase';
import { Bell, BellOff } from 'lucide-react';

const NotificationButton: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check current notification permission
    setPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = async () => {
    setLoading(true);
    
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        // Get FCM token
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          setToken(fcmToken);
          console.log('FCM Token for testing:', fcmToken);
          
          // Copy token to clipboard for easy testing
          await navigator.clipboard.writeText(fcmToken);
          
          toast({
            title: "Notifications Enabled!",
            description: "FCM token copied to clipboard for testing.",
          });
        } else {
          toast({
            title: "Token Error",
            description: "Failed to get FCM token.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Permission Denied",
          description: "Notifications permission was denied.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    switch (permission) {
      case 'granted':
        return 'Notifications Enabled';
      case 'denied':
        return 'Notifications Blocked';
      default:
        return 'Enable Notifications';
    }
  };

  const getButtonIcon = () => {
    return permission === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={requestNotificationPermission}
        disabled={permission === 'denied' || loading}
        variant={permission === 'granted' ? 'default' : 'outline'}
        className="flex items-center gap-2"
      >
        {getButtonIcon()}
        {loading ? 'Setting up...' : getButtonText()}
      </Button>
      
      {token && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <p className="font-semibold mb-1">FCM Token (for testing):</p>
          <p className="break-all font-mono text-xs">{token}</p>
          <p className="mt-1 text-xs">
            Use this token in Firebase Console → Cloud Messaging → Send test message
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;