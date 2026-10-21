
const CACHE = "static-v3";

const FILES = [
  "./",
  "./index.html",
  "./fetch.js",
  "./main.js",
  "./main.css",
  "./manifest.json",
  "./assets/js/app.js"
];

// 1. INSTALL
self.addEventListener("install", (event) => {
  console.log("Service worker: install");

  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES))
  );

  self.skipWaiting();
});

// 2. ACTIVATE
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

// 3. FETCH
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (
    url.includes("dog.ceo") &&
    event.request.method === "GET"
  ) {
    console.log("Service worker: network first", url);
    event.respondWith(networkFirst(event.request));
  } else {
    console.log("Service worker: cache first", url);
    event.respondWith(cacheFirst(event.request));
  }
});

// CACHE FIRST
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }

  return response;
}

// NETWORK FIRST
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Offline and no cached response available.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}

// 4. PUSH NOTIFICATIONS
self.addEventListener("push", (event) => {
  console.log("Service worker: push");

  const text = event.data
    ? event.data.text()
    : "Ny hund klar!";

  event.waitUntil(
    self.registration.showNotification("My dog", {
      body: text,
      icon: "./assets/img/dog.png"
    })
  );
});
