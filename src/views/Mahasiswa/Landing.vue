<template>
    <div class="min-h-screen bg-gray-50 text-gray-800">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold">Dashboard Mahasiswa</h1>
                <p class="text-sm text-gray-500">Selamat datang, {{ mahasiswa.name }}</p>
            </div>
            <div class="text-sm text-gray-600 text-right">
                <p>📅 {{ tanggal }}</p>
                <p>⏰ {{ jam }}</p>
            </div>
        </header>

        <main class="p-6 space-y-6">
            <!-- Info Mahasiswa -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">NIM</p>
                    <p class="text-xl font-bold">{{ mahasiswa.nim ?? '-' }}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-xl font-bold">{{ mahasiswa.email ?? '-' }}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">Program Studi</p>
                    <p class="text-xl font-bold">{{ mahasiswa.prodi ?? '-' }}</p>
                </div>
            </section>

            <!-- Statistik Peminjaman -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-6 rounded-2xl shadow border text-center">
                    <p class="text-sm text-gray-500 mb-1">Jumlah Peminjaman</p>
                    <p class="text-3xl font-bold text-blue-600">{{ stats.total_peminjaman }}</p>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow border text-center">
                    <p class="text-sm text-gray-500 mb-1">Peminjaman Aktif</p>
                    <p class="text-3xl font-bold text-green-600">{{ stats.aktif }}</p>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow border text-center">
                    <p class="text-sm text-gray-500 mb-1">Total Jadwal</p>
                    <p class="text-3xl font-bold text-purple-600">{{ stats.total_jadwal }}</p>
                </div>
            </section>

            <!-- Aksi Cepat -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <router-link to="/mahasiswa/pinjam"
                    class="p-5 bg-blue-50 hover:bg-blue-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-blue-700 font-semibold">📅 Ajukan Peminjaman</p>
                    <p class="text-xs text-gray-500">Form peminjaman ruang </p>
                </router-link>
                <router-link to="/mahasiswa/booking-mahasiswa"
                    class="p-5 bg-yellow-50 hover:bg-yellow-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-yellow-700 font-semibold">📄 Lihat Riwayat</p>
                    <p class="text-xs text-gray-500">Cek histori peminjaman</p>
                </router-link>
                <a href="/mahasiswa/jadwal-mahasiswa" target="_blank"
                    class="p-5 bg-green-50 hover:bg-green-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-green-700 font-semibold">📄Lihat Jadwal </p>
                    <p class="text-xs text-gray-500">Cek Jadwal penggunaan</p>
                </a>
            </section>
        </main>
    </div>
</template>
  
  <script>
import axios from 'axios';

export default {
    name: 'MahasiswaDashboard',
    data() {
        return {
            mahasiswa: {},
            stats: {
                total_peminjaman: 0,
                aktif: 0,
                total_jadwal: 0
            },
            tanggal: '',
            jam: ''
        };
    },
    mounted() {
        const now = new Date();
        this.tanggal = now.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        this.jam = now.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit'
        });
        this.fetchProfile();
        this.fetchStats();
    },
    methods: {
        async fetchProfile() {
            try {
                const res = await axios.get('/api/mahasiswa/get-profile');
                this.mahasiswa = res.data.data;
            } catch (err) {
                console.error('Gagal mengambil profil mahasiswa', err);
            }
        },
        async fetchStats() {
            try {
                const res = await axios.get('/api/mahasiswa/statistik');
                this.stats = res.data.data;
            } catch (err) {
                console.error('Gagal mengambil statistik', err);
            }
        }
    }
};
</script>
  
  <style scoped>
.container {
    max-width: 900px;
    margin: auto;
}
</style>