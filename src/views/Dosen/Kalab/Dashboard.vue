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
        
        <!-- Distribusi Kategori Laporan -->
        <div class="mb-6" v-if="hasCategoryData">
          <h3 class="text-lg font-medium text-gray-800 mb-2">Distribusi Kategori Laporan</h3>
          <div class="h-80 bg-gray-50 rounded-lg p-4">
            <canvas ref="categoryChartRef"></canvas>
          </div>
        </div>
        
        <!-- Recent Reports - Updated table headers -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Laporan Terbaru</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Laporan</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="recentReports.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-gray-500">Tidak ada data</td>
                </tr>
                <tr v-for="report in recentReports" :key="report.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.nomor_laporan || report.id }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ formatDate(report.created_at) }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">{{ report.judul || 'Tidak disebutkan' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span 
                      :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        report.status === 'finished' ? 'bg-green-100 text-green-800' : 
                        report.status === 'verified' ? 'bg-yellow-100 text-yellow-800' : 
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
const categoryChartRef = ref(null);
const selectedYear = ref(new Date().getFullYear());
const statusCounts = ref({
  finished: 0,
  verified: 0,
  unverified: 0
});
const recentReports = ref([]);

// Computed property untuk mengecek apakah ada data kategori
const hasCategoryData = computed(() => categoryCounts.value.length > 0);

// Buat array tahun, dari tahun sekarang hingga 5 tahun sebelumnya
const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

const periods = [
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun", value: "year" },
];

let trendChart = null;
let statusChart = null;
let categoryChart = null;

// Data dummy untuk memastikan selalu ada data untuk ditampilkan
const dummyLaporan = [
  { 
    id: 1, 
    nomor_laporan: "LP-2025-001",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(),
    status: "finished",
    judul: "Kerusakan Peralatan Lab",
    lokasi: "Ruang Lab Komputer",
    category_id: 1,
    deskripsi: "Kerusakan komputer lab nomor 5"
  },
  { 
    id: 2, 
    nomor_laporan: "LP-2025-002",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString(),
    status: "verified",
    judul: "Masalah AC Server",
    lokasi: "Ruang Server",
    category_id: 2,
    deskripsi: "AC ruang server tidak berfungsi optimal"
  },
  { 
    id: 3, 
    nomor_laporan: "LP-2025-003",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 4).toISOString(),
    status: "unverified",
    judul: "Peralatan Rusak",
    lokasi: "Ruang Lab Fisika",
    category_id: 3,
    deskripsi: "Alat praktikum rusak"
  },
  { 
    id: 4, 
    nomor_laporan: "LP-2025-004",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 10).toISOString(),
    status: "finished",
    judul: "Proyektor Rusak",
    lokasi: "Ruang Kuliah 101",
    category_id: 4,
    deskripsi: "Proyektor tidak bisa menyala"
  },
  { 
    id: 5, 
    nomor_laporan: "LP-2025-005",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 15).toISOString(),
    status: "verified",
    judul: "Kebocoran Pipa",
    lokasi: "Ruang Lab Kimia",
    category_id: 1,
    deskripsi: "Kebocoran pipa air"
  },
  { 
    id: 6, 
    nomor_laporan: "LP-2025-006",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 20).toISOString(),
    status: "finished",
    judul: "Internet Bermasalah",
    lokasi: "Perpustakaan Lantai 2",
    category_id: 2,
    deskripsi: "Masalah koneksi internet"
  },
  { 
    id: 7, 
    nomor_laporan: "LP-2025-007",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 25).toISOString(),
    status: "unverified",
    judul: "Sound System Error",
    lokasi: "Aula Utama",
    category_id: 3,
    deskripsi: "Sound system bermasalah saat digunakan"
  },
  // Tambahkan data untuk tahun sebelumnya
  { 
    id: 8, 
    nomor_laporan: "LP-2024-008",
    created_at: new Date(currentYear-1, 2, 15).toISOString(),
    status: "finished",
    judul: "Upgrade Software",
    lokasi: "Ruang Lab Komputer",
    category_id: 1,
    deskripsi: "Upgrade software komputer lab"
  },
  { 
    id: 9, 
    nomor_laporan: "LP-2024-009",
    created_at: new Date(currentYear-1, 5, 22).toISOString(),
    status: "finished",
    judul: "Headset Rusak",
    lokasi: "Ruang Lab Bahasa",
    category_id: 4,
    deskripsi: "Headset rusak 10 unit"
  }
];

// Data dummy untuk kategori
const dummyCategories = [
  { id: 1, name: "Kerusakan Alat" },
  { id: 2, name: "Masalah Infrastruktur" },
  { id: 3, name: "Kerusakan Fasilitas" },
  { id: 4, name: "Lain-lain" }
];

onMounted(async () => {
  // Mendapatkan data user
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
  
  // Fetch kategori
  await fetchCategories();
  
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
  
  if (statusChart) {
    statusChart.destroy();
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
    
    if (statusChart) {
      statusChart.resize();
    }
    
    if (categoryChart) {
      categoryChart.resize();
    }
  });
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("https://v3422040.mhs.d3tiuns.com/api/category", {
      timeout: 5000
    });
    
    if (response.data && Array.isArray(response.data)) {
      categories.value = response.data;
      console.log("Categories loaded:", categories.value.length);
    } else {
      throw new Error("Invalid category data format");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    console.warn("Using dummy categories");
    categories.value = dummyCategories;
  }
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
  
  if (!categories.value.length) {
    console.warn("No categories available, using dummy data");
    categories.value = dummyCategories;
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
  
  // Fix: Perbaiki perhitungan status untuk menangani status baru: unverified, verified, finished
  statusCounts.value = {
    // Untuk status "finished"
    finished: filteredData.filter(item => 
      item.status === "finished" || 
      item.status?.toLowerCase() === "finished"
    ).length,
    
    // Untuk status "verified" 
    verified: filteredData.filter(item => 
      item.status === "verified" || 
      item.status?.toLowerCase() === "verified"
    ).length,
    
    // Untuk status "unverified" atau tanpa status
    unverified: filteredData.filter(item => 
      !item.status || 
      item.status === "" || 
      item.status === "unverified" || 
      item.status?.toLowerCase() === "unverified"
    ).length
  };
  
  // Verifikasi total status dengan total laporan
  const totalStatuses = statusCounts.value.finished + statusCounts.value.verified + statusCounts.value.unverified;
  
  // Jika total status tidak sama dengan total laporan, distribusikan item yang tidak terhitung
  if (totalStatuses !== totalLaporan.value) {
    console.warn(`Status counts (${totalStatuses}) don't match total count (${totalLaporan.value}). Distributing unaccounted items.`);
    
    // Jika ada laporan tapi semua statusCounts.value nol, isi statusCounts.value.unverified dengan totalLaporan.value
    if (totalStatuses === 0 && totalLaporan.value > 0) {
      statusCounts.value.unverified = totalLaporan.value;
    }
  }
  
  // Process category counts
  processCategoryCounts(filteredData);
  
  // Get recent reports
  recentReports.value = [...filteredData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  // Tunggu sampai DOM dirender
  await nextTick();
  
  // Update chart setelah data diproses
  await updateCharts(filteredData, startDate, endDate);
};

const processCategoryCounts = (filteredData) => {
  const categoryMap = new Map();
  
  // Initialize all categories with zero count
  categories.value.forEach(category => {
    if (category && category.id !== undefined) {
      categoryMap.set(category.id, { 
        id: category.id,
        name: category.name || `Kategori ${category.id}`, 
        count: 0 
      });
    }
  });
  
  // Count laporan for each category
  filteredData.forEach(laporan => {
    if (laporan && laporan.category_id !== undefined && categoryMap.has(laporan.category_id)) {
      const category = categoryMap.get(laporan.category_id);
      category.count++;
    }
  });
  
  // Convert to array and sort
  categoryCounts.value = Array.from(categoryMap.values())
    .filter(cat => cat && cat.name)
    .sort((a, b) => b.count - a.count);
};

const updateCharts = async (filteredData, startDate, endDate) => {
  // Update trend chart
  const trenData = prepareTrendData(filteredData, startDate, endDate);
  await updateTrendChart(trenData);
  
  // Update status chart
  await updateStatusChart();
  
  // Update category chart if categories are available
  if (categoryCounts.value.length > 0) {
    await updateCategoryChart();
  }
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

const updateStatusChart = async () => {
  await nextTick();
  
  try {
    if (!statusChartRef.value) {
      console.warn('Status chart ref is not available');
      return;
    }
    
    const ctx = statusChartRef.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context for status chart');
      return;
    }
    
    if (statusChart) {
      statusChart.destroy();
    }
    
    statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Selesai', 'Terverifikasi', 'Belum Terverifikasi'],
        datasets: [{
          data: [statusCounts.value.finished, statusCounts.value.verified, statusCounts.value.unverified],
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)', // green
            'rgba(234, 179, 8, 0.7)',  // yellow
            'rgba(239, 68, 68, 0.7)',   // red
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(234, 179, 8)',
            'rgb(239, 68, 68)',
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
    
    console.log("Status chart created successfully");
  } catch (error) {
    console.error('Error updating status chart:', error);
  }
};

const updateCategoryChart = async () => {
  await nextTick();
  
  try {
    if (!categoryChartRef.value) {
      console.warn('Category chart ref is not available');
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
    
    // Limit ke 10 kategori teratas jika terlalu banyak
    const topCategories = categoryCounts.value
      .filter(c => c.count > 0)
      .slice(0, 10);
    
    if (topCategories.length === 0) {
      console.warn('No categories with count > 0');
      return;
    }
    
    // Mempersiapkan data untuk diagram batang
    const labels = topCategories.map(c => c.name);
    const counts = topCategories.map(c => c.count);
    
    // Warna untuk batang
    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)', 
      'rgba(255, 99, 132, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(255, 99, 255, 0.7)',
      'rgba(159, 159, 64, 0.7)'
    ];
    
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
    
    categoryChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Jumlah Laporan',
          data: counts,
          backgroundColor: backgroundColors.slice(0, counts.length),
          borderColor: borderColors.slice(0, counts.length),
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
    
    console.log("Category bar chart created successfully");
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

// Function to format status for display
const formatStatus = (status) => {
  if (!status) return 'Belum Terverifikasi';
  
  switch(status.toLowerCase()) {
    case 'finished':
      return 'Selesai';
    case 'verified':
      return 'Terverifikasi';
    case 'unverified':
      return 'Belum Terverifikasi';
    default:
      return status;
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