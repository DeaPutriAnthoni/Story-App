import "../styles/styles.css";
import App from "./presenters/app";
import { registerServiceWorker } from "./utils";
import NotificationPresenter from "./presenters/NotificationPresenter.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  // Render halaman pertama saat load
  await app.renderPage();

  // Daftarkan Service Worker
  const registration = await registerServiceWorker();

  if (registration) {
    // Inisialisasi NotificationPresenter jika SW berhasil
    const notificationPresenter = new NotificationPresenter({
      serviceWorkerRegistration: registration,
    });
  }

  // SPA Navigation: listen hashchange untuk navigasi antar halaman
  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});