<!-- <template>
  <div class="q-pa-md q-gutter-sm" style="height: 600px">
    <q-pdfviewer type="html5" :src="src" />
  </div>
</template> -->

<template>
  <div class="flex flex-start" style="height: 100px">
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
      <q-btn @click="onClick" label="Show dialog"></q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "PdfViewerPage",
});

const showDialog = ref(false);
const title = ref("QDialog with QPdfviewer");
const src = ref(
  "https://validaciones.sde.gob.ar/Manual/manual%20validacion%20acta%20final.pdf"
);
// https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf
// https://validaciones.sde.gob.ar/Manual/manual%20validacion%20acta%20final.pdf
function onClick() {
  showDialog.value = true;
}

function hideDialog() {
  showDialog.value = false;
}
</script>
<style scoped>
.shorten-pdf {
  height: calc(100% - 30px);
}
</style>
