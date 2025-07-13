<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Tambah Jadwal Tetap</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Ruang
                    </label>
                    <select v-model="formData.id_ruang"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Pilih Ruang</option>
                        <option v-for="ruang in ruangList" :key="ruang.id_ruang" :value="ruang.id_ruang">
                            {{ ruang.display_name || `${ruang.nama_ruang} -- ${ruang.gedung?.nama_gedung || 'N/A'} --
                            ${ruang.gedung?.lantai?.nama_lantai || 'N/A'}` }}
                        </option>
                    </select>

                    <p v-if="errors.id_ruang" class="text-sm text-red-500">
                        {{ errors.id_ruang[0] }}
                    </p>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Kelas
                    </label>
                    <select v-model="formData.id_class"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Pilih Kelas</option>
                        <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
                            {{ kelas.name }}
                        </option>
                    </select>
                    <p v-if="errors.id_class" class="text-sm text-red-500">
                        {{ errors.id_class[0] }}
                    </p>
                </div>
            </div>

            <!-- Rest of the form remains the same -->
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Pemakaian
                </label>
                <input v-model="formData.pemakaian" type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan tujuan pemakaian" />
                <p v-if="errors.pemakaian" class="text-sm text-red-500">
                    {{ errors.pemakaian[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Penanggung Jawab
                </label>
                <select v-model="formData.penanggung_jawab"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Pilih Penanggung Jawab</option>
                    <option v-for="dosen in dosenList" :key="dosen.id" :value="dosen.id">
                        {{ dosen.name }}
                    </option>
                </select>
                <p v-if="errors.penanggung_jawab" class="text-sm text-red-500">
                    {{ errors.penanggung_jawab[0] }}
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Tanggal Mulai
                    </label>
                    <input v-model="formData.start_date" type="date"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <p v-if="errors.start_date" class="text-sm text-red-500">
                        {{ errors.start_date[0] }}
                    </p>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Tanggal Selesai
                    </label>
                    <input v-model="formData.end_date" type="date"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    <p v-if="errors.end_date" class="text-sm text-red-500">
                        {{ errors.end_date[0] }}
                    </p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <label class="text-sm font-medium leading-none">Jadwal Sesi</label>
                    <button type="button" @click="addSession"
                        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Tambah Sesi
                    </button>
                </div>

                <div v-if="formData.sessions.length === 0" class="text-gray-500 text-sm">
                    Belum ada sesi ditambahkan
                </div>

                <div v-for="(session, index) in formData.sessions" :key="index" class="border rounded-lg p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <h4 class="font-medium">Sesi {{ index + 1 }}</h4>
                        <button type="button" @click="removeSession(index)" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Hari</label>
                            <select v-model="session.day_of_week"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Pilih Hari</option>
                                <option value="1">Senin</option>
                                <option value="2">Selasa</option>
                                <option value="3">Rabu</option>
                                <option value="4">Kamis</option>
                                <option value="5">Jumat</option>
                                <option value="6">Sabtu</option>
                                <option value="7">Minggu</option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium">Sesi Waktu</label>
                            <select v-model="session.id_session"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Pilih Sesi</option>
                                <option v-for="sesi in sessionList" :key="sesi.id" :value="sesi.id">
                                    {{ sesi.name_session }} ({{ formatTime(sesi.start_time) }} -
                                    {{ formatTime(sesi.end_time) }})
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <p v-if="errors.sessions" class="text-sm text-red-500">
                    {{ errors.sessions[0] }}
                </p>
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
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const ruangList = ref([]);
const dosenList = ref([]);
const kelasList = ref([]);
const sessionList = ref([]);

const formData = reactive({
    id_ruang: "",
    pemakaian: "",
    id_class: "",
    penanggung_jawab: "",
    start_date: "",
    end_date: "",
    sessions: [],
});

const errors = reactive({});

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

    const fetchRuang = async () => {
        try {
            setupAxios();
            const response = await axios.get("/api/admin_pengelola/ruang");
            if (response.data && response.data.data) {
                ruangList.value = response.data.data;
            }
        } catch (error) {
            console.error("Error fetching ruang:", error);
            toast.error("Gagal memuat data ruang");
        }
    };

const fetchKelas = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/classes");
        if (response.data && response.data.data) {
            kelasList.value = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching kelas:", error);
        toast.error("Gagal memuat data kelas");
    }
};

const fetchDosen = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/dosen");
        if (response.data && response.data.data) {
            dosenList.value = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching kelas:", error);
        toast.error("Gagal memuat data dosen");
    }
};

const fetchSessions = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/session", {
            params: {
                all: 'true'
            }
        });
        if (response.data && response.data.data) {
            sessionList.value = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Gagal memuat data sesi");
    }
};

const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
};

const addSession = () => {
    formData.sessions.push({
        day_of_week: "",
        id_session: "",
    });
};

const removeSession = (index) => {
    formData.sessions.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        Object.keys(errors).forEach((key) => delete errors[key]);

        const response = await axios.post(
            "/api/admin_pengelola/fixed_schedule/create",
            formData
        );

        toast.success(response.data.message || "Jadwal tetap berhasil ditambahkan");
        router.push("/admin-pengelola/jadwal");
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
            toast.error(
                error.response?.data?.message || "Gagal menambahkan jadwal tetap"
            );
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchRuang();
    fetchDosen();
    fetchKelas();
    fetchSessions();
});
</script>