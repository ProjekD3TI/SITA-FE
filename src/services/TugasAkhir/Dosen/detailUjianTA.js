import { ref, onMounted } from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";

export const useDetailUjianTA = () => {
  const detailUjian = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const toast = useToast();

  const fetchDetailUjian = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const response = await axios.get(
        `/api/dosen/detail-ujian-ta/${tugasAkhirId}?_t=${timestamp}`,
        { headers }
      );

      if (response.data.status === "success" && response.data.data) {
        detailUjian.value = response.data.data;
      } else {
        error.value = response.data.message || "Gagal memuat detail ujian";
        detailUjian.value = null;
        toast.error(error.value);
      }
    } catch (err) {
      console.error("Error fetching ujian TA detail:", err);
      error.value =
        err.response?.data?.message || "Terjadi kesalahan saat memuat data";
      detailUjian.value = null;
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Add a force refresh method
  const refreshDetailUjian = async (tugasAkhirId) => {
    detailUjian.value = null; // Clear existing data first
    return await fetchDetailUjian(tugasAkhirId);
  };

  return {
    detailUjian,
    loading,
    error,
    fetchDetailUjian,
    refreshDetailUjian,
  };
};
