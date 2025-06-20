import NotificationPresenter from "../presenters/NotificationPresenter";

// Fungsi untuk mengecek apakah Service Worker didukung
export function isServiceWorkerAvailable() {
  return "serviceWorker" in navigator;
}

// Fungsi untuk mendaftarkan Service Worker
export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.error("Service Worker API tidak didukung di browser ini.");
    return;
  }

  try {
    // Gunakan nama file yang sudah di-bundle oleh webpack
    const registration = await navigator.serviceWorker.register(
      "/sw.bundle.js"
    );
    console.log("Service worker berhasil terpasang:", registration);

    // === PENTING: Panggil NotificationPresenter DI SINI ===
    new NotificationPresenter({
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("Gagal memasang service worker:", error);
  }
}

// Fungsi untuk mengubah VAPID public key dari base64 ke Uint8Array
export function convertBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}