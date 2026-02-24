import { useEffect, useState } from "react";
import usePwaInstall from "../hooks/usePwaInstall";

const DISMISS_KEY = "gradify_pwa_dismissed_at";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const wasDismissedRecently = () => {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_TTL_MS;
};

const PwaInstallPrompt = () => {
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!canInstall || wasDismissedRecently() || isInstalled) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    return undefined;
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result?.outcome === "accepted") {
      setVisible(false);
      return;
    }
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-2xl border border-(--border-color) bg-(--card-bg) p-4 shadow-lg">
      <p className="text-sm text-(--text-secondary)">
        Install Gradify for faster access and offline-ready learning.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-xl bg-(--color-primary) px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Install App
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-xl border border-(--border-color) px-3 py-2 text-sm text-(--text-secondary) hover:bg-(--bg-muted)"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
