<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between">
      <span class="text-h4">Organismos</span>
      <q-btn color="positive" icon-right="navigation" label="Nuevo Organismo" no-caps @click="addOrganisms" />
    </div>
    <q-separator spaced="" />

    <TableComponent :title="title" no-data-label="No existen datos para organismos" :rows="rows"
      :columns="organismoColumns" :actions="acctions" :isExport="isExport" @edit="editRow" @delete="deleteRow" />

      <DialogComponent v-model="alert" :row="selectedRow" :columns="organismoColumns.filter(column => column.field !== 'acciones')" :title="title" />

  </div>
</template>

<script setup>
defineOptions({
  name: 'OrganismsPage'
});

const isExport = ref(false)
const title = ref('Organismos')

import { ref } from "vue";
import TableComponent from "../../components/tables/TableComponent.vue";
import DialogComponent from "../../components/dialog/DialogComponent.vue";
import { organismoColumns } from "../../components/tables/columns/OrganismoColumnsComponent.vue";

const alert = ref(false)
const selectedRow = ref({}); // Añadir esta línea para almacenar la fila seleccionada

const rows = [
  { id: 1, acronimo: "OG1", nombre: "Organismo 1", departamento: "Departamento A", organismo_padre: "N/A", direccion: "Calle 123", telefono: "123456789", tipo_organismo: "Público", estado: "Activo" },
  { id: 2, acronimo: "OG2", nombre: "Organismo 2", departamento: "Departamento B", organismo_padre: "N/A", direccion: "Calle 456", telefono: "987654321", tipo_organismo: "Privado", estado: "Inactivo" },
  { id: 3, acronimo: "OG3", nombre: "Organismo 3", departamento: "Departamento A", organismo_padre: "OG1", direccion: "Calle 789", telefono: "456123789", tipo_organismo: "Público", estado: "Activo" },
  { id: 4, acronimo: "OG4", nombre: "Organismo 4", departamento: "Departamento C", organismo_padre: "OG2", direccion: "Calle 101", telefono: "321654987", tipo_organismo: "Privado", estado: "Inactivo" },
  { id: 5, acronimo: "OG5", nombre: "Organismo 5", departamento: "Departamento A", organismo_padre: "N/A", direccion: "Calle 202", telefono: "654987321", tipo_organismo: "Público", estado: "Activo" },
];

const acctions = [
  {
    //label: "Editar",
    color: "info",
    icon: 'visibility',
    tooltip: 'Ver detalles',
    method: (row) => viewRow(row),
  },
  {
    //label: "Editar",
    color: "primary",
    icon: 'mode_edit',
    tooltip: 'Editar organismo',
    method: (row) => editRow(row),
  },
  {
    //label: "Eliminar",
    color: "negative",
    icon: 'delete',
    tooltip: 'Eliminar organismo',
    method: (row) => console.log("Eliminar:", row),
  },
]

const editRow = (row) => {
  // Lógica para editar la fila
  console.log("Edit row:", row);
};

const deleteRow = (row) => {
  // Lógica para eliminar la fila
  console.log("Delete row:", row);
};

const viewRow = (row) => {
  // Lógica para eliminar la fila
  console.log("View row:", row);
  selectedRow.value = row; // Almacenar la fila seleccionada
  alert.value = true; // activar el dialog
};

function addOrganisms() {
  console.log('New Organisms');

}
</script>
