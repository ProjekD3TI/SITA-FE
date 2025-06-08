import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const dataRequestPembimbing = ref(null);
const dataBimbingan = ref(null);

// --- API SIMULASI ---
export function useBimbingan() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingBimbingan = ref(false);
  const errorBimbingan = ref(null);
  const paginationBimbingan = ref({});
  const fetchData = async (page = 1) => {
    loadingBimbingan.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        `/api/mahasiswa/bimbingan/list-bimbingan?page=${page}`,
        { headers }
      );
      dataBimbingan.value = response.data.data;
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
      router.push("/mahasiswa/login");
    } else {
      errorBimbingan.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorBimbingan.value);
    }
  };

  const submitBimbingan = async ({ tanggal_bimbingan, bab, catatan }) => {
    loadingBimbingan.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const formData = {
        tanggal_bimbingan,
        bab,
        catatan,
      };
      await axios.post("/api/mahasiswa/bimbingan", formData, { headers });
      toast.success(
        "Bimbingan berhasil ditambahkan, Silahkan tunggu verifikasi dari dosen pembimbing Anda."
      );
      await fetchData();
      return true;
    } catch (error) {
      toast.error(
        "Gagal menambah bimbingan: " +
          (error.response?.data?.message || error.message)
      );
      return false;
    } finally {
      loadingBimbingan.value = false;
    }
  };

  // Computed property untuk BAB tertinggi
  const highestBAB = computed(() => {
    return dataBimbingan.value?.bab_tertinggi || 0;
  });

  onMounted(() => {
    // fetchData();
  });

  onUnmounted(() => {
    if (abortController) abortController.abort();
  });

  return {
    loadingBimbingan,
    highestBAB,
    errorBimbingan,
    dataBimbingan,
    paginationBimbingan,
    fetchData,
    submitBimbingan,
  };
}

// --- API SIMULASI UNTUK REQUEST PEMBIMBING ---
export function useRequestPembimbing() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingRequest = ref(false);
  const errorRequest = ref(null);

  const fetchRequestData = async () => {
    loadingRequest.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(
        "/api/mahasiswa/bimbingan/request-pembimbing",
        { headers }
      );
      dataRequestPembimbing.value = response.data.data;
    } catch (err) {
      handleRequestError(err);
    } finally {
      loadingRequest.value = false;
    }
  };

  const handleRequestError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/mahasiswa/login");
    } else {
      errorRequest.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorRequest.value);
    }
  };

  // Fungsi untuk mengirim request pembimbing
  const submitRequestPembimbing = async (data) => {
    loadingRequest.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      // POST ke endpoint API request pembimbing
      const response = await axios.post(
        "/api/mahasiswa/request-pembimbing",
        data,
        { headers }
      );
      toast.success(
        "Permintaan pembimbing berhasil dikirim, Silahkan tunggu respon dari dosen pembimbing Anda."
      );
      return true;
    } catch (err) {
      handleRequestError(err);
      return false;
    } finally {
      loadingRequest.value = false;
    }
  };

  onMounted(() => {
    fetchRequestData();
  });

  onUnmounted(() => {
    if (abortController) abortController.abort();
  });

  return {
    loadingRequest,
    errorRequest,
    dataRequestPembimbing,
    fetchRequestData,
    submitRequestPembimbing,
  };
}

// //fungsi dan method
// function formatDate(dateString) {
//   if (!dateString) return '-';
//   const date = new Date(dateString);
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
//   return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
// }

export function getStatusClass(status) {
  if (status === 1) return "success";
  if (status === 0) return "warning";
  return "danger";
}

export function getStatusLabel(status) {
  if (status === 1) return "Diterima";
  if (status === 0) return "Menunggu";
  return "Ditolak";
}

// computed
export const dosens = computed(
  () => dataRequestPembimbing.value?.list_dosen ?? []
);
export const categories = computed(() => {
  if (!dataRequestPembimbing.value?.list_kategori) return [];

  return dataRequestPembimbing.value.list_kategori.map((kategori) => ({
    value: kategori.id.toString(), // Gunakan id sebagai value
    label: kategori.name, // Gunakan name sebagai label
  }));
});
export const selectedPembimbing = ref("");

export const selectedDosenData = computed(() => {
  if (!selectedPembimbing.value || !dosens.value.length) return null;
  return dosens.value.find(
    (dosen) => dosen.id.toString() === selectedPembimbing.value.toString()
  );
});

export const pembimbings = computed(() => {
  if (!dataRequestPembimbing.value?.list_dosen) return [];

  return dataRequestPembimbing.value.list_dosen.map((dosen) => {
    // ✅ Pastikan semua field ada dengan default values
    const dosenId = dosen.id;
    const dosenName = dosen.name || "Nama Tidak Diketahui";
    const dosenNik = dosen.nik || "NIK Tidak Diketahui";
    const hasAccess = dosen.akses_ta === 1;

    // ✅ Buat label yang aman
    const baseLabel = `${dosenName}`;
    const fullLabel = hasAccess ? baseLabel : `${baseLabel} - (Non-Aktif)`;

    return {
      value: dosenId,
      label: fullLabel,
      disabled: !hasAccess,
      akses_ta: dosen.akses_ta || 0,
      name: dosenName,
      nik: dosenNik,
      raw_dosen: dosen,
    };
  });
});

export const namaDosenRequestPembimbing = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing?.dosen?.nama ??
    "-"
);

export const defaultTahunAjaran = computed(
  () => dataRequestPembimbing.value?.default_tahun_ajaran?.tahun_ajaran ?? "-"
);

export const tahunAjaranTA = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.tahun_ajaran?.tahun_ajaran ?? "-"
);

export const namaPembimbing = computed(
  () => dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.nama ?? "-"
);

export const kategoriTA = computed(
  () => dataRequestPembimbing.value?.tugas_akhir?.kategori?.nama ?? "-"
);

export const statusRequestValue = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing
      ?.status_request ?? null
);

export const dospemValue = computed(
  () => dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id ?? null
);

export const hasActiveTA = computed(
  () => dataRequestPembimbing.value?.tugas_akhir?.status_active === 1 ?? false
);

export const noPembimbing = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id === null ||
    dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id === undefined
);

export const hasPembimbing = computed(() => !noPembimbing.value);

export const waitingResponse = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing
      ?.status_request === 0
);
export const declined = computed(
  () =>
    dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing
      ?.status_request === 2
);
export const listBimbingan = computed(() => {
  return Array.isArray(dataBimbingan.value?.bimbingan)
    ? dataBimbingan.value?.bimbingan
    : [];
});
// export const formattedBimbinganData = computed(() => {
//   if (!dataBimbingan.value?.bimbingan || !dataBimbingan.value?.bimbingan.length)
//     return [];
//   return dataBimbingan.value?.bimbingan.map((item, index) => ({
//     no: (index + 1).toString(),
//     tanggal: item.tanggal_bimbingan,
//     bab: item.bab ? item.bab.toString() : "-",
//     catatan: item.catatan || "-",
//     status: item.status_verifikasi,
//   }));
// });

export const dataNilaiBimbingan = computed(
  () => dataBimbingan.value?.nilai_bimbingan ?? null
);
