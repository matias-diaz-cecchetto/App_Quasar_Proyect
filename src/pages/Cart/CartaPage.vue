<template>
  <div class="q-pa-md">
    <div class="">


      <!-- Lista de Productos -->
      <div class="col-xs-12 col-md-9">
        <div class="row items-center justify-between">
          <span class="text-h4">Carta</span>
        </div>

        <q-separator spaced />

        <div class="q-pa-md flex flex-center">
          <q-card class="my-card" style="width: 100%;">
            <q-card-section horizontal>
              <q-img class="col-3"
                src="https://www.circuitogastronomico.com/wp-content/uploads/2023/04/pizzar-lomito-2.jpg"
                style="border-radius: 8px;" />

              <q-card-section class="col-10 row" style="width: calc(100% - 25%); padding-left: 10px;">
                <div class="col-8 " style="padding: 10px;">
                  <div class="text-h6 q-mt-sm q-mb-xs">Promo 2 lomos</div>
                  <div class="text-caption text-grey">
                    Lomo, jamón cocido, queso, huevo, lechuga, tomate, mayonesa casera y papas fritas.
                  </div>
                </div>

                <div class="col-4" style="padding: 10px;">
                  <div class="text-subtitle1 flex justify-end q-mt-sm" style="font-size: 15px;margin: 10px;">
                    $5000
                  </div>

                  <div class="flex justify-end q-my-md" style="width: 100%;">
                    <q-btn style="font-size: 8px;" dense flat round icon="remove" @click="decreaseQuantity" />
                    <div class="flex items-center text-body1 q-mx-sm" style="font-size: 12px;">{{ quantity }}</div>
                    <q-btn style="font-size: 8px;" dense flat round icon="add" @click="increaseQuantity" />
                  </div>

                  <div class="flex justify-end" style="width: 100%;">
                    <q-btn color="positive" style="font-size: 12px; padding: 5px 10px;" @click="addToCart">
                      Añadir
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>



      </div>
    </div>
  </div>
</template>


<script setup>
defineOptions({
  name: "CartaPage",
});

import { ref, computed, onMounted } from 'vue';


const quantity = ref(1);
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

function increaseQuantity() {
  quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
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
