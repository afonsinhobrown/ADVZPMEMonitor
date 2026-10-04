const CACHE = 'advz-offline-v1';
const OFFLINE_URLS = ['/visitas', '/dashboard', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(OFFLINE_URLS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('/dashboard')))
  );
});

// Sincronização de dados submetidos offline (formulários guardados em IndexedDB)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-visitas') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => clients.forEach((c) => c.postMessage({ type: 'SYNC_VISITAS' })))
    );
  }
});
