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
        <!-- Statistik Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Total Laporan</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalLaporan }}</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Selesai</h3>
            <p class="text-3xl font-bold text-green-600">{{ statusCounts.finished }}</p>
            <p class="text-sm text-gray-500">
              {{ totalLaporan > 0 ? Math.round((statusCounts.finished / totalLaporan) * 100) : 0 }}% dari total
            </p>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Terverifikasi</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ statusCounts.verified }}</p>
            <p class="text-sm text-gray-500">
              {{ totalLaporan > 0 ? Math.round((statusCounts.verified / totalLaporan) * 100) : 0 }}% dari total
            </p>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Belum Terverifikasi</h3>
            <p class="text-3xl font-bold text-red-600">{{ statusCounts.unverified }}</p>
            <p class="text-sm text-gray-500">
              {{ totalLaporan > 0 ? Math.round((statusCounts.unverified / totalLaporan) * 100) : 0 }}% dari total
            </p>
          </div>
        </div>

        <!-- Dedicated Category Analysis Section -->
        <div class="mb-6" v-if="hasCategoryData">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">📊 Analisis Kategori Laporan</h2>
          
          <!-- Category Statistics Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            <div 
              v-for="(category, index) in categoryCounts" 
              :key="category.category_id"
              class="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                     :style="{ backgroundColor: categoryColors[index % categoryColors.length] + '20' }">
                  <span class="text-sm font-bold" :style="{ color: categoryColors[index % categoryColors.length] }">
                    {{ category.count }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ getPercentage(category.count) }}%</p>
                </div>
              </div>
              <h4 class="text-sm font-semibold text-gray-800 mb-1">{{ category.nama }}</h4>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-green-600">Selesai:</span>
                  <span class="font-medium">{{ category.statusBreakdown?.finished || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-yellow-600">Terverifikasi:</span>
                  <span class="font-medium">{{ category.statusBreakdown?.verified || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-red-600">Belum Terverifikasi:</span>
                  <span class="font-medium">{{ category.statusBreakdown?.unverified || 0 }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Ditolak:</span>
                  <span class="font-medium">{{ category.statusBreakdown?.rejected || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Category Visualization Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Category Bar Chart -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">📈 Distribusi Laporan per Kategori</h4>
              <div class="h-80">
                <canvas ref="categoryBarChartRef"></canvas>
              </div>
            </div>
            
            <!-- Category Pie Chart -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-800 mb-4">🥧 Proporsi Kategori Laporan</h4>
              <div class="h-80">
                <canvas ref="categoryPieChartRef"></canvas>
              </div>
            </div>
          </div>

          <!-- Category Details Table -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">📋 Detail Laporan per Kategori</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selesai</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terverifikasi</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Belum Terverifikasi</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ditolak</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="categoryCounts.length === 0">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">Tidak ada data kategori</td>
                  </tr>
                  <tr v-for="(category, index) in categoryCounts" :key="category.category_id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div 
                          class="w-4 h-4 rounded-full mr-3" 
                          :style="{ backgroundColor: categoryColors[index % categoryColors.length] }"
                        ></div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ category.nama }}</div>
                          <div class="text-xs text-gray-500">ID: {{ category.category_id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-lg font-bold text-gray-900">{{ category.count }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            class="h-2 rounded-full"
                            :style="{ 
                              width: getPercentage(category.count) + '%',
                              backgroundColor: categoryColors[index % categoryColors.length]
                            }"
                          ></div>
                        </div>
                        <span class="text-sm font-medium text-gray-900">{{ getPercentage(category.count) }}%</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {{ category.statusBreakdown?.finished || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {{ category.statusBreakdown?.verified || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {{ category.statusBreakdown?.unverified || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {{ category.statusBreakdown?.rejected || 0 }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Grafik Laporan per Periode -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Tren Laporan Kejadian</h3>
            <div class="h-64 bg-gray-50 rounded-lg p-4">
              <canvas ref="trendChartRef"></canvas>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">Distribusi Status Laporan</h3>
            <div class="h-64 bg-gray-50 rounded-lg p-4">
              <canvas ref="statusChartRef"></canvas>
            </div>
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
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="recentReports.length === 0">
                  <td colspan="6" class="px-4 py-4 text-center text-gray-500">Tidak ada data</td>
                </tr>
                <tr v-for="report in recentReports" :key="report.laporan_id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.nomor_laporan }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(report.created_at) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {{ getCategoryName(report.category_id) }}
                    </span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.judul || 'Tidak disebutkan' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span 
                      :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        report.status === 'finished' ? 'bg-green-100 text-green-800' : 
                        report.status === 'verified' ? 'bg-yellow-100 text-yellow-800' : 
                        report.status === 'rejected' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ formatStatus(report.status) }}
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
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { decryptData } from "../../../services/encrypt";
import VueCookies from "vue-cookies";
import axios from "axios";
import Chart from "chart.js/auto";

const userData = ref(null);
const isLoading = ref(true);
const totalLaporan = ref(0);
const laporanData = ref([]);
const categories = ref([]);
const categoryCounts = ref([]);
const selectedPeriod = ref("week");
const trendChartRef = ref(null);
const statusChartRef = ref(null);
const categoryBarChartRef = ref(null);
const categoryPieChartRef = ref(null);
const selectedYear = ref(new Date().getFullYear());
const statusCounts = ref({
  finished: 0,
  verified: 0,
  unverified: 0,
  rejected: 0
});
const recentReports = ref([]);

// Enhanced color palette for categories
const categoryColors = ref([
  '#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280',
  '#DC2626', '#059669', '#7C3AED', '#DB2777', '#0891B2'
]);

// Computed properties
const hasCategoryData = computed(() => categoryCounts.value.length > 0);

// Available years
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

const periods = [
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun", value: "year" },
];

let trendChart = null;
let statusChart = null;
let categoryBarChart = null;
let categoryPieChart = null;

onMounted(async () => {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
  
  await fetchCategories();
  await fetchLaporan();
  
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  [trendChart, statusChart, categoryBarChart, categoryPieChart].forEach(chart => {
    if (chart) chart.destroy();
  });
  
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  nextTick(() => {
    [trendChart, statusChart, categoryBarChart, categoryPieChart].forEach(chart => {
      if (chart) chart.resize();
    });
  });
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("https://v3422040.mhs.d3tiuns.com/api/category", {
      timeout: 10000
    });
    
    if (response.data && Array.isArray(response.data)) {
      categories.value = response.data.map(cat => ({
        id: cat.category_id,
        category_id: cat.category_id,
        name: cat.nama,
        nama: cat.nama,
        image_path: cat.image_path,
        created_at: cat.created_at,
        updated_at: cat.updated_at
      }));
      console.log("Categories loaded:", categories.value.length);
    } else {
      throw new Error("Invalid category data format");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    console.warn("Using empty categories array");
    categories.value = [];
  }
};

const fetchLaporan = async () => {
  isLoading.value = true;
  
  try {
    const response = await axios.get("https://v3422040.mhs.d3tiuns.com/api/laporan", {
      timeout: 10000
    });
    
    if (response.data && Array.isArray(response.data)) {
      laporanData.value = response.data;
      console.log("Laporan data loaded successfully:", laporanData.value.length, "laporan");
    } else {
      throw new Error("Invalid laporan data format");
    }
  } catch (error) {
    console.error("Error fetching laporan data:", error);
    console.warn("Using empty laporan data");
    laporanData.value = [];
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
  
  if (!laporanData.value.length) {
    console.warn("No laporan data available");
    totalLaporan.value = 0;
    categoryCounts.value = [];
    statusCounts.value = { finished: 0, verified: 0, unverified: 0, rejected: 0 };
    recentReports.value = [];
    return;
  }
  
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
  
  // Process status counts with all possible statuses
  statusCounts.value = {
    finished: filteredData.filter(item => item.status === "finished").length,
    verified: filteredData.filter(item => item.status === "verified").length,
    unverified: filteredData.filter(item => item.status === "unverified").length,
    rejected: filteredData.filter(item => item.status === "rejected").length
  };
  
  processCategoryCounts(filteredData);
  
  recentReports.value = [...filteredData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  await nextTick();
  await updateCharts(filteredData, startDate, endDate);
};

const processCategoryCounts = (filteredData) => {
  const categoryMap = new Map();
  
  // Initialize all categories with zero count
  categories.value.forEach(category => {
    if (category && category.category_id !== undefined) {
      categoryMap.set(category.category_id, { 
        category_id: category.category_id,
        nama: category.nama || `Kategori ${category.category_id}`, 
        count: 0,
        statusBreakdown: {
          finished: 0,
          verified: 0,
          unverified: 0,
          rejected: 0
        }
      });
    }
  });
  
  // Count laporan for each category
  filteredData.forEach(laporan => {
    if (laporan && laporan.category_id !== undefined) {
      if (!categoryMap.has(laporan.category_id)) {
        // Create category if not exists
        categoryMap.set(laporan.category_id, {
          category_id: laporan.category_id,
          nama: `Kategori ${laporan.category_id}`,
          count: 0,
          statusBreakdown: {
            finished: 0,
            verified: 0,
            unverified: 0,
            rejected: 0
          }
        });
      }
      
      const category = categoryMap.get(laporan.category_id);
      category.count++;
      
      // Count status breakdown for each category
      const status = laporan.status;
      if (status && category.statusBreakdown[status] !== undefined) {
        category.statusBreakdown[status]++;
      } else {
        category.statusBreakdown.unverified++;
      }
    }
  });
  
  // Convert to array and sort by count (descending)
  categoryCounts.value = Array.from(categoryMap.values())
    .filter(cat => cat && cat.nama)
    .sort((a, b) => b.count - a.count);
    
  console.log("Category counts processed:", categoryCounts.value);
};

const updateCharts = async (filteredData, startDate, endDate) => {
  const trenData = prepareTrendData(filteredData, startDate, endDate);
  await updateTrendChart(trenData);
  await updateStatusChart();
  
  if (categoryCounts.value.length > 0) {
    await updateCategoryBarChart();
    await updateCategoryPieChart();
  }
};

const updateTrendChart = async (trenData) => {
  await nextTick();
  
  try {
    if (!trendChartRef.value) return;
    
    const ctx = trendChartRef.value.getContext('2d');
    if (!ctx) return;
    
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
  } catch (error) {
    console.error('Error updating trend chart:', error);
  }
};

const updateStatusChart = async () => {
  await nextTick();
  
  try {
    if (!statusChartRef.value) return;
    
    const ctx = statusChartRef.value.getContext('2d');
    if (!ctx) return;
    
    if (statusChart) {
      statusChart.destroy();
    }
    
    statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Selesai', 'Terverifikasi', 'Belum Terverifikasi', 'Ditolak'],
        datasets: [{
          data: [
            statusCounts.value.finished, 
            statusCounts.value.verified, 
            statusCounts.value.unverified,
            statusCounts.value.rejected
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',   // green
            'rgba(234, 179, 8, 0.7)',    // yellow
            'rgba(239, 68, 68, 0.7)',     // red
            'rgba(107, 114, 128, 0.7)',   // gray
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(234, 179, 8)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value * 100) / total) : 0;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating status chart:', error);
  }
};

const updateCategoryBarChart = async () => {
  await nextTick();
  
  try {
    if (!categoryBarChartRef.value) return;
    
    const ctx = categoryBarChartRef.value.getContext('2d');
    if (!ctx) return;
    
    if (categoryBarChart) {
      categoryBarChart.destroy();
    }
    
    const topCategories = categoryCounts.value.filter(c => c.count > 0).slice(0, 10);
    
    if (topCategories.length === 0) {
      console.warn('No categories with count > 0');
      return;
    }
    
    categoryBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topCategories.map(c => c.nama),
        datasets: [{
          label: 'Jumlah Laporan',
          data: topCategories.map(c => c.count),
          backgroundColor: categoryColors.value.slice(0, topCategories.length),
          borderColor: categoryColors.value.slice(0, topCategories.length),
          borderWidth: 1
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
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = totalLaporan.value;
                const percentage = total > 0 ? Math.round((value * 100) / total) : 0;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating category bar chart:', error);
  }
};

const updateCategoryPieChart = async () => {
  await nextTick();
  
  try {
    if (!categoryPieChartRef.value) return;
    
    const ctx = categoryPieChartRef.value.getContext('2d');
    if (!ctx) return;
    
    if (categoryPieChart) {
      categoryPieChart.destroy();
    }
    
    const topCategories = categoryCounts.value.filter(c => c.count > 0).slice(0, 8);
    
    if (topCategories.length === 0) {
      console.warn('No categories with count > 0');
      return;
    }
    
    categoryPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: topCategories.map(c => c.nama),
        datasets: [{
          data: topCategories.map(c => c.count),
          backgroundColor: categoryColors.value.slice(0, topCategories.length),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value * 100) / total) : 0;
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating category pie chart:', error);
  }
};

const prepareTrendData = (data, startDate, endDate) => {
  const labels = [];
  const counts = [];
  
  if (selectedPeriod.value === "week") {
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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    
    for (let i = 0; i < 12; i++) {
      labels.push(monthNames[i]);
      counts.push(0);
    }
    
    data.forEach(laporan => {
      try {
        const date = new Date(laporan.created_at);
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

const formatStatus = (status) => {
  if (!status) return 'Belum Terverifikasi';
  
  switch(status.toLowerCase()) {
    case 'finished':
      return 'Selesai';
    case 'verified':
      return 'Terverifikasi';
    case 'unverified':
      return 'Belum Terverifikasi';
    case 'rejected':
      return 'Ditolak';
    default:
      return status;
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.category_id === categoryId);
  return category ? category.nama : 'Tidak Diketahui';
};

const getPercentage = (count) => {
  return totalLaporan.value > 0 ? Math.round((count / totalLaporan.value) * 100) : 0;
};

// Watch for changes
watch([selectedPeriod, selectedYear], () => {
  processData();
});
</script>