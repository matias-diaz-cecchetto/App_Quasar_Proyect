<template>
  <q-dialog v-model="localIsNewEvent">
    <q-card style="width: 900px">
      <q-card-section>
        <div class="text-h6 q-ma-md">Nuevo evento para {{ selectedDateDialog }}</div>
        <q-list>
          <q-item>
            <q-item-section>
              <div class="q-pa-md">
                <q-form @submit="handleSubmit" @reset="onReset" class="q-gutter-md">

                  <!-- Titulo -->
                  <q-input filled v-model="localFormEvent.title" label="Titulo *" hint="Titulo" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Por favor, escribe algo']" />

                  <!-- Detalle como Textarea -->
                  <q-input filled v-model="localFormEvent.details" label="Detalle *" hint="Detalle" type="textarea"
                    lazy-rules :rules="[val => val && val.length > 0 || 'Por favor, escribe algo']" />

                  <!-- Horario usando q-time para seleccionar la hora -->
                  <q-input filled v-model="localFormEvent.time" label="Horario *" mask="##:##" hint="HH:MM" lazy-rules
                    :rules="[val => !!val || 'Por favor, selecciona un horario']">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer q-ml-sm">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="bg-white rounded">
                          <q-time v-model="localFormEvent.time" format24h>
                            <div class="row items-center justify-end q-pt-sm">
                              <q-btn flat label="Cerrar" color="primary" v-close-popup />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <!-- Duración en minutos usando un input numérico -->
                  <q-input filled v-model.number="localFormEvent.duration" label="Duración (en minutos) *"
                    hint="Duración en minutos" type="number" min="0" lazy-rules
                    :rules="[val => val > 0 || 'Por favor, ingresa un valor positivo']" />

                  <!-- Selector de Color usando q-select con opciones de colores por nombre -->
                  <q-select filled v-model="localFormEvent.bgcolor" label="Color *" hint="Selecciona el color"
                    :options="colorOptions" map-options>
                    <template v-slot:append>
                      <q-icon :style="{ color: localFormEvent.bgcolor.value }" name="lens" class="q-mr-sm" />
                    </template>
                  </q-select>

                  <!-- Botones de Acción -->
                  <q-card-actions class="q-mt-md">
                    <q-btn flat :loading="submitting" label="Submit" type="submit" color="primary" />
                    <q-btn flat label="Cancelar" @click="handleCancel" />
                  </q-card-actions>

                </q-form>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// Definición de las propiedades que recibe el componente
const props = defineProps({
  isNewEvent: {
    type: Boolean,
    required: true
  },
  selectedDateDialog: {
    type: String,
    required: true
  },
  colorOptions: {
    type: Array,
    required: true
  },
  submitting: {
    type: Boolean,
    default: false
  }
});

// Definición de los eventos que emitirá el componente
const emit = defineEmits(['submit', 'cancel']);

// Estado local del diálogo
const localIsNewEvent = ref(props.isNewEvent);

// Estado local del formulario
const localFormEvent = ref({
  title: "",
  details: "",
  time: "",
  duration: 0,
  bgcolor: ""
});

// Sincronizar la prop isNewEvent con la variable local
watch(() => props.isNewEvent, (newValue) => {
  localIsNewEvent.value = newValue;
});

// Método para manejar el envío del formulario
const handleSubmit = () => {
  emit('submit', { ...localFormEvent.value });
};

// Método para manejar la cancelación
const handleCancel = () => {
  emit('cancel');
};

// Método para resetear el formulario
const onReset = () => {
  localFormEvent.value = {
    title: "",
    details: "",
    time: "",
    duration: 0,
    bgcolor: ""
  };
};
</script>

<style scoped>
/* Aquí puedes agregar estilos personalizados si es necesario */
</style>
