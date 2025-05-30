<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Create Peminjaman Inventaris</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
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
        />
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Peminjam
        </label>
        <select
          v-model="formData.tipe_peminjam"
          placeholder="Pilih Tipe Peminjam"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
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
        />
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
        ></textarea>
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
          Create
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";
import Multiselect from "vue-multiselect";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const formData = ref({
  id_peminjam: "",
  tipe_peminjam: "",
  kegunaan: "",
  tanggal_pinjam: "",
});

const inventarisList = ref([]);
const mahasiswaList = ref([]);
const dosenList = ref([]);
const isSubmitting = ref(false);

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

watch(
  () => formData.value.tipe_peminjam,
  (newValue) => {
    formData.value.id_peminjam = "";
  }
);

const fetchInventaris = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/get_inventaris");
    inventarisList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/admin-login");
    }
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
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/admin-login");
    }
  }
};

onMounted(async () => {
  setupAxios();
  await fetchMahasiswaAndDosen();
  await fetchInventaris();
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    const form = new FormData();

    formData.value.id_inventaris.forEach((item) => {
      form.append("id_inventaris[]", item.id_inventaris);
    });

    form.append("id_peminjam", formData.value.id_peminjam);
    form.append("tipe_peminjam", formData.value.tipe_peminjam);
    form.append("kegunaan", formData.value.kegunaan);
    form.append("tanggal_pinjam", formData.value.tanggal_pinjam);

    const response = await axios.post(
      `/api/admin_pengelola/peminjaman_inventaris/create`,
      form
    );

    toast.success(
      response.data.message || "Peminjaman inventaris berhasil dibuat"
    );
    router.push("/admin-pengelola/peminjaman-inventaris");
  } catch (error) {
    console.error("Error creating peminjaman:", error);

    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/admin-login");
    } else if (error.response?.status === 422) {
      toast.error(error.response.data.message || "Validasi gagal");
    } else {
      toast.error(
        error.response?.data?.message || "Gagal membuat peminjaman inventaris"
      );
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
