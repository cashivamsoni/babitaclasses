/* =========================================================
   Babita Classes — Service Worker
   Strategy: network-first. Always tries the network for the
   latest version; only serves the cached copy if offline.
   Bump CACHE_VERSION whenever you want to force old caches
   to be cleared on next visit.
   ========================================================= */

const CACHE_VERSION = "babita-classes-v1";

self.addEventListener("install", function (event) {
  self.skipWaiting(); // activate the new SW immediately, don't wait for old tabs to close
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names
            .filter(function (name) {
              return name !== CACHE_VERSION;
            })
            .map(function (name) {
              return caches.delete(name);
            })
        );
      })
      .then(function () {
        return self.clients.claim(); // take control of all open tabs immediately
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
