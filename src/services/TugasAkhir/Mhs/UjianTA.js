import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
const router = useRouter();
const toast = useToast();

export function useBerkasTA() {
    let abortController = null;
    const loadingUjianTA = ref(false);
    const errorUjianTA = ref(null);
    const dataUjianTA = ref(null);
    const fetchData = async () => {
        loadingUjianTA.value = true;
        try {
            // const authToken = VueCookies.get("auth_token");
            // const headers = {
            //     'Authorization': `Bearer ${authToken}`,
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json'
            // };

            // const response = await axios.get("/api/mahasiswa/tugas-akhir/ujian-ta", { headers });
            await new Promise(resolve => setTimeout(resolve, 1000));
            dataUjianTA.value = {
                bimbingan: {
                    total_bimbingan: 5,
                    progress_bimbingan: 5
                },
                tugas_akhir: {
                    id: 1,
                    judul_tugas_akhir: "Pengembangan El Pikir Satu Dua Tiga",
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
                    status_valid: 1,
                    berkas: [
                        {
                            id: 1,
                            nama_berkas: "Naskah Tugas Akhir",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 2,
                            nama_berkas: "Transkrip Nilai Mahasiswa",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 3,
                            nama_berkas: "Scan KRS Semester Akhir",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 4,
                            nama_berkas: "Bukti Persetujuan Pembimbing",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 5,
                            nama_berkas: "Bukti Sertifikat Kompetensi",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 6,
                            nama_berkas: "Sertifikat TOEIC",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 7,
                            nama_berkas: "Berita Acara Seminar Hasil",
                            file_proposal: filePDF,
                            status_valid: 1,
                        },
                        {
                            id: 8,
                            nama_berkas: "Surat Perpanjangan Masa Studi",
                            file_proposal: filePDF,
                            status_valid: 1,
                        }
                    ]
                },
                ujian_ta: {
                    id: 1,
                    ruang: {
                        id: 1,
                        nama: "Ruang Seminar 1",
                    },
                    tanggal: "2024-05-01",
                    sesi: {
                        id: 1,
                        nama: "Pagi",
                        waktu_mulai: "08:00",
                        waktu_selesai: "10:00",
                    },
                },
                dosen_penguji: [
                    {
                        dosen: {
                            id: 1,
                            nama: "Prof. Dr. Budi Santoso, M.Kom",
                        },
                        jabatan: "Sekretaris"
                    },
                    {
                        dosen: {
                            id: 2,
                            nama: "Dr. Siti Aminah, M.T.",
                        },
                        jabatan: "Ketua"
                    },
                    {
                        dosen: {
                            id: 3,
                            nama: "Dr. Ahmad Fauzi, M.Kom",
                        },
                        jabatan: "Penguji"
                    }
                ]
            }
        } catch (err) {
            handleError(err);
        } finally {
            loadingUjianTA.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/mahasiswa/login");
        } else {
            errorUjianTA.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorUjianTA.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) abortController.abort();
    });

    return {
        loadingUjianTA,
        errorUjianTA,
        dataUjianTA,
        fetchData,
    };
}

// nilai_ujian_ta: {
//     id: 1,
//         kualitas_tata_laporan: 80,
//             kemampuan_teknis: 85,
//                 kualitas_produk: 90,
//                     presentasi: 90,
//                         rerata_ujian: 85,
// },