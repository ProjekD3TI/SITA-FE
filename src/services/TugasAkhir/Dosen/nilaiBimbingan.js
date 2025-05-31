import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Hook untuk mengelola nilai bimbingan tugas akhir
 * Menyediakan fungsi untuk mengambil, membuat, memperbarui, dan menyimpan nilai bimbingan
 */
export function useNilaiBimbingan() {
  const router = useRouter();
  const toast = useToast();
  
  const nilaiBimbingan = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

  /**
   * Fungsi untuk menangani error dari API
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
   * Mengambil data nilai bimbingan dari API
   */
  const fetchNilaiBimbingan = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.get(`/api/dosen/nilai-bimbingan/${tugasAkhirId}`, { headers });
      
      nilaiBimbingan.value = response.data.data;
      return response.data;
    } catch (err) {
      console.error("Error fetching nilai bimbingan:", err);
      
      if (err.response?.status === 404) {
        nilaiBimbingan.value = null;
        return null;
      }
      
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Membuat nilai bimbingan baru
   */
  const createNilaiBimbingan = async (tugasAkhirId, data) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.post(
        `/api/dosen/nilai-bimbingan/${tugasAkhirId}`, 
        data,
        { headers }
      );
      
      nilaiBimbingan.value = response.data.data;
      success.value = "Nilai bimbingan berhasil disimpan";
      toast.success("Nilai bimbingan berhasil disimpan");
      
      return response.data;
    } catch (err) {
      console.error("Error creating nilai bimbingan:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Memperbarui nilai bimbingan yang sudah ada
   */
  const updateNilaiBimbingan = async (tugasAkhirId, data) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      const response = await axios.put(
        `/api/dosen/nilai-bimbingan/${tugasAkhirId}`, 
        data,
        { headers }
      );
      
      nilaiBimbingan.value = response.data.data;
      success.value = "Nilai bimbingan berhasil diperbarui";
      toast.success("Nilai bimbingan berhasil diperbarui");
      
      return response.data;
    } catch (err) {
      console.error("Error updating nilai bimbingan:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Menyimpan nilai (membuat baru atau memperbarui yang sudah ada)
   */
  const saveNilaiBimbingan = async (tugasAkhirId, data) => {
    try {
      const existingData = await fetchNilaiBimbingan(tugasAkhirId);
      
      if (existingData && existingData.data) {
        return await updateNilaiBimbingan(tugasAkhirId, data);
      } else {
        return await createNilaiBimbingan(tugasAkhirId, data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        return await createNilaiBimbingan(tugasAkhirId, data);
      }
      throw err;
    }
  };

  return {
    nilaiBimbingan,
    loading,
    error,
    success,
    fetchNilaiBimbingan,
    createNilaiBimbingan,
    updateNilaiBimbingan,
    saveNilaiBimbingan
  };
}