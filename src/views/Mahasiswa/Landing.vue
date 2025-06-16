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
                    <p class="text-xl font-bold">{{ mahasiswa.nim }}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-xl font-bold">{{ mahasiswa.email }}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">Program Studi</p>
                    <p class="text-xl font-bold">{{ mahasiswa.prodi }}</p>
                </div>
            </section>

            <!-- Jadwal Tetap -->
            <section class="bg-white p-6 rounded-2xl shadow border">
                <h2 class="text-lg font-semibold mb-4">📅 Jadwal Peminjaman Ruang Tetap</h2>
                <div v-if="jadwalTetap.length">
                    <div v-for="(jadwal, index) in jadwalTetap" :key="index" class="border-b py-3">
                        <div class="flex justify-between">
                            <div>
                                <p class="font-medium text-lg text-blue-700">{{ jadwal.ruang }}</p>
                                <p class="text-sm text-gray-600">{{ jadwal.pemakaian }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm">{{ jadwal.start_date }} s/d {{ jadwal.end_date }}</p>
                                <p class="text-xs text-gray-500">Penanggung Jawab: {{ jadwal.penanggungJawab }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-gray-500 text-sm italic">Tidak ada jadwal terdaftar.</div>
            </section>

            <!-- Aksi Cepat -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button class="p-5 bg-blue-50 hover:bg-blue-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-blue-700 font-semibold">📅 Ajukan Peminjaman</p>
                    <p class="text-xs text-gray-500">Form peminjaman ruang non-tetap</p>
                </button>
                <button class="p-5 bg-yellow-50 hover:bg-yellow-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-yellow-700 font-semibold">📄 Lihat Riwayat</p>
                    <p class="text-xs text-gray-500">Cek histori peminjaman</p>
                </button>
                <button class="p-5 bg-green-50 hover:bg-green-100 rounded-xl shadow flex flex-col items-start">
                    <p class="text-green-700 font-semibold">📤 Unduh Jadwal</p>
                    <p class="text-xs text-gray-500">Download PDF jadwal Anda</p>
                </button>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: 'MahasiswaDashboard',
    data() {
        return {
            mahasiswa: {
                name: 'Naufal',
                nim: 'V3422301',
                email: 'naufal@student.uns.ac.id',
                prodi: 'Teknik Informatika'
            },
            jadwalTetap: [
                {
                    ruang: 'Ruang A101',
                    start_date: '2025-06-03',
                    end_date: '2025-06-07',
                    pemakaian: 'Praktikum Mikrokontroler',
                    penanggungJawab: 'Pak Pung'
                },
                {
                    ruang: 'Ruang B202',
                    start_date: '2025-06-10',
                    end_date: '2025-06-12',
                    pemakaian: 'Presentasi Tugas Akhir',
                    penanggungJawab: 'Bu Sari'
                }
            ],
            tanggal: '',
            jam: ''
        };
    },
    mounted() {
        const now = new Date();
        this.tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        this.jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
};
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: auto;
}
</style>
  
