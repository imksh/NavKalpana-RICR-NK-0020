let deferredPrompt = null;
let isInstalled = false;
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener({ deferredPrompt, isInstalled }));
};

export const initPwaInstall = () => {
  if (typeof window === "undefined") return;
  if (window.__gradifyPwaInit) return;
  window.__gradifyPwaInit = true;

  const checkStandalone = () => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) {
      isInstalled = true;
    }
  };

  checkStandalone();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    isInstalled = true;
    notify();
  });
};

export const subscribePwaInstall = (listener) => {
  listeners.add(listener);
  listener({ deferredPrompt, isInstalled });
  return () => listeners.delete(listener);
};

export const getPwaInstallState = () => ({ deferredPrompt, isInstalled });

export const promptPwaInstall = async () => {
  if (!deferredPrompt) return { outcome: "dismissed" };

  deferredPrompt.prompt();

  try {
    const choice = await deferredPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      deferredPrompt = null;
      isInstalled = true;
      notify();
    }
    return choice;
  } catch {
    return { outcome: "dismissed" };
  }
};
