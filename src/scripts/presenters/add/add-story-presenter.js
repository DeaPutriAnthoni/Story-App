import {
  addNewStoryGuest,
  addNewStoryAuthenticated,
  isLoggedIn,
} from "../../data/api.js";
import MapInitiator from "../../utils/map-initiator.js";

export default class AddStoryPresenter {
  constructor(view) {
    this._view = view;
    this._latitude = null;
    this._longitude = null;
    this._stream = null;
    this._photoBlob = null;
  }

  async init() {
    this._setupEventHandlers();
    this._initMap();
  }

  _initMap() {
    MapInitiator.initPickerMap("map-picker", (lat, lng) => {
      this._latitude = lat;
      this._longitude = lng;
      this._view.updateCoordinates(lat, lng);
    });
  }

  _setupEventHandlers() {
    this._view.onStartCameraClick(async () => {
      await this._handleStartCamera();
    });

    this._view.onCaptureClick(() => {
      this._handleCapturePhoto();
    });

    this._view.onFileUpload((file) => {
      this._handleFileUpload(file);
    });

    this._view.onFormSubmit((formData) => {
      this._handleFormSubmit(formData);
    });

    this._view.onHashChange(() => {
      this._cleanupResources();
    });
  }

  async _handleStartCamera() {
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      this._view.showCameraPreview(this._stream);
      this._photoBlob = null;
    } catch (error) {
      const errorMessage = this._getCameraErrorMessage(error);
      this._view.showCameraError(errorMessage);
    }
  }

  _getCameraErrorMessage(error) {
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      return "Akses kamera ditolak. Mohon izinkan akses kamera di pengaturan browser Anda.";
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      return "Tidak ada perangkat kamera ditemukan.";
    } else if (
      error.name === "NotReadableError" ||
      error.name === "OverconstrainedError"
    ) {
      return "Kamera sedang digunakan atau ada masalah konfigurasi.";
    } else if (error.name === "SecurityError") {
      return "Akses kamera diblokir karena alasan keamanan (misal: bukan HTTPS).";
    }
    return "Gagal mengakses kamera.";
  }

  async _handleCapturePhoto() {
    if (!this._stream) return;

    try {
      const photoBlob = await this._view.capturePhotoFromPreview();
      if (photoBlob) {
        this._photoBlob = photoBlob;
        this._stopCameraStream();
        this._view.showPhotoPreview(photoBlob);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      this._view.showCameraError("Gagal mengambil foto");
    }
  }

  _handleFileUpload(file) {
    if (file && file.type.startsWith("image/")) {
      this._stopCameraStream();
      this._photoBlob = file;
      this._view.showPhotoPreview(file);
    }
  }

  async _handleFormSubmit(formData) {
    if (!this._validateForm(formData)) return;

    try {
      this._view.showLoading(true);

      const result = await this._submitStory(formData);

      this._view.showSuccess("Cerita berhasil ditambahkan!");
      this._cleanupResources();

      // ✅ Jangan dispatchEvent lagi → cukup pakai flag + delay
      localStorage.setItem("forceRefreshStories", "true");

      // ✅ Delay 1 detik biar server sempat commit data → HomePage fetch dapat data baru
      setTimeout(() => {
        window.location.hash = "/";
      }, 1000);
    } catch (error) {
      this._view.showError(`Gagal menambahkan cerita: ${error.message}`);
    } finally {
      this._view.showLoading(false);
    }
  }

  _validateForm(formData) {
    if (!formData.description.trim()) {
      this._view.showError("Deskripsi tidak boleh kosong.");
      return false;
    }
    if (!this._photoBlob) {
      this._view.showError(
        "Foto belum diambil. Silakan buka kamera dan ambil foto."
      );
      return false;
    }
    return true;
  }

  async _submitStory(formData) {
    const submissionForm = new FormData();
    submissionForm.append("description", formData.description);

    const photoFile = new File([this._photoBlob], "story_image.jpg", {
      type: "image/jpeg",
    });
    submissionForm.append("photo", photoFile);

    if (this._latitude !== null && this._longitude !== null) {
      submissionForm.append("lat", this._latitude);
      submissionForm.append("lon", this._longitude);
    }

    return isLoggedIn()
      ? await addNewStoryAuthenticated(submissionForm)
      : await addNewStoryGuest(submissionForm);
  }

  _stopCameraStream() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
      this._view.hideCameraPreview();
    }
  }

  _cleanupResources() {
    this._stopCameraStream();
    this._view.cleanupPhotoPreview();
    MapInitiator.removeMap("map-picker");
  }
}