/* BeYuumi service worker.
 *
 * Lives at the project root so it is emitted to the web root (scope "/") by
 * Parcel. Provides an app-like experience: precaches the shell, caches
 * same-origin GETs at runtime, and shows a self-contained offline page when a
 * navigation fails while offline.
 */

const CACHE_NAME = "beyuumi-v1";

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <title>You're offline</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0f172a;color:#e2e8f0;font-family:Inter,system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}
      .card{max-width:360px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:40px 28px}
      .dot{width:72px;height:72px;margin:0 auto 20px;border-radius:50%;background:#ff6b00;color:#fff;font-size:40px;font-weight:800;display:grid;place-items:center}
      h1{margin:0 0 8px;font-size:22px}
      p{margin:0;color:#94a3b8;font-size:15px;line-height:1.6}
      button{margin-top:24px;border:0;border-radius:999px;padding:14px 28px;font-size:15px;font-weight:600;color:#fff;background:#ff6b00;cursor:pointer}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="dot">B</div>
      <h1>You're offline</h1>
      <p>Check your internet connection and try again. Your cart is still safe — we'll be ready when you are.</p>
      <button onclick="location.reload()">Try again</button>
    </div>
  </body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["/", "/index.html"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET; skip non-http(s) schemes.
  if (request.method !== "GET" || !request.url.startsWith("http")) return;

  // Never cache runtime API calls — they always hit the network.
  if (request.url.includes("themealdb.com") || request.url.includes("localhost:5000")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Cache successful same-origin GETs for future offline use.
          if (response && response.ok && new URL(request.url).origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return new Response(OFFLINE_HTML, {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            });
          }
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});