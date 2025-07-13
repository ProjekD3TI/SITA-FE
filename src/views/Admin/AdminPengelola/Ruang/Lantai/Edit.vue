<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Lantai</h2>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Nama Lantai <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.nama_lantai" type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan nama lantai" />
                <p v-if="errors.nama_lantai" class="text-sm text-red-500">
                    {{ errors.nama_lantai[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Gedung <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.id_gedung"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">-- Pilih Gedung --</option>
                    <option v-for="gedung in gedungList" :key="gedung.id_gedung" :value="gedung.id_gedung">
                        {{ gedung.nama_gedung }}
                    </option>
                </select>
                <p v-if="errors.id_gedung" class="text-sm text-red-500">
                    {{ errors.id_gedung[0] }}
                </p>
            </div>

            <!-- Current vs New Preview -->
            <div v-if="originalData.nama_lantai" class="space-y-3">
                <!-- Current Data -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Data Saat Ini:</h4>
                    <div class="space-y-1">
                        <p class="text-sm"><strong>Nama Lantai:</strong> {{ originalData.nama_lantai }}</p>
                        <p class="text-sm"><strong>Gedung:</strong> {{ originalData.gedung?.nama_gedung || '-' }}</p>
                    </div>
                </div>

                <!-- New Preview -->
                <div v-if="formData.nama_lantai || formData.id_gedung" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-900 mb-2">Preview Perubahan:</h4>
                    <div class="space-y-1">
                        <p class="text-sm"><strong>Nama Lantai:</strong> {{ formData.nama_lantai || 'Belum diisi' }}</p>
                        <p class="text-sm"><strong>Gedung:</strong> {{ getGedungName() || 'Belum dipilih' }}</p>
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
const gedungList = ref([]);

const formData = reactive({
    nama_lantai: "",
    id_gedung: "",
    _method: "PUT",
});

const originalData = reactive({
    nama_lantai: "",
    id_gedung: "",
    gedung: null,
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
        loading.value = true;
        setupAxios();

        const response = await axios.get(`/api/admin_pengelola/lantai/${id}`);
        const lantai = response.data;

        // Store original data for display
        Object.assign(originalData, {
            nama_lantai: lantai.nama_lantai || "",
            id_gedung: lantai.id_gedung || "",
            gedung: lantai.gedung,
        });

        // Set form data
        formData.nama_lantai = lantai.nama_lantai || "";
        formData.id_gedung = lantai.id_gedung || "";
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else if (error.response?.status === 404) {
            toast.error("Lantai tidak ditemukan");
            router.push("/admin-pengelola/lantai");
        } else {
            toast.error(error.response.data.message || "Gagal memuat data lantai");
        }
    } finally {
        loading.value = false;
    }
};

const getGedungName = () => {
    const gedung = gedungList.value.find(g => g.id_gedung == formData.id_gedung);
    return gedung ? gedung.nama_gedung : '';
};

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        Object.keys(errors).forEach((key) => delete errors[key]);

        const response = await axios.post(
            `/api/admin_pengelola/lantai/edit/${id}`,
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

        toast.success(response.data.message || "Lantai berhasil diupdate");
        setTimeout(() => {
            router.push(`/admin-pengelola/lantai/`);
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
            toast.error(error.response?.data?.message || "Gagal mengupdate lantai");
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    await fetchGedungList();
    await fetchLantai();
});
</script>
