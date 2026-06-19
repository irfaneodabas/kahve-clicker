// Kahve İmparatorluğu — service worker (demo PWA)
// HTML: network-first (oyun hep güncel) · assets: cache-first (hızlı + çevrimdışı)
const CACHE = "kahve-v3";
const ASSETS = [
  "./", "./index.html", "manifest.json",
  "assets/emblem.svg", "assets/banner.png", "assets/cup.svg", "assets/milk.svg", "assets/splash.jpg",
  "assets/btn-gold.png", "assets/btn-green.png",
  "assets/tier0.svg", "assets/tier1.svg", "assets/tier2.svg", "assets/tier3.svg",
  "assets/tier4.svg", "assets/tier5.svg", "assets/tier6.svg", "assets/tier7.svg",
  "assets/sfx/click.mp3", "assets/sfx/buy.mp3", "assets/sfx/milestone.mp3",
  "assets/sfx/lucky.mp3", "assets/sfx/prestige.mp3"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (r) {
        var cp = r.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", cp); });
        return r;
      }).catch(function () { return caches.match("./index.html"); })
    );
  } else {
    e.respondWith(caches.match(req).then(function (c) { return c || fetch(req); }));
  }
});
