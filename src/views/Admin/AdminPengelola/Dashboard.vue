<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Dashboard Admin Pengelola
      </h1>
      <p class="text-gray-600 mt-2">
        Selamat datang di dashboard Admin Pengelola.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <button
        @click="router.push('/admin-pengelola/peminjaman-inventaris/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-clipboard-list text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah Peminjaman Inventaris</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>

      <button
        @click="router.push('/admin-pengelola/inventaris/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-warehouse text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah Inventaris</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>

      <button
        @click="router.push('/admin-pengelola/peminjaman-bhp/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-clipboard-list text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah Peminjaman BHP</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>

      <button
        @click="router.push('/admin-pengelola/bhp/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-shopping-cart text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah BHP</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <span class="ml-3 text-gray-600">Memuat data dashboard...</span>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-700">{{ error }}</span>
        <button
          @click="fetchDashboardData"
          class="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- Quick Summary Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- System Overview -->
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
        >
          <div class="flex items-center">
            <i class="fas fa-chart-pie text-blue-600 mr-3 text-xl"></i>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                Ringkasan Sistem
              </h2>
              <p class="text-gray-600 text-sm mt-1">
                Overview data inventaris dan BHP
              </p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-box text-blue-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Inventaris</span>
              </div>
              <span class="text-2xl font-bold text-blue-600">{{
                dashboardData.total_inventaris || 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-shopping-cart text-emerald-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total BHP</span>
              </div>
              <span class="text-2xl font-bold text-emerald-600">{{
                dashboardData.total_bhp || 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-door-open text-purple-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Ruang</span>
              </div>
              <span class="text-2xl font-bold text-purple-600">{{
                dashboardData.total_ruang || 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-building text-amber-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Gedung</span>
              </div>
              <span class="text-2xl font-bold text-amber-600">{{
                dashboardData.total_gedung || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Aksi Cepat -->
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100"
        >
          <div class="flex items-center">
            <i class="fas fa-bolt text-emerald-600 mr-3 text-xl"></i>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Quick Action</h2>
              <p class="text-gray-600 text-sm mt-1">Navigasi ke fitur utama</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-3">
            <button
              @click="router.push('/admin-pengelola/inventaris')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-list text-blue-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Inventaris</div>
                <div class="text-sm text-gray-600">Lihat data inventaris</div>
              </div>
            </button>
            <button
              @click="router.push('/admin-pengelola/bhp')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-clipboard-list text-emerald-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">BHP</div>
                <div class="text-sm text-gray-600">
                  Lihat Data Barang Habis Pakai
                </div>
              </div>
            </button>
            <button
              @click="router.push('/admin-pengelola/ruang')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-building text-purple-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Ruang</div>
                <div class="text-sm text-gray-600">Lihat data ruang</div>
              </div>
            </button>
            <button
              @click="router.push('/admin-pengelola/gedung')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-chart-bar text-amber-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Gedung</div>
                <div class="text-sm text-gray-600">Lihat Data Gedung</div>
              </div>
            </button>
          </div>
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
  total_inventaris: 0,
  total_bhp: 0,
  total_ruang: 0,
  total_gedung: 0,
});

const loading = ref(false);
const error = ref(null);

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const handleApiError = (error, message) => {
  console.error(`${message}:`, error);
  if (error.response?.status === 401) {
    toast.error("Sesi anda telah berakhir. Silakan login kembali.");
    router.push("/login-admin");
  } else {
    const errorMessage = error.response?.data?.message || message;
    toast.error(errorMessage);
    return errorMessage;
  }
};

const fetchDashboardData = async () => {
  setupAxios();
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get("/api/admin_pengelola/dashboard");

    if (response.data && response.data.status === "success") {
      dashboardData.value = response.data.data;
    } else {
      throw new Error("Format response tidak valid");
    }
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
