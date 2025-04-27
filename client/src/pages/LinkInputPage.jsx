import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Logo from "../assets/beepslogo.png";
import "../app/styles/LinkInputPageGradient.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "axios";

export const LinkInputPage = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const steamOpenIDLink = import.meta.env.VITE_API_URL + "/auth/steam";

  const handleSteamLinkSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    const steamLink = event.target.steamLink.value.trim();

    const steamId64Regex = /^https:\/\/steamcommunity\.com\/profiles\/(7656119[0-9]{10})$/;
    const vanityUrlRegex = /^https:\/\/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)$/;

    const id64Match = steamLink.match(steamId64Regex);
    const vanityMatch = steamLink.match(vanityUrlRegex);

    let steamId;

    if (id64Match) {
      steamId = id64Match[1];
    } else if (vanityMatch) {
      const vanityUrl = vanityMatch[1];
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/resolve-steamid?vanityurl=${vanityUrl}`);
        steamId = response.data.steamId;
      } catch (err) {
        setError("Не вдалося знайти профіль за цим кастомним URL.");
        setIsSubmitting(false);
        return;
      }
    } else {
      setError("Введіть коректне посилання на Steam-профіль");
      setIsSubmitting(false);
      return;
    }

    localStorage.removeItem("jwt_token");
    await setUser({ steamId });
    setSuccess("Steam ID успішно встановлено: " + steamId);
    setIsSubmitting(false);
    navigate("/charts", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient text-gray-100">
      <motion.div
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-md border border-gray-600/40 p-6 rounded-lg shadow-[0_0_20px_rgba(0,120,255,0.5)] text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <motion.img
            whileHover={{
              rotate: 10,
              scale: 1.1,
              filter: "drop-shadow(0px 0px 10px rgba(255, 0, 255, 0.8))",
            }}
            className="w-16 h-16 mb-2 cursor-pointer"
            src={Logo}
            alt="Логотип"
          />
          <h1 className="text-3xl font-bold tracking-wide text-blue-400">
            <Typewriter
              words={["Beeps SteamHelper"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={35}
              delaySpeed={100}
            />
          </h1>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          <Typewriter
            words={["Ласкаво просимо!", "Введіть посилання на Steam-акаунт."]}
            loop={true}
            cursor
            cursorStyle=""
            typeSpeed={50}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </h2>

        <form className="submitLink" onSubmit={handleSteamLinkSubmit}>
          <motion.input
            whileFocus={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(0, 120, 255, 0.5)" }}
            transition={{ duration: 0.3 }}
            type="text"
            placeholder="Вставте посилання на Steam-профіль..."
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            name="steamLink"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-400 mb-4" data-testid="error-message">{error}</p>}
          {isSubmitting && <p className="text-cyan-400 mb-4">Обробка...</p>}
          {success && <p className="text-green-400 mb-4">{success}</p>}

          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.9 }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition disabled:bg-gray-600"
            type="submit"
            disabled={isSubmitting}
          >
            Переглянути
          </motion.button>
          <a
            href={steamOpenIDLink}
            className="block text-center w-full bg-blue-950 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition my-4"
          >
            Увійти через Steam
          </a>
        </form>
      </motion.div>
    </div>
  );
};