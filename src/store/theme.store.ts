import { create } from "zustand";

export type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("app.theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    if (document.body) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    }
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    if (document.body) {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }
};

// Immediate execution on module load
const initialTheme = getStoredTheme();
applyThemeToDOM(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,

  setTheme: (theme: Theme) => {
    applyThemeToDOM(theme);
    localStorage.setItem("app.theme", theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  initTheme: () => {
    const current = getStoredTheme();
    get().setTheme(current);
  },
}));
