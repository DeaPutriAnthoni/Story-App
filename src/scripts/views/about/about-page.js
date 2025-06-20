export default class AboutPage {
  async render() {
    return `
      <section class="container about-page">
        <h1 class="page-title">Tentang Aplikasi Ini</h1>

        <blockquote>
          <p>
            <strong>Story App</strong> adalah platform sederhana untuk berbagi cerita berbasis lokasi.
            Melalui aplikasi ini, pengguna dapat membagikan pengalaman, momen, atau kisah sehari-hari
            yang secara manual ditandai dengan lokasi tempat cerita tersebut dibuat.
          </p>
        </blockquote>

        <p><strong>Fitur-fitur utama dalam aplikasi ini meliputi:</strong></p>
        <ul>
          <li>Autentikasi pengguna (registrasi dan login)</li>
          <li>Menambahkan dan melihat cerita</li>
          <li>Menyematkan lokasi saat menambahkan cerita</li>
        </ul>

        <p>
          Proyek ini dibuat sebagai bagian dari submission dalam proses pembelajaran di <strong>Dicoding</strong>,
          dengan tujuan untuk memahami dan mengimplementasikan teknologi modern seperti:
        </p>
        <ul>
          <li>RESTful API</li>
          <li>Manajemen autentikasi</li>
          <li>Pengambilan data lokasi perangkat</li>
          <li>Pengembangan antarmuka yang ramah pengguna</li>
        </ul>
      </section>
    `;
  }

  async afterRender() {
    console.log("AboutPage afterRender executed.");
  }

  cleanup() {
    console.log("AboutPage cleanup executed.");
  }
}