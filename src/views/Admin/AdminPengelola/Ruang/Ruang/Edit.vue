<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit Ruang</h2>

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
          Nama Ruang
        </label>
        <input
          v-model="formData.nama_ruang"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nama ruang"
        />
        <p v-if="errors.nama_ruang" class="text-sm text-red-500">
          {{ errors.nama_ruang[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kapasitas
        </label>
        <input
          v-model="formData.kapasitas"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan kapasitas ruang"
        />
        <p v-if="errors.kapasitas" class="text-sm text-red-500">
          {{ errors.kapasitas[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Dimensi
        </label>
        <input
          v-model="formData.dimensi"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Contoh: 5x7 meter"
        />
        <p v-if="errors.dimensi" class="text-sm text-red-500">
          {{ errors.dimensi[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Fasilitas
        </label>
        <textarea
          v-model="formData.fasilitas"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan fasilitas ruang"
        ></textarea>
        <p v-if="errors.fasilitas" class="text-sm text-red-500">
          {{ errors.fasilitas[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Gedung
        </label>

        <SearchableSelect
          v-model="formData.id_gedung"
          :options="gedungList"
          value-key="id_gedung"
          label-key="nama_gedung"
          placeholder="Pilih Gedung"
        />

        <p v-if="errors.id_gedung" class="text-sm text-red-500">
          {{ errors.id_gedung[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Status
        </label>
        <select
          v-model="formData.status"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option :value="1">Tersedia</option>
          <option :value="0">Tidak Tersedia</option>
        </select>
        <p v-if="errors.status" class="text-sm text-red-500">
          {{ errors.status[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ganti Foto Ruang (Opsional)
        </label>
        <div class="flex items-center gap-2">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            multiple
            accept="image/*"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <p class="text-xs text-gray-500">
          Mengunggah foto baru akan menggantikan semua foto yang ada
        </p>
        <p v-if="errors['foto_ruang.0']" class="text-sm text-red-500">
          {{ errors["foto_ruang.0"][0] }}
        </p>
      </div>

      <div v-if="previewImages.length > 0" class="grid grid-cols-3 gap-2 mt-2">
        <div
          v-for="(image, index) in previewImages"
          :key="index"
          class="relative"
        >
          <img
            :src="image"
            alt="Preview"
            class="h-24 w-24 object-cover rounded-md"
          />
          <button
            @click.prevent="removeImage(index)"
            class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
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
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const fileInput = ref(null);
const previewImages = ref([]);
const isSubmitting = ref(false);
const loading = ref(true);
const gedungList = ref([]);
const timestamp = ref(Date.now());

const formData = reactive({
  nama_ruang: "",
  kapasitas: "",
  dimensi: "",
  fasilitas: "",
  id_gedung: "",
  status: 1,
  foto_ruang: [],
  _method: "PUT",
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchGedungList = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/gedung");
    gedungList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching gedung list:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error("Gagal memuat daftar gedung");
    }
  }
};

const fetchRuang = async () => {
  try {
    loading.value = true;
    setupAxios();

    // Fetch gedung list first
    await fetchGedungList();

    const response = await axios.get(`/api/admin_pengelola/ruang/${id}`);
    const ruang = response.data.data;

    formData.nama_ruang = ruang.nama_ruang || "";
    formData.kapasitas = ruang.kapasitas || 0;
    formData.dimensi = ruang.dimensi || "";
    formData.fasilitas = ruang.fasilitas || "";
    formData.id_gedung = ruang.id_gedung || "";
    formData.status = ruang.status !== undefined ? ruang.status : 1;
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("Ruang tidak ditemukan");
      router.push("/admin-pengelola/ruang");
    } else {
      toast.error("Gagal memuat data ruang");
    }
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  formData.foto_ruang = Array.from(files);

  previewImages.value = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);

  const newFiles = [...formData.foto_ruang];
  newFiles.splice(index, 1);
  formData.foto_ruang = newFiles;

  if (formData.foto_ruang.length === 0) {
    fileInput.value.value = "";
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const submitData = new FormData();

    submitData.append("_method", "PUT");
    submitData.append("nama_ruang", String(formData.nama_ruang));
    submitData.append("kapasitas", String(formData.kapasitas));
    submitData.append("dimensi", String(formData.dimensi));
    submitData.append("fasilitas", String(formData.fasilitas));
    submitData.append("id_gedung", String(formData.id_gedung));
    submitData.append("status", String(formData.status));

    if (formData.foto_ruang.length > 0) {
      formData.foto_ruang.forEach((file) => {
        submitData.append("foto_ruang[]", file);
      });
    }

    const response = await axios.post(
      `/api/admin_pengelola/ruang/edit/${id}`,
      submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT",
        },
      }
    );

    toast.success(response.data.message || "Ruang berhasil diupdate");

    timestamp.value = Date.now();

    setTimeout(() => {
      router.push(`/admin-pengelola/ruang/`);
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
      toast.error(error.response?.data?.message || "Gagal mengupdate ruang");
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchRuang();
});
</script>
