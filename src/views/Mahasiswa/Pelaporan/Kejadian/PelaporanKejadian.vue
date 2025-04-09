<template>
    <div class="flex">
        <Sidebar />
        <div class="flex-1">
            <Header :userData="userData" />
            <div class="p-4">
                <!-- Authentication Error Banner -->
                <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 relative">
                    <p>{{ error }}</p>
                    <button 
                        v-if="error.includes('login')" 
                        @click="goToLogin()" 
                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        Login Kembali
                    </button>
                    <button 
                        v-else 
                        @click="fetchData" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        Coba Lagi
                    </button>
                </div>

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

                <!-- Loading indicator -->
                <div v-if="loading" class="text-center py-6">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p class="mt-2 text-gray-600">Memuat data...</p>
                </div>

                <!-- Laporan Kejadian with Search, Filters and Pagination -->
                <div v-if="!loading" class="bg-white shadow rounded-lg p-6">
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
                                        <div class="flex items-center cursor-pointer" @click="sortBy('jenisKejadian')">
                                            Kategori
                                            <span class="ml-1">
                                                <i class="fas" :class="getSortIcon('jenisKejadian')"></i>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pelapor
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
                    <div v-if="filteredLaporan && filteredLaporan.length > 0" class="flex items-center justify-between mt-4 border-t pt-4">
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
            <Footer />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

export default {
    name: 'PelaporanKejadian',
    components: {
        Sidebar,
        Header,
        Footer
    },
    data() {
        return {
            // User data
            userData: null,
            
            // API data
            laporan: [],
            categories: {},
            loading: true,
            error: null,

            // Authentication state
            isAuthenticated: false,

            // Stats for cards
            totalLaporan: 0,
            dalamProses: 0,
            selesai: 0,

            // Search and filters
            searchQuery: '',
            filters: {
                category_id: '',
                status: '',
                startDate: '',
                endDate: ''
            },

            // Sorting
            sortField: 'laporan_id',
            sortDirection: 'desc',

            // Pagination
            currentPage: 1,
            itemsPerPage: 10,

            // Modal state
            showModal: false,
            
            // Jenis kejadian list
            jenisKejadianList: []
        };
    },
    computed: {
        filteredLaporan() {
            if (!this.laporan || !this.laporan.length) return [];
            
            let result = [...this.laporan];
            
            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(item => 
                    (item.judul && item.judul.toLowerCase().includes(query)) || 
                    (item.nomor_laporan && item.nomor_laporan.toLowerCase().includes(query)) ||
                    (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(query))
                );
            }
            
            // Apply status filter
            if (this.filters.status) {
                const statusValue = this.filters.status === 'Selesai' ? 'verified' : 
                                  this.filters.status === 'Dalam Proses' ? 'unverified' : null;
                
                if (statusValue) {
                    result = result.filter(item => item.status === statusValue);
                }
            }
            
            // Apply category filter
            if (this.filters.category_id) {
                result = result.filter(item => 
                    String(item.category_id) === String(this.filters.category_id)
                );
            }
            
            // Apply date range filter
            if (this.filters.startDate || this.filters.endDate) {
                result = result.filter(item => {
                    const itemDate = new Date(item.created_at);
                    
                    if (this.filters.startDate) {
                        const startDate = new Date(this.filters.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        if (itemDate < startDate) return false;
                    }
                    
                    if (this.filters.endDate) {
                        const endDate = new Date(this.filters.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        if (itemDate > endDate) return false;
                    }
                    
                    return true;
                });
            }
            
            // Apply sorting
            result.sort((a, b) => {
                let fieldA, fieldB;
                
                // Handle special fields
                if (this.sortField === 'laporan_id') {
                    fieldA = a.laporan_id;
                    fieldB = b.laporan_id;
                } else if (this.sortField === 'tanggal') {
                    fieldA = new Date(a.created_at);
                    fieldB = new Date(b.created_at);
                } else if (this.sortField === 'category_id') {
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
        },
        
        filteredCategories() {
            const filtered = {};
            
            // Loop through the categories object and exclude those starting with "Kekerasan"
            for (const [id, name] of Object.entries(this.categories)) {
                if (!name.startsWith('Kekerasan')) {
                    filtered[id] = name;
                }
            }
            
            return filtered;
        },
    },
    methods: {
        // Format status for display
        formatStatus(status) {
            if (!status) return 'Tidak Ada Status';
            
            switch (status.toLowerCase()) {
                case 'verified':
                    return 'Diverifikasi';
                case 'unverified':
                    return 'Belum Diverifikasi';
                case 'rejected':
                    return 'Ditolak';
                default:
                    return status;
            }
        },
        
        // Get current user from cookie - SIMPLIFIED from the working component
        getCurrentUser() {
            try {
                const encryptedUserData = VueCookies.get("user_session");
                if (encryptedUserData) {
                    this.userData = decryptData(encryptedUserData);
                    console.log("Current user loaded:", this.userData.name);
                    
                    // Set auth token for axios directly
                    if (this.userData && this.userData.token) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${this.userData.token}`;
                    }
                    
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error getting user data:", error);
                return false;
            }
        },
        
        // Fetch data from API - SIMPLIFIED to match the working component
        async fetchData() {
            this.loading = true;
            this.error = null;
            
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
                
                // Then fetch all laporan data
                const laporanResponse = await axios.get('http://localhost:8000/api/laporan');
                
                // Store all laporan data first
                this.laporan = laporanResponse.data;
                
                // Filter laporan for the current user only if we have user data
                if (this.userData && (this.userData.name || this.userData.username)) {
                    const userName = this.userData.name || this.userData.username;
                    this.laporan = laporanResponse.data.filter(item => 
                        (item.nama_pelapor && item.nama_pelapor.trim() === userName.trim()) || 
                        (item.ni_pelapor && (item.ni_pelapor === this.userData.nim || 
                                            item.ni_pelapor === this.userData.nik))
                    );
                    console.log(`Filtered to ${this.laporan.length} reports for user: ${userName}`);
                }
                
                // Calculate summary statistics
                this.totalLaporan = this.laporan.length;
                this.dalamProses = this.laporan.filter(item => item.status === 'unverified').length;
                this.selesai = this.laporan.filter(item => item.status === 'verified').length;
                
                this.error = null; // Clear any previous errors
            } catch (error) {
                console.error('Error fetching data:', error);
                
                // Check for specific error types
                if (error.response) {
                    if (error.response.status === 401) {
                        this.error = 'Sesi login Anda mungkin sudah berakhir. Silakan login kembali.';
                    } else {
                        this.error = `Gagal memuat data: ${error.response.status} ${error.response.statusText}`;
                    }
                } else if (error.request) {
                    this.error = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                } else {
                    this.error = 'Gagal memuat data. Silakan coba lagi nanti.';
                }
            } finally {
                this.loading = false;
            }
        },
        
        // Get category name by ID
        getCategoryName(categoryId) {
            return this.categories[categoryId] || 'Tidak ada kategori';
        },
        
        // Format date for display
        formatDate(dateString) {
            if (!dateString) return '';
            
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        },
        
        // Get status class for styling
        getStatusClass(status) {
            const classMap = {
                'Belum Diverifikasi': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
                'Diverifikasi': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
                'Ditolak': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
            };
            
            return classMap[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800';
        },
        
        // Handle search input
        handleSearch() {
            // Reset to first page when searching
            this.currentPage = 1;
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
        
        // Get sort icon based on current sort
        getSortIcon(field) {
            if (this.sortField !== field) return 'fa-sort';
            return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
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
                category_id: '',
                status: '',
                startDate: '',
                endDate: ''
            };
            this.searchQuery = '';
            this.currentPage = 1;
        },
        
        // Add new report
        tambahLaporan() {
            this.$router.push('/tambah-laporan');
        },
        
        // View report details
        lihatDetail(laporanId) {
            this.$router.push({ 
                name: 'DetailLaporan', 
                params: { id: laporanId } 
            });
        },
        
        // Edit report
        editLaporan(laporanId) {
            this.$router.push({ 
                name: 'EditLaporan', 
                params: { id: laporanId } 
            });
        },
        
        // Add new report (same as tambahLaporan, but kept for compatibility)
        addNewReport() {
            this.$router.push('/tambah-laporan');
        },
        
        // Navigate to login page
        goToLogin() {
            this.$router.push('/login');
        }
    },
    mounted() {
        // Simply get user data and then fetch data - same approach as the working component
        this.getCurrentUser();
        
        // Ensure axios has credentials
        axios.defaults.withCredentials = true;
        
        // Fetch data after user data is loaded
        this.fetchData();
    },
    beforeUnmount() {
        // No special cleanup needed
    }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>