<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Tambah Inventaris</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Jenis Inventaris
        </label>
        <SearchableSelect
          v-model="formData.id_jenis_inventaris"
          :options="jenisInventarisList"
          value-key="id_jenis_inventaris"
          label-key="nama_inventaris"
          placeholder="Pilih Jenis Inventaris"
        />
        <p v-if="errors.id_jenis_inventaris" class="text-sm text-red-500">
          {{ errors.id_jenis_inventaris[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nomor Inventaris
        </label>
        <input
          v-model="formData.no_inventaris"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nomor inventaris"
        />
        <p v-if="errors.no_inventaris" class="text-sm text-red-500">
          {{ errors.no_inventaris[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kondisi
        </label>
        <select
          v-model="formData.kondisi"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Pilih Kondisi</option>
          <option value="baik">Baik</option>
          <option value="rusak">Rusak</option>
          <option value="hilang">Hilang</option>
        </select>
        <p v-if="errors.kondisi" class="text-sm text-red-500">
          {{ errors.kondisi[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ruang
        </label>
        <SearchableSelect
          v-model="formData.id_ruang"
          :options="ruangList"
          value-key="id_ruang"
          label-key="nama_ruang"
          placeholder="Pilih Ruang"
        />
        <p v-if="errors.id_ruang" class="text-sm text-red-500">
          {{ errors.id_ruang[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tahun Pengadaan
        </label>
        <input
          v-model="formData.tahun_pengadaan"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan tahun pengadaan"
        />
        <p v-if="errors.tahun_pengadaan" class="text-sm text-red-500">
          {{ errors.tahun_pengadaan[0] }}
        </p>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          :disabled="isSubmitting"
        >
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
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const jenisInventarisList = ref([]);
const ruangList = ref([]);

const formData = reactive({
  id_jenis_inventaris: "",
  no_inventaris: "",
  kondisi: "",
  id_ruang: "",
  tahun_pengadaan: "",
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchJenisInventarisList = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/jenis_inventaris");
    jenisInventarisList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching jenis inventaris list:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error("Gagal memuat data jenis inventaris");
    }
  }
};

const fetchRuangList = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/ruang");
    ruangList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching ruang list:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error("Gagal memuat data ruang");
    }
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.post(
      "/api/admin_pengelola/inventaris/create",
      formData
    );

    toast.success(response.data.message || "Inventaris berhasil ditambahkan");
    router.push("/admin-pengelola/inventaris");
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 422) {
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
    } else if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan Inventaris"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchJenisInventarisList();
  fetchRuangList();
});
</script>
