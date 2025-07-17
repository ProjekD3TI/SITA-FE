<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Tambah Dosen</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nama <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nama dosen"
        />
        <p v-if="errors.name" class="text-sm text-red-500">
          {{ errors.name[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.email"
          type="email"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan email dosen"
        />
        <p v-if="errors.email" class="text-sm text-red-500">
          {{ errors.email[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Password <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.password"
          type="password"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan password"
        />
        <p v-if="errors.password" class="text-sm text-red-500">
          {{ errors.password[0] }}
        </p>
        <p class="text-xs text-gray-500">
          Password harus minimal 8 karakter, mengandung huruf besar, huruf
          kecil, dan angka
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          NIK <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.nik"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan NIK dosen"
        />
        <p v-if="errors.nik" class="text-sm text-red-500">
          {{ errors.nik[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          No. Telepon
        </label>
        <input
          v-model="formData.no_telp"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nomor telepon (opsional)"
          maxlength="15"
        />
        <p v-if="errors.no_telp" class="text-sm text-red-500">
          {{ errors.no_telp[0] }}
        </p>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">
          <i class="fas fa-info-circle mr-2"></i>Informasi
        </h3>
        <ul class="text-xs text-blue-700 space-y-1">
          <li>• Dosen akan otomatis mendapat jabatan "Dosen"</li>
          <li>• Email berisi informasi akun akan dikirim ke dosen</li>
          <li>• Status dosen akan aktif secara otomatis</li>
        </ul>
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
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const formData = reactive({
  name: "",
  email: "",
  password: "",
  nik: "",
  no_telp: "",
});

const errors = reactive({});

const token = VueCookies.get("auth_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.post("/api/superadmin/create_dosen", formData);

    toast.success(response.data.message || "Dosen berhasil ditambahkan");
    router.push("/superadmin/dosen");
  } catch (error) {
    if (error.response?.status === 422) {
      if (
        error.response.data.message &&
        typeof error.response.data.message === "object"
      ) {
        Object.assign(errors, error.response.data.message);
      } else if (typeof error.response.data === "object") {
        Object.assign(errors, error.response.data);
      } else {
        toast.error(error.response.data.message || "Validasi gagal");
      }
    } else if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error(error.response?.data?.message || "Gagal menambahkan Dosen");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
