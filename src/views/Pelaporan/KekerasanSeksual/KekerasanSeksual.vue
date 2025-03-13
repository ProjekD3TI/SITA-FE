<template>
    <div class="flex">
        <Sidebar />
        <div class="flex-1">
            <Header />
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
                                        <div class="flex items-center cursor-pointer" @click="sortBy('id')">
                                            ID Laporan
                                            <span class="ml-1">
                                                <i class="fas" :class="getSortIcon('id')"></i>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center cursor-pointer" @click="sortBy('tanggal')">
                                            Tanggal
                                            <span class="ml-1">
                                                <i class="fas" :class="getSortIcon('tanggal')"></i>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div class="flex items-center cursor-pointer" @click="sortBy('jenisKejadian')">
                                            Jenis Kejadian
                                            <span class="ml-1">
                                                <i class="fas" :class="getSortIcon('jenisKejadian')"></i>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lokasi
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
                                <tr v-for="laporan in paginatedLaporan" :key="laporan.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(laporan.tanggal) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.jenisKejadian }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.lokasi }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ laporan.pelapor }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span :class="getStatusClass(laporan.status)">{{ laporan.status }}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <button class="text-blue-600 hover:text-blue-800 mr-2" @click="lihatDetail(laporan.id)">
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
            <Footer />
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';

export default {
    name: 'PelaporanKejadian',
    components: {
        Sidebar,
        Header,
        Footer
    },
    setup() {
        const showModal = ref(false);
        const searchQuery = ref('');
        const currentPage = ref(1);
        const itemsPerPage = ref(5);
        
        // List of all reports
        const daftarLaporan = ref([
            {
                id: 'LP001',
                tanggal: new Date('2023-11-15'),
                jenisKejadian: 'Kebakaran',
                lokasi: 'Jl. Pahlawan No. 10',
                pelapor: 'Ahmad Rizki',
                status: 'Selesai'
            },
            {
                id: 'LP002',
                tanggal: new Date('2023-11-16'),
                jenisKejadian: 'Kecelakaan',
                lokasi: 'Jl. Sudirman No. 45',
                pelapor: 'Budi Santoso',
                status: 'Dalam Proses'
            },
            {
                id: 'LP003',
                tanggal: new Date('2023-11-17'),
                jenisKejadian: 'Banjir',
                lokasi: 'Perumahan Indah Blok C',
                pelapor: 'Citra Dewi',
                status: 'Dalam Proses'
            }
        ]);
        
        // Sorting
        const sortConfig = ref({
            key: 'tanggal',
            direction: 'desc'
        });

        // Filtering
        const filters = ref({
            status: '',
            jenisKejadian: '',
            period: ''
        });

        // List of unique report types for dropdown
        const jenisKejadianList = computed(() => {
            if (!daftarLaporan.value.length) return [];
            return [...new Set(daftarLaporan.value.map(report => report.jenisKejadian))];
        });
        
        // Filter by date helper function
        const isWithinPeriod = (date, period) => {
            if (!period) return true;
            
            const today = new Date();
            const reportDate = new Date(date);
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
        const filteredLaporan = computed(() => {
            let result = daftarLaporan.value;
            
            if (filters.value.status) {
                result = result.filter(laporan => laporan.status === filters.value.status);
            }
            
            if (filters.value.jenisKejadian) {
                result = result.filter(laporan => laporan.jenisKejadian === filters.value.jenisKejadian);
            }
            
            if (filters.value.period) {
                result = result.filter(laporan => isWithinPeriod(laporan.tanggal, filters.value.period));
            }
            
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                result = result.filter(laporan => 
                    laporan.id.toLowerCase().includes(query) ||
                    laporan.jenisKejadian.toLowerCase().includes(query) ||
                    laporan.lokasi.toLowerCase().includes(query) ||
                    laporan.pelapor.toLowerCase().includes(query) ||
                    laporan.status.toLowerCase().includes(query)
                );
            }
            
            result = [...result].sort((a, b) => {
                let modifier = sortConfig.value.direction === 'asc' ? 1 : -1;
                
                if (sortConfig.value.key === 'tanggal') {
                    return modifier * (new Date(a.tanggal) - new Date(b.tanggal));
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
                jenisKejadian: '',
                period: ''
            };
            searchQuery.value = '';
            currentPage.value = 1;
        };
        
        // Pagination
        const totalPages = computed(() => {
            return Math.ceil(filteredLaporan.value.length / itemsPerPage.value);
        });
        
        const startIndex = computed(() => {
            return (currentPage.value - 1) * itemsPerPage.value;
        });
        
        const endIndex = computed(() => {
            const end = startIndex.value + itemsPerPage.value;
            return end > filteredLaporan.value.length ? filteredLaporan.value.length : end;
        });
        
        const paginatedLaporan = computed(() => {
            return filteredLaporan.value.slice(startIndex.value, endIndex.value);
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
            currentPage.value = 1; // Reset to first page on search
        };
        
        const tambahLaporan = () => {
            showModal.value = true;
        };
        
        const lihatDetail = (id) => {
            console.log(`Melihat detail laporan dengan ID: ${id}`);
            router.push({
                name: 'DetailPelaporanKejadian',
                query: { id: id }
            });
        };
        
        const editLaporan = (id) => {
            console.log(`Edit laporan dengan ID: ${id}`);
            // Implement edit functionality
        };
        
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
            });
        };
        
        const getStatusClass = (status) => {
            switch(status) {
                case 'Selesai':
                    return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
                case 'Dalam Proses':
                    return 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800';
                default:
                    return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
            }
        };
        
        // Computed properties for stats
        const totalLaporan = computed(() => daftarLaporan.value.length);
        const dalamProses = computed(() => daftarLaporan.value.filter(laporan => laporan.status === 'Dalam Proses').length);
        const selesai = computed(() => daftarLaporan.value.filter(laporan => laporan.status === 'Selesai').length);
        
        const router = useRouter();
        
        const addNewReport = () => {
            router.push('/pelaporan/add-kekerasan-seksual');
        };
        
        return {
            showModal,
            daftarLaporan,
            searchQuery,
            filters,
            jenisKejadianList,
            filteredLaporan,
            currentPage,
            totalPages,
            startIndex,
            endIndex,
            paginatedLaporan,
            totalLaporan,
            dalamProses,
            selesai,
            sortBy,
            getSortIcon,
            resetFilters,
            handleSearch,
            nextPage,
            prevPage,
            tambahLaporan,
            lihatDetail,
            editLaporan,
            formatDate,
            getStatusClass,
            addNewReport
        };
    }
};
</script>