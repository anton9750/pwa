// Name of our cache (bump this number when you change cached files)
const CACHE = "static-v2";

// Static files for offline use
const FILES = [
  "./",
  "./index.html",
  "./main.js",
  "./main.css",
  "./manifest.json",
  "./assets/js/app.js"
];

// 1. INSTALL: save the files in the cache
self.addEventListener("install", (event) => {
  console.log("Service worker: install");

  // Activate the new worker right away instead of waiting
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES))
  );
});

// 2. ACTIVATE: take control of open tabs and remove old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker: activate");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 3. FETCH: cache first, fall back to the network
self.addEventListener("fetch", (event) => {
  console.log("Service worker: fetch", event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Found in the cache
        return response;
      }
      // Not in the cache, get it from the network
      return fetch(event.request);
    })
  );
});