<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Edit Tahun Ajaran</h2>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
      ></div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium leading-none"
          >Nama Tahun Ajaran</label
        >
        <input
          v-model="formData.name"
          type="text"
          class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contoh: 2023/2024"
        />
        <p v-if="errors.name" class="text-sm text-red-500">
          {{ errors.name[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium leading-none">Tanggal Mulai</label>
        <input
          v-model="formData.start_date"
          type="date"
          class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p v-if="errors.start_date" class="text-sm text-red-500">
          {{ errors.start_date[0] }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium leading-none">Tanggal Berakhir</label>
        <input
          v-model="formData.end_date"
          type="date"
          class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p v-if="errors.end_date" class="text-sm text-red-500">
          {{ errors.end_date[0] }}
        </p>
        <p v-if="dateError" class="text-sm text-red-500">
          {{ dateError }}
        </p>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
        </button>
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const isSubmitting = ref(false);
const dateError = ref("");
const toast = useToast();

const formData = reactive({
  name: "",
  start_date: "",
  end_date: "",
});

const errors = reactive({});

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  try {
    let date;
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    if (dateString.includes("T")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return "";
    }
    
    return date.toISOString().split("T")[0];
  } catch (error) {
    return "";
  }
};

const fetchSchoolYear = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/api/admin_pengelola/school_year/${route.params.id}`
    );

    Object.assign(formData, {
      name: response.data.name,
      start_date: formatDateForInput(response.data.start_date),
      end_date: formatDateForInput(response.data.end_date),
    });

  } catch (error) {
    toast.error("Gagal mengambil data tahun ajaran");
    router.push("/admin-pengelola/tahun-ajaran");
  } finally {
    loading.value = false;
  }
};

const validateDates = () => {
  if (formData.start_date && formData.end_date) {
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      dateError.value =
        "Tanggal berakhir harus sama atau setelah tanggal mulai";
      return false;
    }
  }
  dateError.value = "";
  return true;
};

const handleSubmit = async () => {
  if (!validateDates()) return;

  try {
    isSubmitting.value = true;
    Object.keys(errors).forEach((key) => delete errors[key]);

    const response = await axios.put(
      `/api/admin_pengelola/school_year/update/${route.params.id}`,
      formData
    );

    toast.success("Tahun ajaran berhasil diperbarui");
    router.push("/admin-pengelola/tahun-ajaran");
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else if (error.response && error.response.status === 400) {
      Object.assign(errors, error.response.data);
    } else {
      toast.error("Gagal memperbarui tahun ajaran");
    }
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/admin-pengelola/tahun-ajaran");
};

onMounted(() => {
  fetchSchoolYear();
});
</script>