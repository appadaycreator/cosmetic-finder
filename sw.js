const CACHE_NAME = 'cosmetic-finder-v4';
const urlsToCache = [
  './',
  './lp.html',
  './products.html',
  './how-to-use.html',
  './terms.html',
  './privacy.html',
  './contact.html',
  './function.html',
  './settings.html',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/js/diagnosis.js',
  './assets/js/ingredients.js',
  './assets/js/products.js',
  './assets/js/i18n.js',
  './assets/js/settings.js',
  './assets/data/products.json',
  './assets/data/ingredients.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip non-http/https requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Only cache requests from the same origin
            const requestUrl = new URL(event.request.url);
            const currentUrl = new URL(self.location.origin);
            
            if (requestUrl.origin === currentUrl.origin) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                })
                .catch(err => {
                  console.warn('Cache put failed:', err);
                });
            }
            
            return response;
          }
        ).catch(err => {
          console.warn('Fetch failed:', err);
          return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event listeners
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'CosmeFinderからの新着情報があります',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: '詳しく見る',
        icon: '/assets/icons/icon-192.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/assets/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CosmeFinder', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app and navigate to a specific page
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement data synchronization logic here
  console.log('Background sync triggered');
}