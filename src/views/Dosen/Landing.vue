<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header Profil -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h1 class="text-3xl font-semibold text-gray-800 mb-2">Dashboard Dosen</h1>
            <div class="text-gray-600 space-y-1">
                <p class="font-medium">NIM: {{ userData?.nim || "NIM tidak tersedia" }}</p>
                <p class="font-medium">Email: {{ userData?.email || "-" }}</p>
                <p>Selamat datang, <span class="font-semibold">{{ userData?.name || "Mahasiswa" }}</span></p>
                <p>Jurusan: <span class="italic">{{ userData?.jurusan || "Belum terdaftar" }}</span></p>
            </div>
        </div>

        <!-- Statistik Peminjaman -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div
                class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow p-5 flex flex-col justify-center items-center">
                <div class="text-4xl font-bold">{{ stats.totalBookings || 0 }}</div>
                <div class="mt-1 text-lg">Total Peminjaman</div>
            </div>

            <div
                class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow p-5 flex flex-col justify-center items-center">
                <div class="text-4xl font-bold">{{ stats.activeBookings || 0 }}</div>
                <div class="mt-1 text-lg">Peminjaman Aktif</div>
            </div>

            <div
                class="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow p-5 flex flex-col justify-center items-center">
                <div class="text-4xl font-bold">{{ stats.todayBookings || 0 }}</div>
                <div class="mt-1 text-lg">Peminjaman Hari Ini</div>
            </div>
        </div>

        <!-- Daftar Ruang Dipinjam -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Daftar Ruang yang Dipinjam</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li v-if="!bookings.length" class="italic text-gray-400">Belum ada riwayat peminjaman ruang.</li>
                <li v-for="(booking, i) in bookings" :key="booking.id"
                    class="p-3 rounded border border-gray-200 hover:shadow-md transition duration-200">
                    <div class="flex justify-between">
                        <div>
                            <p class="font-semibold text-gray-800">{{ booking.roomName }}</p>
                            <p class="text-sm text-gray-500">Tanggal: {{ booking.date }}</p>
                        </div>
                        <span :class="booking.status === 'aktif' ? 'text-green-600' : 'text-gray-500'">
                            {{ booking.status === 'aktif' ? 'Aktif' : 'Selesai' }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Notifikasi -->
        <div v-if="notifications.length" class="bg-white shadow rounded-lg p-4">
            <h2 class="text-lg font-semibold mb-3 text-gray-700">Notifikasi</h2>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
                <li v-for="(note, i) in notifications" :key="i">{{ note }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { decryptData } from "../../services/encrypt";
import VueCookies from "vue-cookies";

const userData = ref(null);
const stats = ref({
    totalBookings: 0,
    activeBookings: 0,
    todayBookings: 0,
});
const bookings = ref([]);
const notifications = ref([]);

onMounted(() => {
    // Ambil dan dekripsi data user dari cookie
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
        userData.value = decryptData(encryptedUserData);
    }

    // Simulasi fetch statistik dan data booking, ganti dengan API call jika perlu
    stats.value = {
        totalBookings: 15,
        activeBookings: 3,
        todayBookings: 1,
    };

    bookings.value = [
        { id: 1, roomName: "Ruang Seminar 1", date: "2025-06-01", status: "aktif" },
        { id: 2, roomName: "Laboratorium Fisika", date: "2025-05-25", status: "selesai" },
        { id: 3, roomName: "Ruang Diskusi 3", date: "2025-05-20", status: "selesai" },
    ];

});
</script>

<style scoped>
/* Tambahan styling bisa kamu sesuaikan */
</style>
  
