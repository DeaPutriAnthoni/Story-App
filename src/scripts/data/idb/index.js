import { openDB } from "idb";

const DATABASE_NAME = "story-app-db"; // Nama database yang konsisten
const DATABASE_VERSION = 3;

const OBJECT_STORE_FAVORITE = "favorites";
const OBJECT_STORE_FEEDBACK = "feedbacks";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        console.log("Running upgrade function. Current object stores:", database.objectStoreNames);
        if (!database.objectStoreNames.contains(OBJECT_STORE_FAVORITE)) {
            console.log("Creating object store:", OBJECT_STORE_FAVORITE);
            database.createObjectStore(OBJECT_STORE_FAVORITE, { keyPath: "id" });
        }

        if (!database.objectStoreNames.contains(OBJECT_STORE_FEEDBACK)) {
            console.log("Creating object store:", OBJECT_STORE_FEEDBACK);
            const feedbackStore = database.createObjectStore(OBJECT_STORE_FEEDBACK, {
                keyPath: "storyId", // KeyPath untuk object store feedback adalah 'storyId'
            });
            feedbackStore.createIndex("storyId", "storyId", { unique: false }); // Index pada storyId
            console.log("Object store created:", OBJECT_STORE_FEEDBACK);
        }
        console.log("Upgrade function finished. Object stores:", database.objectStoreNames);
    },
});

export default dbPromise;
export { OBJECT_STORE_FAVORITE, OBJECT_STORE_FEEDBACK };