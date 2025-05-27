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
    { status_valid: null }
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
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/mahasiswa/tugas-akhir/dashboard", { headers });
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
};

// Status Card State
export const StatusCardIdentifier = ref(0);
export const statuses = {
    reqBimbingan: ref(STATUS.PLACEHOLDER),
    proposal: ref(STATUS.PLACEHOLDER),
    ujianTA: ref(STATUS.PLACEHOLDER),
};

// Refactored updateStatusCard for better readability
export function updateStatusCard() {
    const [req, prop, ujian] = dataStatusCard.value;

    if (req.status_request !== null && prop.status_proposal == null && ujian.status_valid == null) {
        statuses.reqBimbingan.value = req.status_request;
        StatusCardIdentifier.value = 0;
        return;
    }
    if (prop.status_proposal !== null && ujian.status_valid == null) {
        statuses.proposal.value = prop.status_proposal;
        StatusCardIdentifier.value = 1;
        return;
    }
    if (ujian.status_valid !== null) {
        statuses.ujianTA.value = ujian.status_valid;
        StatusCardIdentifier.value = 2;
        return;
    }
    // Default fallback
    statuses.reqBimbingan.value = STATUS.PLACEHOLDER;
    statuses.proposal.value = STATUS.PLACEHOLDER;
    statuses.ujianTA.value = STATUS.PLACEHOLDER;
    StatusCardIdentifier.value = 0;
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
};

// Update dataStatusCard setelah dataDashboard terisi
watch(dataDashboard, (val) => {
    if (val) {
        dataStatusCard.value = [
            {
                request_pembimbing_id: val.request_pembimbing?.id ?? null,
                dosen_pembimbing: val.dosen_pembimbing?.id ?? null,
                status_request: val.request_pembimbing?.status ?? null, // typo fixed
            },
            {
                proposal_id: val.proposal?.id ?? null,
                status_proposal: val.proposal?.status ?? null,
            },
            {
                tugas_akhir_id: val.tugas_akhir_id ?? null,
                status_valid: val.status_valid ?? null,
            },
        ];
    }
}, { immediate: true });

// Pure function untuk format BAB
export function formatBAB(bab) {
    return `${["BAB I", "BAB II", "BAB III", "BAB IV", "BAB V"][bab - 1] || "-"}`;
}

// Reactive state untuk summary
export const TotalBimbingan = computed(() => dataDashboard.value?.bimbingan?.total_bimbingan ?? 0);
export const BAB = computed(() => formatBAB(dataDashboard.value?.bimbingan?.progress_bimbingan ?? 0));

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
export const TanggalUjian = computed(() => formatTanggal(dataDashboard.value?.tanggal_ujian ?? "Belum ada"));

// Flow Step Logic (contoh, bisa di-computed juga)
export const currentFlowStep = computed(() => {
    const data = dataDashboard.value;
    if (!data) return -1;

    // Step 0: Sudah punya dosen pembimbing
    if (data.dosen_pembimbing == null) return -1;

    // Step 1: Sudah punya proposal
    if (data.proposal?.id == null) return 0;

    // Step 2: Proposal sudah dinilai (ada catatan)
    if (data.proposal?.catatan == null) return 1;

    // Step 3: Bimbingan minimal 9
    if (!data.bimbingan || data.bimbingan.total_bimbingan < 9) return 2;

    // Step 4: Ujian TA sudah valid
    if (data.status_valid !== 1) return 3;

    // Step 5: Sudah ada nilai akhir
    if (data.nilai_akhir == null) return 4;

    // Selesai semua step
    return 5;
});

