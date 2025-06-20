import FavoriteView from "./favorite-view.js";
import FavoritePresenter from "../../presenters/favorite/favorite-presenter.js";

const FavoritePage = {
  async render() {
    return `
      <section id="app"></section>
    `;
  },

  async afterRender() {
    const favoriteView = new FavoriteView("#app");
    const favoritePresenter = new FavoritePresenter({ view: favoriteView });

    await favoritePresenter.initialize(); // cukup ini, tidak perlu .setView()
  },
};

export default FavoritePage;