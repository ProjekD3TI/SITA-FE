import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Composable untuk mengelola data ujian tugas akhir untuk dosen
 */
export function useUjianTAForDosen() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();

  // Data UjianTA state
  const ujianTAData = ref([]);
  const pagination = ref({});
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const searchQuery = ref("");
  const selectedSesi = ref(""); // Selected session for filtering

  // Sessions state
  const sessions = ref([]);
  const loadingSessions = ref(false);
  const errorSessions = ref(null);

  // Detail Ujian state (from detailUjianTA.js)
  const detailUjian = ref(null);
  const loadingDetail = ref(false);
  const errorDetail = ref(null);

  // Nilai Ujian state (from nilaiUjianTA.js)
  const loadingNilai = ref(false);
  const errorNilai = ref(null);
  const success = ref(false);

  // Handle error with toast notification
  const handleError = (err, errorState) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/login");
    } else {
      errorState.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorState.value);
    }
  };

  // Fetch sessions data
  const fetchSessions = async () => {
    loadingSessions.value = true;
    errorSessions.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get("/api/dosen/sesi", {
        headers,
        signal,
      });

      // Log the full response to debug
      console.log("Sessions API response:", response.data);

      // Handle different possible response structures
      if (response.data.data?.data) {
        // If data is in nested data.data property (common in Laravel pagination)
        sessions.value = response.data.data.data;
      } else if (response.data.data) {
        // If data is in data property
        sessions.value = response.data.data;
      } else if (Array.isArray(response.data)) {
        // If response is directly the array
        sessions.value = response.data;
      } else {
        console.error(
          "Unexpected sessions API response structure:",
          response.data
        );
        sessions.value = [];
      }

      return response.data;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching sessions:", err);
        errorSessions.value =
          err.response?.data?.message || "Terjadi kesalahan saat memuat sesi";

        handleError(err, errorSessions);
        throw err;
      }
    } finally {
      loadingSessions.value = false;
    }
  };

  // Fetch UjianTA data
  const fetchUjianTA = async (page = 1, searchTerm = "", sesi = "") => {
    loading.value = true;
    error.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (sesi) params.sesi = sesi;

      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get(
        `/api/dosen/list-ujian-ta?page=${page}`,
        {
          headers,
          params,
          signal,
        }
      );

      ujianTAData.value = response.data.data?.data || [];
      pagination.value = response.data.data?.pagination || {};
      currentPage.value = pagination.value.current_page || 1;
      return response.data;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching UjianTA:", err);
        handleError(err, error);
        throw err;
      }
    } finally {
      loading.value = false;
    }
  };

  // Handle pagination change
  const changePage = (page) => {
    currentPage.value = page;
    fetchUjianTA(page, searchQuery.value, selectedSesi.value);
  };

  // Handle search
  const search = (query) => {
    searchQuery.value = query;
    currentPage.value = 1;
    fetchUjianTA(1, query, selectedSesi.value);
  };

  // Filter by session
  const filterBySesi = (sesi) => {
    selectedSesi.value = sesi;
    currentPage.value = 1;
    fetchUjianTA(1, searchQuery.value, sesi);
  };

  // ------ Functions from detailUjianTA.js ------

  // Fetch detail of a specific UjianTA
  const fetchDetailUjian = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      errorDetail.value = "ID Tugas Akhir tidak valid";
      return;
    }

    loadingDetail.value = true;
    errorDetail.value = null;

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
        errorDetail.value =
          response.data.message || "Gagal memuat detail ujian";
        detailUjian.value = null;
        toast.error(errorDetail.value);
      }
    } catch (err) {
      console.error("Error fetching ujian TA detail:", err);
      errorDetail.value =
        err.response?.data?.message || "Terjadi kesalahan saat memuat data";
      detailUjian.value = null;
      handleError(err, errorDetail);
    } finally {
      loadingDetail.value = false;
    }
  };

  // Add a force refresh method
  const refreshDetailUjian = async (tugasAkhirId) => {
    detailUjian.value = null; // Clear existing data first
    return await fetchDetailUjian(tugasAkhirId);
  };

  // ------ Functions from nilaiUjianTA.js ------

  // Submit or update nilai ujian TA
  const submitNilaiUjian = async (data, isEdit = false) => {
    loadingNilai.value = true;
    errorNilai.value = null;
    success.value = false;

    const token = VueCookies.get("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      let response;

      // Create payload - same for both create and update
      const payload = {
        kualitas_tata_laporan: parseFloat(data.tataLaporan),
        kemampuan_teknis: parseFloat(data.kemampuanTeknis),
        kualitas_produk: parseFloat(data.hasilProduk),
        presentasi: parseFloat(data.presentasi),
        rerata_ujian_ta: parseFloat(data.totalNilai),
        revisi: data.catatanRevisi,
      };

      if (isEdit) {
        // Update nilai
        response = await axios.put(
          `/api/dosen/nilai-ujian-ta/${data.tugas_akhir_id}`,
          payload,
          { headers }
        );
      } else {
        // Create nilai
        response = await axios.post(
          `/api/dosen/nilai-ujian-ta/`,
          {
            tugas_akhir_id: data.tugas_akhir_id,
            ...payload,
          },
          { headers }
        );
      }

      if (response.data.status === "success") {
        success.value = true;
        return response.data;
      } else {
        errorNilai.value = response.data.message || "Gagal menyimpan nilai";
        toast.error(errorNilai.value);
        return null;
      }
    } catch (err) {
      console.error("Error submitting ujian TA nilai:", err);
      handleError(err, errorNilai);
      return null;
    } finally {
      loadingNilai.value = false;
    }
  };

  // Update status kelulusan (only for secretary role)
  const updateStatusKelulusan = async (tugasAkhirId, status) => {
    loadingNilai.value = true;
    errorNilai.value = null;

    const token = VueCookies.get("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      const response = await axios.put(
        `/api/dosen/status-kelulusan/${tugasAkhirId}`,
        {
          status_kelulusan: status,
        },
        { headers }
      );

      if (response.data.status === "success") {
        success.value = true;
        return response.data;
      } else {
        errorNilai.value =
          response.data.message || "Gagal mengupdate status kelulusan";
        toast.error(errorNilai.value);
        return null;
      }
    } catch (err) {
      console.error("Error updating status kelulusan:", err);
      handleError(err, errorNilai);
      return null;
    } finally {
      loadingNilai.value = false;
    }
  };

  onMounted(() => {
    fetchUjianTA();
    fetchSessions();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    // Original ujianTA.js exports
    ujianTAData,
    pagination,
    loading,
    error,
    currentPage,
    searchQuery,
    selectedSesi,
    fetchUjianTA,
    changePage,
    search,
    filterBySesi,

    // Session related
    sessions,
    loadingSessions,
    errorSessions,
    fetchSessions,

    // From detailUjianTA.js
    detailUjian,
    loadingDetail,
    errorDetail,
    fetchDetailUjian,
    refreshDetailUjian,

    // From nilaiUjianTA.js
    loadingNilai,
    errorNilai,
    success,
    submitNilaiUjian,
    updateStatusKelulusan,
  };
}
