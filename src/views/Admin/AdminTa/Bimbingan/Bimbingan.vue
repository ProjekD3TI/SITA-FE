<script setup>
import { ref, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Button from '@/components/Tugas-akhir/Button.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import Slider from '@/components/Tugas-akhir/Slider.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import router from '@/router';
const proposalMhs = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
    kategori: 'Internet Of Things',
    pertemuan: 1,
    judul_proposal_ta: 'Sistem Informasi Akademik',
    dosen_pembimbing: 'Dr. Budi Santoso',
    nilai: 90,
    catatan: 'Sangat Baik',
    status: '1',
  },
  {
    nim: '87654321',
    nama: 'Jane Smith',
    img: DefaultAvatar,
    pertemuan: 2,
    kategori: 'Mobile Development',
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: 'Prof. Andi Wijaya',
    nilai: 85,
    catatan: 'Baik',
    status: '0',
  },
  {
    nim: '11223344',
    nama: 'Alice Johnson',
    kategori: 'Data Science',
    img: DefaultAvatar,
    judul_proposal_ta: 'Analisis Data Big Data',
    dosen_pembimbing: 'Dr. Clara Susanti',
    nilai: null,
    catatan: null,
    status: '2',
  },
]);
const categories =[

]

const getStatusClass = (status) => {
  switch (status) {
    case '1':
      return 'success';
    case '0':
      return 'warning';
    case '2':
      return 'danger';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case '1':
      return 'Disetujui';
    case '0':
      return 'Menunggu';
    case '2':
      return 'Ditolak';
    default:
      return 'Tidak Diketahui';
  }
};
const tabs =[
    {
        id:1,
        label:"Plotting pembimbing",
        icon:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
        count:"3"
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
  console.log('Row clicked in Pengajuan:', item);
};
const handleRowClickBimbingan = (item) => {
  router.push({
    name: 'DetailBimbinganForAdmin',
    params: { nim: item.nim },
  });
  console.log('Row clicked in Pengajuan:', item);
};
</script>
<template>
    <router-view v-if="$route.path.includes('plot-pembimbing')"></router-view>
    <router-view v-else-if="$route.path.includes('detail-bimbingan')"></router-view>

    <div v-else>
        <Breadcrumb :items="breadcrumbItems" />
              <TabDiv
          :tabs="tabs"
          use-named-slots="true"
      >
      <template #1>
          <div class="flex gap-4 justify-between items-center mb-4">
                <ModalFilter
                  title="Category"
                  :items="categories"
                  filterType="Category"
                  @apply="handleFilter"
                  triggerText="Category"
                  :preselectedValues="selectedCategories"
                />
                <SearchBar
                  v-model="searchQuery"
                  @search="handleSearch"
                  filterKey="bimbingan"
                />
                <Slider/>
              </div>
              
                <Table
                  :headers="['NIM', 'Nama','Kategori', 'Dosen Pembimbing']"
                  :items="proposalMhs"
                  @rowClick="handleRowClickPlot"
                >
                  <template #row="{ item }">
                    <!-- Kolom NIM -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">
                      {{ item.nim }}
                    </td>
                    
                    <!-- Kolom Nama -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1">
                      <div class="flex items-center gap-2 justify-center">
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
                    <td class="sm:py-3 py-3 sm:px-4 px-1">
                      {{ item.kategori }}
                    </td>
                    
                    <!-- Kolom Nilai -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
                        {{ item.dosen_pembimbing || 'Plot Dosen Pembimbing' }}
                    </td>
                  </template>
                </Table>
      </template>
      <template #2>
          <div class="flex gap-4 justify-between items-center mb-4">
                <ModalFilter
                  title="Category"
                  :items="categories"
                  filterType="Category"
                  @apply="handleFilter"
                  triggerText="Category"
                  :preselectedValues="selectedCategories"
                />
                <SearchBar
                  v-model="searchQuery"
                  @search="handleSearch"
                  filterKey="bimbingan"
                />
              </div>
              
                <Table
                  :headers="['NIM', 'Nama','Kategori', 'Dosen Pembimbing' , 'Pertemuan']"
                  :items="proposalMhs"
                  @rowClick="handleRowClickBimbingan"
                >
                  <template #row="{ item }">
                    <!-- Kolom NIM -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">
                      {{ item.nim }}
                    </td>
                    
                    <!-- Kolom Nama -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1">
                      <div class="flex items-center gap-2 justify-center">
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
                    <td class="sm:py-3 py-3 sm:px-4 px-1">
                      {{ item.kategori }}
                    </td>
                    
                    <!-- Kolom Nilai -->
                    <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
                      {{ item.dosen_pembimbing }}
                    </td>

                    <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
                    {{ item.pertemuan != null ? item.pertemuan + '/9' : 'Belum ada pertemuan' }}
                    </td>
                  </template>
                </Table>
      </template>
      </TabDiv>

    </div>
</template>