import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Hook untuk mengelola permintaan bimbingan tugas akhir
 * Menyediakan fungsi untuk mengambil data permintaan dan memperbarui status persetujuan
 */
export function useRequestPembimbing() {
  const router = useRouter();
  const toast = useToast();
  
  const requests = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fungsi untuk menangani error dari API
   * @param {Object} err
   */
  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/login");
    } else {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(error.value);
    }
  };
  
  /**
   * Fungsi untuk mengambil data permintaan bimbingan dari API
   * Mengatur state loading saat proses berlangsung
   * @returns {Promise} - Response data dari API
   */
  const fetchRequests = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await axios.get("/api/dosen/request-pembimbing", { headers });
      
      requests.value = response.data.data?.data || [];
      return response.data;
    } catch (err) {
      console.error("Error fetching requests:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fungsi untuk memperbarui status persetujuan permintaan bimbingan
   * @param {number} id - ID permintaan bimbingan
   * @param {number} status - Status baru (1: diterima, 2: ditolak)
   * @returns {Promise} - Response data dari API
   */
  const updateApproval = async (id, status) => {
    loading.value = true;
    error.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.put(
        `/api/dosen/request-pembimbing/approval/${id}`, 
        { status_request: status },
        { headers }
      );

      const statusText = status === 1 ? "diterima" : "ditolak";
      toast.success(`Permintaan bimbingan berhasil ${statusText}`);
      
      return response.data;
    } catch (err) {
      console.error("Error updating approval:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchRequests();
  });

  return {
    requests,
    loading,
    error,
    fetchRequests,
    updateApproval,
  };
}