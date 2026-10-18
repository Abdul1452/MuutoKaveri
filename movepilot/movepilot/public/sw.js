// MovePilot service worker: lets the plan open offline on moving day, before the new home has internet.
// It is registered only after the user turns on "Save on this device", and removed when they turn it off.
//
// Consent: the page creates the CONSENT cache when saving is turned on and deletes every movepilot cache
// when it is turned off. Before writing anything the worker checks that CONSENT still exists, so a worker
// that keeps controlling an open tab after being unregistered can't store data again.
const CACHE = "movepilot-v1";
const CONSENT = "movepilot-consent";
const SHELL = ["/", "/manifest.webmanifest", "/icon.svg"];
const NETWORK_TIMEOUT_MS = 4000; // shorter than the page's own 10 s timeout, so the cached copy is used in time

const allowed = () => caches.has(CONSENT);

async function store(key, response) {
  if (!(await allowed())) return;
  await (await caches.open(CACHE)).put(key, response);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    allowed()
      .then((ok) => (ok ? caches.open(CACHE).then((cache) => cache.addAll(SHELL)) : undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("movepilot") && k !== CACHE && k !== CONSENT).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// The page sends the files it already loaded (scripts, styles, the forecast), so they are offline at once.
// Built files from earlier releases that the page no longer uses are removed at the same time.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "precache" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls.filter(
    (u) => typeof u === "string" && new URL(u, self.location.origin).origin === self.location.origin,
  );
  event.waitUntil(
    (async () => {
      if (!(await allowed())) return;
      const cache = await caches.open(CACHE);
      const current = new Set(urls.map((u) => new URL(u, self.location.origin).pathname));
      for (const request of await cache.keys()) {
        const path = new URL(request.url).pathname;
        if (path.startsWith("/assets/") && !current.has(path)) await cache.delete(request);
      }
      await Promise.all(urls.map((u) => cache.add(u).catch(() => undefined)));
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Only the app's own page is kept for offline use; opening anything else directly is passed through.
    if (url.pathname !== "/" && url.pathname !== "/index.html") return;
    event.respondWith(networkFirst(request, "/"));
    return;
  }
  // Built files have a content hash in the name and never change: serve them from the cache.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname === "/api/forecast") {
    event.respondWith(networkFirst(request, request, markSaved));
    return;
  }
  if (SHELL.includes(url.pathname)) event.respondWith(networkFirst(request, request));
});

async function cacheFirst(request) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) await store(request, response.clone());
  return response;
}

async function networkFirst(request, key, fromCache = (r) => r) {
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
    if (response.ok) await store(key, response.clone());
    return response;
  } catch (err) {
    const hit = await caches.match(key);
    if (hit) return fromCache(hit);
    throw err;
  }
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
}

/** A forecast served from the cache is not live: label it as saved so the plan says so. */
async function markSaved(response) {
  try {
    const data = await response.clone().json();
    const savedAt = response.headers.get("date");
    const body = JSON.stringify({ ...data, source: "saved", savedAt: savedAt ? new Date(savedAt).toISOString() : undefined });
    return new Response(body, { headers: { "content-type": "application/json" } });
  } catch {
    return response;
  }
}
