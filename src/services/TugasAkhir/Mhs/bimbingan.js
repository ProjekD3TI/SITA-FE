import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function mhsBimbingan() {
    const bimbingan = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();
    const toast = useToast();
    
    const getBimbingan = async () => {
        loading.value = true;
        try {
            // Mendapatkan token dari cookie
            const authToken = VueCookies.get("auth_token");
            
            // Mengatur header dengan token
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            
            const response = await axios.get("/api/mahasiswa/bimbingan", { headers });
            bimbingan.value = response.data.data;
        } catch (err) {
            if (err.response?.status === 401) {
                // Token tidak valid atau expired
                toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
                router.push("/mahasiswa/login");
            } else {
                error.value = err.response?.data?.message || "Terjadi kesalahan";
                toast.error(error.value);
            }
        } finally {
            loading.value = false;
        }
    };
    
    onMounted(() => {
        getBimbingan();
    });
    
    return {
        bimbingan,
        loading,
        error,
        getBimbingan, // Mengekspos fungsi ini agar bisa digunakan untuk refresh manual
    };
}