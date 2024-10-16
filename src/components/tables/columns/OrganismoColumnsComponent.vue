<script>
export const organismoColumns = [
  { name: "id", label: "ID", field: "id", align: "left", sortable: true, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
  { name: "acronimo", label: "Acrónimo", field: "acronimo", align: "left", sortable: true, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
  { name: "nombre", label: "Nombre", field: "nombre", align: "left", sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "departamento", label: "Departamento", field: "departamento", align: "left", sortable: true, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
  { name: "organismo_padre", label: "Organismo Padre", field: "organismo_padre", align: "left", sortable: true, headerStyle: 'font-weight: bold;', slot: 'body-cell-organismo_padre' , style: "font-size: 15px;"},
  { name: "direccion", label: "Dirección", field: "direccion", align: "left", sortable: true, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
  { name: "telefono", label: "Teléfono", field: "telefono", align: "left", sortable: true, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
  { name: "tipo", label: "Tipo Organismo", field: "tipo_organismo", align: "left", sortable: true, headerStyle: 'font-weight: bold;', slot: 'body-cell-tipo' , style: "font-size: 15px;"},
  { name: "estado", label: "Estado", field: "estado", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', slot: 'body-cell-estado' , style: "font-size: 15px;"},
  { name: "acciones", label: "Acciones", field: "acciones", align: "left", sortable: false, headerStyle: 'font-weight: bold;' , style: "font-size: 15px;"},
];
</script>
