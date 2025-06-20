import FavoriteDB from "../data/favorite-idb";

export default class FavoriteModel {
  /**
   * Mengambil semua cerita favorit dari IndexedDB.
   * @returns {Promise<Array>} Daftar cerita favorit.
   */
  async getAllFavorites() {
    return await FavoriteDB.getAll();
  }

  /**
   * Menghapus cerita favorit berdasarkan ID.
   * @param {string} id - ID cerita yang ingin dihapus dari favorit.
   * @returns {Promise<void>}
   */
  async removeFavorite(id) {
    return await FavoriteDB.delete(id);
  }

  /**
   * Mengecek apakah suatu cerita sudah difavoritkan.
   * @param {string} id - ID cerita.
   * @returns {Promise<boolean>}
   */
  async isFavorited(id) {
    return await FavoriteDB.isFavorited(id);
  }
}