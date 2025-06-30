<template>
    <div class="flex">
        <Sidebar />
        <div class="flex-1">
            <Header :userData="userData" />
            <div class="p-4">
                <div class="bg-white shadow rounded-lg p-6 mb-4">
                    <h1 class="text-2xl font-semibold text-gray-800">Pelaporan Kekerasan Seksual</h1>
                    <p class="text-gray-600 mt-2">Sistem pencatatan dan manajemen laporan kekerasan seksual yang terjadi di D3 TI SV UNS. Gunakan halaman ini untuk mengirim, memantau, dan mengelola laporan kekerasan seksual.</p>
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
                        <p class="text-lg font-semibold">{{ totalLaporan || 0 }}</p>
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

                <!-- Laporan Kejadian with Search, Filters and Pagination -->
                <div class="bg-white shadow rounded-lg p-6">
                    <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">Daftar Laporan Kekerasan Seksual</h2>
                        
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
                        
                        <!-- Reset Filters Button -->
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
                                        <div class="flex items-center cursor-pointer" @click="sortBy('created_at')">
                                        Tanggal Laporan Masuk
                                        <span class="ml-1">
                                            <i class="fas" :class="getSortIcon('created_at')"></i>
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
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(laporan, index) in paginatedLaporan" :key="laporan.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ startIndex + index + 1 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ laporan.nomor_laporan_kekerasan }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ formatedDate(laporan.created_at, 'long') }}
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
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <button class="text-blue-600 hover:text-blue-800 mr-2" @click="viewDetail(laporan)">
                                            <i class="fas fa-eye"></i> Detail
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
                            Menampilkan {{ userFilteredLaporan.length ? startIndex + 1 : 0 }}-{{ Math.min(startIndex + itemsPerPage, userFilteredLaporan.length) }} dari {{ userFilteredLaporan.length }} laporan
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
                            
                            <span class="text-sm text-gray-700">
                                Halaman {{ currentPage }} dari {{ totalPages }}
                            </span>
                            
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

<script>
import { ref, computed, watch, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

export default {
    name: 'KekerasanSeksual',
    components: {
        Sidebar,
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        
        // Data for API
        const laporan = ref([]);
        const filteredLaporan = ref([]);
        const categories = ref({});
        const userData = ref(null);
        const authToken = ref('');
        const todaysReportsCount = ref(0);
        
        // Loading state
        const loading = ref(false);
        const error = ref(null);
        
        // UI state
        const searchQuery = ref('');
        const currentPage = ref(1);
        const itemsPerPage = ref(10);
        const sortKey = ref('tanggal_kejadian');
        const sortDirection = ref('desc');
        const dailyReportLimit = 5; // Set maximum daily report limit
        
        const filters = reactive({
            category_id: '',
            status: '',
            startDate: '',
            endDate: ''
        });
        
        // Check if user has reached daily report limit
        const hasReachedDailyLimit = computed(() => {
            return todaysReportsCount.value >= dailyReportLimit;
        });
        
        // Get current user and auth token from cookies
        const getCurrentUser = () => {
            try {
                const encryptedUserData = VueCookies.get("user_session");
                if (encryptedUserData) {
                    userData.value = decryptData(encryptedUserData);
                }
                
                // Get auth token from cookies
                const token = VueCookies.get("auth_token");
                if (token) {
                    authToken.value = token;
                    // Set default Authorization header for all axios requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    console.warn("No auth token found in cookies");
                }
            } catch (error) {
                console.error("Error getting user data:", error);
            }
        };
        
        // Count today's reports by the current user
        const countTodaysReports = () => {
            if (!userData.value || !laporan.value.length) return 0;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to beginning of the day
            
            // Filter reports created today by the current user
            const todaysReports = laporan.value.filter(item => {
                // Check if report is from current user
                const isCurrentUser = (item.nama_pelapor && userData.value.name && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                                     (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik));
                
                if (!isCurrentUser) return false;
                
                // Check if report was created today
                const reportDate = new Date(item.created_at);
                reportDate.setHours(0, 0, 0, 0);
                return reportDate.getTime() === today.getTime();
            });
            
            todaysReportsCount.value = todaysReports.length;
            return todaysReports.length;
        };
        
        // Fetch data from API
        const fetchData = async () => {
            loading.value = true;
            error.value = null;
            
            try {
                // Check if we have an auth token before making API calls
                if (!authToken.value) {
                    error.value = 'Anda tidak memiliki akses. Silakan login kembali.';
                    loading.value = false;
                    return;
                }
                
                // Configure axios with auth header for these specific requests
                const config = {
                    headers: {
                        'Authorization': `Bearer ${authToken.value}`
                    }
                };
                
                const [categoriesResponse, laporanResponse] = await Promise.all([
                    // axios.get('http://pelaporan-d3ti.my.id/api/category', config),
                    axios.get('https://v3422040.mhs.d3tiuns.com/api/category', config),
                    // axios.get('http://pelaporan-d3ti.my.id/api/laporan_kekerasan', config)
                    axios.get('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan', config)
                ]);
                
                categories.value = categoriesResponse.data.reduce((acc, category) => {
                    acc[category.category_id] = category.nama;
                    return acc;
                }, {});
                
                laporan.value = laporanResponse.data;
                
                // Count today's reports after loading data
                countTodaysReports();
                
                // Apply initial filtering based on user
                filterReports();
                
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
                    error.value = 'Sesi anda telah berakhir. Silakan login kembali.';
                } else {
                    error.value = 'Gagal memuat data. Silakan coba lagi nanti.';
                }
            } finally {
                loading.value = false;
            }
        };
        
        // Filter reports based on user and search/filter criteria
        const filterReports = () => {
            // Start with all data
            let filtered = [...laporan.value];
            
            // Always apply user filtering first
            if (userData.value && userData.value.name) {
                filtered = filtered.filter(item => 
                    (item.nama_pelapor && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                    (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik))
                );
            }
            
            // Apply search query if it exists
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(item => 
                    (item.judul && item.judul.toLowerCase().includes(query)) || 
                    (item.nomor_laporan_kekerasan && item.nomor_laporan_kekerasan.toLowerCase().includes(query))
                );
            }
            
            // Apply category filter
            if (filters.category_id) {
                filtered = filtered.filter(item => 
                    String(item.category_id) === String(filters.category_id)
                );
            }
            
            // Apply status filter
            if (filters.status) {
                filtered = filtered.filter(item => item.status === filters.status);
            }
            
            // Apply date range filter
            if (filters.startDate || filters.endDate) {
                filtered = filtered.filter(item => {
                    // Get the date field to filter on (use tanggal_kejadian if available, otherwise created_at)
                    const itemDateStr = item.tanggal_kejadian || item.created_at;
                    if (!itemDateStr) return true; // Skip if no date available
                    
                    // Convert to Date object and set to midnight for accurate date comparison
                    const itemDate = new Date(itemDateStr);
                    itemDate.setHours(0, 0, 0, 0);
                    
                    // Check start date if specified
                    if (filters.startDate) {
                        const startDate = new Date(filters.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        if (itemDate < startDate) return false;
                    }
                    
                    // Check end date if specified
                    if (filters.endDate) {
                        const endDate = new Date(filters.endDate);
                        endDate.setHours(23, 59, 59, 999); // End of the day
                        if (itemDate > endDate) return false;
                    }
                    
                    return true;
                });
            }
            
            // Update the filtered list
            filteredLaporan.value = filtered;
            
            // Reset to first page when filters change
            currentPage.value = 1;
        };
        
        // Format date for display
        const formatedDate = (dateString, format = 'long') => {
            if (!dateString) return '-';
            
            const date = new Date(dateString);
            
            if (format === 'long') {
                // Format to "DD Bulan YYYY" (e.g., "08 April 2025")
                const day = date.getDate().toString().padStart(2, '0');
                
                // Get month name in Indonesian
                const monthNames = [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                const month = monthNames[date.getMonth()];
                
                const year = date.getFullYear();
                return `${day} ${month} ${year}`;
            } else if (format === 'short') {
                // Format to DD-MM-YYYY
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            }
        };
        
        // Get category name by ID
        const getCategoryName = (categoryId) => {
            return categories.value[categoryId] || `Kategori ${categoryId}`;
        };
        
        // Navigate to add new report page if daily limit not reached
        const addNewReport = () => {
            if (hasReachedDailyLimit.value) {
                return; // Don't allow navigation if limit is reached
            }
            router.push('/pelaporan/add-kekerasan-seksual');
        };
        
        // Navigate to view report detail
        const viewDetail = (laporan) => {
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
            
            router.push({
                name: "DetailKekekerasanSeksual",
                params: { id: actualId }
            });
        };
        
        // Apply filters
        const applyFilters = () => {
            filterReports();
        };
        
        // Reset all filters
        const resetFilters = () => {
            searchQuery.value = '';
            filters.category_id = '';
            filters.status = '';
            filters.startDate = '';
            filters.endDate = '';
            
            // Re-apply filtering (which will only filter by user)
            filterReports();
        };
        
        // Handle search input
        const handleSearch = () => {
            filterReports();
        };
        
        // Sort by column
        const sortBy = (key) => {
            if (sortKey.value === key) {
                sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortKey.value = key;
                sortDirection.value = 'asc';
            }
            
            // Re-sort filtered results
            filteredLaporan.value = [...filteredLaporan.value].sort((a, b) => {
                const modifier = sortDirection.value === 'asc' ? 1 : -1;
                
                if (key === 'tanggal_kejadian') {
                    return modifier * (new Date(a[key] || 0) - new Date(b[key] || 0));
                } else {
                    // Handle null or undefined values
                    const valA = a[key] || '';
                    const valB = b[key] || '';
                    
                    // String comparison for other fields
                    if (valA < valB) return -1 * modifier;
                    if (valA > valB) return 1 * modifier;
                    return 0;
                }
            });
        };
        
        // Get sort icon for column header
        const getSortIcon = (key) => {
            if (sortKey.value !== key) return 'fa-sort';
            return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        };
        
        // Pagination controls
        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };
        
        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };
        
        // Computed properties
        const filteredCategories = computed(() => {
            const result = {};
            for (const [id, name] of Object.entries(categories.value)) {
                if (name && typeof name === 'string' && name.startsWith('Kekerasan')) {
                    result[id] = name;
                }
            }
            return result;
        });
        
        const userFilteredLaporan = computed(() => {
            if (!userData.value) return [];
            
            return filteredLaporan.value.filter(item => 
                (item.nama_pelapor && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik))
            );
        });
        
        const startIndex = computed(() => {
            return (currentPage.value - 1) * itemsPerPage.value;
        });
        
        const endIndex = computed(() => {
            return Math.min(startIndex.value + itemsPerPage.value, userFilteredLaporan.value.length);
        });
        
        const totalPages = computed(() => {
            return Math.max(1, Math.ceil(userFilteredLaporan.value.length / itemsPerPage.value));
        });
        
        const paginatedLaporan = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return userFilteredLaporan.value.slice(start, end);
        });
        
        const totalLaporan = computed(() => {
            if (!userData.value) return 0;
            
            return laporan.value.filter(item => 
                (item.nama_pelapor && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik))
            ).length;
        });
        
        const dalamProses = computed(() => {
            if (!userData.value) return 0;
            
            return laporan.value.filter(item => 
                ((item.nama_pelapor && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik))) &&
                item.status === 'unverified'
            ).length;
        });
        
        const selesai = computed(() => {
            if (!userData.value) return 0;
            
            return laporan.value.filter(item => 
                ((item.nama_pelapor && item.nama_pelapor.trim() === userData.value.name.trim()) || 
                (item.ni_pelapor && (item.ni_pelapor === userData.value.nim || item.ni_pelapor === userData.value.nik))) &&
                item.status === 'verified'
            ).length;
        });
        
        // Watch for changes in search query or filters
        watch([searchQuery, () => filters.category_id, () => filters.status, () => filters.startDate, () => filters.endDate], () => {
            filterReports();
        });
        
        // Initialize data on component mount
        onMounted(() => {
            getCurrentUser();
            fetchData();
        });
        
        return {
            // Data
            laporan,
            filteredLaporan,
            categories,
            userData,
            loading,
            error,
            searchQuery,
            filters,
            currentPage,
            itemsPerPage,
            
            // Daily limit
            hasReachedDailyLimit,
            
            // Computed properties
            filteredCategories,
            userFilteredLaporan,
            startIndex,
            endIndex,
            totalPages,
            paginatedLaporan,
            totalLaporan,
            dalamProses,
            selesai,
            
            // Methods
            formatedDate,
            getCategoryName,
            addNewReport,
            viewDetail,
            resetFilters,
            handleSearch,
            sortBy,
            getSortIcon,
            applyFilters,
            prevPage,
            nextPage
        };
    }
};
</script>

<style scoped>
.filter-container {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #edf2f7;
}

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
</style>