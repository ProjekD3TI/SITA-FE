import { ref, onMounted } from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";

export function useRuang() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.get("api/admin_ta/ruang", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      data.value = response.data.data;
      console.log("Fetched ruang data:", response.data.data);
    } catch (err) {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      console.error("Error fetching ruang:", err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  const addRuang = async (payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      console.log("Adding ruang with payload:", payload);
      const response = await axios.post(
        "api/admin_ta/ruang", 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Add ruang response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error adding ruang:", err);
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const editRuang = async (id, payload) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      console.log("Editing ruang with ID:", id, "and payload:", payload);
      const response = await axios.put(
        `api/admin_ta/ruang/${id}`,  // Update to match your backend route
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Edit ruang response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error editing ruang:", err);
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRuang = async (id) => {
    loading.value = true;
    try {
      const token = VueCookies.get("auth_token");
      console.log("Deleting ruang with ID:", id);
      const response = await axios.delete(
        `api/admin_ta/ruang/${id}`,  // Update to match your backend route
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Delete ruang response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error deleting ruang:", err);
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
    addRuang,
    editRuang,
    deleteRuang,
  };
}