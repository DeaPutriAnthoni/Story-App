import FeedbackIdb from "../data/feedback-idb.js"; // PASTIKAN PATH INI BENAR!
import { createFeedbackItemTemplate } from "../utils/template-creator.js";

export default class FeedbackPresenter {
  constructor({ id, formElement, inputElement, listContainer }) {
    this._id = id;
    this._form = formElement;
    this._input = inputElement;
    this._list = listContainer;
    this._isSubmitting = false; // Add submitting status
  }

  async init() {
    this._form.addEventListener("submit", this._handleSubmit);
    await this._renderFeedbacks();
  }

  _handleSubmit = async (event) => {
    event.preventDefault();
    if (this._isSubmitting) {
      return; // Prevent double submission
    }
    this._isSubmitting = true;

    const content = this._input.value.trim();
    if (!content) {
      this._showMessage("Silakan tulis feedback Anda.", "error");
      this._isSubmitting = false;
      return;
    }

    try {
      // Gunakan method addFeedback yang baru
      await FeedbackIdb.addFeedback(this._id, content);
      this._input.value = ""; // Kosongkan input setelah berhasil
      await this._renderFeedbacks(); // Render ulang list untuk menampilkan feedback baru
      this._showMessage("Feedback berhasil dikirim!", "success");
    } catch (error) {
      console.error("Gagal menyimpan feedback:", error);
      this._showMessage("Gagal mengirim feedback. Coba lagi nanti.", "error");
    } finally {
      this._isSubmitting = false;
    }
  };

  async _renderFeedbacks() {
    // Gunakan method getFeedbacks yang baru
    const feedbacks = await FeedbackIdb.getFeedbacks(this._id);

    // Opsional: Urutkan feedback berdasarkan timestamp (terbaru di atas)
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    this._list.innerHTML =
      feedbacks.length === 0
        ? "<p>Belum ada feedback.</p>"
        : feedbacks.map((f) => createFeedbackItemTemplate(f)).join("");
  }

  // Helper method untuk menampilkan pesan (ganti alert dengan UI yang lebih baik)
  _showMessage(message, type = "info") {
    // Anda harus mengimplementasikan UI yang lebih baik di sini,
    // seperti menambahkan elemen div di bawah form untuk menampilkan pesan.
    // Untuk saat ini, saya biarkan alert sebagai placeholder.
    alert(message);
  }
}