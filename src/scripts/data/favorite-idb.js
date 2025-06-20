import { openDB } from "idb";
import { OBJECT_STORE_FAVORITE } from "../data/idb/index.js"; // atau globals/db-constants jika kamu pakai

const DB_NAME = "story-app-db";
const DB_VERSION = 3;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_FAVORITE)) {
      db.createObjectStore(OBJECT_STORE_FAVORITE, { keyPath: "id" });
    }
  },
});

const FavoriteDB = {
  async get(id) {
    return (await dbPromise).get(OBJECT_STORE_FAVORITE, id);
  },

  async getAll() {
    return (await dbPromise).getAll(OBJECT_STORE_FAVORITE);
  },

  async put(story) {
    if (!story.id) return;
    return (await dbPromise).put(OBJECT_STORE_FAVORITE, story);
  },

  async delete(id) {
    return (await dbPromise).delete(OBJECT_STORE_FAVORITE, id);
  },

  async isFavorited(id) {
    const story = await this.get(id);
    return !!story;
  },
};

export default FavoriteDB;