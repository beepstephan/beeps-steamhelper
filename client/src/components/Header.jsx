import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Logo from "../assets/beepslogo.png";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { username, avatar, steamId, token, logout, isInitialized, isAuthenticated } = useAuthStore((state) => ({
    username: state.username,
    avatar: state.avatar,
    steamId: state.steamId,
    token: state.token,
    logout: state.logout,
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
  }));

  if (!isInitialized) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const displayName = token 
    ? username || "Гість" 
    : username 
      ? `${username} (перегляд)` 
      : steamId 
        ? `Steam ID: ${steamId}` 
        : "Гість";

  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-md border-b-2 border-cyan-500 fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="flex items-center space-x-3">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-cyan-400">Beeps SteamHelper</span>
        </Link>

        <nav className="hidden md:flex space-x-6 text-gray-300">
          <NavLink to="/charts" className="hover:text-cyan-400 transition">
            Статистика
          </NavLink>
          <NavLink to="/recommendations" className="hover:text-cyan-400 transition">
            Рекомендації
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className="hover:text-cyan-400 transition">
              Обрані
            </NavLink>
          )}
          <NavLink to="/profile" className="hover:text-cyan-400 transition">
            Профіль
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <span className="text-gray-300">{displayName}</span>
          <img
            src={avatar || "https://i.pravatar.cc/40"}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-cyan-500"
          />
          {token && (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-cyan-400 transition"
            >
              Вийти
            </button>
          )}
        </div>

        <button className="md:hidden text-cyan-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`absolute top-16 left-0 w-full bg-gray-900/95 border-t border-cyan-500 p-5 flex flex-col items-center space-y-4 transition-all duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-gray-300 text-lg font-medium">{displayName}</span>
          <img
            src={avatar || "https://i.pravatar.cc/40"}
            alt="Avatar"
            className="w-14 h-14 rounded-full border-2 border-cyan-500"
          />
        </div>
        <NavLink
          to="/charts"
          onClick={() => setMenuOpen(false)}
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          Статистика
        </NavLink>
        <NavLink
          to="/recommendations"
          onClick={() => setMenuOpen(false)}
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          Рекомендації
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/favorites"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Обрані
          </NavLink>
        )}
        <NavLink
          to="/profile"
          onClick={() => setMenuOpen(false)}
          className="text-gray-300 hover:text-cyan-400 transition"
        >
          Профіль
        </NavLink>
        {token && (
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Вийти
          </button>
        )}
      </div>
    </header>
  );
};