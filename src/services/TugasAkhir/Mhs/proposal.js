import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const dataProposal = ref(null);

// --- API SIMULASI ---
export function useProposal() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loadingProposal = ref(false);
  const errorProposal = ref(null);
  const fetchData = async () => {
    loadingProposal.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get("/api/mahasiswa/proposal", { headers });
      dataProposal.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loadingProposal.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/mahasiswa/login");
    } else {
      errorProposal.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorProposal.value);
    }
  };

  // --- SUBMIT PROPOSAL ---
  const submitProposal = async ({
    judul_proposal,
    file_proposal,
    file_transkrip,
  }) => {
    loadingProposal.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      const formData = new FormData();
      formData.append("judul_proposal", judul_proposal);
      if (file_proposal) formData.append("file_proposal", file_proposal);
      if (file_transkrip) formData.append("file_transkrip", file_transkrip);

      await axios.post("/api/mahasiswa/proposal", formData, { headers });
      toast.success("Proposal berhasil dikirim!");
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loadingProposal.value = false;
    }
  };

  const updateProposal = async ({
    id,
    judul_proposal,
    file_proposal,
    file_transkrip,
  }) => {
    loadingProposal.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      const formData = new FormData();
      formData.append("judul_proposal", judul_proposal);
      if (file_proposal) formData.append("file_proposal", file_proposal);
      if (file_transkrip) formData.append("file_transkrip", file_transkrip);

      await axios.post(`/api/mahasiswa/proposal/${id}`, formData, { headers });
      toast.success("Proposal berhasil diupdate!");
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      loadingProposal.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  onUnmounted(() => {
    if (abortController) abortController.abort();
  });

  return {
    loadingProposal,
    errorProposal,
    dataProposal,
    submitProposal,
    updateProposal,
    fetchData,
  };
}

// --- KOMPUTED PROPOSAL ---
function getFileName(filePath) {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
}

// computed properties for existing file names
export const hasPembimbing = computed(
  () => dataProposal.value?.tugas_akhir?.dosen_pembimbing?.id != null || 0
);
export const statusForm = computed(
  () => dataProposal.value?.status_form?.is_open == 1
);
export const dinilai = computed(
  () => dataProposal.value?.tugas_akhir?.nilai_proposal != null
);
export const judulProposalTA = computed(
  () => dataProposal.value?.proposal?.judul_proposal || ""
);
export const naskahProposalTA = computed(() => {
  const filePath = dataProposal.value?.proposal?.berkas?.find(
    (berkas) => berkas.nama_berkas === "Naskah Proposal Tugas Akhir"
  )?.file_path;
  return getFileName(filePath);
});
export const transkripNilaiMahasiswa = computed(() => {
  const filePath = dataProposal.value?.proposal?.berkas?.find(
    (berkas) => berkas.nama_berkas === "Transkrip Nilai Mahasiswa"
  )?.file_path;
  return getFileName(filePath);
});
export const statusProposalTA = computed(
  () => dataProposal.value?.proposal?.status_valid ?? null
);

export const fileNaskahProposalTA = computed(() => {
  return (
    dataProposal.value?.proposal?.berkas?.find(
      (berkas) => berkas.nama_berkas === "Naskah Proposal Tugas Akhir"
    )?.download_url || ""
  );
});

export const fileTranskripNilaiMahasiswa = computed(() => {
  return (
    dataProposal.value?.proposal?.berkas?.find(
      (berkas) => berkas.nama_berkas === "Transkrip Nilai Mahasiswa"
    )?.download_url || ""
  );
});
export const nilaiProposalTA = computed(
  () => dataProposal.value?.tugas_akhir?.nilai_proposal || null
);
export const catatanProposalTA = computed(
  () => dataProposal.value?.tugas_akhir?.catatan_proposal || "Tidak ada catatan"
);
export const naskahProposalTAStatus = computed(() => {
  return (
    dataProposal.value?.proposal?.berkas?.find(
      (berkas) => berkas.nama_berkas === "Naskah Proposal Tugas Akhir"
    )?.status_valid ?? null
  );
});
export const transkripNilaiMahasiswaStatus = computed(() => {
  return (
    dataProposal.value?.proposal?.berkas?.find(
      (berkas) => berkas.nama_berkas === "Transkrip Nilai Mahasiswa"
    )?.status_valid ?? null
  );
});
export const namaPembimbing = computed(() => {
  return (
    dataProposal.value?.tugas_akhir?.dosen_pembimbing?.nama ||
    "Tidak ada pembimbing"
  );
});
export const kategoriTA = computed(() => {
  return (
    dataProposal.value?.tugas_akhir?.kategori?.nama || "Tidak ada kategori TA"
  );
});
export const tahunAjaranTA = computed(() => {
  return (
    dataProposal.value?.tugas_akhir?.tahun_ajaran?.nama ||
    "Tidak ada tahun ajaran"
  );
});

// Status constants for better readability
export const STATUS = {
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  NULL: null,
};

export const overallStatus = computed(() => {
  const berkas = dataProposal.value?.proposal?.berkas || [];

  const naskah = berkas.find(
    (b) => b.nama_berkas === "Naskah Proposal Tugas Akhir"
  );
  const transkrip = berkas.find(
    (b) => b.nama_berkas === "Transkrip Nilai Mahasiswa"
  );

  const naskahStatus = naskah?.status_valid;
  const transkripStatus = transkrip?.status_valid;

  // Jika salah satu status 2 (Ditolak), maka Ditolak
  if (naskahStatus === STATUS.REJECTED || transkripStatus === STATUS.REJECTED) {
    return STATUS.REJECTED;
  }
  // Jika semua 1 (Diterima), maka Diterima
  if (naskahStatus === STATUS.ACCEPTED && transkripStatus === STATUS.ACCEPTED) {
    return STATUS.ACCEPTED;
  }
  // Jika ada yang 0 (Menunggu), maka Menunggu
  if (naskahStatus === STATUS.WAITING || transkripStatus === STATUS.WAITING) {
    return STATUS.WAITING;
  }
  // Default
  return STATUS.NULL;
});

export const userDataConfig = computed(() => {
  const config = {
    headText: "Dosen Pembimbing",
    bodyText: namaPembimbing.value,
    headText2: "Kategori TA",
    bodyText2: kategoriTA.value,
    tahunAjaran: tahunAjaranTA.value,
    showStatus: statusProposalTA.value !== null,
  };

  if (config.showStatus) {
    switch (overallStatus.value) {
      case STATUS.WAITING:
        config.status = "warning";
        config.statusLabel = "Menunggu";
        break;
      case STATUS.ACCEPTED:
        config.status = "success";
        config.statusLabel = "Diterima";
        break;
      case STATUS.REJECTED:
        config.status = "danger";
        config.statusLabel = "Ditolak";
        break;
    }
  }

  return config;
});

export const formConfig = computed(() => {
  const isDisabled =
    naskahProposalTA &&
    (overallStatus.value === STATUS.WAITING ||
      overallStatus.value === STATUS.ACCEPTED);
  const isOpacity = isDisabled;

  return {
    isDisabled,
    wrapperClass: isOpacity ? "opacity-50" : "",
    showSubmitButton:
      naskahProposalTA &&
      (overallStatus.value === STATUS.NULL ||
        overallStatus.value === STATUS.REJECTED),
  };
});

// --- FILE DOWNLOAD ---
export async function secureFileDownload(url, filename = "file.pdf") {
  const authToken = VueCookies.get("auth_token");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/pdf",
      },
    });
    if (!response.ok) throw new Error("Gagal mengunduh file");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  } catch (err) {
    toast.error("Gagal mengunduh file: " + err.message); // Ganti alert dengan toast
  }
}

export async function secureFilePreview(url, filename = "file.pdf") {
  const toast = useToast();
  const authToken = VueCookies.get("auth_token");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/pdf",
      },
    });
    if (!response.ok) throw new Error("Gagal mengakses file");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  } catch (err) {
    toast.error("Gagal membuka file: " + err.message); // Ganti alert dengan toast
  }
}
