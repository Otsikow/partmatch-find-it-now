// Enhanced service worker for better browser compatibility (especially Brave)
const CACHE_NAME = 'partmatch-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png'
];

// Brave browser specific compatibility fixes
const isBrave = () => {
  return (navigator.brave && navigator.brave.isBrave) || false;
};

// Install event - improved for Brave compatibility
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'reload'})));
    }).catch((error) => {
      console.warn('Cache installation failed:', error);
    })
  );
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

// Enhanced fetch strategy with Brave browser compatibility
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Special handling for Brave browser
  const request = event.request.clone();
  
  // For navigation requests, use network with fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(request, {
        credentials: 'same-origin',
        cache: 'no-cache'
      }).catch(() => {
        return caches.match('/').then(response => {
          return response || new Response('App offline', { 
            status: 503,
            headers: {'Content-Type': 'text/html'}
          });
        });
      })
    );
    return;
  }

  // For static assets, try cache first, then network
  if (STATIC_ASSETS.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      }).catch(() => {
        return new Response('Resource unavailable', { status: 503 });
      })
    );
    return;
  }

  // For other requests, just use network with better error handling
  event.respondWith(
    fetch(request, {
      credentials: 'same-origin'
    }).catch(() => {
      return new Response('Network error', { status: 503 });
    })
  );
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