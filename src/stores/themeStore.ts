import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      toggleMode: () => {
        const current = get().mode;
        set({ mode: current === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "poupamais_theme",
    }
  )
);
