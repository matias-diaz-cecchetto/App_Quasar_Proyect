<template>
  <q-dialog v-model="carritoVisible">
    <q-card class="shadow-2 rounded-borders cart-modal">
      <!-- Encabezado con botones -->
      <div class="flex justify-between" style="height: 30px;">
        <q-card-actions align="left">
          <q-btn flat icon="arrow_back" color="primary" @click="closeCart" aria-label="Cerrar carrito" />
        </q-card-actions>
        <q-card-actions align="right">
          <q-btn rounded icon="close" label="Anular pedido" class="my-btn-clear" @click="clearCart"
            aria-label="Anular pedido" />
        </q-card-actions>
      </div>

      <!-- Título -->
      <q-card-section>
        <div class="text-h6">Mi pedido</div>
      </q-card-section>

      <q-separator spaced />

      <!-- Contenido del carrito -->
      <q-card-section v-if="cart.length > 0" style="padding: 0px;">
        <div v-for="item in cart" :key="item.id" class="q-mb-md">
          <q-card-section class="row" style="padding-bottom: 0px; padding-top: 10px;">
            <div class="col-9">
              <div class="text-h7">({{ item.quantity }}) {{ item.name }}</div>
              <!-- <div class="text-h7">x {{ item.quantity }}</div> -->
            </div>
            <div class="col-3 flex justify-end">
              ${{ item.price }}
            </div>
          </q-card-section>
        </div>
      </q-card-section>

      <!-- Mensaje de carrito vacío -->
      <q-card-section v-else>
        <div>El carrito está vacío</div>
      </q-card-section>

      <q-separator spaced />

      <!-- Subtotal y Total -->
      <q-card class="subtotal-card">
        <q-card-section class="row">
          <div class="col-9">Subtotal</div>
          <div class="col-3 flex justify-end">${{ subtotal }}</div>
        </q-card-section>
        <q-card-section class="row">
          <div class="col-9">Total</div>
          <div class="col-3 flex justify-end">${{ total }}</div>
        </q-card-section>
        <q-card-section class="flex justify-center">
          <q-btn class="my-btn-confi" unelevated rounded :disable="cart.length === 0" label="Confirmar pedido"
            @click="confirmCart" />

        </q-card-section>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update:isVisible", "update:cart", "cart-empty"]);
const carritoVisible = ref(props.isVisible);

// Sincroniza `carritoVisible` con `isVisible`
watch(
  () => props.isVisible,
  (newVal) => {
    carritoVisible.value = newVal;
  }
);

// Emite cambios cuando `carritoVisible` cambia
watch(carritoVisible, (newVal) => {
  emit("update:isVisible", newVal);
});

// Método para cerrar el carrito
const closeCart = () => {
  carritoVisible.value = false;
};

// Método para limpiar el carrito y emitir el estado vacío
const clearCart = () => {
  const resetCart = props.cart.map((item) => ({
    ...item,
    quantity: 0, // Reinicia las cantidades
  }));

  // Emitir carrito vacío y nuevo estado del carrito
  emit("update:cart", resetCart);
  emit("cart-empty"); // Notifica que el carrito quedó vacío

  // Cierra el carrito
  carritoVisible.value = false;
};

function confirmCart() {
  if (props.cart.length === 0) {
    console.error('El carrito está vacío. No se puede confirmar el pedido.');
    return;
  }

  const pedido = {
    productos: props.cart.map((item) => ({
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.price,
    })),
    subtotal: subtotal.value,
    total: total.value,
  };

  emit('confirmar-pedido', pedido);
}
// Cálculo del subtotal y total
const subtotal = computed(() =>
  props.cart.reduce((acc, item) => acc + item.quantity * item.price, 0)
);
const total = computed(() => subtotal.value); // Si hay impuestos o descuentos, se puede ajustar aquí
</script>

<style scoped>
.my-btn-clear {
  background: #F09191;
  color: #8D060B;
  max-width: 130px;
  font-size: 10px;
}

.cart-modal {
  max-width: 80vw;
  /* Tamaño más grande */
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 10px;
  padding: 5px;
}

/* Estilos del cartel amarillo */
.subtotal-card {
  background: #EEA114;
  width: 90%;
  /* Más pequeño que el modal */
  max-width: 400px;
  margin: 20px auto;
  /* Centrado con margen */
  border-radius: 20px !important;
  /* Bordes redondeados */
  padding: 15px;
}

.my-btn-confi {
  background: #fff;
  color: #774E0A;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 600px) {
  .cart-modal {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 10px;
  }

  .subtotal-card {
    width: 85%;
    /* Proporcional a la pantalla móvil */
    max-width: 350px;
    border-radius: 15px;
    /* Bordes redondeados */
  }
}
</style>
