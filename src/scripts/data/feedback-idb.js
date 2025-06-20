import dbPromise, { OBJECT_STORE_FEEDBACK } from "../data/idb/index"; // Menggunakan dbPromise dan nama dari index.js

const FeedbackIdb = {
  async addFeedback(storyId, content) {
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_FEEDBACK, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_FEEDBACK);

    const newFeedback = {
      content: content,
      timestamp: new Date().toISOString(),
    };

    const existingRecord = await store.get(storyId);

    if (existingRecord) {
      existingRecord.feedbacks = existingRecord.feedbacks || [];
      existingRecord.feedbacks.push(newFeedback);
      await store.put(existingRecord);
    } else {
      await store.add({ storyId: storyId, feedbacks: [newFeedback] });
    }
    await tx.done;
  },

  async getFeedbacks(storyId) {
    const db = await dbPromise;
    const record = await db.get(OBJECT_STORE_FEEDBACK, storyId);
    return record ? record.feedbacks : [];
  },

  async deleteFeedbacks(storyId) {
    const db = await dbPromise;
    await db.delete(OBJECT_STORE_FEEDBACK, storyId);
  },
};

export default FeedbackIdb;