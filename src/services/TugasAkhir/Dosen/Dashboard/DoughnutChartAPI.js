import { ref } from "vue";

// Create a reactive array with random values
const doughnutChartValue = ref(
  Array.from({ length: 5 }, () => Math.floor(Math.random() * (30 - 5 + 1)) + 5)
);

// Return the actual array value, not the ref object
export function getDoughnutData() {
  return doughnutChartValue.value;
}
