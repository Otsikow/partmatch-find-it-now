// Simplified service worker for better browser compatibility
const CACHE_NAME = 'partmatch-v3';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png'
];

// Install event - minimal caching
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up and take control
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

// Simplified fetch strategy - just pass through most requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests, use network with fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || 
               new Response('App offline', { status: 503 });
      })
    );
    return;
  }

  // For other requests, just use network
  event.respondWith(fetch(event.request));
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/app-icon-192.png',
    badge: '/app-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/app-icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/app-icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PartMatch Ghana', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});