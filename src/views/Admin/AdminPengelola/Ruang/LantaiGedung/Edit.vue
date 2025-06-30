<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit Gedung Lantai</h2>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Gedung <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.id_gedung"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Pilih Gedung --</option>
          <option
            v-for="gedung in gedungList"
            :key="gedung.id_gedung"
            :value="gedung.id_gedung"
          >
            {{ gedung.nama_gedung }}
          </option>
        </select>
        <p v-if="errors.id_gedung" class="text-sm text-red-500">
          {{ errors.id_gedung[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Lantai <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.id_lantai"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Pilih Lantai --</option>
          <option
            v-for="lantai in lantaiList"
            :key="lantai.id_lantai"
            :value="lantai.id_lantai"
          >
            {{ lantai.nama_lantai }}
          </option>
        </select>
        <p v-if="errors.id_lantai" class="text-sm text-red-500">
          {{ errors.id_lantai[0] }}
        </p>
      </div>

      <!-- Preview Card -->
      <div
        v-if="formData.id_gedung && formData.id_lantai"
        class="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h4 class="text-sm font-medium text-blue-900 mb-2">
          Preview Gedung Lantai:
        </h4>
        <div class="space-y-1">
          <p class="text-sm">
            <strong>Gedung:</strong>
            {{ selectedGedung?.nama_gedung || "Belum dipilih" }}
          </p>
          <p class="text-sm">
            <strong>Lantai:</strong>
            {{ selectedLantai?.nama_lantai || "Belum dipilih" }}
          </p>
        </div>
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
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const isSubmitting = ref(false);
const loading = ref(true);
const gedungList = ref([]);
const lantaiList = ref([]);

const formData = reactive({
  id_gedung: "",
  id_lantai: "",
  _method: "PUT",
});

const errors = reactive({});

// Computed properties for preview
const selectedGedung = computed(() => {
  return gedungList.value.find(
    (gedung) => gedung.id_gedung == formData.id_gedung
  );
});

const selectedLantai = computed(() => {
  return lantaiList.value.find(
    (lantai) => lantai.id_lantai == formData.id_lantai
  );
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchGedung = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/gedung");
    if (response.data && response.data.data) {
      gedungList.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching gedung:", error);
    toast.error("Gagal memuat data gedung");
  }
};

const fetchLantai = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/lantai");
    if (response.data && response.data.data) {
      lantaiList.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching lantai:", error);
    toast.error("Gagal memuat data lantai");
  }
};

const fetchGedungLantai = async () => {
  try {
    loading.value = true;
    setupAxios();

    const response = await axios.get(`/api/gedung-lantai/${id}`);
    const gedungLantaiData = response.data.data;

    formData.id_gedung = gedungLantaiData.id_gedung || "";
    formData.id_lantai = gedungLantaiData.id_lantai || "";
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Gedung lantai tidak ditemukan");
      router.push("/admin-pengelola/gedung-lantai");
    } else {
      toast.error("Gagal memuat data gedung lantai");
    }
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.post(
      `/api/gedung-lantai/edit/${id}`,
      {
        ...formData,
        _method: "PUT",
      },
      {
        headers: {
          "X-HTTP-Method-Override": "PUT",
        },
      }
    );

    toast.success(response.data.message || "Gedung lantai berhasil diupdate");
    setTimeout(() => {
      router.push(`/admin-pengelola/gedung-lantai/`);
    }, 500);
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 422) {
      if (error.response.data.errors) {
        Object.assign(errors, error.response.data.errors);
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
        error.response?.data?.message || "Gagal mengupdate gedung lantai"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchGedung(), fetchLantai()]);
  await fetchGedungLantai();
});
</script>
