import { ref, onMounted, onUnmounted } from "vue";
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
  const defaultTahunAjaran = ref(null);

  // PERBAIKAN: Tambah parameter search
  const fetchData = async (page = 1, search = "") => {
    loadingTahunAjaran.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // PERBAIKAN: Tambahkan search ke URL jika ada
      let url = `/api/admin_ta/tahun-ajaran?page=${page}`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await axios.get(url, { headers });
      dataTahunAjaran.value = response.data.data;
      paginationTahunAjaran.value = response.data.data.pagination;
      
      // Ambil tahun ajaran default
      const defaultTA = dataTahunAjaran.value.data.find(item => item.is_default === 1);
      if (defaultTA) {
        defaultTahunAjaran.value = defaultTA.tahun_ajaran;
      }
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
        `/api/admin_ta/tahun-ajaran/${tahunAjaranId}`,
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
        `/api/admin_ta/tahun-ajaran/${tahunAjaranId}/set-default`,
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
    defaultTahunAjaran,
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
  const defaultSemester = ref(null); // untuk menyimpan semester default
  const paginationSemester = ref({});
  
  const fetchData = async () => {
    loadingSemester.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      
      // Panggil API semester
      const response = await axios.get(
        `/api/admin_ta/semester`,
        { headers }
      );

      dataSemester.value = response.data.data;
      
      // Cari semester default dan konversi nama: A → Ganjil, B → Genap
      const defaultSem = dataSemester.value.find(item => item.is_default === 1);
      if (defaultSem) {
        const semesterName = defaultSem.nama_semester;
        defaultSemester.value = semesterName === "A" ? "Ganjil" : 
                                semesterName === "B" ? "Genap" : 
                                semesterName;
      }
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
        `/api/admin_ta/semester/${semesterId}/set-default`,
        {},
        { headers }
      );
      toast.success("Default Semester berhasil diubah.");
      fetchData(); // Refresh data setelah update
    } catch (err) {
      handleError(err);
    } finally {
      loadingSemester.value = false;
    }
  };
  
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
    defaultSemester, // tambahkan default semester ke return
    paginationSemester,
    updateDefaultSemester,
    fetchData,
  };
}
