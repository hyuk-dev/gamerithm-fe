"use client";

import { create } from "zustand";

type Game = {
  appid: number;
  name: string;
  playtime_hours: number;
  genres: string[];
  coverImage?: string;
  lastPlayed?: string | { type: string; count: number };
};

type GamesState = {
  isLoading: boolean;
  games: Game[];
  error: string | null;
  fetchGames: () => Promise<void>;
  clear: () => void;
};

export const useGames = create<GamesState>((set) => ({
  isLoading: false,
  games: [],
  error: null,
  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/steam/games", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`API 요청 실패: ${res.status}`);
      }
      const data = await res.json();
      set({ games: data.games || [], isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      set({ games: [], isLoading: false, error: errorMessage });
    }
  },
  clear: () => set({ games: [], error: null }),
}));
