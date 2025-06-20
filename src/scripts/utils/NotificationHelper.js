import { convertBase64ToUint8Array } from "./index";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";
import CONFIG from "../config";

function isNotificationAvailable() {
  return "Notification" in window;
}

async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API tidak didukung.");
    return false;
  }

  const status = await Notification.requestPermission();
  if (status === "denied") {
    alert("Izin notifikasi ditolak. Anda tidak akan menerima pemberitahuan.");
    return false;
  }

  return status === "granted";
}

function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration?.pushManager.getSubscription();
}

async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert("Anda sudah berlangganan notifikasi.");
    return;
  }

  console.log("Mulai berlangganan push notification...");
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error("Gagal menyimpan langganan di server:", response);
      await pushSubscription.unsubscribe(); // Batalkan langganan jika server gagal
      alert("Gagal mengaktifkan langganan push notification.");
      return;
    }

    alert("Berhasil berlangganan push notification!");
  } catch (error) {
    console.error("Gagal berlangganan:", error);
    alert("Gagal mengaktifkan langganan push notification.");
    if (pushSubscription) {
      await pushSubscription.unsubscribe(); // Batalkan langganan jika ada error
    }
  }
}

async function unsubscribe() {
  console.log("Mulai berhenti berlangganan...");
  const pushSubscription = await getPushSubscription();

  if (!pushSubscription) {
    alert("Anda belum berlangganan notifikasi.");
    return;
  }

  try {
    const { endpoint } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      console.error("Gagal menghapus langganan di server:", response);
      alert("Gagal menonaktifkan langganan push notification.");
      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      console.error("Gagal memutus langganan di browser.");
      // Coba kirim ulang subscription ke server jika gagal di sisi client
      const { keys } = pushSubscription.toJSON();
      await subscribePushNotification({ endpoint, keys });
      alert("Gagal menonaktifkan langganan push notification.");
      return;
    }

    alert("Berhasil berhenti berlangganan push notification.");
  } catch (error) {
    console.error("Gagal berhenti berlangganan:", error);
    alert("Gagal menonaktifkan langganan push notification.");
  }
}

export { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe };