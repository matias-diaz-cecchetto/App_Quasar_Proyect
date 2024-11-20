<template>
  <div class="">


    <!-- OTRA SECCION -->

    <!--  <PortadaComponent /> -->

    <!-- Lista de Productos -->
    <div class="col-xs-12 col-md-9">
      <div class="row flex justify-center">
        <span class="text-h4" style="font-size: 35px; font-weight: 500; line-height: 3rem; margin: 20px;">Menu</span>
      </div>

      <!-- <q-separator spaced /> -->

      <q-list bordered class="rounded-borders" style="width: 100%; margin: 0 auto; border: none;">
        <!-- Iterar sobre categorías utilizando un objeto agrupador -->
        <q-expansion-item v-for="(products, category) in groupedProducts" :key="category" group="categoryGroup"
          :icon="getCategoryIcon(category)" :label="category" style="background-color: #F3F2F2; margin-top: 5px;">
          <q-card style="  background-color: #fff;">
            <q-card-section>
              <div class="column items-center">
                <q-card v-for="product in products" :key="product.id" class="my-card">
                  <q-card-section horizontal class="my-card-section">
                    <q-img class="col-3 product-img" :src="product.img" style="border-radius: 8px;" />

                    <q-card-section class="col-9 content-section row">
                      <div class="text-content col-9">
                        <div class="product-title">{{ product.name }}</div>
                        <div class="product-description">{{ product.description }}</div>
                      </div>

                      <div class="price-section col-3">
                        <div class="product-price">{{ `$${product.price}` }}</div>
                        <div class="quantity-control">
                          <q-btn dense flat round icon="remove" @click="decreaseQuantity(product)"
                            style="font-size: 9px; padding: 2px;" />
                          <div class="quantity">{{ product.quantity }}</div>
                          <q-btn dense flat round icon="add" @click="increaseQuantity(product)"
                            style="font-size: 9px; padding: 2px;" />
                        </div>
                        <div class="add-button">
                          <q-btn class="btn-card" v-if="!isInCart(product)" color="positive"
                            @click="addToCart(product)">
                            Añadir
                          </q-btn>
                          <q-btn class="btn-card" v-else color="negative" @click="deleteFromCart(product)">
                            Cancelar
                          </q-btn>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
      <!-- SECCION -->
      <!-- Carrito de Compras -->

      <CarritoCompraComponent :cart="cart" v-model:isVisible="cartVisible" @update:cart="updateCart"
        @update:isVisible="cartVisible = $event" @cart-empty="handleCartEmpty" @confirmar-pedido="procesarPedido" />

      <!-- Boton fotante para carrito -->
      <q-page-sticky v-if="totalItems > 0" position="bottom-right" :offset="[18, 18]">
        <!-- @click="showCart()" // Popup abajo -->
        <!-- @click="cartVisible = true" // Popup en el medio -->
        <q-btn fab color="positive" icon="shopping_cart" @click="cartVisible = true">
          <q-badge floating color="red" text-color="white" :label="cantProduct" class="cart-badge"
            v-if="cantProduct > 0" />
        </q-btn>
      </q-page-sticky>

      <!-- Modal para completar datos -->
      <q-dialog v-model="formVisible">
        <q-card style="width: 100%;">
          <q-card-section>
            <div class="text-h6">Detalles del Pedido</div>
          </q-card-section>

          <q-card-section>
            <!-- Nombre completo -->
            <q-input v-model="formData.nombre" label="Nombre completo" filled />

            <!-- Tipo de entrega -->
            <q-select v-model="formData.tipoEntrega" label="Tipo de entrega"
              :options="['Retirar en local', 'Enviar a domicilio']" filled />

            <!-- Dirección y otros datos (condicional) -->
            <div v-if="formData.tipoEntrega === 'Enviar a domicilio'">
              <q-input v-model="formData.direccion" label="Dirección" filled />
              <q-input v-model="formData.numero" label="Número" type="number" filled />
              <q-input v-model="formData.barrio" label="Barrio" filled />
              <q-input v-model="formData.telefono" label="Teléfono" type="tel" filled />
            </div>

            <!-- Método de pago -->
            <q-select v-model="formData.metodoPago" label="Método de pago"
              :options="['Transferencia', 'Mercado Pago', 'Efectivo', 'Débito']" filled />

            <!-- Indicaciones -->
            <q-input v-model="formData.indicaciones" label="Indicaciones (opcional)" type="textarea" filled />
          </q-card-section>

          <!-- Botones de acciones -->
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" @click="closeForm" />
            <q-btn flat label="Confirmar" color="primary" @click="confirmForm" />
          </q-card-actions>
        </q-card>
      </q-dialog>


      <!-- ///////////////////////////////////////////////////////////////////////////////////// -->
      <!-- SECCION: como pedir -->
      <q-page-sticky v-if="totalItems == 0" position="bottom" :offset="[18, 18]">
        <q-btn class="my-btn-como-pedir" color="accent" @click="comoPedirVisible = true">
          <div class="flex justify-between" style="width: 100%; align-items: center;">
            <span>¿como pedir?</span>
            <div>
              <q-icon name="help_outline" />
            </div>
          </div>
        </q-btn>
      </q-page-sticky>
      <!-- Componente ComoPedirComponent -->
      <ComoPedirComponent v-model="comoPedirVisible" />

    </div>
  </div>
</template>


<script setup>
defineOptions({
  name: "CartaPage",
});

import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import ComoPedirComponent from '../../components/cart/dialog/ComoPedirComponent.vue';
import CarritoCompraComponent from '../../components/cart/carrito/CarritoCompraComponent.vue';
// import PortadaComponent from '../../components/cart/portada/PortadaComponent.vue';

const cart = ref([]);
const cartVisible = ref(false);
const $q = useQuasar();
const cantProduct = ref(0);
const comoPedirVisible = ref(false);
const cartEmpty = ref(false); // Estado del carrito vacío
// Formulario de datos
const formVisible = ref(false);
const formData = ref({
  nombre: '',
  tipoEntrega: '',
  direccion: '',
  numero: '',
  barrio: '',
  telefono: '',
  metodoPago: '',
  indicaciones: '',
});
const productos = ref([
  {
    id: 1,
    categoria: {
      tipo: 'Promociones',
      icon: 'local_offer',
    },
    name: 'Promo 2 lomos',
    description: 'Lomo, jamón cocido, queso, huevo, lechuga, tomate, mayonesa casera y papas fritas.',
    price: 5000,
    img: 'https://www.circuitogastronomico.com/wp-content/uploads/2023/04/pizzar-lomito-2.jpg',
    quantity: 1
  },
  {
    id: 2,
    categoria: {
      tipo: 'Hamburguesas',
      icon: 'fastfood',
    },
    name: 'Hamburguesa completa',
    description: 'Carne, queso, lechuga, tomate, huevo y papas fritas.',
    price: 3200,
    img: 'https://www.clarin.com/img/2022/05/27/0HXb0UR0v_2000x1500__1.jpg',
    quantity: 1
  },
  {
    id: 3,
    categoria: {
      tipo: 'Pizzas',
      icon: 'local_pizza',
    },
    name: 'Pizza Napolitana',
    description: 'Muzzarella, tomate fresco, orégano, y aceitunas.',
    price: 2800,
    img: 'https://irp-cdn.multiscreensite.com/0d51dde7/MOBILE/jpg/1977310-20190108_221129_%282%29.w1024.jpg',
    quantity: 1
  },
  {
    id: 4,
    categoria: {
      tipo: 'Pizzas',
      icon: 'local_pizza',
    },
    name: 'Pizza Napolitana Especial',
    description: 'Muzzarella, tomate fresco, orégano, y aceitunas.',
    price: 2800,
    img: 'https://media.airedesantafe.com.ar/p/82f11f560a16479049d198fef5f5b7cc/adjuntos/268/imagenes/003/775/0003775244/1200x675/smart/imagepng.png',
    quantity: 1
  },
  {
    id: 5,
    categoria: { tipo: 'Platos Principales', icon: 'restaurant', },
    name: 'Pollo al horno',
    description: 'Pollo al horno rebosado con verduras.',
    price: 1500,
    img: 'https://www.coren.es/wp-content/uploads/2017/05/Tips-evitar-pollo-corral-seco.jpeg',
    quantity: 1
  },
  {
    id: 6,
    categoria: { tipo: 'Sándwiches', icon: 'lunch_dining', },
    name: 'Sándwich de milanesa',
    description: 'Milanesa de carne, lechuga, tomate, y mayonesa.',
    price: 2700,
    img: 'https://resizer.glanacion.com/resizer/v2/milanesa-a-la-napolitana-con-guarnicion-de-papas-VLWFAANIWBGPFO4CSUHS7RYVVQ.jpg?auth=335fda04cf2733e39d11ca0ba979c1d0a8a55e6cdec15e4d5b00cfd59fbf9ed8&width=1280&height=854&quality=70&smart=true',
    quantity: 1
  },
  {
    id: 7,
    categoria: {
      tipo: 'Tartas',
      icon: 'bakery_dining',
    },
    name: 'Tarta de Verdura',
    description: 'Tarta casera de espinaca y queso.',
    price: 2200,
    img: 'https://cdn0.recetasgratis.net/es/posts/4/5/1/tarta_de_verduras_asadas_57154_orig.jpg',
    quantity: 1
  },
  {
    id: 8,
    categoria: {
      tipo: 'Tartas',
      icon: 'bakery_dining',
    },
    name: 'Tarta de Manzana',
    description: 'Tarta de manzana caramelizada con masa quebrada.',
    price: 2100,
    img: 'https://i0.wp.com/www.manualidadesapasos.com/wp-content/uploads/2020/04/receta-tarta-de-manzana.jpg?fit=800%2C534&ssl=1',
    quantity: 1
  },
  {
    id: 9,
    categoria: {
      tipo: 'Pasteles',
      icon: 'cake',
    },

    name: 'Pasteles de Carne',
    description: 'Pasteles rellenos de carne, cebolla y especias.',
    price: 1800,
    img: 'https://www.clarin.com/img/2022/05/11/Hk09WmV7X_720x0__1.jpg',
    quantity: 1
  },
  {
    id: 10,
    categoria: {
      tipo: 'Pasteles',
      icon: 'cake',
    },

    name: 'Pastel de Papa',
    description: 'Pastel al horno con carne, puré de papa y gratinado.',
    price: 2500,
    img: 'https://media.lacapital.com.ar/p/a8535113ee273a29b3a46f4225b35df3/adjuntos/205/imagenes/018/078/0018078012/1200x675/smart/pastel-carne1jpg.jpg',
    quantity: 1
  },
  {
    id: 11,
    categoria: {
      tipo: 'Ensaladas',
      icon: 'emoji_nature'
    },
    name: 'Ensalada Caesar',
    description: 'Lechuga, pollo, queso parmesano, crutones y aderezo Caesar.',
    price: 1900,
    img: 'https://comedera.com/wp-content/uploads/sites/9/2023/10/shutterstock_1087243763.jpg',
    quantity: 1
  }
]);

const groupedProducts = computed(() => {
  return productos.value.reduce((acc, product) => {
    const category = product.categoria.tipo; // Usamos solo el tipo de categoría
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
});

const getCategoryIcon = (category) => {
  // Buscar la categoría en los productos
  const categoryData = productos.value.find(product => product.categoria.tipo === category);

  // Si encontramos la categoría, retornamos su icono, si no, un icono por defecto
  return categoryData ? categoryData.categoria.icon : 'category';
};


function decreaseQuantity(product) {
  if (product.quantity > 1) product.quantity--;
}
function increaseQuantity(product) {
  product.quantity++;
}

// Añado del carrito
function addToCart(product) {
  if (!isInCart(product)) {
    cart.value.push({ ...product, quantity: product.quantity });
    cantProduct.value++;
  }
}
// Elimino del carrito
function deleteFromCart(product) {
  product.inCart = false;
  cantProduct.value--;
  cart.value = cart.value.filter(item => item.id !== product.id);
}
// Verifica si el producto ya está en el carrito
function isInCart(product) {
  return cart.value.some(item => item.id === product.id);
}
// Total de articulos
const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

// Actualiza el carrito desde el hijo
const updateCart = (newCart) => {
  cart.value = newCart;
};

// Maneja el estado del carrito vacío
const handleCartEmpty = () => {
  cart.value = []; // Elimina todos los productos del carrito
  cantProduct.value = 0; // Cantidad de productos 0
  cartEmpty.value = true; // Cambia el estado cuando el carrito está vacío
};

const removeFromCart = () => {
  cart.value = [];
  cartEmpty.value = true;
};

function procesarPedido(pedido) {
  console.log('Pedido recibido desde el hijo:', pedido);
  cartVisible.value = false;
  formVisible.value = true;
  // Aquí puedes guardar los datos en una base de datos, mostrar una confirmación, etc.
}

// Formulario

const closeForm = () => {
  formVisible.value = false;
};

const confirmForm = () => {
  console.log('Datos del formulario:', formData.value);
  closeForm();
};
</script>

<style>
/*  Portada */
.home-section {
  /*background-color: var(--main-color);*/
  position: relative;
  overflow: hidden;
}

.home-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #000000;
  opacity: 0.6;
  z-index: -1;
}

/*clase de la oscuridad del home*/

.home-section .home-bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-image: url('../../mocks/img/portadaBar.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  z-index: -2;
  animation: zoomInOut 20s ease infinite;
}

.my-card {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
  height: 120px;
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
  margin: 5px 0px 10px 0px;
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
  margin-top: 5px;
  font-size: 12px;
  margin-right: 9px;
}

/* Quantity control */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin: 0;
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

.quantity-control .q-btn {
  font-size: 12px;
  padding: 4px;
  width: 24px;
  height: 24px;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 0.75rem;
  /* Ajusta el tamaño de la letra */
}

.my-btn-como-pedir {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  max-width: 500px;
  min-width: 150px;
  padding: 10px;
}

@media (max-width: 600px) {
  .category-slider {
    justify-content: start;
  }

  .btn-card {
    font-size: 8px !important;
  }
}
</style>
