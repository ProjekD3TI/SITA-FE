import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const dataDashboard = ref(null);
export const dataStatusCard = ref([
  { status_request: null },
  { status_proposal: null },
  { status_valid: null },
]);

// --- API SIMULASI ---
export function useDashboard() {
  let abortController = null;
  const router = useRouter();
  const toast = useToast();
  const loading = ref(false);
  const error = ref(null);
  const fetchData = async () => {
    loading.value = true;
    try {
      const authToken = VueCookies.get("auth_token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get("/api/mahasiswa/tugas-akhir/dashboard", {
        headers,
      });
      dataDashboard.value = response.data.data;
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/mahasiswa/login");
    } else {
      error.value = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(error.value);
    }
  };

  onMounted(() => {
    fetchData();
  });

  onUnmounted(() => {
    if (abortController) abortController.abort();
  });

  return {
    loading,
    error,
    dataDashboard,
    fetchData,
  };
}

// Status Enum
export const STATUS = {
  PLACEHOLDER: null,
  WAITING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  PLOTTED: 3, // Tambahkan status baru
};

// Status Card State
export const StatusCardIdentifier = ref(0);
export const statuses = {
  reqBimbingan: ref(STATUS.PLACEHOLDER),
  proposal: ref(STATUS.PLACEHOLDER),
  ujianTA: ref(STATUS.PLACEHOLDER),
};

// Refactored updateStatusCard for better readability
// filepath: [dashboard.js](http://_vscodecontentref_/7)
export function updateStatusCard() {
  const [req, prop, ujian] = dataStatusCard.value;

  // Status untuk Request Pembimbing
  if (StatusCardIdentifier.value === 0) {
    if (req.status_request === 1) {
      statuses.reqBimbingan.value = STATUS.ACCEPTED;
      return;
    }
    if (req.status_request === 2) {
      if (req.dosen_pembimbing) {
        statuses.reqBimbingan.value = STATUS.PLOTTED;
      } else {
        statuses.reqBimbingan.value = STATUS.REJECTED;
      }
      return;
    }
    if (req.status_request === 0) {
      if (req.dosen_pembimbing) {
        statuses.reqBimbingan.value = STATUS.PLOTTED;
      } else {
        statuses.reqBimbingan.value = STATUS.WAITING;
      }
      return;
    }
    statuses.reqBimbingan.value = STATUS.PLACEHOLDER;
    return;
  }

  // Status untuk Proposal
  if (StatusCardIdentifier.value === 1) {
    if (prop.proposal_id) {
      // Jika ada proposal id, cek status proposal
      if (prop.status_proposal === 0) {
        statuses.proposal.value = STATUS.WAITING;
        return;
      }
      if (prop.status_proposal === 1) {
        statuses.proposal.value = STATUS.ACCEPTED;
        return;
      }
      if (prop.status_proposal === 2) {
        statuses.proposal.value = STATUS.REJECTED;
        return;
      }
    }
    statuses.proposal.value = STATUS.PLACEHOLDER;
    return;
  }

  // Status untuk Ujian TA
  if (StatusCardIdentifier.value === 2) {
    // Jika sudah ada dosen penguji, status terplotted
    // Jika status_valid ada, gunakan mapping status_valid
    if (ujian.status_valid !== null && ujian.status_valid !== undefined) {
      if (ujian.status_valid === 0) {
        statuses.ujianTA.value = STATUS.WAITING;
        return;
      }
      if (ujian.status_valid === 1) {
        statuses.ujianTA.value = STATUS.ACCEPTED;
        return;
      }
      if (ujian.status_valid === 2) {
        statuses.ujianTA.value = STATUS.REJECTED;
        return;
      }
    } else if (dataDashboard.value?.has_dosen_penguji) {
      statuses.ujianTA.value = STATUS.PLOTTED;
      return;
    }
    statuses.ujianTA.value = STATUS.PLACEHOLDER;
    return;
  }

  // Default fallback
  statuses.reqBimbingan.value = STATUS.PLACEHOLDER;
  statuses.proposal.value = STATUS.PLACEHOLDER;
  statuses.ujianTA.value = STATUS.PLACEHOLDER;
}

watch(dataStatusCard, updateStatusCard, { immediate: true });

// Status Properties
export const statusProperties = {
  [STATUS.WAITING]: {
    iconColor: "warning",
    statusLabel: "Menunggu",
    statusType: "warning",
  },
  [STATUS.ACCEPTED]: {
    iconColor: "success",
    statusLabel: "Diterima",
    statusType: "success",
  },
  [STATUS.REJECTED]: {
    iconColor: "danger",
    statusLabel: "Ditolak",
    statusType: "danger",
  },
  [STATUS.PLACEHOLDER]: {
    iconColor: "placeholder",
    statusLabel: "Belum ada permintaan",
    statusType: "inactive",
  },
  [STATUS.PLOTTED]: {
    iconColor: "success",
    statusLabel: "Terplotting",
    statusType: "success",
  },
};

// Update dataStatusCard setelah dataDashboard terisi
watch(
  dataDashboard,
  (val) => {
    if (val) {
      dataStatusCard.value = [
        {
          request_pembimbing_id: val.request_pembimbing?.id ?? null,
          dosen_pembimbing: val.dosen_pembimbing ?? null,
          status_request: val.request_pembimbing?.status ?? null,
        },
        {
          proposal_id: val.proposal?.id ?? null,
          status_proposal: val.proposal?.status ?? null,
        },
        {
          tugas_akhir_id: val.tugas_akhir?.id ?? null,
          status_valid: val.tugas_akhir?.status_valid ?? null,
        },
      ];
      // Otomatis pindah ke Ujian TA jika sudah ada dosen penguji
      if (val.has_dosen_penguji) {
        StatusCardIdentifier.value = 2;
      } else if (val.proposal?.id) {
        StatusCardIdentifier.value = 1;
      }
    }
  },
  { immediate: true }
);

// Pure function untuk format BAB
export function formatBAB(bab) {
  return `${["BAB I", "BAB II", "BAB III", "BAB IV", "BAB V"][bab - 1] || "-"}`;
}

// Reactive state untuk summary
export const TotalBimbingan = computed(
  () => dataDashboard.value?.bimbingan?.total_bimbingan ?? 0
);
export const BAB = computed(() =>
  formatBAB(dataDashboard.value?.bimbingan?.progress_bimbingan ?? 0)
);

// Format tanggal ujian
export function formatTanggal(tanggal) {
  if (!tanggal || tanggal === "-" || tanggal === "Belum ada") return "-";
  const d = new Date(tanggal);
  if (isNaN(d)) return "Belum ada";
  return d.toLocaleDateString("id-ID", {
    // year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export const TanggalUjian = computed(() =>
  formatTanggal(dataDashboard.value?.tanggal_ujian ?? "Belum ada")
);

// Flow Step Logic (contoh, bisa di-computed juga)
export const currentFlowStep = computed(() => {
  const data = dataDashboard.value;
  if (!data) return -1;

  // Step 0: Sudah punya dosen pembimbing
  if (data.dosen_pembimbing == null) return -1;

  // Step 1: Sudah punya proposal
  if (data.proposal?.status !== 1) return 0;

  // Step 2: Proposal sudah dinilai (ada catatan)
  if (data.proposal?.catatan == null) return 1;

  // Step 3: Bimbingan minimal 9
  if (!data.has_dosen_penguji) return 2;

  // Step 4: Ujian TA sudah valid
  if (data.status_valid !== 1) return 3;

  // Step 5: Sudah ada nilai akhir
  if (data.nilai_akhir == null) return 4;

  // Selesai semua step
  return 5;
});
