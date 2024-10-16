<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between">
      <span class="text-h4">Usuarios</span>
      <q-btn color="positive" icon-right="navigation" label="Nuevo Usuario" no-caps @click="addUser" />
    </div>

    <q-separator spaced="" />

    <TableComponent :title="title" v-bind:is="Usuarios" no-data-label="No existen datos para usuarios"
      :rows="rows" :columns="userColumns" :actions="acctions" :isExport="isExport" :statusSlot="body - cell - estado"
      @edit="editRow" @delete="deleteRow" @view="viewRow" />

    <DialogComponent v-model="alert" :row="selectedRow" :columns="userColumns.filter(column => column.field !== 'acciones')" :title="title" />

  </div>
</template>
<script setup>
defineOptions({
  name: "TablePage",
});

import { useRouter } from "vue-router";
import { ref } from "vue";
import TableComponent from "../../components/tables/TableComponent.vue";
import DialogComponent from "../../components/dialog/DialogComponent.vue";
import { userColumns } from "../../components/tables/columns/UserColumnsComponent.vue";

const isExport = ref(true)
const title = ref('Usuarios')
const router = useRouter();
const alert = ref(false)
const selectedRow = ref({}); // Añadir esta línea para almacenar la fila seleccionada

//console.log(userColumns);
//const columns = userColumns;

// acciones en columnas:
// Descripción: Función que formatea los datos antes de ser mostrados en la celda.
// format: val => val ? 'Activo' : 'Inactivo'
// Descripción: Estilo específico para el encabezado de la columna.
// headerStyle: 'font-weight: bold;'

const rows = [
  {
    id: 1,
    apellido: "González",
    nombre: "María",
    dni: "12345678",
    correo: "maria.gonzalez@example.com",
    fecha_nacimiento: "",
    organismo: "1",
    estado: "Activo",
  },
  {
    id: 2,
    apellido: "Rodríguez",
    nombre: "Juan",
    dni: "87654321",
    correo: "juan.rodriguez@example.com",
    fecha_nacimiento: "1990-08-22",
    organismo: "2",
    estado: "Inactivo",
  },
  {
    id: 3,
    apellido: "Cecchetto",
    nombre: "Ana Maria del Carmen",
    dni: "11223344",
    correo: "ana.perez@example.com",
    fecha_nacimiento: "1982-01-10",
    organismo: "3",
    estado: "Activo",
  },
  {
    id: 4,
    apellido: "López",
    nombre: "Carlos",
    dni: "55667788",
    correo: "carlos.lopez@example.com",
    fecha_nacimiento: "1979-04-30",
    organismo: "1",
    estado: "Inactivo",
  },
  {
    id: 5,
    apellido: "Martínez",
    nombre: "Lucía",
    dni: "99887766",
    correo: "lucia.martinez@example.com",
    fecha_nacimiento: "1995-12-05",
    organismo: "2",
    estado: "Activo",
  },
  {
    id: 6,
    apellido: "García",
    nombre: "Pedro",
    dni: "44332211",
    correo: "pedro.garcia@example.com",
    fecha_nacimiento: "1987-07-19",
    organismo: "3",
    estado: "Inactivo",
  },
  {
    id: 7,
    apellido: "Sánchez",
    nombre: "Sofía",
    dni: "55443322",
    correo: "sofia.sanchez@example.com",
    fecha_nacimiento: "1992-02-15",
    organismo: "1",
    estado: "Activo",
  },
  {
    id: 8,
    apellido: "Ramírez",
    nombre: "Miguel",
    dni: "66778899",
    correo: "miguel.ramirez@example.com",
    fecha_nacimiento: "1980-09-11",
    organismo: "2",
    estado: "Activo",
  },
  {
    id: 9,
    apellido: "Torres",
    nombre: "Laura",
    dni: "33445566",
    correo: "laura.torres@example.com",
    fecha_nacimiento: "1993-11-25",
    organismo: "3",
    estado: "Inactivo",
  },
  {
    id: 10,
    apellido: "Morales",
    nombre: "Andrés",
    dni: "77665544",
    correo: "andres.morales@example.com",
    fecha_nacimiento: "1984-05-17",
    organismo: "1",
    estado: "Activo",
  },
];

const acctions = [
  {
    //label: "Info",
    color: "info",
    icon: 'visibility',
    tooltip: 'Ver detalles',
    method: (row) => viewRow(row),
  },
  {
    //label: "Editar",
    color: "primary",
    icon: 'mode_edit',
    tooltip: 'Editar usuario',
    method: (row) => editRow(row),
  },
  {
    //label: "Eliminar",
    color: "negative",
    icon: 'delete',
    tooltip: 'Eliminar usuario',
    method: (row) => console.log("Eliminar:", row),
  },

]

// Formulario para editar un usuario
function editRow(row) {
  router.push({ name: "UserFormsEditPage", params: { id: row.id } });
}

const deleteRow = (row) => {
  // Lógica para eliminar la fila
  console.log("Delete row:", row);
};

const viewRow = (row) => {
  // Lógica para eliminar la fila
  console.log("View row:", row);
  selectedRow.value = row; // Almacenar la fila seleccionada
  alert.value = true; // Activar el dialog
};

// Formulario para dar de alta Usuario
function addUser() {
  router.push({ name: 'UserFormsPage' });
}

</script>

<style scoped></style>
