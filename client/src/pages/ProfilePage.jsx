import { Typewriter } from "react-simple-typewriter";
import { Header, Footer } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useEffect } from "react";

const genreTranslations = {
  Action: "Екшен",
  Adventure: "Пригоди",
  RPG: "Рольова гра",
  Strategy: "Стратегія",
  Simulation: "Симулятор",
  Sports: "Спорт",
  Racing: "Гонки",
  MOBA: "MOBA",
  Indie: "Інді",
  Casual: "Казуальна",
  "Massively Multiplayer": "Масовий мультиплеєр",
  Puzzle: "Головоломка",
  Platformer: "Платформер",
  Shooter: "Шутер",
  Fighting: "Файтинг",
  Stealth: "Стелс",
  Survival: "Виживання",
  Horror: "Жахи",
  "Tower Defense": "Захист веж",
  "Turn-Based": "Покрокова",
  "Real-Time Strategy": "Стратегія в реальному часі",
  "Visual Novel": "Візуальна новела",
  "Card Game": "Карткова гра",
  Music: "Музична",
  Party: "Вечірка",
  Education: "Освітня",
  Other: "Інше",
};

export const ProfilePage = () => {
  const { steamId: steamIdFromParams } = useParams();
  const {
    username,
    steamId: authSteamId,
    avatar,
    games,
    totalGames,
    activity,
    token,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    isInitialized,
    viewProfile,
  } = useAuthStore();
  const {
    recommendations,
    favoriteGenres,
    mood,
    status,
    multiplayerStats,
    isLoading: profileLoading,
    error: profileError,
    fetchProfileExtras,
  } = useProfileStore();
  const {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isLoading: favoritesLoading,
  } = useFavoritesStore();
  const navigate = useNavigate();

  const targetSteamId = steamIdFromParams || authSteamId;
  const isOwnProfile = isAuthenticated && targetSteamId === authSteamId;

  useEffect(() => {
    if (isInitialized && !authLoading && targetSteamId) {
      if (steamIdFromParams && steamIdFromParams !== authSteamId) {
        viewProfile(steamIdFromParams);
      }
      fetchProfileExtras(targetSteamId);
      if (isAuthenticated && token && isOwnProfile) {
        fetchFavorites(targetSteamId, token);
      }
    }
  }, [isInitialized, authLoading, targetSteamId, steamIdFromParams, authSteamId, viewProfile, fetchProfileExtras, fetchFavorites, isAuthenticated, token, isOwnProfile]);

  useEffect(() => {
    if (isInitialized && !authLoading && !targetSteamId) {
      navigate("/");
    }
  }, [isInitialized, authLoading, targetSteamId, navigate]);

  const totalPlaytime = games.reduce((sum, game) => sum + game.playtime, 0);

  const handleFavoriteToggle = (appid) => {
    if (!isOwnProfile) {
      alert("Ви не можете змінювати улюблені ігри для чужого профілю!");
      return;
    }
    if (favorites.some((fav) => fav.appid === appid)) {
      removeFavorite(targetSteamId, appid, token);
    } else {
      addFavorite(targetSteamId, appid, token);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-animated-gradient pt-16 min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10 text-cyan-400">
          <Typewriter
            words={["Персональний Ігровий Профіль"]}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={35}
            delaySpeed={100}
          />
        </h1>
        {authLoading || profileLoading || favoritesLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <div className="pulse-loader" data-testid="pulse-loader" />
          </div>
        ) : authError || profileError ? (
          <p className="text-red-400 mt-4">{authError || profileError}</p>
        ) : username ? (
          <div className="my-8 w-full max-w-4xl bg-gray-900/80 p-6 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <div className="flex items-center gap-6 mb-6">
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold text-cyan-400">{username}</h2>
                <p className="text-gray-300">SteamID: {targetSteamId}</p>
                <p className="text-gray-400">Статус: {status === "online" ? "Онлайн" : "Офлайн"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400">Статистика</h3>
                <ul className="text-gray-200 space-y-2">
                  <li>Всього ігор: <span className="text-cyan-400">{totalGames}</span></li>
                  <li>Час у топ-5: <span className="text-cyan-400">{totalPlaytime} годин</span></li>
                  <li>Активність (2 тижні): <span className="text-cyan-400">{activity?.last2Weeks || 0} годин</span></li>
                  <li>Ігровий настрій: <span className="text-cyan-400">{mood}</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400">Мультиплеєр</h3>
                <ul className="text-gray-200 space-y-2">
                  <li>Час у мультиплеєрі: <span className="text-cyan-400">{multiplayerStats.multiplayerTime} годин</span></li>
                  <li>Час у синглплеєрі: <span className="text-cyan-400">{multiplayerStats.singleplayerTime} годин</span></li>
                  <li>Час у змішаних: <span className="text-cyan-400">{multiplayerStats.mixedTime} годин</span></li>
                </ul>
              </div>
            </div>

            {games.length ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Топ-5 ігор</h3>
                <ul className="text-gray-200 space-y-2">
                  {games.slice(0, 5).map((game) => (
                    <li key={game.name}>
                      {game.name} - <span className="text-cyan-400">{game.playtime} годин</span> ({genreTranslations[game.genre] || game.genre})
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {favoriteGenres.length ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Улюблені жанри</h3>
                <ul className="text-gray-200 space-y-2">
                  {favoriteGenres.map((genre) => (
                    <li key={genre.genre}>
                      {genreTranslations[genre.genre] || genre.genre} - <span className="text-cyan-400">{genre.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isOwnProfile && favorites.length ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Улюблені ігри</h3>
                <ul className="text-gray-200 space-y-2">
                  {favorites.map((game) => (
                    <li key={game.appid} className="flex items-center justify-between">
                      <span>{game.name}</span>
                      <button
                        onClick={() => handleFavoriteToggle(game.appid)}
                        className="py-1 px-3 rounded-lg text-sm bg-magenta-500 hover:bg-magenta-400 text-white"
                      >
                        Видалити з улюблених
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : isOwnProfile && isAuthenticated ? (
              <p className="text-gray-400 mb-6">Улюблені ігри відсутні</p>
            ) : null}

            {recommendations.length ? (
              <div>
                <h3 className="text-xl font-semibold text-cyan-400">Рекомендації для вас</h3>
                <ul className="text-gray-200 space-y-2">
                  {recommendations.map((rec) => (
                    <li key={rec.appid} className="flex items-center justify-between">
                      <span>
                        {rec.name} - <span className="text-gray-400">{rec.comment}</span>
                      </span>
                      {isOwnProfile && (
                        <button
                          onClick={() => handleFavoriteToggle(rec.appid)}
                          className={`py-1 px-3 rounded-lg text-sm ${
                            favorites.some((fav) => fav.appid === rec.appid)
                              ? "bg-magenta-500 hover:bg-magenta-400 text-white"
                              : "bg-cyan-500 hover:bg-cyan-400 text-white"
                          }`}
                        >
                          {favorites.some((fav) => fav.appid === rec.appid) ? "Видалити з улюблених" : "Додати до улюблених"}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">Немає даних про профіль</p>
        )}
      </div>
      <Footer />
    </>
  );
};