const createSubscribePushButtonTemplate = () => `
  <button id="subscribe-push-button" class="push-button" aria-label="Berlangganan Push Notification">
    <i class="fas fa-bell"></i> Aktifkan Notifikasi
  </button>
`;

const createUnsubscribePushButtonTemplate = () => `
  <button id="unsubscribe-push-button" class="push-button" aria-label="Berhenti Berlangganan Push Notification">
    <i class="fas fa-bell-slash"></i> Nonaktifkan Notifikasi
  </button>
`;

export {
  createSubscribePushButtonTemplate,
  createUnsubscribePushButtonTemplate,
};