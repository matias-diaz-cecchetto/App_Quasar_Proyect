<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title @click="goToIndex" class="my-title"
          >Proyect</q-toolbar-title
        >
        <!--  <img
          src="../assets/logos/logos_juntos_1.png"
          width="100px"
          alt=""
          srcset=""
        /> -->
        <!-- Botón de inicio de sesión -->
        <div v-if="!isAuthenticated">
          <q-btn flat @click="goToLogin" label="Login" icon="login" />
        </div>
        <!-- <div >
          <q-btn flat @click="handleLogout" label="Logout" icon="logout" />
        </div> -->
        <div v-if="isAuthenticated" class="q-pa-md">
          <q-btn-dropdown class="q-btn--transparent" icon="person">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                  @click="handleLogout"
                />
              </div>
            </div>
          </q-btn-dropdown>

          <!-- <q-btn-dropdown class="q-btn--transparent" :label="locale">
            <q-list>
              <q-item clickable v-close-popup @click="changeLanguage('en-US')">
                <q-item-section>English</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="changeLanguage('es')">
                <q-item-section>Español</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <EssentialLink
          v-for="link in filteredLinksList"
          :key="link.title"
          :title="link.title"
          :caption="link.caption"
          :icon="link.icon"
          :link="link.link"
        />
      </q-list>
    </q-drawer>

    <!-- Aquí es donde deben ir las páginas -->
    <q-page-container>
      <router-view />

      <!-- Floating Action Button -->
      <q-page-sticky position="bottom-right" :offset="fabPos">
        <q-fab
          icon="add"
          direction="up"
          color="secondary"
          :disable="draggingFab"
          v-touch-pan.prevent.mouse="moveFab"
        >
          <q-fab-action
            v-if="isAuthenticated"
            @click="onClick('AddUser')"
            color="primary"
            :disable="draggingFab"
            icon="person_add"
          >
            <q-tooltip>Agregar Usuario</q-tooltip>
          </q-fab-action>
          <q-fab-action
            v-if="isAuthenticated"
            @click="onClick('Message')"
            color="primary"
            :disable="draggingFab"
            icon="mail"
          >
            <q-tooltip>Mensajes</q-tooltip>
          </q-fab-action>
          <q-fab-action
            v-if="isAuthenticated"
            @click="onClick('Notify')"
            color="primary"
            :disable="draggingFab"
            icon="alarm"
          >
            <q-tooltip>Notificaciones</q-tooltip>
          </q-fab-action>
          <q-fab-action
            v-if="!isAuthenticated"
            @click="onClick('Login')"
            color="primary"
            :disable="draggingFab"
            icon="login"
          >
            <q-tooltip>Login</q-tooltip>
          </q-fab-action>
          <!-- v-if="isAuthenticated" -->
        </q-fab>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";
import { linksList } from "../router/link-list";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth/auth";
import { useQuasar } from "quasar";
import { logout } from "../services/auth/authService"; // Importa tu authService
import { Notify } from "quasar";

const mobileData = ref(false);
const bluetooth = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const leftDrawerOpen = ref(false);
const $q = useQuasar(); // Inicializa Quasar
const isAuthenticated = computed(
  () => authStore.isAuthenticated || !!localStorage.getItem("authToken")
);
// Boton flotante
const fabPos = ref([18, 18]);
const draggingFab = ref(false);

// Filtrar los enlaces según la autenticación
const filteredLinksList = computed(() => {
  return linksList.filter((link) => {
    // Si el enlace requiere autenticación, solo mostrar si está autenticado
    return link.authentication ? isAuthenticated.value : true;
  });
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Función para redirigir al login
function goToLogin() {
  router.push({ name: "LoginPage" });
}

// Manejar logout
async function handleLogout() {
  $q.loading.show({ delay: 400 }); // Muestra el spinner

  await logout(router).then(() => {
    $q.loading.hide(); // Oculta el spinner
  });

  authStore.clearAuth();
}

function goToIndex() {
  router.push({ name: "IndexPage" });
}

// Metodos del boton flotante:

function onClick(action) {
  switch (action) {
    case "AddUser":
      router.push({ name: "UserPage" });
      break;
    case "Message":
      Notify.create({
        message: "Message",
        type: "positive",
      });
      break;
    case "Notify":
      Notify.create({
        message: "Notify",
        type: "positive",
      });
      break;
    case "Login":
      router.push({ name: "LoginPage" });
      break;

    default:
      break;
  }
}

function moveFab(ev) {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;

  fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y];
}
</script>

<style scoped>
.my-title {
  cursor: pointer;
}
</style>
