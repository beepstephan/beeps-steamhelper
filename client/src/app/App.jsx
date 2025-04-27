import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { AllRoutes } from "../routes/AllRoutes";
import "./styles/LinkInputPageGradient.css";

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      localStorage.setItem("jwt_token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    initialize();
  }, [initialize]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="pulse-loader" />
      </div>
    );
  }

  return <AllRoutes />;
}

export default App;