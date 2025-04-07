<template>
          <div class="p-4">
              <div class="bg-white shadow rounded-lg p-6 mb-4">
                  <h1 class="text-2xl font-semibold text-gray-800">Pelaporan Kejadian</h1>
                  <p class="text-gray-600 mt-2">Sistem pencatatan dan manajemen laporan kejadian yang terjadi di D3 TI SV UNS. Gunakan halaman ini untuk mengirim, memantau, dan mengelola laporan kejadian.</p>
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

              <!-- Laporan Kejadian with Search, Filters and Pagination -->
              <div class="bg-white shadow rounded-lg p-6">
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h2 class="text-lg font-semibold text-gray-800">Daftar Laporan Kejadian</h2>
                      
                      <!-- Search Bar and Button Container -->
                      <div class="mt-3 md:mt-0 flex items-center space-x-2">
                          <!-- Search Bar -->
                          <div class="relative">
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
                          
                          <!-- Tambah Laporan Button -->
                          <button 
                              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                              @click="addNewReport"
                          >
                              <i class="fas fa-plus mr-2"></i> Tambah Laporan
                          </button>
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
                              <option value="Dalam Proses">Dalam Proses</option>
                          </select>
                      </div>
                      
                      <!-- Type Filter -->
                      <div class="flex-1 min-w-[200px]">
                          <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kejadian</label>
                          <select 
                              v-model="filters.jenisKejadian" 
                              class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                              <option value="">Semua Jenis</option>
                              <option v-for="jenis in jenisKejadianList" :key="jenis" :value="jenis">{{ jenis }}</option>
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
                  
                  <div v-if="filteredLaporan && filteredLaporan.length > 0" class="overflow-x-auto">
                      <!-- Within your table section, replace the table header and body with this: -->
                      <table class="min-w-full divide-y divide-gray-200">
                          <thead>
                              <tr>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      No
                                  </th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      <div class="flex items-center cursor-pointer" @click="sortBy('nomor_laporan')">
                                          Nomor Laporan
                                          <span class="ml-1">
                                              <i class="fas" :class="getSortIcon('nomor_laporan')"></i>
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
                                      <div class="flex items-center cursor-pointer" @click="sortBy('category_id')">
                                          Kategori
                                          <span class="ml-1">
                                              <i class="fas" :class="getSortIcon('category_id')"></i>
                                          </span>
                                      </div>
                                  </th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nama Pelapor
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
                              <tr v-for="(laporan, index) in paginatedLaporan" :key="laporan.laporan_id" class="hover:bg-gray-50">
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ startIndex + index + 1 }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.nomor_laporan }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.judul }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getCategoryName(laporan.category_id) }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.nama_pelapor }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap">
                                      <span :class="getStatusClass(formatStatus(laporan.status))">{{ formatStatus(laporan.status) }}</span>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                                      <button class="text-blue-600 hover:text-blue-800 mr-2" @click="lihatDetail(laporan.laporan_id)">
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
                          Menampilkan {{ filteredLaporan.length ? startIndex + 1 : 0 }}-{{ endIndex }} dari {{ filteredLaporan.length }} laporan
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

              <!-- Modal untuk tambah laporan (hidden by default) -->
              <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
                  <div class="flex items-center justify-center min-h-screen px-4">
                      <div class="fixed inset-0 bg-black opacity-30"></div>
                      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                          <div class="flex justify-between items-center mb-4">
                              <h3 class="text-lg font-medium text-gray-900">Tambah Laporan Kejadian</h3>
                              <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
                                  <span class="text-2xl">&times;</span>
                              </button>
                          </div>
                          <!-- Form will go here -->
                          <div class="mt-4">
                              <!-- Form fields would go here -->
                              <button 
                                  class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                  @click="showModal = false"
                              >
                                  Simpan
                              </button>
                          </div>
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
  name: 'DashboardPKDosen',
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
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // Search and filters
      searchQuery: '',
      filters: {
        status: '',
        jenisKejadian: '',
        period: ''
      },
      
      // Sorting
      sortField: 'id',
      sortDirection: 'desc',
      
      // Modal state
      showModal: false,
      
      // For API data
      loading: true,
      error: null,
      
      // Jenis kejadian list for filtering
      jenisKejadianList: [],
      
      // Add this to your data() section
      userData: null,
    };
  },
  
  computed: {
    // Calculate filtered data based on search query and filters
    filteredLaporan() {
      if (!this.laporan || !this.laporan.length) return [];
      
      let result = [...this.laporan];
      
      // Filter by current user if userData is available
      if (this.userData) {
        result = result.filter(item => 
          (item.nama_pelapor && item.nama_pelapor === this.userData.name) || 
          (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || item.ni_pelapor === this.userData.nik))
        );
      }
      
      // Apply search filter (keep your existing code)
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          (item.judul && item.judul.toLowerCase().includes(query)) || 
          (item.nomor_laporan && item.nomor_laporan.toLowerCase().includes(query)) ||
          (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter (keep your existing code)
      if (this.filters.status) {
        const statusValue = this.filters.status === 'Selesai' ? 'verified' : 
                          this.filters.status === 'Dalam Proses' ? 'unverified' : null;
        
        if (statusValue) {
          result = result.filter(item => item.status === statusValue);
        }
      }
      
      // Apply jenis kejadian filter (keep your existing code)
      if (this.filters.jenisKejadian) {
        result = result.filter(item =>
          this.getCategoryName(item.category_id) === this.filters.jenisKejadian
        );
      }
      
      // Apply period filter
      if (this.filters.period) {
        const now = new Date();
        let startDate;
        
        switch(this.filters.period) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'quarter':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (startDate) {
          result = result.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= startDate;
          });
        }
      }
      
      // Apply sorting
      result.sort((a, b) => {
        let fieldA, fieldB;
        
        // Handle special fields
        if (this.sortField === 'id') {
          fieldA = a.laporan_id;
          fieldB = b.laporan_id;
        } else if (this.sortField === 'tanggal') {
          fieldA = new Date(a.created_at);
          fieldB = new Date(b.created_at);
        } else if (this.sortField === 'jenisKejadian') {
          fieldA = this.getCategoryName(a.category_id);
          fieldB = this.getCategoryName(b.category_id);
        } else if (this.sortField === 'status') {
          fieldA = a.status;
          fieldB = b.status;
        } else {
          fieldA = a[this.sortField];
          fieldB = b[this.sortField];
        }
        
        let comparison = 0;
        if (fieldA > fieldB) {
          comparison = 1;
        } else if (fieldA < fieldB) {
          comparison = -1;
        }
        
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
      
      return result;
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
    
    endIndex() {
      const end = this.startIndex + this.itemsPerPage;
      return Math.min(end, this.filteredLaporan.length);
    }
  },
  
  methods: {
    // Fetch data from API
    async fetchData() {
      this.loading = true;
      try {
        // Fetch categories first
        const categoriesResponse = await axios.get('http://localhost:8000/api/category');
        
        // Transform categories array to an object with id as key for easy lookup
        this.categories = categoriesResponse.data.reduce((acc, category) => {
          acc[category.category_id] = category.nama;
          return acc;
        }, {});
        
        // Extract category names for filter dropdown
        this.jenisKejadianList = categoriesResponse.data.map(category => category.nama);
        
        // Get user data from cookie
        const encryptedUserData = VueCookies.get("user_session");
        let userData = null;
        if (encryptedUserData) {
          userData = decryptData(encryptedUserData);
        }
        
        // Then fetch all laporan data
        const laporanResponse = await axios.get('http://localhost:8000/api/laporan');
        
        // Filter laporan for the current user only
        if (userData && userData.name) {
          this.laporan = laporanResponse.data.filter(item => 
            (item.nama_pelapor && item.nama_pelapor.trim() === userData.name.trim()) || 
            (item.ni_pelapor && (item.ni_pelapor === userData.nim || item.ni_pelapor === userData.nik))
          );
          console.log(`Filtered to ${this.laporan.length} reports for user: ${userData.name}`);
        } else {
          this.laporan = laporanResponse.data;
          console.warn('User data not available for filtering, showing all reports');
        }
        
        // Initialize filteredLaporan with all data
        this.filteredLaporan = [...this.laporan];
        
        // Calculate summary statistics
        this.totalLaporan = this.laporan.length;
        this.dalamProses = this.laporan.filter(item => item.status === 'unverified').length;
        this.selesai = this.laporan.filter(item => item.status === 'verified').length;
        
        console.log('Data loaded successfully:', this.laporan);
      } catch (error) {
        console.error('Error fetching data:', error);
        this.error = 'Gagal memuat data. Silakan coba lagi nanti.';
      } finally {
        this.loading = false;
      }
    },
    
    // Helper to get category name by ID
    getCategoryName(categoryId) {
      return this.categories[categoryId] || 'Tidak ada kategori';
    },
    
    // Format date for display
    formatDate(dateString) {
      if (!dateString) return '';
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    
    // Format status for display
    formatStatus(status) {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Diverifikasi',
        'rejected': 'Ditolak'
      };
      
      return statusMap[status] || status;
    },
    
    // Handle search input with debounce
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
      }, 300);
    },
    
    // Sort table by field
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },
    
    // Get sort icon class based on current sort
    getSortIcon(field) {
      if (this.sortField !== field) return 'fa-sort';
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },
    
    // Get status badge class
    getStatusClass(status) {
      const classMap = {
        'Selesai': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
        'Dalam Proses': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
        'Ditolak': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
      };
      
      return classMap[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800';
    },
    
    // Pagination methods
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
    
    // Reset all filters
    resetFilters() {
      this.filters = {
        status: '',
        jenisKejadian: '',
        period: ''
      };
      this.searchQuery = '';
      this.currentPage = 1;
    },
    
    // Event handlers
    addNewReport() {
      this.showModal = true;
      // Alternatively, use router to navigate to form page
      // this.$router.push('/dosen/addpelaporankejadian');
    },
    
    lihatDetail(id) {
      this.$router.push({ name: 'DetailPK', params: { id } });
    },
    
    // Add this to your methods
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
  },
  
  mounted() {
    this.fetchData();
    // Add this to your mounted() method
    this.getCurrentUser();
  }
};
</script>