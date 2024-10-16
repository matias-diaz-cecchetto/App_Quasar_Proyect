import { boot } from "quasar/wrappers";
import VueApexCharts from "vue3-apexcharts";

export default boot(({ app }) => {
  // Registrar el componente apexchart globalmente
  // eslint-disable-next-line vue/multi-word-component-names
  app.component("apexchart", VueApexCharts);
});
