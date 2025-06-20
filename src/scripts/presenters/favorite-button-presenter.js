import FavoriteIdb from "../data/favorite-idb.js";
import {
  createFavoriteButton,
  createFavoritedButton,
} from "../utils/template-creator.js";

export default class FavoriteButtonPresenter {
  /**
   * @param {object} options
   * @param {object} options.story - Objek cerita lengkap yang akan difavoritkan/dihapus.
   * @param {HTMLElement} options.buttonContainer - Elemen DOM tempat tombol favorit akan dirender.
   */
  constructor({ story, buttonContainer }) {
    this._story = story;
    this._id = story ? story.id : null;
    this._container = buttonContainer;
  }

  /**
   * Menginisialisasi presenter, memeriksa status favorit, dan merender tombol.
   */
  async initialize() {
    if (this._id) {
      const isFavorited = await FavoriteIdb.isFavorited(this._id);
      this._renderButton(isFavorited);
    } else {
      console.warn(
        "FavoriteButtonPresenter: Story ID is not available. Cannot initialize button."
      );
      this._container.innerHTML =
        '<p class="text-red-500">Tombol favorit tidak tersedia.</p>';
    }
  }

  /**
   * Merender tombol favorit atau sudah difavoritkan berdasarkan status.
   * @param {boolean} isFavorited - Status favorit cerita.
   */
  _renderButton(isFavorited) {
    this._container.innerHTML = isFavorited
      ? createFavoritedButton()
      : createFavoriteButton();

    const button = this._container.querySelector("button");
    if (button) {
      button.addEventListener("click", async () => {
        if (this._story && this._id) {
          const currentlyFavorited = await FavoriteIdb.isFavorited(this._id);

          if (currentlyFavorited) {
            await FavoriteIdb.delete(this._id);
            console.log(`Story ID ${this._id} dihapus dari favorit.`);
          } else {
            await FavoriteIdb.put({
              id: this._story.id,
              name: this._story.name || "Anonim",
              description: this._story.description || "",
              photoUrl:
                this._story.photoUrl && this._story.photoUrl !== "undefined"
                  ? this._story.photoUrl
                  : "./images/placeholder.png",
              createdAt: this._story.createdAt || new Date().toISOString(),
              lat: this._story.lat ?? null,
              lon: this._story.lon ?? null,
            });
            console.log(`Story ID ${this._id} ditambahkan ke favorit.`);
          }

          // Cek ulang status favorit setelah operasi selesai → supaya button update 100% akurat
          const updatedFavorited = await FavoriteIdb.isFavorited(this._id);
          this._renderButton(updatedFavorited);
        } else {
          console.error(
            "FavoriteButtonPresenter: Story data or ID is missing for click event."
          );
        }
      });
    } else {
      console.error(
        "FavoriteButtonPresenter: Button element not found after rendering."
      );
    }
  }
}