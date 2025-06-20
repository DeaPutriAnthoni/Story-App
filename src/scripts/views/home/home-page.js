import HomeView from "../HomeView.js";
import HomeModel from "../../data/model/HomeModel.js";
import HomePresenter from "../../presenters/HomePresenter.js";

export default class HomePage {
  #homeView = null;
  #homeModel = null;
  #homePresenter = null;
  #hashChangeListener = null;

  async render() {
    return `
      <div id="home-page-container"></div>
    `;
  }

  async afterRender() {
    console.log("HomePage afterRender executed");

    this.#homeView = new HomeView("#home-page-container");
    this.#homeModel = new HomeModel();
    this.#homePresenter = new HomePresenter({
      view: this.#homeView,
      model: this.#homeModel,
    });

    await this.#homePresenter.initialize();

    this.#hashChangeListener = this._handleHashChange.bind(this);
    window.addEventListener("hashchange", this.#hashChangeListener);

    console.log("HomePage MVP components initialized.");
  }

  _handleHashChange() {
    // Memperhatikan hash tanpa query string
    // Jika navigasi menjauh dari halaman home (termasuk hash dengan query string)
    if (window.location.hash.split("?")[0] !== "#/") {
      console.log("Navigating away from #/, initiating cleanup.");
      this.cleanup();
    } else {
      console.log("Navigated back to #/, hashchange listener persists.");
      // Jika navigasi kembali ke home dengan atau tanpa query string,
      // HomePresenter.initialize() akan dipanggil ulang oleh router App.js
      // dan menangani logika refresh.
    }
  }

  cleanup() {
    console.log("HomePage cleanup executed.");

    if (this.#homePresenter) {
      this.#homePresenter.cleanup();
      this.#homePresenter = null;
    }

    this.#homeView = null;
    this.#homeModel = null;

    if (this.#hashChangeListener) {
      window.removeEventListener("hashchange", this.#hashChangeListener);
      this.#hashChangeListener = null;
    }

    const container = document.querySelector("#home-page-container");
    if (container) {
      container.innerHTML = "";
    }
  }
}