<template>
  <div class="new-section">
    <div class="new-section-bg"></div>
    <div class="content">
      <h1>Bienvenidos</h1>
      <p>Este es un ejemplo de una sección con fondo oscurecido.</p>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.new-section {
  position: relative;
  height: 600px;
  /* Toma el alto completo de la ventana */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  /* Texto blanco para que contraste con el fondo oscuro */
  overflow: hidden;
}

/* Oscuridad encima del fondo */
.new-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #000000;
  /* Color negro */
  opacity: 0.5;
  /* Oscuridad (ajustable entre 0 y 1) */
  z-index: 1;
  /* Se coloca encima del fondo */
}

/* Imagen de fondo */
.new-section .new-section-bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-image: url('../../../mocks/img/portadaBar.jpg');
  /* Ajusta la ruta de la imagen */
  background-size: cover;
  background-position: center;
  z-index: 0;
  /* Se coloca detrás del contenido */
  animation: zoomInOut 20s ease infinite;
  /* Animación opcional */
}

/* Contenido dentro de la sección */
.new-section .content {
  /* position: relative; */
  /* Para que esté por encima del fondo y de la oscuridad */
  z-index: 2;
  /* Asegura que el contenido esté encima de todo */
  text-align: center;
}

/* Animación opcional de zoom */
@keyframes zoomInOut {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}
</style>
