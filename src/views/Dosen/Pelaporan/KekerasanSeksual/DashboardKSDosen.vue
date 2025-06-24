<template>
  <div class="p-4 overflow-x-hidden w-full">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Pelaporan Kekerasan Seksual</h1>
      <p class="text-gray-600 mt-2">Sistem pencatatan dan manajemen laporan kekerasan seksual yang terjadi di D3 TI SV UNS. Gunakan halaman ini untuk mengirim, memantau, dan mengelola laporan kejadian.</p>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600">
            <i class="fas fa-file-alt text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500">Total Laporan</p>
            <p class="text-lg font-semibold">{{ totalLaporanCount || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Limit Warning Banner -->
    <div v-if="hasReachedDailyLimit" class="warning-banner mb-4">
      <div class="warning-content">
        <i class="fas fa-exclamation-circle warning-icon"></i>
        <div class="warning-text">
          Anda telah mencapai batas maksimal 5 laporan kekerasan seksual dalam sehari.
          <span class="warning-secondary-text">Laporan baru dapat dibuat kembali pada hari berikutnya.</span>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-6">
        <div class="flex flex-col md:flex-row justify-between md:items-center">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Daftar Laporan Kekerasan Seksual</h2>
          
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Search Bar -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari laporan..."
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleSearch"
              />
              <button 
                v-if="searchQuery || filters.category_id || filters.status || filters.startDate || filters.endDate"
                @click="resetFilters" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Tambah Laporan Button with Daily Limit Check -->
            <button 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
              @click="addNewReport"
              :disabled="hasReachedDailyLimit"
              :class="{'opacity-50 cursor-not-allowed': hasReachedDailyLimit}"
            >
              <i class="fas fa-plus mr-2"></i> Tambah Laporan
            </button>
          </div>
        </div>
      </div>
      
      <!-- Filters Section -->
      <div class="mb-4 flex flex-wrap gap-3">
        <!-- Kategori Filter -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select 
            v-model="filters.category_id" 
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">Semua Kategori</option>
            <option v-for="(name, id) in filteredCategories" :key="id" :value="id">
              {{ name }}
            </option>
          </select>
        </div>

        <!-- Date Range Filters -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            v-model="filters.startDate"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          />
        </div>

        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
          <input
            type="date"
            v-model="filters.endDate"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          />
        </div>
          
        <!-- Reset Filter Button -->
        <div class="flex items-end">
          <button 
            @click="resetFilters" 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
          >
            Reset Filter
          </button>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>
      
      <!-- Error message -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>
      
      <!-- Table Section -->
      <div v-else-if="filteredLaporanList && filteredLaporanList.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('nomor_laporan_kekerasan')">
                  Nomor Laporan
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('nomor_laporan_kekerasan')"></i>
                  </span>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('created_at')">
                  Tanggal
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('created_at')"></i>
                  </span>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('judul')">
                  Judul
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('judul')"></i>
                  </span>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelapor
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(laporan, index) in paginatedLaporan" :key="laporan.id">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {{ startIndex + index + 1 }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ laporan.nomor_laporan_kekerasan }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ formatedDate(laporan.created_at, 'short') }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 truncate max-w-[200px]">
                {{ laporan.judul }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ getCategoryName(laporan.category_id) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {{ laporan.nama_pelapor }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDetail(laporan)" 
                  class="text-blue-600 hover:text-blue-900"
                >
                  <i class="fas fa-eye"></i> Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty state when no results match filters -->
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Tidak ada laporan yang sesuai dengan filter.</p>
        <button 
          @click="resetFilters" 
          class="mt-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Reset Filter
        </button>
      </div>
      
      <!-- Pagination -->
      <div class="mt-6 flex justify-between items-center">
        <div class="flex items-center text-sm text-gray-500">
          Menampilkan {{ userFilteredLaporan.length ? startIndex + 1 : 0 }}-{{ Math.min(startIndex + itemsPerPage, userFilteredLaporan.length) }} dari {{ userFilteredLaporan.length }} laporan
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="px-3 py-1 border rounded-md"
            :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="text-sm text-gray-700">
            Halaman {{ currentPage }} dari {{ totalPages || 1 }}
          </span>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages" 
            class="px-3 py-1 border rounded-md"
            :class="currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';

export default {
  name: 'DashboardKSDosen',
  data() {
    return {
      // Table data and filtering
      laporan: [],
      filteredLaporanList: [], // Renamed to avoid conflict with computed
      categories: {},
      
      // Current user data
      userData: null,
      
      // Daily limit tracking
      todaysReportsCount: 0,
      dailyReportLimit: 5, // Set maximum daily report limit to 5
      
      // Other data properties
      loading: false,
      error: null,
      sortKey: 'tanggal_kejadian',
      sortDirection: 'desc',
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: '',
      filters: {
        category_id: '',
        status: '',
        startDate: '',
        endDate: ''
      }
    };
  },
  
  computed: {
    // Check if user has reached daily report limit
    hasReachedDailyLimit() {
      return this.todaysReportsCount >= this.dailyReportLimit;
    },

    // Calculate filtered data based on search query and filters
    filteredLaporan() {
      if (!this.laporan || this.laporan.length === 0) return [];
      
      let result = this.laporan.filter(laporan => {
        // Apply search filter
        const searchTerms = this.searchQuery.toLowerCase().trim();
        const matchesSearch = !searchTerms || 
          (laporan.nomor_laporan_kekerasan && laporan.nomor_laporan_kekerasan.toLowerCase().includes(searchTerms)) ||
          (laporan.judul && laporan.judul.toLowerCase().includes(searchTerms)) ||
          (laporan.nama_pelapor && laporan.nama_pelapor.toLowerCase().includes(searchTerms)) ||
          (laporan.deskripsi && laporan.deskripsi.toLowerCase().includes(searchTerms));
        
        // Apply status filter
        const matchesStatus = !this.filters.status || 
          laporan.status === this.filters.status;
        
        // Apply category filter
        const matchesCategory = !this.filters.category_id || 
          String(laporan.category_id) === String(this.filters.category_id);
        
        // Apply date range filter
        let matchesDateRange = true;
        if (this.filters.startDate || this.filters.endDate) {
          const incidentDate = new Date(laporan.tanggal_kejadian || laporan.created_at);
          
          if (this.filters.startDate) {
            const startDate = new Date(this.filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (incidentDate < startDate) matchesDateRange = false;
          }
          
          if (this.filters.endDate) {
            const endDate = new Date(this.filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (incidentDate > endDate) matchesDateRange = false;
          }
        }
        
        return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
      });
      
      // Sort the filtered data
      return result.sort((a, b) => {
        const modifier = this.sortDirection === 'asc' ? 1 : -1;
        
        // Handle different data types for sorting
        if (this.sortKey === 'tanggal_kejadian' || this.sortKey === 'created_at') {
          return modifier * (new Date(a[this.sortKey] || 0) - new Date(b[this.sortKey] || 0));
        } else {
          // Handle null or undefined values
          const valA = a[this.sortKey] || '';
          const valB = b[this.sortKey] || '';
          
          // String comparison for other fields
          if (valA < valB) return -1 * modifier;
          if (valA > valB) return 1 * modifier;
          return 0;
        }
      });
    },
    
    // Statistics computations
    totalLaporanCount() {
      if (!this.userData) return 0;
      
      return this.laporan.filter(item => 
        (item.nama_pelapor && item.nama_pelapor.trim() === this.userData.name.trim()) || 
        (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
      ).length;
    },

    // Pagination computed properties
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },

    userFilteredLaporan() {
      if (!this.userData) return [];
      
      return this.filteredLaporan.filter(item => 
        (item.nama_pelapor && item.nama_pelapor.trim() === this.userData.name.trim()) || 
        (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
      );
    },

    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.userFilteredLaporan.length);
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.userFilteredLaporan.length / this.itemsPerPage));
    },

    paginatedLaporan() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.userFilteredLaporan.slice(start, end);
    },

    filteredCategories() {
      const result = {};
      for (const [id, name] of Object.entries(this.categories)) {
        if (name && typeof name === 'string' && name.startsWith('Kekerasan')) {
          result[id] = name;
        }
      }
      return result;
    },
  },
  
  methods: {
    // Count today's reports by the current user
    countTodaysReports() {
      if (!this.userData || !this.laporan.length) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of the day
      
      // Filter reports created today by the current user
      const todaysReports = this.laporan.filter(item => {
        // Check if report is from current user
        const isCurrentUser = (item.nama_pelapor && this.userData.name && item.nama_pelapor.trim() === this.userData.name.trim()) || 
                              (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik));
        
        if (!isCurrentUser) return false;
        
        // Check if report was created today
        const reportDate = new Date(item.created_at);
        reportDate.setHours(0, 0, 0, 0);
        return reportDate.getTime() === today.getTime();
      });
      
      this.todaysReportsCount = todaysReports.length;
      return todaysReports.length;
    },
    
    // Fetch data from API
    async fetchData() {
      this.loading = true;
      try {
        const [categoriesResponse, laporanResponse] = await Promise.all([
          axios.get('http://pelaporan-d3ti.my.id/api/category'),
          axios.get('http://pelaporan-d3ti.my.id/api/laporan_kekerasan')
        ]);
        
        this.categories = categoriesResponse.data.reduce((acc, category) => {
          acc[category.category_id] = category.nama;
          return acc;
        }, {});
        
        // Store all reports in this.laporan
        this.laporan = laporanResponse.data;
        
        // Count today's reports after loading data
        this.countTodaysReports();
        
        // Apply filtering based on user
        this.filterReports();
        
      } catch (error) {
        console.error('Error fetching data:', error);
        this.error = 'Gagal memuat data. Silakan coba lagi nanti.';
      } finally {
        this.loading = false;
      }
    },
    
    // Helper to get category name by ID
    getCategoryName(categoryId) {
      return this.categories[categoryId] || `Kategori ${categoryId}`;
    },
    
    // Format date for display
    formatedDate(dateString, format = 'long') {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      
      if (format === 'long') {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
      } else if (format === 'short') {
        // Format to DD-MM-YYYY
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
      
      return dateString;
    },
    
    // Format status for display
    formatStatus(status) {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Terverifikasi',
        'rejected': 'Ditolak'
      };
      
      return statusMap[status] || status;
    },
    
    // Handle search input with debounce
    handleSearch() {
      this.filterReports();
    },
    
    // Navigate to add new report page if daily limit not reached
    addNewReport() {
      if (this.hasReachedDailyLimit) {
        return; // Don't allow navigation if limit is reached
      }
      this.$router.push('/dosen/addpelaporanksdosen');
    },

    resetFilters() {
      this.searchQuery = '';
      this.filters.category_id = '';
      this.filters.status = '';
      this.filters.startDate = '';
      this.filters.endDate = '';
      
      // Re-apply filtering (which will only filter by user)
      this.filterReports();
    },
    
    filterReports() {
      // Using the computed filteredLaporan data to update the data property
      this.filteredLaporanList = this.filteredLaporan;
      
      // Reset to first page when filters change
      this.currentPage = 1;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    viewDetail(laporan) {
      if (!laporan) {
        return;
      }
      
      // Extract the correct ID based on the data structure
      let actualId;
      
      if (typeof laporan === 'object') {
        // Try all possible ID field names in the object
        if (laporan.laporan_kekerasan_id) {
          actualId = laporan.laporan_kekerasan_id;
        } else if (laporan.id) {
          actualId = laporan.id;
        } else {
          return;
        }
      } else {
        actualId = laporan;
      }
      
      if (!actualId && actualId !== 0) {
        return;
      }
      
      // Navigate to detail page with the correct route name
      this.$router.push({
        name: "DetailKSDosen",
        params: { id: actualId }
      });
    },
    
    sortBy(key) {
      // If we click the same key, toggle direction
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortDirection = 'asc';
      }
      
      // Re-apply filtering to reflect the new sort
      this.filterReports();
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fa-sort';
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },
    
    // Get the current user from cookies
    getCurrentUser() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          this.userData = decryptData(encryptedUserData);
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    },

    // Apply filters
    applyFilters() {
      this.filterReports();
    },
  },
  
  watch: {
    // Add watchers to trigger filtering when computed filtered data changes
    filteredLaporan: {
      handler(newValue) {
        this.filteredLaporanList = newValue;
      },
      deep: true
    }
  },
  
  mounted() {
    // Get current user first, then fetch data
    this.getCurrentUser();
    this.fetchData();
  }
};
</script>

<style>
/* Global styles to prevent horizontal scrolling */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}
</style>

<style scoped>
/* Container styles */
.p-4 {
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Card and table container styles */
.bg-white.shadow.rounded-lg {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Make table fit container width */
table {
  width: 100%;
  table-layout: fixed; /* This ensures columns respect their width settings */
}

/* Set specific widths for each column to balance the spacing */
table th:nth-child(1), /* NO column */
table td:nth-child(1) {
  width: 5%;
}

table th:nth-child(2), /* NOMOR LAPORAN column */
table td:nth-child(2) {
  width: 15%;
}

table th:nth-child(3), /* TANGGAL column */
table td:nth-child(3) {
  width: 10%;
}

table th:nth-child(4), /* JUDUL column - give it more space */
table td:nth-child(4) {
  width: 25%;
}

table th:nth-child(5), /* KATEGORI column */
table td:nth-child(5) {
  width: 18%;
}

table th:nth-child(6), /* PELAPOR column */
table td:nth-child(6) {
  width: 10%;
}

table th:nth-child(7), /* AKSI column */
table td:nth-child(7) {
  width: 10%;
  text-align: center;
}

/* Add proper text handling for long content */
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Add tooltip capability for truncated text */
.has-tooltip {
  position: relative;
}

.has-tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 0;
  top: 100%;
  background: #333;
  color: white;
  padding: 5px;
  border-radius: 4px;
  z-index: 10;
  white-space: normal;
  max-width: 300px;
  word-break: break-word;
}

/* Reduce horizontal padding in cells */
th, td {
  padding-left: 1rem;
  padding-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Daily limit warning banner */
.warning-banner {
  background-color: #FFF5F5;
  border: 1px solid #FED7D7;
  border-left: 4px solid #E53E3E;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  margin-top: 8px;
  width: 100%;
  display: flex;
  align-items: center;
}

.warning-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.warning-icon {
  font-size: 18px;
  color: #E53E3E;
  margin-right: 12px;
  flex-shrink: 0;
}

.warning-text {
  color: #E53E3E;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
}

.warning-secondary-text {
  display: block;
  color: #718096;
  font-weight: normal;
  font-size: 13px;
  margin-top: 2px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .flex-col.md\:flex-row {
    width: 100%;
  }
  
  button {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>