<script setup>
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import { ref, computed, onMounted, watch } from "vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import Slider from "@/components/Tugas-akhir/Slider.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";
import Loading from "@/components/Loading.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import JadwalUjian from "@/components/Tugas-akhir/JadwalUjian.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";
import ValidationFile from "@/components/Tugas-akhir/Forms/ValidationFile.vue";
import { useToast } from "vue-toastification";
import Button from "@/components/Tugas-akhir/Button.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import {
  useTabelPlottingPenguji,
  useTabelPendaftar,
  useTabelPenjadwalan,
} from "@/services/TugasAkhir/Admin/ujianTA";

const {
  dataTabelPlottingPenguji,
  loadingTabelPlottingPenguji,
  errorTabelPlottingPenguji,
  paginationTabelPlottingPenguji,
  fetchTabelPlottingPenguji,
} = useTabelPlottingPenguji();

const {
  dataTabelPendaftar,
  loadingTabelPendaftar,
  errorTabelPendaftar,
  paginationTabelPendaftar,
  fetchTabelPendaftar,
  updateStatusForm,
} = useTabelPendaftar();

const {
  dataTabelPenjadwalan,
  loadingTabelPenjadwalan,
  errorTabelPenjadwalan,
  paginationTabelPenjadwalan,
  fetchTabelPenjadwalan,
} = useTabelPenjadwalan();

const toast = useToast();
const route = useRoute();
const router = useRouter();

const modalRef = ref(false);
const modalRef1 = ref(false);

const currentPageTabelPendaftar = ref(1);
const currentPageTabelPlottingPenguji = ref(1);
const currentPageTabelPenjadwalan = ref(1);
const selectedJadwalItem = ref(null);

const dataNaskahTA = ref({});
const dataTranskrip = ref({});
const dataKRS = ref({});
const dataPersetujuanPembimbing = ref({});
const dataSertifikatKompetensi = ref({});
const dataSertifikatTOEIC = ref({});
const dataBeritaAcaraSemhas = ref({});
const dataMasaPerpanjanganStudi = ref({});

const modalHeadText = ref("");
const modalBodyText = ref("");
const fileNaskahTA = ref(null);
const fileKRS = ref(null);
const filePersetujuanPembimbing = ref(null);
const fileTranskrip = ref(null);
const fileSertifikatKompetensi = ref(null);
const fileSertifikatTOEIC = ref(null);
const fileBeritaAcaraSemhas = ref(null);
const fileMasaPerpanjanganStudi = ref(null);
const catatan = ref("");
const modalRef2 = ref(false);
const tempValidasi = ref({
  naskah_ta_status_valid: null,
  krs_status_valid: null,
  persetujuan_pembimbing_status_valid: null,
  sertifikat_kompetensi_status_valid: null,
  toeic_status_valid: null,
  berita_acara_semhas_status_valid: null,
  masa_perpanjangan_studi_status_valid: null,
  file_transkrip_status_valid: null,
});

function getUjianStatus(berkas) {
  // Kumpulkan semua status valid dari setiap berkas
  const statusList = [
    berkas?.naskah_ta_status_valid,
    berkas?.file_transkrip_status_valid,
    berkas?.krs_status_valid,
    berkas?.persetujuan_pembimbing_status_valid,
    berkas?.sertifikat_kompetensi_status_valid,
    berkas?.toeic_status_valid,
    berkas?.berita_acara_semhas_status_valid,
    berkas?.masa_perpanjangan_studi_status_valid,
  ].filter((s) => s !== undefined && s !== null);

  if (statusList.length === 0) return "0"; // default menunggu jika tidak ada data

  if (statusList.every((s) => s === 1)) return "1"; // Semua valid
  if (statusList.some((s) => s === 2)) return "2"; // Ada yang ditolak
  if (statusList.every((s) => s === 0)) return "0"; // Semua menunggu
  // Jika campuran 0 dan 1, anggap menunggu
  return "0";
}

// Ambil status_form.is_open dari dataTabelPendaftar
const statusForm = ref(0);
watch(
  () => dataTabelPendaftar.value?.status_form?.is_open,
  (val) => {
    if (typeof val !== "undefined") statusForm.value = val;
  },
  { immediate: true }
);

// Untuk data pendaftar, akses arraynya:
const pendaftarUjianWithStatus = computed(() =>
  (dataTabelPendaftar.value?.data || []).map((item) => ({
    tugas_akhir_id: item.tugas_akhir_id,
    nim: item.mahasiswa?.nim || "-",
    nama: item.mahasiswa?.name || "-",
    judul_ta: item.judul_tugas_akhir || "-",
    dosen_pembimbing: item.dosen_pembimbing || "-",
    tanggal: item.tanggal || "-", // tambahkan jika ada field tanggal
    status: String(item.status_valid ?? "0"),
    tugas_akhir_id: item.tugas_akhir_id,
    berkas: item.berkas || [], // <-- TAMBAHKAN INI!
  }))
);
onMounted(() => {
  if (route.query.tab && tabs.some((t) => t.id === route.query.tab)) {
    selectedTab.value = route.query.tab;
    // Hapus query 'tab' dari URL setelah tab aktif
    router.replace({ query: { ...route.query, tab: undefined } });
  }
});

watch(
  () => dataTabelPendaftar.value?.status_form?.is_open,
  (val) => {
    if (typeof val !== "undefined") statusForm.value = val;
  },
  { immediate: true }
);
const isDataLoaded = ref(false);
onMounted(async () => {
  try {
    await Promise.all([]);
    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error saat memuat komponen:", error);
  }
});

const statuses = [
  { value: "1", label: "Disetujui" },
  { value: "0", label: "Menunggu" },
  { value: "2", label: "Ditolak" },
];

const daftarPenguji = computed(() => {
  const pengujiArr = selectedJadwalItem.value?.dosen_penguji || [];
  return pengujiArr.map((dosen) => ({
    name: dosen.name || "", // sesuai struktur API Anda
    role: dosen.jabatan_penguji || "",
  }));
});

// Ambil jadwal dari item yang dipilih
const jadwalUjianTA = computed(() => {
  // Cek apakah data ada di .ujian_ta atau langsung di selectedJadwalItem
  const ujian = selectedJadwalItem.value?.ujian_ta || selectedJadwalItem.value;
  if (!ujian) return { date: "", time: "", room: "" };
  return {
    date: ujian.tanggal_ujian || "",
    time:
      ujian.waktu_mulai && ujian.waktu_selesai
        ? `${ujian.waktu_mulai} - ${ujian.waktu_selesai}`
        : "",
    room: ujian.ruang || "",
  };
});

const countPlottingMenunggu = computed(
  () =>
    (dataTabelPlottingPenguji.value || []).filter(
      (item) => !item.dosen_penguji || item.dosen_penguji.length < 3
    ).length
);
// Hitung jumlah pendaftar ujian dengan status '0' (Menunggu)
const countPendaftarMenunggu = computed(
  () =>
    (dataTabelPendaftar.value?.data || []).filter(
      (item) => item.status_valid === 0
    ).length
);
// Hitung jumlah penjadwalan dengan status menunggu (status === '1' dan jadwal null)
const countPenjadwalanMenunggu = computed(
  () =>
    (dataTabelPenjadwalan.value || []).filter((item) => !item.ujian_ta).length
);

const tabs = [
  {
    id: "tab1",
    label: "Plotting Penguji",
    icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    count: countPlottingMenunggu,
  },
  {
    id: "tab2",
    label: "Pendaftar",
    icon: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
    count: countPendaftarMenunggu,
  },
  {
    id: "tab3",
    label: "Jadwal & Berita Acara",
    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1-2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    count: countPenjadwalanMenunggu,
  },
  // {
  //   id: "tab4",
  //   label: "Berita Acara",
  //   icon: "M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z",
  // },
];

// State untuk search & filter tiap tab
const searchQueryTab1 = ref("");
const searchQueryTab2 = ref("");
const searchQueryTab3 = ref("");
const selectedStatusesTab1 = ref([]);
const selectedStatusesTab2 = ref([]);
const selectedStatusesTab3 = ref([]);

const plottingPengujiWithStatus = computed(() =>
  (dataTabelPlottingPenguji.value || []).map((item) => ({
    nim: item.mahasiswa?.nim || "-",
    nama: item.mahasiswa?.name || "-",
    judul_proposal_ta: item.judul_proposal || "-",
    dosen_pembimbing: item.dosen_pembimbing || "-",
    dosen_penguji: item.dosen_penguji || [],
    status: item.dosen_penguji && item.dosen_penguji.length === 3 ? "1" : "0", // 1=Disetujui, 0=Menunggu
    tugas_akhir_id: item.tugas_akhir_id,
  }))
);

const filteredPlottingPengujiWithStatus = computed(() => {
  let data = plottingPengujiWithStatus.value;
  if (selectedStatusesTab1.value.length > 0) {
    data = data.filter((item) =>
      selectedStatusesTab1.value.includes(item.status)
    );
  }
  const q =
    typeof searchQueryTab1.value === "string"
      ? searchQueryTab1.value.toLowerCase()
      : "";
  if (!q) return data;
  return data.filter(
    (item) =>
      item.nim.toLowerCase().includes(q) ||
      item.nama.toLowerCase().includes(q) ||
      (item.judul_proposal_ta &&
        item.judul_proposal_ta.toLowerCase().includes(q)) ||
      (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(q))
  );
});

const filteredPendaftarUjian = computed(() => {
  let data = pendaftarUjianWithStatus.value;
  if (selectedStatusesTab2.value.length > 0) {
    data = data.filter((item) =>
      selectedStatusesTab2.value.includes(item.status)
    );
  }
  const q =
    typeof searchQueryTab2.value === "string"
      ? searchQueryTab2.value.toLowerCase()
      : "";
  if (!q) return data;
  return data.filter(
    (item) =>
      item.nim.toLowerCase().includes(q) ||
      item.nama.toLowerCase().includes(q) ||
      (item.judul_ta && item.judul_ta.toLowerCase().includes(q))
  );
});

const penjadwalanWithStatus = computed(() =>
  (dataTabelPenjadwalan.value || []).map((item) => ({
    nim: item.mahasiswa?.nim || "-",
    nama: item.mahasiswa?.name || "-",
    judul_ta: item.judul_tugas_akhir || "-",
    dosen_pembimbing: item.dosen_pembimbing?.name || "-",
    tanggal: item.ujian_ta?.tanggal_ujian || "-",
    waktu_mulai: item.ujian_ta?.waktu_mulai || "-",
    waktu_selesai: item.ujian_ta?.waktu_selesai || "-",
    ruang: item.ujian_ta?.ruang || "-",
    status: item.ujian_ta ? "1" : "0", // '1' jika sudah ada jadwal, '0' jika belum
    tugas_akhir_id: item.tugas_akhir_id,
    dosen_penguji: item.dosen_penguji || [],
    jadwal: item.ujian_ta?.id || null,
    status_kelulusan: item.status_kelulusan || null,
    ujian_ta: item.ujian_ta || null,
  }))
);

const filteredPenjadwalan = computed(() => {
  let data = penjadwalanWithStatus.value;
  if (selectedStatusesTab3.value.length > 0) {
    data = data.filter((item) =>
      selectedStatusesTab3.value.includes(item.status)
    );
  }
  const q =
    typeof searchQueryTab3.value === "string"
      ? searchQueryTab3.value.toLowerCase()
      : "";
  if (!q) return data;
  return data.filter(
    (item) =>
      item.nim.toLowerCase().includes(q) ||
      item.nama.toLowerCase().includes(q) ||
      (item.judul_ta && item.judul_ta.toLowerCase().includes(q)) ||
      (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(q))
  );
});

// Handler filter & search tiap tab
function handleFilterTab1({ values }) {
  selectedStatusesTab1.value = values;
}
function handleFilterTab2({ values }) {
  selectedStatusesTab2.value = values;
}
function handleFilterTab3({ values }) {
  selectedStatusesTab3.value = values;
}

// Handler tab change: reset search & filter tiap tab
const selectedTab = ref("tab1");
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryTab1.value = "";
  searchQueryTab2.value = "";
  searchQueryTab3.value = "";
  selectedStatusesTab1.value = [];
  selectedStatusesTab2.value = [];
  selectedStatusesTab3.value = [];
}

const formatTanggal = (tanggal) => {
  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const [year, month, day] = tanggal.split("-");
  return `${day} ${bulan[parseInt(month, 10) - 1]} ${year}`;
};

const getStatusClass = (status) => {
  switch (status) {
    case "1":
      return "success";
    case "0":
      return "warning";
    case "2":
      return "danger";
    default:
      return "default";
  }
};

const getStatusClassBeritaAcara = (status) => {
  switch (status) {
    case 1:
      return "success-outline";
    case 2:
      return "success-outline";
    case 3:
      return "warning-outline";
    case 4:
      return "danger-outline";
    default:
      return "default";
  }
};

const getStatusLabelPlotting = (status) => {
  switch (status) {
    case "1":
      return "Terplotting";
    case "0":
      return "Menunggu";
    case "2":
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};
const getStatusLabelPendaftar = (status) => {
  switch (status) {
    case "1":
      return "Diterima";
    case "0":
      return "Menunggu";
    case "2":
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};
const getStatusLabelBeritaAcara = (status) => {
  switch (status) {
    case 1:
      return "Lulus";
    case 2:
      return "Lulus(Revisi)";
    case 3:
      return "Revisi";
    case 4:
      return "Tidak Lulus";
    default:
      return "Tidak Diketahui";
  }
};
const getFileName = (filePath) => {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
};
const handleRowClickPlot = (item) => {
  router.push({
    name: "PlottingPengujiForAdmin",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};
const handleRowClickDaftar = (item) => {
  if (item.status === "0") {
    router.push({
      name: "DetailPendaftarForAdmin",
      params: { tugas_akhir_id: item.tugas_akhir_id },
    });
  } else {
    modalHeadText.value = `Detail Berkas Ujian TA`;
    modalBodyText.value = `${item.mahasiswa?.nim || item.nim} | ${
      item.mahasiswa?.name || item.nama
    } | ${item.judul_tugas_akhir || item.judul_ta}`;

    // Siapkan data file untuk modal
    const dataNaskahTA = item.berkas.find((b) =>
      b.nama_berkas.includes("Naskah Tugas Akhir")
    );
    const dataTranskrip = item.berkas.find((b) =>
      b.nama_berkas.includes("Transkrip Nilai Mahasiswa")
    );
    const dataKRS = item.berkas.find((b) =>
      b.nama_berkas.includes("Scan KRS Semester Akhir")
    );
    const dataPersetujuanPembimbing = item.berkas.find((b) =>
      b.nama_berkas.includes("Bukti Persetujuan Pembimbing")
    );
    const dataSertifikatKompetensi = item.berkas.find((b) =>
      b.nama_berkas.includes("Bukti Sertifikat Kompetensi")
    );
    const dataSertifikatTOEIC = item.berkas.find((b) =>
      b.nama_berkas.includes("Sertifikat TOEIC")
    );
    const dataBeritaAcaraSemhas = item.berkas.find((b) =>
      b.nama_berkas.includes("Berita Acara Seminar Hasil")
    );
    const dataMasaPerpanjanganStudi = item.berkas.find((b) =>
      b.nama_berkas.includes("Surat Perpanjangan Masa Studi")
    );
    fileNaskahTA.value = dataNaskahTA
      ? {
          name: getFileName(dataNaskahTA?.file_path),
          url: dataNaskahTA?.download_url,
        }
      : { name: "", url: "" };

    fileTranskrip.value = dataTranskrip
      ? {
          name: getFileName(dataTranskrip?.file_path),
          url: dataTranskrip?.download_url,
        }
      : { name: "", url: "" };
    fileKRS.value = dataKRS
      ? {
          name: getFileName(dataKRS?.file_path),
          url: dataKRS?.download_url,
        }
      : { name: "", url: "" };
    filePersetujuanPembimbing.value = dataPersetujuanPembimbing
      ? {
          name: getFileName(dataPersetujuanPembimbing?.file_path),
          url: dataPersetujuanPembimbing?.download_url,
        }
      : { name: "", url: "" };
    fileSertifikatKompetensi.value = dataSertifikatKompetensi
      ? {
          name: getFileName(dataSertifikatKompetensi?.file_path),
          url: dataSertifikatKompetensi?.download_url,
        }
      : { name: "", url: "" };
    fileSertifikatTOEIC.value = dataSertifikatTOEIC
      ? {
          name: getFileName(dataSertifikatTOEIC?.file_path),
          url: dataSertifikatTOEIC?.download_url,
        }
      : { name: "", url: "" };
    fileBeritaAcaraSemhas.value = dataBeritaAcaraSemhas
      ? {
          name: getFileName(dataBeritaAcaraSemhas?.file_path),
          url: dataBeritaAcaraSemhas?.download_url,
        }
      : { name: "", url: "" };
    fileMasaPerpanjanganStudi.value = dataMasaPerpanjanganStudi
      ? {
          name: getFileName(dataMasaPerpanjanganStudi?.file_path),
          url: dataMasaPerpanjanganStudi?.download_url,
        }
      : { name: "", url: "" };
    // Lakukan hal yang sama untuk file lain jika perlu...

    tempValidasi.value = {
      naskah_ta_status_valid: dataNaskahTA?.status_valid ?? null,
      file_transkrip_status_valid: dataTranskrip?.status_valid ?? null,
      krs_status_valid: dataKRS?.status_valid ?? null,
      persetujuan_pembimbing_status_valid:
        dataPersetujuanPembimbing?.status_valid ?? null,
      sertifikat_kompetensi_status_valid:
        dataSertifikatKompetensi?.status_valid ?? null,
      toeic_status_valid: dataSertifikatTOEIC?.status_valid ?? null,
      berita_acara_semhas_status_valid:
        dataBeritaAcaraSemhas?.status_valid ?? null,
      masa_perpanjangan_studi_status_valid:
        dataMasaPerpanjanganStudi?.status_valid ?? null,
    };
    catatan.value = item.catatan || "";
    modalRef2.value = true;
  }
};
const handleRowClickJadwal = (item) => {
  if (item.jadwal) {
    selectedJadwalItem.value = item;
    modalRef1.value = true;
  } else {
    router.push({
      name: "PenjadwalanForAdmin",
      params: { tugas_akhir_id: item.tugas_akhir_id },
    });
  }
};

const handleEditJadwal = () => {
  modalRef1.value = false;
  router.push({
    name: "PenjadwalanForAdmin",
    params: { tugas_akhir_id: selectedJadwalItem.value?.tugas_akhir_id },
  });
};

const pendingStatusForm = ref(0);
// State untuk modal timer
const modalTimerVisible = ref(false);

// Saat slider dicoba diubah
function handleSliderChange(val) {
  if (val !== statusForm.value) {
    pendingStatusForm.value = val;
    modalTimerVisible.value = true;
  }
}

// Jika konfirmasi
async function handleModalSubmit() {
  try {
    await updateStatusForm(pendingStatusForm.value);
    statusForm.value = pendingStatusForm.value;
    toast.success("Status form berhasil diubah.");
    await fetchTabelPendaftar(); // refresh data setelah update
    modalTimerVisible.value = false;
  } catch (e) {
    toast.error("Gagal mengubah status form.");
    modalTimerVisible.value = false;
  }
}

// Jika batal
function handleModalCancel() {
  pendingStatusForm.value = statusForm.value; // reset pending ke value lama
  modalTimerVisible.value = false;
}
const modalTimerHeadText = computed(() => {
  return statusForm.value === 0
    ? "Buka Form Pengajuan Proposal"
    : "Tutup Form Pengajuan Proposal";
});
const modalTimerBodyText = computed(() => {
  return statusForm.value === 0
    ? "Apakah anda yakin ingin membuka form pengajuan proposal tugas akhir?"
    : "Apakah anda yakin ingin menutup form pengajuan proposal tugas akhir?";
});

onMounted(() => {
  fetchTabelPlottingPenguji(currentPageTabelPlottingPenguji.value);
  fetchTabelPendaftar(currentPageTabelPendaftar.value);
  fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
});
watch(currentPageTabelPlottingPenguji, (val) => {
  fetchTabelPlottingPenguji(val);
});
watch(currentPageTabelPendaftar, (val) => {
  fetchTabelPendaftar(val);
});
watch(currentPageTabelPenjadwalan, (val) => {
  fetchTabelPenjadwalan(val);
});
watch(
  () => router.currentRoute.value.query.refreshPlottingPenguji,
  () => {
    fetchTabelPlottingPenguji(currentPageTabelPlottingPenguji.value);
  }
);
watch(
  () => router.currentRoute.value.query.refreshPendaftar,
  () => {
    fetchTabelPendaftar(currentPageTabelPendaftar.value);
  }
);
const modalFileUjianTAVisible = ref(false);
const modalFileUjianTAHeadText = ref("");
const modalFileUjianTABodyText = ref("");
const modalFileUjianTAFiles = ref({
  naskah_ta: null,
  transkrip: null,
  krs: null,
  persetujuan_pembimbing: null,
  sertifikat_kompetensi: null,
  toeic: null,
  berita_acara_semhas: null,
  masa_perpanjangan_studi: null,
});
</script>

<template>
  <div v-if="!isDataLoaded" class="">
    <Loading />
  </div>

  <div>
    <router-view v-if="$route.path.includes('plotting-penguji')"></router-view>
    <router-view
      v-else-if="$route.path.includes('detail-pendaftar')"
    ></router-view>
    <router-view v-else-if="$route.path.includes('penjadwalan')"></router-view>

    <div v-else>
      <Breadcrumb />

      <TabDiv
        :tabs="tabs"
        :use-named-slots="true"
        v-model:activeTab="selectedTab"
        @tab-changed="handleTabChange"
      >
        <template #tab1>
          <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
            <ModalFilter
              class=""
              title="Status"
              :items="statuses"
              filterType="status"
              @apply="handleFilterTab1"
              triggerText="Status"
              :preselectedValues="selectedStatusesTab1"
            />
            <SearchBar v-model="searchQueryTab1" />
          </div>

          <Table
            :headers="[
              'NIM',
              'Nama',
              'Judul Proposal Tugas Akhir',
              'Dosen Pembimbing',
              'Status',
            ]"
            :items="filteredPlottingPengujiWithStatus"
            :pagination="paginationTabelPlottingPenguji"
            @pageChange="
              (page) => {
                currentPageTabelPlottingPenguji = page;
              }
            "
            @rowClick="handleRowClickPlot"
          >
            <template #row="{ item }">
              <td
                class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6"
              >
                {{ item.nim }}
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  <img
                    v-else
                    :src="DefaultAvatar"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  {{ item.nama }}
                </div>
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                {{ item.judul_proposal_ta }}
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  <img
                    v-else
                    :src="DefaultAvatar"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  {{ item.dosen_pembimbing }}
                </div>
              </td>
              <td
                class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
              >
                <StatusLabel
                  class="hidden w-fit lg:block"
                  :status="getStatusClass(item.status)"
                  size="md"
                  :label="getStatusLabelPlotting(item.status)"
                />
                <StatusLabel
                  class="block w-fit lg:hidden"
                  :status="getStatusClass(item.status)"
                  size="sm"
                  :label="getStatusLabelPlotting(item.status)"
                />
              </td>
            </template>
          </Table>
        </template>

        <template #tab2>
          <div
            class="flex flex-wrap items-center justify-between gap-2 mb-4 lg:gap-4"
          >
            <ModalFilter
              class="flex-grow md:flex-none"
              title="Status"
              :items="statuses"
              filterType="status"
              @apply="handleFilterTab2"
              triggerText="Status"
              :preselectedValues="selectedStatusesTab2"
            />
            <SearchBar
              class="order-last md:order-none"
              v-model="searchQueryTab2"
            />
            <Slider
              :modelValue="statusForm"
              @update:modelValue="handleSliderChange"
            />
          </div>

          <Table
            :headers="[
              'NIM',
              'Nama',
              'Judul Tugas Akhir',
              'Dosen Pembimbing',
              'Status',
            ]"
            :items="filteredPendaftarUjian"
            :pagination="paginationTabelPendaftar"
            @pageChange="
              (page) => {
                currentPageTabelPendaftar = page;
              }
            "
            @rowClick="handleRowClickDaftar"
          >
            <template #row="{ item }">
              <td
                class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6"
              >
                {{ item.nim }}
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  <img
                    v-else
                    :src="DefaultAvatar"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  {{ item.nama }}
                </div>
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                {{ item.judul_ta }}
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  <img
                    v-else
                    :src="DefaultAvatar"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  {{ item.dosen_pembimbing }}
                </div>
              </td>
              <td
                class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
              >
                <StatusLabel
                  class="hidden w-fit lg:block"
                  :status="getStatusClass(item.status)"
                  size="md"
                  :label="getStatusLabelPendaftar(item.status)"
                />
                <StatusLabel
                  class="block w-fit lg:hidden"
                  :status="getStatusClass(item.status)"
                  size="sm"
                  :label="getStatusLabelPendaftar(item.status)"
                />
              </td>
            </template>
          </Table>
        </template>

        <template #tab3>
          <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
            <ModalFilter
              title="Status"
              :items="statuses"
              filterType="status"
              @apply="handleFilterTab3"
              triggerText="Status"
              :preselectedValues="selectedStatusesTab3"
            />
            <SearchBar v-model="searchQueryTab3" />
          </div>

          <Table
            :headers="['NIM', 'Nama', 'Judul Tugas Akhir', 'Tanggal', 'Status']"
            :items="filteredPenjadwalan"
            :pagination="paginationTabelPenjadwalan"
            @pageChange="
              (page) => {
                currentPageTabelPenjadwalan = page;
              }
            "
            @rowClick="handleRowClickJadwal"
          >
            <template #row="{ item }">
              <td
                class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6"
              >
                {{ item.nim }}
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="item.img"
                    :src="item.img"
                    alt="Profile Image"
                    class="w-8 h-8 rounded-full"
                  />
                  {{ item.nama }}
                </div>
              </td>
              <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
                {{ item.judul_ta }}
              </td>
              <td
                class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-6 border-r border-white"
              >
                {{ item.tanggal }}
              </td>
              <td
                class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
              >
                <div v-if="!item.status_kelulusan">
                  <StatusLabel
                    class="hidden w-fit lg:block"
                    :status="item.jadwal ? 'success' : 'warning'"
                    size="md"
                    :label="item.jadwal ? 'Terjadwal' : 'Menunggu'"
                  />
                  <StatusLabel
                    class="block w-fit lg:hidden"
                    :status="item.jadwal ? 'success' : 'warning'"
                    size="sm"
                    :label="item.jadwal ? 'Terjadwal' : 'Menunggu'"
                  />
                </div>
                <div v-else>
                  <StatusLabel
                    class="hidden w-fit lg:block"
                    :status="getStatusClassBeritaAcara(item.status_kelulusan)"
                    size="md"
                    :label="getStatusLabelBeritaAcara(item.status_kelulusan)"
                  />
                  <StatusLabel
                    class="block w-fit lg:hidden"
                    :status="getStatusClassBeritaAcara(item.status_kelulusan)"
                    size="sm"
                    :label="getStatusLabelBeritaAcara(item.status_kelulusan)"
                  />
                </div>
              </td>
            </template>
          </Table>
        </template>
      </TabDiv>
    </div>
    <!-- Modal Validasi  -->
    <DefaultModal
      v-if="modalRef2"
      @close="modalRef2 = false"
      :headText="modalHeadText"
      :bodyText="modalBodyText"
    >
      <div class="flex flex-col gap-4 mt-4">
        <ValidationFile
          id="naskah-ta"
          label="Naskah Tugas Akhir"
          :isDisabled="true"
          :fileFromDatabase="fileNaskahTA"
          :statusValid="tempValidasi.naskah_ta_status_valid"
          @update:statusValid="tempValidasi.naskah_ta_status_valid = $event"
        />
        <ValidationFile
          id="transkrip-nilai-mahasiswa"
          label="Transkrip Nilai Mahasiswa"
          :fileFromDatabase="fileTranskrip"
          :isDisabled="true"
          :statusValid="tempValidasi.file_transkrip_status_valid"
          @update:statusValid="
            tempValidasi.file_transkrip_status_valid = $event
          "
        />
        <ValidationFile
          id="krs"
          label="KRS"
          :fileFromDatabase="fileKRS"
          :isDisabled="true"
          :statusValid="tempValidasi.krs_status_valid"
          @update:statusValid="tempValidasi.krs_status_valid = $event"
        />
        <ValidationFile
          id="persetujuan-dosen-pembimbing"
          label="Persetujuan Dosen Pembimbing"
          :fileFromDatabase="filePersetujuanPembimbing"
          :isDisabled="true"
          :statusValid="tempValidasi.persetujuan_pembimbing_status_valid"
          @update:statusValid="
            tempValidasi.persetujuan_pembimbing_status_valid = $event
          "
        />
        <ValidationFile
          id="sertifikat-kompetensi"
          label="Sertifikat Kompetensi"
          :fileFromDatabase="fileSertifikatKompetensi"
          :isDisabled="true"
          :statusValid="tempValidasi.sertifikat_kompetensi_status_valid"
          @update:statusValid="
            tempValidasi.sertifikat_kompetensi_status_valid = $event
          "
        />
        <ValidationFile
          id="sertifikat-toeic"
          label="Sertifikat TOEIC"
          :fileFromDatabase="fileSertifikatTOEIC"
          :isDisabled="true"
          :statusValid="tempValidasi.toeic_status_valid"
          @update:statusValid="tempValidasi.toeic_status_valid = $event"
        />
        <ValidationFile
          id="berita-acara-semhas"
          label="Berita Acara Semhas"
          :fileFromDatabase="fileBeritaAcaraSemhas"
          :statusValid="tempValidasi.berita_acara_semhas_status_valid"
          :isDisabled="true"
          @update:statusValid="
            tempValidasi.berita_acara_semhas_status_valid = $event
          "
        />
        <ValidationFile
          v-if="fileMasaPerpanjanganStudi && fileMasaPerpanjanganStudi.url"
          id="masa-perpanjangan-studi"
          label="Masa Perpanjangan Studi"
          :fileFromDatabase="fileMasaPerpanjanganStudi"
          :isDisabled="true"
          :statusValid="tempValidasi.masa_perpanjangan_studi_status_valid"
          @update:statusValid="
            tempValidasi.masa_perpanjangan_studi_status_valid = $event
          "
        />
        <InputTextarea
          id="catatan"
          label="Catatan"
          placeholder="Masukkan catatan"
          v-model="catatan"
        />
      </div>
    </DefaultModal>

    <!-- Modal Validasi Form  -->
    <ModalTimer
      v-if="modalTimerVisible"
      @close="handleModalCancel"
      :headText="modalTimerHeadText"
      :bodyText="modalTimerBodyText"
      submitText="Yakin"
      :showCancel="false"
      :showSubmit="true"
      :enableTimer="false"
      @submit="handleModalSubmit"
    />

    <!-- Jadwal Ujian Modal -->
    <DefaultModal
      v-if="modalRef1 && selectedJadwalItem"
      @close="modalRef1 = false"
      :headText="`Jadwal Ujian Tugas Akhir`"
      :bodyText="`${selectedJadwalItem.nama} | ${selectedJadwalItem.nim} | ${selectedJadwalItem.judul_ta}`"
    >
      <div class="flex flex-col gap-4">
        <JadwalUjian
          class="w-full"
          :examiners="daftarPenguji"
          :jadwal="jadwalUjianTA"
        />
        <div class="flex justify-end gap-4">
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== 1 && 2"
            variant="secondary"
            size="lg"
            class="w-fit"
            leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            @click="handleEditJadwal"
          >
            Edit
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null"
            variant="primary"
            size="lg"
            class="w-fit"
            leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          >
            Cetak Berita Acara
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null && 1"
            variant="primary"
            size="lg"
            class="w-fit"
            leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          >
            Cetak Lembar Revisi
          </Button>
        </div>
      </div>
    </DefaultModal>

    <!-- Modal File Ujian TA -->
    <DefaultModal
      v-if="modalFileUjianTAVisible"
      @close="modalFileUjianTAVisible = false"
      :headText="modalFileUjianTAHeadText"
      :bodyText="modalFileUjianTABodyText"
    >
      <div class="flex flex-col gap-4 mt-4">
        <ValidationFile
          id="naskah-ta"
          label="Naskah Tugas Akhir"
          :fileFromDatabase="modalFileUjianTAFiles.naskah_ta"
          :isDisabled="true"
        />
        <ValidationFile
          id="transkrip-nilai-mahasiswa"
          label="Transkrip Nilai Mahasiswa"
          :fileFromDatabase="modalFileUjianTAFiles.transkrip"
          :isDisabled="true"
        />
        <ValidationFile
          id="krs"
          label="KRS"
          :fileFromDatabase="modalFileUjianTAFiles.krs"
          :isDisabled="true"
        />
        <ValidationFile
          id="persetujuan-dosen-pembimbing"
          label="Persetujuan Dosen Pembimbing"
          :fileFromDatabase="modalFileUjianTAFiles.persetujuan_pembimbing"
          :isDisabled="true"
        />
        <ValidationFile
          id="sertifikat-kompetensi"
          label="Sertifikat Kompetensi"
          :fileFromDatabase="modalFileUjianTAFiles.sertifikat_kompetensi"
          :isDisabled="true"
        />
        <ValidationFile
          id="sertifikat-toeic"
          label="Sertifikat TOEIC"
          :fileFromDatabase="modalFileUjianTAFiles.toeic"
          :isDisabled="true"
        />
        <ValidationFile
          id="berita-acara-semhas"
          label="Berita Acara Semhas"
          :fileFromDatabase="modalFileUjianTAFiles.berita_acara_semhas"
          :isDisabled="true"
        />
        <ValidationFile
          id="masa-perpanjangan-studi"
          label="Masa Perpanjangan Studi"
          :fileFromDatabase="modalFileUjianTAFiles.masa_perpanjangan_studi"
          :isDisabled="true"
        />
        <InputTextarea
          id="catatan"
          label="Catatan"
          placeholder="Masukkan catatan"
          v-model="modalFileUjianTACatatan"
          :readonly="true"
        />
      </div>
    </DefaultModal>
  </div>
</template>
