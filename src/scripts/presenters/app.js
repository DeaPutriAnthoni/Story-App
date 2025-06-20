import { getActivePathname, getRoute } from "../routes/url-parser";
import routes from "../routes/routes";
import { isLoggedIn, logout } from "../data/api"; // Import fungsi isLoggedIn dan logout
import {
  createSubscribePushButtonTemplate,
  createUnsubscribePushButtonTemplate,
} from "../views/components/push-notification-button";

import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from "../utils/NotificationHelper";

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this._content = content;
    this._drawerButton = drawerButton;
    this._navigationDrawer = navigationDrawer;

    // Dapatkan referensi ke elemen <li> menu
    this._loginMenu = document.getElementById("login-menu");
    this._registerMenu = document.getElementById("register-menu");
    this._logoutMenu = document.getElementById("logout-menu");

    this._currentPageInstance = null; // Untuk menyimpan page yang sedang aktif

    this._initialAppShell();

    window.location.hash = "/";

    this._setupLogoutListener(); // Setup listener untuk tombol Logout
    this._updateNavigationBasedOnLogin(); // Periksa status login awal
  }

  _setupLogoutListener() {
    // Pastikan elemen logout-menu dan link di dalamnya ada
    const logoutLink = this._logoutMenu
      ? this._logoutMenu.querySelector("a")
      : null;
    if (logoutLink) {
      logoutLink.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah navigasi default '#'
        logout(); // Panggil fungsi logout dari api.js
        this._updateNavigationBasedOnLogin(); // Perbarui navigasi setelah logout
        window.location.hash = "/"; // Redirect ke halaman beranda setelah logout
        window.location.reload(); // Reload halaman untuk memastikan state bersih dan navigasi diperbarui
      });
    }
  }

  _initialAppShell() {
    this._drawerButton.addEventListener("click", () => {
      this._navigationDrawer.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (
        !this._navigationDrawer.contains(event.target) &&
        !this._drawerButton.contains(event.target)
      ) {
        this._navigationDrawer.classList.remove("open");
      }
    });
  }

  _updateNavigationBasedOnLogin() {
    if (isLoggedIn()) {
      // Sembunyikan Login dan Register, tampilkan Logout
      if (this._loginMenu) this._loginMenu.style.display = "none";
      if (this._registerMenu) this._registerMenu.style.display = "none";
      if (this._logoutMenu) this._logoutMenu.style.display = "list-item"; // Tampilkan sebagai list item
    } else {
      // Tampilkan Login dan Register, sembunyikan Logout
      if (this._loginMenu) this._loginMenu.style.display = "list-item"; // Tampilkan sebagai list item
      if (this._registerMenu) this._registerMenu.style.display = "list-item"; // Tampilkan sebagai list item
      if (this._logoutMenu) this._logoutMenu.style.display = "none";
    }
  }

  async _setupPushNotificationTools() {
    const toolsContainer = document.getElementById("push-notification-tools");
    if (!toolsContainer) return;

    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      toolsContainer.innerHTML = createUnsubscribePushButtonTemplate();
      document
        .getElementById("unsubscribe-push-button")
        .addEventListener("click", async () => {
          await unsubscribe();
          this._setupPushNotificationTools(); // refresh tombol
        });
    } else {
      toolsContainer.innerHTML = createSubscribePushButtonTemplate();
      document
        .getElementById("subscribe-push-button")
        .addEventListener("click", async () => {
          await subscribe();
          this._setupPushNotificationTools(); // refresh tombol
        });
    }
  }

  async renderPage() {
    const pathname = getActivePathname();
    const routeKey = getRoute(pathname);
    const route = routes[routeKey] || routes["*"]; // FINAL

    if (!route) {
      this._content.innerHTML = "<h2>404 - Page Not Found</h2>";
      return;
    }

    // Cleanup halaman sebelumnya jika ada
    if (this._currentPageInstance?.cleanup) {
      this._currentPageInstance.cleanup();
    }

    const pageInstance = typeof route === "function" ? new route() : route;

    this._currentPageInstance = pageInstance;

    const pageHtml = await pageInstance.render(); // string HTML
    this._content.innerHTML = pageHtml;

    if (pageInstance.afterRender) {
      await pageInstance.afterRender();
    }

    // Perbarui navigasi setelah halaman di-render (penting setelah login/logout)
    this._updateNavigationBasedOnLogin();
  }
}

export default App;