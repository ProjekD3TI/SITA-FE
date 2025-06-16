<template>
    <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
        <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6">
            <h1 class="text-4xl font-bold text-center text-indigo-700 mb-8">Log Akses Ruang</h1>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select v-model="selectedRuang"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option disabled value="">Pilih Ruang</option>
                    <option v-for="(ruang, index) in ruangList" :key="index" :value="ruang">{{ ruang }}</option>
                </select>

                <input v-model="filters.rfid" placeholder="Cari berdasarkan Nama..."
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                <select v-model="filters.status"
                    class="w-full px-4 py-3 rounded-xl border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Semua Status</option>
                    <option value="allowed">Diizinkan</option>
                    <option value="denied">Ditolak</option>
                </select>
            </div>

            <div v-if="filteredLogs.length > 0" class="overflow-x-auto">
                <h2 class="text-2xl font-semibold text-indigo-600 mb-4">Log Akses - {{ selectedRuang }}</h2>
                <table class="w-full table-auto border-collapse">
                    <thead>
                        <tr class="bg-indigo-100 text-indigo-700">
                            <th class="px-4 py-2 text-left">#</th>
                            <th class="px-4 py-2 text-left">Nama</th>
                            <th class="px-4 py-2 text-left">Waktu Akses</th>
                            <th class="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, i) in filteredLogs" :key="i" class="hover:bg-indigo-50 border-b">
                            <td class="px-4 py-2">{{ i + 1 }}</td>
                            <td class="px-4 py-2">{{ log.nama }}</td>
                            <td class="px-4 py-2">{{ log.access_time }}</td>
                            <td class="px-4 py-2">
                                <span :class="log.status === 'allowed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    + ' px-3 py-1 rounded-full text-sm font-semibold'">
                                    {{ log.status === 'allowed' ? 'Diizinkan' : 'Ditolak' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="text-center text-gray-500 mt-12">
                <p class="text-lg">Silakan pilih ruang untuk melihat log akses.</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedRuang: '',
            filters: {
                rfid: '',
                status: ''
            },
            logs: [
                {
                    nama: 'Naufal',
                    nama_ruang: 'Ruang RPL',
                    access_time: '2025-06-01 08:03:00',
                    status: 'allowed'
                },
                {
                    nama: 'Naufal',
                    nama_ruang: 'Ruang RPL',
                    access_time: '2025-06-01 09:00:00',
                    status: 'denied'
                },
                {
                    nama: 'Dosen',
                    nama_ruang: 'MR',
                    access_time: '2025-06-01 12:45:00',
                    status: 'allowed'
                },
                {
                    nama: 'Krishna',
                    nama_ruang: 'MR',
                    access_time: '2025-06-01 13:00:00',
                    status: 'allowed'
                }
            ]
        };
    },
    computed: {
        ruangList() {
            return [...new Set(this.logs.map(log => log.nama_ruang))];
        },
        filteredLogs() {
            return this.logs.filter(log => {
                return (
                    log.nama_ruang === this.selectedRuang &&
                    (!this.filters.rfid || log.nama.toLowerCase().includes(this.filters.rfid.toLowerCase())) &&
                    (!this.filters.status || log.status === this.filters.status)
                );
            });
        }
    }
};
</script>

<style scoped>
body {
    font-family: 'Inter', sans-serif;
}
</style>