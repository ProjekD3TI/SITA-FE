import { ref, onMounted } from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";

export function useSesi() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.get("api/admin_ta/sesi", {
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

  const addSesi = async (payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.post(
        "api/admin_ta/sesi",
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

  const editSesi = async (id, payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.put(
        `api/admin_ta/sesi/${id}`,
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

  const deleteSesi = async (id) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.delete(
        `api/admin_ta/sesi/${id}`,
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

  return {
    data,
    loading,
    error,
    fetchData,
    addSesi,
    editSesi,
    deleteSesi,
  };
}