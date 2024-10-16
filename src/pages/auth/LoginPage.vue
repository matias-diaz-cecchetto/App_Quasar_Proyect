<template>
  <div class="q-pa-md q-gutter-sm absolute">
    <q-btn @click="goToHome" color="primary" label="Ir al Inicio" />
  </div>
  <div class="login-page flex flex-center">

    <q-card style="width: 350px">
      <q-card-section class="text-h6">Iniciar Sesión</q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="useForm.email"
            filled
            label="Correo Electrónico"
            type="email"
            required
            lazy-rules
            :rules="[(val) => !!val || 'El correo es obligatorio']"
          />

          <q-input
            v-model="useForm.password"
            filled
            label="Contraseña"
            type="password"
            required
            lazy-rules
            :rules="[(val) => !!val || 'La contraseña es obligatoria']"
          />

          <q-btn
            label="Ingresar"
            type="submit"
            color="primary"
            :loading="loading"
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineOptions({
  name: "LoginPage",
});
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "src/services/auth/authService";

const router = useRouter();

// const email = ref("");
// const password = ref("");
const loading = ref(false);

const useForm = ref({
  email: "",
  password: "",
});

function onSubmit() {
  loading.value = true;

  // Simulación de autenticación
  loading.value = true;

  login(useForm.value.email, useForm.value.password)
    .then(() => {
      // Redirigir al index si el login es exitoso
      router.push("/");
    })
    .catch((error) => {
      console.error(error.message); // Manejo de error
    })
    .finally(() => {
      loading.value = false;
    });
}

function goToHome() {
  router.push("/");
}
</script>

<style scoped>
.login-page {
  height: 100vh;
}
</style>
