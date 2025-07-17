<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
      <p class="text-gray-600 mt-2">Selamat datang di dashboard mahasiswa.</p>
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-box text-blue-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">Inventaris Dipinjam</div>
          <div class="text-2xl font-bold text-blue-600">
            {{ dashboardData.peminjaman_inventaris_dipinjam || 0 }}
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-undo text-yellow-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">
            Inventaris Dikembalikan Sebagian
          </div>
          <div class="text-2xl font-bold text-yellow-600">
            {{ dashboardData.peminjaman_inventaris_dikembalikan_sebagian || 0 }}
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">Inventaris Selesai</div>
          <div class="text-2xl font-bold text-green-600">
            {{ dashboardData.peminjaman_inventaris_selesai || 0 }}
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-shopping-cart text-emerald-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">BHP Dipinjam</div>
          <div class="text-2xl font-bold text-emerald-600">
            {{ dashboardData.peminjaman_bhp_dipinjam || 0 }}
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-undo text-yellow-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">BHP Dikembalikan Sebagian</div>
          <div class="text-2xl font-bold text-yellow-600">
            {{ dashboardData.peminjaman_bhp_dikembalikan_sebagian || 0 }}
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow border border-gray-100 p-6 flex items-center"
      >
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500 text-3xl mr-4"></i>
        </div>
        <div>
          <div class="text-gray-500 text-sm">BHP Selesai</div>
          <div class="text-2xl font-bold text-green-600">
            {{ dashboardData.peminjaman_bhp_selesai || 0 }}
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div
        @click="navigateToInventarisList"
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-box text-blue-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Peminjaman Inventaris
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Inventaris yang sedang dipinjam
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-blue-600 mr-2">
                {{ dashboardData.peminjaman_inventaris?.length || 0 }}
              </span>
              <i class="fas fa-chevron-right text-blue-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div
        @click="navigateToBhpList"
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-shopping-cart text-emerald-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Peminjaman BHP
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  BHP yang sedang dipinjam
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-emerald-600 mr-2">
                {{ dashboardData.peminjaman_bhp?.length || 0 }}
              </span>
              <i class="fas fa-chevron-right text-emerald-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-list text-blue-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Detail Peminjaman Inventaris
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Daftar inventaris yang sedang Anda pinjam
                </p>
              </div>
            </div>
            <button
              @click="navigateToInventarisList"
              class="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="!dashboardData.peminjaman_inventaris?.length"
            class="text-center py-8"
          >
            <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-500 mb-4">
              Tidak ada peminjaman inventaris aktif
            </p>
            <button
              @click="navigateToInventarisList"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Riwayat Peminjaman
            </button>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in dashboardData.peminjaman_inventaris"
              :key="item.id_peminjaman_inventaris"
              @click="navigateToInventarisDetail(item.id_peminjaman_inventaris)"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 cursor-pointer group"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3
                      class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                    >
                      Peminjaman #{{ item.id_peminjaman_inventaris }}
                    </h3>
                    <i
                      class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"
                    ></i>
                  </div>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tanggal Pinjam:</strong>
                      {{ formatDate(item.tanggal_pinjam) }}
                    </p>
                    <p><strong>Kegunaan:</strong> {{ item.kegunaan }}</p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        :class="
                          getStatusColor(item.status_peminjaman, 'inventaris')
                        "
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{
                          getStatusText(item.status_peminjaman, "inventaris")
                        }}
                      </span>
                    </p>
                    <p v-if="item.referensi">
                      <strong>Referensi:</strong> {{ item.referensi }}
                    </p>
                  </div>
                </div>
              </div>
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
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-list text-emerald-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Detail Peminjaman BHP
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Daftar BHP yang sedang Anda pinjam
                </p>
              </div>
            </div>
            <button
              @click="navigateToBhpList"
              class="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="!dashboardData.peminjaman_bhp?.length"
            class="text-center py-8"
          >
            <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-500 mb-4">Tidak ada peminjaman BHP aktif</p>
            <button
              @click="navigateToBhpList"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Lihat Riwayat Peminjaman
            </button>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in dashboardData.peminjaman_bhp"
              :key="item.id_peminjaman_bhp"
              @click="navigateToBhpDetail(item.id_peminjaman_bhp)"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer group"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3
                      class="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors"
                    >
                      Peminjaman #{{ item.id_peminjaman_bhp }}
                    </h3>
                    <i
                      class="fas fa-chevron-right text-gray-400 group-hover:text-emerald-500 transition-colors"
                    ></i>
                  </div>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tanggal Pinjam:</strong>
                      {{ formatDate(item.tanggal_pinjam) }}
                    </p>
                    <p><strong>Kegunaan:</strong> {{ item.kegunaan }}</p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        :class="getStatusColor(item.status_pengembalian, 'bhp')"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ getStatusText(item.status_pengembalian, "bhp") }}
                      </span>
                    </p>
                    <p v-if="item.jumlah_penggunaan">
                      <strong>Jumlah:</strong> {{ item.jumlah_penggunaan }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
  peminjaman_bhp: [],
  peminjaman_inventaris: [],
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
    router.push("/login");
  } else {
    const errorMessage = error.response?.data?.message || message;
    toast.error(errorMessage);
    return errorMessage;
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

const getStatusText = (status, type = "inventaris") => {
  switch (status) {
    case "dipinjam":
      return "Dipinjam";
    case "dikembalikan_sebagian":
      return "Dikembalikan Sebagian";
    case "selesai":
      return "Selesai";
    default:
      return status || "Tidak Diketahui";
  }
};

const getStatusColor = (status, type = "inventaris") => {
  const formattedStatus = getStatusText(status, type);

  switch (formattedStatus) {
    case "Dipinjam":
      return "bg-blue-100 text-blue-800";
    case "Dikembalikan Sebagian":
      return "bg-yellow-100 text-yellow-800";
    case "Selesai":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const fetchDashboardData = async () => {
  setupAxios();
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get("/api/mahasiswa/dashboard");

    if (response.data && response.data.success) {
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

const navigateToInventarisList = () => {
  router.push({ name: "PeminjamanInventarisMahasiswa" });
};

const navigateToBhpList = () => {
  router.push({ name: "PeminjamanBhpMahasiswa" });
};

const navigateToInventarisDetail = (id) => {
  router.push({
    name: "DetailPeminjamanInventarisMahasiswa",
    params: { id: id },
  });
};

const navigateToBhpDetail = (id) => {
  router.push({
    name: "DetailPeminjamanBhpMahasiswa",
    params: { id: id },
  });
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

.bg-blue-25 {
  background-color: rgba(59, 130, 246, 0.05);
}

.bg-emerald-25 {
  background-color: rgba(16, 185, 129, 0.05);
}
</style>
