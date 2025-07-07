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
        <button @click="fetchData" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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

        <!-- Statistik Kategori Kekerasan -->
        <div class="bg-white rounded-lg p-6 mb-6 border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Laporan Berdasarkan Kategori Kekerasan</h3>
          
          <div v-if="kekerasanCategories.length === 0" class="text-center py-4">
            <p class="text-gray-600">Tidak ada kategori kekerasan ditemukan untuk periode ini</p>
          </div>
          
          <div v-else class="space-y-4">
            <!-- Grid untuk kategori kekerasan -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div 
                v-for="category in kekerasanCategories" 
                :key="category.category_id"
                class="bg-red-50 border border-red-200 p-4 rounded-lg"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-800 text-sm">{{ category.nama }}</h4>
                    <p class="text-2xl font-bold text-red-600 mt-1">{{ category.count }}</p>
                    <div class="mt-2">
                      <div class="text-xs text-gray-600">
                        {{ ((category.count / totalLaporan) * 100).toFixed(1) }}% dari total laporan
                      </div>
                    </div>
                  </div>
                  <div class="text-red-500 ml-2">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart untuk kategori kekerasan -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-800 mb-3">Distribusi Kategori Kekerasan</h4>
              <div class="h-64">
                <canvas ref="categoryChartRef"></canvas>
              </div>
            </div>
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
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
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
                  <td class="px-4 py-2">{{ report.judul || 'Tidak disebutkan' }}</td>
                  <td class="px-4 py-2">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        getCategoryName(report.category_id) && getCategoryName(report.category_id).toLowerCase().includes('kekerasan') 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ getCategoryName(report.category_id) || 'Tidak dikategorikan' }}
                    </span>
                  </td>
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

const API_LAPORAN_URL = "https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan";
const API_CATEGORY_URL = "https://v3422040.mhs.d3tiuns.com/api/category";
const API_TIMEOUT = 10000; // 10 detik timeout

const userData = ref(null);
const isLoading = ref(true);
const totalLaporan = ref(0);
const laporanData = ref([]);
const categoriesData = ref([]);
const selectedPeriod = ref("week");
const trendChartRef = ref(null);
const categoryChartRef = ref(null);
const selectedYear = ref(new Date().getFullYear());
const statusCounts = ref({
  selesai: 0,
  proses: 0,
  belum: 0
});
const recentReports = ref([]);
const apiError = ref(false);
const apiErrorMessage = ref("");
const kekerasanCategories = ref([]);

// Buat array tahun, dari tahun sekarang hingga 5 tahun sebelumnya
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

const periods = [
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun", value: "year" },
];

let trendChart = null;
let categoryChart = null;

onMounted(async () => {
  // Mendapatkan data user
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
  
  // Fetch categories dan laporan
  await fetchData();
  
  // Setup listeners untuk resize
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  // Cleanup charts dan event listeners
  if (trendChart) {
    trendChart.destroy();
  }
  if (categoryChart) {
    categoryChart.destroy();
  }
  
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  // Redraw charts on resize
  nextTick(() => {
    if (trendChart) {
      trendChart.resize();
    }
    if (categoryChart) {
      categoryChart.resize();
    }
  });
};

const fetchData = async () => {
  isLoading.value = true;
  apiError.value = false;
  apiErrorMessage.value = "";
  
  try {
    console.log("Fetching categories and reports data...");
    
    // Fetch categories first
    const categoryResponse = await axios.get(API_CATEGORY_URL, {
      timeout: API_TIMEOUT
    });
    
    if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
      categoriesData.value = categoryResponse.data;
      console.log("Categories data loaded successfully:", categoriesData.value.length, "categories");
    } else {
      throw new Error("Format data kategori tidak valid");
    }
    
    // Then fetch laporan
    const laporanResponse = await axios.get(API_LAPORAN_URL, {
      timeout: API_TIMEOUT
    });
    
    if (laporanResponse.data && Array.isArray(laporanResponse.data)) {
      laporanData.value = laporanResponse.data;
      console.log("Laporan data loaded successfully:", laporanData.value.length, "laporan");
    } else {
      throw new Error("Format data laporan tidak valid");
    }
    
  } catch (error) {
    console.error("Error fetching data:", error);
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
    kekerasanCategories.value = [];
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

  // Process kekerasan categories
  processKekerasanCategories(filteredData);
  
  // Get recent reports
  recentReports.value = [...filteredData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  // Tunggu sampai DOM dirender
  await nextTick();
  
  // Update chart setelah data diproses
  await updateCharts(filteredData, startDate, endDate);
};

const processKekerasanCategories = (data) => {
  console.log("Processing kekerasan categories...");
  
  // Get violence categories from the fetched categories
  const violenceCategories = categoriesData.value.filter(category => 
    category.nama && category.nama.toLowerCase().includes('kekerasan')
  );
  
  console.log("Found violence categories:", violenceCategories);
  
  // Count reports for each violence category
  const categoryCountMap = new Map();
  
  violenceCategories.forEach(category => {
    categoryCountMap.set(category.category_id, {
      ...category,
      count: 0
    });
  });
  
  // Count reports for each violence category
  data.forEach(laporan => {
    if (laporan.category_id && categoryCountMap.has(laporan.category_id)) {
      const currentCategory = categoryCountMap.get(laporan.category_id);
      currentCategory.count++;
      categoryCountMap.set(laporan.category_id, currentCategory);
    }
  });
  
  // Convert map to array and filter out categories with 0 count, then sort by count (descending)
  kekerasanCategories.value = Array.from(categoryCountMap.values())
    .filter(category => category.count > 0)
    .sort((a, b) => b.count - a.count);
  
  console.log("Kekerasan categories processed:", kekerasanCategories.value);
};

const getCategoryName = (categoryId) => {
  if (!categoryId || !categoriesData.value) return null;
  const category = categoriesData.value.find(cat => cat.category_id === categoryId);
  return category ? category.nama : null;
};

const updateCharts = async (filteredData, startDate, endDate) => {
  // Update trend chart
  const trenData = prepareTrendData(filteredData, startDate, endDate);
  await updateTrendChart(trenData);
  
  // Update category chart
  await updateCategoryChart();
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

const updateCategoryChart = async () => {
  await nextTick();
  
  try {
    if (!categoryChartRef.value || kekerasanCategories.value.length === 0) {
      console.warn('Category chart ref is not available or no categories');
      return;
    }
    
    const ctx = categoryChartRef.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context for category chart');
      return;
    }
    
    if (categoryChart) {
      categoryChart.destroy();
    }
    
    // Generate colors for each category
    const colors = [
      'rgba(239, 68, 68, 0.8)',   // red-500
      'rgba(245, 101, 101, 0.8)', // red-400
      'rgba(248, 113, 113, 0.8)', // red-300
      'rgba(252, 165, 165, 0.8)', // red-200
      'rgba(254, 202, 202, 0.8)', // red-100
      'rgba(220, 38, 38, 0.8)',   // red-600
      'rgba(185, 28, 28, 0.8)',   // red-700
    ];
    
    categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: kekerasanCategories.value.map(cat => cat.nama),
        datasets: [{
          data: kekerasanCategories.value.map(cat => cat.count),
          backgroundColor: colors.slice(0, kekerasanCategories.value.length),
          borderColor: colors.slice(0, kekerasanCategories.value.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    console.log("Category chart created successfully");
  } catch (error) {
    console.error('Error updating category chart:', error);
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