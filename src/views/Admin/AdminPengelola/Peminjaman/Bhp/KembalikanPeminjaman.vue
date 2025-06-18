<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Pengembalian BHP</h2>
      <button
        @click="$router.go(-1)"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
      >
        Kembali
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-60">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"
      ></div>
    </div>

    <div v-else>
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
        <h3 class="text-lg font-semibold mb-4">Informasi Peminjaman</h3>
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
            <p class="text-sm text-gray-600">Tanggal Pinjam</p>
            <p class="font-medium">
              {{ formatDate(peminjamanData.tanggal_pinjam) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Nama BHP</p>
            <p class="font-medium">{{ bhpData.nama_bhp || "-" }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Penggunaan</p>
            <p class="font-medium">{{ peminjamanData.jumlah_penggunaan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status Pengembalian</p>
            <p class="font-medium">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800':
                    peminjamanData.status_pengembalian === 'dipinjam',
                  'bg-blue-100 text-blue-800':
                    peminjamanData.status_pengembalian ===
                    'dikembalikan_sebagian',
                  'bg-green-100 text-green-800':
                    peminjamanData.status_pengembalian === 'selesai',
                }"
                class="px-2 py-1 rounded-md text-xs font-medium"
              >
                {{ statusText }}
              </span>
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Kembali Bagus</p>
            <p class="font-medium">
              {{ peminjamanData.jumlah_kembali_bagus || 0 }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Jumlah Kembali Rusak</p>
            <p class="font-medium">
              {{ peminjamanData.jumlah_kembali_rusak || 0 }}
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Jumlah Kembali Bagus</label>
              <input
                v-model.number="formData.jumlah_kembali_bagus"
                type="number"
                min="0"
                :max="sisaBelumKembali"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                @input="validateQuantities"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Jumlah Kembali Rusak</label>
              <input
                v-model.number="formData.jumlah_kembali_rusak"
                type="number"
                min="0"
                :max="sisaBelumKembali"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                @input="validateQuantities"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Keterangan Pengembalian</label>
            <textarea
              v-model="formData.keterangan_pengembalian"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Keterangan pengembalian (opsional)"
            ></textarea>
          </div>

          <div class="text-sm text-blue-600 bg-blue-50 p-3 rounded">
            <p>Total jumlah yang dikembalikan: {{ totalReturned }}</p>
            <p>Sisa belum dikembalikan : {{ sisaBelumKembali }}</p>
            <p>
              Jumlah penggunaan total:
              {{ peminjamanData.jumlah_penggunaan || 0 }}
            </p>
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
              :disabled="isSubmitting || !isFormValid"
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
              Proses Pengembalian
            </button>
          </div>
        </div>
      </form>
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
  jumlah_penggunaan: 0,
  jumlah_kembali_bagus: 0,
  jumlah_kembali_rusak: 0,
  status_pengembalian: null,
  nama_peminjam: "",
  tipe_peminjam: "",
  tanggal_pinjam: null,
});
const bhpData = ref({});
const loading = ref(true);
const isSubmitting = ref(false);
const validationError = ref("");

const formData = ref({
  tanggal_kembali: new Date().toISOString().split("T")[0],
  jumlah_kembali_bagus: 0,
  jumlah_kembali_rusak: 0,
  keterangan_pengembalian: "",
});

const totalReturned = computed(() => {
  return (
    (formData.value.jumlah_kembali_bagus || 0) +
    (formData.value.jumlah_kembali_rusak || 0)
  );
});

const sisaBelumKembali = computed(() => {
  if (!peminjamanData.value || !peminjamanData.value.jumlah_penggunaan) {
    return 0;
  }

  return (
    peminjamanData.value.jumlah_penggunaan -
    (peminjamanData.value.jumlah_kembali_bagus || 0) -
    (peminjamanData.value.jumlah_kembali_rusak || 0)
  );
});

const isFormValid = computed(() => {
  if (!peminjamanData.value || !peminjamanData.value.jumlah_penggunaan) {
    return false;
  }

  return (
    totalReturned.value > 0 &&
    totalReturned.value <= sisaBelumKembali.value &&
    formData.value.tanggal_kembali
  );
});

const statusText = computed(() => {
  switch (peminjamanData.value.status_pengembalian) {
    case "dipinjam":
      return "Dipinjam";
    case "dikembalikan_sebagian":
      return "Dikembalikan Sebagian";
    case "selesai":
      return "Selesai";
    default:
      return peminjamanData.value.status_pengembalian || "Tidak diketahui";
  }
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

const validateQuantities = () => {
  validationError.value = "";

  if (!peminjamanData.value || !peminjamanData.value.jumlah_penggunaan) {
    return;
  }

  formData.value.jumlah_kembali_bagus =
    Number(formData.value.jumlah_kembali_bagus) || 0;
  formData.value.jumlah_kembali_rusak =
    Number(formData.value.jumlah_kembali_rusak) || 0;

  const sisaBelumKembaliValue = sisaBelumKembali.value;

  if (formData.value.jumlah_kembali_bagus > sisaBelumKembaliValue) {
    formData.value.jumlah_kembali_bagus = sisaBelumKembaliValue;
  }

  if (formData.value.jumlah_kembali_rusak > sisaBelumKembaliValue) {
    formData.value.jumlah_kembali_rusak = sisaBelumKembaliValue;
  }

  if (totalReturned.value > sisaBelumKembaliValue) {
    validationError.value =
      "Total jumlah yang dikembalikan melebihi jumlah yang belum dikembalikan";
  }
};

const fetchPeminjamanDetail = async () => {
  setupAxios();
  loading.value = true;
  try {
    const response = await axios.get(
      `/api/admin_pengelola/peminjaman_bhp/${id.value}`
    );

    peminjamanData.value = response.data;

    if (peminjamanData.value.status_pengembalian === "selesai") {
      toast.info("BHP ini sudah dikembalikan sepenuhnya");
      router.push(`/admin-pengelola/peminjaman-bhp/detail/${id.value}`);
      return;
    }

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

const handleSubmit = async () => {
  if (!isFormValid.value) {
    validationError.value =
      "Pastikan jumlah yang dikembalikan sesuai dengan jumlah penggunaan";
    return;
  }

  isSubmitting.value = true;
  try {
    setupAxios();

    const submission = {
      jumlah_kembali_bagus: formData.value.jumlah_kembali_bagus,
      jumlah_kembali_rusak: formData.value.jumlah_kembali_rusak,
      tanggal_kembali: formData.value.tanggal_kembali,
      keterangan_pengembalian: formData.value.keterangan_pengembalian,
    };

    const response = await axios.put(
      `/api/admin_pengelola/peminjaman_bhp/return/${id.value}`,
      submission
    );

    toast.success("Pengembalian BHP berhasil diproses");
    router.push(`/admin-pengelola/peminjaman-bhp/detail/${id.value}`);
  } catch (error) {
    console.error("Error processing return:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (
      error.response?.status === 400 ||
      error.response?.status === 422
    ) {
      const errorMsg = error.response.data.message || "Validasi gagal";
      toast.error(errorMsg);
      validationError.value = errorMsg;
    } else {
      toast.error("Gagal memproses pengembalian BHP");
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchPeminjamanDetail();
});
</script>
