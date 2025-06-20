import DetailPresenter from "../../presenters/detail/detail-presenter.js";
import FavoritePresenter from "../../presenters/favorite-button-presenter.js";
import FeedbackPresenter from "../../presenters/feedback-presenter.js";

import {
  createStoryDetailTemplate,
  createLoaderTemplate,
  createErrorTemplate,
} from "../../utils/template-creator.js";

import MapInitiator from "../../utils/map-initiator.js";
import { isLoggedIn } from "../../data/api.js";

export default class DetailPage {
  _presenter = null;
  _favoritePresenter = null;
  _feedbackPresenter = null;
  _mainContentContainer = null;
  _mapInstance = null;

  async render() {
    if (!isLoggedIn()) {
      return createErrorTemplate(
        'Anda perlu <a href="#/login">login</a> untuk melihat detail cerita. Silakan login dan coba lagi.'
      );
    }
    return createLoaderTemplate();
  }

  async afterRender() {
    this._mainContentContainer = document.querySelector("#main-content");
    if (!this._mainContentContainer) {
      console.error("DetailPage: Main content container not found.");
      return;
    }

    if (!isLoggedIn()) {
      console.warn("DetailPage: User not logged in.");
      return;
    }

    this._presenter = new DetailPresenter({ view: this });
    const storyData = await this._presenter.getStoryData();

    // Render tampilan detail cerita setelah mendapatkan data
    if (storyData) {
      this.renderStory(storyData);

      // Inisialisasi MAP
      if (storyData.lat && storyData.lon) {
        const mapContainerId = "story-detail-map";
        const mapElement = document.getElementById(mapContainerId);
        if (mapElement) {
          setTimeout(() => {
            this._mapInstance = MapInitiator.initDisplayMap(mapContainerId, [
              storyData,
            ]);
            if (!this._mapInstance) {
              mapElement.innerHTML = createErrorTemplate(
                "Gagal memuat peta lokasi cerita."
              );
            }
          }, 100);
        }
      }

      // Inisialisasi FAVORIT
      const favoriteContainer = document.getElementById(
        "favoriteButtonContainer" // Pastikan ID ini sesuai dengan template
      );
      if (favoriteContainer && storyData?.id) {
        this._favoritePresenter = new FavoritePresenter({
          story: storyData, // Kirim seluruh objek storyData
          buttonContainer: favoriteContainer,
        });
        // Mengubah .init() menjadi .initialize() agar sesuai dengan FavoritePresenter
        await this._favoritePresenter.initialize();
      }

      // Inisialisasi FEEDBACK
      const feedbackForm = document.getElementById("feedback-form");
      const feedbackInput = document.getElementById("feedback-input");
      const feedbackList = document.getElementById("feedback-list");

      if (feedbackForm && feedbackInput && feedbackList && storyData?.id) {
        this._feedbackPresenter = new FeedbackPresenter({
          id: storyData.id,
          formElement: feedbackForm,
          inputElement: feedbackInput,
          listContainer: feedbackList,
        });
        await this._feedbackPresenter.init();
      }
    } else {
      this.renderError("Gagal memuat detail cerita.");
    }
  }

  renderStory(story) {
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = createStoryDetailTemplate(story);

      const pageElement =
        this._mainContentContainer.querySelector(".story-detail-page");
      if (pageElement) {
        pageElement.focus();
      }
    } else {
      console.error(
        "DetailPage (renderStory): Main content container is null."
      );
    }
  }

  renderLoading() {
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = createLoaderTemplate();
    }
  }

  renderError(message) {
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = createErrorTemplate(message);
    }
  }

  cleanup() {
    console.log("DetailPage cleanup executed.");
    if (this._mapInstance) {
      MapInitiator.removeMap("story-detail-map");
      this._mapInstance = null;
    }
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = "";
    }
    this._presenter = null;
    this._favoritePresenter = null;
    this._feedbackPresenter = null;
    this._mainContentContainer = null;
  }
}