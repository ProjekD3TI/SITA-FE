<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Create Jenis Inventaris</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nama Inventaris
        </label>
        <input
          v-model="formData.nama_inventaris"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nama inventaris"
        />
        <p v-if="errors.nama_inventaris" class="text-sm text-red-500">
          {{ errors.nama_inventaris[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Merk
        </label>
        <SearchableSelect
          v-model="formData.id_merk"
          :options="merkList"
          value-key="id_merk"
          label-key="nama_merk"
          placeholder="Pilih Merk"
        />
        <p v-if="errors.id_merk" class="text-sm text-red-500">
          {{ errors.id_merk[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tipe
        </label>
        <SearchableSelect
          v-model="formData.id_tipe"
          :options="tipeList"
          value-key="id_tipe"
          label-key="nama_tipe"
          placeholder="Pilih Tipe"
        />
        <p v-if="errors.id_tipe" class="text-sm text-red-500">
          {{ errors.id_tipe[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Peruntukan
        </label>
        <select
          v-model="formData.peruntukan"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Pilih Peruntukan</option>
          <option value="alat_lab">Alat Laboratorium</option>
          <option value="inventaris_kantor">Inventaris Kantor</option>
        </select>
        <p v-if="errors.peruntukan" class="text-sm text-red-500">
          {{ errors.peruntukan[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Status Import
        </label>
        <select
          v-model="formData.status_import"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Pilih Status Import</option>
          <option value="produk_luar_negeri">Produk Luar Negeri</option>
          <option value="produk_dalam_negeri">Produk Dalam Negeri</option>
        </select>
        <p v-if="errors.status_import" class="text-sm text-red-500">
          {{ errors.status_import[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Foto inventaris
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
        <p v-if="errors.foto_inventaris" class="text-sm text-red-500">
          {{ errors.foto_inventaris[0] }}
        </p>
        <p v-if="errors['foto_inventaris.0']" class="text-sm text-red-500">
          {{ errors["foto_inventaris.0"][0] }}
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
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const router = useRouter();
const toast = useToast();
const fileInput = ref(null);
const previewImages = ref([]);
const isSubmitting = ref(false);
const merkList = ref([]);
const tipeList = ref([]);

const formData = reactive({
  nama_inventaris: "",
  id_merk: "",
  id_tipe: "",
  peruntukan: "",
  status_import: "",
  foto_inventaris: [],
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  formData.foto_inventaris = Array.from(files);

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

  const newFiles = [...formData.foto_inventaris];
  newFiles.splice(index, 1);
  formData.foto_inventaris = newFiles;

  if (formData.foto_inventaris.length === 0) {
    fileInput.value.value = "";
  }
};

const fetchMerkList = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/merk");
    merkList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching merk list:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      toast.error("Gagal memuat data merk");
    }
  }
};

const fetchTipeList = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/admin_pengelola/tipe");
    tipeList.value = response.data.data;
  } catch (error) {
    console.error("Error fetching tipe list:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      toast.error("Gagal memuat data tipe");
    }
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const submitData = new FormData();
    submitData.append("nama_inventaris", formData.nama_inventaris);
    submitData.append("id_merk", formData.id_merk);
    submitData.append("id_tipe", formData.id_tipe);
    submitData.append("peruntukan", formData.peruntukan);
    submitData.append("status_import", formData.status_import);

    formData.foto_inventaris.forEach((file) => {
      submitData.append("foto_inventaris[]", file);
    });

    const response = await axios.post(
      "/api/admin_pengelola/jenis_inventaris/create",
      submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      response.data.message || "Jenis Inventaris berhasil ditambahkan"
    );
    router.push("/admin-pengelola/jenis-inventaris");
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
      router.push("/admin/login");
    } else {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan Jenis Inventaris"
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchMerkList();
  fetchTipeList();
});
</script>
