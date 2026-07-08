/* Babita Classes — Service Worker (PWA) */

/* IMPORTANT: bump this version string on every deploy that changes any
   cached file (html/css/js). Changing this string is what makes the
   browser detect that sw.js itself has changed, which triggers a fresh
   install + cache refresh. If you forget to bump it, mobile devices that
   already have the old service worker installed will keep serving the
   old cached files even after you push new code to Vercel/GitHub. */
const CACHE_VERSION = "v2";
const CACHE_NAME = `babita-classes-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/blog.html",
  "/result.html",
  "/style.css",
  "/script.js",
  "/result.js",
  "/manifest.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  // Network-first: always try to get the latest version from the network.
  // Only fall back to the cache if the network request fails (e.g. offline).
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
}); 
