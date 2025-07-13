<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header Profil -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h1 class="text-3xl font-semibold text-gray-800 mb-2">Dashboard Dosen</h1>
            <div class="text-gray-600 space-y-1">
                <!-- <p class="font-medium">NIP: {{ userData?.nip || "NIP tidak tersedia" }}</p>
                <p class="font-medium">Email: {{ userData?.email || "-" }}</p> -->
                <p>Selamat Datang Di Dashboard <span class="font-semibold">{{ userData?.name || "Dosen" }}</span></p>
                <!-- <p>Program Studi: <span class="italic">{{ userData?.prodi || "Belum terdaftar" }}</span></p> -->
            </div>
        </div>

        <!-- Aksi Cepat -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-bolt text-emerald-600 mr-3 text-xl"></i>
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
                            <p class="text-gray-600 text-sm mt-1">Navigasi cepat ke fitur penting</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <section class="flex flex-col gap-4">
                    <router-link to="/dosen/pinjam"
                        class="w-full p-5 bg-blue-50 hover:bg-blue-100 rounded-xl shadow flex flex-col items-start transition-all">
                        <p class="text-blue-700 font-semibold">📅 Ajukan Peminjaman</p>
                        <p class="text-xs text-gray-500">Form peminjaman ruang dosen</p>
                    </router-link>

                    <router-link to="/dosen/booking-dosen"
                        class="w-full p-5 bg-yellow-50 hover:bg-yellow-100 rounded-xl shadow flex flex-col items-start transition-all">
                        <p class="text-yellow-700 font-semibold">📄 Lihat Riwayat</p>
                        <p class="text-xs text-gray-500">Cek riwayat peminjaman ruang</p>
                    </router-link>

                    <router-link to="/dosen/jadwal-dosen"
                        class="w-full p-5 bg-green-50 hover:bg-green-100 rounded-xl shadow flex flex-col items-start transition-all">
                        <p class="text-green-700 font-semibold">📄 Lihat Jadwal</p>
                        <p class="text-xs text-gray-500">Lihat jadwal penggunaan ruang</p>
                    </router-link>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { decryptData } from "../../services/encrypt";
import VueCookies from "vue-cookies";

const userData = ref(null);

onMounted(() => {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
        userData.value = decryptData(encryptedUserData);
    }
});
</script>

<style scoped>
/* Tambahan styling jika diperlukan */
</style>
  
