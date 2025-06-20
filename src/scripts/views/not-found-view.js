const NotFoundView = {
  async render() {
    return `
      <section class="content" style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
        text-align: center;
        padding: 2rem;
      ">
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">404 - Halaman Tidak Ditemukan</h2>
        <p style="margin-bottom: 1.5rem;">Oops! Halaman yang Anda akses tidak tersedia.</p>
        <a href="/#/" style="
          color: #fff;
          background-color: #3f51b5;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 0.5rem;
        ">⬅️ Kembali ke Beranda</a>
      </section>
    `;
  },

  async afterRender() {
    // Tidak perlu logic tambahan
  },
};

export default NotFoundView;