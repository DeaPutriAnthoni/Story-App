import { getStoryDetail } from "../../data/api.js";
import { parseActivePathname } from "../../routes/url-parser.js";

class DetailPresenter {
  _view = null;
  _storyId = null;
  _story = null;

  constructor({ view }) {
    this._view = view;
    this._storyId = this._getStoryIdFromUrl();

    if (!this._storyId) {
      console.error("DetailPresenter: Story ID not found in URL.");
      this._view.showError("ID cerita tidak ditemukan di URL.");
    }
  }

  _getStoryIdFromUrl() {
    const urlParams = parseActivePathname();
    return urlParams.id;
  }

  async getStoryData() {
    if (!this._storyId) {
      this._view.renderError(
        "Tidak ada ID cerita yang valid untuk ditampilkan."
      );
      return null;
    }

    this._view.renderLoading();
    try {
      const storyData = await getStoryDetail(this._storyId);
      this._story = storyData;

      if (storyData) {
        this._view.renderStory(storyData);
      } else {
        this._view.renderError("Cerita tidak ditemukan.");
      }

      return storyData;
    } catch (error) {
      console.error(
        `DetailPresenter: Error fetching story data for ID ${this._storyId}`,
        error
      );
      let errorMessage = `Gagal memuat detail cerita: ${error.message}`;
      if (error.message.includes("login")) {
        errorMessage = `
          <p>Anda perlu <a href="#/login">login</a> atau sesi Anda telah habis.</p>
        `;
      }
      this._view.renderError(errorMessage);
      return null;
    }
  }

  getCurrentStory() {
    return this._story;
  }
}

export default DetailPresenter;