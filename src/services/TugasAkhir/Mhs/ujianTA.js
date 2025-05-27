import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

// --- STATE GLOBAL ---
export const dataTugasAkhir = ref(null);
const dataBerkasTA = ref(null);
export const dataNilaiUjianTA = ref(null);
const dataJadwalUjianTA = ref(null);

// --- API SIMULASI ---

export function useTugasAkhir() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingTugasAkhir = ref(false);
    const errorTugasAkhir = ref(null);
    const fetchData = async () => {
        loadingTugasAkhir.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/mahasiswa/ujian-ta", { headers });
            dataTugasAkhir.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingTugasAkhir.value = false;
        }
    };

    const submitUjianTA = async ({
        judul_ta,
        file_naskah,
        file_transkrip,
        file_krs,
        file_persetujuan_pembimbing,
        file_sertifikat_kompetensi,
        file_toeic,
        file_berita_acara,
        file_perpanjangan_masa_studi,
    }) => {
        loadingTugasAkhir.value = true;
        errorTugasAkhir.value = null;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            };
            const formData = new FormData();
            formData.append("judul_tugas_akhir", judul_ta); // <-- SAMA dengan backend
            if (file_naskah) formData.append("naskah_ta", file_naskah);
            if (file_krs) formData.append("krs", file_krs);
            if (file_persetujuan_pembimbing) formData.append("persetujuan_pembimbing", file_persetujuan_pembimbing);
            if (file_transkrip) formData.append("transkrip_nilai", file_transkrip);
            if (file_sertifikat_kompetensi) formData.append("sertifikat_kompetensi", file_sertifikat_kompetensi);
            if (file_toeic) formData.append("toeic", file_toeic);
            if (file_berita_acara) formData.append("berita_acara_semhas", file_berita_acara);
            if (file_perpanjangan_masa_studi) formData.append("surat_perpanjangan_studi", file_perpanjangan_masa_studi);

            await axios.post("/api/mahasiswa/tugas-akhir/daftar", formData, { headers });
            toast.success("Pendaftaran Ujian TA berhasil dikirim!");
            return true;
        } catch (err) {
            handleError(err, router, toast);
            return false;
        } finally {
            loadingTugasAkhir.value = false;
        }
    };

    // --- UPDATE UJIAN TA ---
    const updateUjianTA = async ({
        id,
        judul_ta,
        file_naskah,
        file_transkrip,
        file_krs,
        file_persetujuan_pembimbing,
        file_sertifikat_kompetensi,
        file_toeic,
        file_berita_acara,
        file_perpanjangan_masa_studi,
    }) => {
        loadingTugasAkhir.value = true;
        errorTugasAkhir.value = null;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            };
            const formData = new FormData();
            formData.append("judul_tugas_akhir", judul_ta);
            if (file_naskah) formData.append("naskah_ta", file_naskah);
            if (file_krs) formData.append("krs", file_krs);
            if (file_persetujuan_pembimbing) formData.append("persetujuan_pembimbing", file_persetujuan_pembimbing);
            if (file_transkrip) formData.append("transkrip_nilai", file_transkrip);
            if (file_sertifikat_kompetensi) formData.append("sertifikat_kompetensi", file_sertifikat_kompetensi);
            if (file_toeic) formData.append("toeic", file_toeic);
            if (file_berita_acara) formData.append("berita_acara_semhas", file_berita_acara);
            if (file_perpanjangan_masa_studi) formData.append("surat_perpanjangan_studi", file_perpanjangan_masa_studi);

            await axios.post(`/api/mahasiswa/tugas-akhir/${id}/update`, formData, { headers });
            toast.success("Pengajuan Ujian TA berhasil diupdate!");
            return true;
        } catch (err) {
            handleError(err, router, toast);
            return false;
        } finally {
            loadingTugasAkhir.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/mahasiswa/login");
        } else {
            errorTugasAkhir.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorTugasAkhir.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) abortController.abort();
    });

    return {
        loadingTugasAkhir,
        errorTugasAkhir,
        dataTugasAkhir,
        fetchData,
        submitUjianTA,
        updateUjianTA,
    };
}

export function useBerkasTA() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingBerkasTA = ref(false);
    const errorBerkasTA = ref(null);
    const fetchDataBerkas = async () => {
        loadingBerkasTA.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/mahasiswa/berkas/ujian-ta", { headers });
            dataBerkasTA.value = response.data.data;
            // await new Promise(resolve => setTimeout(resolve, 1000));
            // dataBerkasTA.value = {
            //     berkas: [
            //         {
            //             id: null,//1,
            //             nama_berkas: null,//"Naskah Tugas Akhir",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//2,
            //             nama_berkas: null,//"Transkrip Nilai Mahasiswa",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//3,
            //             nama_berkas: null,//"Scan KRS Semester Akhir",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//4,
            //             nama_berkas: null,//"Bukti Persetujuan Pembimbing",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//5,
            //             nama_berkas: null,//"Bukti Sertifikat Kompetensi",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//6,
            //             nama_berkas: null,//"Sertifikat TOEIC",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//7,
            //             nama_berkas: null,//"Berita Acara Seminar Hasil",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         },
            //         {
            //             id: null,//8,
            //             nama_berkas: null,//"Surat Perpanjangan Masa Studi",
            //             file_path: null,//filePDF,
            //             status_valid: null,//1,
            //         }
            //     ]
            // }
        } catch (err) {
            handleError(err);
        } finally {
            loadingBerkasTA.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/mahasiswa/login");
        } else {
            errorBerkasTA.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorBerkasTA.value);
        }
    };

    onMounted(() => {
        fetchDataBerkas();
    });

    onUnmounted(() => {
        if (abortController) abortController.abort();
    });

    return {
        loadingBerkasTA,
        errorBerkasTA,
        dataBerkasTA,
        fetchDataBerkas,
    };
}

export function useNilaiUjianTA() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingNilaiUjianTA = ref(false);
    const errorNilaiUjianTA = ref(null);
    const fetchData = async () => {
        loadingNilaiUjianTA.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/mahasiswa/ujian-ta/nilai-ujian", { headers });
            dataNilaiUjianTA.value = response.data.data;
            // await new Promise(resolve => setTimeout(resolve, 1000));
            // dataNilaiUjianTA.value = {
            //     dosen_penguji: [
            //         {
            //             id: null,//1,
            //             nama: null,//"Prof. Dr. Budi Santoso, M.Kom",
            //             nilai_ujian_ta: {
            //                 id: null,//1,
            //                 kualitas_tata_laporan: null,//80,
            //                 kemampuan_teknis: null,//85,
            //                 kualitas_produk: null,//90,
            //                 presentasi: null,//90,
            //                 rerata_ujian: null,//85,
            //             }
            //         },
            //         {
            //             id: null,//2,
            //             nama: null,//"Dr. Siti Aminah, M.T.",
            //             nilai_ujian_ta: {
            //                 id: null,//2,
            //                 kualitas_tata_laporan: null,//80,
            //                 kemampuan_teknis: null,//85,
            //                 kualitas_produk: null,//90,
            //                 presentasi: null,//90,
            //                 rerata_ujian: null,//85,
            //             }
            //         },
            //         {
            //             id: null,//3,
            //             nama: null,//"Dr. Ahmad Fauzi, M.Kom",
            //             nilai_ujian_ta: {
            //                 id: null,//3,
            //                 kualitas_tata_laporan: null,//80,
            //                 kemampuan_teknis: null,//85,
            //                 kualitas_produk: null,//90,
            //                 presentasi: null,//90,
            //                 rerata_ujian: null,//85,
            //             }
            //         }
            //     ]
            // }
        } catch (err) {
            handleError(err);
        } finally {
            loadingNilaiUjianTA.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/mahasiswa/login");
        } else {
            errorNilaiUjianTA.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorNilaiUjianTA.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) abortController.abort();
    });

    return {
        loadingNilaiUjianTA,
        errorNilaiUjianTA,
        dataNilaiUjianTA,
        fetchData,
    };
}

export function useJadwalUjianTA() {
    let abortController = null;
    const router = useRouter();
    const toast = useToast();
    const loadingJadwalUjianTA = ref(false);
    const errorJadwalUjianTA = ref(null);
    const fetchData = async () => {
        loadingJadwalUjianTA.value = true;
        try {
            const authToken = VueCookies.get("auth_token");
            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            const response = await axios.get("/api/mahasiswa/ujian-ta/jadwal-ujian", { headers });
            dataJadwalUjianTA.value = response.data.data;
        } catch (err) {
            handleError(err);
        } finally {
            loadingJadwalUjianTA.value = false;
        }
    };

    const handleError = (err) => {
        if (err.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/mahasiswa/login");
        } else {
            errorJadwalUjianTA.value = err.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorJadwalUjianTA.value);
        }
    };

    onMounted(() => {
        fetchData();
    });

    onUnmounted(() => {
        if (abortController) abortController.abort();
    });

    return {
        loadingJadwalUjianTA,
        errorJadwalUjianTA,
        dataJadwalUjianTA,
        fetchData,
    };
}

// --- Converter name FILE PDF ---
function getFileName(filePath) {
    return filePath ? decodeURIComponent(filePath.split('/').pop()) : '';
}

function formatTanggalIndonesia(tanggalStr) {
    const tanggal = new Date(tanggalStr);
    return tanggal.toLocaleDateString('id-ID', {
        weekday: 'long',    // nama hari
        day: '2-digit',     // tanggal dua digit
        month: 'short',     // bulan singkat (Mei, Jun, dst)
        year: 'numeric'     // tahun 4 digit
    });
}

// computed properties

// --- Tugas Akhir ---
export const dosenPembimbing = computed(() => dataTugasAkhir.value?.tugas_akhir?.dosen_pembimbing?.nama);
export const kategoriTA = computed(() => dataTugasAkhir.value?.tugas_akhir?.kategori_ta?.nama);
export const tahunAjaranTA = computed(() => dataTugasAkhir.value?.tugas_akhir?.tahun_ajaran?.nama);
export const statusValid = computed(() => dataTugasAkhir.value?.tugas_akhir?.status_valid);
export const totalBimbingan = computed(() => dataTugasAkhir.value?.bimbingan?.total_bimbingan);
export const judulTugasAkhir = computed(() => dataTugasAkhir.value?.tugas_akhir?.judul_tugas_akhir);

// --- Berkas Tugas Akhir ---
// nama berkas
export const naskahTA = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Naskah Tugas Akhir"
    )?.file_path;
    return getFileName(filePath);
});
export const transkripNilai = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa"
    )?.file_path;
    return getFileName(filePath);
});
export const krs = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Scan KRS Semester Akhir"
    )?.file_path;
    return getFileName(filePath);
});
export const buktiPersetujuanPembimbing = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Bukti Persetujuan Pembimbing"
    )?.file_path;
    return getFileName(filePath);
});
export const buktiSertifikatKompetensi = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Bukti Sertifikat Kompetensi"
    )?.file_path;
    return getFileName(filePath);
});
export const sertifikatTOEIC = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Sertifikat TOEIC"
    )?.file_path;
    return getFileName(filePath);
});
export const beritaAcaraSeminarHasil = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Berita Acara Seminar Hasil"
    )?.file_path;
    return getFileName(filePath);
});
export const suratPerpanjanganMasaStudi = computed(() => {
    const filePath = dataBerkasTA.value?.berkas?.find(
        berkas => berkas.nama_berkas === "Surat Perpanjangan Masa Studi"
    )?.file_path;
    return getFileName(filePath);
});

// download url berkas

export const fileNaskahTA = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Naskah Tugas Akhir")?.download_url || '';
});
export const fileTranskripNilai = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa")?.download_url || '';
});
export const fileKRS = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Scan KRS Semester Akhir")?.download_url || '';
});
export const fileBuktiPersetujuanPembimbing = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Bukti Persetujuan Pembimbing")?.download_url || '';
});
export const fileBuktiSertifikatKompetensi = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Bukti Sertifikat Kompetensi")?.download_url || '';
});
export const fileSertifikatTOEIC = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Sertifikat TOEIC")?.download_url || '';
});
export const fileBeritaAcaraSeminarHasil = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Berita Acara Seminar Hasil")?.download_url || '';
});
export const fileSuratPerpanjanganMasaStudi = computed(() => {
    return dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Surat Perpanjangan Masa Studi")?.download_url || '';
});
// status berkas
export const statusBerkasNaskahTA = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Naskah Tugas Akhir");
    return found ? found.status_valid : null;
});
export const statusBerkasTranskripNilai = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Transkrip Nilai Mahasiswa");
    return found ? found.status_valid : null;
});
export const statusBerkasKRS = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Scan KRS Semester Akhir");
    return found ? found.status_valid : null;
});
export const statusBerkasBuktiPersetujuanPembimbing = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Bukti Persetujuan Pembimbing");
    return found ? found.status_valid : null;
});
export const statusBerkasBuktiSertifikatKompetensi = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Bukti Sertifikat Kompetensi");
    return found ? found.status_valid : null;
});
export const statusBerkasSertifikatTOEIC = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Sertifikat TOEIC");
    return found ? found.status_valid : null;
});
export const statusBerkasBeritaAcaraSeminarHasil = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Berita Acara Seminar Hasil");
    return found ? found.status_valid : null;
});
export const statusBerkasSuratPerpanjanganMasaStudi = computed(() => {
    const found = dataBerkasTA.value?.berkas?.find(berkas => berkas.nama_berkas === "Surat Perpanjangan Masa Studi");
    return found ? found.status_valid : null;
});

// --- Jadwal Ujian TA ---
export const jadwalUjianTA = computed(() => {
    const ujian = dataJadwalUjianTA.value?.ujian_ta;
    if (!ujian) return { date: '', time: '', room: '' };

    return {
        date: ujian.tanggal ? formatTanggalIndonesia(ujian.tanggal) : '',
        time: ujian.sesi ? `${ujian.sesi.waktu_mulai} - ${ujian.sesi.waktu_selesai}` : '',
        room: ujian.ruang?.nama || ''
    };
});
export const daftarPenguji = computed(() => {
    const pengujiArr = dataJadwalUjianTA.value?.dosen_penguji || [];
    return pengujiArr.map(dosen => ({
        name: dosen.dosen?.nama || '',
        role: dosen.dosen?.jabatan || ''
    }));
});

// --- Nilai Ujian TA ---
export const catatanRevisi = computed(() => {
    const penguji = dataNilaiUjianTA.value?.dosen_penguji || [];
    // Return array of { nama, revisi }
    return penguji.map(d => ({
        nama: d.nama || '',
        revisi: d.revisi || ''
    }));
});
export const rataRataNilaiUjianTA = computed(() => {
    const penguji = dataNilaiUjianTA.value?.dosen_penguji || [];
    if (penguji.length === 0) return {
        kualitas_tata_laporan: 0,
        kemampuan_teknis: 0,
        kualitas_produk: 0,
        presentasi: 0,
        rerata_ujian: 0,
    };

    let total = {
        kualitas_tata_laporan: 0,
        kemampuan_teknis: 0,
        kualitas_produk: 0,
        presentasi: 0,
        rerata_ujian: 0,
    };

    penguji.forEach(dosen => {
        const nilai = dosen.nilai_ujian_ta || {};
        total.kualitas_tata_laporan += nilai.kualitas_tata_laporan || 0;
        total.kemampuan_teknis += nilai.kemampuan_teknis || 0;
        total.kualitas_produk += nilai.kualitas_produk || 0;
        total.presentasi += nilai.presentasi || 0;
        total.rerata_ujian += nilai.rerata_ujian || 0;
    });

    return {
        kualitas_tata_laporan: Math.round(total.kualitas_tata_laporan / penguji.length),
        kemampuan_teknis: Math.round(total.kemampuan_teknis / penguji.length),
        kualitas_produk: Math.round(total.kualitas_produk / penguji.length),
        presentasi: Math.round(total.presentasi / penguji.length),
        rerata_ujian: Math.round(total.rerata_ujian / penguji.length),
    };
});

export const kualitas_tata_laporan = computed(() => {
    return rataRataNilaiUjianTA.value.kualitas_tata_laporan;
}
);
export const kemampuan_teknis = computed(() => {
    return rataRataNilaiUjianTA.value.kemampuan_teknis;
});
export const kualitas_produk = computed(() => {
    return rataRataNilaiUjianTA.value.kualitas_produk;
});
export const presentasi = computed(() => {
    return rataRataNilaiUjianTA.value.presentasi;
});
export const rerata_ujian = computed(() => {
    return rataRataNilaiUjianTA.value.rerata_ujian;
});

// --- FILE PDF ---
export async function getFileBlobUrl(downloadUrl) {
    const authToken = VueCookies.get("auth_token");
    const response = await fetch(downloadUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/pdf"
        }
    });
    if (!response.ok) throw new Error("Gagal mengambil file");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

