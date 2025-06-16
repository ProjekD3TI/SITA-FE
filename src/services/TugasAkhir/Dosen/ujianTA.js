import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Composable untuk mengelola data ujian tugas akhir untuk dosen
 */

const dataBerkasTA = ref(null);

export const fileNaskahTA = computed(() => {
  console.log("Computing fileNaskahTA for Dosen:", dataBerkasTA.value);
  return (
    dataBerkasTA.value?.berkas?.find(
      (berkas) => berkas.nama_berkas === "Naskah Tugas Akhir"
    )?.download_url || ""
  );
});

export async function getFileBlobUrl(downloadUrl) {
  console.log("Fetching PDF blob for URL:", downloadUrl);
  const authToken = VueCookies.get("auth_token");
  const response = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/pdf",
    },
  });
  if (!response.ok) throw new Error("Gagal mengambil file");
  const blob = await response.blob();
  console.log("Blob created successfully:", blob.size, "bytes");
  return URL.createObjectURL(blob);
}

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
  const selectedStatus = ref(""); // Selected status for filtering

  // Status options for filtering
  const statusOptions = ref([
    { value: "0", label: "Menunggu" },
    { value: "1", label: "Selesai" },
  ]);

  // Detail Ujian state
  const detailUjian = ref(null);
  const loadingDetail = ref(false);
  const errorDetail = ref(null);

  // Nilai Ujian state
  const loadingNilai = ref(false);
  const errorNilai = ref(null);
  const success = ref(false);

  // Handle error with toast notification
  const handleError = (err, errorState) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/tugas-akhir/login");
    } else {
      errorState.value = err.response?.data?.message || "Terjadi kesalahan";
      console.error(errorState.value);
    }
  };

  // Fetch UjianTA data
  const fetchUjianTA = async (page = 1, searchTerm = "", status = "") => {
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
      if (status) params.status = status;

      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get(
        `/api/dosen/tugas-akhir/list-ujian-ta?page=${page}`,
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
    fetchUjianTA(page, searchQuery.value, selectedStatus.value);
  };

  // Handle search
  const search = (query) => {
    searchQuery.value = query;
    currentPage.value = 1;
    fetchUjianTA(1, query, selectedStatus.value);
  };

  // Filter by status
  const filterByStatus = (status) => {
    selectedStatus.value = status;
    currentPage.value = 1;
    fetchUjianTA(1, searchQuery.value, status);
  };

  // Fetch detail of a specific UjianTA
  const fetchDetailUjian = async (ujianTaId) => {
    if (!ujianTaId) {
      errorDetail.value = "ID Ujian TA tidak valid";
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

      const timestamp = new Date().getTime();
      const response = await axios.get(
        `/api/dosen/tugas-akhir/detail-ujian-ta/${ujianTaId}?_t=${timestamp}`,
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

  // Submit nilai and status kelulusan in one call
  const submitNilaiDanStatus = async (data, isEdit = false) => {
    loadingNilai.value = true;
    errorNilai.value = null;
    success.value = false;

    const token = VueCookies.get("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      // Create payload with all required fields
      const payload = {
        tugas_akhir_id: detailUjian.value?.tugas_akhir_id,
        ujian_ta_id: data.ujian_ta_id,
        kualitas_tata_laporan: parseFloat(data.tataLaporan),
        kemampuan_teknis: parseFloat(data.kemampuanTeknis),
        kualitas_produk: parseFloat(data.hasilProduk),
        presentasi: parseFloat(data.presentasi),
        rerata_ujian_ta: parseFloat(data.totalNilai),
        revisi: data.catatanRevisi,
      };

      // Add status_kelulusan if provided (for secretary role)
      if (data.statusKelulusan) {
        payload.status_kelulusan = data.statusKelulusan;
      }

      // Make API call to combined endpoint
      const response = await axios.put(
        `/api/dosen/tugas-akhir/submit-nilai-dan-status/${data.tugas_akhir_id}`,
        payload,
        { headers }
      );

      if (response.data.status === "success") {
        success.value = true;
        return response.data;
      } else {
        errorNilai.value = response.data.message || "Gagal menyimpan nilai";
        toast.error(errorNilai.value);
        return null;
      }
    } catch (err) {
      console.error("Error submitting nilai dan status:", err);
      handleError(err, errorNilai);
      return null;
    } finally {
      loadingNilai.value = false;
    }
  };

  onMounted(() => {
    fetchUjianTA();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    ujianTAData,
    pagination,
    loading,
    error,
    currentPage,
    searchQuery,
    selectedStatus,
    fetchUjianTA,
    changePage,
    search,
    filterByStatus,

    // Status options
    statusOptions,

    // From detailUjianTA.js
    detailUjian,
    loadingDetail,
    errorDetail,
    dataBerkasTA,
    fileNaskahTA,
    getFileBlobUrl,
    fetchDetailUjian,
    refreshDetailUjian,

    // Nilai state
    loadingNilai,
    errorNilai,
    success,
    submitNilaiDanStatus,
  };
}
