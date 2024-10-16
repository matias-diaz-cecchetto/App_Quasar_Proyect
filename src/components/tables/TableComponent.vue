<template>

  <div :class="isExport ? 'row items-center justify-between q-mb-md' : 'row items-center justify-end q-mb-md'">
    <q-btn v-if="isExport" color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable" />
    <q-input class="q-my-md" v-model="filter" style="width: 400px" filled label="Buscar" prepend-icon="search" />
  </div>

  <!-- :grid="$q.screen.xs" (para que la tabla sea como tarjetas en modo mobile) -->
  <q-table :title="title" :rows="rows" :filter="filter" :columns="columns" row-key="id"
    :rows-per-page-options="[10, 20, 50]" no-data-label="No existen datos de usuarios"
    no-results-label="No se encontraron resultados en la busqueda" :dense="$q.screen.lt.md">

    <!-- Definición del slot para la columna "fecha nacimiento" -->
    <template v-slot:body-cell-fecha_nacimiento="props">
      <q-td key="fecha_nacimiento" :props="props">
        <template v-if="props.row.fecha_nacimiento">
          <q-badge>
            {{ props.row.fecha_nacimiento }}
          </q-badge>
        </template>
        <template v-else>
          <q-badge color="accent">
            No data
          </q-badge>

        </template>
      </q-td>
    </template>

    <!-- Definición del slot para la columna "Estado" para usuario -->
    <template v-slot:body-cell-estado="props">
      <q-td key="estado" :props="props">
        <template v-if="props.row.estado">
          <q-badge :color="props.row.estado === 'Activo' ? 'positive' : 'negative'" rounded>
            {{ props.row.estado }}
          </q-badge>
        </template>
        <template v-else>
          <q-badge>
            No data
          </q-badge>
        </template>
      </q-td>
    </template>

    <!-- body-cell-organismo_padre (lo pinta del color gris)-->
    <template v-slot:body-cell-organismo_padre="props">
      <q-td key="organismo_padre" :props="props">
        <template v-if="props.row.organismo_padre">
          <q-badge color="accent">
            {{ props.row.organismo_padre }}
          </q-badge>
        </template>
        <template v-else>
          <q-badge color="accent">
            No data
          </q-badge>

        </template>
      </q-td>
    </template>

    <!-- body-cell-tipo (lo pinta del color principal, si no tiene nada con gris)-->
    <template v-slot:body-cell-tipo="props">
      <q-td key="tipo_organismo" :props="props">
        <template v-if="props.row.tipo_organismo">
          <q-badge color="primary">
            {{ props.row.tipo_organismo }}
          </q-badge>
        </template>
        <template v-else>
          <q-badge color="accent">
            No data
          </q-badge>

        </template>
      </q-td>
    </template>

    <!-- body-cell-nombre (acorta la propiedad si es larga) -->
    <template v-slot:body-cell-nombre-user="props">
      <q-td :props="props">
        {{ truncateText(props.row.nombre, 10) }}
        <q-tooltip  anchor="center right" self="center left" transition-show="flip-right" transition-hide="flip-left">
            {{ props.row.nombre }} <!-- Tooltip para describir la acción -->
        </q-tooltip>
      </q-td>

    </template>

    <!-- Renderizado de columna de acciones -->
    <template v-slot:body-cell-acciones="props">
      <q-td :props="props">
        <!-- Itera sobre las acciones definidas en el prop y las renderiza -->
        <q-btn v-for="(action, index) in actions" :key="index" :label="action.label" :color="action.color || 'primary'"
          :icon="action.icon" @click="() => action.method(props.row)" class="q-mr-sm">
          <q-tooltip transition-show="flip-right" transition-hide="flip-left">
            {{ action.tooltip }} <!-- Tooltip para describir la acción -->
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>

</template>

<script setup>
import { exportFile, useQuasar } from 'quasar';
import { ref } from 'vue';

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  actions: {
    type: Array,
    default: () => [],
  },
  isExport: {
    type: Boolean,
    default: () => false
  },
  title: {
    type: String,
    default: () => ''
  },
});

const filter = ref("");
const $q = useQuasar();

// Método para exportar la tabla a CSV
function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

// Metoto para exportar a .CSV
function exportTable() {
  const content = [props.columns.map(col => wrapCsvValue(col.label))].concat(
    props.rows.map(row => props.columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};
</script>

<style scoped lang="scss"></style>
