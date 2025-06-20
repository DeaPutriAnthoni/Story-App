import {
  createFavoriteStoryItemTemplate,
  createErrorTemplate,
  createLoaderTemplate,
} from "../../utils/template-creator.js";

export default class FavoriteView {
  constructor(containerSelector) {
    this._container = document.querySelector(containerSelector);
    if (!this._container) {
      throw new Error(`Container "${containerSelector}" not found`);
    }
  }

  setPresenter(presenter) {
    this._presenter = presenter;
  }

  renderInitialState() {
    this._container.innerHTML = `
      <section class="container">
        <h1 class="page-title">Cerita Favorit</h1>
        <div id="favorite-stories" class="story-list">${createLoaderTemplate()}</div>
      </section>
    `;
    this._storiesContainer = this._container.querySelector("#favorite-stories");
  }

  updateUI({ loading = false, favorites = [], error = null }) {
    console.log("FavoriteView.updateUI - favorites:", favorites);

    if (loading) {
      this._storiesContainer.innerHTML = createLoaderTemplate();
      return;
    }

    if (error) {
      this._storiesContainer.innerHTML = createErrorTemplate(error);
      return;
    }

    if (favorites.length === 0) {
      this._storiesContainer.innerHTML = `
        <p style="text-align: center; margin-top: 16px;">Belum ada cerita favorit.</p>
      `;
      return;
    }

    this._storiesContainer.innerHTML = ""; // Clear dulu

    favorites.forEach((story) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        createFavoriteStoryItemTemplate(story),
        "text/html"
      );
      const article = doc.body.firstElementChild;

      if (!article) {
        console.error("Gagal parsing template untuk story:", story);
        return;
      }

      // Animasi
      article.classList.add("fade-in");

      // ❌ Tidak perlu lagi pasang event listener di sini.
      // FavoritePresenter._setupDeleteEventListener sudah handle semua tombol .delete-button secara global.

      this._storiesContainer.appendChild(article);
    });
  }

  cleanup() {
    if (this._storiesContainer) {
      this._storiesContainer.innerHTML = "";
    }
  }
}