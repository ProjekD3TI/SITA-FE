<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Tambah RFID Tag</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kode RFID
                </label>
                <input v-model="formData.rfid_code" type="text"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Masukkan kode RFID" />
                <p v-if="errors.rfid_code" class="text-sm text-red-500">
                    {{ errors.rfid_code[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tipe User
                </label>
                <div class="flex space-x-4">
                    <label class="flex items-center space-x-2">
                        <input type="radio" v-model="userType" value="student" class="text-primary" />
                        <span>Mahasiswa</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="radio" v-model="userType" value="dosen" class="text-primary" />
                        <span>Dosen</span>
                    </label>
                </div>
            </div>

            <!-- Student Selection -->
            <div v-if="userType === 'student'" class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mahasiswa
                </label>
                <select v-model="formData.id_student"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Pilih Mahasiswa</option>
                    <option v-for="student in studentList" :key="student.id" :value="student.id">
                        {{ student.nim }} - {{ student.name }}
                    </option>
                </select>
                <p v-if="errors.id_student" class="text-sm text-red-500">
                    {{ errors.id_student[0] }}
                </p>
            </div>

            <!-- Dosen Selection -->
            <div v-if="userType === 'dosen'" class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Dosen
                </label>
                <select v-model="formData.id_dosen"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Pilih Dosen</option>
                    <option v-for="dosen in dosenList" :key="dosen.id" :value="dosen.id">
                        {{ dosen.nik }} - {{ dosen.name }}
                    </option>
                </select>
                <p v-if="errors.id_dosen" class="text-sm text-red-500">
                    {{ errors.id_dosen[0] }}
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
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const userType = ref("");
const studentList = ref([]);
const dosenList = ref([]);

const formData = reactive({
    rfid_code: "",
    id_student: null,
    id_dosen: null,
});

const errors = reactive({});

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const fetchStudents = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/mahasiswa");
        if (response.data && response.data.data) {
            studentList.value = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Gagal memuat data mahasiswa");
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
        console.error("Error fetching dosen:", error);
        toast.error("Gagal memuat data dosen");
    }
};

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        Object.keys(errors).forEach((key) => delete errors[key]);

        const submitData = {
            rfid_code: formData.rfid_code,
            id_student: userType.value === "student" ? formData.id_student : null,
            id_dosen: userType.value === "dosen" ? formData.id_dosen : null,
        };

        const response = await axios.post(
            "/api/admin_pengelola/rfid_tag/create",
            submitData
        );

        toast.success(response.data.message || "RFID tag berhasil ditambahkan");
        router.push("/admin-pengelola/RFID");
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
            toast.error(error.response?.data?.message || "Gagal menambahkan RFID tag");
        }
    } finally {
        isSubmitting.value = false;
    }
};

// Watch for user type changes to reset form data
watch(userType, (newType) => {
    if (newType === "student") {
        formData.id_dosen = null;
    } else if (newType === "dosen") {
        formData.id_student = null;
    }
});

onMounted(() => {
    fetchStudents();
    fetchDosen();
});
</script>