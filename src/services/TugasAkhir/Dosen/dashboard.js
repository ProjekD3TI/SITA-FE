import { ref, onMounted } from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";

export function useDashboard() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const fetchData = async () => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.get("api/dosen/tugas-akhir/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      data.value = response.data.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
    } finally {
      loading.value = false;
    }
    
   
    };
    onMounted(() => {
      fetchData();
    });
    return {
      data,
      loading,
      error,
      fetchData,
    };
}
