<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Kepala Lab</h1>
            <p class="text-gray-600 mt-2">
                Selamat datang di dashboard kepala laboratorium.
            </p>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Memuat data dashboard...</span>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                <span class="text-red-700">{{ error }}</span>
                <button class="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    @click="fetchDashboardData">
                    Coba Lagi
                </button>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <InfoCard title="Total Peminjaman" subtitle="Semua pengajuan peminjaman" icon="fas fa-clipboard-list"
                value="dashboardData.jumlah_peminjaman" color="blue" />
            <InfoCard title="Total Pending" subtitle="Semua pengajuan pending" icon="fas fa-pause"
                value="dashboardData.jumlah_peminjaman_pending" color="blue" />
            <InfoCard title="Total Disetujui" subtitle="Peminjaman yang disetujui" icon="fas fa-check-circle"
                value="dashboardData.jumlah_peminjaman_acc" color="green" />
            <InfoCard title="Total Ditolak" subtitle="Peminjaman yang ditolak" icon="fas fa-times-circle"
                value="dashboardData.jumlah_peminjaman_ditolak" color="red" />
        </div>

        <div class="grid lg:grid-cols-1 gap-6">
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-tasks text-indigo-600 mr-3 text-xl"></i>
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
                                <p class="text-gray-600 text-sm mt-1">
                                    Kelola peminjaman dengan mudah
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 space-y-3">
                    <router-link to="/kalab/list-peminjaman">
                        <button class="quick-action group">
                            <div class="flex items-center">
                                <i class="fas fa-clock text-yellow-600 mr-3"></i>
                                <div class="text-left">
                                    <p class="font-semibold text-gray-900 group-hover:text-blue-600">Persetujuan Pending
                                    </p>
                                    <p class="text-sm text-gray-600">{{ dashboardData.jumlah_peminjaman_pending || 0 }}
                                        peminjaman menunggu</p>
                                </div>
                            </div>
                            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500"></i>
                        </button>
                    </router-link>
                    <!-- <button class="quick-action group">
                        <div class="flex items-center">
                            <i class="fas fa-chart-bar text-blue-600 mr-3"></i>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 group-hover:text-blue-600">Laporan</p>
                                <p class="text-sm text-gray-600">Lihat laporan peminjaman</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500"></i>
                    </button>

                    <button class="quick-action group">
                        <div class="flex items-center">
                            <i class="fas fa-cog text-gray-600 mr-3"></i>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 group-hover:text-blue-600">Pengaturan</p>
                                <p class="text-sm text-gray-600">Kelola pengaturan sistem</p>
                            </div>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500"></i>
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();

const dashboardData = ref({
    jumlah_peminjaman: 0,
    jumlah_peminjaman_pending: 0,
    jumlah_peminjaman_acc: 0,
    jumlah_peminjaman_ditolak: 0,
});

const loading = ref(false);
const error = ref(null);

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const handleApiError = (err, msg) => {
    console.error(msg, err);
    if (err.response?.status === 401) {
        toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        router.push("/login");
    } else {
        const errMsg = err.response?.data?.message || msg;
        toast.error(errMsg);
        return errMsg;
    }
};

const fetchDashboardData = async () => {
    setupAxios();
    loading.value = true;
    error.value = null;

    try {
        const res = await axios.get("/api/kalab/dashboard");
        dashboardData.value = res.data;
    } catch (err) {
        error.value = handleApiError(err, "Gagal memuat data dashboard");
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchDashboardData();
});
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.quick-action {
    @apply w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200;
}
</style>
  
