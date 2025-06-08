import { ref } from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export const useNilaiUjianTA = () => {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);
  const toast = useToast();
  const router = useRouter();

  // Handle error with toast notification
  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/dosen/login");
    } else {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(error.value);
    }
  };

  // Submit or update nilai ujian TA
  const submitNilaiUjian = async (data, isEdit = false) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    const token = VueCookies.get("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      let response;

      // Create payload - same for both create and update
      const payload = {
        kualitas_tata_laporan: parseFloat(data.tataLaporan),
        kemampuan_teknis: parseFloat(data.kemampuanTeknis),
        kualitas_produk: parseFloat(data.hasilProduk),
        presentasi: parseFloat(data.presentasi),
        rerata_ujian_ta: parseFloat(data.totalNilai),
        revisi: data.catatanRevisi,
      };

      if (isEdit) {
        // Update nilai
        response = await axios.put(
          `/api/dosen/nilai-ujian-ta/${data.tugas_akhir_id}`,
          payload,
          { headers }
        );
      } else {
        // Create nilai
        response = await axios.post(
          `/api/dosen/nilai-ujian-ta/`,
          {
            tugas_akhir_id: data.tugas_akhir_id,
            ...payload,
          },
          { headers }
        );
      }

      if (response.data.status === "success") {
        success.value = true;
        return response.data;
      } else {
        error.value = response.data.message || "Gagal menyimpan nilai";
        toast.error(error.value);
        return null;
      }
    } catch (err) {
      console.error("Error submitting ujian TA nilai:", err);
      handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Update status kelulusan (only for secretary role)
  const updateStatusKelulusan = async (tugasAkhirId, status) => {
    loading.value = true;
    error.value = null;

    const token = VueCookies.get("auth_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    try {
      const response = await axios.put(
        `/api/dosen/status-kelulusan/${tugasAkhirId}`,
        {
          status_kelulusan: status,
        },
        { headers }
      );

      if (response.data.status === "success") {
        success.value = true;
        return response.data;
      } else {
        error.value =
          response.data.message || "Gagal mengupdate status kelulusan";
        toast.error(error.value);
        return null;
      }
    } catch (err) {
      console.error("Error updating status kelulusan:", err);
      handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    success,
    submitNilaiUjian,
    updateStatusKelulusan,
  };
};
