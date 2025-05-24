import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import filePDF from "@/assets/SV-Undangan Sosialisasi Teknis dan Informasi Lomba OLIVIA Tahun 2025"


// --- STATE GLOBAL ---
const router = useRouter();
const toast = useToast();

// --- API SIMULASI ---
export function useProposal() {
    let abortController = null;
    const loadingProposal = ref(false);
    const errorProposal = ref(null);
    const dataProposal = ref(null);
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
                        nama: "2023/2024",
                    },
                    proposal_id: 1,
                    nilai_proposal: 80,
                    catatan_proposal: "Proposal sudah sesuai dengan pedoman",
                },
                proposal: {
                    id: 1,
                    judul_proposal: "Pengembangan El Pikir Satu Dua Tiga",
                    status_valid: 1,
                    berkas: [
                        {
                            id: 1,
                            nama_berkas: "Naskah Proposal Tugas Akhir",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 2,
                            nama_berkas: "Transkrip Nilai Mahasiswa",
                            file_proposal: filePDF,
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