import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme");
  if (saved) return saved;

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return prefersDark ? "dark" : "light";
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  isAnimating: false,
  animationOrigin: { x: window.innerWidth, y: 0 },

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  toggleTheme: (origin = null) => {
    const current = get().theme;
    const next = current === "dark" ? "light" : "dark";

    // If click position passed, store it
    if (origin) {
      set({ animationOrigin: origin });
    }

    set({ isAnimating: true });

    // Delay theme switch slightly for smooth animation
    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      set({ theme: next });
    }, 200);

    // End animation
    setTimeout(() => {
      set({ isAnimating: false });
    }, 800);
  }
}));