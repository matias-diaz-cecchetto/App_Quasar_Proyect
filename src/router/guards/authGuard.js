// src/router/guards/authGuard.js
import { useAuthStore } from "../../stores/auth/auth";

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated =
    authStore.isAuthenticated || !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    next("/login");
  } else {
    // Si está autenticado, permitir el acceso
    next();
  }
};
