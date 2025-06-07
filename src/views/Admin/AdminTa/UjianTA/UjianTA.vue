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

const listPlottingPenguji = computed(() => {
  return Array.isArray(dataTabelPlottingPenguji.value)
    ? dataTabelPlottingPenguji.value
    : [];
});

const listPendaftarUjian = computed(() => {
  return Array.isArray(dataTabelPendaftar.value?.data)
    ? dataTabelPendaftar.value?.data
    : [];
});

const listPenjadwalan = computed(() => {
  return Array.isArray(dataTabelPenjadwalan.value)
    ? dataTabelPenjadwalan.value
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
    console.error("Error saat memuat komponen:", error);
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
];

// State untuk search & filter tiap tab
const searchQueryTab1 = ref("");
const searchQueryTab2 = ref("");
const searchQueryTab3 = ref("");
const selectedStatusesPlotting = ref([]);
const selectedStatusesPendaftar = ref([]);
const selectedStatusesPenjadwalan = ref([]);

function handleFilterPlotting({ values }) {
  selectedStatusesPlotting.value = values;
  currentPageTabelPlottingPenguji.value = 1;
  fetchTabelPlottingPenguji(
    1,
    searchQueryTab1.value,
    getSelectedStatusValue(values)
  );
}
function handleFilterPendaftar({ values }) {
  selectedStatusesPendaftar.value = values;
  currentPageTabelPendaftar.value = 1;
  fetchTabelPendaftar(1, searchQueryTab2.value, getSelectedStatusValue(values));
}
function handleFilterPenjadwalan({ values }) {
  selectedStatusesPenjadwalan.value = values;
  currentPageTabelPenjadwalan.value = 1;
  fetchTabelPenjadwalan(
    1,
    searchQueryTab3.value,
    getSelectedStatusValue(values)
  );
}

function onSearchPlotting({ value }) {
  currentPageTabelPlottingPenguji.value = 1;
  fetchTabelPlottingPenguji(
    1,
    value,
    getSelectedStatusValue(selectedStatusesPlotting.value)
  );
}
function onSearchPendaftar({ value }) {
  currentPageTabelPendaftar.value = 1;
  fetchTabelPendaftar(
    1,
    value,
    getSelectedStatusValue(selectedStatusesPendaftar.value)
  );
}
function onSearchPenjadwalan({ value }) {
  currentPageTabelPenjadwalan.value = 1;
  fetchTabelPenjadwalan(
    1,
    value,
    getSelectedStatusValue(selectedStatusesPenjadwalan.value)
  );
}

// Handler tab change: reset search & filter tiap tab
const selectedTab = ref("tab1");
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryTab1.value = "";
  searchQueryTab2.value = "";
  searchQueryTab3.value = "";
  selectedStatusesPlotting.value = [];
  selectedStatusesPendaftar.value = [];
  selectedStatusesPenjadwalan.value = [];
}

function getSelectedStatusValue(selectedStatuses) {
  if (selectedStatuses.length > 0) {
    return selectedStatuses.map(String).join(",");
  }
  return "";
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

// Jika batal
function handleModalCancel() {
  pendingStatusForm.value = statusForm.value; // reset pending ke value lama
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
  fetchTabelPlottingPenguji(
    val,
    searchQueryTab1.value,
    getSelectedStatusValue(selectedStatusesPlotting.value)
  );
});
watch(currentPageTabelPendaftar, (val) => {
  fetchTabelPendaftar(
    val,
    searchQueryTab2.value,
    getSelectedStatusValue(selectedStatusesPendaftar.value)
  );
});
watch(currentPageTabelPenjadwalan, (val) => {
  fetchTabelPenjadwalan(
    val,
    searchQueryTab3.value,
    getSelectedStatusValue(selectedStatusesPenjadwalan.value)
  );
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
    fetchTabelPenjadwalan(currentPageTabelPenjadwalan.value);
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
            :items="plottingStatuses"
            filterType="status"
            @apply="handleFilterPlotting"
            triggerText="Status"
            :preselectedValues="selectedStatusesPlotting"
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
              class="px-3 py-3 border-r border-white rounded-l-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.proposal?.judul_proposal }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.dosen_pembimbing }}
            </td>
            <td
              class="px-3 py-3 border-r border-white rounded-r-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              <StatusLabel
                class="hidden w-fit lg:block"
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
                class="block w-fit lg:hidden"
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
          class="flex flex-wrap items-center justify-between gap-2 mb-4 lg:gap-4"
        >
          <ModalFilter
            class="flex-grow md:flex-none"
            title="Status"
            :items="pendaftarStatuses"
            filterType="status"
            @apply="handleFilterPendaftar"
            triggerText="Status"
            :preselectedValues="selectedStatusesPendaftar"
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
              class="px-3 py-3 border-r border-white rounded-l-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.judul_tugas_akhir }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.dosen_pembimbing?.name }}
            </td>
            <td
              class="px-3 py-3 border-r border-white rounded-r-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              <StatusLabel
                class="hidden w-fit lg:block"
                :status="getStatusClass(item.status_valid)"
                size="md"
                :label="getStatusLabelPendaftar(item.status_valid)"
              />
              <StatusLabel
                class="block w-fit lg:hidden"
                :status="getStatusClass(item.status_valid)"
                size="sm"
                :label="getStatusLabelPendaftar(item.status_valid)"
              />
            </td>
          </template>
        </Table>
      </template>

      <template #tab3>
        <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
          <ModalFilter
            title="Status"
            :items="penjadwalanStatuses"
            filterType="status"
            @apply="handleFilterPenjadwalan"
            triggerText="Status"
            :preselectedValues="selectedStatusesPenjadwalan"
          />
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
          :headers="['NIM', 'Nama', 'Judul Tugas Akhir', 'Tanggal', 'Status']"
          :items="listPenjadwalan"
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
              class="px-3 py-3 border-r border-white rounded-l-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.nim }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-3 py-3 border-r border-white sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.judul_tugas_akhir }}
            </td>
            <td
              class="py-3 px-3 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-4 sm:px-6 body5 sm:body4 text-blackText border-r border-white"
            >
              {{ item.ujian_ta?.tanggal_ujian || "-" }}
            </td>
            <td
              class="px-3 py-3 border-r border-white rounded-r-lg sm:py-4 sm:px-6 body5 sm:body4 text-blackText"
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
            v-if="selectedJadwalItem.status_kelulusan !== 1 && 2"
            variant="secondary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            @click="handleEditJadwal"
          >
            Edit
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== 1 && 2"
            variant="secondary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            @click="handleEditJadwal"
          >
            Edit
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null"
            variant="primary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          >
            Berita Acara
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null && 1"
            variant="primary"
            size="lg"
            class="hidden w-fit sm:flex"
            leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          >
            Lembar Revisi
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null"
            variant="primary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0-2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          >
            Berita Acara
          </Button>
          <Button
            v-if="selectedJadwalItem.status_kelulusan !== null && 1"
            variant="primary"
            size="md"
            class="w-full sm:hidden"
            leftIconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          >
            Lembar Revisi
          </Button>
        </div>
      </div>
    </DefaultModal>
  </div>
</template>
