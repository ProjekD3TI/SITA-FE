<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit BHP</h2>

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
          Nama BHP
        </label>
        <input
          v-model="formData.nama_bhp"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nama BHP"
        />
        <p v-if="errors.nama_bhp" class="text-sm text-red-500">
          {{ errors.nama_bhp[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kondisi Bagus
        </label>
        <input
          v-model="formData.kondisi_bagus"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Jumlah kondisi bagus"
        />
        <p v-if="errors.kondisi_bagus" class="text-sm text-red-500">
          {{ errors.kondisi_bagus[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Kondisi Rusak
        </label>
        <input
          v-model="formData.kondisi_rusak"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Jumlah kondisi rusak"
        />
        <p v-if="errors.kondisi_rusak" class="text-sm text-red-500">
          {{ errors.kondisi_rusak[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Peruntukan
        </label>
        <textarea
          v-model="formData.peruntukan"
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan peruntukan BHP"
        ></textarea>
        <p v-if="errors.peruntukan" class="text-sm text-red-500">
          {{ errors.peruntukan[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Ganti Foto BHP (Opsional)
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
        <p v-if="errors['foto_bhp.0']" class="text-sm text-red-500">
          {{ errors["foto_bhp.0"][0] }}
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
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const fileInput = ref(null);
const previewImages = ref([]);
const isSubmitting = ref(false);
const loading = ref(true);
const timestamp = ref(Date.now());

const formData = reactive({
  nama_bhp: "",
  kondisi_bagus: "",
  kondisi_rusak: "",
  peruntukan: "",
  foto_bhp: [],
  _method: "PUT",
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchBhp = async () => {
  try {
    loading.value = true;
    setupAxios();
    const response = await axios.get(`/api/admin_pengelola/bhp/${id}`);
    const bhp = response.data.data;

    formData.nama_bhp = bhp.nama_bhp || "";
    formData.kondisi_bagus = bhp.kondisi_bagus || 0;
    formData.kondisi_rusak = bhp.kondisi_rusak || 0;
    formData.peruntukan = bhp.peruntukan || "";
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("BHP tidak ditemukan");
      router.push("/admin-pengelola/bhp");
    } else {
      toast.error("Gagal memuat data BHP");
    }
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  formData.foto_bhp = Array.from(files);

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

  const newFiles = [...formData.foto_bhp];
  newFiles.splice(index, 1);
  formData.foto_bhp = newFiles;

  if (formData.foto_bhp.length === 0) {
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

    submitData.append("nama_bhp", String(formData.nama_bhp));
    submitData.append("kondisi_bagus", String(formData.kondisi_bagus));
    submitData.append("kondisi_rusak", String(formData.kondisi_rusak));
    submitData.append("peruntukan", String(formData.peruntukan));

    if (formData.foto_bhp.length > 0) {
      formData.foto_bhp.forEach((file) => {
        submitData.append("foto_bhp[]", file);
      });
    }

    const response = await axios.post(
      `/api/admin_pengelola/bhp/edit/${id}`,
      submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT",
        },
      }
    );

    toast.success(response.data.message || "BHP berhasil diupdate");

    timestamp.value = Date.now();

    setTimeout(() => {
      router.push(`/admin-pengelola/bhp/`);
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
      toast.error(error.response?.data?.message || "Gagal mengupdate BHP");
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchBhp();
});
</script>
