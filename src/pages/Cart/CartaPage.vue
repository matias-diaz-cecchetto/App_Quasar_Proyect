<template>
  <div class="q-pa-md">
    <div class="">


      <!-- Lista de Productos -->
      <div class="col-xs-12 col-md-9">
        <div class="row items-center justify-between">
          <span class="text-h4">Carta</span>
        </div>

        <q-separator spaced />

        <div class="q-pa-md column items-center">
          <q-card v-for="product in products" :key="product.id" class="my-card"
            style="width: 100%; max-width: 600px; margin-bottom: 20px;">
            <q-card-section horizontal class="my-card-section">
              <q-img class="col-3 product-img" :src="product.img" style="border-radius: 8px;" />

              <q-card-section class="col-9 content-section row">
                <div class="text-content col-8">
                  <div class="product-title">{{ product.name }}</div>
                  <div class="product-description">{{ product.description }}</div>
                </div>

                <div class="price-section col-4">
                  <div class="product-price">{{ `$${product.price}` }}</div>
                  <div class="quantity-control">
                    <q-btn dense flat round icon="remove" @click="decreaseQuantity(product)" />
                    <div class="quantity">{{ product.quantity }}</div>
                    <q-btn dense flat round icon="add" @click="increaseQuantity(product)" />
                  </div>
                  <div class="add-button">
                    <q-btn color="positive" @click="addToCart(product)">
                      Añadir
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>

        <!-- Carrito de Compras -->
        <q-dialog v-model="cartVisible">
          <q-card>
            <q-card-section>
              <div class="text-h6">Carrito de Compras</div>
            </q-card-section>

            <q-card-section v-if="cart.length > 0">
              <div v-for="item in cart" :key="item.id" class="q-mb-md">
                <div>{{ item.name }} - {{ item.quantity }} x ${{ item.price }} = ${{ item.quantity * item.price }}</div>
              </div>
            </q-card-section>

            <q-card-section v-else>
              <div>El carrito está vacío</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="cartVisible = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Botón para ver el Carrito -->
        <q-btn vertical-actions-align="center" glossy direction="up" color="primary" @click="cartVisible = true">
          Ver Carrito ({{ totalItems }} items)
        </q-btn>

      </div>
    </div>
  </div>
</template>


<script setup>
defineOptions({
  name: "CartaPage",
});

import { ref, computed, onMounted } from 'vue';

const cart = ref([]);
const cartVisible = ref(false);


// Array de productos
const products = ref([
  { id: 1, name: 'Promo 2 lomos', description: 'Lomo, jamón cocido, queso, huevo, lechuga, tomate, mayonesa casera y papas fritas.', price: 5000, img: 'https://www.circuitogastronomico.com/wp-content/uploads/2023/04/pizzar-lomito-2.jpg', quantity: 1 },
  { id: 2, name: 'Hamburguesa completa', description: 'Carne, queso, lechuga, tomate, huevo y papas fritas.', price: 3200, img: 'https://www.clarin.com/img/2022/05/27/0HXb0UR0v_2000x1500__1.jpg', quantity: 1 },
  { id: 3, name: 'Pizza Napolitana', description: 'Muzzarella, tomate fresco, orégano, y aceitunas.', price: 2800, img: 'https://irp-cdn.multiscreensite.com/0d51dde7/MOBILE/jpg/1977310-20190108_221129_%282%29.w1024.jpg', quantity: 1 },
  { id: 4, name: 'Pollo al horno', description: 'Pollo al horno rebosado con verduras.', price: 1500, img: 'https://www.coren.es/wp-content/uploads/2017/05/Tips-evitar-pollo-corral-seco.jpeg', quantity: 1 },
  { id: 5, name: 'Sándwich de milanesa', description: 'Milanesa de carne, lechuga, tomate, y mayonesa.', price: 2700, img: 'https://resizer.glanacion.com/resizer/v2/milanesa-a-la-napolitana-con-guarnicion-de-papas-VLWFAANIWBGPFO4CSUHS7RYVVQ.jpg?auth=335fda04cf2733e39d11ca0ba979c1d0a8a55e6cdec15e4d5b00cfd59fbf9ed8&width=1280&height=854&quality=70&smart=true', quantity: 1 },
  { id: 6, name: 'Tarta de Verdura', description: 'Tarta casera de espinaca y queso.', price: 2200, img: 'https://cdn0.recetasgratis.net/es/posts/4/5/1/tarta_de_verduras_asadas_57154_orig.jpg', quantity: 1 }
]);

function decreaseQuantity(product) {
  if (product.quantity > 1) product.quantity--;
}
function increaseQuantity(product) {
  product.quantity++;
}
function addToCart(product) {
  const existingItem = cart.value.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.value.push({ ...product, quantity: product.quantity });
  }
  product.quantity = 1; // Reinicia la cantidad en el producto original
}

const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});
</script>

<style>
.my-content {
  padding: 10px;
}

.q-card {
  height: 100%;
  border-radius: 8px;
  width: 100%;
}

.my-group-products {
  padding: 0px 150px;
}

.my-content-filter {
  font-size: 13px;
}

.my-filters-card {
  margin-bottom: 20px;
  font-size: 13px;
  padding: 16px;
  /* background-color: #f5f5f5 */
}

.my-group-products {
  padding: 0px 50px;
}


.my-columns {
  padding: 10px;
  margin: 10 !important;
}

.my-card {
  width: 100%;
  height: 100px;
  max-width: 600px;
}

.my-card-section {
  height: 100%;
}

.product-img {
  border-radius: 8px;
}

.content-section {
  padding: 0;
}

/* Text content section */
.text-content {
  padding: 10px;
  flex-grow: 1;
}

.product-title {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 0;
}

.product-description {
  font-size: 10px;
  line-height: 1.2;
  color: grey;
}

/* Price section */
.price-section {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.product-price {
  font-size: 12px;
  margin-right: 8px;
}

/* Quantity control */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin: 0;
}

.quantity-control .q-btn {
  font-size: 8px;
}

.quantity {
  font-size: 10px;
  margin: 0 4px;
}

/* Add button */
.add-button {
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.add-button .q-btn {
  font-size: 10px;
  padding: 4px 8px;
}
</style>
