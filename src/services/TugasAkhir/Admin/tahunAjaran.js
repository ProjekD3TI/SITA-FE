import { ref, onMounted, onUnmounted, computed, handleError } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useTahunAjaran() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingTahunAjaran = ref(false);
  const errorTahunAjaran = ref(null);
  const dataTahunAjaran = ref([]);
  const paginationTahunAjaran = ref({});

  const fetchData = async (page = 1) => {
    loadingTahunAjaran.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/admin_ta/tahun-ajaran?page=${page}`,
        {
          headers,
        }
      );
      dataTahunAjaran.value = response.data.data;
      paginationTahunAjaran.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingTahunAjaran.value = false;
    }
  };

  const submitTahunAjaran = async (tahunAjaranData) => {
    loadingTahunAjaran.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.post(
        `/api/admin_ta/tahun-ajaran`,
        tahunAjaranData,
        { headers }
      );
      toast.success("Tahun ajaran berhasil ditambahkan.");
    } catch (err) {
      handleError(err);
    } finally {
      loadingTahunAjaran.value = false;
    }
  };

  const updateTahunAjaran = async (tahunAjaranId, tahunAjaranData) => {
    loadingTahunAjaran.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.put(
        `/api/admin_ta/tahun-ajaran${tahunAjaranId}`,
        tahunAjaranData,
        { headers }
      );
      toast.success("Tahun ajaran berhasil diubah.");
    } catch (err) {
      handleError(err);
    } finally {
      loadingTahunAjaran.value = false;
    }
  };

  const updateDefaultTahunAjaran = async (tahunAjaranId) => {
    loadingTahunAjaran.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.put(
        `/api/admin_ta/tahun-ajaran/${id}/set-default`,
        {},
        { headers }
      );
      toast.success("Default Tahun ajaran berhasil diubah.");
    } catch (err) {
      handleError(err);
    } finally {
      loadingTahunAjaran.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/admin/login");
    } else {
      errorTahunAjaran.value =
        err.response?.data?.message || "Terjadi kesalahan.";
      toast.error(errorTahunAjaran.value);
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
    dataTahunAjaran,
    loadingTahunAjaran,
    errorTahunAjaran,
    paginationTahunAjaran,
    submitTahunAjaran,
    updateTahunAjaran,
    updateDefaultTahunAjaran,
    fetchData,
  };
}

export function useSemester() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingSemester = ref(false);
  const errorSemester = ref(null);
  const dataSemester = ref([]);
  const paginationSemester = ref({});
  const fetchData = async (page = 1) => {
    loadingSemester.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`/api/admin/semester?page=${page}`, {
        headers,
      });
      dataSemester.value = response.data.data;
      paginationSemester.value = response.data.data.pagination;
    } catch (err) {
      handleError(err);
    } finally {
      loadingSemester.value = false;
    }
  };

  const updateDefaultSemester = async (semesterId) => {
    loadingSemester.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.put(
        `/api/admin/semester/${semesterId}/default`,
        {},
        { headers }
      );
      toast.success("Default Semester berhasil diubah.");
    } catch (err) {
      handleError(err);
    } finally {
      loadingSemester.value = false;
    }

    const handleError = (err) => {
      if (err.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/admin/login");
      } else {
        errorSemester.value =
          err.response?.data?.message || "Terjadi kesalahan.";
        toast.error(errorSemester.value);
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
      dataSemester,
      loadingSemester,
      errorSemester,
      paginationSemester,
      updateDefaultSemester,
      fetchData,
    };
  };
}
