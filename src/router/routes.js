/* const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: "newValidador",
        name: "NewValidadorPage",
        component: () => import("src/pages/NewValidadorPage.vue"),
        // Esta ruta no tiene protección
      },
      {
        path: "pdf-viewer",
        name: "PdfViewerPage",
        component: () => import("src/pages/PdfViewerPage.vue"),
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
 */

import { authGuard } from "./guards/authGuard"; // Importa el guard
import { useAuthStore } from "../stores/auth/auth";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "IndexPage",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "newValidador",
        name: "NewValidadorPage",
        component: () => import("src/pages/Validator/NewValidadorPage.vue"),
        // Ruta pública
      },
      {
        path: "pdf-viewer",
        name: "PdfViewerPage",
        component: () => import("src/pages/PdfViewerPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "graphics",
        name: "GraphicPage",
        component: () => import("src/pages/GraphicsPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "usuario",
        name: "UserPage",
        component: () => import("src/pages/Users/UserPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "usuario/new",
        name: "UserFormsPage",
        component: () => import("src/pages/Users/UserFormsPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "usuario/edit/:id", // Asegúrate de que este nombre coincide con lo que usas
        name: "UserFormsEditPage",
        component: () => import("src/pages/Users/UserFormsPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "organismos",
        name: "OrganismsPage",
        component: () => import("src/pages/Organisms/OrganismsPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "calendar",
        name: "CalendarPage",
        component: () => import("src/pages/Calendar/CalendarPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "maps",
        name: "MapPage",
        component: () => import("src/pages/Maps/MapPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "products",
        name: "ProductsPage",
        component: () => import("src/pages/Products/ProductsPage.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("src/pages/auth/LoginPage.vue"),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      const isAuthenticated =
        authStore.isAuthenticated || !!localStorage.getItem("authToken");

      if (isAuthenticated) {
        next("/"); // Redirige al inicio si está autenticado
      } else {
        next(); // Permite el acceso si no está autenticado
      }
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
