<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Pengembalian Inventaris</h2>
      <button
        @click="$router.go(-1)"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
      >
        Kembali
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-60">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else>
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
        <h3 class="text-lg font-semibold mb-4">Informasi Peminjaman</h3>
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
            <p class="text-sm text-gray-600">Tanggal Pinjam</p>
            <p class="font-medium">{{ formatDate(infoUmum.tanggal_pinjam) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status Peminjaman</p>
            <p class="font-medium capitalize">
              {{ infoUmum.status_peminjaman }}
            </p>
          </div>
        </div>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white shadow-md rounded-lg overflow-hidden p-6"
      >
        <h3 class="text-lg font-semibold mb-4">Form Pengembalian</h3>

        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">Tanggal Kembali</label>
            <input
              v-model="formData.tanggal_kembali"
              type="date"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Catatan Pengembalian</label>
            <textarea
              v-model="formData.catatan_pengembalian"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Catatan pengembalian (opsional)"
            ></textarea>
          </div>

          <div class="space-y-4">
            <label class="text-sm font-medium">
              Pilih Item yang Akan Dikembalikan
              <span class="text-xs text-blue-600 font-normal"
                >(Pilih inventaris yang ingin dikembalikan saat ini)</span
              >
            </label>

            <div
              v-if="availableItems.length === 0"
              class="text-amber-600 text-sm py-2 px-4 bg-amber-50 rounded"
            >
              Tidak ada item yang tersisa untuk dikembalikan
            </div>

            <div v-else>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">
                  {{ selectedItems.length }} dari
                  {{ availableItems.length }} item dipilih
                </span>
                <button
                  type="button"
                  @click="selectAllItems"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  {{
                    selectedItems.length === availableItems.length
                      ? "Batal Pilih Semua"
                      : "Pilih Semua"
                  }}
                </button>
              </div>

              <div class="border rounded-md overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pilih
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No Inventaris
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nama Inventaris
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kondisi Akhir
                      </th>
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="item in availableItems"
                      :key="item.id_inventaris"
                    >
                      <td class="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          :value="item.id_inventaris"
                          v-model="selectedItems"
                          class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        {{ item.inventaris?.no_inventaris || "-" }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        {{
                          item.inventaris?.jenis_inventaris.nama_inventaris ||
                          "-"
                        }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <select
                          v-model="itemConditions[item.id_inventaris]"
                          class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          :disabled="
                            !selectedItems.includes(item.id_inventaris)
                          "
                        >
                          <option value="baik">Baik</option>
                          <option value="rusak">Rusak</option>
                          <option value="hilang">Hilang</option>
                        </select>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          Dipinjam
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            v-if="validationError"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span class="block sm:inline">{{ validationError }}</span>
          </div>

          <div class="flex space-x-2">
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              :disabled="isSubmitting || selectedItems.length === 0"
            >
              <span v-if="isSubmitting" class="mr-2">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ isSubmitting ? "Memproses..." : "Proses Pengembalian" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
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
const isSubmitting = ref(false);
const validationError = ref("");
const selectedItems = ref([]);
const itemConditions = ref({});

const formData = ref({
  tanggal_kembali: new Date().toISOString().split("T")[0],
  catatan_pengembalian: "",
});

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

const availableItems = computed(() => {
  return inventoryItems.value.filter((item) => item.status === 0);
});

const selectAllItems = () => {
  if (selectedItems.value.length === availableItems.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = availableItems.value.map(
      (item) => item.id_inventaris
    );
  }
};

watch(
  availableItems,
  (newItems) => {
    newItems.forEach((item) => {
      if (!itemConditions.value[item.id_inventaris]) {
        itemConditions.value[item.id_inventaris] = "baik";
      }
    });
  },
  { immediate: true }
);

watch(
  selectedItems,
  (newSelectedItems) => {
    validationError.value = "";
    if (newSelectedItems.length === 0) {
      validationError.value =
        "Silakan pilih minimal satu item untuk dikembalikan";
    }
  },
  { deep: true }
);

const fetchPeminjamanDetail = async () => {
  loading.value = true;
  try {
    setupAxios();
    const response = await axios.get(
      `/api/admin_pengelola/peminjaman_inventaris/${id.value}`
    );

    if (response.data.status === "success") {
      infoUmum.value = response.data.data.peminjaman || {};
      inventoryItems.value = response.data.data.detail || [];

      const borrowedItems = inventoryItems.value.filter(
        (item) => item.status === 0
      );

      if (borrowedItems.length === 0) {
        toast.info("Semua item dalam peminjaman ini sudah dikembalikan");
        router.push(
          `/admin-pengelola/peminjaman-inventaris/detail/${id.value}`
        );
      }
    } else {
      toast.error(response.data.message || "Gagal memuat detail peminjaman");
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

const handleSubmit = async () => {
  if (selectedItems.value.length === 0) {
    validationError.value =
      "Silakan pilih minimal satu item untuk dikembalikan";
    return;
  }

  isSubmitting.value = true;
  validationError.value = "";

  try {
    setupAxios();

    const conditionGroups = {};
    selectedItems.value.forEach((itemId) => {
      const condition = itemConditions.value[itemId] || "baik";
      if (!conditionGroups[condition]) {
        conditionGroups[condition] = [];
      }
      conditionGroups[condition].push(itemId);
    });

    for (const [condition, itemIds] of Object.entries(conditionGroups)) {
      const payload = {
        id_inventaris: itemIds,
        tanggal_kembali: formData.value.tanggal_kembali,
        catatan_pengembalian: formData.value.catatan_pengembalian,
        kondisi_akhir_pengembalian: condition,
      };

      const response = await axios.put(
        `/api/admin_pengelola/peminjaman_inventaris/pengembalian/${id.value}`,
        payload
      );

      if (response.data.status === "warning") {
        toast.warning(response.data.message);
      } else if (response.data.status !== "success") {
        throw new Error(
          response.data.message || "Gagal memproses pengembalian"
        );
      }
    }

    toast.success("Pengembalian inventaris berhasil diproses");
    router.push(`/admin-pengelola/peminjaman-inventaris/detail/${id.value}`);
  } catch (error) {
    console.error("Error processing return:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data.message || "Validasi gagal";
      if (error.response.data.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        validationError.value = errors.join(", ");
      } else {
        validationError.value = errorMsg;
      }
      toast.error(errorMsg);
    } else if (error.response?.status === 404) {
      toast.error("Data peminjaman tidak ditemukan");
      router.push("/admin-pengelola/peminjaman-inventaris");
    } else {
      toast.error(error.message || "Gagal memproses pengembalian inventaris");
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchPeminjamanDetail();
});
</script>
