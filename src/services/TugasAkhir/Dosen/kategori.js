import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Hook untuk mengelola kategori tugas akhir
 * Menyediakan fungsi untuk mengambil daftar kategori yang tersedia
 */
export function useKategori() {
  const router = useRouter();
  const toast = useToast();

  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

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
   * Mengambil daftar kategori tugas akhir dari API
   */
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get("/api/dosen/kategori", { headers });

      categories.value = response.data.data || [];
      return response.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
}
