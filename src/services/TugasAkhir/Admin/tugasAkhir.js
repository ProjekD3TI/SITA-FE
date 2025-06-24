import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelTugasAkhir() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelTugasAkhir = ref([]);
  const loadingTabelTugasAkhir = ref(false);
  const errorTabelTugasAkhir = ref(null);
  const paginationTabelTugasAkhir = ref({});

  const fetchTabelTugasAkhir = async (
    page = 1,
    search = "",
    status = "",
    tahunAjaranId = ""
  ) => {
    loadingTabelTugasAkhir.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.status_aktif = status;
      if (tahunAjaranId) params.tahun_ajaran_id = tahunAjaranId;
      const response = await axios.get(
        `/api/admin_ta/tugas-akhir?page=${page}`,
        {
          headers,
          params,
        }
      );
      dataTabelTugasAkhir.value = response.data.data;
      paginationTabelTugasAkhir.value = response.data.data.pagination;
    } catch (error) {
      handleError(error);
    } finally {
      loadingTabelTugasAkhir.value = false;
    }
  };

  // UPDATE (PUT) plotting penguji
  const updateStatusTugasAkhir = async (id, status_aktif) => {
    loadingTabelTugasAkhir.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const data = { status_aktif };
      const response = await axios.put(
        `/api/admin_ta/tugas-akhir/${id}/update-active-status`,
        data,
        { headers }
      );
      toast.success(response.data.message);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingTabelTugasAkhir.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelTugasAkhir.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelTugasAkhir.value);
    }
  };

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelTugasAkhir,
    loadingTabelTugasAkhir,
    errorTabelTugasAkhir,
    paginationTabelTugasAkhir,
    updateStatusTugasAkhir,
    fetchTabelTugasAkhir,
  };
}
