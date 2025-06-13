import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelPendaftarProposal() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelPendaftarProposal = ref([]);
  const loadingTabelPendaftarProposal = ref(false);
  const errorTabelPendaftarProposal = ref(null);
  const paginationTabelPendaftarProposal = ref({});

  const fetchData = async (page = 1, search = "", status = "") => {
    loadingTabelPendaftarProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.status_proposal = status;
      const response = await axios.get(
        `/api/admin_ta/pendaftar-proposal?page=${page}`,
        {
          headers,
          params,
        }
      );
      dataTabelPendaftarProposal.value = response.data.data;
      paginationTabelPendaftarProposal.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelPendaftarProposal.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelPendaftarProposal.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelPendaftarProposal.value);
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
      await axios.put(`/api/admin_ta/status-form/1`, formData, { headers });
    } catch (err) {
      handleError(err);
      throw err;
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
    dataTabelPendaftarProposal,
    loadingTabelPendaftarProposal,
    errorTabelPendaftarProposal,
    paginationTabelPendaftarProposal,
    fetchData,
    updateStatusForm,
  };
}

export function useShowProposal() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataProposal = ref(null);
  const loadingProposal = ref(false);
  const errorProposal = ref(null);
  const fetchData = async (id) => {
    loadingProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(
        `/api/admin_ta/pendaftar-proposal/${id}`,
        {
          headers,
        }
      );
      dataProposal.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingProposal.value = false;
    }
  };

  const validateProposal = async (
    id,
    statusValidBerkas,
    catatanPerbaikan = ""
  ) => {
    loadingProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        status_valid_berkas: statusValidBerkas, // array, misal: [1,2] atau [1,1]
        catatan_perbaikan: catatanPerbaikan, // <-- tambahkan ini
      };

      await axios.put(
        `/api/admin_ta/pendaftar-proposal/${id}/status`,
        formData,
        {
          headers,
        }
      );
      toast.success("Proposal berhasil divalidasi.");
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingProposal.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorProposal.value = err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorProposal.value);
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
    dataProposal,
    loadingProposal,
    errorProposal,
    fetchData,
    validateProposal,
  };
}

export function useShowSeminarProposal() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataSeminarProposal = ref(null);
  const loadingSeminarProposal = ref(false);
  const errorSeminarProposal = ref(null);

  const fetchData = async (id) => {
    loadingSeminarProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(`/api/admin_ta/seminar-proposal/${id}`, {
        headers,
      });
      dataSeminarProposal.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingSeminarProposal.value = false;
    }
  };

  const getSecureFileBlobUrl = async (url) => {
    loadingSeminarProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        Accept: "application/pdf",
      };
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error("Gagal mengakses file");
      const blob = await response.blob();
      return window.URL.createObjectURL(blob);
    } catch (err) {
      return null;
    } finally {
      loadingSeminarProposal.value = false;
    }
  };

  const inputNilaiProposal = async (id, nilaiProposal, catatanProposal) => {
    loadingSeminarProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        nilai_proposal: nilaiProposal,
        catatan_proposal: catatanProposal,
      };
      await axios.put(
        `/api/admin_ta/seminar-proposal/${id}/nilai-catatan`,
        formData,
        {
          headers,
        }
      );
      // toast.success("Nilai proposal berhasil disimpan.");
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingSeminarProposal.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorSeminarProposal.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorSeminarProposal.value);
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
    dataSeminarProposal,
    loadingSeminarProposal,
    errorSeminarProposal,
    getSecureFileBlobUrl,
    inputNilaiProposal,
    fetchData,
  };
}
export function useTabelSeminarProposal() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelSeminarProposal = ref([]);
  const loadingTabelSeminarProposal = ref(false);
  const errorTabelSeminarProposal = ref(null);
  const paginationTabelSeminarProposal = ref({});

  const fetchData = async (page = 1, search = "", statusNilai = "") => {
    loadingTabelSeminarProposal.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (statusNilai) params.status_nilai = statusNilai;
      const response = await axios.get(
        `/api/admin_ta/seminar-proposal?page=${page}`,
        {
          headers,
          params,
        }
      );
      dataTabelSeminarProposal.value = response.data.data;
      paginationTabelSeminarProposal.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelSeminarProposal.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelSeminarProposal.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelSeminarProposal.value);
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
    dataTabelSeminarProposal,
    loadingTabelSeminarProposal,
    errorTabelSeminarProposal,
    paginationTabelSeminarProposal,
    fetchData,
  };
}
