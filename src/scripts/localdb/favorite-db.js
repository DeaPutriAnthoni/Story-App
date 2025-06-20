import { openDB } from "idb";

const DB_NAME = "story-app-db";
const STORE_NAME = "favorites";
const DB_VERSION = 3; // Tetap versi 2 jika tidak ada perubahan skema signifikan

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

const FavoriteDB = {
  async get(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async put(story) {
    if (!story || !story.id) return; // Pastikan ada objek cerita dan ID
    return (await dbPromise).put(STORE_NAME, story); // Simpan seluruh objek cerita
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async isFavorited(id) {
    const story = await this.get(id);
    return !!story;
  },
};

export default FavoriteDB;