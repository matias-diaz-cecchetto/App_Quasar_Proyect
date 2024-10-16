<template>
  <q-page class="subcontent">
    <span class="text-h4 q-ma-md"> {{ formattedMonth }}</span>
    <q-separator spaced="" class="q-ma-md" />

    <div class="row justify-center q-ma-md">
      <div style="display: flex; max-width: 100%; width: 100%">
        <q-calendar-month
          ref="calendarRef"
          :locale="locale"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="130"
          :day-height="0"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #day="{ scope: { timestamp } }">
            <template
              v-if="
                eventsMap[timestamp.date] && eventsMap[timestamp.date].length
              "
            >
              <template
                v-for="event in eventsMap[timestamp.date]"
                :key="event.id"
              >
                <div
                  :class="badgeClasses(event, 'day')"
                  :style="badgeStyles(event, 'day')"
                  class="my-event"
                >
                  <div class="title q-calendar__ellipsis">
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
    <div class="calendar-controls q-mt-md">
      <q-btn @click="onPrev" label="Anterior" />
      <q-btn @click="onToday" label="Hoy" />
      <q-btn @click="onNext" label="Siguiente" />
    </div>

    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ selectedEvent.title }}</div>
          <div>{{ selectedEvent.details }}</div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cerrar" @click="dialogVisible = false" />
        </q-card-actions>
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
import { ref, computed } from "vue";

// Variables reactivas
const calendarRef = ref(null);
const selectedDate = ref(today());
const locale = ref("es-AR");
const dialogVisible = ref(false);
const selectedEvent = ref({});

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
const events = [
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
];

// Computed para mapear eventos por fecha
const eventsMap = computed(() => {
  const map = {};
  events.forEach((event) => {
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
  console.log("onChange", data);
};

const onClickDate = (data) => {
  console.log("onClickDate", data);
};

const onClickDay = (data) => {
  const eventsForDate = eventsMap.value[data.scope.timestamp.date];
  if (eventsForDate && eventsForDate.length > 0) {
    selectedEvent.value = eventsForDate[0]; // Puedes seleccionar el primer evento si hay múltiples
    dialogVisible.value = true;
  } else {
    selectedEvent.value = {
      title: "Sin eventos",
      details: "No hay eventos para esta fecha.",
    }; // Mensaje si no hay eventos
    dialogVisible.value = true;
  }
};

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
