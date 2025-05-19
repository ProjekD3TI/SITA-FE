<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const chartData = {
  labels: ['Sistem Informasi', 'Internet Of Things', 'Game Development', 'Data Science', 'Machine Learning', 'Artificial Intelligence'],
  datasets: [
    {
      label: '2024',
      backgroundColor: ['#f87979'],
      data: [40, 20, 12, 30, 25, 18]
    },
    {
      label: '2025',
      backgroundColor: '#36a2eb',
      data: [35, 25, 18, 28, 30, 22]
    }
  ]
}
const doughnutData = {
  labels: ['Proposal', 'Ujian TA'],
  datasets: [
    {
      label: 'Status Pengajuan',
      backgroundColor: ['#F78052', '#00A2EA'],
      data: [16, 9]
    }
  ]
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
  cutout: '60%', // Adjust the cutout percentage for the doughnut chart
}
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Kategori Tugas Akhir',
      },
      grid: { display: false }, // Grid pada sumbu X tetap tidak ditampilkan
    },
    y: {
      title: {
        display: true,
        text: 'Tugas Akhir',
      },
      beginAtZero: true,
      grid: {
        display: true,
        borderDash: [20, 20], // Membuat garis grid menjadi dash/titik-titik
      },
    },
  },
}
import { ref, onMounted, watch, computed } from 'vue';
import Breadcrumb from '@/components/Tugas-akhir/Breadcrumb.vue';
import SummaryCard from '@/components/Tugas-akhir/SummaryCard.vue';
import Table from '@/components/Tugas-akhir/Table.vue';
import DefaultAvatar from '@/assets/images/Profile Avatar.svg';
import router from '@/router';

const ActiveTA = ref(2);
const ScheduledUjian = ref(1);
const TotalBimbingan = ref(8);
const loading = ref(false);
const error = ref(null);


// Icon paths
const iconPaths = {
  requestPembimbing:
    "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  proposal:
    "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
  ujianTA:
    "M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12",
  book: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z",
  graduation:
    "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
};
// Summary cards configuration
const summaryCards = [
  {
    icon: iconPaths.book,
    iconColor: "danger",
    title: ActiveTA,
    subtitle: "Tugas Akhir Aktif",
  },
  {
    icon: iconPaths.calendar,
    iconColor: "success",
    title: ScheduledUjian,
    subtitle: "Ujian Terjadwal",
  },
  {
    icon: iconPaths.graduation,
    iconColor: "warning",
    title: TotalBimbingan,
    subtitle: "Mahasiswa Terdaftar",
  },
];

// Data dummy
const tugas_akhirMhs = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
    judul_ta: 'Sistem Informasi Akademik',
    kategori: 'Sistem Informasi',
    dosen_pembimbing: 'Dr. Budi Santoso',
    status: '1',
  },
  {
    nim: '87654321',
    nama: 'Jane Smith',
    img: DefaultAvatar,
    judul_ta: 'Pengembangan Aplikasi Mobile',
    kategori: 'Aplikasi Mobile',
    dosen_pembimbing: 'Prof. Andi Wijaya',
    status: '1',
  },
  {
    nim: '11223344',
    nama: 'Alice Johnson',
    img: DefaultAvatar,
    judul_ta: 'Analisis Data Big Data',
    kategori: 'Data Science', 
    dosen_pembimbing: 'Dr. Clara Susanti',
    status: '0',
  },
]);
const proposalMhs = ref([
  {
    nim: '12345678',
    nama: 'John Doe',
    img: DefaultAvatar,
    judul_proposal_ta: 'Sistem Informasi Akademik',
    kategori: 'Sistem Informasi',
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
    kategori: 'Aplikasi Mobile',
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
    kategori: 'Data Science', 
    dosen_pembimbing: 'Dr. Clara Susanti',
    nilai: null,
    catatan: null,
    status: '2',
  },
]);

const filteredTugasAkhir = computed(() => {
  return tugas_akhirMhs.value.filter((item) => item.status === '0');
});
const filteredPlottingProposal = computed(() => {
  return proposalMhs.value.filter((item) => item.status === '0');
});
const handleRowClickProposal = (item) => {
    router.push({
    name: 'DetailPengajuanForAdmin',
    params: { nim: item.nim },
  });
  console.log('Row clicked:', item);
};
const handleRowClickUjianTA = (item) => {
    router.push({
    name: 'DetailPendaftarForAdmin',
    params: { nim: item.nim },
  });
  console.log('Row clicked:', item);
};
</script>
<template>
<Breadcrumb :items="breadcrumbItems" />
    <!-- Status card & Summary Cards -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
      <!-- Status Card -->
      <div class="card-rounded bg-white p-4 lg:p-8 flex-1">
          <h5 class="body2-bold mb-4">Verifikasi Berkas</h5>
          <div class="w-48 h-48 sm:w-52 sm:h-52 mx-auto relative">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
            <div class="absolute top-1/2 left-1/2 w-24 h-24 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              <div class="text-center w-full truncate heading5 sm:heading4">
                16/4
              </div>
            </div>
          </div>
      </div>

      <!-- Summary Cards -->
      <div
        class="card-rounded bg-white p-4 lg:p-8 flex sm:flex-row flex-col justify-evenly flex-grow"
      >
        <template v-for="(card, index) in summaryCards" :key="index">
          <!-- Card -->
          <SummaryCard
            :icon="card.icon"
            :iconColor="card.iconColor"
            :title="card.title || '-'"
            :subtitle="card.subtitle"
          />

          <!-- Divider (except after last card) -->
          <template v-if="index < summaryCards.length - 1">
            <div
              class="hidden sm:flex h-auto w-px my-14 bg-placeholder mx-4 self-stretch"
            ></div>
            <div
              class="sm:hidden max-w-[240px] w-10/12 h-px bg-placeholder mx-auto my-4"
            ></div>
          </template>
        </template>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <div class="card-rounded bg-white p-4 lg:p-8 mt-4 flex-grow">
        <div class="flex justify-between items-center mb-4">
          <h5 class="body2-bold">Validasi Berkas Seminar Proposal </h5>
          <router-link class="text-secondary" to="tugas-akhir/proposal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </router-link>
        </div>  
        <Table
          minWidth="min-w-[300px]"
          :headers="['NIM', 'Nama', 'Judul Proposal Tugas Akhir']"
          :items="filteredPlottingProposal"
          :showPagination="false"
          @rowClick="handleRowClickProposal"
        >
          <template #row="{ item }">
            <td class="sm:py-3 py-3 sm:px-6 px-1 rounded-l-lg border-r border-white">
              {{ item.nim }}
            </td>
            <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
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
            <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
              {{ item.judul_proposal_ta }}
            </td>
          </template>
        </Table>
      </div>
      <div class="card-rounded bg-white p-4 lg:p-8 mt-4 flex-grow">
        <div class="flex justify-between items-center mb-4">
          <h5 class="body2-bold">Validasi Berkas Ujian Tugas Akhir</h5>
          <router-link
            class="text-secondary"
            :to="{ name: 'UjianTAforAdmin', query: { tab: 'tab2' } }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </router-link>
        </div> 
        <Table
          minWidth="min-w-[300px]"
          :headers="['NIM', 'Nama', 'Judul Tugas Akhir']"
          :items="filteredTugasAkhir"
          :showPagination="false"
          @rowClick="handleRowClickUjianTA"
        >
          <template #row="{ item }">
            <td class="sm:py-3 py-3 sm:px-6 px-1 rounded-l-lg border-r border-white">
              {{ item.nim }}
            </td>
            <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
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
            <td class="sm:py-3 py-3 sm:px-6 px-1 border-r border-white">
              {{ item.judul_ta }}
            </td>
          </template>
        </Table>
      </div>
    </div>

    <div class="card-rounded bg-white p-4 lg:p-8 mt-4 h-[50dvh]">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>