import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Smartphone, X } from 'lucide-react';
import { requestNotificationPermission, showNotification, isPWA } from '@/utils/pwa';
import { useAuth } from '@/contexts/AuthContext';

const PWANotificationManager = () => {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
      
      // Show prompt if user is logged in and notifications not granted
      if (user && Notification.permission === 'default') {
        setTimeout(() => setShowNotificationPrompt(true), 3000);
      }
    }
  }, [user]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    setShowNotificationPrompt(false);
    
    if (granted) {
      showNotification('Notifications Enabled!', {
        body: 'You\'ll now receive updates about new car parts and offers.',
        icon: '/app-icon-192.png'
      });
    }
  };

  const testNotification = () => {
    showNotification('Test Notification', {
      body: 'This is a test notification from PartMatch Ghana!',
      icon: '/app-icon-192.png'
    });
  };

  if (!showNotificationPrompt && !notificationsEnabled) return null;

  return (
    <>
      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Stay Updated</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotificationPrompt(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-sm">
              Get notified about new car parts that match your interests
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button 
                onClick={handleEnableNotifications}
                className="flex-1"
                size="sm"
              >
                <Bell className="h-4 w-4 mr-2" />
                Enable
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNotificationPrompt(false)}
                size="sm"
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PWA Installation Prompt */}
      {!isPWA() && (
        <div className="fixed top-4 right-4 z-40">
          <Card className="w-64 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm">Install App</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Add PartMatch to your home screen for quick access
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Debug: Test Notification Button (only in development) */}
      {process.env.NODE_ENV === 'development' && notificationsEnabled && (
        <Button
          onClick={testNotification}
          className="fixed bottom-20 right-4 z-50"
          size="sm"
          variant="outline"
        >
          Test Notification
        </Button>
      )}
    </>
  );
};

export default PWANotificationManager;