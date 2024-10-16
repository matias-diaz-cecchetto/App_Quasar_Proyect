// src/store/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  // Es una función que retorna un objeto que representa el estado del store.
  state: () => ({
    // Guarda el token de autenticación del usuario, que puede ser utilizado para validar la sesión.
    authToken: null,
    // Guarda almacenar datos del usuario autenticado.
    userData: null,
  }),

  // Son funciones que permiten acceder a propiedades derivadas del estado
  getters: {
    //  Este getter verifica si el usuario está autenticado comprobando si
    isAuthenticated(state) {
      // tiene un valor. Devuelve true si el token existe, o false en caso contrario.
      return !!state.authToken;
    },
    userEmail(state) {
      return state.userData?.email || null; // Getter para el email del usuario
    },
    getUserData(state) {
      return state.userData; // Getter para todos los datos del usuario
    },
  },

  // Son métodos que permiten modificar el estado.
  actions: {
    // Almacena el token de autenticación en el estado.
    setAuthToken(token) {
      this.authToken = token;
    },
    // Almacena los datos del usuario en el estado.
    setUserData(data) {
      this.userData = data;
    },
    // Limpia el estado, estableciendo authToken y userData a null, lo que podría usarse al cerrar sesión.
    clearAuth() {
      this.authToken = null;
      this.userData = null;
    },
    /**
     * Verifica si hay un token guardado en localStorage al cargar la aplicación.
     * Si existe, establece el token y el email del usuario en el estado.
     */
    initializeAuth() {
      // Verifica si hay un token guardado en localStorage
      const storedAuth = JSON.parse(localStorage.getItem("authToken"));
      if (storedAuth && storedAuth.token) {
        this.setAuthToken(storedAuth.token);
        this.setUserData(storedAuth.userData);
      }
    },
  },
});
