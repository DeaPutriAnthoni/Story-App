const createStoryItemTemplate = (story) => {
  const storyDate = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return `
    <article class="story-item" tabindex="0" data-story-id="${story.id}">
      <a href="#/detail/${
        story.id
      }" class="story-item__link-overlay" aria-label="Lihat detail cerita ${
    story.name || "Anonim"
  }"></a>
      <img class="story-item__image"
           src="${story.photoUrl || "./images/placeholder.png"}"
           alt="Foto cerita dari ${story.name || "Anonim"}"
           width="100%" height="200">
      <div class="story-item__content">
        <h3 class="story-item__name">
          <a href="#/detail/${story.id}">${story.name || "Anonim"}</a>
        </h3>
        <p class="story-item__date">${storyDate}</p>
        <p class="story-item__description">
          ${story.description ? story.description.substring(0, 100) : ""}
          ${
            story.description && story.description.length > 100
              ? `<a href="#/detail/${story.id}" class="read-more">Baca selengkapnya</a>`
              : ""
          }
        </p>
        ${
          story.lat && story.lon
            ? `<p class="story-item__location">
                <i class="fas fa-map-marker-alt"></i> Lokasi Tersedia
              </p>`
            : '<p class="story-item__location">Lokasi Tidak Tersedia</p>'
        }
      </div>
    </article>
  `;
};

export const createFavoriteStoryItemTemplate = (story) => {
  const storyDate = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return `
    <article class="story-item" tabindex="0" data-story-id="${story.id}">
      <a href="#/detail/${
        story.id
      }" class="story-item__link-overlay" aria-label="Lihat detail cerita ${
    story.name || "Anonim"
  }"></a>
      <img class="story-item__image"
           src="${story.photoUrl || "./images/placeholder.png"}"
           alt="Foto cerita dari ${story.name || "Anonim"}"
           width="100%" height="200">

      <div class="story-item__content">
        <h3 class="story-item__name">
          <a href="#/detail/${story.id}">${story.name || "Anonim"}</a>
        </h3>
        <p class="story-item__date">${storyDate}</p>
        <p class="story-item__description">
          ${story.description ? story.description.substring(0, 100) : ""}
          ${
            story.description && story.description.length > 100
              ? `<a href="#/detail/${story.id}" class="read-more">Baca selengkapnya</a>`
              : ""
          }
        </p>

        <div class="story-item__actions">
          <button class="delete-button" data-id="${
            story.id
          }" aria-label="Hapus dari favorit" title="Hapus dari favorit">
            <i class="fas fa-trash-alt" style="margin-right: 6px;"></i> Hapus
          </button>
        </div>
      </div>
    </article>
  `;
};

const createLoaderTemplate = () => `
    <div class="loading-indicator" aria-label="Memuat data...">
        <div class="loader"></div>
        <p>Memuat...</p>
    </div>
`;

const createErrorTemplate = (message) => `
    <div class="error-message" aria-live="assertive">
        <p>${message}</p>
    </div>
`;

const createStoryDetailTemplate = (story) => {
  if (!story) {
    return createErrorTemplate(
      "Data cerita tidak ditemukan atau Anda tidak memiliki akses."
    );
  }

  const storyDate = new Date(story.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const authorName = story.name || "Pengguna Anonim";

  return `
        <article class="story-detail-page container" tabindex="-1" aria-labelledby="story-title">
            <header class="story-detail__header">
                <h1 id="story-title" class="story-detail__name">${authorName}</h1>
                <p class="story-detail__meta">
                    <span class="story-detail__author" aria-label="Nama pengirim"><i class="fas fa-user"></i> ${authorName}</span>
                    <span class="story-detail__date" aria-label="Tanggal publikasi"><i class="fas fa-calendar-alt"></i> ${storyDate}</span>
                </p>
            </header>

            <section class="story-detail__main-content">
                <figure class="story-detail__figure">
                    <img
                        class="story-detail__image"
                        src="${story.photoUrl}"
                        alt="Foto untuk cerita dari ${authorName}"
                        onerror="this.onerror=null; this.src='./images/placeholder.png'; this.classList.add('image-error');"
                    />
                    <figcaption class="story-detail__image-caption">
                        Gambar cerita dari ${authorName}
                    </figcaption>
                </figure>

                <div class="story-detail__text-content">
                    <h2 class="story-detail__section-title">Deskripsi Lengkap</h2>
                    <p class="story-detail__description">${
                      story.description
                    }</p>
                </div>
            </section>

            ${
              story.lat && story.lon
                ? `
                    <section class="story-detail__location-section">
                        <h2 class="story-detail__section-title story-detail__location-title">
                            <i class="fas fa-map-marker-alt"></i> Lokasi Cerita
                        </h2>
                        <div class="story-detail__location-info">
                            <p><strong>Latitude:</strong> ${story.lat.toFixed(
                              5
                            )}</p>
                            <p><strong>Longitude:</strong> ${story.lon.toFixed(
                              5
                            )}</p>
                        </div>
                        <div id="story-detail-map" class="map-container story-detail__map-view">
                            ${createLoaderTemplate()}
                        </div>
                    </section>`
                : `
                    <section class="story-detail__location-section story-detail__location-section--no-data">
                        <h2 class="story-detail__section-title story-detail__location-title">
                            <i class="fas fa-map-marker-alt"></i> Lokasi Cerita
                        </h2>
                        <p class="story-detail__no-location">Pengguna tidak menyertakan data lokasi untuk cerita ini.</p>
                    </section>`
            }

            <section class="story-detail__interactive">
                <div id="favoriteButtonContainer"></div>
                <div class="feedback-section black-text">
                <h2 class="story-detail__section-title black-text">Feedback</h2>
                <form id="feedback-form" aria-label="Formulir feedback">
                    <textarea id="feedback-input" rows="3" placeholder="Tulis feedback Anda di sini..." required></textarea>
                    <button type="submit" class="btn btn--primary">Kirim</button>
                </form>
                <div id="feedback-list" class="black-text"></div>
            </div>
            </section>

            <footer class="story-detail__footer">
                <a href="#/" class="btn btn--primary btn--icon-left story-detail__back-button">
                    <i class="fas fa-arrow-left"></i> Kembali ke Daftar Cerita
                </a>
            </footer>
        </article>
    `;
};

const createFavoriteButton = () => `
    <button aria-label="Tambah ke favorit" class="favorite-button">
        <i class="fas fa-heart"></i> Favoritkan
    </button>
`;

const createFavoritedButton = () => `
    <button aria-label="Hapus dari favorit" class="favorited-button">
        <i class="fas fa-heart-broken"></i> Hapus Favorit
    </button>
`;

const createFeedbackItemTemplate = (feedback) => `
    <div class="feedback-item">
        <p>${feedback.content}</p>
        <small>${new Date(feedback.timestamp).toLocaleString("id-ID")}</small>
    </div>
`;

export const generateSubscribeButtonTemplate = () => `
  <button id="subscribe-button" class="btn btn--primary" aria-label="Berlangganan notifikasi">
    <i class="fas fa-bell"></i> Subscribe
  </button>
`;

export const generateUnsubscribeButtonTemplate = () => `
  <button id="unsubscribe-button" class="btn btn--secondary" aria-label="Berhenti berlangganan notifikasi">
    <i class="fas fa-bell-slash"></i> Unsubscribe
  </button>
`;

export const createActionButtonTemplate = (label, iconClass, buttonClass) => `
  <button class="btn ${buttonClass}" aria-label="${label}">
    <i class="${iconClass}"></i> ${label}
  </button>
`;

export {
  createStoryItemTemplate,
  createLoaderTemplate,
  createErrorTemplate,
  createStoryDetailTemplate,
  createFavoriteButton,
  createFavoritedButton,
  createFeedbackItemTemplate,
};