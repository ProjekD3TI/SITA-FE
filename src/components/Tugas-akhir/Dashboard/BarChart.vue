<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  labels: {
    type: Array,
    default: () => [
      'Sistem Informasi',
      'Internet Of Things',
      'Game Development',
      'Data Science',
      'Machine Learning',
      'Artificial Intelligence'
    ]
  },
  datasetsLabel: {
    type: Array,
    default: () => ['2024', '2025']
  },
  datasetsBgColor: {
    type: Array,
    default: () => ['#f87979', '#36a2eb']
  },
  datasetsData: {
    type: Array,
    default: () => [
      [40, 20, 12, 30, 25, 18],
      [35, 25, 18, 28, 30, 22]
    ]
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasetsLabel.map((label, i) => ({
    label,
    backgroundColor: props.datasetsBgColor[i],
    data: props.datasetsData[i]
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Kategori Tugas Akhir',
      },
      grid: { display: false },
    },
    y: {
      title: {
        display: true,
        text: 'Tugas Akhir',
      },
      beginAtZero: true,
      grid: {
        display: true,
        borderDash: [20, 20],
      },
    },
  },
}
</script>