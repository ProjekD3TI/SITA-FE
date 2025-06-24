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
  downloadBeritaAcara,
  exportToExcel,
  downloadLembarRevisi,
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
const selectedTahunAjaranId = ref("");
const selectedFiltersPenjadwalan = ref([]);

const selectedPlottingItem = ref(null);

const examiners = computed(() => {
  return (
    selectedPlottingItem.value?.dosen_penguji?.map((d) => ({
      name: d.name,
      role: d.jabatan_penguji,
    })) || []
  );
});
const catatan_perbaikan = ref("");
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

// Ambil status_form.is_open dari dataTabelPendaftar
const statusForm = ref(0);
watch(
  () => dataTabelPendaftar.value?.status_form?.is_open,
  (val) => {
    if (typeof val !== "undefined") statusForm.value = val;
  },
  { immediate: true }
);
const tahunAjaranOptions = computed(() => {
  return dataTabelPenjadwalan.value?.tahun_ajaran_list || [];
});

const listPlottingPenguji = computed(() => {
  return Array.isArray(dataTabelPlottingPenguji.value?.data)
    ? dataTabelPlottingPenguji.value?.data
    : [];
});

const listPendaftarUjian = computed(() => {
  return Array.isArray(dataTabelPendaftar.value?.data)
    ? dataTabelPendaftar.value?.data
    : [];
});

const listPenjadwalan = computed(() => {
  return Array.isArray(dataTabelPenjadwalan.value?.data)
    ? dataTabelPenjadwalan.value?.data
    : [];
});

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
    toast.error("Gagal memuat data. Silakan coba lagi.");
  }
});

const plottingStatuses = [
  { value: "1", label: "Terplotting" },
  { value: "0", label: "Menunggu" },
];
const pendaftarStatuses = [
  { value: "1", label: "Diterima" },
  { value: "0", label: "Menunggu" },
  { value: "2", label: "Ditolak" },
];
const penjadwalanStatuses = [
  { value: "terjadwal", label: "Terjadwal" },
  { value: "menunggu", label: "Menunggu" },
  { value: "1", label: "Lulus" },
  { value: "2", label: "Lulus(Revisi)" },
  { value: "3", label: "Ulang(Revisi)" },
  { value: "4", label: "Tidak Lulus" },
];
const penjadwalanTahunAjaran = computed(() => [
  ...tahunAjaranOptions.value.map((t) => ({
    value: t.id,
    label: t.tahun_ajaran,
    type: "tahun_ajaran",
  })),
]);
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

const countPlottingMenunggu = computed(() => {
  return dataTabelPlottingPenguji.value?.notification || 0;
});
// Hitung jumlah pendaftar ujian dengan status '0' (Menunggu)
const countPendaftarMenunggu = computed(() => {
  return dataTabelPendaftar.value?.notification || 0;
});
// Hitung jumlah penjadwalan dengan status menunggu (status === '1' dan jadwal null)
const countPenjadwalanMenunggu = computed(() => {
  return dataTabelPenjadwalan.value?.notification || 0;
});

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
];

// State untuk search & filter tiap tab
const searchQueryTab1 = ref("");
const searchQueryTab2 = ref("");
const searchQueryTab3 = ref("");
const selectedFiltersPlotting = ref([]);
const selectedFiltersPendaftar = ref([]);

function handleFilterPlotting({ values }) {
  selectedFiltersPlotting.value = values;
  // Pisahkan values berdasarkan type
  const statusValues = values.filter((v) =>
    plottingStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = values.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );
  currentPageTabelPlottingPenguji.value = 1;
  fetchTabelPlottingPenguji(
    1,
    searchQueryTab1.value,
    statusValues.join(","),
    tahunAjaranValues.join(",") // Diubah untuk mengirim semua ID
  );
}
function handleFilterPendaftar({ values }) {
  selectedFiltersPendaftar.value = values;
  const statusValues = values.filter((v) =>
    pendaftarStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = values.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );
  currentPageTabelPendaftar.value = 1;
  fetchTabelPendaftar(
    1,
    searchQueryTab2.value,
    statusValues.join(","),
    tahunAjaranValues.join(",") // Diubah untuk mengirim semua ID
  );
}
function handleFilterPenjadwalan({ values }) {
  selectedFiltersPenjadwalan.value = values;

  // Pisahkan values berdasarkan type
  const statusValues = values.filter((v) =>
    penjadwalanStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = values.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  currentPageTabelPenjadwalan.value = 1;
  fetchTabelPenjadwalan(
    1,
    searchQueryTab3.value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
}

function onSearchPlotting({ value }) {
  const statusValues = selectedFiltersPlotting.value.filter((v) =>
    plottingStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPlotting.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );
  currentPageTabelPlottingPenguji.value = 1;
  fetchTabelPlottingPenguji(
    1,
    value,
    statusValues.join(","),
    tahunAjaranValues.join(",") // Diubah untuk mengirim semua ID
  );
}
function onSearchPendaftar({ value }) {
  const statusValues = selectedFiltersPendaftar.value.filter((v) =>
    pendaftarStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPendaftar.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );
  currentPageTabelPendaftar.value = 1;
  fetchTabelPendaftar(
    1,
    value,
    statusValues.join(","),
    tahunAjaranValues.join(",") // Diubah untuk mengirim semua ID
  );
}
function onSearchPenjadwalan({ value }) {
  const statusValues = selectedFiltersPenjadwalan.value.filter((v) =>
    penjadwalanStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPenjadwalan.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  currentPageTabelPenjadwalan.value = 1;
  fetchTabelPenjadwalan(
    1,
    value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
}

// Handler tab change: reset search & filter tiap tab
const selectedTab = ref("tab1");
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryTab1.value = "";
  searchQueryTab2.value = "";
  searchQueryTab3.value = "";
  selectedFiltersPlotting.value = [];
  selectedFiltersPendaftar.value = [];
  selectedFiltersPenjadwalan.value = []; // Reset filter gabungan

  currentPageTabelPlottingPenguji.value = 1;
  currentPageTabelPendaftar.value = 1;
  currentPageTabelPenjadwalan.value = 1;

  if (tabId === "tab1") {
    fetchTabelPlottingPenguji(1, "", "", ""); // Ambil data tab 1 tanpa filter
  } else if (tabId === "tab2") {
    fetchTabelPendaftar(1, "", "", ""); // Ambil data tab 2 tanpa filter
  } else if (tabId === "tab3") {
    fetchTabelPenjadwalan(1, "", "", ""); // Ambil data tab 2 tanpa filter
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 1:
      return "success";
    case 0:
      return "warning";
    case 2:
      return "danger";
    default:
      return "default";
  }
};

const getStatusClassBeritaAcara = (status) => {
  switch (status) {
    case "lulus_tanpa_revisi":
      return "success-outline";
    case "lulus_revisi_tanpa_diujikan":
      return "success-outline";
    case "belum_lulus_revisi_diujikan_lagi":
      return "warning-outline";
    case "tidak_lulus_ulang_ta":
      return "danger-outline";
    case "menunggu":
      return "warning";
    case "terjadwal":
      return "success";
    default:
      return "default";
  }
};
const getStatusLabelBeritaAcara = (status) => {
  switch (status) {
    case "lulus_tanpa_revisi":
      return "Lulus";
    case "lulus_revisi_tanpa_diujikan":
      return "Lulus (Revisi)";
    case "belum_lulus_revisi_diujikan_lagi":
      return "Revisi";
    case "tidak_lulus_ulang_ta":
      return "Tidak Lulus";
    case "menunggu":
      return "Menunggu";
    case "terjadwal":
      return "Terjadwal";
    default:
      return "Tidak Diketahui";
  }
};

const getStatusLabelPlotting = (status) => {
  switch (status) {
    case 1:
      return "Terplotting";
    case 0:
      return "Menunggu";
    case 2:
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};
const getStatusLabelPendaftar = (status) => {
  switch (status) {
    case 1:
      return "Diterima";
    case 0:
      return "Menunggu";
    case 2:
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};

const getFileName = (filePath) => {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
};
const handleRowClickPlot = (item) => {
  // Jika sudah ada dosen penguji (array minimal 1), buka modal
  if (Array.isArray(item.dosen_penguji) && item.dosen_penguji.length > 0) {
    selectedPlottingItem.value = item;
    modalRef.value = true;
  } else {
    // Jika belum ada dosen penguji, redirect ke halaman plotting
    router.push({
      name: "PlottingPengujiForAdmin",
      params: { tugas_akhir_id: item.tugas_akhir_id },
    });
  }
};
const handleRowClickDaftar = (item) => {
  if (item.status_valid === 0) {
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
    catatan_perbaikan.value = item.catatan_perbaikan || "";
    modalRef2.value = true;
  }
};

const handleRowClickJadwal = (item) => {
  if (
    item.ujian_ta &&
    !Array.isArray(item.ujian_ta) &&
    item.ujian_ta.ujian_ta_id
  ) {
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
const timerModalRef = ref(null);

// Saat slider dicoba diubah
function handleSliderChange(val) {
  if (val !== statusForm.value) {
    pendingStatusForm.value = val;
    timerModalRef.value.open();
  }
}

// Jika konfirmasi
async function handleModalSubmit() {
  try {
    await updateStatusForm(pendingStatusForm.value);
    statusForm.value = pendingStatusForm.value;
    toast.success("Status form berhasil diubah.");
    await fetchTabelPendaftar(); // refresh data setelah update
  } catch (e) {
    toast.error("Gagal mengubah status form.");
  }
}
function handleExport() {
  const statusValues = selectedFiltersPenjadwalan.value.filter((v) =>
    penjadwalanStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPenjadwalan.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  exportToExcel(
    searchQueryTab3.value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
}
// Jika batal
function handleModalCancel() {
  pendingStatusForm.value = statusForm.value; // reset pending ke value lama
}
const modalTimerHeadText = computed(() => {
  return statusForm.value === 0
    ? "Buka Form Pendaftaran Ujian"
    : "Tutup Form Pendaftaran Ujian";
});
const modalTimerBodyText = computed(() => {
  return statusForm.value === 0
    ? "Apakah anda yakin ingin membuka form pendaftaran ujian?"
    : "Apakah anda yakin ingin menutup form pendaftaran ujian?";
});

onMounted(() => {
  fetchTabelPlottingPenguji(currentPageTabelPlottingPenguji.value);
  fetchTabelPendaftar(currentPageTabelPendaftar.value);
  fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
});
watch(currentPageTabelPlottingPenguji, (val) => {
  const statusValues = selectedFiltersPlotting.value.filter((v) =>
    plottingStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPlotting.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );
  fetchTabelPlottingPenguji(
    val,
    searchQueryTab1.value,
    statusValues.join(","),
    tahunAjaranValues.join(",") // Diubah untuk mengirim semua ID
  );
});
watch(currentPageTabelPendaftar, (val) => {
  fetchTabelPendaftar(
    val,
    searchQueryTab2.value,
    statusValues.join(","),
    tahunAjaranValues.length > 0 ? tahunAjaranValues[0] : ""
  );
});
watch(currentPageTabelPenjadwalan, (val) => {
  const statusValues = selectedFiltersPenjadwalan.value.filter((v) =>
    penjadwalanStatuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFiltersPenjadwalan.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  fetchTabelPenjadwalan(
    val,
    searchQueryTab3.value,
    statusValues.join(","),
    tahunAjaranValues.length > 0 ? tahunAjaranValues[0] : ""
  );
});
watch(
  () => router.currentRoute.value.query.refreshPlottingPenguji,
  () => {
    fetchTabelPlottingPenguji(currentPageTabelPlottingPenguji.value);
    fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        refreshPlottingPenguji: undefined,
      },
    });
  }
);
watch(
  () => router.currentRoute.value.query.refreshPendaftar,
  () => {
    fetchTabelPendaftar(currentPageTabelPendaftar.value);
    fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        refreshPendaftar: undefined,
      },
    });
  }
);
watch(
  () => router.currentRoute.value.query.refreshPenjadwalan,
  () => {
    fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        refreshPenjadwalan: undefined,
      },
    });
  }
);
</script>

<template>
  <router-view v-if="$route.path.includes('plotting-penguji')"></router-view>
  <router-view
    v-else-if="$route.path.includes('detail-pendaftar')"
  ></router-view>
  <router-view v-else-if="$route.path.includes('penjadwalan')"></router-view>

  <div v-else>
    <!-- <Breadcrumb /> -->

    <TabDiv
      :tabs="tabs"
      :use-named-slots="true"
      v-model:activeTab="selectedTab"
      @tab-changed="handleTabChange"
    >
      <template #tab1>
        <div
          class="flex items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            title="Status"
            title2="Tahun Ajaran"
            :items="plottingStatuses"
            :items2="penjadwalanTahunAjaran"
            filterType="filter"
            @apply="handleFilterPlotting"
            triggerText="Filter"
            :preselectedValues="selectedFiltersPlotting"
          />
          <SearchBar
            v-model="searchQueryTab1"
            @search="onSearchPlotting"
            filterKey="plotting"
          />
        </div>
        <div v-if="loadingTabelPlottingPenguji" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorTabelPlottingPenguji" :message="error" />
        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Judul Proposal',
            'Tahun Ajaran',
            'Dosen Pembimbing',
            'Status',
          ]"
          :items="listPlottingPenguji"
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
              class="px-3 py-2 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.proposal?.judul_proposal }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.tahun_ajaran?.tahun_ajaran }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.dosen_pembimbing }}
            </td>
            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-2 sm:px-6 body5 sm:body4 text-blackText"
            >
              <StatusLabel
                class="hidden w-fit 2xl:block"
                :status="
                  getStatusClass(
                    Array.isArray(item.dosen_penguji) &&
                      item.dosen_penguji.length >= 3
                      ? 1
                      : 0
                  )
                "
                size="md"
                :label="
                  getStatusLabelPlotting(
                    Array.isArray(item.dosen_penguji) &&
                      item.dosen_penguji.length >= 3
                      ? 1
                      : 0
                  )
                "
              />
              <StatusLabel
                class="block w-fit 2xl:hidden"
                :status="
                  getStatusClass(
                    Array.isArray(item.dosen_penguji) &&
                      item.dosen_penguji.length >= 3
                      ? 1
                      : 0
                  )
                "
                size="sm"
                :label="
                  getStatusLabelPlotting(
                    Array.isArray(item.dosen_penguji) &&
                      item.dosen_penguji.length >= 3
                      ? 1
                      : 0
                  )
                "
              />
            </td>
          </template>
        </Table>
      </template>

      <template #tab2>
        <div
          class="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            class="flex-grow md:flex-none"
            title="Status"
            title2="Tahun Ajaran"
            :items="pendaftarStatuses"
            :items2="penjadwalanTahunAjaran"
            filterType="filter"
            @apply="handleFilterPendaftar"
            triggerText="Filter"
            :preselectedValues="selectedFiltersPendaftar"
          />
          <SearchBar
            class="order-last md:order-none sm:min-w-[367px]"
            v-model="searchQueryTab2"
            @search="onSearchPendaftar"
            filterKey="pendaftar"
          />
          <Slider
            :modelValue="statusForm"
            @update:modelValue="handleSliderChange"
          />
        </div>
        <div v-if="loadingTabelPendaftar" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorTabelPendaftar" :message="error" />
        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Judul Tugas Akhir',
            'Tahun Ajaran',
            'Dosen Pembimbing',
            'Status',
          ]"
          :items="listPendaftarUjian"
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
              class="px-3 py-2 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.judul_tugas_akhir }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.tahun_ajaran?.tahun_ajaran }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.dosen_pembimbing?.name }}
            </td>
            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-2 sm:px-6 body5 sm:body4 text-blackText"
            >
              <StatusLabel
                class="hidden w-fit 2xl:block"
                :status="getStatusClass(item.status_valid)"
                size="md"
                :label="getStatusLabelPendaftar(item.status_valid)"
              />
              <StatusLabel
                class="block w-fit 2xl:hidden"
                :status="getStatusClass(item.status_valid)"
                size="sm"
                :label="getStatusLabelPendaftar(item.status_valid)"
              />
            </td>
          </template>
        </Table>
      </template>

      <template #tab3>
        <div
          class="flex flex-wrap items-stretch justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            class="flex-grow sm:flex-none"
            title="Status"
            title2="Tahun Ajaran"
            :items="penjadwalanStatuses"
            :items2="penjadwalanTahunAjaran"
            filterType="filter"
            @apply="handleFilterPenjadwalan"
            triggerText="Filter"
            :preselectedValues="selectedFiltersPenjadwalan"
          />
          <Button
            variant="outlined-secondary"
            size="md"
            class="!min-h-0 !min-w-0 font-normal flex-grow sm:flex-none"
            right-icon-path="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
            @click="handleExport"
            >Export
          </Button>
          <SearchBar
            v-model="searchQueryTab3"
            @search="onSearchPenjadwalan"
            filterKey="penjadwalan"
          />
        </div>
        <div v-if="loadingTabelPenjadwalan" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorTabelPenjadwalan" :message="error" />
        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Judul Tugas Akhir',
            'Tanggal',
            'Tahun Ajaran',
            'Nilai Akhir',
            'Status',
          ]"
          :items="listPenjadwalan"
          :pagination="paginationTabelPenjadwalan"
          @pageChange="
            (page) => {
              currentPageTabelPenjadwalan = page;
            }
          "
          @rowClick="handleRowClickJadwal"
          min-width="min-w-[1000px]"
        >
          <template #row="{ item }">
            <td
              class="px-3 py-2 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.judul_tugas_akhir }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.ujian_ta?.tanggal_ujian || "-" }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.ujian_ta?.tahun_ajaran || "-" }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.nilai_akhir || "-" }}
            </td>
            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-2 sm:px-6 body5 sm:body4 text-blackText"
            >
              <div>
                <StatusLabel
                  class="hidden w-fit 2xl:block"
                  :status="getStatusClassBeritaAcara(item.status_kategori)"
                  size="md"
                  :label="getStatusLabelBeritaAcara(item.status_kategori)"
                />
                <StatusLabel
                  class="block w-fit xl:hidden"
                  :status="getStatusClassBeritaAcara(item.status_kategori)"
                  size="sm"
                  :label="getStatusLabelBeritaAcara(item.status_kategori)"
                />
              </div>
            </td>
          </template>
        </Table>
      </template>
    </TabDiv>
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
          v-if="catatan_perbaikan"
          id="catatan"
          label="Catatan"
          placeholder=""
          v-model="catatan_perbaikan"
          :disabled="true"
        />
      </div>
    </DefaultModal>

    <!-- Modal Validasi Form  -->
    <ModalTimer
      ref="timerModalRef"
      @close="handleModalCancel"
      :headText="modalTimerHeadText"
      :bodyText="modalTimerBodyText"
      submitText="Yakin"
      :showCancel="false"
      :showSubmit="true"
      :enableTimer="false"
      @submit="handleModalSubmit"
    />

    <DefaultModal
      v-if="modalRef && selectedPlottingItem"
      @close="modalRef = false"
      headText="Dosen Penguji"
      :bodyText="`${selectedPlottingItem.mahasiswa?.nim} | ${selectedPlottingItem.mahasiswa?.name} | ${selectedPlottingItem.proposal?.judul_proposal}`"
    >
      <div class="flex flex-col w-full gap-4 basis-7/12 md:w-auto">
        <div
          v-for="(examiner, index) in examiners"
          :key="index"
          class="flex items-center gap-4"
        >
          <img :src="DefaultAvatar" alt="" class="w-10 h-10 sm:w-14 sm:h-14" />
          <div>
            <p class="body4 sm:body2 text-blackText">{{ examiner.name }}</p>
            <p class="capitalize body4-bold sm:body2-bold text-primary">
              {{ examiner.role }}
            </p>
          </div>
        </div>
        <div
          v-if="examiners.length === 0"
          class="py-4 text-center text-gray-500"
        >
          Tidak ada data dosen penguji
        </div>
        <Button
          v-if="
            selectedPlottingItem && selectedPlottingItem.sudah_lulus === false
          "
          variant="secondary"
          size="lg"
          class="self-end hidden w-fit sm:flex"
          left-icon-path="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          @click="
            () => {
              modalRef = false;
              router.push({
                name: 'PlottingPengujiForAdmin',
                params: { tugas_akhir_id: selectedPlottingItem.tugas_akhir_id },
              });
            }
          "
        >
          Edit
        </Button>
        <Button
          v-if="
            selectedPlottingItem && selectedPlottingItem.sudah_lulus === false
          "
          variant="secondary"
          size="md"
          class="self-end w-full sm:hidden"
          left-icon-path="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          @click="
            () => {
              modalRef = false;
              router.push({
                name: 'PlottingPengujiForAdmin',
                params: { tugas_akhir_id: selectedPlottingItem.tugas_akhir_id },
              });
            }
          "
        >
          Edit
        </Button>
      </div>
    </DefaultModal>

    <!-- Jadwal Ujian Modal -->
    <DefaultModal
      v-if="modalRef1 && selectedJadwalItem"
      @close="modalRef1 = false"
      :headText="`Jadwal Ujian Tugas Akhir`"
      :bodyText="`${selectedJadwalItem.mahasiswa?.name} | ${selectedJadwalItem.mahasiswa?.nim} | ${selectedJadwalItem.judul_tugas_akhir}`"
    >
      <div class="flex flex-col gap-4">
        <JadwalUjian
          class="w-full"
          :examiners="daftarPenguji"
          :jadwal="jadwalUjianTA"
        />
        <div class="flex flex-wrap gap-2 sm:justify-end sm:gap-4">
          <Button
            v-if="
              selectedJadwalItem.ujian_ta?.status_kelulusan == null ||
              selectedJadwalItem.ujian_ta?.status_kelulusan == undefined
            "
            variant="secondary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            @click="handleEditJadwal"
          >
            Edit
          </Button>
          <Button
            v-if="
              selectedJadwalItem.ujian_ta?.status_kelulusan == null ||
              selectedJadwalItem.ujian_ta?.status_kelulusan == undefined
            "
            variant="secondary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            @click="handleEditJadwal"
          >
            Edit
          </Button>
          <Button
            v-if="selectedJadwalItem.ujian_ta?.status_kelulusan !== null"
            variant="primary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            @click="
              downloadBeritaAcara(selectedJadwalItem.ujian_ta?.ujian_ta_id)
            "
          >
            Berita Acara
          </Button>
          <Button
            v-if="
              selectedJadwalItem.ujian_ta?.status_kelulusan !== null &&
              selectedJadwalItem.ujian_ta?.status_kelulusan !== 1 &&
              selectedJadwalItem.ujian_ta?.status_kelulusan !== 4
            "
            variant="primary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            @click="downloadLembarRevisi()"
          >
            Lembar Revisi
          </Button>
          <Button
            v-if="selectedJadwalItem.ujian_ta?.status_kelulusan !== null"
            variant="primary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            @click="downloadBeritaAcara(selectedJadwalItem.tugas_akhir_id)"
          >
            Berita Acara
          </Button>
          <Button
            v-if="
              selectedJadwalItem.ujian_ta?.status_kelulusan !== null &&
              selectedJadwalItem.ujian_ta?.status_kelulusan !== 1 &&
              selectedJadwalItem.ujian_ta?.status_kelulusan !== 4
            "
            variant="primary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            @click="downloadLembarRevisi()"
          >
            Lembar Revisi
          </Button>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>
