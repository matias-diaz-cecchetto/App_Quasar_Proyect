<template>
  <q-dialog v-model="showDialog" :maximized="$q.screen.lt.md">
    <q-card
      class="no-scroll"
      style="
        background: gray;
        min-width: 80vw;
        min-height: 80vh;
        width: 100%;
        height: 100%;
      "
    >
      <q-bar class="bg-brand-light">
        <h5 class="text-brand-text">{{ title }}</h5>
        <q-space></q-space>
        <q-btn @click="hideDialog" color="white" flat icon="close"></q-btn>
      </q-bar>
      <div class="fit">
        <q-pdfviewer type="html5" :src="src" />
      </div>
    </q-card>
  </q-dialog>

  <div class="q-pa-md q-gutter-sm">
    <q-btn @click="onClick" color="positive" label="Manual de usuario"></q-btn>
  </div>
  <q-separator spaced />
  <div class="q-pa-md full-screen">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      class="full-stepper"
    >
      <!-- Primer Paso: Ingresar Datos -->
      <q-step :name="1" title="Ingrese los datos" icon="info" :done="step > 1">
        <div class="q-pa-md q-gutter-sm">
          <span class="text-h5">Seleccione el Certificado</span>
          <q-input ref="filterRef" filled v-model="filter" label="Buscar...">
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="clear"
                class="cursor-pointer"
                @click="resetFilter"
              />
            </template>
          </q-input>

          <q-tree
            class="my-text"
            :nodes="certificados"
            node-key="id"
            :filter="filter"
            default-expand-all
            v-model:selected.sync="selectedCertificado"
            selected-color="primary"
            v-model:expanded="expanded"
          />
        </div>
      </q-step>

      <!-- Segundo Paso: Completar Datos -->
      <q-step :name="2" title="Completar Datos" icon="edit" :done="step > 2">
        <div class="q-gutter-sm">
          <span class="text-h4 q-ma-md block">
            Certificado Seleccionado:
            {{
              formData.tipo_acta ? formData.tipo_acta.label : "No seleccionado"
            }}
          </span>

          <span class="text-h6 q-ma-md block">Buscar por:</span>

          <div>
            <q-radio
              v-model="formData.shape"
              val="line"
              color="positive"
              label="Número CE"
            />
          </div>

          <div class="row q-gutter-md items-center form-style">
            <div class="col-2 q-my-none" style="width: 170px">
              <q-select
                v-model="formData.anio"
                :options="years"
                label="Seleccione un año"
                outlined
                use-input
                dense
                clearable
                style="width: 100%"
              />
            </div>
            <div class="col-auto q-my-none"><span> - </span></div>
            <div class="col-2 q-my-none">
              <q-input
                v-model="formData.numeroActa"
                type="number"
                label="Nro. GDE"
                outlined
                dense
                clearable
                :min="0"
                :max="100"
                :step="1"
                style="width: 100%"
              />
            </div>
            <div class="col-auto q-my-none"><span> - </span></div>
            <div class="col-4 q-my-none text-left">
              <span class="text-h6"
                >GDESDE-DGRC#MJDH <i class="las la-question-circle"></i
              ></span>
            </div>
          </div>
        </div>
      </q-step>

      <!-- Resumen de Datos -->
      <q-step :name="3" title="Resumen" icon="assignment">
        <div>
          <div class="q-my-md">
            <span class="text-h5">Resumen de Datos Ingresados</span>
          </div>
          <p><strong>Organismo:</strong> {{ formData.fuente_autentica }}</p>
          <p><strong>Certificado:</strong> {{ formData.tipo_acta.label }}</p>
          <p><strong>Año Seleccionado:</strong> {{ formData.anio }}</p>
          <p><strong>Nro. GDE:</strong> {{ formData.numeroActa }}</p>
        </div>
      </q-step>

      <!-- Navegación de los pasos -->
      <template v-slot:navigation>
        <q-stepper-navigation class="flex justify-end">
          <q-btn
            v-if="step !== 3 || !formComplete"
            @click="navigate(step === 3 ? 'finish' : 'next')"
            color="primary"
            :label="step === 3 ? 'Finalizar' : 'Continuar'"
            :disable="
              (step === 1 && !selectedCertificado) ||
              (step === 2 && !isFormValid)
            "
          />
          <q-btn
            v-if="step > 1 && !formComplete"
            flat
            color="primary"
            @click="step--"
            label="Volver"
            class="q-ml-sm"
          />
          <!-- Botón para validar otro certificado -->
          <q-btn
            v-if="formComplete"
            @click="resetStepper"
            label="Validar otro certificado"
            color="secondary"
            class="q-mt-lg"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>

  <div v-if="formComplete" class="q-pa-md q-gutter-sm" style="height: 600px">
    <q-pdfviewer type="html5" :src="src" />
  </div>
</template>

<script setup>
defineOptions({
  name: "NewValidatorPage",
});

import { useQuasar } from "quasar";
import { computed } from "vue";
import { ref, watch } from "vue";

// Paso actual del stepper
const step = ref(1);
const formComplete = ref(false);
const loadError = ref(false);
const $q = useQuasar();
// Filtrar el q-tree
const filter = ref("");
const filterRef = ref(null);
// Variable reactiva para almacenar el nodo seleccionado
const selectedCertificado = ref(null);
// Certificados disponibles con IDs
const certificados = [
  {
    label: "Registro Civil",
    selectable: false, // Evitar que el nodo padre sea seleccionable
    header: "root",
    children: [
      {
        label: "Certificado de Nacimiento",
        header: "generic",
        id: "1",
        body: "story",
        story: "Datos para el certificado de nacimiento",
      },
      {
        label: "Certificado de Matrimonio",
        header: "generic",
        id: "2",
        body: "story",
        story: "Datos para el certificado de matrimonio",
      },
      {
        label: "Certificado de Defunción",
        header: "generic",
        id: "3",
        body: "story",
        story: "Datos para el certificado de defuncion",
      },
      {
        label: "Acta de Unión de Convivencia",
        header: "generic",
        id: "4",
        body: "story",
        story: "Datos para el acta de unión de convivencia",
      },
    ],
  },
];

// Resetear filtro
function resetFilter() {
  filter.value = "";
  filterRef.value.focus();
}

// Función para buscar el nodo completo en el árbol, incluyendo el padre
function findNodeById(nodes, id, parent = null) {
  for (const node of nodes) {
    if (node.id === id) {
      return { node, parent };
    }
    if (node.children) {
      const foundNode = findNodeById(node.children, id, node);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
}

// Observar cambios en la selección
watch(selectedCertificado, (newValue) => {
  if (newValue) {
    // Buscar el objeto completo en el árbol de certificados, incluyendo su padre
    const { node: selectedNode, parent } = findNodeById(certificados, newValue);
    if (selectedNode) {
      console.log("Objeto seleccionado:", selectedNode);
      console.log("Padre:", parent ? parent.label : "Sin padre");

      // Guardar el tipo de acta y la fuente auténtica (padre) en el formData
      formData.value.tipo_acta = selectedNode;
      formData.value.fuente_autentica = parent ? parent.label : "Desconocido";
    }
  }
});

// Step 2

// Datos del formulario
const formData = ref({
  shape: "line",
  tipo_acta: {}, // Dato del acta seleccionada
  fuente_autentica: "", // Nodo padre, en este caso "Registro Civil"
  anio: null,
  numeroActa: null,
});

// Opciones para el select
const currentYear = new Date().getFullYear();
const startYear = 1980;
const years = Array.from(
  { length: currentYear - startYear + 1 },
  (v, i) => startYear + i
).reverse();

// Verifica que los campos requeridos estén completos para el paso 2
const isFormValid = computed(() => {
  return formData.value.anio !== null && formData.value.numeroActa !== null;
});

// Función para navegar entre pasos
const navigate = (action) => {
  if (action === "next") {
    if (step.value === 1 && !selectedCertificado.value) return; // No se permite avanzar sin selección
    if (step.value === 2 && !isFormValid.value) return; // No se permite avanzar sin completar el formulario
    step.value++;
  } else if (action === "finish") {
    console.log("Finalizando con los datos:", formData.value);
    formComplete.value = true;
    loadPdf();
  }
};

// Función para reiniciar el stepper y los datos del formulario
function resetStepper() {
  step.value = 1;
  formData.value = {
    shape: "line",
    tipo_acta: null,
    anio: null,
    numeroActa: null,
  };
  selectedCertificado.value = null;
  filter.value = "";
  formComplete.value = false;
}

// Pdf
const src = ref(null);
const showDialog = ref(false);
const title = ref("QDialog with QPdfviewer");

const loadPdf = async () => {
  try {
    src.value =
      "https://validaciones.sde.gob.ar/Manual/manual%20validacion%20acta%20final.pdf";
    loadError.value = false;
    $q.notify({
      message: "Documento validado correctamente",
      color: "positive",
      position: "top",
    });
  } catch (error) {
    console.error("Error al cargar el PDF:", error);
    $q.notify({
      message: "Error al cargar el PDF: " + error.message, // Ajuste aquí
      color: "negative",
      position: "top",
    });
    loadError.value = true;
  }
};

function onClick() {
  src.value =
    "https://validaciones.sde.gob.ar/Manual/manual%20validacion%20acta%20final.pdf";
  showDialog.value = true;
}

function hideDialog() {
  showDialog.value = false;
}
</script>

<style lang="scss" scoped>
.full-screen {
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-stepper {
  width: 100%;
  max-width: 1200px;
}

.form-style {
  margin: 10px 0px;
}

.my-text {
  font-size: $input-font-size;
}
</style>
