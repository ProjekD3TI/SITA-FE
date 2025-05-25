<template>
  <h1 class="body1">Bimbingan</h1>
  <div class="min-h-[30dvh]">
    <Line class="w-full" id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>
<script setup>
const props = defineProps({
  chartValue: {
    type: Array,
    default: () => [],
    required: true,
  },
});
const chartData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Intesitas Bimbingan",
      data: props.chartValue,
      borderColor: "rgba(247, 128, 82 ,1)",
      backgroundColor: "rgba(247, 128, 82 ,1)",
      pointRadius: 6, // Ukuran titik default
      pointHoverRadius: 10, // Ukuran titik saat hover
      pointBorderColor: "rgba(0, 0, 0, 0.1)", // Warna border untuk efek shadow
      pointBorderWidth: 5, // Lebar border untuk menonjolkan shadow
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Bulsan",
      },
      grid: { display: false }, // Grid pada sumbu X tetap tidak ditampilkan
    },
    y: {
      title: {
        display: true,
        text: "Mahasiswa",
      },
      beginAtZero: true,
      grid: {
        display: true,
        borderDash: [20, 20], // Membuat garis grid menjadi dash/titik-titik
      },
    },
  },
};

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
</script>
