"use client";

import { create } from "zustand";

type AuthSession = {
  provider: "steam";
  steamId: string;
};

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  isLoading: false,
  isAuthenticated: false,
  session: null,
  fetchSession: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();
      if (data.authenticated) {
        set({ isAuthenticated: true, session: data.session, isLoading: false });
      } else {
        set({ isAuthenticated: false, session: null, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, session: null, isLoading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ isAuthenticated: false, session: null });
    // 로그아웃 후 새로고침
    window.location.reload();
  },
}));
