import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission } from '@/lib/firebase';

const PushNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      // Only show for sellers/suppliers
      if (profile?.user_type !== 'supplier') {
        setLoading(false);
        return;
      }

      // Check for existing settings (commented out due to type issues)
      // const pushNotificationsEnabled = profile?.push_notifications_enabled ?? true;
      // const pushToken = profile?.push_token;
      
      // setPushEnabled(pushNotificationsEnabled);
      // setHasToken(!!pushToken);
      
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePushNotifications = async () => {
    if (!user) return;

    try {
      if (!pushEnabled && permission !== 'granted') {
        // Request permission first
        const token = await requestNotificationPermission();
        
        if (token) {
          setHasToken(true);
          setPushEnabled(true);
          setPermission('granted');
          
          toast({
            title: "🔔 Push notifications enabled",
            description: "You'll receive instant alerts for new part requests",
          });
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings",
            variant: "destructive"
          });
          return;
        }
      } else {
        // Toggle setting
        const newState = !pushEnabled;
        setPushEnabled(newState);
        
        // TODO: Update database when types are ready
        // await supabase
        //   .from('profiles')
        //   .update({ push_notifications_enabled: newState })
        //   .eq('id', user.id);
        
        toast({
          title: newState ? "Push notifications enabled" : "Push notifications disabled",
          description: newState 
            ? "You'll receive instant alerts for new part requests"
            : "You won't receive push notifications",
        });
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('🔔 PartMatch Test', {
        body: 'Push notifications are working perfectly!',
        icon: '/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png',
        badge: '/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png',
      });
      
      toast({
        title: "Test notification sent",
        description: "Check if you received the notification",
      });
    } else {
      toast({
        title: "Notifications not enabled",
        description: "Please enable push notifications first",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse bg-gray-200 h-4 w-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Only show for sellers
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BellRing className="h-5 w-5 text-primary" />
          <CardTitle>Push Notifications</CardTitle>
        </div>
        <CardDescription>
          Get instant alerts when buyers submit new part requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Real-time alerts</div>
            <div className="text-sm text-muted-foreground">
              Receive notifications even when the app is closed
            </div>
          </div>
          <Switch
            checked={pushEnabled}
            onCheckedChange={handleTogglePushNotifications}
            disabled={loading}
          />
        </div>

        {permission === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Bell className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800">Notifications blocked</div>
                <div className="text-yellow-700 mt-1">
                  To enable notifications, click the bell icon in your browser's address bar
                  and select "Allow" or "Allow on this site".
                </div>
              </div>
            </div>
          </div>
        )}

        {pushEnabled && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testNotification}
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Test Notification</span>
            </Button>
            <div className="text-sm text-muted-foreground">
              {hasToken ? '✅ Ready to receive notifications' : '⚠️ Setting up...'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationSettings;