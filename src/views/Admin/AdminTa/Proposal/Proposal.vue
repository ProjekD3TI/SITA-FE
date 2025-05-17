<script setup>
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import Slider from '@/components/Tugas-akhir/Slider.vue';
import { ref, computed } from 'vue';
import router from '@/router';

const searchQuery = ref('');
const selectedTab = ref(1); // Untuk mengetahui tab aktif
const proposalMhs = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
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
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: 'Prof. Andi Wijaya',
    nilai: 85,
    catatan: 'Baik',
    status: '0',
  },
  {
    nim: '11223344',
    nama: 'Alice Johnson',
    img: DefaultAvatar,
    judul_proposal_ta: 'Analisis Data Big Data',
    dosen_pembimbing: 'Dr. Clara Susanti',
    nilai: null,
    catatan: null,
    status: '2',
  },
]);
const statuses = [
  { id: '1', label: 'Disetujui' },
  { id: '0', label: 'Menunggu' },
  { id: '2', label: 'Ditolak' },
];

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
        label:"Pengajuan",
        icon:"M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
        count:"3"
    },
    {
        id:2,
        label:"Seminar",
        icon:"M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    }
]

const filteredProposalPengajuan = computed(() => {
  const q = typeof searchQuery.value === 'string' ? searchQuery.value.toLowerCase() : '';
  return proposalMhs.value.filter((item) => {
    if (selectedTab.value !== 1) return false;
    return (
      item.nim.toLowerCase().includes(q) ||
      item.nama.toLowerCase().includes(q) ||
      (item.judul_proposal_ta && item.judul_proposal_ta.toLowerCase().includes(q))
    );
  });
});

const filteredProposalSeminar = computed(() => {
  const q = typeof searchQuery.value === 'string' ? searchQuery.value.toLowerCase() : '';
  return proposalMhs.value.filter((item) => {
    if (selectedTab.value !== 2) return false;
    return (
      item.nim.toLowerCase().includes(q) ||
      item.nama.toLowerCase().includes(q) ||
      (item.judul_proposal_ta && item.judul_proposal_ta.toLowerCase().includes(q))
    );
  });
});
// Fungsi search
function handleSearch(query) {
  searchQuery.value = query;
}

// Tangkap perubahan tab
function handleTabChange(tabId) {
  selectedTab.value = tabId;
  searchQuery.value = ''; // Reset pencarian saat ganti tab
}

const handleRowClickSeminar = (item) => {
  router.push({
    name: 'DetailProposalForAdmin',
    params: { nim: item.nim },
  });
  console.log('Row clicked in Pengajuan:', item);
};
const handleRowClickPengajuan = (item) => {
  router.push({
    name: 'DetailPengajuanForAdmin',
    params: { nim: item.nim },
  });
  console.log('Row clicked in Pengajuan:', item);
};
</script>
<template>
    <router-view v-if="$route.path.includes('detail-pengajuan')"></router-view>
    <router-view v-else-if="$route.path.includes('detail-proposal')"></router-view>

    <div v-else>
      <Breadcrumb :items="Breadcrumb" />
      <TabDiv
          :tabs="tabs"
          use-named-slots="true"
          @tab-changed="handleTabChange"
      >
      <template #1>
          <div class="flex flex-wrap gap-2 lg:gap-4 justify-between items-center mb-4">
                <ModalFilter
                  class="flex-grow md:flex-none"
                  title="Status"
                  :items="statuses"
                  filterType="status"
                  @apply="handleFilter"
                  triggerText="Status"
                  :preselectedValues="selectedStatuses"
                />
                <SearchBar
                  class="order-last md:order-none"
                  v-model="searchQuery"
                  @search="handleSearch"
                />
                <Slider/>
              </div>
              
                <Table
                  :headers="['NIM', 'Nama','Judul Proposal Tugas Akhir', 'Status']"
                  :items="filteredProposalPengajuan"
                  @rowClick="handleRowClickPengajuan"
                >
                  <template #row="{ item }">
                    <!-- Kolom NIM -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1 rounded-l-lg border-r border-white">
                      {{ item.nim }}
                    </td>
                    
                    <!-- Kolom Nama -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1">
                      <div class="flex items-center gap-2  border-r border-white">
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
                    <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
                      {{ item.judul_proposal_ta }}
                    </td>
                    
                    <!-- Kolom Nilai -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1 rounded-r-lg border-r border-white">
                      <!-- Desktop Status -->
                      <StatusLabel
                        class="w-fit hidden lg:block "
                        :status="getStatusClass(item.status)"
                        size="md"
                        :label="getStatusLabel(item.status)"
                      />
                      
                      <!-- Mobile Status -->
                      <StatusLabel
                        class="w-fit lg:hidden block "
                        :status="getStatusClass(item.status)"
                        size="sm"
                        :label="getStatusLabel(item.status)"
                      />
                    </td>
                  </template>
                </Table>
      </template>
      <template #2>
          <div class="flex gap-2 lg:gap-4 justify-between items-center mb-4">
                <ModalFilter
                  title="Status"
                  :items="statuses"
                  filterType="status"
                  @apply="handleFilter"
                  triggerText="Status"
                  :preselectedValues="selectedStatuses"
                />
                <SearchBar
                  v-model="searchQuery"
                  @search="handleSearch"
                />
              </div>
              
                <Table
                  :headers="['NIM', 'Nama','Judul Proposal Tugas Akhir', 'Nilai']"
                  :items="filteredProposalSeminar"
                  @rowClick="handleRowClickSeminar"
                >
                  <template #row="{ item }">
                    <!-- Kolom NIM -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1 rounded-l-lg border-r border-white">
                      {{ item.nim }}
                    </td>
                    
                    <!-- Kolom Nama -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
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
                    <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
                      {{ item.judul_proposal_ta }}
                    </td>
                    
                    <!-- Kolom Nilai -->
                    <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white rounded-r-lg" :class="item.nilai ==null ? 'text-secondary' : ''">
                      {{ item.nilai || 'Belum Dinilai' }}
                    </td>
                  </template>
                </Table>
      </template>
      </TabDiv>
    </div>
</template>

