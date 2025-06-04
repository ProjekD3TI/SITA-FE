// Masih Belum Bisa

import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

export function useNilaiUjianTA() {
  const router = useRouter();
  const toast = useToast();

  const nilaiUjianTA = ref(null);
  const userRole = ref(null);
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
   * Mengambil data nilai ujian TA dan role dosen pada ujian tersebut
   */
  const fetchNilaiUjianTA = async (tugasAkhirId) => {
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
        `/api/dosen/tugas-akhir/${tugasAkhirId}`,
        { headers }
      );

      // Set nilai ujian dan role dosen (apakah ketua penguji atau bukan)
      nilaiUjianTA.value = response.data.data;

      // Set role penguji (ketua atau anggota)
      if (response.data.data.dosen_role === "ketua") {
        userRole.value = "ketua";
      } else {
        userRole.value = "anggota";
      }

      return response.data;
    } catch (err) {
      console.error("Error fetching nilai ujian TA:", err);

      if (err.response?.status === 404) {
        nilaiUjianTA.value = null;
        return null;
      }

      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Memberikan nilai ujian TA (untuk semua dosen penguji)
   */
  const memberiNilaiTA = async (tugasAkhirId, data) => {
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
        `/api/dosen/tugas-akhir/${tugasAkhirId}/nilai`,
        data,
        { headers }
      );

      success.value = "Nilai ujian berhasil disimpan";
      toast.success("Nilai ujian berhasil disimpan");

      return response.data;
    } catch (err) {
      console.error("Error memberikan nilai ujian TA:", err);
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Memperbarui status kelulusan (hanya untuk ketua penguji)
   */
  const updateStatusKelulusan = async (tugasAkhirId, status) => {
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
        `/api/dosen/status-kelulusan/${tugasAkhirId}`,
        { status_kelulusan: status },
        { headers }
      );

      success.value = "Status kelulusan berhasil diperbarui";
      toast.success("Status kelulusan berhasil diperbarui");

      return response.data;
    } catch (err) {
      console.error("Error updating status kelulusan:", err);

      if (err.response?.status === 403) {
        toast.error(
          "Anda tidak memiliki hak akses untuk memperbarui status kelulusan"
        );
      } else {
        handleError(err);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Simpan nilai ujian dan status kelulusan (jika dosen adalah ketua penguji)
   */
  const saveNilaiUjianTA = async (tugasAkhirId, data, isKetua) => {
    try {
      // Kirim nilai ujian (untuk semua dosen)
      await memberiNilaiTA(tugasAkhirId, {
        nilai_ujian_ta: calculateFinalScore(data),
        revisi: data.catatanRevisi || "",
      });

      // Jika dosen adalah ketua penguji, update status kelulusan
      if (isKetua && data.statusKelulusan) {
        // Convert string status to numeric status as per backend requirements
        let statusCode;
        switch (data.statusKelulusan) {
          case "Lulus tanpa revisi":
            statusCode = 1;
            break;
          case "Lulus dengan revisi":
            statusCode = 2;
            break;
          case "Belum lulus perlu diuji lagi":
            statusCode = 3;
            break;
          case "Tidak lulus":
            statusCode = 4;
            break;
          default:
            statusCode = null;
        }

        if (statusCode) {
          await updateStatusKelulusan(tugasAkhirId, statusCode);
        }
      }

      success.value = "Nilai ujian berhasil disimpan";
      return true;
    } catch (err) {
      console.error("Error saving nilai ujian TA:", err);
      throw err;
    }
  };

  /**
   * Menghitung nilai akhir dari komponen-komponen nilai
   */
  const calculateFinalScore = (data) => {
    // Weights as per the form (15%, 35%, 25%, 25%)
    const tataLaporanWeight = 0.15;
    const kemampuanTeknisWeight = 0.35;
    const hasilProdukWeight = 0.25;
    const presentasiWeight = 0.25;

    // Convert values to numbers and calculate weighted sum
    const tataLaporanScore = Number(data.tataLaporan || 0) * tataLaporanWeight;
    const kemampuanTeknisScore =
      Number(data.kemampuanTeknis || 0) * kemampuanTeknisWeight;
    const hasilProdukScore = Number(data.hasilProduk || 0) * hasilProdukWeight;
    const presentasiScore = Number(data.presentasi || 0) * presentasiWeight;

    // Calculate final score (rounded to 2 decimal places)
    const finalScore =
      tataLaporanScore +
      kemampuanTeknisScore +
      hasilProdukScore +
      presentasiScore;
    return Math.round(finalScore * 100) / 100;
  };

  return {
    nilaiUjianTA,
    userRole,
    loading,
    error,
    success,
    fetchNilaiUjianTA,
    memberiNilaiTA,
    updateStatusKelulusan,
    saveNilaiUjianTA,
    calculateFinalScore,
    isKetuaPenguji: () => userRole.value === "ketua",
  };
}
