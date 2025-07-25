// Simplified service worker for improved browser compatibility
const CACHE_NAME = 'partmatch-v5-cache';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png',
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => console.error('Service Worker: Caching failed', err))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network-first strategy for navigation, cache-first for others
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For navigation requests, go network-first to ensure freshness
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If response is good, cache it and return it
          if (response.ok) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, resClone));
          }
          return response;
        })
        .catch(() => {
          // On network failure, serve from cache
          return caches.match(request).then(res => res || caches.match('/'));
        })
    );
    return;
  }

  // For other requests (assets, etc.), go cache-first for speed
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((fetchResponse) => {
        // Cache the new resource and return it
        const resClone = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, resClone));
        return fetchResponse;
      });
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
    self.registration.showNotification('PartMatch', options)
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