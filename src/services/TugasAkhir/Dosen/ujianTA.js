import { ref, onMounted } from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";

export function useUjianTAForDosen() {
  const ujianTAData = ref([]);
  const pagination = ref({});
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);

  const fetchUjianTA = async (page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const token = VueCookies.get("auth_token");
      const response = await axios.get(
        `/api/dosen/list-ujian-ta?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      ujianTAData.value = response.data.data.data;
      pagination.value = response.data.data.pagination;
      currentPage.value = pagination.value.current_page;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Error fetching Ujian TA data";
      console.error("Error fetching Ujian TA data:", err);
    } finally {
      loading.value = false;
    }
  };

  const changePage = (page) => {
    currentPage.value = page;
    fetchUjianTA(page);
  };

  onMounted(() => {
    fetchUjianTA();
  });

  return {
    ujianTAData,
    pagination,
    loading,
    error,
    currentPage,
    fetchUjianTA,
    changePage,
  };
}
