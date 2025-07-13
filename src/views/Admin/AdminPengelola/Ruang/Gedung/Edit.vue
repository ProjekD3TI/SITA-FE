<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Gedung</h2>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Nama Gedung <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.nama_gedung" type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan nama gedung" />
                <p v-if="errors.nama_gedung" class="text-sm text-red-500">
                    {{ errors.nama_gedung[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lokasi <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.lokasi" type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan lokasi gedung" />
                <p v-if="errors.lokasi" class="text-sm text-red-500">
                    {{ errors.lokasi[0] }}
                </p>
            </div>

            <!-- Current vs New Preview -->
            <div v-if="originalData.nama_gedung" class="space-y-3">
                <!-- Current Data -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Data Saat Ini:</h4>
                    <div class="space-y-1">
                        <p class="text-sm"><strong>Nama:</strong> {{ originalData.nama_gedung }}</p>
                        <p class="text-sm"><strong>Lokasi:</strong> {{ originalData.lokasi }}</p>
                    </div>
                </div>

                <!-- New Preview -->
                <div v-if="formData.nama_gedung || formData.lokasi" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-900 mb-2">Preview Perubahan:</h4>
                    <div class="space-y-1">
                        <p class="text-sm"><strong>Nama:</strong> {{ formData.nama_gedung || 'Belum diisi' }}</p>
                        <p class="text-sm"><strong>Lokasi:</strong> {{ formData.lokasi || 'Belum diisi' }}</p>
                    </div>
                </div>
            </div>

            <div class="flex space-x-2">
                <button type="submit"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    :disabled="isSubmitting">
                    {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
                </button>
                <button type="button" @click="$router.go(-1)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2">
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

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const isSubmitting = ref(false);
const loading = ref(true);

const formData = reactive({
    nama_gedung: "",
    lokasi: "",
    _method: "PUT",
});

const originalData = reactive({
    nama_gedung: "",
    lokasi: "",
});

const errors = reactive({});

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const fetchGedung = async () => {
    try {
        loading.value = true;
        setupAxios();

        const response = await axios.get(`/api/admin_pengelola/gedung/${id}`);
        const gedung = response.data;

        // Store original data for display
        Object.assign(originalData, {
            nama_gedung: gedung.nama_gedung || "",
            lokasi: gedung.lokasi || "",
        });

        // Set form data
        formData.nama_gedung = gedung.nama_gedung || "";
        formData.lokasi = gedung.lokasi || "";
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else if (error.response?.status === 404) {
            toast.error("Gedung tidak ditemukan");
            router.push("/admin-pengelola/gedung");
        } else {
            toast.error("Gagal memuat data gedung");
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
            `/api/admin_pengelola/gedung/edit/${id}`,
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

        toast.success(response.data.message || "Gedung berhasil diupdate");
        setTimeout(() => {
            router.push(`/admin-pengelola/gedung/`);
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
            toast.error(error.response?.data?.message || "Gagal mengupdate gedung");
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchGedung();
});
</script>