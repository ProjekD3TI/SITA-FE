import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Hook untuk mengelola permintaan bimbingan tugas akhir
 * Menyediakan fungsi untuk mengambil data permintaan dan memperbarui status persetujuan
 */
export function useRequestPembimbing() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();

  const requests = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({});
  const currentPage = ref(1);
  const searchQuery = ref("");
  const selectedKategori = ref("");

  /**
   * Fungsi untuk menangani error dari API
   * @param {Object} err
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
   * Fungsi untuk mengambil data permintaan bimbingan dari API
   * Mengatur state loading saat proses berlangsung
   * @returns {Promise} - Response data dari API
   */
  const fetchRequests = async (page = 1, search = "", kategori = "") => {
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
      if (search) params.search = search;
      if (kategori) params.kategori = kategori;

      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get(
        `/api/dosen/request-pembimbing?page=${page}`,
        { headers, params, signal }
      );

      requests.value = response.data.data?.data || [];
      pagination.value = response.data.data?.pagination || {};
      currentPage.value = pagination.value.current_page || 1;

      return response.data;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching requests:", err);
        handleError(err);
        throw err;
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fungsi untuk memperbarui status persetujuan permintaan bimbingan
   * @param {number} id - ID permintaan bimbingan
   * @param {number} status - Status baru (1: diterima, 2: ditolak)
   * @returns {Promise} - Response data dari API
   */
  const updateApproval = async (id, status) => {
    loading.value = true;
    error.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.put(
        `/api/dosen/request-pembimbing/approval/${id}`,
        { status_request: status },
        { headers }
      );

      const statusText = status === 1 ? "diterima" : "ditolak";
      toast.success(`Permintaan bimbingan berhasil ${statusText}`);

      return response.data;
    } catch (err) {
      console.error("Error updating approval:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi untuk mengganti halaman
  const changePage = (page) => {
    currentPage.value = page;
    fetchRequests(page, searchQuery.value, selectedKategori.value);
  };

  // Fungsi untuk pencarian
  const search = (query) => {
    searchQuery.value = query;
    fetchRequests(1, query, selectedKategori.value);
  };

  // Fungsi untuk filter berdasarkan kategori
  const filterByKategori = (kategori) => {
    selectedKategori.value = kategori;
    fetchRequests(1, searchQuery.value, kategori);
  };

  onMounted(() => {
    fetchRequests();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    requests,
    pagination,
    loading,
    error,
    currentPage,
    searchQuery,
    selectedKategori,
    fetchRequests,
    updateApproval,
    changePage,
    search,
    filterByKategori,
  };
}

/**
 * Hook untuk mengelola nilai bimbingan tugas akhir
 * Menyediakan fungsi untuk mengambil, membuat, memperbarui, dan menyimpan nilai bimbingan
 */
export function useNilaiBimbingan() {
  const router = useRouter();
  const toast = useToast();

  const nilaiBimbingan = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

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
   * Mengambil data nilai bimbingan dari API
   */
  const fetchNilaiBimbingan = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/dosen/nilai-bimbingan/${tugasAkhirId}`,
        { headers }
      );

      nilaiBimbingan.value = response.data.data;
      return response.data;
    } catch (err) {
      console.error("Error fetching nilai bimbingan:", err);

      if (err.response?.status === 404) {
        nilaiBimbingan.value = null;
        return null;
      }

      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Membuat nilai bimbingan baru
   */
  const createNilaiBimbingan = async (tugasAkhirId, data) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.post(
        `/api/dosen/nilai-bimbingan/${tugasAkhirId}`,
        data,
        { headers }
      );

      nilaiBimbingan.value = response.data.data;
      success.value = "Nilai bimbingan berhasil disimpan";
      toast.success("Nilai bimbingan berhasil disimpan");

      return response.data;
    } catch (err) {
      console.error("Error creating nilai bimbingan:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Memperbarui nilai bimbingan yang sudah ada
   */
  const updateNilaiBimbingan = async (tugasAkhirId, data) => {
    if (!tugasAkhirId) {
      error.value = "ID Tugas Akhir tidak valid";
      return null;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.put(
        `/api/dosen/nilai-bimbingan/${tugasAkhirId}/update`,
        data,
        { headers }
      );

      nilaiBimbingan.value = response.data.data;
      success.value = "Nilai bimbingan berhasil diperbarui";
      toast.success("Nilai bimbingan berhasil diperbarui");

      return response.data;
    } catch (err) {
      console.error("Error updating nilai bimbingan:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Menyimpan nilai (membuat baru atau memperbarui yang sudah ada)
   */
  const saveNilaiBimbingan = async (tugasAkhirId, data) => {
    try {
      const existingData = await fetchNilaiBimbingan(tugasAkhirId);

      if (existingData && existingData.data) {
        return await updateNilaiBimbingan(tugasAkhirId, data);
      } else {
        return await createNilaiBimbingan(tugasAkhirId, data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        return await createNilaiBimbingan(tugasAkhirId, data);
      }
      throw err;
    }
  };

  return {
    nilaiBimbingan,
    loading,
    error,
    success,
    fetchNilaiBimbingan,
    createNilaiBimbingan,
    updateNilaiBimbingan,
    saveNilaiBimbingan,
  };
}

/**
 * Menyediakan fungsi untuk melihat daftar tugas akhir, detail bimbingan,
 * dan memperbarui status verifikasi bimbingan
 */
export function useDibimbing() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();

  const tugasAkhirList = ref(null);
  const pagination = ref({});
  const loadingTugasAkhir = ref(false);
  const errorTugasAkhir = ref(null);
  const currentPage = ref(1);
  const searchQuery = ref("");
  const selectedKategori = ref("");

  const bimbinganList = ref(null);
  const loadingBimbingan = ref(false);
  const errorBimbingan = ref(null);

  const loadingVerifikasi = ref(false);
  const errorVerifikasi = ref(null);

  const handleError = (err, customErrorState = null) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/login");
    } else {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan";

      if (customErrorState) {
        customErrorState.value = errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  /**
   * Mengambil semua data tugas akhir yang dibimbing oleh dosen
   */
  const fetchTugasAkhir = async (page = 1, search = "", kategori = "") => {
    loadingTugasAkhir.value = true;
    errorTugasAkhir.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const params = {};
      if (search) params.search = search;
      if (kategori) params.kategori = kategori;

      const response = await axios.get(`/api/dosen/bimbingan?page=${page}`, {
        headers,
        params,
      });

      console.log("Tugas Akhir response:", response.data);

      tugasAkhirList.value = response.data.data?.data || [];
      pagination.value = response.data.data?.pagination || {};
      currentPage.value = pagination.value.current_page || 1;
      return response.data;
    } catch (err) {
      console.error("Error fetching tugas akhir:", err);
      handleError(err, errorTugasAkhir);
      throw err;
    } finally {
      loadingTugasAkhir.value = false;
    }
  };

  /**
   * Mengambil detail bimbingan untuk tugas akhir tertentu
   */
  const fetchBimbingan = async (tugasAkhirId) => {
    if (!tugasAkhirId) {
      errorBimbingan.value = "ID Tugas Akhir tidak valid";
      return;
    }

    loadingBimbingan.value = true;
    errorBimbingan.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(`/api/dosen/bimbingan/${tugasAkhirId}`, {
        headers,
      });

      console.log("Bimbingan response:", response.data);

      // Tambahkan debugging detail untuk data bimbingan
      if (
        response.data.data?.bimbingan &&
        response.data.data.bimbingan.length > 0
      ) {
        console.log("First bimbingan item details:", {
          id: response.data.data.bimbingan[0].id,
          tanggal_bimbingan: response.data.data.bimbingan[0].tanggal_bimbingan,
          created_at: response.data.data.bimbingan[0].created_at,
          updated_at: response.data.data.bimbingan[0].updated_at,
        });
      }

      bimbinganList.value = response.data.data;
      return response.data;
    } catch (err) {
      console.error("Error fetching bimbingan:", err);
      handleError(err, errorBimbingan);
      throw err;
    } finally {
      loadingBimbingan.value = false;
    }
  };

  /**
   * Memperbarui status verifikasi bimbingan
   */
  const updateVerifikasiBimbingan = async (bimbinganId, status) => {
    if (!bimbinganId) {
      errorVerifikasi.value = "ID Bimbingan tidak valid";
      return;
    }

    loadingVerifikasi.value = true;
    errorVerifikasi.value = null;

    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.put(
        `/api/dosen/bimbingan/${bimbinganId}`,
        { status_verifikasi: status },
        { headers }
      );

      console.log("Verifikasi response:", response.data);

      if (bimbinganList.value && bimbinganList.value.bimbingan) {
        const index = bimbinganList.value.bimbingan.findIndex(
          (item) => item.id === bimbinganId
        );
        if (index !== -1) {
          bimbinganList.value.bimbingan[index].status_verifikasi = status;
        }
      }

      toast.success("Status verifikasi berhasil diperbarui");

      return response.data;
    } catch (err) {
      console.error("Error updating verification:", err);
      handleError(err, errorVerifikasi);
      throw err;
    } finally {
      loadingVerifikasi.value = false;
    }
  };

  // Fungsi untuk mengganti halaman
  const changePage = (page) => {
    currentPage.value = page;
    fetchTugasAkhir(page, searchQuery.value, selectedKategori.value);
  };

  // Fungsi untuk pencarian
  const search = (query) => {
    searchQuery.value = query;
    fetchTugasAkhir(1, query, selectedKategori.value);
  };

  // Fungsi untuk filter berdasarkan kategori
  const filterByKategori = (kategori) => {
    selectedKategori.value = kategori;
    fetchTugasAkhir(1, searchQuery.value, kategori);
  };

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    tugasAkhirList,
    pagination,
    loadingTugasAkhir,
    errorTugasAkhir,
    currentPage,
    searchQuery,
    selectedKategori,
    fetchTugasAkhir,
    changePage,
    search,
    filterByKategori,

    bimbinganList,
    loadingBimbingan,
    errorBimbingan,
    fetchBimbingan,

    loadingVerifikasi,
    errorVerifikasi,
    updateVerifikasiBimbingan,
  };
}

/**
 * Hook untuk mengelola data kategori tugas akhir
 */
export function useKategori() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();

  const categories = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fungsi untuk mengambil daftar kategori tugas akhir
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

      abortController = new AbortController();
      const signal = abortController.signal;

      const response = await axios.get("/api/dosen/kategori", {
        headers,
        signal,
      });

      categories.value = response.data.data?.data || [];
      return response.data;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching categories:", err);
        error.value =
          err.response?.data?.message ||
          "Terjadi kesalahan saat memuat kategori";

        if (err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          router.push("/dosen/login");
        } else {
          toast.error(error.value);
        }

        throw err;
      }
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCategories();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
}
