// Level Up service worker: the app opens even when the connection is weak or gone.
// Versioned files (?v=N), fonts, pictures and sounds are cached and served from the cache first; the start page and
// unversioned files go to the network first and fall back to the cache. /api/ and live games are never touched.
const CACHE = "levelup-v2"; // v2: drops the old 64 px emoji PNGs and the copies of older ?v= files
const SHELL = ["/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// A new ?v= of a file replaces the older ones in the cache, so the cache does not grow with every update.
const dropOlder = (c, req) => {
  const url = new URL(req.url);
  if (!url.searchParams.has("v")) return;
  c.keys().then((keys) => keys.forEach((k) => {
    const u = new URL(k.url);
    if (u.pathname === url.pathname && u.search !== url.search) c.delete(k);
  }));
};
const cacheFirst = (req) => caches.match(req).then((hit) => hit || fetch(req).then((res) => {
  if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy).then(() => dropOlder(c, req))); }
  return res;
}));

const networkFirst = (req) => fetch(req).then((res) => {
  if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
}).catch(() => caches.match(req).then((hit) => hit || Response.error()));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/") || req.headers.get("range")) return;
  if (url.pathname === "/") { e.respondWith(networkFirst(new Request("/"))); return; }
  if (!url.pathname.startsWith("/static/")) return;
  const stable = url.searchParams.has("v") || /\.(woff2?|png|jpe?g|webp|gif|svg|ico|mp3|mp4)$/i.test(url.pathname);
  e.respondWith(stable ? cacheFirst(req) : networkFirst(req));
});
