import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

/**
 * Menyediakan fungsi untuk melihat daftar tugas akhir, detail bimbingan,
 * dan memperbarui status verifikasi bimbingan
 */
export function useDibimbing() {
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

      const response = await axios.get(
        `/api/dosen/bimbingan?page=${page}&search=${search}&kategori=${kategori}`,
        { headers }
      );

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
