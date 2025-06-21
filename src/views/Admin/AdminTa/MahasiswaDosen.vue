<script setup>
import { ref, computed, onMounted, watch } from "vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import ModalSelected from "@/components/Tugas-akhir/Modals/ModalSelected.vue";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  useTabelMahasiswa,
  useTabelDosen,
} from "@/services/TugasAkhir/Admin/MahasiswaDosen.js";
import DosenCard from "@/components/Tugas-akhir/DosenCard.vue";
import DefaultModal from "@/components/Tugas-akhir/Modals/DefaultModal.vue";
import InputDropdown from "@/components/Tugas-akhir/Forms/InputDropdown.vue";

const {
  dataTabelMahasiswa,
  loadingTabelMahasiswa,
  errorTabelMahasiswa,
  fetchDataTabelMahasiswa,
  paginationTabelMahasiswa,
  updateAksesMahasiswa,
  angkatanList,
} = useTabelMahasiswa();

const {
  dataTabelDosen,
  loadingTabelDosen,
  errorTabelDosen,
  fetchDataTabelDosen,
  paginationTabelDosen,
  updateAksesDosen,
} = useTabelDosen();

const route = useRoute();
const router = useRouter();
const toast = useToast();
const activeTab = ref("tab1");

const currentPageTabelMahasiswa = ref(1);
const currentPageTabelDosen = ref(1);
const selectedAngkatan = ref([]);
// Data tab
const tabs = [
  {
    id: "tab1",
    label: "Mahasiswa",
    icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "tab2",
    label: "Dosen",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    id: "tab3",
    label: "Jabatan",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

// Search for Mahasiswa
const searchQueryMahasiswa = ref("");
const searchQueryDosen = ref("");

const listMahasiswa = computed(() => {
  return Array.isArray(dataTabelMahasiswa.value)
    ? dataTabelMahasiswa.value
    : [];
});

const listDosen = computed(() => {
  return Array.isArray(dataTabelDosen.value) ? dataTabelDosen.value : [];
});

// Status options for filter
const statuses = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Non Aktif" },
];

const selectedStatusesMahasiswa = ref([]);
const selectedStatusesDosen = ref([]);

// Table headers
const tableHeadersMahasiswa = [
  "Nama Lengkap",
  "NIM",
  "Angkatan",
  "Email",
  "Status",
];
const tableHeadersDosen = ["Nama Lengkap", "NIK", "Email", "Status"];

// Checked items for mahasiswa
const checkedMahasiswa = ref([]);
const checkedDosen = ref([]); // TAMBAHKAN

// Fungsi untuk mengubah status massal mahasiswa
const setMahasiswaStatus = async (status) => {
  // status: 'success' (aktif) atau 'inactive' (non aktif)
  const akses_ta = status === "success";
  try {
    await updateAksesMahasiswa(checkedMahasiswa.value, akses_ta);
    // toast.success("Status mahasiswa berhasil diubah!");
    // Refresh data
    fetchDataTabelMahasiswa(
      currentPageTabelMahasiswa.value,
      searchQueryMahasiswa.value,
      getSelectedStatusValue(selectedStatusesMahasiswa.value),
      selectedAngkatan.value.join(",")
    );
  } catch (e) {
    // error sudah di-handle di service
  } finally {
    checkedMahasiswa.value = [];
  }
};

// Fungsi untuk mengubah status massal dosen
const setDosenStatus = async (status) => {
  const akses_ta = status === "success";
  try {
    await updateAksesDosen(checkedDosen.value, akses_ta); // BENAR
    // Refresh data
    fetchDataTabelDosen(
      currentPageTabelDosen.value,
      searchQueryDosen.value,
      getSelectedStatusValue(selectedStatusesDosen.value)
    );
  } catch (e) {
    // error sudah di-handle di service
  } finally {
    checkedDosen.value = []; // BENAR
  }
};

// Untuk menutup modal
const closeModalSelected = () => {
  checkedMahasiswa.value = [];
};

// Untuk menutup modal dosen
const closeModalSelectedDosen = () => {
  checkedDosen.value = [];
};

function getSelectedStatusValue(selectedStatuses) {
  if (Array.isArray(selectedStatuses) && selectedStatuses.length > 0) {
    return selectedStatuses.map(String).join(",");
  }
  return "";
}

function onSearchMahasiswa({ value }) {
  currentPageTabelMahasiswa.value = 1;
  fetchDataTabelMahasiswa(
    1,
    value,
    getSelectedStatusValue(selectedStatusesMahasiswa.value),
    selectedAngkatan.value.join(",")
  );
}
function onSearchDosen({ value }) {
  currentPageTabelDosen.value = 1;
  fetchDataTabelDosen(
    1,
    value,
    getSelectedStatusValue(selectedStatusesDosen.value)
  );
}
const mahasiswaStatus = computed(() => [
  ...statuses.map((s) => ({ ...s, type: "status" })),
]);

const mahasiswaAngkatan = computed(() => [
  ...angkatanList.value.map((a) => ({ value: a, label: a, type: "angkatan" })),
]);
const selectedFiltersMahasiswa = ref([]);
function handleFilterMahasiswa({ values }) {
  selectedFiltersMahasiswa.value = values;
  const statusValues = values.filter((v) => ["0", "1"].includes(v));
  const angkatanValues = values.filter((v) => !["0", "1"].includes(v));
  currentPageTabelMahasiswa.value = 1;
  fetchDataTabelMahasiswa(
    1,
    searchQueryMahasiswa.value,
    statusValues.join(","),
    angkatanValues.join(",")
  );
}

function handleFilterDosen({ values }) {
  selectedStatusesDosen.value = values;
  currentPageTabelDosen.value = 1;
  fetchDataTabelDosen(
    1,
    searchQueryDosen.value,
    getSelectedStatusValue(values)
  );
}

onMounted(() => {
  // Fetch data when component is mounted
  fetchDataTabelMahasiswa(
    currentPageTabelMahasiswa.value,
    searchQueryMahasiswa.value,
    getSelectedStatusValue(selectedStatusesMahasiswa.value)
  );
  fetchDataTabelDosen(
    currentPageTabelDosen.value,
    searchQueryDosen.value,
    getSelectedStatusValue(selectedStatusesDosen.value)
  );
});
watch(currentPageTabelMahasiswa, (val) => {
  const statusValues = selectedFiltersMahasiswa.value.filter((v) =>
    ["0", "1"].includes(v)
  );
  const angkatanValues = selectedFiltersMahasiswa.value.filter(
    (v) => !["0", "1"].includes(v)
  );
  fetchDataTabelMahasiswa(
    val,
    searchQueryMahasiswa.value,
    statusValues.join(","),
    angkatanValues.join(",")
  );
});
watch(currentPageTabelDosen, (val) => {
  fetchDataTabelDosen(
    val,
    searchQueryDosen.value,
    getSelectedStatusValue(selectedStatusesDosen.value)
  );
});
const getStatusClass = (status) => {
  switch (status) {
    case 1:
      return "success";
    case 0:
      return "inactive";
    default:
      return "inactive";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return "Aktif";
    case 0:
      return "Non Aktif";
    default:
      return "Tidak Diketahui";
  }
};
watch(activeTab, (val) => {
  if (val === "tab1") {
    checkedDosen.value = [];
  } else if (val === "tab2") {
    checkedMahasiswa.value = [];
  }
});
function handleTabChanged(tabId) {
  checkedMahasiswa.value = [];
  checkedDosen.value = [];
}

const showModal = ref(false);
const modalTitle = ref('');
const modalBody = ref('');
const selectedDropdown = ref("");
const dropdownOptions = [
  { value: "1", label: "Opsi 1" },
  { value: "2", label: "Opsi 2" },
  { value: "3", label: "Opsi 3" },
];

function openModal(role) {
  modalTitle.value = role;
  modalBody.value = `Ini modal untuk ${role}`;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
</script>

<template>
  <Breadcrumb />

  <TabDiv :tabs="tabs" :use-named-slots="true" v-model="activeTab" @tab-changed="handleTabChanged">
    <!-- === TAB 1: MAHASISWA === -->
    <template #tab1>
      <div class="flex items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4">
        <ModalFilter title="Status" title2="Angkatan" :items="mahasiswaStatus" :items2="mahasiswaAngkatan"
          filterType="filter" triggerText="Filter" :preselectedValues="selectedFiltersMahasiswa"
          @apply="handleFilterMahasiswa" />
        <SearchBar v-model="searchQueryMahasiswa" @search="onSearchMahasiswa" filterKey="mahasiswa" />
      </div>
      <div v-if="loadingTabelMahasiswa" class="py-8">
        <Loading />
      </div>
      <ErrorMsg v-else-if="errorTabelMahasiswa" :message="errorTabelMahasiswa" />
      <Table v-else :headers="tableHeadersMahasiswa" :items="listMahasiswa" :showCheckbox="true"
        :checkedItems="checkedMahasiswa" rowKey="mahasiswa_id" @update:checkedItems="checkedMahasiswa = $event"
        :pagination="paginationTabelMahasiswa" @pageChange="
          (page) => {
            currentPageTabelMahasiswa = page;
          }
        ">
        <template #row="{ item }">
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.name }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.nim }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.angkatan }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.email }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            <StatusLabel class="w-fit sm:hidden" :status="getStatusClass(item.akses_ta)"
              :label="getStatusLabel(item.akses_ta)" :customLabel="true" size="sm" />
            <StatusLabel class="hidden w-fit sm:flex" :status="getStatusClass(item.akses_ta)"
              :label="getStatusLabel(item.akses_ta)" :customLabel="true" size="md" />
          </td>
        </template>
      </Table>
    </template>

    <!-- === TAB 2: DOSEN === -->
    <template #tab2>
      <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
        <ModalFilter title="Status" :items="statuses" filterType="status" triggerText="Status"
          @apply="handleFilterDosen" :preselectedValues="selectedStatusesDosen" />
        <SearchBar v-model="searchQueryDosen" @search="onSearchDosen" filterKey="dosen" />
      </div>
      <div v-if="loadingTabelDosen" class="py-8">
        <Loading />
      </div>
      <ErrorMsg v-else-if="errorTabelDosen" :message="errorTabelDosen" />
      <Table v-else :headers="tableHeadersDosen" :items="listDosen" :showCheckbox="true" :checkedItems="checkedDosen"
        rowKey="dosen_id" @update:checkedItems="checkedDosen = $event" :pagination="paginationTabelDosen" @pageChange="
          (page) => {
            currentPageTabelDosen = page;
          }
        ">
        <template #row="{ item }">
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.name }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.nik }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            {{ item.email }}
          </td>
          <td class="px-3 py-2 sm:py-3 sm:px-6 body5 sm:body4 text-blackText">
            <StatusLabel class="w-fit sm:hidden" :status="getStatusClass(item.akses_ta)"
              :label="getStatusLabel(item.akses_ta)" :customLabel="true" size="sm" />
            <StatusLabel class="hidden w-fit sm:flex" :status="getStatusClass(item.akses_ta)"
              :label="getStatusLabel(item.akses_ta)" :customLabel="true" size="md" />
          </td>
        </template>
      </Table>
    </template>
    <template #tab3>
      <div class="body1-bold text-center mb-3">
        Pengurus Ujian Tugas Akhir
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        <DosenCard :showButton="true" role="Kepala Program Studi" @click="openModal('Kepala Program Studi')" />
        <DosenCard :showButton="true" role="Divisi Tugas Akhir" @click="openModal('Divisi Tugas Akhir')" />
      </div>
      <div class="flex flex-wrap justify-center gap-2 mt-4">
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
        <DosenCard />
      </div>
    </template>
  </TabDiv>
  <!-- ModalSelected muncul jika ada yang dicentang -->
  <ModalSelected v-if="checkedMahasiswa.length > 0" :count="checkedMahasiswa.length" @close="closeModalSelected"
    @setActive="setMahasiswaStatus('success')" @setInactive="setMahasiswaStatus('inactive')" />
  <ModalSelected v-if="checkedDosen.length > 0" :count="checkedDosen.length" @close="closeModalSelectedDosen"
    @setActive="setDosenStatus('success')" @setInactive="setDosenStatus('inactive')" />
  <DefaultModal v-if="showModal" :headText="modalTitle" @close="closeModal">
    <div class="mt-4">
      <InputDropdown id="dropdown-modal" label="Pilih Opsi" v-model="selectedDropdown" :options="dropdownOptions"
        placeholder="Pilih salah satu" />
    </div>
  </DefaultModal>
  <DefaultModal v-if="isModalOpen" :headText="isEditing ? 'Edit Kategori' : 'Tambah Kategori'" bodyText=""
    @close="isModalOpen = false">
    <div class="mt-4">
      <InputText id="category-name" label="Nama Kategori" placeholder="Masukkan Nama Kategori"
        v-model="selectedCategory.name" />
      <div class="flex justify-end gap-2 mt-4">
        <Button variant="danger" @click="isModalOpen = false"> Batal </Button>
        <Button variant="primary" @click="saveKategori">
          {{ isEditing ? "Simpan" : "Tambah" }}
        </Button>
      </div>
    </div>
  </DefaultModal>
</template>
