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

// Open (or focus) the chat when a notification is tapped. Used by the
// "counsellor is online" notification fired from the student portal.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard/messages";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url.includes(target) && "focus" in w) return w.focus();
      }
      // Fall back to focusing any open tab and navigating it, else open a new one.
      if (wins.length && "navigate" in wins[0]) {
        return wins[0].focus().then(() => wins[0].navigate(target));
      }
      return self.clients.openWindow ? self.clients.openWindow(target) : undefined;
    })
  );
});

// Future-proofing: if server-sent Web Push is added later, render it. Harmless
// today since nothing pushes yet.
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }
  const title = payload.title || "Siksha Wallah";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: payload.tag || "siksha-wallah",
      data: { url: payload.url || "/dashboard/messages" },
    })
  );
});
