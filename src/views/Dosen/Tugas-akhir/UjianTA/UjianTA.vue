<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Table from "@/components/Tugas-akhir/Table.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import Button from "@/components/Tugas-akhir/Button.vue";

const searchQuery = ref("");
// Change filter categories to filter sessions
const filterSessions = ref([
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
]);
const selectedFilters = ref([]);

const mentorships = ref([
  {
    nim: "V3420001",
    name: "Andrew Parker",
    avatar: "/api/placeholder/40/40",
    title: "Implementasi IoT untuk Smart Home",
    date: "15 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Jaringan",
  },
  {
    nim: "V3420002",
    name: "Sarah Johnson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi Mobile",
    date: "16 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    nim: "V3420003",
    name: "Michael Brown",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Keamanan Berbasis IoT",
    date: "17 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Keamanan",
  },
  {
    nim: "V3420004",
    name: "Jessica Smith",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Data Besar untuk Kesehatan",
    date: "18 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Data Besar",
  },
  {
    nim: "V3420005",
    name: "David Lee",
    avatar: "/api/placeholder/40/40",
    title: "Optimasi Algoritma Machine Learning",
    date: "19 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420006",
    name: "Emily Clark",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Web untuk E-Commerce",
    date: "20 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420007",
    name: "Daniel Kim",
    avatar: "/api/placeholder/40/40",
    title: "Pengolahan Citra Digital",
    date: "21 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420008",
    name: "Sophia Turner",
    avatar: "/api/placeholder/40/40",
    title: "Blockchain untuk Keamanan Data",
    date: "22 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Blockchain",
  },
  {
    nim: "V3420009",
    name: "William Harris",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Pakar Diagnosa Penyakit",
    date: "23 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420010",
    name: "Olivia Martinez",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Chatbot untuk Layanan Publik",
    date: "24 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420011",
    name: "James Wilson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Game Edukasi",
    date: "25 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420012",
    name: "Mia Anderson",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Informasi Geografis",
    date: "26 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. GIS",
  },
  {
    nim: "V3420013",
    name: "Benjamin Thomas",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Sentimen Media Sosial",
    date: "27 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Data Besar",
  },
  {
    nim: "V3420014",
    name: "Charlotte White",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Monitoring Kesehatan",
    date: "28 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    nim: "V3420015",
    name: "Lucas Martin",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Rekomendasi Film",
    date: "29 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420016",
    name: "Amelia Walker",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Sistem E-Voting",
    date: "30 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Keamanan",
  },
  {
    nim: "V3420017",
    name: "Henry Young",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Manajemen Inventaris",
    date: "31 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420018",
    name: "Ella King",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Deteksi Intrusi Jaringan",
    date: "1 Juni 2024",
    session: "10:00 - 11:00",
    room: "Lab. Jaringan",
  },
  {
    nim: "V3420019",
    name: "Alexander Scott",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi AR",
    date: "2 Juni 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420020",
    name: "Grace Green",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Penjadwalan Otomatis",
    date: "3 Juni 2024",
    session: "13:00 - 14:00",
    room: "Lab. Data Besar",
  },
]);

// Table headers for the Table component
const tableHeaders = [
  "Nama Lengkap",
  "Judul Tugas Akhir",
  "Tanggal",
  "Sesi",
  "Ruang",
  "Aksi",
];

const items = computed(() => {
  return mentorships.value;
});

// Handler for filter application
const applyFilter = (filterData) => {
  selectedFilters.value = filterData.values;
  console.log("Filters applied:", selectedFilters.value);
};

const filteredItems = computed(() => {
  let filtered = items.value;

  // Apply text search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.nim.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.session.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query)
      );
    });
  }

  // Apply session filter if any selected
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedFilters.value.includes(item.session)
    );
  }

  return filtered;
});

const router = useRouter();
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div
    v-if="!$route.path.includes('detail-ujian-ta')"
    class="bg-white rounded-lg shadow-md p-8"
  >
    <!-- Search and Filter - Stack on mobile -->
    <div class="flex flex-row mb-2 gap-2">
      <div class="w-auto sm:w-auto sm:mr-2">
        <ModalFilter
          title="Sesi"
          :items="filterSessions"
          :preselectedValues="selectedFilters"
          triggerText="Sesi"
          @apply="applyFilter"
          triggerVariant="outlined-black"
          modalPosition="bottom"
          filterType="session"
          hint="*Pilih sesi ujian"
        />
      </div>
      <div class="flex-grow w-full">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search..."
          @search="(data) => (searchQuery = data.value)"
        />
      </div>
    </div>

    <!-- Table view for all screen sizes -->
    <Table :headers="tableHeaders" :items="filteredItems">
      <template #row="{ item }">
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            <img
              class="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
              :src="item.avatar"
              alt=""
            />
            <span>{{ item.name }}</span>
          </div>
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {{ item.title }}
        </td>
        <td class="px-6 py-4">
          {{ item.date }}
        </td>
        <td class="px-6 py-4">
          {{ item.session }}
        </td>
        <td class="px-6 py-4">
          {{ item.room }}
        </td>
        <td class="px-6 py-4">
          <router-link
            :to="{
              path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta',
              query: {
                nim: item.nim || '',
                name: item.name || '',
                title: item.title || 'Judul Tidak Tersedia',
                date: item.date || '',
                session: item.session || '',
                room: item.room || '',
                _t: Date.now(),
              },
            }"
          >
            <Button variant="primary" size="md">Detail</Button>
          </router-link>
        </td>
      </template>
    </Table>
  </div>
  <router-view v-else></router-view>
</template>

<style scoped>
@media (max-width: 640px) {
  .overflow-x-auto {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
