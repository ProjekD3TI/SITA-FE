<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Create Lantai</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nama Lantai
        </label>
        <input
          v-model="formData.nama_lantai"
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Masukkan nama lantai"
        />
        <p v-if="errors.nama_lantai" class="text-sm text-red-500">
          {{ errors.nama_lantai[0] }}
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
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const formData = reactive({
  nama_lantai: "",
});

const errors = reactive({});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    setupAxios();

    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.post(
      "/api/admin_pengelola/lantai/create",
      formData
    );

    toast.success(response.data.message || "Lantai berhasil ditambahkan");
    router.push("/admin-pengelola/lantai");
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
      toast.error(error.response?.data?.message || "Gagal menambahkan lantai");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
