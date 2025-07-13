<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Ruang</h2>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nama Ruang -->
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Nama Ruang <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.nama_ruang" type="text"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Masukkan nama ruang" />
                    <p v-if="errors.nama_ruang" class="text-sm text-red-500">
                        {{ errors.nama_ruang[0] }}
                    </p>
                </div>

                <!-- Kapasitas -->
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Kapasitas <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.kapasitas" type="number" min="1"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Masukkan kapasitas ruang" />
                    <p v-if="errors.kapasitas" class="text-sm text-red-500">
                        {{ errors.kapasitas[0] }}
                    </p>
                </div>

                <!-- Gedung -->
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Gedung <span class="text-red-500">*</span>
                    </label>
                    <select v-model="formData.id_gedung" @change="onGedungChange"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Pilih Gedung</option>
                        <option v-for="gedung in gedungList" :key="gedung.id_gedung" :value="gedung.id_gedung">
                            {{ gedung.nama_gedung }}
                        </option>
                    </select>
                    <p v-if="errors.id_gedung" class="text-sm text-red-500">
                        {{ errors.id_gedung[0] }}
                    </p>
                </div>

                <!-- Lantai -->
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Lantai <span class="text-red-500">*</span>
                    </label>
                    <select v-model="formData.id_lantai" :disabled="!formData.id_gedung || loadingLantai"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50">
                        <option value="">{{ loadingLantai ? 'Loading...' : 'Pilih Lantai' }}</option>
                        <option v-for="lantai in lantaiList" :key="lantai.id_lantai" :value="lantai.id_lantai">
                            {{ lantai.nama_lantai }}
                        </option>
                    </select>
                    <p v-if="errors.id_lantai" class="text-sm text-red-500">
                        {{ errors.id_lantai[0] }}
                    </p>
                </div>

                <!-- Dimensi -->
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Dimensi <span class="text-red-500">*</span>
                    </label>
                    <input v-model="formData.dimensi" type="text"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Contoh: 10m x 8m" />
                    <p v-if="errors.dimensi" class="text-sm text-red-500">
                        {{ errors.dimensi[0] }}
                    </p>
                </div>

                <!-- Status
                <!-- <div class="space-y-2">
                    <label class="text-sm font-medium leading-none">
                        Status <span class="text-red-500">*</span>
                    </label>
                    <select v-model="formData.status"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="1">Aktif</option>
                        <option value="0">Tidak Aktif</option>
                    </select>
                    <p v-if="errors.status" class="text-sm text-red-500">
                        {{ errors.status[0] }}
                    </p>
                </div> -->
            </div> 

            <!-- Fasilitas -->
            <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                    Fasilitas <span class="text-red-500">*</span>
                </label>
                <textarea v-model="formData.fasilitas" rows="4"
                    class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Masukkan fasilitas yang tersedia di ruang ini"></textarea>
                <p v-if="errors.fasilitas" class="text-sm text-red-500">
                    {{ errors.fasilitas[0] }}
                </p>
            </div>

            <!-- Current Photos -->
            <div v-if="currentPhotos.length > 0" class="space-y-2">
                <label class="text-sm font-medium leading-none">Foto Saat Ini:</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div v-for="photo in currentPhotos" :key="photo.id" class="relative">
                        <img :src="`http://localhost:8000/storage/ruang/${photo.foto_path}`" :alt="formData.nama_ruang" 
    class="w-full h-24 object-cover rounded-md border">

                    </div>
                </div>
            </div>

            <!-- Upload New Photos -->
            <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                    Ganti Foto Ruang (Opsional)
                </label>
                <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileChange"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                <p class="text-xs text-gray-500">Upload foto baru untuk mengganti foto yang ada (JPG, PNG, GIF, SVG)</p>
                <p v-if="errors.foto_ruang" class="text-sm text-red-500">
                    {{ errors.foto_ruang[0] }}
                </p>

                <!-- Preview New Images -->
                <div v-if="previewImages.length > 0" class="space-y-2">
                    <label class="text-sm font-medium text-blue-600">Preview Foto Baru:</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="(image, index) in previewImages" :key="index" class="relative">
                            <img :src="image" :alt="`Preview ${index + 1}`" 
                                class="w-full h-24 object-cover rounded-md border border-blue-300">
                            <button type="button" @click="removeImage(index)"
                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preview Changes -->
            <div v-if="originalData.nama_ruang" class="space-y-3">
                <!-- Current Data -->
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Data Saat Ini:</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Nama:</strong> {{ originalData.nama_ruang }}</div>
                        <div><strong>Kapasitas:</strong> {{ originalData.kapasitas }} orang</div>
                        <div><strong>Gedung:</strong> {{ originalData.gedung?.nama_gedung || '-' }}</div>
                        <div><strong>Lantai:</strong> {{ originalData.lantai?.nama_lantai || '-' }}</div>
                        <div><strong>Dimensi:</strong> {{ originalData.dimensi }}</div>
                        <!-- <div><strong>Status:</strong> {{ originalData.status == 1 ? 'Aktif' : 'Tidak Aktif' }}</div> -->
                        <div class="col-span-2"><strong>Fasilitas:</strong> {{ originalData.fasilitas }}</div>
                    </div>
                </div>

                <!-- New Preview -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-900 mb-2">Preview Perubahan:</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Nama:</strong> {{ formData.nama_ruang || 'Belum diisi' }}</div>
                        <div><strong>Kapasitas:</strong> {{ formData.kapasitas || 'Belum diisi' }} orang</div>
                        <div><strong>Gedung:</strong> {{ getGedungName() || 'Belum dipilih' }}</div>
                        <div><strong>Lantai:</strong> {{ getLantaiName() || 'Belum dipilih' }}</div>
                        <div><strong>Dimensi:</strong> {{ formData.dimensi || 'Belum diisi' }}</div>
                        <!-- <div><strong>Status:</strong> {{ formData.status == 1 ? 'Aktif' : 'Tidak Aktif' }}</div> -->
                        <div class="col-span-2"><strong>Fasilitas:</strong> {{ formData.fasilitas || 'Belum diisi' }}</div>
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
const fileInput = ref(null);
const isSubmitting = ref(false);
const loading = ref(true);
const loadingLantai = ref(false);
const gedungList = ref([]);
const lantaiList = ref([]);
const currentPhotos = ref([]);
const previewImages = ref([]);
const selectedFiles = ref([]);

const formData = reactive({
    nama_ruang: "",
    kapasitas: "",
    fasilitas: "",
    dimensi: "",
    id_gedung: "",
    id_lantai: "",
    // status: 1,
});

const originalData = reactive({
    nama_ruang: "",
    kapasitas: "",
    fasilitas: "",
    dimensi: "",
    // status: 1,
    gedung: null,
    lantai: null,
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
        gedungList.value = response.data.data || [];
    } catch (error) {
        toast.error("Gagal memuat data gedung");
    }
};

const fetchLantaiByGedung = async (id_gedung) => {
    try {
        loadingLantai.value = true;
        setupAxios();
        const response = await axios.get(`/api/lantai/by-gedung/${id_gedung}`);
        lantaiList.value = response.data.data || [];
    } catch (error) {
        toast.error("Gagal memuat data lantai");
        lantaiList.value = [];
    } finally {
        loadingLantai.value = false;
    }
};

const fetchRuang = async () => {
    try {
        loading.value = true;
        setupAxios();

        const response = await axios.get(`/api/admin_pengelola/ruang/${id}`);
        const ruang = response.data.data;

        // Store original data for display
        Object.assign(originalData, {
            nama_ruang: ruang.nama_ruang || "",
            kapasitas: ruang.kapasitas || "",
            fasilitas: ruang.fasilitas || "",
            dimensi: ruang.dimensi || "",
            // status: ruang.status || 1,
            gedung: ruang.gedung,
            lantai: ruang.lantai,
        });

        // Set form data
        formData.nama_ruang = ruang.nama_ruang || "";
        formData.kapasitas = ruang.kapasitas || "";
        formData.fasilitas = ruang.fasilitas || "";
        formData.dimensi = ruang.dimensi || "";
        formData.id_gedung = ruang.id_gedung || "";
        formData.id_lantai = ruang.id_lantai || "";
        // formData.status = ruang.status || 1;

        // Set current photos
        currentPhotos.value = response.data.photos || [];

        // Load lantai for selected gedung
        if (formData.id_gedung) {
            await fetchLantaiByGedung(formData.id_gedung);
        }
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

const onGedungChange = () => {
    formData.id_lantai = "";
    lantaiList.value = [];
    if (formData.id_gedung) {
        fetchLantaiByGedung(formData.id_gedung);
    }
};

const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    selectedFiles.value = files;
    
    // Create preview images
    previewImages.value = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImages.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });
};

const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    selectedFiles.value.splice(index, 1);
    
    // Update file input
    const dt = new DataTransfer();
    selectedFiles.value.forEach(file => dt.items.add(file));
    fileInput.value.files = dt.files;
};

const getGedungName = () => {
    const gedung = gedungList.value.find(g => g.id_gedung == formData.id_gedung);
    return gedung ? gedung.nama_gedung : '';
};

const getLantaiName = () => {
    const lantai = lantaiList.value.find(l => l.id_lantai == formData.id_lantai);
    return lantai ? lantai.nama_lantai : '';
};

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        Object.keys(errors).forEach((key) => delete errors[key]);

        const formDataToSend = new FormData();
        formDataToSend.append('nama_ruang', formData.nama_ruang);
        formDataToSend.append('kapasitas', formData.kapasitas);
        formDataToSend.append('fasilitas', formData.fasilitas);
        formDataToSend.append('dimensi', formData.dimensi);
        formDataToSend.append('id_gedung', formData.id_gedung);
        formDataToSend.append('id_lantai', formData.id_lantai);
        // formDataToSend.append('status', formData.status);
        formDataToSend.append('_method', 'PUT');

        // Append files if any
        selectedFiles.value.forEach((file, index) => {
            formDataToSend.append(`foto_ruang[${index}]`, file);
        });

        const response = await axios.post(
            `/api/admin_pengelola/ruang/edit/${id}`,
            formDataToSend,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "X-HTTP-Method-Override": "PUT",
                }
            }
        );

        toast.success(response.data.message || "Ruang berhasil diupdate");
        setTimeout(() => {
            router.push(`/admin-pengelola/ruang/`);
        }, 500);
    } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 422) {
            if (error.response.data.errors) {
                Object.assign(errors, error.response.data.errors);
            } else if (typeof error.response.data === "object") {
                Object.assign(errors, error.response.data);
            }
            toast.error(error.response.data.message || "Validasi gagal");
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

onMounted(async () => {
    await fetchGedungList();
    await fetchRuang();
});
</script>
