export default class HomeView {
  constructor(containerSelector) {
    this._containerSelector = containerSelector;
    this._container = document.querySelector(containerSelector);
    this._mapInstance = null;
  }

  renderInitialState(isLoggedIn, userName) {
    if (!this._container) return;

    this._container.innerHTML = `
    <h2 style="text-align: center; font-size: 2rem; color: #FFFFFFFF; font-weight: bold; margin-top: 20px;">
      Daftar Cerita
    </h2>
    ${
      isLoggedIn
        ? `<p style="text-align: center; font-size: 1.2rem; color: #FFFFFFFF;">
             Selamat datang, <strong style="color: #2980b9;">${
               userName || "Pengguna"
             }</strong>!
           </p>
           <div id="story-list-container"></div>
           <div id="map-display" class="map-container"></div>`
        : `<p style="text-align: center; font-size: 1.2rem; color: #FFFFFFFF;">
             Silakan <a href="#/login">login</a> untuk melihat cerita.
           </p>`
    }
  `;
  }

  updateUI({
    loading = false,
    stories = null,
    mapData = null,
    error = "",
  } = {}) {
    const storyListContainer = this._container.querySelector(
      "#story-list-container"
    );

    if (!storyListContainer) return;

    if (loading) {
      storyListContainer.innerHTML = `
        <div id="loading-indicator" class="loading-indicator">
          <p>Memuat cerita...</p>
          <div class="loader"></div>
        </div>
      `;
      return;
    }

    if (error) {
      storyListContainer.innerHTML = `
        <div class="error-message">
          <p>${error}</p>
        </div>
      `;
      return;
    }

    if (stories) {
      if (stories.length === 0) {
        storyListContainer.innerHTML = `<p>Tidak ada cerita yang ditemukan.</p>`;
        return;
      }

      const storyListHTML = stories
        .map((story) => this._createStoryItemHTML(story))
        .join("");

      storyListContainer.innerHTML = `
        <div class="story-list">
          ${storyListHTML}
        </div>
      `;

      // ✅ Tambahkan event listener ke masing-masing story-item
      const storyItems = storyListContainer.querySelectorAll(".story-item");
      storyItems.forEach((item) => {
        item.addEventListener("click", () => {
          const storyId = item.getAttribute("data-id");
          if (storyId) {
            window.location.hash = `#/detail/${storyId}`;
          }
        });
      });
    }

    if (mapData && mapData.length > 0) {
      this._renderMap(mapData);
    }
  }

  _createStoryItemHTML(story) {
    const storyDate = new Date(story.createdAt).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
      <article class="story-item" data-id="${
        story.id
      }" style="cursor: pointer;">
        <img src="${story.photoUrl}" alt="Foto dari ${story.name || "Anonim"}">
        <h3>${story.name || "Anonim"}</h3>
        <p>${story.description}</p>
        <p>${storyDate}</p>
      </article>
    `;
  }

  _renderMap(mapData) {
    console.log("Rendering map with data:", mapData);

    const mapContainer = document.querySelector("#map-display");
    if (!mapContainer) return;

    // Hancurkan peta sebelumnya jika ada
    if (this._mapInstance) {
      this._mapInstance.remove();
      this._mapInstance = null;
    }

    // Bersihkan DOM map container
    mapContainer.innerHTML = "";
    mapContainer._leaflet_id = null;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "images/leaflet/marker-icon-2x.png",
      iconUrl: "images/leaflet/marker-icon.png",
      shadowUrl: "images/leaflet/marker-shadow.png",
    });

    // Buat peta baru
    this._mapInstance = L.map(mapContainer).setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this._mapInstance);

    mapData.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this._mapInstance)
          .bindPopup(
            `<strong>${story.name || "Anonim"}</strong><br>${story.description}`
          );
      }
    });
  }

  cleanup() {
    console.log("HomeView cleanup executed.");

    if (this._mapInstance) {
      this._mapInstance.remove();
      this._mapInstance = null;
    }

    if (this._container) {
      this._container.innerHTML = "";
    }
  }
}