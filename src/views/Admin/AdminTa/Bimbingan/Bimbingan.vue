<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import router from "@/router";
import Loading from "@/components/Loading.vue";
import ErrorMsg from "@/components/ErrorMsg.vue";
import {
  useTabelPlottingPembimbing,
  useKategori,
  useTabelBimbingan,
} from "@/services/TugasAkhir/Admin/bimbingan.js";

const {
  dataPlotting,
  fetchPlottingPembimbing,
  loadingPlotting,
  errorPlotting,
  paginationPlotting,
} = useTabelPlottingPembimbing();
const { dataKategori, loadingKategori, errorKategori } = useKategori();
const {
  dataBimbingan,
  loadingBimbingan,
  errorBimbingan,
  paginationBimbingan,
  fetchBimbingan,
} = useTabelBimbingan();

const currentPage = ref(1);
const currentPagePlotting = ref(1);

onMounted(() => {
  fetchPlottingPembimbing(currentPagePlotting.value);
  fetchBimbingan(currentPage.value);
});

watch(currentPage, (val) => {
  fetchBimbingan(
    val,
    searchQueryBimbingan.value,
    getSelectedKategoriLabel(selectedCategoriesBimbingan.value || [])
  );
});
watch(currentPagePlotting, (val) => {
  fetchPlottingPembimbing(
    val,
    searchQuery.value,
    getSelectedKategoriLabel(selectedCategoriesPlot.value || [])
  );
});
// Komputed untuk data tabel plotting pembimbing
const tabelPlottingPembimbing = computed(() => {
  // Pastikan dataPlotting sudah terisi dan array
  return Array.isArray(dataPlotting.value?.data)
    ? dataPlotting.value?.data
    : [];
});

const tabelBimbingan = computed(() => {
  // Pastikan dataPlotting sudah terisi dan array
  return Array.isArray(dataBimbingan.value) ? dataBimbingan.value : [];
});
const searchQuery = ref("");
const searchQueryBimbingan = ref("");
const selectedCategoriesPlot = ref([]); // Untuk tab 1
const selectedCategoriesBimbingan = ref([]); // Untuk tab 2

const categories = computed(() =>
  Array.isArray(dataKategori.value)
    ? dataKategori.value.map((item) => ({
        value: item.id,
        label: item.nama_kategori,
      }))
    : []
);

// Hitung jumlah mahasiswa yang belum ada dosen pembimbing
const notificationCount = computed(() => {
  return dataPlotting.value?.notification || 0;
});
const tabs = [
  {
    id: 1,
    label: "Plotting pembimbing",
    icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    count: notificationCount || 0,
  },
  {
    id: 2,
    label: "Bimbingan",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
];

const handleRowClickPlot = (item) => {
  router.push({
    name: "PlotPembimbingForAdmin",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};
const handleRowClickBimbingan = (item) => {
  router.push({
    name: "DetailBimbinganForAdmin",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};

const selectedTab = ref(1);
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryBimbingan.value = "";
  searchQuery.value = "";
  selectedCategoriesBimbingan.value = [];
  selectedCategoriesPlot.value = [];
}

function onSearchPlotting({ value }) {
  // Reset ke halaman 1 setiap kali search berubah
  currentPage.value = 1;
  fetchPlottingPembimbing(
    1,
    value,
    getSelectedKategoriLabel(selectedCategoriesPlot.value)
  );
}
function onSearchBimbingan({ value }) {
  // Reset ke halaman 1 setiap kali search berubah
  currentPage.value = 1;
  fetchBimbingan(
    1,
    value,
    getSelectedKategoriLabel(selectedCategoriesBimbingan.value)
  );
}
function getSelectedKategoriLabel(selectedCategories) {
  if (selectedCategories.length > 0) {
    // Ambil semua label kategori yang dipilih
    const selectedLabels = selectedCategories
      .map((catId) => {
        const cat = categories.value.find((c) => c.value === catId);
        return cat ? cat.label : "";
      })
      .filter(Boolean);
    return selectedLabels.join(",");
  }
  return "";
}
// Handler filter kategori masing-masing tab
function handleFilterPlot({ values }) {
  selectedCategoriesPlot.value = values;
  currentPagePlotting.value = 1;
  const kategoriStr = getSelectedKategoriLabel(selectedCategoriesPlot.value);
  fetchPlottingPembimbing(1, searchQuery.value, kategoriStr);
}

function handleFilterBimbingan({ values }) {
  selectedCategoriesBimbingan.value = values;
  currentPage.value = 1;
  const kategoriStr = getSelectedKategoriLabel(
    selectedCategoriesBimbingan.value
  );
  fetchBimbingan(1, searchQueryBimbingan.value, kategoriStr);
}

watch(
  () => router.currentRoute.value.query.refresh,
  () => {
    currentPagePlotting.value = 1;
    fetchPlottingPembimbing(
      1,
      searchQuery.value,
      getSelectedKategoriLabel(selectedCategoriesPlot.value)
    );
  }
);
</script>
<template>
  <router-view v-if="$route.path.includes('plot-pembimbing')"></router-view>
  <router-view
    v-else-if="$route.path.includes('detail-bimbingan')"
  ></router-view>
  <div v-else>
    <Breadcrumb />
    <TabDiv
      :tabs="tabs"
      :use-named-slots="true"
      @tab-changed="handleTabChange"
      v-model:selected="selectedTab"
    >
      <template #1>
        <div
          class="flex items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            title="Kategori"
            :items="categories"
            filterType="Kategori"
            @apply="handleFilterPlot"
            triggerText="Kategori"
            :preselectedValues="selectedCategoriesPlot"
          />
          <SearchBar
            v-model="searchQuery"
            @search="onSearchPlotting"
            filterKey="plotting"
          />
        </div>
        <div v-if="loadingPlotting" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorPlotting" :message="error" />
        <Table
          v-else
          :headers="['NIM', 'Nama', 'Kategori', 'Dosen Pembimbing']"
          :items="tabelPlottingPembimbing"
          :pagination="paginationPlotting"
          @rowClick="handleRowClickPlot"
          @pageChange="
            (page) => {
              currentPagePlotting = page;
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
              {{ item.kategori?.nama_kategori }}
            </td>

            <!-- Kolom Nilai -->
            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
              :class="
                item.dosen_pembimbing?.dosen_pembimbing_id == null
                  ? 'text-secondary'
                  : ''
              "
            >
              <div
                v-if="item.dosen_pembimbing?.dosen_pembimbing_id"
                class="flex items-center gap-2"
              >
                {{ item.dosen_pembimbing?.name }}
              </div>
              <div v-else class="text-secondary">Plot Pembimbing</div>
            </td>
          </template>
        </Table>
      </template>
      <template #2>
        <div
          class="flex items-center justify-between gap-2 mb-2 sm:mb-4 lg:gap-4"
        >
          <ModalFilter
            title="Kategori"
            :items="categories"
            filterType="Kategori"
            @apply="handleFilterBimbingan"
            triggerText="Kategori"
            :preselectedValues="selectedCategoriesBimbingan"
          />
          <SearchBar
            v-model="searchQueryBimbingan"
            @search="onSearchBimbingan"
            filterKey="bimbingan"
          />
        </div>
        <div v-if="loadingBimbingan" class="py-8">
          <Loading />
        </div>
        <ErrorMsg v-else-if="errorBimbingan" :message="error" />

        <Table
          v-else
          :headers="[
            'NIM',
            'Nama',
            'Kategori',
            'Dosen Pembimbing',
            'Pertemuan',
          ]"
          :items="tabelBimbingan"
          @rowClick="handleRowClickBimbingan"
          :pagination="paginationBimbingan"
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
              {{ item.kategori?.nama_kategori }}
            </td>

            <!-- Kolom Nilai -->
            <td
              class="px-3 py-2 border-r border-white sm:py-3 sm:px-6 body5 sm:body4 text-blackText"
            >
              {{ item.dosen_pembimbing?.name }}
            </td>

            <td
              class="px-3 py-2 border-r border-white rounded-r-lg sm:py-3 sm:px-6 body5 sm:body4"
              :class="
                item.jumlah_bimbingan == null ||
                item.jumlah_bimbingan === undefined ||
                item.jumlah_bimbingan === 0
                  ? 'text-secondary'
                  : 'text-blackText'
              "
            >
              {{
                item.jumlah_bimbingan == null ||
                item.jumlah_bimbingan === undefined ||
                item.jumlah_bimbingan === 0
                  ? "Belum ada pertemuan"
                  : item.jumlah_bimbingan + "/9"
              }}
            </td>
          </template>
        </Table>
      </template>
    </TabDiv>
  </div>
</template>
