import { isLoggedIn } from "../../data/api.js";
import RegisterPresenter from "../../presenters/auth/register-presenter.js";

export default class RegisterPage {
  async render() {
    if (isLoggedIn()) {
      window.location.hash = "/";
      return "";
    }

    return `
      <section class="container">
        <h1 class="page-title">Register</h1>
        <form id="registerForm" class="form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required minlength="8" />
          </div>

          <div class="form-submit">
            <button type="submit">Register</button>
            <div id="loading-indicator" style="display: none;" aria-label="Memproses pendaftaran">Memproses...</div>
          </div>
        </form>
        <div id="registerError" class="error-message" aria-live="assertive" style="display: none;"></div>
        <p class="login-link">Sudah punya akun? <a href="#/login">Login disini</a></p>
      </section>
    `;
  }

  async afterRender() {
    if (isLoggedIn()) return;

    const form = document.getElementById("registerForm");
    const errorContainer = document.getElementById("registerError");
    const loadingIndicator = form.querySelector("#loading-indicator");
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      errorContainer.textContent = "";
      errorContainer.style.display = "none";

      RegisterPresenter.handleRegister({
        name,
        email,
        password,
        onSuccess: () => {
          alert("Pendaftaran berhasil! Silakan login.");
          window.location.hash = "#/login";
        },
        onError: (message) => {
          errorContainer.innerText = message;
          errorContainer.style.display = "block";
        },
        onLoading: (isLoading) => {
          submitButton.disabled = isLoading;
          loadingIndicator.style.display = isLoading ? "inline" : "none";
        },
      });
    });
  }

  cleanup() {
    console.log("RegisterPage cleanup executed.");
  }
}