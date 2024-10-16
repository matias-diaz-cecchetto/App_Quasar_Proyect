// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "../../src/App.vue";
import router from "../router";

const app = createApp(App);

// Crear una instancia de Pinia
const pinia = createPinia();

// Usar Pinia en la aplicación
app.use(pinia);
app.use(router);

app.mount("#app");
