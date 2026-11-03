/* Service worker simples: sempre tenta a versão mais nova na internet;
   se estiver sem internet, abre a última versão guardada. */
const V = "loja-v1";
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(["./", "./index.html", "./icon-192.png"])).catch(() => {}));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match("./index.html")))
  );
});
