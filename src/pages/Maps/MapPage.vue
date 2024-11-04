<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between">
      <span class="text-h4">Mapa</span>
    </div>

    <q-separator spaced="" />

    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

defineOptions({
  name: "MapPage",
});

// Hacer `ubication` reactivo para poder acceder a su valor dinámico
const ubication = ref(null);

onMounted(() => {
  // Obtener la ubicación actual del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        ubication.value = { latitude, longitude };
        console.log("Ubicación actual: ", ubication.value);

        // Llamar a la función para crear el mapa
        getMap();
      },
      (error) => {
        console.error("Error obteniendo la ubicación:", error);
      }
    );
  } else {
    console.error("La geolocalización no está soportada en este navegador.");
  }
});

function getMap() {
  // Crear el mapa una vez que el DOM esté listo
  const map = L.map('map').setView([40.7128, -74.0060], 13); // Coordenadas de Nueva York iniciales

  // Agregar el tile layer de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Verificar si la ubicación está disponible antes de mover el mapa
  if (ubication.value) {
    const { latitude, longitude } = ubication.value;

    // Centrar el mapa en la ubicación actual
    map.setView([latitude, longitude], 13);

    // Agregar un marcador en la ubicación actual
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup('<b>¡Estás aquí!</b>').openPopup();

    L.circle([latitude, longitude], {
      color: 'blue',
      fillColor: '#30a1ff',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map).bindPopup("Área de 500 metros alrededor.");

    // Polígono
    const polygonCoords = [
      [40.73061, -73.935242],
      [{ latitude, longitude }],
      [40.729101, -73.921292]
    ];
    L.polygon(polygonCoords, { color: 'green' }).addTo(map).bindPopup("Área marcada.");

  }


}
</script>

<style>
#map {
  height: 100%;
}
</style>
