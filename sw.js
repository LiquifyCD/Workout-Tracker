"use strict";

const CACHE = "divinity-v2";
const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.7";
const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./data/programs.js", "./core.js", "./app.js",
  "./site.webmanifest", "./android-chrome-192x192.png", "./android-chrome-512x512.png",
  "./apple-touch-icon.png", "./favicon.ico", SUPABASE_CDN
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const isLocal = event.request.url.startsWith(self.location.origin);
  if (!isLocal && event.request.url !== SUPABASE_CDN) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put("./index.html", copy));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
