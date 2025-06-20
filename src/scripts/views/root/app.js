import routes from "../../routes/routes.js";
import { getActiveRoute } from "../../routes/url-parser.js";
import { isLoggedIn, logout } from "../../data/api.js"; // Import fungsi isLoggedIn dan logout

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #activePage = null;

  #loginMenuItem = null;
  #registerMenuItem = null;
  #logoutMenuItem = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#loginMenuItem = document.getElementById("login-menu");
    this.#registerMenuItem = document.getElementById("register-menu");
    this.#logoutMenuItem = document.getElementById("logout-menu");

    this._setupDrawer();
    this._setupNavigationEventListeners();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }
    });

    this.#navigationDrawer.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        this.#navigationDrawer.classList.remove("open");
      }
    });
  }

  _setupNavigationEventListeners() {
    // Setup listener untuk tombol logout
    if (this.#logoutMenuItem) {
      // Gunakan addEventListener langsung pada link di dalamnya
      const logoutLink = this.#logoutMenuItem.querySelector("a");
      if (logoutLink) {
        logoutLink.addEventListener("click", async (event) => {
          event.preventDefault(); // Penting: cegah refresh default link #
          await logout(); // Tunggu proses logout selesai
          window.location.hash = "#/login"; // Redirect ke halaman login
        });
      }
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url]; // Mendapatkan instance kelas halaman (misal: HomePage)

    this._updateNavigationMenu();

    if (!page) {
      // Jika rute tidak ditemukan
      this.#content.innerHTML =
        '<section class="container"><h1 class="page-title" style="color: var(--danger);">404 - Halaman Tidak Ditemukan</h1></section>';
      console.error(`No route found for ${url}`);
      this._updateNavigationMenu(); // Panggil lagi meskipun rute tidak ada
      return;
    }

    if (this.#activePage && typeof this.#activePage.cleanup === "function") {
      console.log(`Calling cleanup for ${this.#activePage.constructor.name}`);
      this.#activePage.cleanup();
    }

    // --- VIEW TRANSITION API ---
    if (document.startViewTransition) {
      console.log(`Starting view transition for ${url}`);
      document.startViewTransition(async () => {
        await this._loadPageContent(page);
      });
    } else {
      console.log(
        `View transition not supported, loading page directly for ${url}`
      );
      await this._loadPageContent(page);
    }

    // Simpan halaman yang sedang aktif
    this.#activePage = page;
  }

  async _loadPageContent(page) {
    try {
      // Render konten HTML halaman
      this.#content.innerHTML = await page.render();

      // Panggil metode afterRender halaman jika ada
      if (typeof page.afterRender === "function") {
        await page.afterRender();
      }

      this._updateNavigationMenu(); // Panggil lagi setelah afterRender

      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1"); // Buat elemen bisa difokuskan
        mainContent.focus(); // Pindahkan fokus ke konten utama
        mainContent.removeAttribute("tabindex"); // Hapus tabindex agar tidak masuk urutan tab normal
      }

      window.scrollTo(0, 0);

      // Tutup drawer setelah navigasi (jika masih terbuka di mobile)
      if (this.#navigationDrawer.classList.contains("open")) {
        this.#navigationDrawer.classList.remove("open");
      }
    } catch (error) {
      console.error("Error rendering page content:", error);
      this.#content.innerHTML =
        '<section class="container"><h1 style="color: var(--danger); text-align: center;">Terjadi Kesalahan Saat Memuat Halaman</h1></section>';
      this._updateNavigationMenu(); // Panggil lagi untuk konsistensi
    }
  }

  _updateNavigationMenu() {
    const loggedIn = isLoggedIn(); // Cek status login menggunakan fungsi dari api.js

    // Pastikan elemen menu ditemukan sebelum mencoba mengubah display
    if (this.#loginMenuItem && this.#registerMenuItem && this.#logoutMenuItem) {
      if (loggedIn) {
        // Jika sudah login, sembunyikan Login & Register, tampilkan Logout
        this.#loginMenuItem.style.display = "none";
        this.#registerMenuItem.style.display = "none";
        this.#logoutMenuItem.style.display = "list-item"; // Tampilkan sebagai list item
      } else {
        // Jika belum login, tampilkan Login & Register, sembunyikan Logout
        this.#loginMenuItem.style.display = "list-item";
        this.#registerMenuItem.style.display = "list-item";
        this.#logoutMenuItem.style.display = "none"; // Sembunyikan logout
      }
    } else {
      console.warn(
        "Navigation menu items not found in the DOM. Ensure index.html has correct IDs."
      );
    }
  }
}

export default App;