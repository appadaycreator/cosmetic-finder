const CACHE_NAME = 'cosmetic-finder-v2';
const urlsToCache = [
  '/',
  '/lp.html',
  '/products.html',
  '/how-to-use.html',
  '/terms.html',
  '/privacy.html',
  '/contact.html',
  '/function.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/diagnosis.js',
  '/assets/js/ingredients.js',
  '/assets/js/products.js',
  '/assets/js/i18n.js',
  '/assets/data/products.json',
  '/assets/data/ingredients.json'
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
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
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