import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Menyediakan fungsi untuk melihat daftar tugas akhir, detail bimbingan,
 * dan memperbarui status verifikasi bimbingan
 */
export function useDibimbing() {
  const router = useRouter();
  const toast = useToast();
  
  const tugasAkhirList = ref(null);
  const loadingTugasAkhir = ref(false);
  const errorTugasAkhir = ref(null);

  const bimbinganList = ref(null);
  const loadingBimbingan = ref(false);
  const errorBimbingan = ref(null);

  const loadingVerifikasi = ref(false);
  const errorVerifikasi = ref(null);

  const handleError = (err, customErrorState = null) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/login");
    } else {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan";
      
      if (customErrorState) {
        customErrorState.value = errorMessage;
      }
      
      toast.error(errorMessage);
    }
  };

  /**
   * Mengambil semua data tugas akhir yang dibimbing oleh dosen
   */
  const fetchTugasAkhir = async () => {
    loadingTugasAkhir.value = true;
    errorTugasAkhir.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.get("/api/dosen/bimbingan", { headers });
      
      console.log("Tugas Akhir response:", response.data);
      
      tugasAkhirList.value = response.data.data?.data || [];
      return response.data;
    } catch (err) {
      console.error("Error fetching tugas akhir:", err);
      handleError(err, errorTugasAkhir);
      throw err;
    } finally {
      loadingTugasAkhir.value = false;
    }
  };

  /**
   * Mengambil detail bimbingan untuk tugas akhir tertentu
   */
  const fetchBimbingan = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      errorBimbingan.value = "ID Tugas Akhir tidak valid";
      return;
    }
    
    loadingBimbingan.value = true;
    errorBimbingan.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.get(`/api/dosen/bimbingan/${tugasAkhirId}`, { headers });
      
      console.log("Bimbingan response:", response.data);
      
      bimbinganList.value = response.data.data;
      return response.data;
    } catch (err) {
      console.error("Error fetching bimbingan:", err);
      handleError(err, errorBimbingan);
      throw err;
    } finally {
      loadingBimbingan.value = false;
    }
  };

  /**
   * Memperbarui status verifikasi bimbingan
   */
  const updateVerifikasiBimbingan = async (bimbinganId, status) => {
    if (!bimbinganId) {
      errorVerifikasi.value = "ID Bimbingan tidak valid";
      return;
    }
    
    loadingVerifikasi.value = true;
    errorVerifikasi.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.put(
        `/api/dosen/bimbingan/${bimbinganId}`, 
        { status_verifikasi: status },
        { headers }
      );
      
      console.log("Verifikasi response:", response.data);
      
      if (bimbinganList.value && bimbinganList.value.bimbingan) {
        const index = bimbinganList.value.bimbingan.findIndex(item => item.id === bimbinganId);
        if (index !== -1) {
          bimbinganList.value.bimbingan[index].status_verifikasi = status;
        }
      }
      
      toast.success("Status verifikasi berhasil diperbarui");
      
      return response.data;
    } catch (err) {
      console.error("Error updating verification:", err);
      handleError(err, errorVerifikasi);
      throw err;
    } finally {
      loadingVerifikasi.value = false;
    }
  };

  return {
    tugasAkhirList,
    loadingTugasAkhir,
    errorTugasAkhir,
    fetchTugasAkhir,
    
    bimbinganList,
    loadingBimbingan,
    errorBimbingan,
    fetchBimbingan,
    
    loadingVerifikasi,
    errorVerifikasi,
    updateVerifikasiBimbingan
  };
}