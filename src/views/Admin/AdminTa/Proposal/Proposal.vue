<script setup>
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import Slider from "@/components/Tugas-akhir/Slider.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ValidationFile from "@/components/Tugas-akhir/Forms/ValidationFile.vue";
import InputTextarea from "@/components/Tugas-akhir/Forms/InputTextarea.vue";
import { useToast } from "vue-toastification";
import {
  useTabelPendaftarProposal,
  useTabelSeminarProposal,
} from "@/services/TugasAkhir/Admin/proposal.js";

const {
  dataTabelPendaftarProposal,
  loadingTabelPendaftarProposal,
  errorTabelPendaftarProposal,
  updateStatusForm,
  fetchData: fetchPendaftarProposal,
  paginationTabelPendaftarProposal,
} = useTabelPendaftarProposal();

const {
  dataTabelSeminarProposal,
  loadingTabelSeminarProposal,
  errorTabelSeminarProposal,
  paginationTabelSeminarProposal,
  fetchData: fetchSeminarProposal,
  exportToExcel,
} = useTabelSeminarProposal();

// Search dan filter state
const statusForm = ref(
  dataTabelPendaftarProposal.value?.status_form?.is_open ?? 0
);

const route = useRoute();
const router = useRouter();
watch(
  () => dataTabelPendaftarProposal.value?.status_form?.is_open,
  (val) => {
    if (typeof val !== "undefined") statusForm.value = val;
  },
  { immediate: true }
);
const toast = useToast();
const searchQueryPengajuan = ref("");
const searchQuerySeminar = ref("");
const selectedFiltersPengajuan = ref([]);
const selectedFiltersSeminar = ref([]);

const currentPagePendaftar = ref(1);
const currentPageSeminar = ref(1);

const modalRef = ref(false);
const timerModalRef = ref(null);
const pendingStatusForm = ref(statusForm.value);
const modalTimerVisible = ref(false);
const modalHeadText = ref("");
const modalBodyText = ref("");
const dataNaskahProposal = ref({});
const dataTranskrip = ref({});
const fileNaskahProposal = ref(null);
const fileTranskrip = ref(null);
const tempValidasi = ref({
  naskah_proposal_status_valid: null,
  file_transkrip_status_valid: null,
});
const catatan_perbaikan = ref("");

function getFileName(filePath) {
  return filePath ? decodeURIComponent(filePath.split("/").pop()) : "";
}

const statuses = [
  { value: "ST_1", label: "Disetujui" },
  { value: "ST_0", label: "Menunggu" },
  { value: "ST_2", label: "Ditolak" },
];
const isDinilai = [
  { value: "ST_sudah", label: "Sudah Dinilai" },
  { value: "ST_belum", label: "Belum Dinilai" },
];
function getSeparatedFiltersProposal(values) {
  const statusValues = values
    .filter((v) => v.startsWith("ST_"))
    .map((v) => v.replace("ST_", ""));
  const tahunAjaranValues = values
    .filter((v) => v.startsWith("TA_"))
    .map((v) => v.replace("TA_", ""));
  return {
    statusStr: statusValues.join(","),
    tahunAjaranStr: tahunAjaranValues.join(","),
  };
}
// Helper untuk status
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
const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Disetujui";
    case 0:
      return "Menunggu";
    case 2:
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};

const pendaftarNotificationCount = computed(() => {
  return dataTabelPendaftarProposal.value?.notification || 0;
});
const seminarNotificationCount = computed(() => {
  return dataTabelSeminarProposal.value?.notification || 0;
});

const tabs = [
  {
    id: 1,
    label: "Pengajuan",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
    count: pendaftarNotificationCount,
  },
  {
    id: 2,
    label: "Seminar",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    count: seminarNotificationCount,
  },
];
const tahun_ajarans = computed(() =>
  Array.isArray(dataTabelPendaftarProposal.value?.tahun_ajaran_list)
    ? dataTabelPendaftarProposal.value?.tahun_ajaran_list.map((item) => ({
        value: `TA_${item.id}`,
        label: item.tahun_ajaran,
      }))
    : []
);
const listPendaftarProposal = computed(() => {
  // Data dari API ada di dataTabelPendaftarProposal.value.data
  return Array.isArray(dataTabelPendaftarProposal.value?.data)
    ? dataTabelPendaftarProposal.value?.data
    : [];
});
const listTabelSeminarProposal = computed(() => {
  // Data dari API ada di dataTabelPendaftarProposal.value.data
  return Array.isArray(dataTabelSeminarProposal.value?.data)
    ? dataTabelSeminarProposal.value?.data
    : [];
});

function onSearchPendaftar({ value }) {
  currentPagePendaftar.value = 1;
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(
    selectedFiltersPengajuan.value
  );
  fetchPendaftarProposal(1, value, statusStr, tahunAjaranStr);
}
function onSearchSeminar({ value }) {
  currentPageSeminar.value = 1;
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(
    selectedFiltersSeminar.value
  );
  fetchSeminarProposal(1, value, statusStr, tahunAjaranStr);
}

// Handler filter dan search
function handleFilterPengajuan({ values }) {
  selectedFiltersPengajuan.value = values;
  currentPagePendaftar.value = 1;
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(values);
  fetchPendaftarProposal(
    1,
    searchQueryPengajuan.value,
    statusStr,
    tahunAjaranStr
  );
}
function handleFilterSeminar({ values }) {
  selectedFiltersSeminar.value = values;
  currentPageSeminar.value = 1;
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(values);
  fetchSeminarProposal(1, searchQuerySeminar.value, statusStr, tahunAjaranStr);
}
function handleExport() {
  // Ambil filter yang sedang aktif
  const tahunAjaranValues = selectedFiltersSeminar.value
    .filter((v) => v.startsWith("TA_"))
    .map((v) => v.replace("TA_", ""));
  const statusNilaiValues = selectedFiltersSeminar.value
    .filter((v) => v.startsWith("ST_"))
    .map((v) => v.replace("ST_", ""));

  // Format parameter tahun ajaran dan status
  const tahunAjaranStr =
    tahunAjaranValues.length > 0 ? tahunAjaranValues.join(",") : "";
  const statusNilaiStr =
    statusNilaiValues.length > 0 ? statusNilaiValues.join(",") : "";

  exportToExcel(searchQuerySeminar.value, statusNilaiStr, tahunAjaranStr);
}
// Tab change reset
const selectedTab = ref(1);
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryPengajuan.value = "";
  searchQuerySeminar.value = "";
  selectedFiltersPengajuan.value = [];
  selectedFiltersSeminar.value = [];
}

// Row click
const handleRowClickSeminar = (item) => {
  router.push({
    name: "DetailProposalForAdmin",
    params: { proposal_id: item.proposal_id },
  });
};
// Handler row click untuk tab Pengajuan
const handleRowClickPengajuan = (item) => {
  if (item.status_proposal === 0) {
    // Status menunggu, redirect ke detail
    router.push({
      name: "DetailPengajuanForAdmin",
      params: { proposal_id: item.proposal_id },
    });
  } else {
    // Status diterima/ditolak, buka modal
    modalHeadText.value = `Detail Proposal`;
    modalBodyText.value = `${item.mahasiswa?.nim} | ${item.mahasiswa?.name} | ${item.judul_proposal}`;
    // Siapkan data file untuk modal
    dataNaskahProposal.value = item.berkas.find((b) =>
      b.nama_berkas.includes("Naskah Proposal")
    );
    dataTranskrip.value = item.berkas.find((b) =>
      b.nama_berkas.includes("Transkrip Nilai")
    );
    fileNaskahProposal.value = dataNaskahProposal.value
      ? {
          name: getFileName(dataNaskahProposal.value?.file_path),
          url: dataNaskahProposal.value?.download_url,
        }
      : { name: "", url: "" };

    fileTranskrip.value = dataTranskrip.value
      ? {
          name: getFileName(dataTranskrip.value?.file_path),
          url: dataTranskrip.value?.download_url,
        }
      : { name: "", url: "" };
    tempValidasi.value = {
      naskah_proposal_status_valid:
        dataNaskahProposal.value?.status_valid ?? null,
      file_transkrip_status_valid: dataTranskrip.value?.status_valid ?? null,
    };
    catatan_perbaikan.value = item.catatan_perbaikan || "";
    modalRef.value = true;
  }
};

function handleSliderChange(val) {
  if (val !== statusForm.value) {
    pendingStatusForm.value = val;
    timerModalRef.value.open();
  }
}
watch(
  () => route.fullPath,
  () => {
    fetchPendaftarProposal();
    fetchSeminarProposal();
  }
);

async function handleModalSubmit() {
  try {
    await updateStatusForm(pendingStatusForm.value); // hanya kirim 0/1
    statusForm.value = pendingStatusForm.value;
    toast.success("Status form berhasil diubah.");
    modalTimerVisible.value = false;
  } catch (e) {
    toast.error("Gagal mengubah status form.");
    modalTimerVisible.value = false;
  }
}
// Jika batal
function handleModalCancel() {
  pendingStatusForm.value = statusForm.value;
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
  fetchPendaftarProposal(currentPagePendaftar.value);
  fetchSeminarProposal(currentPageSeminar.value);
});

watch(currentPagePendaftar, (val) => {
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(
    selectedFiltersPengajuan.value
  );
  fetchPendaftarProposal(
    val,
    searchQueryPengajuan.value,
    statusStr,
    tahunAjaranStr
  );
});
watch(currentPageSeminar, (val) => {
  const { statusStr, tahunAjaranStr } = getSeparatedFiltersProposal(
    selectedFiltersSeminar.value
  );
  fetchSeminarProposal(
    val,
    searchQuerySeminar.value,
    statusStr,
    tahunAjaranStr
  );
});
</script>
<template>
  <router-view v-if="$route.path.includes('detail-pengajuan')"></router-view>
  <router-view
    v-else-if="$route.path.includes('detail-proposal')"
  ></router-view>
  <div v-else>
    <Breadcrumb />
    <TabDiv :tabs="tabs" :use-named-slots="true" @tab-changed="handleTabChange">
      <template #1>
        <div
          class="flex flex-wrap items-center gap-2 mb-2 sm:mb-4 sjustify-between lg:gap-4"
        >
          <ModalFilter
            class="items-stretch flex-grow h-full md:flex-none"
            title="Status"
            title2="Tahun Ajaran"
            :items="statuses"
            :items2="tahun_ajarans"
            filterType="filter"
            @apply="handleFilterPengajuan"
            triggerText="Filter"
            :preselectedValues="selectedFiltersPengajuan"
          />
          <SearchBar
            class="order-last md:order-none sm:min-w-[367px] items-stretch"
            v-model="searchQueryPengajuan"
            @search="onSearchPendaftar"
            filterKey="pendaftar"
          />
          <Slider
            class="items-stretch"
            :modelValue="statusForm"
            @update:modelValue="handleSliderChange"
          />
        </div>
        <div v-if="loadingTabelPendaftarProposal" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorTabelPendaftarProposal" :message="error" />
        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Judul Proposal',
            'Tahun Ajaran',
            'Tanggal Pengajuan',
            'Status',
          ]"
          :items="listPendaftarProposal"
          @rowClick="handleRowClickPengajuan"
          :pagination="paginationTabelPendaftarProposal"
          @pageChange="
            (page) => {
              currentPagePendaftar = page;
            }
          "
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
              {{ item.judul_proposal }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.tahun_ajaran?.tahun_ajaran }}
            </td>
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.tanggal_pengajuan }}
            </td>
            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              <StatusLabel
                class="hidden w-fit lg:block"
                :status="getStatusClass(item.status_proposal)"
                size="md"
                :label="getStatusLabel(item.status_proposal)"
              />
              <StatusLabel
                class="block w-fit lg:hidden"
                :status="getStatusClass(item.status_proposal)"
                size="sm"
                :label="getStatusLabel(item.status_proposal)"
              />
            </td>
          </template>
        </Table>
      </template>
      <template #2>
        <div
          class="flex flex-wrap items-stretch justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            class="flex-grow sm:flex-none"
            title="Status"
            title2="Tahun Ajaran"
            :items="isDinilai"
            :items2="tahun_ajarans"
            filterType="filter"
            @apply="handleFilterSeminar"
            triggerText="Filter"
            :preselectedValues="selectedFiltersSeminar"
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
            v-model="searchQuerySeminar"
            @search="onSearchSeminar"
            filterKey="seminar"
          />
        </div>
        <div v-if="loadingTabelSeminarProposal" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorTabelSeminarProposal" :message="error" />
        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Judul Proposal',
            'Tahun Ajaran',
            'Dosen Pembimbing',
            'Nilai',
          ]"
          :items="listTabelSeminarProposal"
          @rowClick="handleRowClickSeminar"
          :pagination="paginationTabelSeminarProposal"
          @pageChange="
            (page) => {
              currentPageSeminar = page;
            }
          "
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
              {{ item.judul_proposal }}
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
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-3 sm:px-6 body5 sm:body4"
              :class="
                item.nilai_proposal == null
                  ? 'text-secondary'
                  : 'text-blackText'
              "
            >
              {{ item.nilai_proposal || "Belum Dinilai" }}
            </td>
          </template>
        </Table>
      </template>
    </TabDiv>
  </div>
  <DefaultModal
    v-if="modalRef"
    @close="modalRef = false"
    :headText="modalHeadText"
    :bodyText="modalBodyText"
  >
    <div class="flex flex-col gap-4 mt-4">
      <ValidationFile
        id="naskah-ta"
        label="Naskah Proposal Tugas Akhir"
        :fileFromDatabase="fileNaskahProposal"
        :isDisabled="true"
        :statusValid="tempValidasi.naskah_proposal_status_valid"
        @update:statusValid="tempValidasi.naskah_proposal_status_valid = $event"
      />
      <ValidationFile
        id="transkrip-nilai-mahasiswa"
        label="Transkrip Nilai Mahasiswa"
        :fileFromDatabase="fileTranskrip"
        :isDisabled="true"
        :statusValid="tempValidasi.file_transkrip_status_valid"
        @update:statusValid="tempValidasi.file_transkrip_status_valid = $event"
      />
      <InputTextarea
        v-if="catatan_perbaikan"
        id="catatan"
        label="Catatan Perbaikan"
        placeholder="Masukkan catatan"
        v-model="catatan_perbaikan"
        :disabled="true"
      />
    </div>
  </DefaultModal>
  <ModalTimer
    ref="timerModalRef"
    @close="handleModalCancel"
    @submit="handleModalSubmit"
    :headText="modalTimerHeadText"
    :bodyText="modalTimerBodyText"
    submitText="Yakin"
    :showCancel="false"
    :showSubmit="true"
    :enableTimer="false"
  />
</template>
