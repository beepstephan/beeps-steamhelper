import { createWithEqualityFn } from "zustand/traditional";
import axios from "axios";

export const useFavoritesStore = createWithEqualityFn((set) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async (steamId, token) => {
    if (!token) {
      set({ favorites: [], isLoading: false, error: "Потрібна авторизація для перегляду обраних ігор" });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/favorites/${steamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch favorites:", err.message, err.response?.data);
      set({ error: "Не вдалося завантажити обрані ігри", isLoading: false });
    }
  },

  addFavorite: async (steamId, appid, token) => {
    if (!token) {
      set({ error: "Потрібна авторизація для додавання до обраних", isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/favorites/${steamId}`,
        { appid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/favorites/${steamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to add favorite:", err.message, err.response?.data);
      set({ error: "Не вдалося додати гру до обраних", isLoading: false });
    }
  },

  removeFavorite: async (steamId, appid, token) => {
    if (!token) {
      set({ error: "Потрібна авторизація для видалення з обраних", isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/favorites/${steamId}/${appid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        favorites: state.favorites.filter((game) => game.appid !== appid),
        isLoading: false,
      }));
    } catch (err) {
      console.error("Failed to remove favorite:", err.message, err.response?.data);
      set({ error: "Не вдалося видалити гру з обраних", isLoading: false });
    }
  },
}));