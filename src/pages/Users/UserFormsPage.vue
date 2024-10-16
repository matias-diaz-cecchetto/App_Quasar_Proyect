<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <span class="text-h4 q-my-md">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        <form @submit.prevent="submitForm">
          <div class="row justify-between q-my-md">
            <div class="col-5">
              <q-input v-model="formData.nombre" label="Nombre" hint="Ingrese su nombre" type="text" required />
            </div>
            <div class="col-5">
              <q-input v-model="formData.apellido" label="Apellido" hint="Ingrese su apellido" type="text" required />
            </div>
          </div>
          <div class="row justify-between q-my-md">
            <div class="col-5">
              <q-input v-model="formData.dni" label="DNI" hint="Ingrese su dni" type="number" required />
            </div>
            <div class="col-5">
                <q-input filled v-model="formData.fecha_nacimiento" mask="date" :rules="['date']" hint="Ingrese su fecha de nacimiento" label="fecha de nacimiento">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formData.fecha_nacimiento">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
            </div>
          </div>
          <div class="row justify-between q-my-md">
            <div class="col-5">
              <q-input v-model="formData.correo" label="Correo Electrónico" hint="Ingrese su email" type="email"
                required />
            </div>
            <div class="col-5">
              <q-select v-model="formData.organismo" label="Organismo" hint="Ingrese el organismo la cual pertenece"
                :options="organismoOptions" required />
            </div>
          </div>
          <q-toggle v-model="accept" label="Acepta terminos y condiciones" />

          <div class="flex justify-end">
            <q-btn type="submit" :loading="submitting" label="Guardar" class="q-ma-md" color="teal">
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>

            <!-- <q-btn type="submit" label="Guardar" color="positive" class="q-ma-md" /> -->
            <q-btn type="submit" label="Vovler" color="accent" class="q-ma-md" @click="goToUser" />
          </div>

        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const accept = ref(false)
const formData = ref({
  nombre: '',
  apellido: '',
  dni: '',
  correo: '',
  fecha_nacimiento: '',
  organismo: '',
  estado: 'Inactivo', // Estado por defecto ahora es 'Inactivo'
});

const organismoOptions = ref([
  { label: 'Organismo 1', id: '1' },
  { label: 'Organismo 2', id: '2' },
  { label: 'Organismo 3', id: '3' },
]);

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const submitting = ref(false);

const isEdit = computed(() => {
  return !!route.params.id; // Cambia userId a id
});

// Cargar datos del usuario para editar
onMounted(() => {
  console.log('Route params:', route.params); // Agrega esto para ver todos los parámetros
  console.log('Is Edit:', isEdit.value);

  if (isEdit.value) {
    loadUserData(route.params.id);
  }
});


function submitForm() {
  if (accept.value) {
    submitting.value = true;
    setTimeout(() => {
      if (isEdit.value) {
        // Lógica para actualizar el usuario
        console.log('Actualizar usuario:', formData.value);
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Usuario actualizado'
        });
      } else {
        // Lógica para registrar un nuevo usuario
        console.log('Registrar usuario:', formData.value);
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Usuario registrado'
        });
      }

      submitting.value = false;

      // Navegar de vuelta a la página de usuarios después de guardar
      router.push({ name: 'UserPage' });

    }, 3000); // Ajusta el tiempo si necesitas
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    });
  }
}


function loadUserData(userId) {
  // Aquí cargarías los datos del usuario. Este es un ejemplo.
  console.log(`Cargar datos del usuario con ID: ${userId}`);
  // Simulación de datos, reemplaza esto con una llamada a tu API
  formData.value = {
    nombre: 'Nombre Ejemplo',
    apellido: 'Apellido Ejemplo',
    dni: '12345678',
    correo: 'ejemplo@correo.com',
    fecha_nacimiento: '1990-01-01', // Formato de fecha
    organismo: 'organismo1', // Valor de ejemplo para organismo
    estado: 'Inactivo', // Asegúrate que el estado cargado sea 'Inactivo' si corresponde
  };
}

function goToUser() {
  router.push({ name: 'UserPage' });
}
</script>

<style scoped>
.my-card {
  max-width: 100%;
  /* Limitar el ancho máximo de la tarjeta */
  margin: auto;
  /* Centrar la tarjeta horizontalmente */
}
</style>
