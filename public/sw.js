/*
 * Siksha Wallah — minimal service worker.
 * Its main job is to make the site installable as a PWA (Chrome/Edge only fire
 * `beforeinstallprompt` when a SW with a fetch handler is registered) and to
 * provide a lightweight offline fallback. It is network-first, so visitors
 * always get fresh content while online; the cache is only used when offline.
 */
const CACHE = "siksha-wallah-v1";

// Only static assets and pages are cached — never API/auth responses.
const CACHEABLE = new Set(["document", "style", "script", "image", "font"]);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave cross-origin alone
  if (url.pathname.startsWith("/api/")) return; // never cache dynamic/auth data

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && CACHEABLE.has(req.destination)) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("/"))
      )
  );
});
