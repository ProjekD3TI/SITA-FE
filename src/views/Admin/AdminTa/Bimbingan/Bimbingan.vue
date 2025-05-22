<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import router from '@/router';
import Loading from '@/components/Loading.vue';
import ErrorMsg from '@/components/ErrorMsg.vue';

const searchQuery = ref('');
const searchQueryBimbingan = ref('');
const selectedCategoriesPlot = ref([]);      // Untuk tab 1
const selectedCategoriesBimbingan = ref([]); // Untuk tab 2
const loading = ref(false);
const error = ref(null);
const listBimbingan = ref ([
  {
    nim: 'V3420001',
    nama: 'John Doe',
    img: DefaultAvatar,
    kategori: 'Internet Of Things',
    dosen_pembimbing : 'Dr. Budi Santoso',
    pertemuan: 1,
  },
  {
    nim: 'V3420002',
    nama: 'Jane Smith',
    img: DefaultAvatar,
    kategori: 'Mobile Development',
    dosen_pembimbing : 'Dr. Clara Susanti',
    pertemuan: 2,
  },
  {
    nim: 'V3420003',
    nama: 'Alice Johnson',
    img: DefaultAvatar,
    kategori: 'Data Science',
    dosen_pembimbing : 'Dr. Clara Susanti',
    pertemuan: null,
  },
])
const reqPembibingMhs = ref([
  {
    nim: 'V3420001',
    nama: 'John Doe',
    img: DefaultAvatar,
    kategori: 'Internet Of Things',
    dosen_pembimbing: 'Dr. Budi Santoso',
  },
  {
    nim: 'V3420002',
    nama: 'Jane Smith',
    img: DefaultAvatar,
    kategori: 'Mobile Development',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420003',
    nama: 'Alice Johnson',
    img: DefaultAvatar,
    kategori: 'Data Science',
    dosen_pembimbing: 'Dr. Clara Susanti',
  },
  {
    nim: 'V3420004',
    nama: 'Bob Brown',
    img: DefaultAvatar,
    kategori: 'Web Development',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420005',
    nama: 'Charlie Green',
    img: DefaultAvatar,
    kategori: 'Machine Learning',
    dosen_pembimbing: 'Dr. Clara Susanti',
  },
  {
    nim: 'V3420006',
    nama: 'David White',
    img: DefaultAvatar,
    kategori: 'Artificial Intelligence',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420007',
    nama: 'Eve Black',
    img: DefaultAvatar,
    kategori: 'Cloud Computing',
    dosen_pembimbing: 'Dr. Budi Santoso',
  },
  {
    nim: 'V3420008',
    nama: 'Frank Blue',
    img: DefaultAvatar,
    kategori: 'Cyber Security',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420009',
    nama: 'Grace Yellow',
    img: DefaultAvatar,
    kategori: 'Blockchain Technology',
    dosen_pembimbing: 'Dr. Clara Susanti',
  },
  {
    nim: 'V3420010',
    nama: 'Hank Red',
    img: DefaultAvatar,
    kategori: 'Internet Of Things',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420011',
    nama: 'Ivy Purple',
    img: DefaultAvatar,
    kategori: 'Mobile Development',
    dosen_pembimbing: 'Dr. Budi Santoso',
  },
  {
    nim: 'V3420012',
    nama: 'Jack Orange',
    img: DefaultAvatar,
    kategori: 'Data Science',
    dosen_pembimbing: null,
  },
  {
    nim: 'V3420013',
    nama: 'Kathy Pink',
    img: DefaultAvatar,
    kategori: 'Web Development',
    dosen_pembimbing: 'Dr. Clara Susanti',
  },
  {
    nim: 'V3420014',
    nama: 'Leo Gray',
    img: DefaultAvatar,
    kategori: 'Machine Learning',
    dosen_pembimbing: null,
  },
])
const categories =[
    { value: 1, label: 'Internet Of Things' },
    { value: 2, label: 'Mobile Development' },
    { value: 3, label: 'Data Science' },
    { value: 4, label: 'Web Development' },
    { value: 5, label: 'Machine Learning' },
    { value: 6, label: 'Artificial Intelligence' },
    { value: 7, label: 'Cloud Computing' },
    { value: 8, label: 'Cyber Security' },
    { value: 9, label: 'Blockchain Technology' },
]

// Hitung jumlah mahasiswa yang belum ada dosen pembimbing
const countBelumAdaPembimbing = computed(() =>
  reqPembibingMhs.value.filter(item => !item.dosen_pembimbing).length
);
const tabs =[
    {
        id:1,
        label:"Plotting pembimbing",
        icon:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
        count: countBelumAdaPembimbing
    },
    {
        id:2,
        label:"Bimbingan",
        icon:"M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    }
]

const handleRowClickPlot = (item) => {
  router.push({
    name: 'PlotPembimbingForAdmin',
    params: { nim: item.nim },
  });
};
const handleRowClickBimbingan = (item) => {
  router.push({
    name: 'DetailBimbinganForAdmin',
    params: { nim: item.nim },
  });
};

// Filter pencarian untuk tab Plotting Pembimbing + kategori
const filteredReqPembibingMhs = computed(() => {
  let data = reqPembibingMhs.value;
  if (selectedCategoriesPlot.value.length > 0) {
    data = data.filter(item =>
      selectedCategoriesPlot.value.some(cat =>
        item.kategori === categories.find(c => c.value === cat)?.label
      )
    );
  }
  if (!searchQuery.value) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (item.dosen_pembimbing && item.dosen_pembimbing.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Filter pencarian untuk tab Bimbingan + kategori
const filteredListBimbingan = computed(() => {
  let data = listBimbingan.value;
  if (selectedCategoriesBimbingan.value.length > 0) {
    data = data.filter(item =>
      selectedCategoriesBimbingan.value.some(cat =>
        item.kategori === categories.find(c => c.value === cat)?.label
      )
    );
  }
  if (!searchQueryBimbingan.value) return data;
  return data.filter(item =>
    item.nim.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQueryBimbingan.value.toLowerCase()) ||
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

</script>
<template>
    <router-view v-if="$route.path.includes('plot-pembimbing')"></router-view>
    <router-view v-else-if="$route.path.includes('detail-bimbingan')"></router-view>

    <div v-else>
      <Breadcrumb />
      <TabDiv
          :tabs="tabs"
          :use-named-slots="true"
          @tab-changed="handleTabChange"

      >
      <template #1>
        <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
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
            filterKey="bimbingan"
          />
        </div>
        <Loading v-if="loading" />
        <ErrorMsg v-else-if="error" :message="error" />
        <Table v-else
          :headers="['NIM', 'Nama','Kategori', 'Dosen Pembimbing']"
          :items="filteredReqPembibingMhs"
          @rowClick="handleRowClickPlot"
        >
          <template #row="{ item }">
            <!-- Kolom NIM -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
              {{ item.nim }}
            </td>
            
            <!-- Kolom Nama -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
              <div class="flex items-center gap-2 ">
                <img
                  v-if="item.img"
                  :src="item.img"
                  alt="Profile Image"
                  class="w-8 h-8 rounded-full"
                />
                {{ item.nama }}
              </div>
            </td>
            
            <!-- Kolom Judul Proposal -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
              {{ item.kategori }}
            </td>
            
            <!-- Kolom Nilai -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white" :class="item.dosen_pembimbing ==null ? 'text-secondary' : ''">
                {{ item.dosen_pembimbing || 'Plot Pembimbing' }}
            </td>
          </template>
        </Table>
      </template>
      <template #2>
        <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
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
            filterKey="bimbingan"
          />
          </div>
              
        <Loading v-if="loading" />
        <ErrorMsg v-else-if="error" :message="error" />
        
        <Table v-else
          :headers="['NIM', 'Nama','Kategori', 'Dosen Pembimbing' , 'Pertemuan']"
          :items="filteredListBimbingan"
          @rowClick="handleRowClickBimbingan"
        >
          <template #row="{ item }">
            <!-- Kolom NIM -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-l-lg border-r border-white">
              {{ item.nim }}
            </td>
            
            <!-- Kolom Nama -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
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
            
            <!-- Kolom Judul Proposal -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 border-r border-white">
              {{ item.kategori }}
            </td>
            
            <!-- Kolom Nilai -->
            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white">
              {{ item.dosen_pembimbing }}
            </td>

            <td class="sm:py-3 py-3 sm:px-6 px-3 rounded-r-lg border-r border-white" :class="item.pertemuan ==null ? 'text-secondary' : ''">
            {{ item.pertemuan != null ? item.pertemuan + '/9' : 'Belum ada pertemuan' }}
            </td>
          </template>
        </Table>
      </template>
      </TabDiv>

    </div>
</template>