class AddStoryView {
  constructor(container) {
    this._container = container;
    this._renderForm();
  }

  _renderForm() {
    this._container.innerHTML = `
      <h2>Tambah Cerita Baru</h2>
      <form id="storyForm">
        <div>
          <label for="title">Judul Cerita</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label for="content">Isi Cerita</label>
          <textarea id="content" name="content" rows="5" required></textarea>
        </div>
        <div>
          <label for="image">Gambar (opsional)</label>
          <input type="file" id="image" name="image" accept="image/*" />
        </div>
        <button type="submit">Kirim Cerita</button>
      </form>
      <div id="storyMessage"></div>
    `;
  }

  bindFormSubmit(handler) {
    const form = this._container.querySelector("#storyForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const title = formData.get("title");
      const content = formData.get("content");
      const image = formData.get("image");

      handler({ title, content, image });
    });
  }

  showMessage(message, isError = false) {
    const messageContainer = this._container.querySelector("#storyMessage");
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? "red" : "green";
  }
}

export default AddStoryView;