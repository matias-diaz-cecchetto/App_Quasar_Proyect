<template>
  <q-dialog v-model="isOpen" @hide="closeDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Detalles de {{title}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div>
          <template v-for="column in columns" :key="column.field">
            <strong>{{ column.label }}:</strong> {{ row[column.field] ? row[column.field] : ' - ' }} <br />
          </template>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  row: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: () => ''
  }
});

const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false);

// Verifica el valor de modelValue para abrir o cerrar el diálogo
watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

// Cierra el diálogo y emite el evento para actualizar el modelo
function closeDialog() {
  isOpen.value = false;
  emit('update:modelValue', false);
}
</script>
