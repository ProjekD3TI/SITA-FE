import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const router = useRouter();
const toast = useToast();
const dataRequestPembimbing = ref(null);
const dataBimbingan = ref(null);

// --- API SIMULASI ---
export function useBimbingan() {
  let abortController = null;
  const loadingBimbingan = ref(false);
  const errorBimbingan = ref(null);
  const fetchData = async () => {
    loadingBimbingan.value = true;
    try {
      // const authToken = VueCookies.get("auth_token");
      // const headers = {
      //     'Authorization': `Bearer ${authToken}`,
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      // };

      // const response = await axios.get("/api/mahasiswa/tugas-akhir/bimbingan", { headers });
      await new Promise(resolve => setTimeout(resolve, 1000));
      dataBimbingan.value = [
        {
          id: 1,
          tanggal_bimbingan: '2024-05-01',
          bab: 1,
          catatan: 'Revisi BAB I',
          status_verifikasi: 1
        },
        {
          id: 2,
          tanggal_bimbingan: '2024-05-10',
          bab: 2,
          catatan: 'Lanjutkan ke BAB II',
          status_verifikasi: 2
        },
        {
          id: 3,
          tanggal_bimbingan: '2024-05-15',
          bab: 3,
          catatan: 'Revisi BAB III',
          status_verifikasi: 1
        },
        {
          id: 4,
          tanggal_bimbingan: '2024-05-20',
          bab: 4,
          catatan: 'Lanjutkan ke BAB IV',
          status_verifikasi: 1
        },
        {
          id: 5,
          tanggal_bimbingan: '2024-05-25',
          bab: 5,
          catatan: 'Revisi BAB V',
          status_verifikasi: 1
        },
        {
          id: 6,
          tanggal_bimbingan: '2024-05-30',
          bab: 5,
          catatan: 'Lanjutkan ke BAB V',
          status_verifikasi: 2
        },
        {
          id: 7,
          tanggal_bimbingan: '2024-06-05',
          bab: 5,
          catatan: 'Revisi BAB V',
          status_verifikasi: 1
        },
        {
          id: 8,
          tanggal_bimbingan: '2024-06-10',
          bab: 5,
          catatan: 'Lanjutkan ke BAB V',
          status_verifikasi: 2
        },
        {
          id: 9,
          tanggal_bimbingan: '2024-06-15',
          bab: 4,
          catatan: 'Revisi BAB IV',
          status_verifikasi: 1
        },
        {
          id: 10,
          tanggal_bimbingan: '2024-06-20',
          bab: 4,
          catatan: 'Lanjutkan ke BAB V',
          status_verifikasi: 0
        }
      ]
        ;
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
      toast.error(error.value);
    }
  };

  // Computed property untuk BAB tertinggi
  const highestBAB = computed(() => {
    if (!dataBimbingan.value || dataBimbingan.value.length === 0) {
      return 0;
    }

    // Filter data yang terverifikasi
    const verifiedBimbingan = dataBimbingan.value.filter(
      item => item.status_verifikasi === 1
    );

    if (verifiedBimbingan.length === 0) {
      return 0;
    }

    return Math.max(...verifiedBimbingan.map(item => item.bab));
  });

  onMounted(() => {
    fetchData();
  });

  onUnmounted(() => {
    if (abortController) abortController.abort();
  });

  return {
    loadingBimbingan,
    highestBAB,
    errorBimbingan,
    dataBimbingan,
    fetchData,
  };
}

// --- API SIMULASI UNTUK REQUEST PEMBIMBING ---
export function useRequestPembimbing() {
  let abortController = null;
  const loadingRequest = ref(false);
  const errorRequest = ref(null);

  const fetchRequestData = async () => {
    loadingRequest.value = true;
    try {
      // const authToken = VueCookies.get("auth_token");
      // const headers = {
      //     'Authorization': `Bearer ${authToken}`,
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json'
      // };

      // const response = await axios.get("/api/mahasiswa/tugas-akhir/request-pembimbing", { headers });

      // Simulasi delay network
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Data dummy untuk request pembimbing
      dataRequestPembimbing.value = {
        tugas_akhir: {
          id: 1,
          status_active: 1,
          dosen_pembimbing: {
            id: 1,
            nama: 'Dr. Budi Santoso',
          },
          kategori: {
            id: 1,
            nama: 'Internet of Things',
          },
          request_pembimbing: {
            id: 1,
            status_request: 1,
            dosen: {
              id: 1,
              nama: 'Dr. Budi Santoso',
              nik: '123456',
            }
          },
          tahun_ajaran: {
            id: 1,
            tahun_ajaran: '2024/2025',
          },
        },
        list_kategori: [
          {
            id: 1,
            name: 'Internet of Things',
          },
          {
            id: 2,
            name: 'Virtual Reality',
          },
        ],
        list_dosen: [
          {
            id: 1,
            name: 'Dr. Budi Santoso',
            nik: '123456',
          },
          {
            id: 2,
            name: 'Prof. John Batubara',
            nik: '654321',
          },
          {
            id: 3,
            name: 'Dr. Jane Doe',
            nik: '789012',
          }
        ],
        default_tahun_ajaran: {
          id: 1,
          tahun_ajaran: '2024/2025',
        },
      };
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
      // Simulasi network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulasi respon sukses
      toast.success("Permintaan pembimbing berhasil dikirim");
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
    submitRequestPembimbing
  };
}

//fungsi dan method
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getStatusClass(status) {
  if (status === 1) return 'success';
  if (status === 0) return 'warning';
  return 'danger';
}

export function getStatusLabel(status) {
  if (status === 1) return 'Diterima';
  if (status === 0) return 'Menunggu';
  return 'Ditolak';
}

// computed 
export const dosens = computed(() => dataRequestPembimbing.value?.list_dosen ?? []);
export const categories = computed(() => {
  if (!dataRequestPembimbing.value?.list_kategori) return [];

  return dataRequestPembimbing.value.list_kategori.map(kategori => ({
    value: kategori.id.toString(), // Gunakan id sebagai value
    label: kategori.name // Gunakan name sebagai label
  }));
});
export const selectedPembimbing = ref('');

export const selectedDosenData = computed(() => {
  if (!selectedPembimbing.value || !dosens.value.length) return null;
  return dosens.value.find(dosen => dosen.id.toString() === selectedPembimbing.value.toString());
});

export const pembimbings = computed(() => {
  if (!dataRequestPembimbing.value?.list_dosen) return [];

  return dataRequestPembimbing.value.list_dosen.map(dosen => ({
    value: dosen.id.toString(),
    label: `${dosen.name} (${dosen.nik})`
  }));
});

export const namaDosenRequestPembimbing = computed(() => dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing?.dosen?.nama ?? '-');

export const defaultTahunAjaran = computed(() => dataRequestPembimbing.value?.default_tahun_ajaran?.tahun_ajaran ?? '-');

export const tahunAjaranTA = computed(() => dataRequestPembimbing.value?.tugas_akhir?.tahun_ajaran?.tahun_ajaran ?? '-');

export const namaPembimbing = computed(() => dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.nama ?? '-');

export const kategoriTA = computed(() => dataRequestPembimbing.value?.tugas_akhir?.kategori?.nama ?? '-');

export const statusRequestValue = computed(() => dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing?.status_request ?? null);

export const dospemValue = computed(() => dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id ?? null);

export const hasActiveTA = computed(() => dataRequestPembimbing.value?.tugas_akhir?.status_active === 1 ?? false);

export const noPembimbing = computed(() => dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id === null || dataRequestPembimbing.value?.tugas_akhir?.dosen_pembimbing?.id === undefined);

export const hasPembimbing = computed(() => !noPembimbing.value);

export const waitingResponse = computed(() => dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing?.status_request === 0);
export const declined = computed(() => dataRequestPembimbing.value?.tugas_akhir?.request_pembimbing?.status_request === 2);

export const formattedBimbinganData = computed(() => {
  if (!dataBimbingan.value.length) return [];
  return dataBimbingan.value.map((item, index) => ({
    no: (index + 1).toString(),
    tanggal: formatDate(item.tanggal_bimbingan),
    bab: item.bab ? item.bab.toString() : '-',
    catatan: item.catatan || '-',
    status: item.status_verifikasi
  }));
});