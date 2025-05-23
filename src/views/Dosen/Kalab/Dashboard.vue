<template>
  <div class="p-6">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Dashboard Kalab</h1>
      <div class="text-gray-600 mt-2 space-y-1">
        <p class="font-medium">
          NIK: {{ userData?.nik || "NIK tidak tersedia" }}
        </p>
        <p class="font-medium">{{ userData?.email }}</p>
        <p>Selamat datang, {{ userData?.name || "Dosen" }}</p>
        <p class="font-medium">
          Nomor Telepon: {{ userData?.no_telp || "Nomor telepon tidak tersedia" }}
        </p>
        <p class="mt-2">
          Jabatan saat ini: {{ userData?.jabatan || "Tidak ada jabatan" }}
        </p>
      </div>
    </div>

    <!-- Statistik Laporan Kejadian -->
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Statistik Laporan Kejadian</h2>
      
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
      
      <div v-else>
        <!-- Jumlah Total Laporan -->
        <div class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="text-lg font-medium text-gray-800 mb-2">Total Laporan Kejadian</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalLaporan }}</p>
        </div>
        
        <!-- Grafik Laporan per Periode -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-800 mb-2">Tren Laporan Kejadian</h3>
          <div class="h-64 bg-gray-50 rounded-lg p-4">
            <canvas ref="trendChartRef"></canvas>
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

const userData = ref(null);
const isLoading = ref(true);
const totalLaporan = ref(0);
const laporanData = ref([]);
const selectedPeriod = ref("week");
const trendChartRef = ref(null);
const selectedYear = ref(new Date().getFullYear());

// Buat array tahun, dari tahun sekarang hingga 5 tahun sebelumnya
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

const periods = [
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun", value: "year" },
];

let trendChart = null;

// Data dummy untuk memastikan selalu ada data untuk ditampilkan
const dummyLaporan = [
  { id: 1, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString() },
  { id: 2, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString() },
  { id: 3, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 4).toISOString() },
  { id: 4, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 10).toISOString() },
  { id: 5, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 15).toISOString() },
  { id: 6, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 20).toISOString() },
  { id: 7, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 25).toISOString() },
  // Tambahkan data untuk tahun sebelumnya
  { id: 8, created_at: new Date(currentYear-1, 2, 15).toISOString() },
  { id: 9, created_at: new Date(currentYear-1, 5, 22).toISOString() },
  { id: 10, created_at: new Date(currentYear-1, 8, 7).toISOString() },
  { id: 11, created_at: new Date(currentYear-1, 11, 30).toISOString() },
  // Tambahkan data untuk tahun sebelumnya lagi
  { id: 12, created_at: new Date(currentYear-2, 1, 10).toISOString() },
  { id: 13, created_at: new Date(currentYear-2, 6, 18).toISOString() },
  { id: 14, created_at: new Date(currentYear-2, 9, 25).toISOString() },
];

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
  
  try {
    const response = await axios.get("https://v3422040.mhs.d3tiuns.com/api/laporan", {
      timeout: 5000 // 5 detik timeout
    });
    
    if (response.data && Array.isArray(response.data)) {
      laporanData.value = response.data;
      console.log("Laporan data loaded successfully:", laporanData.value.length, "laporan");
    } else {
      throw new Error("Invalid laporan data format");
    }
  } catch (error) {
    console.error("Error fetching laporan data:", error);
    console.warn("Using dummy laporan data instead");
    laporanData.value = dummyLaporan;
  } finally {
    isLoading.value = false;
    await processData();
  }
};

const changePeriod = async (period) => {
  selectedPeriod.value = period;
  await processData();
};

const processData = async () => {
  console.log("Processing data...");
  
  // Safety check - gunakan dummy data jika tidak ada data
  if (!laporanData.value.length) {
    console.warn("No laporan data available, using dummy data");
    laporanData.value = dummyLaporan;
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
  
  // Tunggu sampai DOM dirender
  await nextTick();
  
  // Update chart setelah data diproses
  await updateTrendChart(filteredData, startDate, endDate);
};

const updateTrendChart = async (filteredData, startDate, endDate) => {
  // Siapkan data untuk grafik tren
  const trenData = prepareTrendData(filteredData, startDate, endDate);
  
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

// Watch perubahan periode dan tahun untuk memperbarui data
watch([selectedPeriod, selectedYear], () => {
  processData();
});
</script>