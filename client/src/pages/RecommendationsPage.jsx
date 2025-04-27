import { Typewriter } from "react-simple-typewriter";
import { Header, Footer } from "../components";
import { useAuthStore } from "../stores/useAuthStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const RecommendationsPage = () => {
  const { steamId, token, isInitialized, isLoading, isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites, addFavorite, removeFavorite } = useFavoritesStore();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  useEffect(() => {
    if (isInitialized && !isLoading && !steamId) {
      navigate("/");
    }
    if (steamId) {
      fetchRecommendations();
      if (isAuthenticated && token) {
        fetchFavorites(steamId, token);
      }
    }
  }, [isInitialized, isLoading, steamId, token, isAuthenticated, navigate, fetchFavorites]);

  const fetchRecommendations = async () => {
    setRecLoading(true);
    setRecError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/recommendations/${steamId}`);
      setRecommendations(response.data);
    } catch (err) {
      setRecError(`Помилка: ${err.response?.status || err.message}`);
    } finally {
      setRecLoading(false);
    }
  };

  const toggleFavorite = (appid) => {
    if (!isAuthenticated) {
      alert("Увійдіть через Steam, щоб додавати до улюблених!");
      return;
    }
    if (favorites.some((fav) => fav.appid === appid)) {
      removeFavorite(steamId, appid, token);
    } else {
      addFavorite(steamId, appid, token);
    }
  };

  if (!isInitialized || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-cyan-400">Завантаження...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-animated-gradient pt-16 min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10 text-cyan-400">
          <Typewriter words={["Рекомендації"]} loop={1} cursor cursorStyle="_" typeSpeed={35} delaySpeed={100} />
        </h1>
        {recLoading ? (
          <div className="mt-8 w-full max-w-4xl">
            <p className="text-gray-400 mb-4">Завантажуємо рекомендації...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                  >
                    <Skeleton height={128} baseColor="#1F2937" highlightColor="#00FFFF" />
                    <Skeleton height={20} width="80%" className="mt-2" baseColor="#1F2937" highlightColor="#00FFFF" />
                    <Skeleton height={40} className="mt-2" baseColor="#1F2937" highlightColor="#00FFFF" />
                    <Skeleton height={30} width="50%" className="mt-2" baseColor="#1F2937" highlightColor="#00FFFF" />
                  </div>
                ))}
            </div>
          </div>
        ) : recError ? (
          <p className="text-red-400 mt-4">{recError}</p>
        ) : recommendations ? (
          <div className="mt-8 w-full max-w-4xl">
            {recommendations.isLimited ? (
              <>
                <p className="text-gray-400 mb-4">У вас забагато ігор! Ось кілька недограних:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.games.map((game, index) => (
                    <div
                      key={game.appid || index}
                      className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)] flex flex-col"
                    >
                      <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                          alt={game.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/460x215?text=No+Image")}
                        />
                      </a>
                      <h3 className="text-cyan-400 mt-2 font-bold">{game.name}</h3>
                      <p className="text-gray-300 text-sm flex-grow">{game.comment}</p>
                      {isAuthenticated && (
                        <button
                          onClick={() => toggleFavorite(game.appid)}
                          className={`mt-2 py-1 px-3 rounded-lg text-sm ${
                            favorites.some((fav) => fav.appid === game.appid)
                              ? "bg-magenta-500 hover:bg-magenta-400 text-white"
                              : "bg-cyan-500 hover:bg-cyan-400 text-white"
                          }`}
                        >
                          {favorites.some((fav) => fav.appid === game.appid) ? "Прибрати з улюблених" : "Додати до улюблених"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-4">Рекомендації від ШІ:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.games.map((game, index) => (
                    <div
                      key={game.appid || index}
                      className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)] flex flex-col"
                    >
                      {game.appid ? (
                        <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                            alt={game.name}
                            className="w-full h-32 object-cover rounded-t-lg"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/460x215?text=No+Image")}
                          />
                        </a>
                      ) : (
                        <div className="w-full h-32 bg-gray-800 flex items-center justify-center rounded-t-lg">
                          <span className="text-gray-400">Зображення відсутнє</span>
                        </div>
                      )}
                      <h3 className="text-cyan-400 mt-2 font-bold">{game.name}</h3>
                      <p className="text-gray-300 text-sm flex-grow">{game.comment}</p>
                      {game.appid && isAuthenticated && (
                        <button
                          onClick={() => toggleFavorite(game.appid)}
                          className={`mt-2 py-1 px-3 rounded-lg text-sm ${
                            favorites.some((fav) => fav.appid === game.appid)
                              ? "bg-magenta-500 hover:bg-magenta-400 text-white"
                              : "bg-cyan-500 hover:bg-cyan-400 text-white"
                          }`}
                        >
                          {favorites.some((fav) => fav.appid === game.appid) ? "Прибрати з улюблених" : "Додати до улюблених"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {recommendations.lowPlaytimeGames && recommendations.lowPlaytimeGames.length > 0 && (
                  <>
                    <p className="text-gray-400 mt-8 mb-4">Недограні ігри (менше 5 годин):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                      {recommendations.lowPlaytimeGames.map((game) => (
                        <div
                          key={game.appid}
                          className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)] flex flex-col"
                        >
                          <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noopener noreferrer">
                            <img
                              src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                              alt={game.name}
                              className="w-full h-32 object-cover rounded-t-lg"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/460x215?text=No+Image")}
                            />
                          </a>
                          <h3 className="text-cyan-400 mt-2 font-bold">{game.name}</h3>
                          <p className="text-gray-300 text-sm flex-grow">{game.comment}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">Дані для рекомендацій відсутні</p>
        )}
      </div>
      <Footer />
    </>
  );
};