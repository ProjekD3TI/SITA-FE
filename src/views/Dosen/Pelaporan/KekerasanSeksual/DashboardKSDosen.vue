<template>
  <div class="p-4">
    <div class="bg-white shadow rounded-lg p-6 mb-4">
      <h1 class="text-2xl font-semibold text-gray-800">Pelaporan Kekerasan Seksual</h1>
      <p class="text-gray-600 mt-2">Sistem pencatatan dan manajemen laporan kekerasan seksual yang terjadi di D3 TI SV UNS. Gunakan halaman ini untuk mengirim, memantau, dan mengelola laporan kejadian.</p>
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
            <p class="text-lg font-semibold">{{ totalLaporan || 0 }}</p>
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
            <p class="text-lg font-semibold">{{ dalamProses || 0 }}</p>
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
            <p class="text-lg font-semibold">{{ selesai || 0 }}</p>
          </div>
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
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                v-if="searchQuery || filters.category_id || filters.status || filters.startDate || filters.endDate"
                @click="resetFilters" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Tambah Laporan Button -->
            <button 
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                @click="addNewReport"
            >
                <i class="fas fa-plus mr-2"></i> Tambah Laporan
            </button>
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
            @change="applyFilters"
          >
            <option value="">Semua Status</option>
            <option value="unverified">Belum Diverifikasi</option>
            <option value="verified">Terverifikasi</option>
            <option value="processed">Diproses</option>
            <option value="completed">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
        
        <!-- Kategori Filter -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select 
            v-model="filters.category_id" 
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">Semua Kategori</option>
            <option v-for="(name, id) in categories" :key="id" :value="id">
              {{ name }}
            </option>
          </select>
        </div>
        
        <!-- Date Filter -->
        <div class="flex-1 min-w-[300px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Periode</label>
          <div class="flex gap-2">
            <input 
              type="date" 
              v-model="filters.startDate" 
              class="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="applyFilters"
            >
            <span class="inline-flex items-center">s/d</span>
            <input 
              type="date" 
              v-model="filters.endDate" 
              class="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="applyFilters"
            >
          </div>
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
      <div v-else-if="filteredLaporan && filteredLaporan.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('nomor_laporan_kekerasan')">
                  Nomor Laporan
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('nomor_laporan_kekerasan')"></i>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('judul')">
                  Judul
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('judul')"></i>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pelapor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortBy('tanggal_kejadian')">
                  Tanggal Kejadian
                  <span class="ml-1">
                    <i class="fas" :class="getSortIcon('tanggal_kejadian')"></i>
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(laporan, index) in paginatedLaporan" :key="laporan.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ startIndex + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ laporan.nomor_laporan_kekerasan }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ laporan.judul }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getCategoryName(laporan.category_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ laporan.nama_pelapor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(laporan.tanggal_kejadian) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDetail(laporan)" 
                  class="text-blue-600 hover:text-blue-900 mr-2"
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
        <div class="text-sm text-gray-700">
          Total: {{ filteredLaporan.length }} laporan
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
            Halaman {{ currentPage }} dari {{ totalPages }}
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
      // Data for stats cards
      totalLaporan: 0,
      dalamProses: 0,
      selesai: 0,
      
      // Table data and filtering
      laporan: [],
      filteredLaporan: [],
      categories: {},
      
      // Current user data
      userData: null,
      
      // Other data properties...
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
    // Calculate filtered data based on search query and filters
    filteredLaporan() {
      if (!this.laporan || this.laporan.length === 0) return [];
      
      let result = this.laporan.filter(laporan => {
        // Apply search filter
        const searchTerms = this.searchQuery.toLowerCase().trim();
        const matchesSearch = !searchTerms || 
          (laporan.nomor_laporan && laporan.nomor_laporan.toLowerCase().includes(searchTerms)) ||
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
          const incidentDate = new Date(laporan.tanggal_kejadian);
          
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
      
      // Filter by current user if userData is available
      if (this.userData) {
        // Filter laporan for current user and update statistics
        const userLaporan = this.laporan.filter(item => 
          (item.nama_pelapor && item.nama_pelapor.trim() === this.userData.name.trim()) || 
          (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
        );
      }
      
      // Sort the filtered data
      return result.sort((a, b) => {
        const modifier = this.sortDirection === 'asc' ? 1 : -1;
        
        // Handle different data types for sorting
        if (this.sortKey === 'tanggal_kejadian') {
          return modifier * (new Date(a[this.sortKey]) - new Date(b[this.sortKey]));
        } else {
          // String comparison for other fields
          if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
          if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
          return 0;
        }
      });
    },
    
    // Paginated data for display
    paginatedLaporan() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLaporan.slice(start, end);
    },
    
    // Calculate pagination values
    totalPages() {
      return Math.ceil(this.filteredLaporan.length / this.itemsPerPage);
    },
    
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    
    pendingCount() {
      return this.laporan.filter(item => 
        item.status === 'unverified' || item.status === 'verified' || item.status === 'processed'
      ).length;
    },
    
    completedCount() {
      return this.laporan.filter(item => item.status === 'completed').length;
    }
  },
  
  methods: {
    // Fetch data from API
    async fetchData() {
      this.loading = true;
      try {
        const [categoriesResponse, laporanResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/category'),
          axios.get('http://localhost:8000/api/laporan_kekerasan')
        ]);
        
        console.log('Raw API response:', laporanResponse);
        console.log('Categories response:', categoriesResponse);
        console.log('Laporan data:', laporanResponse.data);
        console.log('User data:', this.userData);
        
        this.categories = categoriesResponse.data.reduce((acc, category) => {
          acc[category.category_id] = category.nama;
          return acc;
        }, {});
        
        this.laporan = laporanResponse.data;
        
        // Calculate summary statistics based on filtered data
        if (this.userData) {
          // Filter laporan for current user
          const userLaporan = this.laporan.filter(item => 
            (item.nama_pelapor && item.nama_pelapor.trim() === this.userData.name.trim()) || 
            (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
          );
          
          // IMPORTANT: Assign the filtered reports to filteredLaporan
          this.filteredLaporan = userLaporan;
          
          // Update statistics
          this.totalLaporan = userLaporan.length;
          this.dalamProses = userLaporan.filter(item => item.status === 'unverified').length;
          this.selesai = userLaporan.filter(item => item.status === 'verified').length;
          
          console.log(`Filtered to ${userLaporan.length} reports for user: ${this.userData.name}`);
        } else {
          // If no user data, use all reports
          this.filteredLaporan = this.laporan;
        }
        
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
    formatDate(dateString) {
      if (!dateString) return '-';
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
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
      // Implement search logic
      this.applyFilters();
    },
    
    addNewReport() {
      // Navigate to form page or show modal for adding a new report
      console.log('Add new incident report');
      // For example:
      this.$router.push('/dosen/addpelaporanksdosen');
    },
    
    applyFilters() {
      console.log('Applying filters:', this.filters);
      
      // The filtering logic is now in the computed property
      // Just reset page when filters change
      this.currentPage = 1;
    },

    resetFilters() {
      this.searchQuery = '';
      this.filters.category_id = '';
      this.filters.status = '';
      this.filters.startDate = null;
      this.filters.endDate = null;
      this.filterReports(); // Call filterReports to reset to original data
    },
    
    filterReports() {
      // Start with all reports
      let result = [...this.reports]; // Assuming you have a 'reports' array with all data
      
      // Filter by search query (case insensitive search on report name)
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(report => 
          report.name.toLowerCase().includes(searchLower) || 
          report.title.toLowerCase().includes(searchLower) // Add more fields as needed
        );
      }
      
      // Apply other filters (category, status, date range)
      if (this.filters.category_id) {
        result = result.filter(report => report.category_id === this.filters.category_id);
      }
      
      if (this.filters.status) {
        result = result.filter(report => report.status === this.filters.status);
      }
      
      if (this.filters.startDate && this.filters.endDate) {
        result = result.filter(report => {
          const reportDate = new Date(report.created_at);
          return reportDate >= new Date(this.filters.startDate) && 
                 reportDate <= new Date(this.filters.endDate);
        });
      }
      
      this.filteredReports = result;
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
      // Accept the entire laporan object instead of just the ID
      console.log('Laporan being passed:', laporan);
      
      // Exit early if no laporan object was provided
      if (!laporan) {
        console.error('No laporan object provided to viewDetail');
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
          // Log the object structure if we can't find the ID
          console.error('Cannot find ID in laporan object. Available keys:', Object.keys(laporan));
          return; // Don't navigate without a valid ID
        }
      } else {
        // If laporan is already a primitive value (number or string)
        actualId = laporan;
      }
      
      // Make sure we have an ID value before navigating
      if (!actualId && actualId !== 0) {
        console.error('Invalid ID for navigation:', actualId);
        return;
      }
      
      console.log('Navigating with ID:', actualId);
      
      // Navigate to detail page with the correct route name
      try {
        this.$router.push({
          name: "DetailKSDosen",
          params: { id: actualId }
        });
      } catch (error) {
        console.error('Navigation error:', error);
        
        // Fallback navigation method using the path directly
        this.$router.push(`/laporan_kekerasan/${actualId}`);
      }
    },
    
    sortBy(key) {
      // If we click the same key, toggle direction
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortDirection = 'asc';
      }
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fa-sort';
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },
    
    // Add a method to get the current user from cookies
    getCurrentUser() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          this.userData = decryptData(encryptedUserData);
          console.log("Current user loaded:", this.userData.name);
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    }
  },
  
  watch: {
    // Add watchers to trigger filtering when inputs change
    searchQuery() {
      this.filterReports();
    },
    'filters.category_id'() {
      this.filterReports();
    },
    'filters.status'() {
      this.filterReports();
    },
    'filters.startDate'() {
      this.filterReports();
    },
    'filters.endDate'() {
      this.filterReports();
    }
  },
  
  mounted() {
    // Get current user first, then fetch data
    this.getCurrentUser();
    this.fetchData();
    
    // Any other mounted code...
    console.log('filteredLaporan length:', this.filteredLaporan.length);
console.log('paginatedLaporan length:', this.paginatedLaporan.length);

  }
};
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.unverified {
  background-color: #f3f4f6;
  color: #4b5563;
}

.verified {
  background-color: #dbeafe;
  color: #2563eb;
}

.processed {
  background-color: #fef3c7;
  color: #d97706;
}

.completed {
  background-color: #d1fae5;
  color: #059669;
}

.rejected {
  background-color: #fee2e2;
  color: #dc2626;
}
</style>