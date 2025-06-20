import FavoriteIdb from "../../data/favorite-idb.js";

export default class FavoritePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async initialize() {
    this._view.renderInitialState();

    try {
      await this.loadFavorites();
      this._setupDeleteEventListener();
    } catch (error) {
      console.error("FavoritePresenter: Error loading favorites:", error);
      this._view.updateUI({
        loading: false,
        favorites: [],
        error: "Gagal memuat data favorit.",
      });
    }
  }

  async loadFavorites() {
    this._view.updateUI({ loading: true });

    const favorites = await FavoriteIdb.getAll();

    console.log("FavoritePresenter: Favorites loaded:", favorites);

    this._view.updateUI({ loading: false, favorites, error: null });
  }

  async deleteFavorite(storyId) {
    try {
      await FavoriteIdb.delete(storyId);
      console.log(
        `FavoritePresenter: Story ID ${storyId} dihapus dari favorit.`
      );

      // Opsional delay kecil biar IndexedDB settle (50 ms)
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Panggil loadFavorites, tapi aman kalau error
      try {
        await this.loadFavorites();
      } catch (err) {
        console.warn("Warning: Gagal refresh list setelah delete:", err);
        // Tidak perlu alert disini, karena delete sudah berhasil
      }
    } catch (error) {
      console.error("FavoritePresenter: Error deleting favorite:", error);
      alert("Gagal menghapus favorite.");
    }
  }

  _setupDeleteEventListener() {
    const container = document.querySelector("#favorite-stories");
    if (!container) return;

    container.addEventListener("click", async (event) => {
      const deleteButton = event.target.closest(".delete-button");
      if (deleteButton) {
        event.preventDefault();
        event.stopPropagation();

        const storyId = deleteButton.getAttribute("data-id");

        // Konfirmasi opsional (supaya UX lebih baik)
        const confirmDelete = confirm(
          "Apakah Anda yakin ingin menghapus cerita ini dari favorit?"
        );
        if (!confirmDelete) return;

        if (storyId) {
          await this.deleteFavorite(storyId);
        } else {
          console.warn(
            "FavoritePresenter: Story ID tidak ditemukan di tombol Hapus."
          );
        }
      }
    });
  }
}