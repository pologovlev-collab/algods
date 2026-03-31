const CACHE = 'aisd-v2'; // ← меняй эту версию при каждом деплое (v3, v4...)
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting(); // активируем новый SW сразу
});

self.addEventListener('activate', e => {
  // Удаляем все старые кэши кроме текущего
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // берём контроль над всеми вкладками сразу
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});