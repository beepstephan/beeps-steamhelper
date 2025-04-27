import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";

export const ProtectedRoutes = () => {
  const { isAuthenticated, isInitialized, initialize, steamId } = useAuthStore();
  const viewedSteamId = localStorage.getItem("viewedSteamId");

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const hasAccess = isAuthenticated || !!viewedSteamId;

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};