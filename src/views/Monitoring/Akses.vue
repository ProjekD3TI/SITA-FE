<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
        <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6">
            <h1 class="text-4xl font-bold text-center text-indigo-700 mb-8">Log Akses Ruang</h1>

            <!-- Filter Section -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <select v-model="selectedRuangId"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">— Pilih Ruang —</option>
                    <option v-for="ruang in ruangs" :key="ruang.id_ruang" :value="ruang.id_ruang">
                        {{ ruang.display_name || `${ruang.nama_ruang} -- ${ruang.gedung?.nama_gedung || 'N/A'} --
                            ${ruang.gedung?.lantai?.nama_lantai || 'N/A'}` }}
                    </option>
                </select>

                <input v-model="filters.nama" placeholder="Cari berdasarkan Nama..." :disabled="!selectedRuangId"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                <select v-model="filters.status" :disabled="!selectedRuangId"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Semua Status</option>
                    <option value="allowed">Diizinkan</option>
                    <option value="denied">Ditolak</option>
                </select>

                <select v-model="perPage" :disabled="!selectedRuangId"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option :value="5">5 / halaman</option>
                    <option :value="10">10 / halaman</option>
                    <option :value="20">20 / halaman</option>
                </select>
            </div>

            <!-- Loading & Error -->
            <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
            <div v-if="loading" class="text-center mb-4">Memuat data...</div>

            <!-- Pesan pilih ruang -->
            <div v-if="!selectedRuangId && !loading" class="text-center text-gray-500 mt-12 text-lg font-semibold">
                Silakan pilih ruang terlebih dahulu untuk melihat log akses.
            </div>

            <!-- Table -->
            <div v-if="selectedRuangId && filteredLogs.length > 0 && !loading" class="overflow-x-auto">
                <h2 class="text-2xl font-semibold text-indigo-600 mb-4">
                    Log Akses – {{ ruangNamaById(selectedRuangId) }}
                </h2>

                <table class="w-full table-auto border-collapse">
                    <thead>
                        <tr class="bg-indigo-100 text-indigo-700">
                            <th class="px-4 py-2 text-left">Np</th>
                            <th class="px-4 py-2 text-left">Nama</th>
                            <th class="px-4 py-2 text-left">Waktu Akses</th>
                            <th class="px-4 py-2 text-left">Status</th>
                            <th class="px-4 py-2 text-left">Alasan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, index) in pageData" :key="index" class="hover:bg-indigo-50 border-b">
                            <td class="px-4 py-2">{{ startIndex + index + 1 }}</td>
                            <td class="px-4 py-2">{{ log.nama || 'Tidak dikenal' }}</td>
                            <td class="px-4 py-2">{{ log.access_time }}</td>
                            <td class="px-4 py-2">
                                <span :class="log.status === 'allowed'
                                    ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'
                                    : 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'">
                                    {{ log.status === 'allowed' ? 'Diizinkan' : 'Ditolak' }}
                                </span>
                            </td>
                            <td class="px-4 py-2">{{ log.reason || '-' }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div class="mt-4 flex justify-center space-x-2">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-3 py-1 bg-indigo-200 rounded disabled:opacity-50">Prev</button>

                    <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="page === currentPage
                        ? 'bg-indigo-500 text-white'
                        : 'bg-indigo-100 text-indigo-700'" class="px-3 py-1 rounded">
                        {{ page }}
                    </button>

                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        class="px-3 py-1 bg-indigo-200 rounded disabled:opacity-50">Next</button>
                </div>
            </div>

            <!-- No Data -->
            <div v-else-if="selectedRuangId && filteredLogs.length === 0 && !loading"
                class="text-center text-gray-500 mt-12">
                <p class="text-lg">Tidak ada data log untuk filter yang dipilih.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            selectedRuangId: '',
            filters: {
                nama: '',
                status: ''
            },
            logs: [],
            ruangs: [],
            currentPage: 1,
            perPage: 10,
            loading: false,
            error: ''
        };
    },
    
    computed: {
        filteredLogs() {
            if (!this.selectedRuangId) return [];

            const fk = this.filters.nama.trim().toLowerCase();
            const fs = this.filters.status;

            return this.logs.filter(log => {
                const nama = (log.nama || '').toLowerCase();
                const ruangMatch = Number(log.id_ruang) === Number(this.selectedRuangId);

                return (
                    ruangMatch &&
                    (!fk || nama.includes(fk)) &&
                    (!fs || log.status === fs)
                );
            });
        },
        totalPages() {
            return Math.ceil(this.filteredLogs.length / this.perPage) || 1;
        },
        startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },
        pageData() {
            return this.filteredLogs.slice(this.startIndex, this.startIndex + this.perPage);
        }
    },
    
    methods: {
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        ruangNamaById(id) {
            const ruang = this.ruangs.find(r => Number(r.id_ruang) === Number(id));
            return ruang ? ruang.nama_ruang || 'Tidak dikenal' : '';
            return gedung ? gedung.nama_gedung || 'Tidak dikenal' : '';
            return lantai ? lantai.nama_lantai || 'Tidak dikenal' : '';
        },
        async fetchData() {
            this.loading = true;
            this.error = '';
            try {
                const [logRes, ruangRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/access/log'),
                    axios.get('http://localhost:8000/api/ruang')
                ]);
                this.logs = logRes.data;
                this.ruangs = ruangRes.data.data;
            } catch (err) {
                this.error = 'Gagal ambil data: ' + err.message;
            } finally {
                this.loading = false;
            }
        }
    },
    watch: {
        selectedRuangId() {
            this.currentPage = 1;
        },
        filters: {
            handler() {
                this.currentPage = 1;
            },
            deep: true
        }
    },
    mounted() {
        this.fetchData();
    }
};
</script>

<style scoped>
body {
    font-family: 'Inter', sans-serif;
}
</style>
  
