// MovePilot service worker: lets the plan open offline on moving day, before the new home has internet.
// It is registered only after the user turns on "Save on this device", and removed when they turn it off.
const CACHE = "movepilot-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("movepilot") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page sends the files it already loaded (scripts, styles, the forecast), so they are offline at once.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "precache" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls.filter((u) => typeof u === "string" && new URL(u, self.location.origin).origin === self.location.origin);
  event.waitUntil(caches.open(CACHE).then((cache) => Promise.all(urls.map((u) => cache.add(u).catch(() => undefined)))));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Built files have a content hash in the name and never change: serve them from the cache.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  // Pages and the forecast: try the network for fresh data, fall back to the last copy.
  event.respondWith(networkFirst(request, request.mode === "navigate" ? "/" : request));
});

async function cacheFirst(request) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
  return response;
}

async function networkFirst(request, key) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(CACHE)).put(key, response.clone());
    return response;
  } catch (err) {
    const hit = await caches.match(key);
    if (hit) return hit;
    throw err;
  }
}
