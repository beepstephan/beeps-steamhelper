import { Typewriter } from "react-simple-typewriter";
import { Header, Footer } from "../components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import "../app/styles/LinkInputPageGradient.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, MatrixController, MatrixElement);

export const ChartsPage = () => {
  const { username, steamId, games, activity, isAuthenticated, isLoading, error, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoading && !steamId) {
      navigate("/");
    }
  }, [isInitialized, isLoading, steamId, navigate]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="pulse-loader" />
      </div>
    );
  }

  const genreTranslations = {
    "Action": "Екшен",
    "Adventure": "Пригоди",
    "RPG": "Рольова гра",
    "Strategy": "Стратегія",
    "Simulation": "Симулятор",
    "Sports": "Спорт",
    "Racing": "Гонки",
    "MOBA": "MOBA",
    "Indie": "Інді",
    "Casual": "Казуальна",
    "Massively Multiplayer": "Масовий мультиплеєр",
    "Puzzle": "Головоломка",
    "Platformer": "Платформер",
    "Shooter": "Шутер",
    "Fighting": "Файтинг",
    "Stealth": "Стелс",
    "Survival": "Виживання",
    "Horror": "Жахи",
    "Tower Defense": "Захист веж",
    "Turn-Based": "Покрокова",
    "Real-Time Strategy": "Стратегія в реальному часі",
    "Visual Novel": "Візуальна новела",
    "Card Game": "Карткова гра",
    "Music": "Музична",
    "Party": "Вечірка",
    "Education": "Освітня",
    "Other": "Інше",
  };

  const multiplayerGames = games.filter((game) => game.isMultiplayer && !game.isMixed);
  const singleplayerGames = games.filter((game) => !game.isMultiplayer && !game.isMixed);
  const mixedGames = games.filter((game) => game.isMixed);

  const multiplayerTime = multiplayerGames.reduce((sum, game) => sum + game.playtime, 0);
  const singleplayerTime = singleplayerGames.reduce((sum, game) => sum + game.playtime, 0);
  const mixedTime = mixedGames.reduce((sum, game) => sum + game.playtime, 0);

  const onlineVsOfflineData = {
    labels: ["Мультиплеєр", "Одиночна", "Змішана"],
    datasets: [
      {
        label: "Час гри (години)",
        data: [multiplayerTime, singleplayerTime, mixedTime],
        backgroundColor: [
          "rgba(154, 37, 250, 0.7)",
          "rgba(0, 255, 255, 0.7)",
          "rgba(255, 165, 0, 0.7)"
        ],
        borderColor: [
          "rgba(154, 37, 250, 1)",
          "rgba(0, 255, 255, 1)",
          "rgba(255, 165, 0, 1)"
        ],
        borderWidth: 2,
      },
    ],
  };

  const onlineVsOfflineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#00FFFF", font: { family: "'Orbitron', sans-serif'" } } },
      title: { display: true, text: "Мультиплеєр vs Одиночна vs Змішана", color: "#FF00FF", font: { size: 20, family: "'Orbitron', sans-serif'" } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const label = context.label;
            const value = context.raw;
            let gameList = '';
            if (index === 0) gameList = multiplayerGames.map(g => `${g.name}: ${g.playtime} год`).join(', ');
            if (index === 1) gameList = singleplayerGames.map(g => `${g.name}: ${g.playtime} год`).join(', ');
            if (index === 2) gameList = mixedGames.map(g => `${g.name}: ${g.playtime} год`).join(', ');
            return `${label}: ${value} год (${gameList})`;
          },
        },
      },
    },
  };

  const barChartData = {
    labels: games.map((game) => game.name),
    datasets: [
      {
        label: "Час гри (години)",
        data: games.map((game) => game.playtime),
        backgroundColor: "rgba(0, 255, 255, 0.7)",
        borderColor: "rgba(0, 255, 255, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(201, 139, 252, 0.7)",
        hoverBorderColor: "rgba(175, 87, 247, 1)",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#00FFFF", font: { family: "'Orbitron', sans-serif'" } } },
      title: { display: true, text: "Топ-10 ігор за часом гри", color: "#FF00FF", font: { size: 20, family: "'Orbitron', sans-serif'" } },
    },
    scales: {
      x: { ticks: { color: "#00FFFF" } },
      y: { ticks: { color: "#00FFFF" }, beginAtZero: true, grid: { color: "rgba(0, 255, 255, 0.2)" } },
    },
  };

  const pieChartData = {
    labels: [...new Set(games.map((game) => genreTranslations[game.genre] || game.genre))],
    datasets: [
      {
        label: "Час гри за жанрами",
        data: [...new Set(games.map((game) => genreTranslations[game.genre] || game.genre))].map((genre) =>
          games.filter((g) => (genreTranslations[g.genre] || g.genre) === genre).reduce((sum, g) => sum + g.playtime, 0)
        ),
        backgroundColor: ["rgba(154, 37, 250, 0.7)", "rgba(175, 87, 247, 0.7)", "rgba(201, 139, 252, 0.7)", "rgba(222, 184, 252, 0.7)", "rgba(237, 217, 252, 0.7)"],
        borderColor: ["rgba(154, 37, 250, 1)", "rgba(175, 87, 247, 1)", "rgba(201, 139, 252, 1)", "rgba(211, 149, 252, 1)", "rgba(240, 229, 252, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#00FFFF", font: { family: "'Orbitron', sans-serif'" } } },
      title: { display: true, text: "Розподіл часу гри за жанрами", color: "#FF00FF", font: { size: 20, family: "'Orbitron', sans-serif'" } },
    },
  };

  const activityChartData = {
    labels: ["Останні 3 дні", "Останні 2 тижні", "Останній місяць"],
    datasets: [
      {
        label: "Час гри (години)",
        data: [activity?.last3Days || 0, activity?.last2Weeks || 0, activity?.lastMonth || 0],
        backgroundColor: "rgba(0, 255, 255, 0.7)",
        borderColor: "rgba(0, 255, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 0, 255, 1)",
        pointBorderColor: "#FF00FF",
      },
    ],
  };

  const activityChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#00FFFF", font: { family: "'Orbitron', sans-serif'" } } },
      title: { display: true, text: "Активність у Steam", color: "#FF00FF", font: { size: 20, family: "'Orbitron', sans-serif'" } },
    },
    scales: {
      x: { ticks: { color: "#00FFFF" } },
      y: { ticks: { color: "#00FFFF" }, beginAtZero: true, grid: { color: "rgba(0, 255, 255, 0.2)" } },
    },
  };

  return (
    <>
      <Header />
      <div className="bg-animated-gradient pt-16 min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10 text-cyan-400">
          <Typewriter words={["Статистика та Графіки"]} loop={1} cursor cursorStyle="_" typeSpeed={35} delaySpeed={100} />
        </h1>
        {error ? (
          <p className="text-red-400 mt-4">{error}</p>
        ) : username ? (
          <>
            <p className="text-gray-400 mt-4 max-w-2xl text-center">
              {isAuthenticated ? `Вітаємо, ${username} (Steam ID: ${steamId})!` : `Перегляд профілю ${username} (Steam ID: ${steamId}).`}
            </p>
            {games.length > 0 ? (
              <div className="my-8 w-full max-w-2xl space-y-8">
                <div className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  <Line data={activityChartData} options={activityChartOptions} />
                </div>
                <div className="bg-gray-900/80 p-4 rounded-lg border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  <Pie data={onlineVsOfflineData} options={onlineVsOfflineOptions} />
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mt-4">Дані про ігри недоступні. Можливо, профіль прихований.</p>
            )}
          </>
        ) : (
          <p className="text-gray-400 mt-4">Немає даних про профіль</p>
        )}
      </div>
      <Footer />
    </>
  );
};