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
      <!-- Kategori Filter -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
        <select 
          v-model="filters.category_id" 
          class="w-med border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="applyFilters"
        >
          <option value="">Semua Kategori</option>
          <option v-for="(name, id) in filteredCategories" :key="id" :value="id">
            {{ name }}
          </option>
        </select>
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
    },

    filteredCategories() {
      const result = {};
      for (const [id, name] of Object.entries(this.categories)) {
        if (name.startsWith('Kekerasan')) {
          result[id] = name;
        }
      }
      return result;
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
      // Always start from the user-filtered data
      let filtered = [...this.laporan];
      
      // Apply user filtering first (keeping the same logic from fetchData)
      if (this.userData && this.userData.name) {
        filtered = filtered.filter(item => 
          (item.nama_pelapor && item.nama_pelapor.trim() === this.userData.name.trim()) || 
          (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
        );
      }
      
      // Then apply search query if it exists
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          (item.judul && item.judul.toLowerCase().includes(query)) || 
          (item.nomor_laporan && item.nomor_laporan.toLowerCase().includes(query)) ||
          (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(query))
        );
      }
      
      // Update the filtered list
      this.filteredLaporan = filtered;
      
      // Reset to first page when search changes
      this.currentPage = 1;
    },
    
    addNewReport() {
      // Navigate to form page or show modal for adding a new report
      console.log('Add new incident report');
      // For example:
      this.$router.push('/dosen/addpelaporanksdosen');
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
      console.log('Filtering reports...');
      
      // Get the current user information and ensure it's a number for comparison
      const currentUserId = parseInt(this.userData.id, 10);
      console.log('Current user ID (parsed):', currentUserId);
      
      // Check if currentUserId is valid
      if (!currentUserId) {
        console.error('Invalid user ID or user not logged in');
        this.filteredLaporan = [];
        return;
      }
      
      // Start with completely unfiltered data
      let allReports = [...this.laporanKs];
      console.log('Total reports before filtering:', allReports.length);
      
      // STEP 1: First, check if we're looking at /reports for a dosen (should only see their own)
      const isDosenView = this.$route.path.includes('/dosen') || this.$route.name.includes('Dosen');
      console.log('Is dosen view?', isDosenView);
      
      // STEP 2: Filter based on user role
      let userReports = allReports;
      
      if (isDosenView) {
        // In dosen view, only show reports explicitly associated with this user
        userReports = allReports.filter(item => {
          // Convert both IDs to numbers to ensure proper comparison
          const reportUserId = item.user_id ? parseInt(item.user_id, 10) : null;
          const reportPelaporId = item.pelapor_id ? parseInt(item.pelapor_id, 10) : null;
          
          console.log(`Report ${item.id}: user_id=${reportUserId}, pelapor_id=${reportPelaporId}, currentUserId=${currentUserId}`);
          
          // Strict equality check after type conversion
          const isUsersReport = 
            (reportUserId !== null && reportUserId === currentUserId) || 
            (reportPelaporId !== null && reportPelaporId === currentUserId);
          
          if (!isUsersReport) {
            console.log(`Excluding report ${item.id} - not associated with current user ${currentUserId}`);
          }
          
          return isUsersReport;
        });
        
        console.log('Reports belonging to current user:', userReports.length);
      } else {
        // If not in dosen view, show all reports (for admin or public view)
        console.log('Showing all reports (not in dosen view)');
      }
      
      // If no user reports found in dosen view, immediately return empty results
      if (isDosenView && userReports.length === 0) {
        console.log('No reports found for current user');
        this.filteredLaporan = [];
        return;
      }
      
      // Rest of the filtering logic remains the same...
      let filtered = [...userReports];
      
      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(item => {
          return (item.judul_laporan?.toLowerCase().includes(query) || 
                  item.category?.name?.toLowerCase().includes(query));
        });
        console.log('After search filter:', filtered.length);
      }
      
      // Apply category filter
      if (this.filters.category_id) {
        filtered = filtered.filter(item => {
          const itemCategoryId = parseInt(item.category_id, 10);
          const filterCategoryId = parseInt(this.filters.category_id, 10);
          return itemCategoryId === filterCategoryId;
        });
        console.log('After category filter:', filtered.length);
      }
      
      // Apply date filter
      if (this.filters.startDate || this.filters.endDate) {
        console.log('Applying date filters - Start:', this.filters.startDate, 'End:', this.filters.endDate);
        
        filtered = filtered.filter(item => {
          // Use the correct date field, ensure it exists
          const dateStr = item.tanggal_kegiatan || item.created_at || item.tanggal;
          
          if (!dateStr) {
            console.log(`Report ${item.id} has no valid date field`);
            return false;
          }
          
          try {
            const itemDate = new Date(dateStr);
            
            // Check that the date is valid
            if (isNaN(itemDate.getTime())) {
              console.log(`Report ${item.id} has invalid date: ${dateStr}`);
              return false;
            }
            
            // Check start date
            if (this.filters.startDate) {
              const startDate = new Date(this.filters.startDate);
              startDate.setHours(0, 0, 0, 0);
              if (itemDate < startDate) {
                return false;
              }
            }
            
            // Check end date
            if (this.filters.endDate) {
              const endDate = new Date(this.filters.endDate);
              endDate.setHours(23, 59, 59, 999);
              if (itemDate > endDate) {
                return false;
              }
            }
            
            return true;
          } catch (error) {
            console.error(`Error processing date for report ${item.id}:`, error);
            return false;
          }
        });
        
        console.log('After date filter:', filtered.length);
      }
      
      // Update the filtered reports
      this.filteredLaporan = filtered;
      
      // Reset pagination
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
    },

    applyFilters() {
      console.log('Applying filters:', this.filters); // Debug log
      
      // Start with all data
      let filtered = [...this.laporan];
      
      // Apply category filter
      if (this.filters.category_id) {
        console.log('Filtering by category:', this.filters.category_id);
        filtered = filtered.filter(item => 
          String(item.category_id) === String(this.filters.category_id)
        );
      }
      
      // Apply status filter
      if (this.filters.status) {
        console.log('Filtering by status:', this.filters.status);
        // Map frontend status labels to actual status values in the data
        const statusMap = {
          'Belum Diverifikasi': 'unverified',
          'Diverifikasi': 'verified',
          'Ditolak': 'rejected'
        };
        
        const statusValue = statusMap[this.filters.status] || this.filters.status;
        filtered = filtered.filter(item => item.status === statusValue);
      }
      
      // Apply date range filter
      if (this.filters.startDate || this.filters.endDate) {
        console.log('Filtering by date range:', this.filters.startDate, 'to', this.filters.endDate);
        
        filtered = filtered.filter(item => {
          // Convert to Date objects for comparison
          const itemDate = new Date(item.created_at || item.tanggal); // Adjust field name as needed
          
          // Check start date if specified
          if (this.filters.startDate) {
            const startDate = new Date(this.filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (itemDate < startDate) return false;
          }
          
          // Check end date if specified
          if (this.filters.endDate) {
            const endDate = new Date(this.filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (itemDate > endDate) return false;
          }
          
          return true;
        });
      }
      
      // Update filtered data
      this.filteredLaporan = filtered;
      
      // Reset to first page when filters change
      this.currentPage = 1;
      
      console.log('Filtered results:', this.filteredLaporan.length); // Debug log
    },
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
