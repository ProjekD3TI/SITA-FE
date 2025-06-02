<template>
  <div class="p-6 max-w-4xl mx-auto">
    <button
      @click="$router.go(-1)"
      class="inline-flex justify-start items-start gap-2 text-sm rounded-md text-gray-500 hover:text-gray-800 px-4 py-2 mb-4"
    >
      <i class="fas fa-chevron-left pt-1 text-xs"> </i>
      <span class="font-medium text-sm pt-[1.5px]"> Kembali</span>
    </button>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Detail Jenis Inventaris</h2>
      <div class="flex space-x-2">
        <button
          @click="goToEdit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
        >
          Edit
        </button>
        <button
          @click="confirmDelete"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
        >
          Hapus
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <div
      v-else-if="jenis_inventaris"
      class="bg-white shadow-md rounded-lg overflow-hidden"
    >
      <div class="grid md:grid-cols-2 gap-6 p-6">
        <div>
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500">
                Nama Jenis Inventaris
              </h3>
              <p class="mt-1 text-lg">
                {{ jenis_inventaris.nama_inventaris }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Merk</h3>
              <p class="mt-1 text-lg">{{ jenis_inventaris.nama_merk }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Tipe</h3>
              <p class="mt-1 text-lg">{{ jenis_inventaris.nama_tipe }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">
                Total Inventaris
              </h3>
              <p class="mt-1 text-lg">
                {{ jenis_inventaris.total_inventaris }}
              </p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500">Peruntukan</h3>
              <p class="mt-1 text-lg">
                <span
                  :class="{
                    'px-2 py-1 rounded text-xs font-medium': true,
                    'bg-blue-100 text-blue-800':
                      jenis_inventaris.peruntukan === 'alat_lab',
                    'bg-green-100 text-green-800':
                      jenis_inventaris.peruntukan === 'inventaris_kantor',
                  }"
                >
                  {{ formatPeruntukan(jenis_inventaris.peruntukan) }}
                </span>
              </p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Status Import</h3>
              <p class="mt-1 text-lg">
                <span
                  :class="{
                    'px-2 py-1 rounded text-xs font-medium': true,
                    'bg-purple-100 text-purple-800':
                      jenis_inventaris.status_import === 'produk_luar_negeri',
                    'bg-amber-100 text-amber-800':
                      jenis_inventaris.status_import === 'produk_dalam_negeri',
                  }"
                >
                  {{ formatStatusImport(jenis_inventaris.status_import) }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">
            Foto Jenis Inventaris
          </h3>
          <div v-if="loading" class="flex justify-center items-center h-40">
            <div
              class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
            ></div>
          </div>
          <div v-else-if="photos.length > 0" class="grid grid-cols-2 gap-2">
            <div v-for="(foto, index) in photos" :key="index" class="relative">
              <img
                :src="getImageUrl(foto.foto_path)"
                :alt="`Foto jenis_inventaris ${index + 1}`"
                class="h-40 w-full object-cover rounded-md cursor-pointer"
                loading="lazy"
                @click="openImageModal(foto.foto_path)"
              />
            </div>
          </div>
          <p v-else class="text-gray-500">Tidak ada foto</p>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <div
      v-if="isModalVisible"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="isModalVisible = false"
    >
      <div class="max-w-4xl max-h-screen p-4" @click.stop>
        <img
          :src="selectedImage"
          alt="Enlarged jenis_inventaris Image"
          class="max-h-[80vh] max-w-full object-contain"
        />
        <button
          @click="isModalVisible = false"
          class="absolute top-4 right-4 bg-white rounded-full p-2"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Konfirmasi Hapus</h3>
        <p class="mb-6">
          Apakah Anda yakin ingin menghapus Jenis Inventaris ini? Tindakan ini
          tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="deleteJenisInventaris"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? "Menghapus..." : "Hapus" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;

const jenis_inventaris = ref(null);
const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalVisible = ref(false);
const selectedImage = ref("");
const showDeleteModal = ref(false);
const isDeleting = ref(false);

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchJenisInventaris = async () => {
  try {
    loading.value = true;
    setupAxios();
    const response = await axios.get(
      `/api/admin_pengelola/jenis_inventaris/${id}`
    );

    if (response.data.status === "success") {
      jenis_inventaris.value = response.data.data;
      photos.value = response.data.photos || [];
    } else {
      throw new Error(
        response.data.message || "Failed to fetch jenis inventaris data"
      );
    }
  } catch (error) {
    console.error("Error fetching jenis inventaris:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else if (error.response?.status === 404) {
      toast.error("jenis inventaris tidak ditemukan");
      router.push("/admin-pengelola/jenis-inventaris");
    } else {
      toast.error("Gagal memuat data jenis inventaris");
      error.value = "Gagal memuat data jenis inventaris";
    }
  } finally {
    loading.value = false;
  }
};

const formatPeruntukan = (value) => {
  const formats = {
    alat_lab: "Alat Laboratorium",
    inventaris_kantor: "Inventaris Kantor",
  };
  return formats[value] || value;
};

const formatStatusImport = (value) => {
  const formats = {
    produk_luar_negeri: "Produk Luar Negeri",
    produk_dalam_negeri: "Produk Dalam Negeri",
  };
  return formats[value] || value;
};

const getImageUrl = (foto_path) => {
  if (!foto_path) return "";
  return `${import.meta.env.VITE_API_BASE_URL}/storage/inventaris/${foto_path}`;
};

const openImageModal = (foto_path) => {
  selectedImage.value = getImageUrl(foto_path);
  isModalVisible.value = true;
};

const goToEdit = () => {
  router.push(`/admin-pengelola/jenis-inventaris/edit/${id}`);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteJenisInventaris = async () => {
  try {
    isDeleting.value = true;
    setupAxios();
    const response = await axios.delete(
      `/api/admin_pengelola/jenis_inventaris/${id}`
    );
    toast.success(response.data.message || "jenis inventaris berhasil dihapus");
    router.push("/admin-pengelola/jenis-inventaris");
  } catch (error) {
    console.error("Error deleting jenis inventaris:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error("Gagal menghapus jenis inventaris");
    }
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

onMounted(() => {
  fetchJenisInventaris();
});
</script>
