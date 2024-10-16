// src/services/authService.js
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth/auth";

const authStore = useAuthStore();

export function login(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "12345") {
        const userData = {
          email: email,
          name: "Juan",
          apellido: "Morales",
          role: {
            id: "1",
            nombre: "Administrador"
          },
        };
        // Establece el data en el store
        authStore.setUserData(userData);
        // Notificacion
        Notify.create({
          message: "Inicio de sesión exitoso",
          type: "positive",
        });

        //Armo la data
        const data = {
          userData,
          token: "jwt-auth",
        };
        localStorage.setItem("authToken", JSON.stringify(data));
        resolve(true);
      } else {
        Notify.create({
          message: "Correo o contraseña incorrectos",
          type: "negative",
        });
        reject(new Error("Correo o contraseña incorrectos"));
      }
    }, 2000);
  });
}

export function logout(router) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Eliminar el token del localStorage
      localStorage.removeItem("authToken");

      Notify.create({
        message: "Logout exitoso",
        type: "positive",
      });

      // Limpiar el estado de Vuex
      authStore.clearAuth();

      // Redirigir al login
      router.push("/login");
      resolve();
    }, 1000);
  });
}
