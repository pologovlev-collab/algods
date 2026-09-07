/* global self, caches */
const LEGACY_CACHE_PREFIXES = ['aisd-'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();

      await Promise.all(
        cacheKeys
          .filter((key) =>
            LEGACY_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();

      const windows = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      await Promise.all(
        windows.map((client) => client.navigate(client.url))
      );
    })()
  );
});