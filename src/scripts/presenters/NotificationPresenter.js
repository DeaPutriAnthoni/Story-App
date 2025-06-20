import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api.js";

class NotificationPresenter {
  constructor({ serviceWorkerRegistration }) {
    this._serviceWorkerRegistration = serviceWorkerRegistration;
    this._pushToolsContainer = document.querySelector(
      "#push-notification-menu"
    );
    this._pushSubscribeButton = null;

    this._renderInitialButton();
  }

  // Render tombol subscribe atau unsubscribe berdasarkan status langganan
  async _renderInitialButton() {
    const isSubscribed = await this._checkSubscriptionStatus();
    this._renderButton(isSubscribed);
  }

  // Cek status langganan push notification
  async _checkSubscriptionStatus() {
    const subscription =
      await this._serviceWorkerRegistration.pushManager.getSubscription();
    return subscription !== null;
  }

  // Render tombol subscribe atau unsubscribe
  _renderButton(isSubscribed) {
    this._pushToolsContainer.innerHTML = `
      <a href="#" id="push-subscribe-button" class="nav-link">
        <i class="fas ${isSubscribed ? "fa-bell-slash" : "fa-bell"}"></i>
        ${isSubscribed ? "Nonaktifkan Notifikasi" : "Aktifkan Notifikasi"}
      </a>
    `;

    this._pushSubscribeButton = document.querySelector(
      "#push-subscribe-button"
    );
    this._pushSubscribeButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (await this._checkSubscriptionStatus()) {
        await this._unsubscribe();
      } else {
        await this._subscribe();
      }
    });
  }

  // Langganan push notification
  async _subscribe() {
    try {
      console.log("Mulai berlangganan push notification...");
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert(
          "Izin notifikasi ditolak. Pastikan Anda mengizinkan notifikasi di pengaturan browser."
        );
        return;
      }

      const applicationServerKey = this._urlBase64ToUint8Array(
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
      );

      const subscription =
        await this._serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
      };

      const result = await subscribePushNotification(subscriptionData);

      if (result.ok) {
        console.log("Berhasil berlangganan push notification.");
        alert("Notifikasi berhasil diaktifkan!");
      } else {
        console.error("Gagal berlangganan push notification:", result);
        alert("Gagal mengaktifkan notifikasi.");
      }

      this._renderButton(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        alert(
          "Notifikasi diblokir oleh browser. Periksa pengaturan izin di browser."
        );
      } else {
        console.error("Error saat subscribe push notification:", error);
        alert("Terjadi kesalahan saat mengaktifkan notifikasi.");
      }
    }
  }

  // Berhenti berlangganan push notification
  async _unsubscribe() {
    try {
      console.log("Berhenti berlangganan push notification...");
      const subscription =
        await this._serviceWorkerRegistration.pushManager.getSubscription();

      if (!subscription) return;

      const result = await unsubscribePushNotification({
        endpoint: subscription.endpoint,
      });

      if (!result.ok) {
        console.error("Gagal unsubscribe push notification:", result);
        alert("Gagal menonaktifkan notifikasi.");
        return;
      }

      await subscription.unsubscribe();
      console.log("Berhasil unsubscribe push notification.");
      alert("Notifikasi berhasil dinonaktifkan!");
      this._renderButton(false);
    } catch (error) {
      console.error("Error saat unsubscribe push notification:", error);
      alert("Terjadi kesalahan saat menonaktifkan notifikasi.");
    }
  }

  // Mengonversi base64 menjadi Uint8Array untuk VAPID key
  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export default NotificationPresenter;