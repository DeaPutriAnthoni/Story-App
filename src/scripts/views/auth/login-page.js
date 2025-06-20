import LoginPresenter from "../../presenters/auth/login-presenter.js";

export default class LoginPage {
  constructor() {
    this.presenter = null;
  }

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Login</h1>
        <form id="loginForm" class="form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required />
          </div>

          <div class="form-submit">
            <button type="submit">Login</button>
            <div id="loading-indicator" style="display: none;" aria-label="Memproses login">Memproses...</div>
          </div>
        </form>
        <div id="loginError" class="error-message" aria-live="assertive" style="display: none;"></div>
        <p class="register-link">Belum punya akun? <a href="#/register">Daftar disini</a></p>
      </section>
    `;
  }

  async afterRender() {
    this.presenter = new LoginPresenter({ view: this });

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      this.presenter.loginUser({ email, password });
    });
  }

  showLoading() {
    document.getElementById("loading-indicator").style.display = "inline";
    document.querySelector('button[type="submit"]').disabled = true;
  }

  hideLoading() {
    document.getElementById("loading-indicator").style.display = "none";
    document.querySelector('button[type="submit"]').disabled = false;
  }

  showError(message) {
    const errorContainer = document.getElementById("loginError");
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  }

  clearError() {
    const errorContainer = document.getElementById("loginError");
    errorContainer.textContent = "";
    errorContainer.style.display = "none";
  }

  onLoginSuccess() {
    alert("Login berhasil!");
    // Ganti window.location.hash = "/" dengan penambahan parameter refresh
    window.location.hash = "/?refresh=true"; // Ini akan memicu app.js untuk merender ulang HomePage
  }

  cleanup() {
    const form = document.getElementById("loginForm");
    if (form) {
      // Lebih baik hapus event listener secara spesifik jika memungkinkan
      // Atau pastikan presenter yang menghandle event listener memiliki cleanup
      form.removeEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        this.presenter.loginUser({ email, password });
      });
    }
    this.presenter = null;
    console.log("LoginPage cleanup executed.");
  }
}