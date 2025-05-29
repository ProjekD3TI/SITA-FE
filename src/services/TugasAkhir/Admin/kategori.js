import { ref, onMounted } from "vue";
// import VueCookies dan axios jika belum
import VueCookies from "vue-cookies";
import axios from "axios";

export function useKategori() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const fetchData = async () => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.get("api/admin_ta/kategori", {
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
  const addKategori = async (payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.post(
        "api/admin_ta/tambah-kategori",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const editKategori = async (id, payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.put(
        `api/admin_ta/edit-kategori/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return {
    data,
    loading,
    error,
    fetchData,
    addKategori,
    editKategori,
  };
}
