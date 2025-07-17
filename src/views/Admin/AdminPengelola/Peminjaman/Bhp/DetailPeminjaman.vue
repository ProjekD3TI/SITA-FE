<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Detail Peminjaman BHP</h2>

        <div class="flex">
          <button
            @click="exportPDF"
            class="rounded-md w-1/4 mt-3 disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
          >
            Print
          </button>
        </div>
      </div>
      <div class="space-x-2">
        <button
          v-if="peminjamanData.status_pengembalian == 'dipinjam'"
          @click="goToEdit()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-green-700 h-10 px-6 py-2"
        >
          Edit
        </button>
        <button
          v-if="peminjamanData.status_pengembalian !== 'selesai'"
          @click="goToReturn()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
        >
          Kembalikan
        </button>
        <button
          @click="goToList()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          Kembali
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-60">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else>
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
        <h3 class="text-lg font-semibold mb-4">Informasi Umum</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nama Peminjam</p>
            <p class="font-medium">{{ peminjamanData.nama_peminjam }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tipe Peminjam</p>
            <p class="font-medium capitalize">
              {{ peminjamanData.tipe_peminjam }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">No. Identitas</p>
            <p class="font-medium">{{ peminjamanData.ni_peminjam || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">No. Telepon</p>
            <p class="font-medium">{{ peminjamanData.no_telp || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Pinjam</p>
            <p class="font-medium">
              {{ formatDate(peminjamanData.tanggal_pinjam) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Kembali (Perkiraan)</p>
            <p class="font-medium">
              {{ formatDate(peminjamanData.tanggal_pengembalian) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Kembali</p>
            <p class="font-medium">
              {{ formatDate(peminjamanData.tanggal_kembali) }}
            </p>
          </div>
          <div class="text-sm text-gray-600">
            <p class="text-sm text-gray-600">Kegunaan</p>
            <p class="font-medium">{{ peminjamanData.kegunaan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <p class="font-medium">
              <span
                v-if="peminjamanData.status_pengembalian !== null"
                :class="{
                  'bg-blue-100 text-blue-800':
                    peminjamanData.status_pengembalian === 'dipinjam',
                  'bg-yellow-100 text-yellow-800':
                    peminjamanData.status_pengembalian ===
                    'dikembalikan_sebagian',
                  'bg-green-100 text-green-800':
                    peminjamanData.status_pengembalian === 'selesai',
                }"
              >
                {{ statusText }}
              </span>
              <span v-else>-</span>
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
        <h3 class="text-lg font-semibold mb-4">Informasi Barang Habis Pakai</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nama BHP</p>
            <p class="font-medium">{{ bhpData.nama_bhp || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Penggunaan</p>
            <p class="font-medium">{{ peminjamanData.jumlah_penggunaan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Kembali Bagus</p>
            <p class="font-medium">{{ peminjamanData.jumlah_kembali_bagus }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Kembali Rusak</p>
            <p class="font-medium">{{ peminjamanData.jumlah_kembali_rusak }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-600">Keterangan Pengembalian</p>
            <p class="font-medium">
              {{ peminjamanData.keterangan_pengembalian || "-" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const id = ref(route.params.id);
const peminjamanData = ref({
  status_pengembalian: null,
});
const bhpData = ref({});
const loading = ref(true);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID");
};

const statusText = computed(() => {
  switch (peminjamanData.value.status_pengembalian) {
    case "dipinjam":
      return "Dipinjam";
    case "dikembalikan_sebagian":
      return "Dikembalikan Sebagian";
    case "selesai":
      return "Selesai";
    default:
      return peminjamanData.value.status_pengembalian || "Unknown";
  }
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchPeminjamanDetail = async () => {
  loading.value = true;
  try {
    setupAxios();
    const response = await axios.get(
      `/api/admin_pengelola/peminjaman_bhp/${id.value}`
    );

    peminjamanData.value = response.data.data;

    if (peminjamanData.value.id_bhp) {
      try {
        const bhpResponse = await axios.get(
          `/api/admin_pengelola/bhp/${peminjamanData.value.id_bhp}`
        );
        bhpData.value = bhpResponse.data.data || bhpResponse.data;
      } catch (error) {
        console.error("Error fetching BHP details:", error);
        bhpData.value = { nama_bhp: "Unknown" };
      }
    }
  } catch (error) {
    console.error("Error fetching peminjaman BHP detail:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Data peminjaman BHP tidak ditemukan");
      router.push("/admin-pengelola/peminjaman-bhp");
    } else {
      toast.error("Gagal memuat detail peminjaman BHP");
    }
  } finally {
    loading.value = false;
  }
};

const exportPDF = () => {
  axios
    .get(`/api/admin_pengelola/peminjaman_bhp/${id.value}?export=pdf`, {
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `peminjaman_${peminjamanData.value.id_peminjaman_bhp}.pdf`
      );
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor PDF");
    });
};

const goToReturn = () => {
  router.push(`/admin-pengelola/peminjaman-bhp/kembalikan/${id.value}`);
};
const goToEdit = () => {
  router.push(`/admin-pengelola/peminjaman-bhp/edit/${id.value}`);
};

const goToList = () => {
  router.push(`/admin-pengelola/peminjaman-bhp/`);
};

onMounted(() => {
  if (id.value) {
    fetchPeminjamanDetail();
  } else {
    toast.error("ID peminjaman tidak valid");
    router.push("/admin-pengelola/peminjaman-bhp");
  }
});
</script>
