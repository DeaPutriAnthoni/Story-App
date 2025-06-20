import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// ===============================
// ⚡ 1️⃣ Install Event → activate SW langsung
// ===============================

self.addEventListener("install", () => {
  console.log("Service Worker: Menginstall...");
  self.skipWaiting(); // Langsung aktifkan SW baru
});

// ⚡ Activate event → cleanup old caches jika perlu
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate → ready to control pages.");
  clients.claim(); // SW langsung kontrol halaman tanpa reload
});

// ===============================
// ⚡ 2️⃣ Precaching (aktifkan untuk offline.html & manifest.json & icons)
// ===============================

precacheAndRoute(self.__WB_MANIFEST);

// ===============================
// ⚡ 3️⃣ Runtime Caching
// ===============================

// ✅ API story → pakai NetworkFirst → supaya data baru langsung muncul
registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev",
  new NetworkFirst({
    cacheName: "story-api-cache",
    networkTimeoutSeconds: 3, // fallback cache jika network lama
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // cache API story max 5 menit
      }),
    ],
  })
);

// ✅ Gambar → pakai CacheFirst → hemat bandwidth
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

// ✅ Static CSS/JS → boleh pakai StaleWhileRevalidate → cepat render
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

// ✅ Offline fallback untuk navigasi (HTML page requests)
registerRoute(
  ({ request }) => request.mode === "navigate",
  async ({ event }) => {
    try {
      return await fetch(event.request);
    } catch (error) {
      return caches.match("/offline.html");
    }
  }
);

// ===============================
// ⚡ 4️⃣ Push Notification
// ===============================

self.addEventListener("push", (event) => {
  console.log("Service Worker: Push Diterima.");

  if (!event.data) {
    console.log("Push message tanpa data. Skip.");
    return;
  }

  const showNotificationPromise = (async () => {
    let title = "Notifikasi";
    let options = { body: "" };

    try {
      // Ambil text payload
      const rawData = await event.data.text();

      // Coba parse sebagai JSON
      const parsedData = JSON.parse(rawData);

      title = parsedData.title || title;
      options = parsedData.options || { body: parsedData.body || "" };

      console.log("Push data JSON valid:", parsedData);
    } catch (error) {
      // Fallback → tampilkan sebagai text
      console.warn("Push data bukan JSON, tampilkan sebagai text.");

      const fallbackText = await event.data.text();
      options.body = fallbackText;

      console.log("Push data text:", fallbackText);
    }

    const subscription = await self.registration.pushManager.getSubscription();
    if (!subscription) {
      console.log("Tidak ada active subscription → abaikan notifikasi.");
      return;
    }

    console.log("Menampilkan notifikasi:", title, options);
    return self.registration.showNotification(title, options);
  })();

  event.waitUntil(showNotificationPromise);
});