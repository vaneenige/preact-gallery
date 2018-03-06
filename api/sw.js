const VERSION = '__VERSION__';
const CACHE_NAME = `preact-gallery-${VERSION}`;

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['/'])));
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (![CACHE_NAME].includes(key)) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => {
        console.log(`${CACHE_NAME} now ready to handle fetches!`);
        return clients.claim();
      })
      .then(() => {
        return self.clients
          .matchAll()
          .then(clients =>
            Promise.all(
              clients.map(client => client.postMessage('Service Worker is ready for use!'))
            )
          );
      })
  );
});

self.addEventListener('message', event => {
  caches.open('custom').then(cache => {
    switch (event.data.type) {
      case 'insert':
        return fetch(new Request(event.data.value, { mode: 'no-cors' }))
          .then(response => {
            cache.put(event.data.value, response);
            return response.headers.get('content-length');
          })
          .then(length => {
            event.ports[0].postMessage({
              error: null,
              data: event.data,
              length: Math.round(length),
            });
          });
      case 'remove':
        return cache.delete(event.data.value).then(success => {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.',
          });
        });
      case 'removeAll':
        return cache.keys().then(keys =>
          Promise.all(
            keys.map(key => {
              return cache.delete(key);
            })
          )
        );
      default:
        throw Error(`Unknown command: ${event.data.type}`);
    }
  });
});
