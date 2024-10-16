import { useAuthStore } from "../store/auth/auth";

export default {
  name: "App",

  created() {
    const authStore = useAuthStore();
    // Inicializa la autenticación desde localStorage
    authStore.initializeAuth();
  },
};
