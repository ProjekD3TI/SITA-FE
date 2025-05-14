<script setup>
import TabDiv from '@/components/Tugas-akhir/TabDiv.vue';
import { ref } from 'vue';
import SearchBar from '@/components/Tugas-akhir/Forms/SearchBar.vue';
import ModalFilter from '@/components/Tugas-akhir/Modals/ModalFilter.vue';
import StatusLabel from '@/components/Tugas-akhir/Label.vue';
import Slider from '@/components/Tugas-akhir/Slider.vue';
import Table from '@/components/Tugas-akhir/Table.vue';

const statuses = [
  { id: '1', label: 'Disetujui' },
  { id: '0', label: 'Menunggu' },
  { id: '2', label: 'Ditolak' },
];

const tabs = [
  {
    id: 'tab1',
    label: 'Plotting Penguji',
    icon: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
    count: 5,
  },
  {
    id: 'tab2',
    label: 'Pendaftar',
    icon: 'm20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
    count: 23,
  },
  {
    id: 'tab3',
    label: 'Penjadwalan',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1-2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    count: 23,
  },
  {
    id: 'tab4',
    label: 'Berita Acara',
    icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z',
    count: 23,
  },
];

const plottingPenguji = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    judul_proposal_ta: 'Sistem Informasi Akademik',
    dosen_pembimbing: 'Dr. Budi Santoso',
    status: 'approved',
  },
  {
    nim: '87654321',
    nama: 'Jane Smith',
    judul_proposal_ta: 'Pengembangan Aplikasi Mobile',
    dosen_pembimbing: 'Prof. Andi Wijaya',
    status: 'pending',
  },
  {
    nim: '11223344',
    nama: 'Alice Johnson',
    judul_proposal_ta: 'Analisis Data Big Data',
    dosen_pembimbing: 'Dr. Clara Susanti',
    status: 'rejected',
  },
]);

const getStatusClass = (status) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'approved':
      return 'Disetujui';
    case 'pending':
      return 'Menunggu';
    case 'rejected':
      return 'Ditolak';
    default:
      return 'Tidak Diketahui';
  }
};

const handleRowClick = (item) => {
  console.log('Baris yang diklik:', item);
};
</script>

<template>
  <TabDiv
    :tabs="tabs"
    :use-named-slots="true"
  >
    <template #tab1>
      <!-- Tambahkan pembungkus dengan overflow-x-auto -->
      <div class="overflow-x-auto">
        <div class="flex gap-4 justify-between items-center mb-4">
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
            placeholder="Cari bimbingan..."
            @search="handleSearch"
            filterKey="bimbingan"
          />
          <Slider/>
        </div>
        <!-- Tambahkan min-w-[700px] pada tabel -->
        <Table
          class="min-w-[700px]"
          :headers="['NIM', 'Nama','Judul Proposal Tugas Akhir', 'Dosen Pembimbing' , 'Status']"
          :items="plottingPenguji"
          @rowClick="handleRowClick"
        >
          <template #row="{ item }">
            <!-- Kolom NIM -->
            <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-l-lg">
              {{ item.nim }}
            </td>
            
            <!-- Kolom Nama -->
            <td class="sm:py-3 py-3 sm:px-4 px-1">
              {{ item.nama }}
            </td>
            
            <!-- Kolom Judul Proposal -->
            <td class="sm:py-3 py-3 sm:px-4 px-1">
              {{ item.judul_proposal_ta }}
            </td>
            
            <!-- Kolom Dosen Pembimbing -->
            <td class="py-3 px-1 max-w-[100px] truncate sm:max-w-[200px] md:max-w-[300px] lg:whitespace-nowrap sm:py-3 sm:px-4">
              {{ item.dosen_pembimbing }}
            </td>
            
            <!-- Kolom Status -->
            <td class="sm:py-3 py-3 sm:px-4 px-1 rounded-r-lg">
              <!-- Desktop Status -->
              <StatusLabel
                class="w-fit hidden lg:block mx-auto"
                :status="getStatusClass(item.status)"
                size="md"
                :label="getStatusLabel(item.status)"
              />
              
              <!-- Mobile Status -->
              <StatusLabel
                class="w-fit lg:hidden block mx-auto"
                :status="getStatusClass(item.status)"
                size="sm"
                :label="getStatusLabel(item.status)"
              />
            </td>
          </template>
        </Table>
      </div>
    </template>
  </TabDiv>
</template>