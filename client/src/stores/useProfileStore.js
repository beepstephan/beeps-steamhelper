import { createWithEqualityFn } from "zustand/traditional";
import axios from "axios";

export const useProfileStore = createWithEqualityFn((set) => ({
  recommendations: [],
  favoriteGenres: [],
  mood: "",
  status: null,
  multiplayerStats: { multiplayerTime: 0, singleplayerTime: 0, mixedTime: 0 },
  isLoading: false,
  error: null,

  fetchProfileExtras: async (steamId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user-profile/${steamId}`);
      const data = response.data || {};
      set({
        recommendations: data.recommendations || [],
        favoriteGenres: data.favoriteGenres || [],
        mood: data.mood || "",
        status: data.profile?.status || "offline",
        multiplayerStats: data.games?.multiplayerStats || { multiplayerTime: 0, singleplayerTime: 0, mixedTime: 0 },
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch profile extras:", err.message, err.response?.data);
      set({ error: "Помилка завантаження додаткових даних профілю", isLoading: false });
    }
  },

  clearProfileExtras: () => {
    set({
      recommendations: [],
      favoriteGenres: [],
      mood: "",
      status: null,
      multiplayerStats: { multiplayerTime: 0, singleplayerTime: 0, mixedTime: 0 },
      isLoading: false,
      error: null,
    });
  },
}));