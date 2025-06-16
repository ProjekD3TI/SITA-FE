<template>
    <div class="min-h-screen bg-gray-50 text-gray-800">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold">Dashboard Kalab</h1>
                <p class="text-sm text-gray-500">Halo, {{ kalab.name }}</p>
            </div>
            <div class="text-sm text-gray-600 text-right">
                <p>📅 {{ tanggal }}</p>
                <p>⏰ {{ jam }}</p>
            </div>
        </header>

        <main class="p-6 space-y-6">
            <!-- Info Kalab -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">NIP</p>
                    <p class="text-xl font-bold">{{ kalab.nip }}</p>
                </div>
                <div class="bg-white p-5 rounded-2xl shadow border">
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-xl font-bold">{{ kalab.email }}</p>
                </div>
            </section>

            <!-- Pending Approval List -->
            <section class="bg-white p-6 rounded-2xl shadow border">
                <h2 class="text-lg font-semibold mb-4">📥 Permintaan Peminjaman Ruang (Menunggu Persetujuan)</h2>

                <div v-if="pendingRequests.length">
                    <div v-for="(request, index) in pendingRequests" :key="index"
                        class="border-b py-3 flex justify-between items-start">
                        <div>
                            <p class="text-blue-700 font-medium">{{ request.namaRuang }}</p>
                            <p class="text-sm text-gray-600">{{ request.pemohon }} - {{ request.nim }}</p>
                            <p class="text-sm text-gray-500">Tanggal: {{ request.tanggal }}</p>
                            <p class="text-sm text-gray-500">Keperluan: {{ request.keperluan }}</p>
                        </div>
                        <div class="flex flex-col items-end space-y-2">
                            <button
                                class="bg-green-100 hover:bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full">
                                ✔️ Setujui
                            </button>
                            <button class="bg-red-100 hover:bg-red-200 text-red-800 text-sm px-3 py-1 rounded-full">
                                ❌ Tolak
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="text-sm text-gray-500 italic">Tidak ada permintaan baru.</div>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: 'KalabDashboard',
    data() {
        return {
            kalab: {
                name: 'Dosen Kalab',
                nip: '198901012005121001',
                email: 'kalab@uns.ac.id'
            },
            pendingRequests: [
                {
                    namaRuang: 'Lab A101',
                    pemohon: 'Naufal',
                    nim: 'V3422301',
                    tanggal: '2025-06-05',
                    keperluan: 'Presentasi Riset'
                },
                {
                    namaRuang: 'Lab B202',
                    pemohon: 'Aulia',
                    nim: 'V3422310',
                    tanggal: '2025-06-07',
                    keperluan: 'Ujian TA'
                }
            ],
            tanggal: '',
            jam: ''
        };
    },
    mounted() {
        const now = new Date();
        this.tanggal = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        this.jam = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};
</script>
  
