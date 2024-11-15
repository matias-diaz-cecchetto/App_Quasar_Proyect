<template>
  <q-dialog v-model="dialogVisible" @before-show="step = 4">
    <q-card>
      <q-card-section>
        <div class="text-h6">¿Cómo pedir?</div>
      </q-card-section>

      <q-card-section style="padding: 0px;">
        <q-stepper v-model="step" vertical color="accent" animated default-icon="check">
          <q-step :name="1" title="Seleccione los productos que desea" color="accent" :done="step > 1">
            Seleccione todos los productos que desea de la tienda, inserte su cantidad y opciones.
            <q-stepper-navigation>
              <q-btn @click="step = 2" color="accent" label="Continuar" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Revisa tu pedido y complete los datos" color="accent" :done="step > 2">
            Luego revise que todo lo que seleccionó y complete los datos personales para la tienda.
            <q-stepper-navigation>
              <q-btn @click="step = 3" color="accent" label="Continuar" />
              <q-btn flat @click="step = 1" color="accent" label="Atrás" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Generamos tu pedido para que la tienda lo reciba por su WhatsApp" color="accent"
            :done="step > 3">
            En este paso le enviamos un WhatsApp a la tienda para realizar su pedido.
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => (false),
  },
});

const emit = defineEmits(['update:modelValue']);
const dialogVisible = ref(props.modelValue);
const step = ref(1);

watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal;
});

watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal);
});
</script>
