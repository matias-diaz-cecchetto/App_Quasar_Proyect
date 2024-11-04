<template>
  <div class="q-pa-md">
    <div class="row">
      <!-- Panel de Filtros -->
      <div class="col-xs-12 col-md-3 my-content">
        <div class="my-content-filter">
          <span class="text-h6">Filtros</span>
          <q-separator class="q-my-md" />

          <div>
            <span class="text-h6">Género</span>
            <div>
              <q-checkbox v-model="filters.genero.masculino" label="Masculino" />
              <q-checkbox v-model="filters.genero.femenino" label="Femenino" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div>
            <span class="text-h6">Talle</span>
            <div v-for="size in sizes" :key="size">
              <q-checkbox v-model="selectedSizes" :label="size" :true-value="size" :false-value="null" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <q-btn @click="applyFilters" label="Aplicar Filtros" color="primary" />

        </div>
      </div>

      <!-- Lista de Productos -->
      <div class="col-xs-12 col-md-9 my-content">
        <div class="row items-center justify-between">
          <span class="text-h4">Zapatillas Adidas</span>
        </div>

        <q-separator spaced />

        <div class="row q-col-gutter-md q-mt-md my-group-products">
          <div v-for="product in visibleProducts" :key="product.id" class="col-xs-12 col-sm-6 col-md-4">
            <q-card class="my-card" flat bordered>
              <q-img :src="product.imagen" />

              <q-card-section>
                <q-btn fab color="primary" icon="place" class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);" />

                <div class="row no-wrap items-center">
                  <div class="col text-h6 ellipsis">{{ product.titulo }}</div>
                  <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                    <q-icon name="place" />
                    Adidas
                  </div>
                </div>

                <q-rating v-model="stars" :max="5" size="32px" />
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1">
                  {{ product.titulo }}
                </div>
                <div class="text-subtitle1">
                  $ {{ product.precio }}
                </div>
                <div class="text-caption text-grey">
                  {{ product.descripcion }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions>
                <q-btn :disabled="product.stock === 0" label="Añadir" flat color="primary" />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <div class="flex justify-center q-mt-md" v-if="showLoadMore">
          <q-btn @click="loadMore" color="primary" label="Mostrar más" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
defineOptions({
  name: "ProductPage",
});

import { ref, computed, onMounted } from 'vue';


// Array de productos
const products = [
  { id: 1, titulo: "Adidas Ultraboost 21", descripcion: "Zapatillas deportivas con una amortiguación excepcional y un diseño moderno, ideales para corredores.", precio: 25.99, stock: 10, imagen: "https://sportotalar.vtexassets.com/arquivos/ids/470617/HP7543-1074-CLOUD-WHITE-CORE-BLACK-CRYSTAL-WHIT_1.png?v=638350748048270000" },
  { id: 2, titulo: "Adidas Stan Smith", descripcion: "Un clásico atemporal, estas zapatillas ofrecen comodidad y estilo con un diseño minimalista.", precio: 15.75, stock: 0, imagen: "https://realplaza.vtexassets.com/arquivos/ids/35149159-800-auto?v=638439730762830000&width=800&height=auto&aspect=true" },
  { id: 3, titulo: "Adidas NMD_R1", descripcion: "Zapatillas con un estilo urbano, combinan comodidad y modernidad, perfectas para el uso diario.", precio: 30.5, stock: 5, imagen: "https://plazavea.vteximg.com.br/arquivos/ids/29324808-512-512/image-d94e18d801074a41ac1cd821e104ed22.jpg" },
  { id: 4, titulo: "Adidas Superstar", descripcion: "Icono del estilo streetwear, estas zapatillas son cómodas y versátiles, ideales para cualquier ocasión.", precio: 45.0, stock: 2, imagen: "https://www.bompie.com.ar/media/catalog/product/cache/1e7c11b43132c034d445b386916b52f7/1/-/1-gw925.jpg" },
  { id: 5, titulo: "Adidas Yeezy Boost 350", descripcion: "Diseñadas por Kanye West, estas zapatillas ofrecen un estilo único y una comodidad sin igual.", precio: 10.0, stock: 20, imagen: "https://equipovallejo.vtexassets.com/arquivos/ids/289494-800-auto?v=638436886516430000&width=800&height=auto&aspect=true" },
  { id: 6, titulo: "Adidas Gazelle", descripcion: "Con un diseño retro, las Gazelle son perfectas para un look casual con un toque vintage.", precio: 22.0, stock: 15, imagen: "https://puntodeportivoar.vtexassets.com/arquivos/ids/427115/00007963.jpg?v=638540627300600000" },
  { id: 7, titulo: "Adidas Falcon", descripcion: "Zapatillas con una mezcla de colores vibrantes, combinan estilo y comodidad para el uso diario.", precio: 19.99, stock: 0, imagen: "https://www.bompie.com.ar/media/catalog/product/cache/1e7c11b43132c034d445b386916b52f7/1/-/1-_if7359.jpg" },
  { id: 8, titulo: "Adidas Terrex Agravic", descripcion: "Ideales para actividades al aire libre, estas zapatillas ofrecen tracción y soporte en terrenos difíciles.", precio: 35.5, stock: 3, imagen: "https://equipovallejo.vtexassets.com/arquivos/ids/337891-800-auto?v=638604681362370000&width=800&height=auto&aspect=true" },
  { id: 9, titulo: "Adidas Pureboost", descripcion: "Zapatillas ligeras diseñadas para proporcionar una sensación natural al correr, perfectas para los entusiastas del fitness.", precio: 60.0, stock: 1, imagen: "https://celadasa.vtexassets.com/arquivos/ids/241062-800-auto?v=638321254242400000&width=800&height=auto&aspect=true" },
  { id: 10, titulo: "Adidas X_PLR", descripcion: "Zapatillas de diseño contemporáneo, combinan estilo moderno y confort para un uso diario.", precio: 12.99, stock: 8, imagen: "https://s3.sa-east-1.amazonaws.com/www.vaypol.com.ar/variants/s5ty6kruvpik0tggo4avk1m9io7h/77e513bcd3762f47919c96f85e400038a39acdbb0d268f51c1fd98fe5327bd96" },
];



// Propiedad reactiva para controlar cuántos productos se muestran
const visibleCount = ref(6); // Inicialmente mostrar 6 productos

// Computed para obtener los productos visibles
const visibleProducts = computed(() => {
  return products.slice(0, visibleCount.value);
});

// Computed para verificar si hay más productos para mostrar
const showLoadMore = computed(() => {
  return visibleCount.value < products.length;
});

// Método para cargar más productos
function loadMore() {
  visibleCount.value += 6; // Cargar 3 productos más
}


// Filtros

const filters = ref({
  genero: {
    masculino: false,
    femenino: false,
  },
});

// Tallas disponibles
const sizes = [35, 36, 37, 38, 39, 40, 41];
const selectedSizes = ref([]);

// Computed para obtener los productos filtrados
const filteredProducts = computed(() => {
  return products.filter(product => {
    const matchesGenero = (filters.value.genero.masculino && product.genero === 'masculino') ||
      (filters.value.genero.femenino && product.genero === 'femenino') ||
      (!filters.value.genero.masculino && !filters.value.genero.femenino);

    const matchesSize = selectedSizes.value.length === 0 || selectedSizes.value.includes(product.talle);

    return matchesGenero && matchesSize;
  });
});

// Método para aplicar filtros (puedes personalizarlo si necesitas)
function applyFilters() {
  // La lógica para aplicar filtros se gestiona en la computed
}

</script>

<style>
.my-content {
  padding: 10px;
}

.q-card {
  height: 100%;
  border-radius: 8px;
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
</style>
