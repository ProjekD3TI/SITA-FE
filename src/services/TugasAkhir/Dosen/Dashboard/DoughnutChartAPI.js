import { ref } from "vue";

const doughnutChartValue = ref(
  Array.from({ length: 5 }, () => Math.floor(Math.random() * (30 - 5 + 1)) + 5)
);

export function getDoughnutData() {
  return { doughnutChartValue };
}
