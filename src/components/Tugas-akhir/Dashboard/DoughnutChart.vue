<template>
  <div class="relative mx-auto">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div
      v-if="showCenterText"
      class="absolute flex items-center justify-center w-24 h-24 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <div class="w-full text-center truncate body2-bold sm:body1-bold">
        <span v-if="showCenterTextValue">
          <span class="text-primary">{{ centerText[0] || "-" }}</span
          >/<span class="text-secondary">{{ centerText[1] || "-" }}</span>
        </span>
        <br v-if="showInsideText && showCenterTextValue" />
        <span v-if="showInsideText" class="body5">{{ insideText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  labels: {
    type: Array,
    default: () => ["Proposal", "Ujian TA"],
  },
  datasetsLabel: {
    type: String,
    default: "Berkas",
  },
  insideText: {
    type: String,
    default: "Proposal",
  },
  dataValues: {
    type: Array,
    default: () => [4, 16],
  },
  backgroundColor: {
    type: Array,
    default: () => ["#CCE6FF", "#62B2FD"],
  },
  showCenterText: {
    type: Boolean,
    default: true,
  },
  showInsideText: {
    type: Boolean,
    default: true,
  },
  showCenterTextValue: {
    type: Boolean,
    default: true,
  },
  centerTextValue: {
    type: Array,
    default: null,
  },
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.datasetsLabel,
      backgroundColor: props.backgroundColor,
      data: props.dataValues,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false, position: "top" },
    tooltip: { enabled: true },
  },
  cutout: "65%",
};

const centerText = computed(() => {
  if (props.centerTextValue) {
    return props.centerTextValue;
  }
  // fallback lama
  return [props.dataValues[1] ?? 0, props.dataValues[0] ?? 0];
});
</script>
