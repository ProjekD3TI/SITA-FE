<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
      <p class="text-gray-600 mt-2">Selamat datang di dashboard mahasiswa.</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Memuat data dashboard...</span>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-700">{{ error }}</span>
        <button @click="fetchDashboardData"
          class="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Coba Lagi
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div @click="navigateToInventarisList"
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
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

      <div @click="navigateToBhpList"
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
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

      <div @click="navigateToBhpList"
        class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-shopping-cart text-emerald-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Peminjaman Ruang
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Ruang yang sedang dipinjam
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-emerald-600 mr-2">
                {{ dashboardData.peminjaman_ruang?.length || 0 }}
              </span>
              <i class="fas fa-chevron-right text-emerald-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
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
            <button @click="navigateToInventarisList" class="text-blue-600 hover:text-blue-800 transition-colors">
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="!dashboardData.peminjaman_inventaris?.length" class="text-center py-8">
            <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-500 mb-4">
              Tidak ada peminjaman inventaris aktif
            </p>
            <button @click="navigateToInventarisList"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lihat Riwayat Peminjaman
            </button>
          </div>
          <div v-else class="space-y-4">
            <div v-for="item in dashboardData.peminjaman_inventaris" :key="item.id_peminjaman_inventaris"
              @click="navigateToInventarisDetail(item.id_peminjaman_inventaris)"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 cursor-pointer group">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Peminjaman #{{ item.id_peminjaman_inventaris }}
                    </h3>
                    <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                  </div>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tanggal Pinjam:</strong>
                      {{ formatDate(item.tanggal_pinjam) }}
                    </p>
                    <p><strong>Kegunaan:</strong> {{ item.kegunaan }}</p>
                    <p>
                      <strong>Status:</strong>
                      <span :class="getStatusColor(item.status_peminjaman, 'inventaris')
                        " class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
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

      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
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
            <button @click="navigateToBhpList" class="text-emerald-600 hover:text-emerald-800 transition-colors">
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="!dashboardData.peminjaman_bhp?.length" class="text-center py-8">
            <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-500 mb-4">Tidak ada peminjaman BHP aktif</p>
            <button @click="navigateToBhpList"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Lihat Riwayat Peminjaman
            </button>
          </div>
          <div v-else class="space-y-4">
            <div v-for="item in dashboardData.peminjaman_bhp" :key="item.id_peminjaman_bhp"
              @click="navigateToBhpDetail(item.id_peminjaman_bhp)"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer group">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Peminjaman #{{ item.id_peminjaman_bhp }}
                    </h3>
                    <i class="fas fa-chevron-right text-gray-400 group-hover:text-emerald-500 transition-colors"></i>
                  </div>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tanggal Pinjam:</strong>
                      {{ formatDate(item.tanggal_pinjam) }}
                    </p>
                    <p><strong>Kegunaan:</strong> {{ item.kegunaan }}</p>
                    <p>
                      <strong>Status:</strong>
                      <span :class="getStatusColor(item.status_pengembalian, 'bhp')"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
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
      
      <!-- Aksi Cepat Vertikal -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-bolt text-emerald-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Aksi Cepat
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Navigasi cepat ke fitur penting
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <section class="flex flex-col gap-4">
            <router-link to="/mahasiswa/pinjam"
              class="w-full p-5 bg-blue-50 hover:bg-blue-100 rounded-xl shadow flex flex-col items-start transition-all">
              <p class="text-blue-700 font-semibold">📅 Ajukan Peminjaman</p>
              <p class="text-xs text-gray-500">Form peminjaman ruang</p>
            </router-link>

            <router-link to="/mahasiswa/booking-mahasiswa"
              class="w-full p-5 bg-yellow-50 hover:bg-yellow-100 rounded-xl shadow flex flex-col items-start transition-all">
              <p class="text-yellow-700 font-semibold">📄 Lihat Riwayat</p>
              <p class="text-xs text-gray-500">Cek histori peminjaman</p>
            </router-link>

            <a href="/mahasiswa/jadwal-mahasiswa" target="_blank"
              class="w-full p-5 bg-green-50 hover:bg-green-100 rounded-xl shadow flex flex-col items-start transition-all">
              <p class="text-green-700 font-semibold">📄 Lihat Jadwal</p>
              <p class="text-xs text-gray-500">Cek Jadwal penggunaan</p>
            </a>
          </section>
        </div>
      </div>


      <!-- <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-list text-emerald-600 mr-3 text-xl"></i>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Detail Peminjaman Ruang
                </h2>
                <p class="text-gray-600 text-sm mt-1">
                  Daftar Ruang yang sedang Anda pinjam
                </p>
              </div>
            </div>
            <button @click="navigateToBhpList" class="text-emerald-600 hover:text-emerald-800 transition-colors">
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="!dashboardData.peminjaman_ruang?.length" class="text-center py-8">
            <i class="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <p class="text-gray-500 mb-4">Tidak ada peminjaman ruang aktif</p>
            <button @click="navigateToBhpList"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Lihat Riwayat Peminjaman
            </button>
          </div>
          <div v-else class="space-y-4">
            <div v-for="item in dashboardData.peminjaman_ruang" :key="item.id" @click="navigateToBhpDetail(item.id)"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer group">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Peminjaman #{{ item.id }}
                    </h3>
                    <i class="fas fa-chevron-right text-gray-400 group-hover:text-emerald-500 transition-colors"></i>
                  </div>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tanggal Pinjam:</strong>
                      {{ formatDate(item.date) }}
                    </p>
                    <p>
                      <strong>Ruang:</strong>
                      {{ item.nama_ruang }}
                    </p>
                    <p>
                      <strong>Waktu Pinjam:</strong> {{ item.start_time }} -
                      {{ item.end_time }}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span :class="getStatusColor(item.status, 'inventaris')"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ getStatusText(item.status, "inventaris") }}
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
        </div> -->
      <!-- </div> -->
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
  peminjaman_ruang: [],
});

const loading = ref(false);
const error = ref(null);

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const handleApiError = (err, message) => {
  console.error(`${message}:`, err);
  if (err.response?.status === 401) {
    toast.error("Sesi anda telah berakhir. Silakan login kembali.");
    router.push("/login");
  } else {
    const errorMessage = err.response?.data?.message || message;
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

const getStatusText = (status) => {
  const statusMap = {
    dipinjam: "Dipinjam",
    dikembalikan_sebagian: "Dikembalikan Sebagian",
    selesai: "Selesai",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };
  return statusMap[status] || status || "Tidak Diketahui";
};

const getStatusColor = (status) => {
  const map = {
    Dipinjam: "bg-blue-100 text-blue-800",
    "Dikembalikan Sebagian": "bg-yellow-100 text-yellow-800",
    Selesai: "bg-green-100 text-green-800",
    Pending: "bg-blue-100 text-blue-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return map[getStatusText(status)] || "bg-gray-100 text-gray-800";
};

const fetchDashboardData = async () => {
  setupAxios();
  loading.value = true;
  error.value = null;

  try {
    const res = await axios.get("/api/mahasiswa/dashboard");
    if (res.data && res.data.success) {
      dashboardData.value = res.data.data;
    } else {
      throw new Error("Format response tidak valid");
    }
  } catch (err) {
    error.value = handleApiError(err, "Gagal memuat data dashboard");
  } finally {
    loading.value = false;
  }
};

// ✅ Aktifkan navigasi sesuai kebutuhan
const navigateToInventarisList = () => {
  router.push({ name: "PeminjamanInventarisMahasiswa" });
};

const navigateToBhpList = () => {
  router.push({ name: "PeminjamanBhpMahasiswa" });
};

const navigateToRuangList = () => {
  router.push({ name: "PeminjamanRuangMahasiswa" });
};

const navigateToInventarisDetail = (id) => {
  router.push({ name: "DetailPeminjamanInventarisMahasiswa", params: { id } });
};

const navigateToBhpDetail = (id) => {
  router.push({ name: "DetailPeminjamanBhpMahasiswa", params: { id } });
};

const navigateToRuangDetail = (id) => {
  router.push({ name: "DetailPeminjamanRuangMahasiswa", params: { id } });
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