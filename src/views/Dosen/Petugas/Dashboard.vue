<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Dashboard Petugas</h1>
      <div class="text-gray-600 mt-2 space-y-1">
        <p class="font-medium">
          NIK: {{ userData?.nik || "NIK tidak tersedia" }}
        </p>
        <p class="font-medium">{{ userData?.email }}</p>
        <p>Selamat datang, {{ userData?.name || "Petugas" }}</p>
        <p class="font-medium">
          Nomor Telepon: {{ userData?.no_telp || "Nomor telepon tidak tersedia" }}
        </p>
        <p class="mt-2">
          Jabatan saat ini: {{ userData?.jabatan || "Petugas" }}
        </p>
      </div>
    </div>

    <!-- Statistik Laporan Kekerasan -->
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Statistik Laporan Kekerasan</h2>
      
      <!-- Filter Periode -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Periode</label>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="period in periods" 
            :key="period.value"
            @click="changePeriod(period.value)"
            :class="['px-4 py-2 rounded-md', 
              selectedPeriod === period.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            ]"
          >
            {{ period.label }}
          </button>

          <!-- Tahun Dropdown -->
          <div v-if="selectedPeriod === 'year'" class="relative">
            <select 
              v-model="selectedYear" 
              @change="processData"
              class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 appearance-none pr-8"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="apiError" class="text-center py-8">
        <div class="text-red-600 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <p class="text-lg font-medium text-gray-800">Gagal memuat data</p>
        <p class="text-gray-600">{{ apiErrorMessage }}</p>
        <button @click="fetchLaporan" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Coba Lagi
        </button>
      </div>
      
      <div v-else-if="totalLaporan === 0" class="text-center py-8">
        <p class="text-lg font-medium text-gray-800">Tidak ada data laporan untuk periode ini</p>
      </div>
      
      <div v-else>
        <!-- Statistik Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Jumlah Laporan</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalLaporan }}</p>
          </div>
        </div>
        
        <!-- Grafik Laporan per Periode -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-800 mb-2">Tren Jumlah Laporan</h3>
          <div class="h-64 bg-gray-50 rounded-lg p-4">
            <canvas ref="trendChartRef"></canvas>
          </div>
        </div>
        
        <!-- Recent Reports -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Laporan Terbaru</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Laporan</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="recentReports.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-gray-500">Tidak ada data</td>
                </tr>
                <tr v-for="report in recentReports" :key="report.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.nomor_laporan_kekerasan || `LK-${report.id}` }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(report.created_at) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.judul || 'Tidak disebutkan' }}</td>
                  <td class="px-4 py-2">
                    {{ truncateText(report.deskripsi || 'Tidak ada deskripsi', 50) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { decryptData } from "../../../services/encrypt";
import VueCookies from "vue-cookies";
import axios from "axios";
import Chart from "chart.js/auto";

const API_URL = "http://pelaporan-d3ti.my.id/api/laporan_kekerasan";
const API_TIMEOUT = 10000; // 10 detik timeout

const userData = ref(null);
const isLoading = ref(true);
const totalLaporan = ref(0);
const laporanData = ref([]);
const selectedPeriod = ref("week");
const trendChartRef = ref(null);
const selectedYear = ref(new Date().getFullYear());
const statusCounts = ref({
  selesai: 0,
  proses: 0,
  belum: 0
});
const recentReports = ref([]);
const apiError = ref(false);
const apiErrorMessage = ref("");

// Buat array tahun, dari tahun sekarang hingga 5 tahun sebelumnya
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

const periods = [
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun", value: "year" },
];

let trendChart = null;

onMounted(async () => {
  // Mendapatkan data user
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
  
  // Fetch laporan dan proses data
  await fetchLaporan();
  
  // Setup listeners untuk resize
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  // Cleanup charts dan event listeners
  if (trendChart) {
    trendChart.destroy();
  }
  
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  // Redraw charts on resize
  nextTick(() => {
    if (trendChart) {
      trendChart.resize();
    }
  });
};

const fetchLaporan = async () => {
  isLoading.value = true;
  apiError.value = false;
  apiErrorMessage.value = "";
  
  try {
    console.log(`Fetching data from: ${API_URL}`);
    const response = await axios.get(API_URL, {
      timeout: API_TIMEOUT
    });
    
    if (response.data && Array.isArray(response.data)) {
      laporanData.value = response.data;
      console.log("Laporan data loaded successfully:", laporanData.value.length, "laporan");
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (error) {
    console.error("Error fetching laporan data:", error);
    apiError.value = true;
    if (error.code === 'ECONNABORTED') {
      apiErrorMessage.value = "Koneksi timeout, server tidak merespon";
    } else if (error.response) {
      apiErrorMessage.value = `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      apiErrorMessage.value = "Tidak dapat terhubung ke server";
    } else {
      apiErrorMessage.value = error.message || "Terjadi kesalahan saat memuat data";
    }
  } finally {
    isLoading.value = false;
    if (!apiError.value) {
      await processData();
    }
  }
};

const changePeriod = async (period) => {
  selectedPeriod.value = period;
  await processData();
};

const processData = async () => {
  console.log("Processing data...");
  
  // Check if we have data
  if (!laporanData.value || laporanData.value.length === 0) {
    console.warn("No laporan data available");
    totalLaporan.value = 0;
    statusCounts.value = { selesai: 0, proses: 0, belum: 0 };
    recentReports.value = [];
    return;
  }
  
  // Tanggal untuk filter data
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  
  if (selectedPeriod.value === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (selectedPeriod.value === "month") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (selectedPeriod.value === "year") {
    startDate = new Date(selectedYear.value, 0, 1);
    endDate = new Date(selectedYear.value, 11, 31, 23, 59, 59);
  }
  
  // Filter laporan berdasarkan periode
  const filteredData = laporanData.value.filter(laporan => {
    try {
      const laporanDate = new Date(laporan.created_at);
      
      if (selectedPeriod.value === "year") {
        return laporanDate.getFullYear() === selectedYear.value;
      } else {
        return laporanDate >= startDate && laporanDate <= endDate;
      }
    } catch (e) {
      console.error("Error parsing date:", e, laporan);
      return false;
    }
  });
  
  totalLaporan.value = filteredData.length;
  console.log("Filtered laporan count:", totalLaporan.value);
  
  // Count by status
  statusCounts.value = {
    selesai: filteredData.filter(item => item.status === "Selesai").length,
    proses: filteredData.filter(item => item.status === "Diproses").length,
    belum: filteredData.filter(item => !item.status || item.status === "Belum ditangani").length
  };
  
  // Get recent reports
  recentReports.value = [...filteredData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  // Tunggu sampai DOM dirender
  await nextTick();
  
  // Update chart setelah data diproses
  await updateCharts(filteredData, startDate, endDate);
};

const updateCharts = async (filteredData, startDate, endDate) => {
  // Update trend chart
  const trenData = prepareTrendData(filteredData, startDate, endDate);
  await updateTrendChart(trenData);
};

const updateTrendChart = async (trenData) => {
  await nextTick();
  
  try {
    if (!trendChartRef.value) {
      console.warn('Trend chart ref is not available');
      return;
    }
    
    const ctx = trendChartRef.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context for trend chart');
      return;
    }
    
    if (trendChart) {
      trendChart.destroy();
    }
    
    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trenData.labels,
        datasets: [{
          label: 'Jumlah Laporan',
          data: trenData.counts,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: selectedPeriod.value === 'year',
            text: selectedPeriod.value === 'year' ? `Laporan Tahun ${selectedYear.value}` : '',
            font: {
              size: 16
            }
          }
        }
      }
    });
    
    console.log("Trend chart created successfully");
  } catch (error) {
    console.error('Error updating trend chart:', error);
  }
};

const prepareTrendData = (data, startDate, endDate) => {
  const labels = [];
  const counts = [];
  
  if (selectedPeriod.value === "week") {
    // Data per hari dalam seminggu
    for (let i = 0; i <= 6; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      labels.push(dateStr);
      counts.push(0);
    }
    
    data.forEach(laporan => {
      try {
        const date = new Date(laporan.created_at);
        const diffDays = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        if (diffDays >= 0 && diffDays < 7) {
          counts[diffDays]++;
        }
      } catch (e) {
        console.error("Error processing laporan date:", e);
      }
    });
  } else if (selectedPeriod.value === "month") {
    // Data per minggu dalam sebulan
    for (let i = 0; i < 4; i++) {
      labels.push(`Minggu ${i + 1}`);
      counts.push(0);
    }
    
    data.forEach(laporan => {
      try {
        const date = new Date(laporan.created_at);
        const diffDays = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        const weekIndex = Math.floor(diffDays / 7);
        if (weekIndex >= 0 && weekIndex < 4) {
          counts[weekIndex]++;
        }
      } catch (e) {
        console.error("Error processing laporan date:", e);
      }
    });
  } else if (selectedPeriod.value === "year") {
    // Data per bulan dalam setahun
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Init all months with zero
    for (let i = 0; i < 12; i++) {
      labels.push(monthNames[i]);
      counts.push(0);
    }
    
    data.forEach(laporan => {
      try {
        const date = new Date(laporan.created_at);
        // Hanya hitung jika tahun sesuai dengan yang dipilih
        if (date.getFullYear() === selectedYear.value) {
          const month = date.getMonth();
          if (month >= 0 && month < 12) {
            counts[month]++;
          }
        }
      } catch (e) {
        console.error("Error processing laporan date:", e);
      }
    });
  }
  
  return { labels, counts };
};

// Helper functions
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Watch perubahan periode dan tahun untuk memperbarui data
watch([selectedPeriod, selectedYear], () => {
  processData();
});
</script>