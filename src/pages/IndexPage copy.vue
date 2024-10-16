<template>
  <q-page class="flex q-ma-md">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->
    <span class="text-h3" v-if="userData">
      Bienvenido, {{ userData.name }} {{ userData.apellido }}</span
    >
    <span class="text-h3" v-if="!userData">
      Bienvenido a pagina de validador de actas</span
    >
    <q-separator spaced="" />
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'IndexPage'
});
import { computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth/auth";

const authStore = useAuthStore();

// Accede a los datos completos del usuario desde el store
const userData = computed(() => authStore.getUserData);

onMounted(() => {
  authStore.initializeAuth(); // Inicializar los datos del usuario al montar el componente
});
</script>
