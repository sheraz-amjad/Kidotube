// KidoTube Service Worker - Safe Offline Shell & Caching
const CACHE_NAME = 'kidotube-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/download',
  '/games',
  '/notebook',
  '/offline',
];

// Install: pre-cache essential offline shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache asset warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first with offline cache fallback
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  // Skip YouTube embeds and cross-origin video streams
  if (event.request.url.includes('youtube.com') || event.request.url.includes('googlevideo.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;
          return caches.match('/');
        }
        return new Response('Network offline', { status: 503, statusText: 'Offline' });
      })
  );
});

// Background Push & Study Reminder Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '⏰ Study Time on KidoTube!';
  const options = {
    body: data.body || 'Time for your daily poem practice or math challenge! Earn stars ⭐',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || '/')
  );
});
