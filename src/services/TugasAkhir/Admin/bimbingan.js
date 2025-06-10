import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelPlottingPembimbing() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingPlotting = ref(false);
  const errorPlotting = ref(null);
  const dataPlotting = ref(null);
  const paginationPlotting = ref({});
  const fetchPlottingPembimbing = async (
    page = 1,
    search = "",
    kategori = ""
  ) => {
    loadingPlotting.value = true;
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

      const response = await axios.get(`/api/admin_ta/plotting?page=${page}`, {
        headers,
        params,
      });
      dataPlotting.value = response.data.data;
      paginationPlotting.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingPlotting.value = false;
    }
  };
  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorPlotting.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorPlotting.value);
    }
  };

  onMounted(() => {
    // fetchPlottingPembimbing();
  });
  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });
  return {
    loadingPlotting,
    errorPlotting,
    dataPlotting,
    paginationPlotting,
    fetchPlottingPembimbing,
  };
}

export function useTabelBimbingan() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingBimbingan = ref(false);
  const errorBimbingan = ref(null);
  const dataBimbingan = ref(null);
  const paginationBimbingan = ref({});

  const fetchBimbingan = async (page = 1, search = "", kategori = "") => {
    loadingBimbingan.value = true;
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

      //simulasi jeda
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.get(
        `/api/admin_ta/list-bimbingan?page=${page}`,
        {
          headers,
          params,
        }
      );
      dataBimbingan.value = response.data.data.data;
      paginationBimbingan.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingBimbingan.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorBimbingan.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorBimbingan.value);
    }
  };

  onMounted(() => {
    // fetchBimbingan(1); // <-- perbaiki di sini
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    loadingBimbingan,
    errorBimbingan,
    dataBimbingan,
    paginationBimbingan,
    fetchBimbingan,
  };
}

export function useShowPlottingPembimbing() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingShowPlotting = ref(false);
  const errorShowPlotting = ref(null);
  const dataShowPlotting = ref(null);

  const fetchData = async (id) => {
    loadingShowPlotting.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/admin_ta/plotting-pembimbing/${id}`,
        { headers }
      );
      dataShowPlotting.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingShowPlotting.value = false;
    }
  };

  const submitPlotting = async ({ tugas_akhir_id, dosen_pembimbing_id }) => {
    loadingShowPlotting.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        tugas_akhir_id,
        dosen_pembimbing_id,
      };

      // Gunakan storeForAdmin endpoint yang sudah ada
      const response = await axios.post(
        "/api/admin_ta/plotting-pembimbing",
        formData,
        { headers }
      );
      toast.success("Plotting pembimbing berhasil!");

      // Refresh data setelah berhasil
      await fetchData(tugas_akhir_id);
      return response.data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingShowPlotting.value = false;
    }
  };

  const updatePlotting = async ({ tugas_akhir_id, dosen_pembimbing_id }) => {
    loadingShowPlotting.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        tugas_akhir_id,
        dosen_pembimbing_id,
      };
      // Ganti URL sesuai endpoint update di backend (misal: PUT atau PATCH)
      await axios.put(
        `/api/admin_ta/plotting-pembimbing/${tugas_akhir_id}`,
        formData,
        { headers }
      );
      toast.success("Update dosen pembimbing berhasil!");
      await fetchData(tugas_akhir_id); // refresh detail
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingShowPlotting.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorShowPlotting.value =
        err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorShowPlotting.value);
    }
  };

  onMounted(() => {});

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    loadingShowPlotting,
    errorShowPlotting,
    dataShowPlotting,
    fetchData,
    submitPlotting,
    updatePlotting,
  };
}

export function useShowBimbingan() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingShowBimbingan = ref(false);
  const errorShowBimbingan = ref(null);
  const dataShowBimbingan = ref(null);
  const paginationShowBimbingan = ref({});
  const fetchData = async (id, page = 1) => {
    loadingShowBimbingan.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/admin_ta/detail-bimbingan/${id}?page=${page}`,
        { headers }
      );
      dataShowBimbingan.value = response.data.data;
      paginationShowBimbingan.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingShowBimbingan.value = false;
    }
  };
  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorShowBimbingan.value =
        err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorShowBimbingan.value);
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
    loadingShowBimbingan,
    errorShowBimbingan,
    dataShowBimbingan,
    paginationShowBimbingan,
    fetchData,
  };
}

export function useKategori() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingKategori = ref(false);
  const errorKategori = ref(null);
  const dataKategori = ref(null);

  const fetchData = async () => {
    loadingKategori.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get("/api/admin_ta/kategori", { headers });
      dataKategori.value = response.data.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingKategori.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorKategori.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorKategori.value);
    }
  };

  onMounted(() => {
    fetchData();
  });

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    loadingKategori,
    errorKategori,
    dataKategori,
    fetchData,
  };
}
