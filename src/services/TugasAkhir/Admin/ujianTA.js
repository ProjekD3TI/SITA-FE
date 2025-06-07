import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelPlottingPenguji() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelPlottingPenguji = ref([]);
  const paginationTabelPlottingPenguji = ref({});
  const loadingTabelPlottingPenguji = ref(false);
  const errorTabelPlottingPenguji = ref(null);

  const fetchTabelPlottingPenguji = async (
    page = 1,
    search = "",
    status = ""
  ) => {
    loadingTabelPlottingPenguji.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const response = await axios.get(
        `/api/admin_ta/plotting-penguji?page=${page}`,
        { headers, params }
      );
      dataTabelPlottingPenguji.value = response.data.data.data;
      paginationTabelPlottingPenguji.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelPlottingPenguji.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelPlottingPenguji.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelPlottingPenguji.value);
    }
  };

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelPlottingPenguji,
    loadingTabelPlottingPenguji,
    errorTabelPlottingPenguji,
    paginationTabelPlottingPenguji,
    fetchTabelPlottingPenguji,
  };
}

export function useShowPlottingPenguji() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataShowPlottingPenguji = ref({});
  const loadingShowPlottingPenguji = ref(false);
  const errorShowPlottingPenguji = ref(null);

  const fetchShowPlottingPenguji = async (id) => {
    loadingShowPlottingPenguji.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`/api/admin_ta/plotting-penguji/${id}`, {
        headers,
      });
      dataShowPlottingPenguji.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingShowPlottingPenguji.value = false;
    }
  };

  // SUBMIT (POST) plotting penguji
  const submitPlottingPenguji = async (data) => {
    loadingShowPlottingPenguji.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.post(`/api/admin_ta/dosen-penguji/`, data, {
        headers,
      });
      toast.success(
        response.data.message ||
          "Berhasil menambahkan dosen penguji tugas akhir!"
      );
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingShowPlottingPenguji.value = false;
    }
  };

  // UPDATE (PUT) plotting penguji
  const updatePlottingPenguji = async (tugasAkhirId, data) => {
    loadingShowPlottingPenguji.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.put(
        `/api/admin_ta/dosen-penguji/${tugasAkhirId}`,
        data,
        { headers }
      );
      toast.success(
        response.data.message || "Berhasil mengubah dosen penguji tugas akhir!"
      );
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingShowPlottingPenguji.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorShowPlottingPenguji.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorShowPlottingPenguji.value);
    }
  };

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataShowPlottingPenguji,
    loadingShowPlottingPenguji,
    errorShowPlottingPenguji,
    fetchShowPlottingPenguji,
    submitPlottingPenguji,
    updatePlottingPenguji,
  };
}

export function useTabelPendaftar() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelPendaftar = ref([]);
  const paginationTabelPendaftar = ref({});
  const loadingTabelPendaftar = ref(false);
  const errorTabelPendaftar = ref(null);

  const fetchTabelPendaftar = async (page = 1, search = "", status = "") => {
    loadingTabelPendaftar.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const response = await axios.get(
        `/api/admin_ta/pendaftar-ujian?page=${page}`,
        { headers, params }
      );
      dataTabelPendaftar.value = response.data.data;
      paginationTabelPendaftar.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelPendaftar.value = false;
    }
  };

  const updateStatusForm = async (isOpen) => {
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        is_open: isOpen, // pastikan boolean (0/1)
      };
      await axios.put(`/api/admin_ta/status-form/2`, formData, { headers });
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelPendaftar.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelPendaftar.value);
    }
  };

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelPendaftar,
    loadingTabelPendaftar,
    errorTabelPendaftar,
    paginationTabelPendaftar,
    updateStatusForm,
    fetchTabelPendaftar,
  };
}

export function useShowPendaftar() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataShowPendaftar = ref({});
  const loadingShowPendaftar = ref(false);
  const errorShowPendaftar = ref(null);
  const fetchShowPendaftar = async (id) => {
    loadingShowPendaftar.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`/api/admin_ta/pendaftar-ujian/${id}`, {
        headers,
      });
      dataShowPendaftar.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingShowPendaftar.value = false;
    }
  };

  const validateTugasAkhir = async (
    id,
    statusValidBerkas,
    catatanPerbaikan = ""
  ) => {
    loadingShowPendaftar.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        status_valid_berkas: statusValidBerkas,
        catatan_perbaikan: catatanPerbaikan,
      };

      const response = await axios.put(
        `/api/admin_ta/pendaftar-ujian/${id}/status`,
        formData,
        { headers }
      );
      toast.success("Berkas pendaftaran ujian berhasil divalidasi!");
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingShowPendaftar.value = false;
    }
  };
  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorShowPendaftar.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorShowPendaftar.value);
    }
  };
  onMounted(() => {
    // fetchData();
  });
  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });
  return {
    dataShowPendaftar,
    loadingShowPendaftar,
    errorShowPendaftar,
    validateTugasAkhir,
    fetchShowPendaftar,
  };
}

export function useTabelPenjadwalan() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelPenjadwalan = ref([]);
  const paginationTabelPenjadwalan = ref({});
  const loadingTabelPenjadwalan = ref(false);
  const errorTabelPenjadwalan = ref(null);

  const fetchTabelPenjadwalan = async (page = 1, search = "", status = "") => {
    loadingTabelPenjadwalan.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const response = await axios.get(
        `/api/admin_ta/penjadwalan-ujian?page=${page}`,
        { headers, params }
      );
      dataTabelPenjadwalan.value = response.data.data.data;
      paginationTabelPenjadwalan.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelPenjadwalan.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelPenjadwalan.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelPenjadwalan.value);
    }
  };

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelPenjadwalan,
    loadingTabelPenjadwalan,
    errorTabelPenjadwalan,
    paginationTabelPenjadwalan,
    fetchTabelPenjadwalan,
  };
}

export function useShowPenjadwalan() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataShowPenjadwalan = ref({});
  const loadingShowPenjadwalan = ref(false);
  const errorShowPenjadwalan = ref(null);

  const fetchShowPenjadwalan = async (id) => {
    loadingShowPenjadwalan.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/admin_ta/penjadwalan-ujian/${id}`,
        {
          headers,
        }
      );
      dataShowPenjadwalan.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingShowPenjadwalan.value = false;
    }
  };

  // const submitPenjadwalan

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorShowPenjadwalan.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorShowPenjadwalan.value);
    }
  };

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataShowPenjadwalan,
    loadingShowPenjadwalan,
    errorShowPenjadwalan,
    fetchShowPenjadwalan,
  };
}
