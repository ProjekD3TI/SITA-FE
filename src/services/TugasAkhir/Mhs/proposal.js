import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import filePDF from "@/assets/SV-Undangan Sosialisasi Teknis dan Informasi Lomba OLIVIA Tahun 2025.pdf"


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
            // const authToken = VueCookies.get("auth_token");
            // const headers = {
            //     'Authorization': `Bearer ${authToken}`,
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json'
            // };

            // const response = await axios.get("/api/mahasiswa/tugas-akhir/proposal", { headers });
            await new Promise(resolve => setTimeout(resolve, 1000));
            dataProposal.value = {
                tugas_akhir: {
                    id: 1,
                    dosen_pembimbing: {
                        id: 1,
                        nama: "Prof. Dr. Budi Santoso, M.Kom",
                    },
                    kategori_ta: {
                        id: 1,
                        nama: "Internet of Things",
                    },
                    tahun_ajaran: {
                        id: 1,
                        nama: "2024/2025",
                    },
                    proposal_id: 1,
                    nilai_proposal: null,
                    catatan_proposal: null //"Proposal sudah sesuai dengan pedoman",
                },
                proposal: {
                    id: 1,
                    judul_proposal: "Pengembangan El Pikir Satu Dua Tiga",
                    status_valid: 1,
                    berkas: [
                        {
                            id: 1,
                            nama_berkas: "Naskah Proposal Tugas Akhir",
                            file_path: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 2,
                            nama_berkas: "Transkrip Nilai Mahasiswa",
                            file_path: filePDF,
                            status_valid: 1,
                        },
                    ]
                }
            }
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
        fetchData,
    };
}

// --- KOMPUTED PROPOSAL ---
function getFileName(filePath) {
    return filePath ? decodeURIComponent(filePath.split('/').pop()) : '';
}

// computed properties for existing file names
export const hasPembimbing = computed(() => dataProposal.value?.tugas_akhir?.dosen_pembimbing?.id != null || 0);
export const dinilai = computed(() => dataProposal.value?.tugas_akhir?.nilai_proposal != null);
export const judulProposalTA = computed(() => dataProposal.value?.proposal?.judul_proposal || '');
export const naskahProposalTA = computed(() => {
    const filePath = dataProposal.value?.proposal?.berkas?.find(
        berkas => berkas.nama_berkas === "Naskah Proposal Tugas Akhir"
    )?.file_path;
    return getFileName(filePath);
});
export const transkripNilaiMahasiswa = computed(() => {
    const filePath = dataProposal.value?.proposal?.berkas?.find(
        berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa"
    )?.file_path;
    return getFileName(filePath);
});
export const statusProposalTA = computed(() => dataProposal.value?.proposal?.status_valid);
export const fileNaskahProposalTA = computed(() => dataProposal.value?.proposal?.berkas?.find(berkas => berkas.nama_berkas === "Naskah Proposal Tugas Akhir")?.file_path || '');
export const fileTranskripNilaiMahasiswa = computed(() => dataProposal.value?.proposal?.berkas?.find(berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa")?.file_path || '');
export const nilaiProposalTA = computed(() => dataProposal.value?.tugas_akhir?.nilai_proposal || null);
export const catatanProposalTA = computed(() => dataProposal.value?.tugas_akhir?.catatan_proposal || 'Tidak ada catatan');
export const naskahProposalTAStatus = computed(() => {
    return dataProposal.value?.proposal?.berkas?.find(berkas => berkas.nama_berkas === "Naskah Proposal Tugas Akhir")?.status_valid || null;
});
export const transkripNilaiMahasiswaStatus = computed(() => {
    return dataProposal.value?.proposal?.berkas?.find(berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa")?.status_valid || null;
});
export const namaPembimbing = computed(() => {
    return dataProposal.value?.tugas_akhir?.dosen_pembimbing?.nama || 'Tidak ada pembimbing';
});
export const kategoriTA = computed(() => {
    return dataProposal.value?.tugas_akhir?.kategori_ta?.nama || 'Tidak ada kategori TA';
});
export const tahunAjaranTA = computed(() => {
    return dataProposal.value?.tugas_akhir?.tahun_ajaran?.nama || 'Tidak ada tahun ajaran';
});

// Status constants for better readability
export const STATUS = {
    WAITING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    NULL: null
};

export const overallStatus = computed(() => {
    const berkas = dataProposal.value?.proposal?.berkas || [];

    const naskah = berkas.find(b => b.nama_berkas === "Naskah Proposal Tugas Akhir");
    const transkrip = berkas.find(b => b.nama_berkas === "Transkrip Nilai Mahasiswa");

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
        (overallStatus.value === STATUS.WAITING || overallStatus.value === STATUS.ACCEPTED);
    const isOpacity = isDisabled;

    return {
        isDisabled,
        wrapperClass: isOpacity ? 'opacity-50' : '',
        showSubmitButton:
            naskahProposalTA &&
            (overallStatus.value === STATUS.NULL || overallStatus.value === STATUS.REJECTED)
    };
});