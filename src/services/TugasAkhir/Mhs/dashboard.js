import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const dataDashboard = ref(null);

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
    proposal: ref(STATUS.WAITING),
    ujianTA: ref(STATUS.WAITING),
};

export const dataStatusCard = ref([
    {
        request_pembimbing_id: null,
        dosen_pembimbing: null,
        status_request: null,
    },
    {
        proposal_id: null,
        status_proposal: null,
    },
    {
        tugas_akhir_id: null,
        status_valid: null,
    },
]);

export function updateStatusCard() {
    const [req, prop, ujian] = dataStatusCard.value;
    if (req.status_request === 0 && prop.status_proposal == null && ujian.status_valid == null) {
        statuses.reqBimbingan.value = STATUS.WAITING;
        StatusCardIdentifier.value = 0;
    } else if (req.status_request === 1 && prop.status_proposal == null && ujian.status_valid == null) {
        statuses.reqBimbingan.value = STATUS.ACCEPTED;
        StatusCardIdentifier.value = 0;
    } else if (req.status_request === 2 && prop.status_proposal == null && ujian.status_valid == null) {
        statuses.reqBimbingan.value = STATUS.REJECTED;
        StatusCardIdentifier.value = 0;
    } else if (prop.status_proposal === 0 && ujian.status_valid == null) {
        statuses.proposal.value = STATUS.WAITING;
        StatusCardIdentifier.value = 1;
    } else if (prop.status_proposal === 1 && ujian.status_valid == null) {
        statuses.proposal.value = STATUS.ACCEPTED;
        StatusCardIdentifier.value = 1;
    } else if (prop.status_proposal === 2 && ujian.status_valid == null) {
        statuses.proposal.value = STATUS.REJECTED;
        StatusCardIdentifier.value = 1;
    } else if (ujian.status_valid === 0) {
        statuses.ujianTA.value = STATUS.WAITING;
        StatusCardIdentifier.value = 2;
    } else if (ujian.status_valid === 1) {
        statuses.ujianTA.value = STATUS.ACCEPTED;
        StatusCardIdentifier.value = 2;
    } else if (ujian.status_valid === 2) {
        statuses.ujianTA.value = STATUS.REJECTED;
        StatusCardIdentifier.value = 2;
    }
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
                status_request: val.request_pembimbing?.stattus ?? null,
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
    if (data.nilai_akhir !== null) return 5;
    if (data.status_valid === 1) return 4;
    if (data.bimbingan?.total_bimbingan >= 9) return 3;
    if (data.proposal?.proposal !== null) return 2;
    if (data.proposal?.id !== null) return 1;
    if (data.dosen_pembimbing !== null) return 0;
    return -1;
});

