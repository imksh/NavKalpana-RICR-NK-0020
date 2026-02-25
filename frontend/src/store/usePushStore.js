import { create } from "zustand";
import api from "../config/api";

const usePushStore = create((set, get) => ({
  subscription: null,

  urlBase64ToUint8Array: (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  },

  subscribeUserToPush: async () => {
    try {
      const sw = await navigator.serviceWorker.ready;

      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: get().urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ),
      });

      await api.post("/push/web-push-subscribe", subscription);

      console.log("User subscribed to push notifications");
    } catch (error) {
      console.log("Error in subscription:", error);
    }
  },

  unsubscribeFromPush: async () => {
    try {
      if (!("serviceWorker" in navigator)) return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (!sub) return;

      await api.post("/push/web-push-unsubscribe", {
        endpoint: sub.endpoint,
      });

      await sub.unsubscribe();
      console.log("🔕 Push unsubscribed");
    } catch (err) {
      console.warn("Push unsubscribe failed (safe to ignore):", err);
    }
  },

  isPushSubscribed: async () => {
    if (!("serviceWorker" in navigator)) return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  },
}));

export default usePushStore;
