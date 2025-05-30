<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Detail Peminjaman Inventaris</h2>
      <div class="space-x-2">
        <button
          v-if="infoUmum.status !== 'Sudah Dikembalikan'"
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
            <p class="text-sm text-gray-600">No Referensi</p>
            <p class="font-medium">{{ infoUmum.referensi }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Nama Peminjam</p>
            <p class="font-medium">{{ infoUmum.nama_peminjam }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tipe Peminjam</p>
            <p class="font-medium capitalize">{{ infoUmum.tipe_peminjam }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">No. Identitas</p>
            <p class="font-medium">{{ infoUmum.ni_peminjam || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">No. Telepon</p>
            <p class="font-medium">{{ infoUmum.no_telp || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Pinjam</p>
            <p class="font-medium">{{ formatDate(infoUmum.tanggal_pinjam) }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-600">Kegunaan</p>
            <p class="font-medium">{{ infoUmum.kegunaan }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <h3 class="text-lg font-semibold p-6 pb-3">
          Daftar Item ({{ inventoryItems.length }})
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Inventaris
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No Inventaris
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kondisi Awal
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal Kembali
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kondisi Akhir
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catatan Pengembalian
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in inventoryItems"
                :key="item.id_peminjaman_inventaris"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  {{
                    item.inventaris?.jenis_inventaris.nama_inventaris ||
                    "Unknown"
                  }}
                </td>
                <td class="px-6 py-4">
                  {{ item.inventaris?.no_inventaris || "-" }}
                </td>
                <td class="px-6 py-4 capitalize">
                  {{ item.inventaris?.kondisi || "-" }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'px-2 py-1 rounded text-xs font-medium': true,
                      'bg-blue-100 text-blue-800': item.status === 0,
                      'bg-green-100 text-green-800': item.status === 1,
                    }"
                  >
                    {{ item.status === 0 ? "Dipinjam" : "Dikembalikan" }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  {{ formatDate(item.tanggal_kembali) }}
                </td>
                <td class="px-6 py-4 capitalize">
                  <span
                    v-if="item.kondisi_akhir_pengembalian"
                    :class="{
                      'px-2 py-1 rounded text-xs font-medium': true,
                      'bg-green-100 text-green-800':
                        item.kondisi_akhir_pengembalian === 'baik',
                      'bg-yellow-100 text-yellow-800':
                        item.kondisi_akhir_pengembalian === 'rusak',
                      'bg-red-100 text-red-800':
                        item.kondisi_akhir_pengembalian === 'hilang',
                    }"
                  >
                    {{ item.kondisi_akhir_pengembalian }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4">
                  {{ item.catatan_pengembalian || "-" }}
                </td>
              </tr>
            </tbody>
          </table>
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
const infoUmum = ref({});
const inventoryItems = ref([]);
const loading = ref(true);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID");
};

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
      `/api/admin_pengelola/peminjaman_inventaris/${id.value}`
    );

    infoUmum.value = response.data.data.peminjaman;
    inventoryItems.value = response.data.data.detail;

    const totalItems = inventoryItems.value.length;
    const returnedItems = inventoryItems.value.filter(
      (item) => item.status === 1
    ).length;

    if (returnedItems === 0) {
      infoUmum.value.status = "Belum Dikembalikan";
    } else if (returnedItems < totalItems) {
      infoUmum.value.status = "Sebagian Dikembalikan";
    } else {
      infoUmum.value.status = "Sudah Dikembalikan";
    }
  } catch (error) {
    console.error("Error fetching peminjaman detail:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Data peminjaman tidak ditemukan");
      router.push("/admin-pengelola/peminjaman-inventaris");
    } else {
      toast.error("Gagal memuat detail peminjaman");
    }
  } finally {
    loading.value = false;
  }
};

const goToReturn = () => {
  router.push(`/admin-pengelola/peminjaman-inventaris/kembalikan/${id.value}`);
};

const goToList = () => {
  router.push(`/admin-pengelola/peminjaman-inventaris/`);
};

onMounted(() => {
  if (id.value) {
    fetchPeminjamanDetail();
  } else {
    toast.error("id peminjaman tidak valid");
    router.push("/admin-pengelola/peminjaman-inventaris");
  }
});
</script>
