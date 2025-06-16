<template>
    <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Semester</h2>

        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mahasiswa
                </label>
                <SearchableSelect v-model="formData.id_student" :options="studentList" value-key="id" label-key="name"
                    placeholder="Pilih Mahasiswa" />
                <p v-if="errors.id_student" class="text-sm text-red-500">
                    {{ errors.id_student[0] }}
                </p>
            </div>

            <div class="space-y-2">
                <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kelas
                </label>
                <SearchableSelect v-model="formData.id_class" :options="classList" value-key="id" label-key="name"
                    placeholder="Pilih Kelas" />
                <p v-if="errors.id_class" class="text-sm text-red-500">
                    {{ errors.id_class[0] }}
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
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import SearchableSelect from "../../../../../components/SearchableSelect.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const id = route.params.id;
const isSubmitting = ref(false);
const loading = ref(true);
const studentList = ref([]);
const classList = ref([]);

const formData = reactive({
    id_student: "",
    id_class: "",
});

const errors = reactive({});

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const fetchStudentList = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/mahasiswa");
        studentList.value = response.data.data;
    } catch (error) {
        console.error("Error fetching student list:", error);
        if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else {
            toast.error("Gagal memuat data mahasiswa");
        }
    }
};

const fetchClassList = async () => {
    try {
        setupAxios();
        const response = await axios.get("/api/admin_pengelola/classes");
        classList.value = response.data.data;
    } catch (error) {
        console.error("Error fetching class list:", error);
        if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else {
            toast.error("Gagal memuat data kelas");
        }
    }
};

const fetchSemester = async () => {
    try {
        loading.value = true;
        setupAxios();
        const response = await axios.get(`/api/admin_pengelola/semester/${id}`);
        const semester = response.data.data;

        formData.id_student = semester.id_student || "";
        formData.id_class = semester.id_class || "";
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error("Sesi anda telah berakhir. Silakan login kembali.");
            router.push("/login-admin");
        } else if (error.response?.status === 404) {
            toast.error("Semester tidak ditemukan");
            router.push("/admin-pengelola/semester");
        } else {
            toast.error("Gagal memuat data Semester");
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

        const response = await axios.put(
            `/api/admin_pengelola/semester/update/${id}`,
            {
                id_student: formData.id_student,
                id_class: formData.id_class,
            }
        );

        toast.success(response.data.message || "Semester berhasil diupdate");

        setTimeout(() => {
            router.push(`/admin-pengelola/semester/`);
        }, 500);
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
        } else if (error.response?.status === 404) {
            toast.error("Semester tidak ditemukan");
            router.push("/admin-pengelola/semester");
        } else {
            toast.error(error.response?.data?.message || "Gagal mengupdate Semester");
        }
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    await Promise.all([fetchStudentList(), fetchClassList()]);
    await fetchSemester();
});
</script>
