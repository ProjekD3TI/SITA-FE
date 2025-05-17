import { ref } from "vue";

const lineChartValue = ref(
  Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
);

export function getLineChartData() {
  return { lineChartValue };
}
