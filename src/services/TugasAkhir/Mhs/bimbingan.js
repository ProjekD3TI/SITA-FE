import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function mhsBimbingan() {
    const router = useRouter();
    const toast = useToast();

    // Definisikan variabel reaktif
    const bimbingan = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const requestStatus = ref(null); // Untuk menyimpan status request pembimbing
    const activeTA = ref(null);

    // Fungsi untuk mendapatkan bimbingan
    const getBimbingan = async () => {
      loading.value = true;
      try {
        const authToken = VueCookies.get("auth_token");
        const headers = {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        
        const response = await axios.get("/api/mahasiswa/bimbingan", { headers });
        bimbingan.value = response.data.data;
      } catch (err) {
        handleError(err);
      } finally {
        loading.value = false;
      }
    };
    
    const checkActiveTA = async () => {
        loading.value = true;
        try {
          const authToken = VueCookies.get("auth_token");
          const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
          
          const response = await axios.get("/api/mahasiswa/tugas-akhir/aktif", { headers });
          activeTA.value = response.data.data;
          return activeTA.value;
        } catch (err) {
          handleError(err);
          return null;
        } finally {
          loading.value = false;
        }
    }

    // Fungsi untuk cek status request pembimbing
    const statusReqPembimbing = async () => {
      loading.value = true;
      try {
        const authToken = VueCookies.get("auth_token");
        const headers = {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        
        const response = await axios.get("/api/mahasiswa/cek-request-pembimbing", { headers });
        requestStatus.value = response.data.data;
        return requestStatus.value;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        loading.value = false;
      }
    };
  
    // Helper untuk error handling
    const handleError = (err) => {
      if (err.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/mahasiswa/login");
      } else {
        error.value = err.response?.data?.message || "Terjadi kesalahan";
        toast.error(error.value);
      }
    };
    
    onMounted(() => {
      getBimbingan();
    });
    
    return {
      bimbingan,
      loading,
      error,
      getBimbingan,
      statusReqPembimbing,
      checkActiveTA,
      requestStatus, 
      activeTA
      // Expose variabel state
    };
  }