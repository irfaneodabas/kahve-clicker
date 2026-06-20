// Kahve İmparatorluğu — service worker (demo PWA)
// HTML: network-first (oyun hep güncel) · assets: cache-first (hızlı + çevrimdışı)
const CACHE = "kahve-v4";
const ASSETS = [
  "./", "./index.html", "manifest.json",
  "assets/emblem.svg", "assets/banner.png", "assets/cup.svg", "assets/milk.svg", "assets/splash.jpg",
  "assets/btn-gold.png", "assets/btn-green.png",
  "assets/tier0.svg", "assets/tier1.svg", "assets/tier2.svg", "assets/tier3.svg",
  "assets/tier4.svg", "assets/tier5.svg", "assets/tier6.svg", "assets/tier7.svg",
  "assets/icons/bags.svg",
  "assets/icons/bank.svg",
  "assets/icons/beans.svg",
  "assets/icons/box.svg",
  "assets/icons/cart.svg",
  "assets/icons/city.svg",
  "assets/icons/clock.svg",
  "assets/icons/clover.svg",
  "assets/icons/coffee.svg",
  "assets/icons/comet.svg",
  "assets/icons/compass.svg",
  "assets/icons/crown.svg",
  "assets/icons/export.svg",
  "assets/icons/factory.svg",
  "assets/icons/fire.svg",
  "assets/icons/gift.svg",
  "assets/icons/globe.svg",
  "assets/icons/import.svg",
  "assets/icons/lock.svg",
  "assets/icons/milk.svg",
  "assets/icons/muscle.svg",
  "assets/icons/party.svg",
  "assets/icons/planet.svg",
  "assets/icons/point.svg",
  "assets/icons/robot.svg",
  "assets/icons/rocket.svg",
  "assets/icons/save.svg",
  "assets/icons/settings.svg",
  "assets/icons/sleep.svg",
  "assets/icons/sound-off.svg",
  "assets/icons/sound-on.svg",
  "assets/icons/sparkles.svg",
  "assets/icons/star.svg",
  "assets/icons/stats.svg",
  "assets/icons/storage.svg",
  "assets/icons/store.svg",
  "assets/icons/temple.svg",
  "assets/icons/trash.svg",
  "assets/icons/trend.svg",
  "assets/icons/trophy.svg",
  "assets/icons/unlock.svg",
  "assets/icons/warning.svg",
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
