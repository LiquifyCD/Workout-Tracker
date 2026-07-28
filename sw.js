"use strict";

const CACHE = "divinity-v6";
const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.7";
const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./data/programs.js", "./core.js", "./app.js",
  "./site.webmanifest", "./android-chrome-192x192.png", "./android-chrome-512x512.png",
  "./apple-touch-icon.png", "./favicon.ico", "./media/login-poster.jpg"
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
  const url = new URL(event.request.url);
  const isLocal = event.request.url.startsWith(self.location.origin);
  if (!isLocal && event.request.url !== SUPABASE_CDN) return;
  if (url.pathname.endsWith(".mp4") || event.request.headers.has("range")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put("./index.html", copy)));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, response.clone())));
    return response;
  })));
});
