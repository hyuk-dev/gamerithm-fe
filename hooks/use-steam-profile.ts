"use client";

import { create } from "zustand";

type SteamProfile = {
  steamId: string;
  name: string;
  avatar: string;
  username: string;
  country?: string;
};

type ProfileState = {
  isLoading: boolean;
  profile: SteamProfile | null;
  fetchProfile: () => Promise<void>;
  clear: () => void;
};

export const useSteamProfile = create<ProfileState>((set) => ({
  isLoading: false,
  profile: null,
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/steam/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      set({ profile: data, isLoading: false });
    } catch {
      set({ profile: null, isLoading: false });
    }
  },
  clear: () => set({ profile: null }),
}));
