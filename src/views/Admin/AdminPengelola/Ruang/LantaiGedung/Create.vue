<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Tambah Gedung Lantai</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Select Gedung -->
            <div class="space-y-2">
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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

            <!-- Select Lantai -->
            <div class="space-y-2">
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lantai <span class="text-red-500">*</span>
                </label>
                <div class="space-y-2">
                    <!-- Multi-select dengan checkbox -->
                    <div class="border rounded-md p-3 max-h-48 overflow-y-auto bg-background">
                        <div class="flex items-center space-x-2 mb-2">
                            <input 
                                type="checkbox" 
                                id="select-all-lantai"
                                @change="toggleSelectAll"
                                :checked="isAllSelected"
                                class="rounded border-gray-300"
                            />
                            <label for="select-all-lantai" class="text-sm font-medium">
                                Pilih Semua Lantai
                            </label>
                        </div>
                        <hr class="mb-2" />
                        <div v-for="lantai in lantaiList" :key="lantai.id_lantai" class="flex items-center space-x-2 mb-1">
                            <input 
                                type="checkbox" 
                                :id="`lantai-${lantai.id_lantai}`"
                                :value="lantai.id_lantai"
                                v-model="formData.id_lantai"
                                class="rounded border-gray-300"
                            />
                            <label :for="`lantai-${lantai.id_lantai}`" class="text-sm">
                                {{ lantai.nama_lantai }}
                            </label>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500">
                        Pilih satu atau lebih lantai untuk gedung ini
                    </p>
                </div>
                <p v-if="errors.id_lantai" class="text-sm text-red-500">
                    {{ Array.isArray(errors.id_lantai) ? errors.id_lantai[0] : errors.id_lantai }}
                </p>
            </div>

            <!-- Preview Gedung dan Lantai -->
            <div v-if="formData.id_gedung && formData.id_lantai.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Preview Gedung Lantai:</h4>
                <div class="space-y-2">
                    <p class="text-sm"><strong>Gedung:</strong> {{ selectedGedung?.nama_gedung || 'Belum dipilih' }}</p>
                    <div class="text-sm">
                        <strong>Lantai yang dipilih ({{ formData.id_lantai.length }}):</strong>
                        <div class="flex flex-wrap gap-1 mt-1">
                            <span 
                                v-for="lantaiId in formData.id_lantai" 
                                :key="lantaiId"
                                class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                                {{ getLantaiName(lantaiId) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
                <button
                    type="submit"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    :disabled="isSubmitting || formData.id_lantai.length === 0"
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
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// Variables & refs
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const gedungList = ref([]);
const lantaiList = ref([]);

const formData = reactive({
    id_gedung: "",
    id_lantai: [], // Array untuk multiple selection lantai
});

const errors = reactive({});

// Computed properties
const selectedGedung = computed(() => {
    return gedungList.value.find(gedung => gedung.id_gedung == formData.id_gedung);
});

const isAllSelected = computed(() => {
    return lantaiList.value.length > 0 && formData.id_lantai.length === lantaiList.value.length;
});

const getLantaiName = (lantaiId) => {
    const lantai = lantaiList.value.find(l => l.id_lantai == lantaiId);
    return lantai ? lantai.nama_lantai : 'Unknown';
};

// Toggle Select All Lantai
const toggleSelectAll = (event) => {
    if (event.target.checked) {
        formData.id_lantai = lantaiList.value.map(lantai => lantai.id_lantai);
    } else {
        formData.id_lantai = [];
    }
};

// Axios setup for authentication token
const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

// Fetch Gedung data
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

// Fetch Lantai data
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

// Handle form submission
const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        // Clear errors before validation
        Object.keys(errors).forEach((key) => delete errors[key]);

        // Client-side validation
        if (!formData.id_gedung) {
            errors.id_gedung = ['Gedung harus dipilih'];
            return;
        }

        if (formData.id_lantai.length === 0) {
            errors.id_lantai = ['Minimal satu lantai harus dipilih'];
            return;
        }

        // Submit the data
        const response = await axios.post("/api/gedung-lantai/create", formData);

        toast.success(response.data.message || "Gedung lantai berhasil ditambahkan");
        router.push("/admin-pengelola/gedung-lantai");
    } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 422) {
            if (error.response.data.errors) {
                Object.assign(errors, error.response.data.errors);
                if (error.response.data.message) {
                    toast.error(error.response.data.message);
                }
            }
        } else {
            toast.error("Terjadi kesalahan pada server");
        }
    } finally {
        isSubmitting.value = false;
    }
};

// On mounted lifecycle hook
onMounted(() => {
    fetchGedung();
    fetchLantai();
});
</script>

<style scoped>
/* Custom styles */
</style>
