<template>
  <q-page class="subcontent">
    <div class="flex items-center q-ma-md q-gutter-sm">
      <q-btn @click="onToday" label="Hoy" class="q-mr-md" />

      <!-- Botón de Navegación Izquierda -->
      <q-btn @click="onPrev" flat rounded size="lg" class="q-mx-xs">
        <i class="las la-angle-left"></i>
      </q-btn>
      <!-- Botón de Navegación Derecha -->
      <q-btn @click="onNext" flat rounded size="lg" class="q-mx-xs">
        <i class="las la-angle-right"></i>
      </q-btn>
      <!-- Texto de Mes -->
      <span class="text-h6 q-mx-md">{{ formattedMonth }}</span>
    </div>


    <q-separator spaced="" class="q-ma-md" />

    <div class="row justify-center q-ma-md">
      <div style="display: flex; max-width: 100%; width: 100%">
        <q-calendar-month style="cursor: pointer;" ref="calendarRef" :locale="locale" v-model="selectedDate"
          :events="reactiveEvents" animated bordered focusable hoverable no-active-date :day-min-height="130"
          :day-height="0" @change="onChange" @moved="onMoved" @click-date="onClickDate" @click-day="onClickDay"
          @click-workweek="onClickWorkweek" @click-head-workweek="onClickHeadWorkweek" @click-head-day="onClickHeadDay">
          <template #day="{ scope: { timestamp } }">
            <template v-if="
              eventsMap[timestamp.date] && eventsMap[timestamp.date].length
            ">
              <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
                <div :class="badgeClasses(event, 'day')" :style="badgeStyles(event, 'day')" class="my-event">
                  <div class="title q-calendar__ellipsis" @click="onClickEvent(event)">
                    {{ event.title + (event.time ? " - " + event.time : "") }}
                    <q-tooltip>{{ event.details }}</q-tooltip>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <!-- Aquí puedes manejar el caso en que no haya eventos -->
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>


    <!-- modal de dialogo -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Eventos para {{ selectedDateDialog }}</div>
          <q-list>
            <q-item v-for="event in eventsForSelectedDate" :key="event.id">
              <q-item-section>
                <div class="text-bold">{{ event.title }}</div>
                <div>{{ event.details }}</div>
                <div v-if="event.time">Hora: {{ event.time }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cerrar" @click="dialogVisible = false" />
          <q-btn flat label="Nuevo Evento" color="blue" @click="newEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo de recorrido -->
    <q-dialog v-model="isNewEvent">
      <q-card style="width: 900px">
        <q-card-section>
          <div class="text-h6 q-ma-md">Nuevo evento para {{ selectedDateDialog }}</div>
          <q-list>
            <q-item>
              <q-item-section>
                <div class="q-pa-md">

                  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

                    <!-- Titulo -->
                    <q-input filled v-model="formEvent.title" label="Titulo *" hint="Titulo" lazy-rules
                      :rules="[val => val && val.length > 0 || 'Por favor, escribe algo']" />

                    <!-- Detalle como Textarea -->
                    <q-input filled v-model="formEvent.details" label="Detalle *" hint="Detalle" type="textarea"
                      lazy-rules :rules="[val => val && val.length > 0 || 'Por favor, escribe algo']" />

                    <!-- Horario usando q-time para seleccionar la hora -->
                    <q-input filled v-model="formEvent.time" label="Horario *" mask="##:##" hint="HH:MM" lazy-rules
                      :rules="[val => !!val || 'Por favor, selecciona un horario']">
                      <template v-slot:append>
                        <!-- Icono para desplegar el selector de tiempo -->
                        <q-icon name="access_time" class="cursor-pointer q-ml-sm">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale" class="bg-white rounded">
                            <q-time v-model="formEvent.time" format24h>
                              <!-- Botón para cerrar el selector -->
                              <div class=" row items-center justify-end q-pt-sm">
                                <q-btn flat label="Cerrar" color="primary" v-close-popup />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <!-- Duración en minutos usando un input numérico -->
                    <q-input filled v-model.number="formEvent.duration" label="Duración (en minutos) *"
                      hint="Duración en minutos" type="number" min="0" lazy-rules
                      :rules="[val => val > 0 || 'Por favor, ingresa un valor positivo']" />

                    <!-- Selector de Color usando q-color -->
                    <!-- <q-input filled v-model="formEvent.bgcolor" class="my-input" label="Color *"
                      hint="Selecciona el color">
                      <template v-slot:append>
                        <q-icon :style="{ color: formEvent.bgcolor }" name="lens" class="q-mr-sm" />
                        <q-icon name="colorize" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-color v-model="formEvent.bgcolor" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input> -->

                    <!-- Selector de Color usando q-select con opciones de colores por nombre -->
                    <q-select filled v-model="formEvent.bgcolor" label="Color *" hint="Selecciona el color"
                      :options="colorOptions" map-options>
                      <template v-slot:append>
                        <!-- Vista previa del color seleccionado -->
                        <q-icon :style="{ color: formEvent.bgcolor.value }" name="lens" class="q-mr-sm" />
                      </template>
                    </q-select>


                    <!-- Botones de Acción -->
                    <q-card-actions class="q-mt-md">
                      <q-btn flat :loading="submitting" label="Submit" type="submit" color="primary" />
                      <q-btn flat label="Cancelar" @click="dialogVisible = false; isNewEvent = false" />
                    </q-card-actions>

                  </q-form>

                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>


  </q-page>
</template>

<script setup>
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  parseTimestamp,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";
import { ref, computed, watch } from "vue";

// Variables reactivas
const calendarRef = ref(null);
const selectedDate = ref(today());
const locale = ref("es-AR");
const dialogVisible = ref(false);
const selectedEvent = ref({});
const eventsForSelectedDate = ref([]);
const selectedDateDialog = ref("");
const isNewEvent = ref(false)
const formEvent = ref({
  title: '',
  details: '',
  time: '',
  duration: '',
  date: '',
  bgcolor: ''
})
const submitting = ref(false);


const colorOptions = [
  { label: 'Rojo', value: 'red' },
  { label: 'Azul', value: 'blue' },
  { label: 'Verde', value: 'green' },
  { label: 'Amarillo', value: 'yellow' },
  { label: 'Naranja', value: 'orange' },
  { label: 'Púrpura', value: 'purple' },
  { label: 'Rosa', value: 'pink' },
  { label: 'Coral', value: 'coral' }
];

// Función para obtener el día actual
const getCurrentDay = (day) => {
  const CURRENT_DAY = new Date();
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = parseDate(newDay);
  return tm.date;
};

const formattedMonth = computed(() => {
  const date = new Date(selectedDate.value);
  return (
    monthFormatter().format(date).toUpperCase() + " - " + date.getFullYear()
  );
});

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: "long",
      timeZone: "UTC",
    });
  } catch (e) {
    //
  }
}

// Datos de eventos
const events = ref([
  {
    id: 1,
    title: "1st of the Month",
    details: "Everything is funny as long as it is happening to someone else",
    date: getCurrentDay(1),
    bgcolor: "orange",
  },
  {
    id: 2,
    title: "Sisters Birthday",
    details: "Buy a nice present",
    date: getCurrentDay(4),
    bgcolor: "green",
    icon: "fas fa-birthday-cake",
  },
  {
    id: 3,
    title: "Meeting",
    details: "Time to pitch my idea to the company",
    date: getCurrentDay(10),
    time: "10:00",
    duration: 120,
    bgcolor: "red",
    icon: "fas fa-handshake",
  },
  {
    id: 4,
    title: "Lunch",
    details: "Company is paying!",
    date: getCurrentDay(10),
    time: "11:30",
    duration: 90,
    bgcolor: "teal",
    icon: "fas fa-hamburger",
  },
  {
    id: 5,
    title: "Visit mom",
    details: "Always a nice chat with mom",
    date: getCurrentDay(20),
    time: "17:00",
    duration: 90,
    bgcolor: "grey",
    icon: "fas fa-car",
  },
  {
    id: 6,
    title: "Conference",
    details: "Teaching Javascript 101",
    date: getCurrentDay(22),
    time: "08:00",
    duration: 540,
    bgcolor: "blue",
    icon: "fas fa-chalkboard-teacher",
  },
  {
    id: 7,
    title: "Girlfriend",
    details: "Meet GF for dinner at Swanky Restaurant",
    date: getCurrentDay(22),
    time: "19:00",
    duration: 180,
    bgcolor: "teal",
    icon: "fas fa-utensils",
  },
  {
    id: 8,
    title: "Rowing",
    details: "Stay in shape!",
    date: getCurrentDay(27),
    bgcolor: "purple",
    icon: "rowing",
    days: 2,
  },
  {
    id: 9,
    title: "Fishing",
    details: "Time for some weekend R&R",
    date: getCurrentDay(27),
    bgcolor: "purple",
    icon: "fas fa-fish",
    days: 2,
  },
  {
    id: 10,
    title: "Vacation",
    details:
      "Trails and hikes, going camping! Don't forget to bring bear spray!",
    date: getCurrentDay(29),
    bgcolor: "purple",
    icon: "fas fa-plane",
    days: 5,
  },
]);

// Observa los cambios en events y crea una copia reactiva
const reactiveEvents = ref([]);

watch(events, (newEvents) => {
  reactiveEvents.value = [...newEvents]; // Crea una nueva referencia
});

// Computed para mapear eventos por fecha
const eventsMap = computed(() => {
  const map = {};
  events.value.forEach((event) => {
    // Asumiendo que 'event.date' está en el mismo formato "YYYY-MM-DD"
    if (!map[event.date]) {
      map[event.date] = []; // Asegúrate de inicializar el array
    }
    map[event.date].push(event);

    if (event.days !== undefined) {
      let timestamp = parseTimestamp(event.date);
      let days = event.days;
      do {
        timestamp = addToDate(timestamp, { day: 1 });
        const newDate = timestamp.date; // Guardar la nueva fecha
        if (!map[newDate]) {
          map[newDate] = []; // Asegúrate de inicializar el array
        }
        map[newDate].push(event);
      } while (--days > 1);
    }
  });
  console.log("eventsMap:", map); // Agrega un log aquí para depurar
  return map;
});

// Métodos de navegación
const onToday = () => {
  if (calendarRef.value) {
    calendarRef.value.moveToToday();
  } else {
    console.error("calendarRef no está definido.");
  }
};

const onPrev = () => {
  if (calendarRef.value) {
    calendarRef.value.prev();
  } else {
    console.error("calendarRef no está definido.");
  }
};

const onNext = () => {
  if (calendarRef.value) {
    calendarRef.value.next();
  } else {
    console.error("calendarRef no está definido.");
  }
};

// Métodos de manejo de eventos
const onMoved = (data) => {
  const date = new Date(data.year, data.month, 1); // Crea una nueva fecha con el año y mes del movimiento
  selectedDate.value = date.toISOString().substr(0, 10); // Actualiza el selectedDate correctamente
  console.log("onMoved", data);
};

const onChange = (data) => {
  //console.log("onChange", data);
};

const onClickDate = (data) => {
  //onsole.log("onClickDate", data);
};

// Modifica onClickDay para manejar varios eventos por fecha
const onClickDay = (data) => {
  const eventsForDate = eventsMap.value[data.scope.timestamp.date];
  if (eventsForDate && eventsForDate.length > 0) {
    eventsForSelectedDate.value = eventsForDate; // Asigna todos los eventos a la variable reactiva
    selectedDateDialog.value = data.scope.timestamp.date; // Muestra la fecha seleccionada en el diálogo
    dialogVisible.value = true;
  } else {
    // Si no hay eventos, muestra un mensaje predeterminado
    eventsForSelectedDate.value = [
      { title: "Sin eventos", details: "No hay eventos para esta fecha." },
    ];
    selectedDateDialog.value = data.scope.timestamp.date;
    dialogVisible.value = true;
  }
};
const onClickEvent = (event) => {
  // Muestra los detalles del evento específico en el diálogo
  selectedEvent.value = event;
  dialogVisible.value = true;
  console.log(selectedEvent.value);
};

const newEvent = () => {
  console.log('NUEVO EVENTO');
  isNewEvent.value = true
  dialogVisible.value = false
}

const onSubmit = () => {
  submitting.value = true;
  setTimeout(() => {
    if (formEvent.value.title && formEvent.value.details && formEvent.value.bgcolor) {
      formEvent.value.date = selectedDateDialog.value;
      console.log(formEvent.value);

      // Crear el nuevo evento a partir de los datos del formulario
      const newEvent = {
        id: events.value.length + 1, // Genera un nuevo ID único
        title: formEvent.value.title,
        details: formEvent.value.details,
        time: formEvent.value.time,
        duration: formEvent.value.duration,
        date: formEvent.value.date,
        bgcolor: formEvent.value.bgcolor?.value,
      };

      // Agregar el nuevo evento a la lista de eventos
      events.value.push(newEvent);

      console.log(events);


      // Aquí agregar lógica para guardar el evento
      dialogVisible.value = false; // Cierra el diálogo
      isNewEvent.value = false; // Resetea el estado del nuevo evento
      // Resetea el formulario
      formEvent.value = {
        title: '',
        details: '',
        time: '',
        duration: '',
        date: '',
        bgcolor: ''
      };

      submitting.value = true;
    } else {
      console.error('Por favor complete todos los campos.');
    }
  }, 1000);

}

const onClickWorkweek = (data) => {
  console.log("onClickWorkweek", data);
};

const onClickHeadDay = (data) => {
  console.log("onClickHeadDay", data);
};

const onClickHeadWorkweek = (data) => {
  console.log("onClickHeadWorkweek", data);
};

// Métodos para clases y estilos de eventos
const badgeClasses = (event, type) => {
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    "rounded-border": true,
  };
};


const badgeStyles = (day, event) => {
  return {};
};
</script>

<style scoped>
.my-event {
  position: relative;
  font-size: 12px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.text-white {
  color: white;
}

.bg-blue {
  background: blue;
}

.bg-green {
  background: green;
}

.bg-orange {
  background: orange;
}

.bg-red {
  background: red;
}

.bg-teal {
  background: teal;
}

.bg-grey {
  background: grey;
}

.bg-purple {
  background: purple;
}

.rounded-border {
  border-radius: 2px;
}

.calendar-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.calendar-controls button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 0.9em;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.calendar-controls button:hover {
  background-color: #0056b3;
}
</style>
