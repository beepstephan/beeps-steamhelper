import { createWithEqualityFn } from "zustand/traditional";
import axios from "axios";

export const useAuthStore = createWithEqualityFn((set, get) => ({
  token: null,
  username: null,
  steamId: null,
  avatar: null,
  games: [],
  activity: null,
  totalGames: 0,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: async () => {
    const state = get();
    if (state.isInitialized) return;
    const token = localStorage.getItem("jwt_token");
    const viewedSteamId = localStorage.getItem("viewedSteamId");

    if (!token && !viewedSteamId) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      if (token) {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const steamId = userResponse.data.steamId;
        const gamesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/games/${steamId}`);
        set({
          token,
          username: userResponse.data.username,
          steamId,
          avatar: userResponse.data.avatar,
          games: gamesResponse.data.games || [],
          activity: gamesResponse.data.activity || null,
          totalGames: gamesResponse.data.totalGames || 0,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else if (viewedSteamId) {
        let profileData = {};
        try {
          const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${viewedSteamId}`);
          profileData = profileResponse.data;
        } catch (profileErr) {
          console.error("Failed to fetch profile:", profileErr.message);
        }

        let gamesData = { games: [], activity: null, totalGames: 0 };
        try {
          const gamesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/games/${viewedSteamId}`);
          gamesData = gamesResponse.data;
        } catch (gamesErr) {
          console.error("Failed to fetch games:", gamesErr.message);
        }

        set({
          steamId: viewedSteamId,
          username: profileData.username || "Невідомий користувач",
          avatar: profileData.avatar || null,
          games: gamesData.games || [],
          activity: gamesData.activity || null,
          totalGames: gamesData.totalGames || 0,
          isInitialized: true,
          isLoading: false,
          isAuthenticated: false,
          error: !gamesData.games.length && profileData.username ? "Не вдалося завантажити дані про ігри" : null,
        });
      }
    } catch (err) {
      console.error("Initialization failed:", err.message);
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("viewedSteamId");
      set({ error: "Критична помилка ініціалізації", isInitialized: true, isLoading: false });
    }
  },

  setUser: async (userData) => {
    set({ isLoading: true, error: null });
    const steamId = userData.steamId;

    try {
      const profileResponse = userData.username
        ? { data: { username: userData.username, avatar: userData.avatar } }
        : await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${steamId}`);
      const gamesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/games/${steamId}`);
      set({
        token: userData.token || null,
        username: profileResponse.data.username || null,
        steamId,
        avatar: profileResponse.data.avatar || null,
        games: gamesResponse.data.games || [],
        activity: gamesResponse.data.activity || null,
        totalGames: gamesResponse.data.totalGames || 0,
        isAuthenticated: !!userData.token,
        isLoading: false,
        isInitialized: true,
      });
      if (userData.token) localStorage.setItem("jwt_token", userData.token);
      else localStorage.setItem("viewedSteamId", steamId);
    } catch (err) {
      console.error("Set user failed:", err.message, err.response?.data);
      set({ error: "Помилка завантаження даних", isLoading: false });
    }
  },

  viewProfile: async (steamId) => {
    set({ isLoading: true, error: null });
    try {
      let profileData = {};
      try {
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile/${steamId}`);
        profileData = profileResponse.data;
      } catch (profileErr) {
        console.error("Failed to fetch profile:", profileErr.message);
      }

      let gamesData = { games: [], activity: null, totalGames: 0 };
      try {
        const gamesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/games/${steamId}`);
        gamesData = gamesResponse.data;
      } catch (gamesErr) {
        console.error("Failed to fetch games:", gamesErr.message);
      }

      set({
        steamId,
        username: profileData.username || "Невідомий користувач",
        avatar: profileData.avatar || null,
        games: gamesData.games || [],
        activity: gamesData.activity || null,
        totalGames: gamesData.totalGames || 0,
        isLoading: false,
        isAuthenticated: false,
        error: !gamesData.games.length && profileData.username ? "Не вдалося завантажити дані про ігри" : null,
      });
      localStorage.setItem("viewedSteamId", steamId);
    } catch (err) {
      console.error("View profile failed:", err.message, err.response?.data);
      set({ error: "Помилка перегляду профілю", isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("viewedSteamId");
    set({
      token: null,
      username: null,
      steamId: null,
      avatar: null,
      games: [],
      activity: null,
      totalGames: 0,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));