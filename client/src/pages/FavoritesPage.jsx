import { Typewriter } from "react-simple-typewriter";
import { Header, Footer } from "../components";
import { useAuthStore } from "../stores/useAuthStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FavoritesPage = () => {
  const { steamId, token, isInitialized, isLoading, isAuthenticated } = useAuthStore();
  const { favorites, fetchFavorites, removeFavorite, isLoading: favoritesLoading, error } = useFavoritesStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoading && !steamId) {
      navigate("/");
    }
    if (isAuthenticated && steamId && token) {
      fetchFavorites(steamId, token);
    }
  }, [isInitialized, isLoading, steamId, token, isAuthenticated, navigate, fetchFavorites]);

  if (!isInitialized || isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-cyan-400">Завантаження...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-animated-gradient pt-16 min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10 text-cyan-400">
          <Typewriter words={["Обрані Ігри"]} loop={1} cursor cursorStyle="_" typeSpeed={35} delaySpeed={100} />
        </h1>
        {!isAuthenticated ? (
          <p className="text-gray-400 mt-4">Ця сторінка доступна лише для авторизованих користувачів. Увійдіть через Steam.</p>
        ) : favoritesLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <div className="pulse-loader" />
          </div>
        ) : error ? (
          <p className="text-red-400 mt-4">{error}</p>
        ) : favorites.length > 0 ? (
          <div className="my-8 w-full max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((game) => (
                <div
                  key={game.appid}
                  className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)] flex flex-col"
                >
                  <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={game.imageUrl}
                      alt={game.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/460x215?text=No+Image")}
                    />
                  </a>
                  <h3 className="text-cyan-400 mt-2 font-bold">{game.name}</h3>
                  <button
                    onClick={() => removeFavorite(steamId, game.appid, token)}
                    className="mt-2 py-1 px-3 rounded-lg text-sm bg-magenta-500 hover:bg-magenta-400 text-white"
                  >
                    Прибрати з улюблених
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">У вас поки немає обраних ігор.</p>
        )}
      </div>
      <Footer />
    </>
  );
};