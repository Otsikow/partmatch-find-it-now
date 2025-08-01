// Firebase service worker for handling background push notifications
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Firebase config (same as in main app)
const firebaseConfig = {
  apiKey: "AIzaSyD8B8K0qoqX8zUWU0QDY9Y1a2a3Xj8Z9Y4",
  authDomain: "partmatch-notifications.firebaseapp.com",
  projectId: "partmatch-notifications",
  storageBucket: "partmatch-notifications.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'PartMatch';
  const notificationOptions = {
    body: payload.notification?.body || 'New notification from PartMatch',
    icon: '/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png',
    badge: '/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png',
    tag: 'partmatch-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Request'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    data: {
      url: payload.data?.url || '/seller-dashboard?tab=requests'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/seller-dashboard?tab=requests';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes('partmatch') && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});