// Run Scotland – Service Worker
const VERSION = "v2";
const SHELL = "shell-" + VERSION;
const DATA = "data-" + VERSION;
const TILES = "tiles-" + VERSION;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SHELL).then((c) =>
      Promise.all(SHELL_ASSETS.map((u) =>
        c.add(new Request(u, { cache: "reload" })).catch(() => {})
      ))
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![SHELL, DATA, TILES].includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// cap a cache to N entries (rough LRU)
async function trim(cacheName, max) {
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  if (keys.length > max) { for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]); }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // let favourite PATCH etc. pass straight through

  const url = new URL(req.url);

  // OpenStreetMap tiles -> cache-first (runtime), capped
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith((async () => {
      const c = await caches.open(TILES);
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); trim(TILES, 400); return res; }
      catch { return hit || Response.error(); }
    })());
    return;
  }

  // Supabase data (GET) -> network-first, fall back to cache
  if (url.hostname.endsWith("supabase.co")) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(DATA); c.put(req, res.clone()); trim(DATA, 30);
        return res;
      } catch { return (await caches.match(req)) || Response.error(); }
    })());
    return;
  }

  // Navigation / HTML -> network-first so updates always arrive when online
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try { const res = await fetch(req); const c = await caches.open(SHELL); c.put("./index.html", res.clone()); return res; }
      catch { return (await caches.match("./index.html")) || (await caches.match("./")); }
    })());
    return;
  }

  // Everything else (icons, leaflet) -> cache-first
  event.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try { const res = await fetch(req); const c = await caches.open(SHELL); c.put(req, res.clone()); return res; }
    catch { return hit || Response.error(); }
  })());
});
