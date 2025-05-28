<script setup>
import { ref, computed, watch, onMounted, } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import router from '@/router';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';
import {
  useTabelPlottingPembimbing,
  useKategori,
  useTabelBimbingan
} from '@/services/TugasAkhir/Admin/bimbingan.js';

const { dataPlotting, fetchData, loadingPlotting, errorPlotting } = useTabelPlottingPembimbing();
const { dataKategori, loadingKategori, errorKategori } = useKategori();
const { dataBimbingan, loadingBimbingan, errorBimbingan } = useTabelBimbingan();

// Komputed untuk data tabel plotting pembimbing
const tabelPlottingPembimbing = computed(() => {
  // Pastikan dataPlotting sudah terisi dan array
  return Array.isArray(dataPlotting.value) ? dataPlotting.value : [];
});

const tabelBimbingan = computed(() => {
  // Pastikan dataPlotting sudah terisi dan array
  return Array.isArray(dataBimbingan.value) ? dataBimbingan.value : [];
});
const searchQuery = ref('');
const searchQueryBimbingan = ref('');
const selectedCategoriesPlot = ref([]);      // Untuk tab 1
const selectedCategoriesBimbingan = ref([]); // Untuk tab 2

const categories = computed(() =>
  Array.isArray(dataKategori.value)
    ? dataKategori.value.map(item => ({
      value: item.id,
      label: item.nama_kategori
    }))
    : []
);

// Hitung jumlah mahasiswa yang belum ada dosen pembimbing
const countBelumAdaPembimbing = computed(() =>
  tabelPlottingPembimbing.value.filter(item => !item.dosen_pembimbing).length
);

const tabs = [
  {
    id: 1,
    label: "Plotting pembimbing",
    icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    count: countBelumAdaPembimbing
  },
  {
    id: 2,
    label: "Bimbingan",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  }
]

const handleRowClickPlot = (item) => {
  router.push({
    name: 'PlotPembimbingForAdmin',
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};
const handleRowClickBimbingan = (item) => {
  router.push({ name: 'DetailBimbinganForAdmin', params: { tugas_akhir_id: item.id } });
};

// Filter pencarian untuk tab Plotting Pembimbing + kategori
const filteredReqPembibingMhs = computed(() => {
  let data = tabelPlottingPembimbing.value;

  // Filter kategori
  if (selectedCategoriesPlot.value.length > 0) {
    // Ambil label kategori yang dipilih berdasarkan value (id)
    const selectedLabels = categories.value
      .filter(cat => selectedCategoriesPlot.value.includes(cat.value))
      .map(cat => cat.label);

    data = data.filter(item =>
      selectedLabels.includes(item.kategori)
    );
  }

  // Filter search
  if (!searchQuery.value) return data;
  return data.filter(item =>
    item.nim?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.mahasiswa?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Filter pencarian untuk tab Bimbingan + kategori
const filteredListBimbingan = computed(() => {
  // Gunakan dataBimbingan dari backend, bukan listBimbingan dummy
  let data = tabelBimbingan.value;

  // Filter kategori
  if (selectedCategoriesBimbingan.value.length > 0) {
    // Ambil label kategori yang dipilih berdasarkan value (id)
    const selectedLabels = categories.value
      .filter(cat => selectedCategoriesBimbingan.value.includes(cat.value))
      .map(cat => cat.label);

    data = data.filter(item =>
      selectedLabels.includes(item.kategori)
    );
  }

  // Filter search
  if (!searchQueryBimbingan.value) return data;
  return data.filter(item =>
    item.nim?.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase()) ||
    item.nama?.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase())) ||
    (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase()))
  );
});

const selectedTab = ref(1);
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQueryBimbingan.value = '';
  searchQuery.value = '';
  selectedCategoriesBimbingan.value = [];
  selectedCategoriesPlot.value = [];
}
// Handler filter kategori masing-masing tab
function handleFilterPlot({ values }) {
  selectedCategoriesPlot.value = values;
}
function handleFilterBimbingan({ values }) {
  selectedCategoriesBimbingan.value = values;
}

watch(
  () => router.currentRoute.value.query.refresh,
  () => {
    fetchData();
  }
);
</script>
<template>
  <router-view v-if="$route.path.includes('plot-pembimbing')"></router-view>
  <router-view v-else-if="$route.path.includes('detail-bimbingan')"></router-view>

  <div v-else-if="loadingBimbingan || loadingKategori || loadingPlotting"
    class="flex items-center justify-center min-h-[80dvh]">
    <Loading />
  </div>

  <div v-else-if="errorBimbingan || errorKategori || errorPlotting" class="p-4">
    <ErrorMsg :message="errorBimbingan || errorKategori || errorPlotting" />
  </div>

  <div v-else>
    <Breadcrumb />
    <TabDiv :tabs="tabs" :use-named-slots="true" @tab-changed="handleTabChange">
      <template #1>
        <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
          <ModalFilter title="Kategori" :items="categories" filterType="Kategori" @apply="handleFilterPlot"
            triggerText="Kategori" :preselectedValues="selectedCategoriesPlot" />
          <SearchBar v-model="searchQuery" filterKey="bimbingan" />
        </div>
        <Table :headers="['NIM', 'Nama', 'Kategori', 'Dosen Pembimbing']" :items="filteredReqPembibingMhs"
          @rowClick="handleRowClickPlot">
          <template #row="{ item }">
            <!-- Kolom NIM -->
            <td class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6">
              {{ item.nim }}
            </td>

            <!-- Kolom Nama -->
            <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
              <div class="flex items-center gap-2 ">
                <img :src="DefaultAvatar" alt="Profile Image" class="w-8 h-8 rounded-full" />
                {{ item.mahasiswa }}
              </div>
            </td>

            <!-- Kolom Judul Proposal -->
            <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
              {{ item.kategori }}
            </td>

            <!-- Kolom Nilai -->
            <td class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
              :class="item.dosen_pembimbing == null ? 'text-secondary' : ''">
              {{ item.dosen_pembimbing || 'Plot Pembimbing' }}
            </td>
          </template>
        </Table>
      </template>
      <template #2>
        <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
          <ModalFilter title="Kategori" :items="categories" filterType="Kategori" @apply="handleFilterBimbingan"
            triggerText="Kategori" :preselectedValues="selectedCategoriesBimbingan" />
          <SearchBar v-model="searchQueryBimbingan" filterKey="bimbingan" />
        </div>

        <Loading v-if="loading" />
        <ErrorMsg v-else-if="error" :message="error" />

        <Table v-else :headers="['NIM', 'Nama', 'Kategori', 'Dosen Pembimbing', 'Pertemuan']"
          :items="filteredListBimbingan" @rowClick="handleRowClickBimbingan">
          <template #row="{ item }">
            <!-- Kolom NIM -->
            <td class="px-3 py-3 border-r border-white rounded-l-lg sm:py-3 sm:px-6">
              {{ item.nim }}
            </td>

            <!-- Kolom Nama -->
            <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
              <div class="flex items-center gap-2">
                <img :src="DefaultAvatar" alt="Profile Image" class="w-8 h-8 rounded-full" />
                {{ item.mahasiswa }}
              </div>
            </td>

            <!-- Kolom Judul Proposal -->
            <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
              {{ item.kategori }}
            </td>

            <!-- Kolom Nilai -->
            <td class="px-3 py-3 border-r border-white sm:py-3 sm:px-6">
              {{ item.dosen_pembimbing }}
            </td>

            <td class="px-3 py-3 border-r border-white rounded-r-lg sm:py-3 sm:px-6"
              :class="item.jumlah_bimbingan == null || item.jumlah_bimbingan === undefined || item.jumlah_bimbingan === 0 ? 'text-secondary' : ''">
              {{ item.jumlah_bimbingan == null || item.jumlah_bimbingan === undefined || item.jumlah_bimbingan === 0
                ? 'Belum ada pertemuan'
                : item.jumlah_bimbingan + '/9'
              }}
            </td>
          </template>
        </Table>
      </template>
    </TabDiv>

  </div>
</template>