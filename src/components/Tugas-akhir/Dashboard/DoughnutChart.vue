<template>
    <div class="grid gap-8">
      <h1 class="body1">Progres Bimbingan Mahasiswa</h1>
      <div class="overflow-x-auto">
        <div>
          <Doughnut class="w-[30dvh]" :data="data" :options="options" />
        </div>
        <div class="flex justify-center flex-wrap mt-4 gap-4">
          <div
            v-for="(label, index) in data.labels"
            :key="index"
            class="text-center flex items-center"
          >
            <div
              :style="{
                backgroundColor: data.datasets[0].backgroundColor[index],
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
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const props = defineProps({
    chartValue: {
      type: Array,
      default: () => [],
      regquired: true,
    },
  });
  const data = {
    labels: ["BAB 1", "BAB II", "BAB III", "BAB IV", " BAB V"],
    datasets: [
      {
        backgroundColor: ["#62B2FD", "#9BDFC4", "#9F97F7", "#F99BAB", "#FFB44F"],
        data:props.chartValue,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Nonaktifkan legend bawaan
      },
      tooltip: {
        enabled: true, // Tooltip tetap aktif
      },
    },
  };
  </script>