<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Jadwal Tetap</h2>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="text-gray-500">Memuat data...</div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
                            {{ ruang.nama_ruang }}
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
                    <option v-for="dosen in dosenList" :key="dosen.id" :value="Number(dosen.id)">
                        {{ dosen.name }}
                    </option>
                </select>
                <p v-if="errors.penanggung_jawab" class="text-sm text-red-500">
                    {{ errors.penanggung_jawab[0] }}
                </p>
            </div>
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tahun Ajaran
                </label>
                <select v-model="formData.id_school_year"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Pilih Tahun Ajaran</option>
                    <option v-for="year in schoolYearList" :key="year.id" :value="year.id">
                        {{ year.name }}
                    </option>
                </select>
                <p v-if="errors.id_school_year" class="text-sm text-red-500">
                    {{ errors.id_school_year[0] }}
                </p>
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
                    {{ isSubmitting ? "Menyimpan..." : "Simpan Perubahan" }}
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
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const loading = ref(true);
const isSubmitting = ref(false);
const ruangList = ref([]);
const dosenList = ref([]);
const kelasList = ref([]);
const sessionList = ref([]);
const schoolYearList = ref([]);

const formData = reactive({
    id_ruang: "",
    pemakaian: "",
    id_class: "",
    penanggung_jawab: "",
    id_school_year: "",
    sessions: [],
});

const errors = reactive({});

function setupAxios() {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

async function fetchSchoolYears() {
    try {
        const res = await axios.get("/api/admin_pengelola/school_year");
        schoolYearList.value = res.data.data || [];
    } catch {
        toast.error("Gagal memuat data tahun ajaran");
    }
}

async function fetchRuang() {
    try {
        const res = await axios.get("/api/admin_pengelola/ruang");
        ruangList.value = res.data.data || [];
    } catch {
        toast.error("Gagal memuat data ruang");
    }
}

async function fetchKelas() {
    try {
        const res = await axios.get("/api/admin_pengelola/classes");
        kelasList.value = res.data.data || [];
    } catch {
        toast.error("Gagal memuat data kelas");
    }
}

async function fetchDosen() {
    try {
        const res = await axios.get("/api/admin_pengelola/dosen");
        dosenList.value = res.data.data || [];
    } catch {
        toast.error("Gagal memuat data dosen");
    }
}


async function fetchSessions() {
    try {
        const res = await axios.get("/api/admin_pengelola/session", {
            params: { all: true }
        });
        sessionList.value = res.data.data || [];
    } catch {
        toast.error("Gagal memuat data sesi");
    }
}


async function fetchScheduleDetail() {
    try {
        loading.value = true;
        const res = await axios.get(`/api/admin_pengelola/fixed_schedule/${route.params.id}`);
        const d = res.data.data;
        formData.id_ruang = d.id_ruang;
        formData.pemakaian = d.pemakaian;
        formData.id_class = d.id_class;
        formData.penanggung_jawab = Number(d.penanggung_jawab);
        formData.id_school_year = d.id_school_year; // Add this line
        formData.sessions = d.sessions.map(s => ({
            day_of_week: s.day_of_week,
            id_session: s.id_session,
        }));
    } catch (e) {
        toast.error(e.response?.status === 404 ? "Jadwal tidak ditemukan" : "Gagal muat data");
        router.push("/admin-pengelola/jadwal");
    } finally {
        loading.value = false;
    }
}

function addSession() {
    formData.sessions.push({ day_of_week: "", id_session: "" });
}
function removeSession(i) {
    formData.sessions.splice(i, 1);
}
function formatTime(t) {
    return t?.slice(0, 5) ?? "";
}

async function handleSubmit() {
    try {
        isSubmitting.value = true;
        Object.keys(errors).forEach(k => delete errors[k]);
        const res = await axios.put(
            `/api/admin_pengelola/fixed_schedule/update/${route.params.id}`,
            formData
        );
        toast.success(res.data.message || "Jadwal berhasil diperbarui");
        router.push("/admin-pengelola/jadwal");
    } catch (e) {
        const st = e.response?.status, d = e.response?.data;
        if ([400, 422].includes(st)) {
            if (d.errors) {
                Object.assign(errors, d.errors);
                toast.error(d.message);
            } else if (typeof d === "object") {
                Object.assign(errors, d);
            } else {
                toast.error("Terjadi error validasi");
            }
        } else if (st === 401) {
            toast.error("Sesi habis, silakan login kembali");
            router.push("/login-admin");
        } else toast.error(d?.message || "Gagal update jadwal");
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(async () => {
    setupAxios();
    await Promise.all([
        fetchRuang(),
        fetchKelas(),
        fetchDosen(),
        fetchSessions(),
        fetchSchoolYears(),
        fetchScheduleDetail(),
    ]);
});
</script>
