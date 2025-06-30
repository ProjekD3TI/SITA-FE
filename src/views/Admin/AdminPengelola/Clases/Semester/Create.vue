<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Tambah Mahasiswa</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kelas
                </label>
                <select v-model="formData.id_class"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Pilih Kelas</option>
                    <option v-for="kelas in classList" :key="kelas.id" :value="kelas.id">
                        {{ kelas.name }}
                    </option>
                </select>
                <p v-if="errors.id_class" class="text-sm text-red-500">
                    {{ errors.id_class[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mode Input
                </label>
                <div class="flex space-x-4">
                    <label class="flex items-center space-x-2">
                        <input type="radio" v-model="inputMode" value="single" class="text-primary" />
                        <span>Satu Mahasiswa</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="radio" v-model="inputMode" value="bulk" class="text-primary" />
                        <span>Banyak Mahasiswa</span>
                    </label>
                </div>
            </div>

            <!-- Single Student Selection -->
            <div v-if="inputMode === 'single'" class="space-y-2">
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

            <!-- Multiple Students Selection -->
            <div v-if="inputMode === 'bulk'" class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mahasiswa (Pilih beberapa)
                </label>
                <div class="border rounded-md p-3 max-h-60 overflow-y-auto">
                    <div class="space-y-2">
                        <label v-for="student in studentList" :key="student.id" class="flex items-center space-x-2">
                            <input type="checkbox" :value="student.id" v-model="formData.id_student"
                                class="text-primary" />
                            <span>{{ student.nim }} - {{ student.name }}</span>
                        </label>
                    </div>
                </div>
                <p v-if="errors.id_student" class="text-sm text-red-500">
                    {{ errors.id_student[0] }}
                </p>
                <p class="text-sm text-gray-500">
                    {{ formData.id_student?.length || 0 }} mahasiswa dipilih
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
const inputMode = ref("single");
const classList = ref([]);
const studentList = ref([]);

const formData = reactive({
    id_class: "",
    id_student: null,
});

const errors = reactive({});

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const fetchClasses = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/classes");
        if (response.data && response.data.data) {
            classList.value = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Gagal memuat data kelas");
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

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        Object.keys(errors).forEach((key) => delete errors[key]);

        const submitData = {
            id_class: formData.id_class,
            id_student: inputMode.value === "bulk" ? formData.id_student : formData.id_student,
        };

        const response = await axios.post(
            "/api/admin_pengelola/semester/create",
            submitData
        );

        toast.success(response.data.message || "Semester berhasil ditambahkan");
        router.push("/admin-pengelola/semester");
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
        } else if (error.response?.status === 409) {
            toast.error(error.response.data.message || "Data sudah ada");
        } else {
            toast.error(error.response?.data?.message || "Gagal menambahkan semester");
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchClasses();
    fetchStudents();

    // Initialize id_student based on mode
    if (inputMode.value === "bulk") {
        formData.id_student = [];
    } else {
        formData.id_student = "";
    }
});

// Watch for input mode changes
import { watch } from "vue";
watch(inputMode, (newMode) => {
    if (newMode === "bulk") {
        formData.id_student = [];
    } else {
        formData.id_student = "";
    }
});
</script>