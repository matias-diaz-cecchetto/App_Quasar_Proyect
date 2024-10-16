<template>
  <q-item clickable tag="a" @click="navigateTo">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineOptions({
  name: "EssentialLink",
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: "",
  },

  link: {
    type: String,
    default: "#",
  },

  icon: {
    type: String,
    default: "",
  },

  authentication: {
    type: Boolean,
    default: false,
  },
});

/* const saludo = () => {
  console.log("Hola mundo");
};
saludo(); */

const navigateTo = () => {
  // Una manera
  /* if (props.link.startsWith("http")) {
    return window.open(props.link, "_blank");
  }
  return router.push({ name: props.link }); */

  // Otra manera

  try {
    props.link.startsWith("http")
      ? window.open(props.link, "_blank")
      : router.push({ name: props.link });
  } catch (error) {
    console.log("Ruta no valida: ", error);
  }
};
</script>
