import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTabelMahasiswa() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelMahasiswa = ref([]);
  const paginationTabelMahasiswa = ref({});
  const loadingTabelMahasiswa = ref(false);
  const errorTabelMahasiswa = ref(null);
  const angkatanList = ref([]);

  const fetchDataTabelMahasiswa = async (
    page = 1,
    search = "",
    status = "",
    angkatan = ""
  ) => {
    loadingTabelMahasiswa.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.akses_ta = status;
      if (angkatan) params.angkatan = angkatan;
      const response = await axios.get(
        `/api/admin_ta/mahasiswa-ta?page=${page}`,
        {
          headers,
          params,
        }
      );
      dataTabelMahasiswa.value = response.data.data.data;
      paginationTabelMahasiswa.value = response.data.data.pagination;
      angkatanList.value = response.data.data.angkatan_list || [];
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelMahasiswa.value = false;
    }
  };
  // UPDATE (PUT) plotting penguji
  const updateAksesMahasiswa = async (ids, akses_ta) => {
    loadingTabelMahasiswa.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const data = {
        ids, // array of dosen.id
        akses_ta, // boolean (true/false)
      };

      const response = await axios.put(
        `/api/admin_ta/mahasiswa-ta`, // pastikan endpoint sesuai route API Anda
        data,
        { headers }
      );
      toast.success("Status mahasiswa berhasil diubah!");
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingTabelMahasiswa.value = false;
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

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelMahasiswa,
    paginationTabelMahasiswa,
    loadingTabelMahasiswa,
    errorTabelMahasiswa,
    angkatanList,
    fetchDataTabelMahasiswa,
    updateAksesMahasiswa,
  };
}

export function useTabelDosen() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const dataTabelDosen = ref([]);
  const paginationTabelDosen = ref({});
  const loadingTabelDosen = ref(false);
  const errorTabelDosen = ref(null);

  const fetchDataTabelDosen = async (page = 1, search = "", status = "") => {
    loadingTabelDosen.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const params = {};
      if (search) params.search = search;
      if (status) params.akses_ta = status;
      const response = await axios.get(`/api/admin_ta/dosen-ta?page=${page}`, {
        headers,
        params,
      });
      dataTabelDosen.value = response.data.data.data;
      paginationTabelDosen.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTabelDosen.value = false;
    }
  };

  const updateAksesDosen = async (ids, akses_ta) => {
    loadingTabelDosen.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const data = {
        ids, // array of dosen.id
        akses_ta, // boolean (true/false)
      };

      const response = await axios.put(
        `/api/admin_ta/dosen-ta`, // pastikan endpoint sesuai route API Anda
        data,
        { headers }
      );
      toast.success("Status dosen berhasil diubah!");
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loadingTabelDosen.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTabelDosen.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTabelDosen.value);
    }
  };

  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  return {
    dataTabelDosen,
    paginationTabelDosen,
    loadingTabelDosen,
    errorTabelDosen,
    fetchDataTabelDosen,
    updateAksesDosen,
  };
}

export function useJabatanDosen() {
  const router = useRouter();
  const toast = useToast();
  const dataJabatanDosen = ref([]);
  const loadingJabatanDosen = ref(false);
  const errorJabatanDosen = ref(null);

  const fetchDataJabatanDosen = async () => {
    loadingJabatanDosen.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get("/api/admin_ta/jabatan-dosen", {
        headers,
      });
      dataJabatanDosen.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingJabatanDosen.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorJabatanDosen.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorJabatanDosen.value);
    }
  };

  const setKaprodi = async (dosenId) => {
    loadingJabatanDosen.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.post(
        `/api/admin_ta/set-kaprodi`,
        { dosen_id: dosenId },
        { headers }
      );
      toast.success("Kaprodi berhasil ditetapkan!");
      fetchDataJabatanDosen(); // Refresh data after setting
    } catch (err) {
      handleError(err);
    } finally {
      loadingJabatanDosen.value = false;
    }
  };

  const setDivisiTA = async (dosenId) => {
    loadingJabatanDosen.value = true;
    try {
      const auth_token = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.post(
        `/api/admin_ta/set-divisi-ta`,
        { dosen_id: dosenId },
        { headers }
      );
      toast.success("Divisi Tugas Akhir berhasil ditetapkan!");
      fetchDataJabatanDosen(); // Refresh data after setting
    } catch (err) {
      handleError(err);
    } finally {
      loadingJabatanDosen.value = false;
    }
  };

  onMounted(() => {
    fetchDataJabatanDosen();
  });

  return {
    dataJabatanDosen,
    loadingJabatanDosen,
    errorJabatanDosen,
    fetchDataJabatanDosen,
    setKaprodi,
    setDivisiTA,
  };
}
