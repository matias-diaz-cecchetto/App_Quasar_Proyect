<script>
export const userColumns = [
  { name: "id", label: "ID", field: "id", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "apellido", label: "Apellido", field: "apellido", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "nombre-user", label: "Nombre", field: "nombre", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;", slot: 'body-cell-nombre-user' },
  { name: "dni", label: "DNI", field: "dni", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "correo", label: "Correo Electrónico", field: "correo", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "fecha_nacimiento", label: "Fecha de Nacimiento", field: "fecha_nacimiento", align: 'left', sortable: true, slot: 'body-cell-fecha_nacimiento', style: "font-size: 15px;" },
  { name: "organismo", label: "Organismo", field: "organismo", align: 'left', sortable: true, headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "estado", label: "Estado", field: "estado", align: 'left', sortable: true, slot: 'body-cell-estado', headerStyle: 'font-weight: bold;', style: "font-size: 15px;" },
  { name: "acciones", label: "Acciones", field: "acciones", align: 'left', sortable: false, headerStyle: 'font-weight: bold;', slot: 'body-cell-acciones', style: "font-size: 15px;" },
];

</script>
