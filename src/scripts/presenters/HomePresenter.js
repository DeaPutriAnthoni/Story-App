import HomeModel from "../data/model/HomeModel.js"; // Import Model

export default class HomePresenter {
  #view = null;
  #model = null;
  #mapInstance = null;
  #pollingIntervalId = null;

  /**
   * @param {object} options
   * @param {object} options.view - Instance of HomeView.
   * @param {object} options.model - Instance of HomeModel.
   */
  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Method yang dipanggil oleh home-page.js setelah View dirender
  async initialize() {
    const isLoggedIn = this.#model.isUserLoggedIn();
    const userName = this.#model.getCurrentUserName();

    // ✅ Cek flag forceRefreshStories di localStorage
    const forceRefreshFromStorage =
      localStorage.getItem("forceRefreshStories") === "true";
    if (forceRefreshFromStorage) {
      console.log("HomePresenter: Detected forceRefreshStories flag.");
      localStorage.removeItem("forceRefreshStories");
    }

    console.log(
      "HomePresenter initialized. Is logged in?",
      isLoggedIn,
      "User:",
      userName
    );

    this.#view.renderInitialState(isLoggedIn, userName);

    // ✅ Load stories kalau login / forceRefresh
    if (isLoggedIn || forceRefreshFromStorage) {
      console.log("Logged in or forceRefreshFromStorage → load stories");
      await this.loadStoriesAndMap();
    }

    // ✅ Setup polling interval → simpan pollingIntervalId
    this.#pollingIntervalId = setInterval(async () => {
      console.log("Checking for new data...");
      await this.loadStoriesAndMap();
    }, 30000);
  }

  async loadStoriesAndMap() {
    console.log("Attempting to load stories and map...");
    try {
      // Tampilkan loading state
      this.#view.updateUI({ loading: true });

      // Ambil data cerita dari model
      const stories = await this.#model.fetchStories(1, 20, 1);
      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon
      );

      console.log("Stories fetched:", stories);

      // Perbarui UI dengan cerita dan data peta
      this.#view.updateUI({
        stories,
        mapData: storiesWithLocation,
      });
    } catch (error) {
      console.error("HomePresenter: Error loading stories and map:", error);

      this.#view.updateUI({
        error: error.message,
      });

      if (
        error.message.includes("token") ||
        error.message.includes("login") ||
        error.message.includes("Sesi Anda telah habis")
      ) {
        console.log(
          "HomePresenter: Authentication error, clearing token and navigating to login."
        );
        this.#model.clearUserData();
        window.location.hash = "#/login";
      }
    }
  }

  cleanup() {
    console.log("HomePresenter cleanup executed.");
    this.#view.cleanup();
    this.#mapInstance = null;

    // ✅ Clear polling interval saat cleanup
    if (this.#pollingIntervalId) {
      clearInterval(this.#pollingIntervalId);
      this.#pollingIntervalId = null;
    }
  }
}