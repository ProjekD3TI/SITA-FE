<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit Peminjaman BHP</h2>

    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <svg
        class="animate-spin h-8 w-8 text-primary"
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
    </div>

    <div
      v-else-if="statusError"
      class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Tidak dapat mengedit peminjaman
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ statusError }}</p>
          </div>
          <div class="mt-4">
            <button
              @click="$router.go(-1)"
              class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          BHP
        </label>
        <div class="space-y-1">
          <SearchableSelect
            v-model="formData.id_bhp"
            :options="bhpList"
            value-key="id_bhp"
            label-key="nama_bhp"
            placeholder="Pilih BHP"
            @update:model-value="updateSelectedBhp"
            api-endpoint="/api/admin_pengelola/get_bhp"
            :use-server-search="true"
          />
          <div
            v-if="selectedBhp && originalPeminjamanData"
            class="text-sm text-gray-600"
          >
            <p>Stok tersedia saat ini: {{ selectedBhp.kondisi_bagus }}</p>
            <p v-if="formData.id_bhp === originalPeminjamanData.id_bhp">
              Maksimal dapat dipinjam:
              {{
                selectedBhp.kondisi_bagus +
                originalPeminjamanData.jumlah_penggunaan
              }}
              (termasuk yang sedang dipinjam:
              {{ originalPeminjamanData.jumlah_penggunaan }})
            </p>
          </div>
        </div>
        <p v-if="errors.id_bhp" class="text-sm text-red-500">
          {{ errors.id_bhp[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tipe Peminjam
        </label>
        <select
          v-model="formData.tipe_peminjam"
          placeholder="Pilih Tipe Peminjam"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Pilih Tipe Peminjam</option>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
        <p v-if="errors.tipe_peminjam" class="text-sm text-red-500">
          {{ errors.tipe_peminjam[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Peminjam
        </label>
        <SearchableSelect
          v-model="formData.id_peminjam"
          :options="
            formData.tipe_peminjam === 'mahasiswa' ? mahasiswaList : dosenList
          "
          value-key="id"
          label-key="name"
          placeholder="Pilih Peminjam"
          :disabled="!formData.tipe_peminjam"
          :api-endpoint="
            formData.tipe_peminjam === 'mahasiswa'
              ? '/api/admin_pengelola/mahasiswa'
              : '/api/admin_pengelola/dosen'
          "
          :use-server-search="true"
        />
        <p v-if="errors.id_peminjam" class="text-sm text-red-500">
          {{ errors.id_peminjam[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kegunaan
        </label>
        <textarea
          v-model="formData.kegunaan"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan kegunaan peminjaman"
        ></textarea>
        <p v-if="errors.kegunaan" class="text-sm text-red-500">
          {{ errors.kegunaan[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tanggal Pinjam
        </label>
        <input
          v-model="formData.tanggal_pinjam"
          type="date"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p v-if="errors.tanggal_pinjam" class="text-sm text-red-500">
          {{ errors.tanggal_pinjam[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Jumlah Penggunaan
        </label>
        <input
          v-model="formData.jumlah_penggunaan"
          type="number"
          min="1"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan jumlah penggunaan"
        />
        <span v-if="showStockError" class="text-sm text-red-600">
          <span v-if="formData.id_bhp === originalPeminjamanData?.id_bhp">
            Jumlah penggunaan melebihi stok maksimal ({{
              selectedBhp.kondisi_bagus +
              originalPeminjamanData.jumlah_penggunaan
            }})
          </span>
          <span v-else>
            Jumlah penggunaan melebihi stok tersedia ({{
              selectedBhp.kondisi_bagus
            }})
          </span>
        </span>
        <p v-if="errors.jumlah_penggunaan" class="text-sm text-red-500">
          {{ errors.jumlah_penggunaan[0] }}
        </p>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          :disabled="isSubmitting || showStockError"
        >
          <div
            v-if="isSubmitting"
            class="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></div>
          {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
        </button>
        <button
          type="button"
          @click="$router.go(-1)"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const isSubmitting = ref(false);
const isLoading = ref(true);
const statusError = ref("");

const formData = reactive({
  id_bhp: "",
  id_peminjam: "",
  tipe_peminjam: "",
  kegunaan: "",
  tanggal_pinjam: "",
  jumlah_penggunaan: "",
});

const errors = reactive({});
const bhpList = ref([]);
const mahasiswaList = ref([]);
const dosenList = ref([]);
const selectedBhp = ref(null);
const originalPeminjamanData = ref(null);

const showStockError = computed(() => {
  if (
    !selectedBhp.value ||
    !formData.jumlah_penggunaan ||
    !originalPeminjamanData.value
  )
    return false;

  const jumlahBaru = parseInt(formData.jumlah_penggunaan);
  const jumlahLama = originalPeminjamanData.value.jumlah_penggunaan;
  const stokTersediaSaatIni = selectedBhp.value.kondisi_bagus;

  if (formData.id_bhp === originalPeminjamanData.value.id_bhp) {
    const stokSetelahDikembalikan = stokTersediaSaatIni + jumlahLama;
    return jumlahBaru > stokSetelahDikembalikan;
  } else {
    return jumlahBaru > stokTersediaSaatIni;
  }
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const updateSelectedBhp = (bhpId) => {
  selectedBhp.value = bhpList.value.find((bhp) => bhp.id_bhp === bhpId);

  if (!selectedBhp.value && bhpId) {
    fetchSpecificBhp(bhpId);
  }
};

const fetchSpecificBhp = async (bhpId) => {
  try {
    setupAxios();
    const response = await axios.get(`/api/admin_pengelola/bhp/${bhpId}`);
    if (response.data?.data) {
      selectedBhp.value = response.data.data;

      if (!bhpList.value.some((bhp) => bhp.id_bhp === bhpId)) {
        bhpList.value.push(response.data.data);
      }
    }
  } catch (error) {
    console.error("Error fetching specific BHP:", error);
  }
};

const fetchMahasiswaAndDosen = async () => {
  try {
    setupAxios();
    const [mahasiswaResponse, dosenResponse] = await Promise.all([
      axios.get("/api/admin_pengelola/mahasiswa"),
      axios.get("/api/admin_pengelola/dosen"),
    ]);

    mahasiswaList.value = mahasiswaResponse.data.data;
    dosenList.value = dosenResponse.data.data || [];
  } catch (error) {
    console.error("Error fetching mahasiswa and dosen:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    }
  }
};

const fetchPeminjamanBhp = async () => {
  try {
    isLoading.value = true;
    setupAxios();
    const response = await axios.get(
      `/api/admin_pengelola/peminjaman_bhp/${id}`
    );
    const peminjamanBhp = response.data.data;

    if (peminjamanBhp.status_pengembalian !== "dipinjam") {
      statusError.value =
        "Peminjaman BHP yang masih dipinjam yang dapat diedit";
      isLoading.value = false;
      return;
    }

    originalPeminjamanData.value = {
      id_bhp: peminjamanBhp.id_bhp,
      jumlah_penggunaan: peminjamanBhp.jumlah_penggunaan,
    };

    formData.id_bhp = peminjamanBhp.id_bhp || "";
    formData.id_peminjam = peminjamanBhp.id_peminjam || "";
    formData.tipe_peminjam = peminjamanBhp.tipe_peminjam || "";
    formData.kegunaan = peminjamanBhp.kegunaan || "";
    formData.tanggal_pinjam = peminjamanBhp.tanggal_pinjam || "";
    formData.jumlah_penggunaan = peminjamanBhp.jumlah_penggunaan || "";

    if (formData.id_bhp) {
      await fetchSpecificBhp(formData.id_bhp);
    }
  } catch (error) {
    console.error("Error fetching peminjaman BHP:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Peminjaman BHP tidak ditemukan");
      router.push("/admin-pengelola/peminjaman-bhp");
    } else {
      toast.error("Gagal memuat data Peminjaman BHP");
      router.go(-1);
    }
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => formData.tipe_peminjam,
  (newValue, oldValue) => {
    if (oldValue && newValue !== oldValue) {
      formData.id_peminjam = "";
    }
  }
);

const handleSubmit = async () => {
  if (showStockError.value) {
    toast.error("Jumlah penggunaan melebihi stok tersedia");
    return;
  }

  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.put(
      `/api/admin_pengelola/peminjaman_bhp/edit/${id}`,
      formData
    );

    toast.success(
      response.data.message || "Peminjaman BHP berhasil diperbarui"
    );

    setTimeout(() => {
      router.push("/admin-pengelola/peminjaman-bhp");
    }, 500);
  } catch (error) {
    console.error("Error updating peminjaman BHP:", error);

    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (
      error.response?.status === 400 ||
      error.response?.status === 422
    ) {
      if (error.response.data.errors) {
        Object.assign(errors, error.response.data.errors);
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      } else if (typeof error.response.data === "object") {
        Object.assign(errors, error.response.data);
      } else {
        toast.error(error.response.data.message || "Validasi gagal");
      }
    } else if (error.response?.status === 404) {
      toast.error("Peminjaman BHP tidak ditemukan");
    } else {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui Peminjaman BHP"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  setupAxios();
  await fetchMahasiswaAndDosen();
  await fetchPeminjamanBhp();
});
</script>
