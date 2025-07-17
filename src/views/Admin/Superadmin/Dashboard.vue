<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Superadmin</h1>
      <p class="text-gray-600 mt-2">
        Selamat datang di dashboard superadmin. Kelola seluruh sistem dari sini.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      <button
        @click="router.push('/superadmin/admin/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-user-plus text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah Admin</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>

      <button
        @click="router.push('/superadmin/dosen/create')"
        class="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center mb-3">
          <i class="fas fa-chalkboard-teacher text-2xl"></i>
        </div>
        <h3 class="font-semibold text-center">Tambah Dosen</h3>
        <div
          class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        ></div>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <span class="ml-3 text-gray-600">Memuat data dashboard...</span>
    </div>

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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                Overview data keseluruhan sistem
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
                <i class="fas fa-user-shield text-blue-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Admin</span>
              </div>
              <span class="text-2xl font-bold text-blue-600">{{
                dashboardData.total_admin || 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-chalkboard-teacher text-emerald-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Dosen</span>
              </div>
              <span class="text-2xl font-bold text-emerald-600">{{
                dashboardData.total_dosen || 0
              }}</span>
            </div>
            <div
              class="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
            >
              <div class="flex items-center">
                <i class="fas fa-user-graduate text-purple-600 mr-3"></i>
                <span class="font-medium text-gray-700">Total Mahasiswa</span>
              </div>
              <span class="text-2xl font-bold text-purple-600">{{
                dashboardData.total_mahasiswa || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100"
        >
          <div class="flex items-center">
            <i class="fas fa-bolt text-emerald-600 mr-3 text-xl"></i>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Quick Access</h2>
              <p class="text-gray-600 text-sm mt-1">Navigasi ke fitur utama</p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-3">
            <button
              @click="router.push('/superadmin/admin')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-users-cog text-blue-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Kelola Admin</div>
                <div class="text-sm text-gray-600">Manajemen akun admin</div>
              </div>
            </button>
            <button
              @click="router.push('/superadmin/dosen')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-chalkboard-teacher text-emerald-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Kelola Dosen</div>
                <div class="text-sm text-gray-600">Manajemen akun dosen</div>
              </div>
            </button>
            <button
              @click="router.push('/superadmin/mahasiswa')"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
            >
              <i class="fas fa-user-graduate text-purple-600 mr-3"></i>
              <div>
                <div class="font-medium text-gray-900">Kelola Mahasiswa</div>
                <div class="text-sm text-gray-600">
                  Manajemen akun mahasiswa
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <i class="fas fa-shopping-cart text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total BHP</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.total_bhp || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-cyan-100 text-cyan-600">
            <i class="fas fa-warehouse text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Inventaris</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.total_inventaris || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-rose-100 text-rose-600">
            <i class="fas fa-door-open text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Ruang</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.total_ruang || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-cyan-100 text-cyan-600">
            <i class="fas fa-building text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Gedung</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ dashboardData.total_gedung || 0 }}
            </p>
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
  total_admin: 0,
  total_dosen: 0,
  total_mahasiswa: 0,
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
    const response = await axios.get("/api/superadmin/dashboard");

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
