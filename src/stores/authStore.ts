import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCategoriesStore } from "./categoriesStore";
import { useEntriesStore } from "./entriesStore";

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        localStorage.setItem("poupamais_token", token);
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("poupamais_token");
        useCategoriesStore.getState().resetState();
        useEntriesStore.getState().resetState();
        set({ token: null, user: null, isAuthenticated: false });
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "poupamais_auth",
    }
  )
);
