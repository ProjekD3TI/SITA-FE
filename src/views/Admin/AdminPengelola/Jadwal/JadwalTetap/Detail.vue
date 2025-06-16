<template>
    <div class="p-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Detail Jadwal Tetap</h2>
            <div class="flex space-x-2">
                <button @click="goToEdit(scheduleData.id)"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Edit
                </button>
                <button @click="$router.go(-1)"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                    Kembali
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="text-gray-500">Memuat data...</div>
        </div>

        <div v-else-if="scheduleData" class="space-y-6">
            <!-- Informasi Dasar -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Informasi Dasar</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Pemakaian</label>
                        <p class="mt-1 text-gray-900">{{ scheduleData.pemakaian }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Penanggung Jawab</label>
                        <p class="mt-1 text-gray-900">{{ scheduleData.penanggung_jawab }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Ruang</label>
                        <p class="mt-1 text-gray-900">{{ scheduleData.ruang || 'Tidak tersedia' }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Kelas</label>
                        <p class="mt-1 text-gray-900">{{ scheduleData.kelas || 'Tidak tersedia' }}</p>
                    </div>
                </div>
            </div>

            <!-- Periode -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Periode Jadwal</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Tanggal Mulai</label>
                        <p class="mt-1 text-gray-900">{{ formatDate(scheduleData.start_date) }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Tanggal Selesai</label>
                        <p class="mt-1 text-gray-900">{{ formatDate(scheduleData.end_date) }}</p>
                    </div>
                </div>
            </div>

            <!-- Jadwal Sesi -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Jadwal Sesi</h3>
                <div v-if="scheduleData.sessions && scheduleData.sessions.length > 0" class="space-y-3">
                    <div v-for="(sessionItem, index) in scheduleData.sessions" :key="index"
                        class="border rounded-lg p-4 bg-gray-50">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-600">Hari</label>
                                <p class="mt-1 text-gray-900">{{ getDayName(sessionItem.day_of_week) }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-600">Sesi</label>
                                <p class="mt-1 text-gray-900">
                                    {{ sessionItem.session?.name_session || 'Tidak tersedia' }}
                                </p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-600">Waktu</label>
                                <p class="mt-1 text-gray-900">
                                    {{ formatTime(sessionItem.session?.start_time) }} -
                                    {{ formatTime(sessionItem.session?.end_time) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-gray-500 text-center py-4">
                    Tidak ada sesi yang terdaftar
                </div>
            </div>

            <!-- Informasi Tambahan -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Informasi Tambahan</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Dibuat pada</label>
                        <p class="mt-1 text-gray-900">{{ formatDateTime(scheduleData.created_at) }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Terakhir diupdate</label>
                        <p class="mt-1 text-gray-900">{{ formatDateTime(scheduleData.updated_at) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 mt-8">
            Data jadwal tetap tidak ditemukan
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const loading = ref(false);
const scheduleData = ref(null);

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const fetchScheduleDetail = async () => {
    try {
        loading.value = true;
        setupAxios();

        const response = await axios.get(
            `/api/admin_pengelola/fixed_schedule/${route.params.id}`
        );

        if (response.data && response.data.data) {
            scheduleData.value = response.data.data;
        } else {
            toast.error("Data jadwal tetap tidak ditemukan");
            router.push("/admin-pengelola/fixed-schedule");
        }
    } catch (error) {
        console.error("Error fetching schedule detail:", error);
        if (error.response?.status === 404) {
            toast.error("Jadwal tetap tidak ditemukan");
            router.push("/admin-pengelola/fixed-schedule");
        } else if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else {
            toast.error(error.response?.data?.message || "Gagal memuat detail jadwal tetap");
        }
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    const date = new Date(dateTimeString);
    return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatTime = (time) => {
    if (!time) return "-";
    return time.substring(0, 5);
};

const getDayName = (dayNumber) => {
    const days = {
        1: "Senin",
        2: "Selasa",
        3: "Rabu",
        4: "Kamis",
        5: "Jumat",
        6: "Sabtu",
        7: "Minggu"
    };
    return days[dayNumber] || "Tidak diketahui";
};

const goToEdit = (id) => {
    router.push(`/admin-pengelola/jadwal/edit/${id}`);
};

onMounted(() => {
    fetchScheduleDetail();
});
</script>