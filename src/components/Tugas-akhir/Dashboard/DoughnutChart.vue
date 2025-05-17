<template>
  <div class="grid gap-8">
    <h1 class="body1">Progres Bimbingan Mahasiswa</h1>
    <div class="overflow-x-auto">
      <div>
        <Doughnut
          v-if="isDataReady"
          class="w-[30dvh]"
          :data="chartData"
          :options="options"
        />
      </div>
      <div class="flex justify-center flex-wrap mt-4 gap-4">
        <div
          v-for="(label, index) in chartData.labels"
          :key="index"
          class="text-center flex items-center"
        >
          <div
            :style="{
              backgroundColor: chartData.datasets[0].backgroundColor[index],
            }"
            class="w-4 h-4 inline-block rounded-full"
          ></div>
          <span class="ml-2 body5 text-[#8C97A7]">{{ label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { computed, ref } from "vue";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  chartValue: {
    type: Array,
    default: () => [10, 10, 10, 10, 10], // Default values to prevent empty chart
    required: true,
  },
});

// Computed property to check if data is ready
const isDataReady = computed(() => {
  return props.chartValue && props.chartValue.length > 0;
});

// Create chart data structure with computed to respond to prop changes
const chartData = computed(() => {
  return {
    labels: ["BAB 1", "BAB II", "BAB III", "BAB IV", "BAB V"],
    datasets: [
      {
        backgroundColor: [
          "#62B2FD",
          "#9BDFC4",
          "#9F97F7",
          "#F99BAB",
          "#FFB44F",
        ],
        data: isDataReady.value ? props.chartValue : [10, 10, 10, 10, 10],
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
};
</script>
