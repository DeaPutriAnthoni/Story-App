import { openDB } from "idb";

const DB_NAME = "story-app-db";
const STORE_NAME = "feedbacks";
const DB_VERSION = 3;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

const FeedbackDB = {
  async get(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
  async put(id, feedback) {
    if (!id || !feedback) return;
    const existing = await FeedbackDB.get(id);
    const updated = existing ? [...existing.feedbacks, feedback] : [feedback];
    return (await dbPromise).put(STORE_NAME, { id, feedbacks: updated });
  },
};

export default FeedbackDB;