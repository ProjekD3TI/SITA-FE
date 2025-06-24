<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import Loading from "@/components/Loading.vue";
import { useTabelTugasAkhir } from "@/services/TugasAkhir/Admin/tugasAkhir.js";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
import ModalTimer from "@/components/Tugas-akhir/Modals/ModalTimer.vue";

const route = useRoute();
const router = useRouter();
const {
  dataTabelTugasAkhir,
  loadingTabelTugasAkhir,
  errorTabelTugasAkhir,
  paginationTabelTugasAkhir,
  updateStatusTugasAkhir,
  fetchTabelTugasAkhir,
} = useTabelTugasAkhir();

const selectedFilters = ref([]); // Menggantikan selectedStatuses
const currentPage = ref(1);
const searchQuery = ref("");
const modalRef = ref(null);
const selectedRow = ref(null);

const statuses = [
  { value: "1", label: "Aktif" },
  { value: "0", label: "Non-aktif" },
];

// 1. Ambil opsi tahun ajaran dari data API
const tahunAjaranOptions = computed(
  () => dataTabelTugasAkhir.value?.tahun_ajaran_list || []
);

// 2. Format tahun ajaran untuk komponen ModalFilter
const tahun_ajarans = computed(() =>
  tahunAjaranOptions.value.map((t) => ({
    value: t.id,
    label: t.tahun_ajaran,
    type: "tahun_ajaran",
  }))
);

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
      return "Non-aktif";
    default:
      return "Tidak Diketahui";
  }
};

const listTugasAkhir = computed(() => {
  return Array.isArray(dataTabelTugasAkhir.value?.data)
    ? dataTabelTugasAkhir.value?.data
    : [];
});

// 3. Perbarui handleFilter untuk memisahkan filter
function handleFilter({ values }) {
  selectedFilters.value = values;
  currentPage.value = 1;

  const statusValues = values.filter((v) =>
    statuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = values.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  fetchTabelTugasAkhir(
    1,
    searchQuery.value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
}

// 4. Perbarui onSearch untuk menyertakan semua filter
function onSearch({ value }) {
  searchQuery.value = value;
  currentPage.value = 1;

  const statusValues = selectedFilters.value.filter((v) =>
    statuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFilters.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  fetchTabelTugasAkhir(
    1,
    value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
}

const handleRowClick = (item) => {
  selectedRow.value = item;
  modalRef.value.open();
};

const handleModalSubmit = async () => {
  if (!selectedRow.value) return;
  const newStatus = selectedRow.value.status_aktif === 1 ? 0 : 1;
  try {
    await updateStatusTugasAkhir(selectedRow.value.tugas_akhir_id, newStatus);
    selectedRow.value = null;
    // Refresh data dengan filter yang ada
    const statusValues = selectedFilters.value.filter((v) =>
      statuses.some((s) => s.value === v)
    );
    const tahunAjaranValues = selectedFilters.value.filter((v) =>
      tahunAjaranOptions.value.some((t) => t.id === v)
    );
    fetchTabelTugasAkhir(
      currentPage.value,
      searchQuery.value,
      statusValues.join(","),
      tahunAjaranValues.join(",")
    );
  } catch (e) {
    // Error handled in composable
  }
};

onMounted(() => {
  fetchTabelTugasAkhir(currentPage.value, "", "");
});

// 5. Perbarui watch untuk menyertakan semua filter saat paginasi
watch(currentPage, (val) => {
  const statusValues = selectedFilters.value.filter((v) =>
    statuses.some((s) => s.value === v)
  );
  const tahunAjaranValues = selectedFilters.value.filter((v) =>
    tahunAjaranOptions.value.some((t) => t.id === v)
  );

  fetchTabelTugasAkhir(
    val,
    searchQuery.value,
    statusValues.join(","),
    tahunAjaranValues.join(",")
  );
});
</script>
<template>
  <Breadcrumb />
  <div class="p-4 bg-white card-rounded shadow-custom lg:p-6">
    <div class="flex items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4">
      <ModalFilter
        title="Status"
        title2="Tahun Ajaran"
        :items="statuses"
        :items2="tahun_ajarans"
        filterType="filter"
        @apply="handleFilter"
        triggerText="Filter"
        :preselectedValues="selectedFilters"
      />
      <SearchBar v-model="searchQuery" @search="onSearch" />
    </div>
    <div v-if="loadingTabelTugasAkhir" class="py-8">
      <Loading />
    </div>
    <!-- <ErrorMsg v-else-if="errorTabelTugasAkhir" :message="error" /> -->
    <Table
      v-else
      :headers="[
        'NIM',
        'Nama',
        'Kategori',
        'Tahun Ajaran',
        'Judul TA',
        'Status',
      ]"
      :items="listTugasAkhir"
      :pagination="paginationTabelTugasAkhir"
      @rowClick="handleRowClick"
      @pageChange="
        (page) => {
          currentPage = page;
        }
      "
    >
      <template #row="{ item }">
        <!-- Kolom NIM -->
        <td
          class="px-3 py-2 border-r border-white rounded-l-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          {{ item.mahasiswa?.nim }}
        </td>

        <!-- Kolom Nama -->
        <td
          class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          {{ item.mahasiswa?.name }}
        </td>

        <!-- Kolom Judul Proposal -->
        <td
          class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          {{ item.kategori?.name }}
        </td>
        <td
          class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          {{ item.tahun_ajaran?.tahun_ajaran }}
        </td>

        <td
          class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          {{ item.judul_tugas_akhir || "-" }}
        </td>

        <!-- Kolom Nilai -->
        <td
          class="px-3 py-2 border-r border-white rounded-r-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
        >
          <StatusLabel
            class="hidden w-fit lg:block"
            :status="getStatusClass(item.status_aktif)"
            size="md"
            :label="getStatusLabel(item.status_aktif)"
          />
          <StatusLabel
            class="block w-fit lg:hidden"
            :status="getStatusClass(item.status_aktif)"
            size="sm"
            :label="getStatusLabel(item.status_aktif)"
          />
        </td>
      </template>
    </Table>
  </div>
  <ModalTimer
    ref="modalRef"
    :headText="
      selectedRow?.status_aktif === 1
        ? 'Nonaktifkan Tugas Akhir?'
        : 'Aktifkan Tugas Akhir?'
    "
    :bodyText="`Apakah Anda yakin ingin mengubah status Tugas Akhir ${
      selectedRow?.mahasiswa?.name || ''
    }?`"
    :showSubmit="true"
    :showCancel="false"
    :enableTimer="false"
    :submitText="selectedRow?.status_aktif === 1 ? 'Nonaktifkan' : 'Aktifkan'"
    @close="showModalTimer = false"
    @submit="handleModalSubmit"
  />
</template>
