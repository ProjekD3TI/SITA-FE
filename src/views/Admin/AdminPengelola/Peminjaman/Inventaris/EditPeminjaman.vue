<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit Peminjaman Inventaris</h2>

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
          Inventaris
        </label>
        <Multiselect
          v-model="formData.id_inventaris"
          :options="inventarisList"
          :multiple="true"
          track-by="id_inventaris"
          label="no_inventaris"
          placeholder="Pilih Inventaris"
          class="multiselect-custom"
          :custom-label="customInventarisLabel"
          :searchable="true"
          :loading="isLoadingInventaris"
          :internal-search="false"
          @search-change="searchInventaris"
          :clear-on-select="false"
          :close-on-select="false"
          :options-limit="100"
          :limit="100"
          :max-height="300"
        />
        <p v-if="errors.id_inventaris" class="text-sm text-red-500">
          Inventaris is required
        </p>
        <p v-if="errors['id_inventaris.0']" class="text-sm text-red-500">
          Inventaris is required
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
          Peminjam is required
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
          Tanggal Pengembalian (Perkiraan)
        </label>
        <input
          v-model="formData.tanggal_pengembalian"
          type="date"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p v-if="errors.tanggal_pengembalian" class="text-sm text-red-500">
          {{ errors.tanggal_pengembalian[0] }}
        </p>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          :disabled="isSubmitting"
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
          {{ isSubmitting ? "Memproses..." : "Update" }}
        </button>
        <button
          type="button"
          @click="$router.go(-1)"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";
import Multiselect from "vue-multiselect";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isLoadingInventaris = ref(false);
const inventarisSearchQuery = ref("");

const peminjamanId = route.params.id;

const formData = ref({
  id_inventaris: [],
  id_peminjam: "",
  tipe_peminjam: "",
  kegunaan: "",
  tanggal_pinjam: "",
  tanggal_pengembalian: "",
});

const inventarisList = ref([]);
const mahasiswaList = ref([]);
const dosenList = ref([]);
const isSubmitting = ref(false);
const isLoading = ref(true);
const statusError = ref("");

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const customInventarisLabel = (option) => {
  if (option.jenis_inventaris && option.jenis_inventaris.nama_inventaris) {
    return `${option.no_inventaris} - ${option.jenis_inventaris.nama_inventaris}`;
  }
  return option.no_inventaris;
};

watch(
  () => formData.value.tipe_peminjam,
  (newValue, oldValue) => {
    if (oldValue && newValue !== oldValue) {
      formData.value.id_peminjam = "";
    }
  }
);

const fetchPeminjamanDetail = async () => {
  try {
    setupAxios();
    const response = await axios.get(
      `/api/admin_pengelola/peminjaman_inventaris/${peminjamanId}`
    );
    const peminjaman = response.data.data.peminjaman;

    if (peminjaman.status_peminjaman !== "dipinjam") {
      statusError.value = `Hanya peminjaman dengan status 'dipinjam' yang dapat diedit. Status saat ini: ${peminjaman.status_peminjaman}`;
      isLoading.value = false;
      return;
    }

    formData.value = {
      id_inventaris: response.data.data.detail.map((detail) => ({
        id_inventaris: detail.inventaris.id_inventaris,
        no_inventaris: detail.inventaris.no_inventaris,
        jenis_inventaris: detail.inventaris.jenis_inventaris,
      })),
      id_peminjam: peminjaman.id_peminjam,
      tipe_peminjam: peminjaman.tipe_peminjam,
      kegunaan: peminjaman.kegunaan,
      tanggal_pinjam: peminjaman.tanggal_pinjam,
      tanggal_pengembalian: peminjaman.tanggal_pengembalian,
    };
  } catch (error) {
    console.error("Error fetching peminjaman detail:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Peminjaman tidak ditemukan");
      router.go(-1);
    } else {
      toast.error("Gagal memuat data peminjaman");
      router.go(-1);
    }
  }
};

const fetchInventaris = async (searchQuery = "") => {
  try {
    isLoadingInventaris.value = true;
    setupAxios();

    let url = "/api/admin_pengelola/get_inventaris";
    if (searchQuery && searchQuery.length >= 2) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await axios.get(url);
    const availableInventaris = response.data.data;

    const currentInventarisIds = formData.value.id_inventaris.map(
      (item) => item.id_inventaris
    );
    const mergedInventaris = [...availableInventaris];

    formData.value.id_inventaris.forEach((currentItem) => {
      if (
        !availableInventaris.find(
          (item) => item.id_inventaris === currentItem.id_inventaris
        )
      ) {
        mergedInventaris.push(currentItem);
      }
    });

    inventarisList.value = mergedInventaris;
  } catch (error) {
    console.error("Error fetching inventaris:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    }
  } finally {
    isLoadingInventaris.value = false;
  }
};

let searchTimeout = null;
const searchInventaris = (query) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchInventaris(query);
  }, 300);
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
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    }
  }
};

onMounted(async () => {
  setupAxios();
  await fetchMahasiswaAndDosen();
  await fetchPeminjamanDetail();

  if (!statusError.value) {
    await fetchInventaris();
  }

  isLoading.value = false;
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const form = new FormData();

    formData.value.id_inventaris.forEach((item) => {
      form.append("id_inventaris[]", item.id_inventaris);
    });

    form.append("id_peminjam", formData.value.id_peminjam);
    form.append("tipe_peminjam", formData.value.tipe_peminjam);
    form.append("kegunaan", formData.value.kegunaan);
    form.append("tanggal_pinjam", formData.value.tanggal_pinjam);
    form.append("tanggal_pengembalian", formData.value.tanggal_pengembalian);

    const response = await axios.post(
      `/api/admin_pengelola/peminjaman_inventaris/edit/${peminjamanId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT",
        },
      }
    );

    toast.success(
      response.data.message || "Peminjaman inventaris berhasil diperbarui"
    );
    router.push("/admin-pengelola/peminjaman-inventaris");
  } catch (error) {
    console.error("Error updating peminjaman:", error);

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
    } else {
      toast.error(
        error.response?.data?.message ||
          "Gagal memperbarui peminjaman inventaris"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
