import AddStoryPresenter from "../../presenters/add/add-story-presenter";

export default class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h2>Tambah Cerita Baru</h2>
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="storyDescription">Deskripsi:</label>
            <textarea id="storyDescription" name="description" required></textarea>
            <span class="validation-message" aria-live="polite"></span>
          </div>

          <div class="form-group">
            <label>Foto:</label>
            <div class="camera-controls">
                <button type="button" id="startCameraBtn" aria-label="Buka Kamera">Buka Kamera</button>
                <button type="button" id="captureBtn" style="display: none;" aria-label="Ambil Foto">Ambil Foto</button>
                <span class="or-divider">atau</span>
                <input type="file" id="fileInput" accept="image/*" style="display: none;">
                <button type="button" id="uploadFileBtn" aria-label="Upload dari file">Upload File</button>
            </div>
            <video id="video-preview" autoplay playsinline style="display: none; max-width: 100%; margin-top: 10px;" aria-hidden="true"></video>
            <canvas id="photoCanvas" style="display: none;" aria-hidden="true"></canvas>
            <img id="photo-result" alt="Hasil foto pratinjau" style="display: none; max-width: 100%; margin-top: 10px;">
            <span id="camera-error" class="error-message" aria-live="assertive" style="display: none;"></span>
          </div>

          <div class="form-group">
            <label>Lokasi (Opsional):</label>
            <p id="map-instruction">Klik pada peta untuk memilih lokasi cerita.</p>
            <div id="map-picker" style="height: 300px;"></div>
            <p id="selected-coords" style="margin-top: 5px;">Koordinat: Belum dipilih</p>
          </div>

          <div class="form-submit">
            <button type="submit">Bagikan Cerita</button>
            <div id="loading-indicator" style="display: none;" aria-label="Sedang mengirim cerita">Mengirim...</div>
            <div id="error-message" class="error-message" aria-live="assertive" style="color: var(--danger); margin-top: 10px;"></div>
          </div>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this._form = document.getElementById("addStoryForm");
    this._descriptionInput = document.getElementById("storyDescription");
    this._startCameraBtn = document.getElementById("startCameraBtn");
    this._captureBtn = document.getElementById("captureBtn");
    this._videoPreview = document.getElementById("video-preview");
    this._photoCanvas = document.getElementById("photoCanvas");
    this._photoResult = document.getElementById("photo-result");
    this._selectedCoords = document.getElementById("selected-coords");
    this._loadingIndicator = document.getElementById("loading-indicator");
    this._errorMessageElement = document.getElementById("error-message");
    this._cameraErrorElement = document.getElementById("camera-error");
    this._submitButton = this._form.querySelector('button[type="submit"]');
    this._fileInput = document.getElementById("fileInput");
    this._uploadFileBtn = document.getElementById("uploadFileBtn");

    await this._presenter.init();
  }

  // View methods
  updateCoordinates(lat, lng) {
    this._selectedCoords.textContent = `Koordinat: ${lat.toFixed(
      5
    )}, ${lng.toFixed(5)}`;
  }

  showCameraPreview(stream) {
    this._videoPreview.srcObject = stream;
    this._videoPreview.style.display = "block";
    this._startCameraBtn.style.display = "none";
    this._captureBtn.style.display = "inline";
    this._photoResult.style.display = "none";
    this._cameraErrorElement.style.display = "none";
  }

  hideCameraPreview() {
    this._videoPreview.style.display = "none";
    this._captureBtn.style.display = "none";
    this._startCameraBtn.style.display = "inline";
  }

  // Updated: Konversi canvas ke Blob
  async capturePhotoFromPreview() {
    return new Promise((resolve) => {
      const context = this._photoCanvas.getContext("2d");
      this._photoCanvas.width = this._videoPreview.videoWidth;
      this._photoCanvas.height = this._videoPreview.videoHeight;
      context.drawImage(
        this._videoPreview,
        0,
        0,
        this._photoCanvas.width,
        this._photoCanvas.height
      );

      this._photoCanvas.toBlob(
        (blob) => {
          this._videoPreview.style.display = "none";
          this._captureBtn.style.display = "none";
          this._startCameraBtn.style.display = "inline";
          resolve(blob);
        },
        "image/jpeg",
        0.8
      );
    });
  }

  // Updated: menerima Blob, bukan File
  showPhotoPreview(blob) {
    const photoUrl = URL.createObjectURL(blob);
    this._photoResult.src = photoUrl;
    this._photoResult.style.display = "block";
  }

  showCameraError(message) {
    this._cameraErrorElement.innerText = message;
    this._cameraErrorElement.style.display = "block";
    this.hideCameraPreview();
  }

  showLoading(show) {
    this._loadingIndicator.style.display = show ? "inline" : "none";
    this._submitButton.disabled = show;
  }

  showError(message) {
    this._errorMessageElement.innerText = message;
    this._errorMessageElement.style.display = "block";
  }

  showSuccess(message) {
    alert(message);
  }

  navigateToHome() {
    window.location.hash = "/";
  }

  cleanupPhotoPreview() {
    if (this._photoResult && this._photoResult.src.startsWith("blob:")) {
      URL.revokeObjectURL(this._photoResult.src);
    }
  }

  // Event handlers
  onStartCameraClick(handler) {
    this._startCameraBtn.addEventListener("click", handler);
  }

  onCaptureClick(handler) {
    this._captureBtn.addEventListener("click", handler);
  }

  onFileUpload(handler) {
    this._uploadFileBtn.addEventListener("click", () => {
      this._fileInput.click();
    });

    this._fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) handler(file);
    });
  }

  onFormSubmit(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler({
        description: this._descriptionInput.value,
      });
    });
  }

  onHashChange(handler) {
    window.addEventListener("hashchange", () => {
      if (window.location.hash !== "#/add") {
        handler();
      }
    });
  }

  cleanup() {
    this._presenter._cleanupResources();
  }
}