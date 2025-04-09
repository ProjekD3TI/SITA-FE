<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="p-4">
        <div class="bg-white shadow rounded-lg p-6 mb-4">
          <h1 class="text-2xl font-semibold text-gray-800">Dashboard Pelaporan</h1>
          <div class="text-gray-600 mt-2 space-y-1">
            <p class="font-medium">{{ userData?.nim || "NIM tidak tersedia" }}</p>
            <p class="font-medium">{{ userData?.email }}</p>
            <p>Selamat datang, {{ userData?.name || "Mahasiswa" }}</p>
          </div>
        </div>

        <!-- Dashboard Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <i class="fas fa-file-alt text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Total Laporan</p>
                <p class="text-lg font-semibold">{{ totalReports || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <i class="fas fa-hourglass-half text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Dalam Proses</p>
                <p class="text-lg font-semibold">{{ processingReports || 0 }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <i class="fas fa-check-circle text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Selesai</p>
                <p class="text-lg font-semibold">{{ completedReports || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Reports with Search, Filters and Pagination -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Laporan Terbaru</h2>
            
            <!-- Search Bar -->
            <div class="mt-3 md:mt-0 relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari laporan..."
                class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleSearch"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>
          
          <!-- Filters Section -->
          <div class="mb-4 flex flex-wrap gap-3">
            <!-- Status Filter -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                v-model="filters.status" 
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Selesai">Selesai</option>
                <option value="Diproses">Diproses</option>
                <option value="Menunggu">Menunggu</option>
              </select>
            </div>
            
            <!-- Type Filter -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
              <select 
                v-model="filters.type" 
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Jenis</option>
                <option v-for="type in reportTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            
            <!-- Date Range Filter -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <select 
                v-model="filters.period" 
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Waktu</option>
                <option value="week">7 Hari Terakhir</option>
                <option value="month">30 Hari Terakhir</option>
                <option value="quarter">90 Hari Terakhir</option>
              </select>
            </div>
            
            <!-- Reset Filters Button -->
            <div class="self-end mb-1 min-w-[100px]">
              <button 
                @click="resetFilters" 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
              >
                Reset Filter
              </button>
            </div>
          </div>
          
          <div v-if="filteredReports && filteredReports.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center cursor-pointer" @click="sortBy('id')">
                      ID
                      <span class="ml-1">
                        <i class="fas" :class="getSortIcon('id')"></i>
                      </span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center cursor-pointer" @click="sortBy('type')">
                      Jenis
                      <span class="ml-1">
                        <i class="fas" :class="getSortIcon('type')"></i>
                      </span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center cursor-pointer" @click="sortBy('date')">
                      Tanggal
                      <span class="ml-1">
                        <i class="fas" :class="getSortIcon('date')"></i>
                      </span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div class="flex items-center cursor-pointer" @click="sortBy('status')">
                      Status
                      <span class="ml-1">
                        <i class="fas" :class="getSortIcon('status')"></i>
                      </span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in paginatedReports" :key="report.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ report.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(report.status)">{{ report.status }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-800 mr-2">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            {{ searchQuery || Object.values(filters).some(f => f !== '') ? 'Tidak ada hasil yang ditemukan' : 'Belum ada laporan yang dibuat' }}
          </div>
          
          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4 border-t pt-4">
            <div class="flex items-center text-sm text-gray-500">
              Menampilkan {{ filteredReports.length ? startIndex + 1 : 0 }}-{{ endIndex }} dari {{ filteredReports.length }} laporan
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                :class="[
                  'px-3 py-1 rounded border', 
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages" 
                :class="[
                  'px-3 py-1 rounded border',
                  currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { decryptData } from "../../../services/encrypt";
import VueCookies from "vue-cookies";
  
const userData = ref(null);
const totalReports = ref(0);
const processingReports = ref(0);
const completedReports = ref(0);
const allReports = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Sorting
const sortConfig = ref({
  key: 'date',
  direction: 'desc'
});

// Filtering
const filters = ref({
  status: '',
  type: '',
  period: ''
});

// List of unique report types for the dropdown
const reportTypes = computed(() => {
  if (!allReports.value.length) return [];
  return [...new Set(allReports.value.map(report => report.type))];
});

// Filter by date helper function
const isWithinPeriod = (dateString, period) => {
  if (!period) return true;
  
  const today = new Date();
  const reportDate = new Date(dateString);
  const diffTime = Math.abs(today - reportDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  switch (period) {
    case 'week':
      return diffDays <= 7;
    case 'month':
      return diffDays <= 30;
    case 'quarter':
      return diffDays <= 90;
    default:
      return true;
  }
};

// Search and filter functionality
const filteredReports = computed(() => {
  let result = allReports.value;
  
  // Apply filters
  if (filters.value.status) {
    result = result.filter(report => report.status === filters.value.status);
  }
  
  if (filters.value.type) {
    result = result.filter(report => report.type === filters.value.type);
  }
  
  if (filters.value.period) {
    result = result.filter(report => isWithinPeriod(report.date, filters.value.period));
  }
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(report => 
      report.id.toLowerCase().includes(query) ||
      report.type.toLowerCase().includes(query) ||
      report.date.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  result = [...result].sort((a, b) => {
    let modifier = sortConfig.value.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.value.key === 'date') {
      return modifier * (new Date(a.date) - new Date(b.date));
    }
    
    if (a[sortConfig.value.key] < b[sortConfig.value.key]) return -1 * modifier;
    if (a[sortConfig.value.key] > b[sortConfig.value.key]) return 1 * modifier;
    return 0;
  });
  
  return result;
});

// Sorting function
const sortBy = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value.key = key;
    sortConfig.value.direction = 'asc';
  }
};

const getSortIcon = (key) => {
  if (sortConfig.value.key === key) {
    return sortConfig.value.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
  return 'fa-sort';
};

// Reset all filters
const resetFilters = () => {
  filters.value = {
    status: '',
    type: '',
    period: ''
  };
  searchQuery.value = '';
  currentPage.value = 1;
};

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredReports.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value;
  return end > filteredReports.value.length ? filteredReports.value.length : end;
});

const paginatedReports = computed(() => {
  return filteredReports.value.slice(startIndex.value, endIndex.value);
});

// Reset to first page when search query or filters change
watch([searchQuery, filters], () => {
  currentPage.value = 1;
}, { deep: true });

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleSearch = () => {
  // Debounce could be added here if needed
  currentPage.value = 1; // Reset to first page on search
};
  
onMounted(() => {
  const encryptedUserData = VueCookies.get("user_session");
  if (encryptedUserData) {
    userData.value = decryptData(encryptedUserData);
  }
  
  // Fetch dashboard data
  fetchDashboardData();
});

const fetchDashboardData = () => {
  // This would be replaced with actual API calls
  // Mock data with more examples for pagination demonstration
  totalReports.value = 12;
  processingReports.value = 5;
  completedReports.value = 7;
  
  allReports.value = [
    { id: 'KJD001', type: 'Kekerasan', date: '2023-10-15', status: 'Selesai' },
    { id: 'KJD002', type: 'Bullying', date: '2023-10-20', status: 'Diproses' },
    { id: 'KJD003', type: 'Pelecehan', date: '2023-10-25', status: 'Menunggu' },
    { id: 'KJD004', type: 'Perundungan', date: '2023-11-01', status: 'Diproses' },
    { id: 'KJD005', type: 'Intimidasi', date: '2023-11-05', status: 'Menunggu' },
    { id: 'KJD006', type: 'Kekerasan', date: '2023-11-10', status: 'Selesai' },
    { id: 'KJD007', type: 'Bullying', date: '2023-11-15', status: 'Selesai' },
    { id: 'KJD008', type: 'Pelecehan', date: '2023-11-20', status: 'Diproses' },
    { id: 'KJD009', type: 'Perundungan', date: '2023-11-25', status: 'Selesai' },
    { id: 'KJD010', type: 'Intimidasi', date: '2023-12-01', status: 'Selesai' },
    { id: 'KJD011', type: 'Kekerasan', date: '2023-12-05', status: 'Diproses' },
    { id: 'KJD012', type: 'Bullying', date: '2023-12-10', status: 'Menunggu' }
  ];
};

const getStatusClass = (status) => {
  switch(status) {
    case 'Selesai':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
    case 'Diproses':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800';
    case 'Menunggu':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
    default:
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
  }
};
</script>