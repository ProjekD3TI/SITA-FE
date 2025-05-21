<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Table from "@/components/Tugas-akhir/Table.vue";

const searchQuery = ref("");

const mentorships = ref([
  {
    nim: "V3420001",
    name: "Andrew Parker",
    avatar: "/api/placeholder/40/40",
    title: "Implementasi IoT untuk Smart Home",
    category: "Internet of Things",
    date: "15 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Jaringan",
  },
  {
    nim: "V3420002",
    name: "Sarah Johnson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi Mobile",
    category: "Mobile Development",
    date: "16 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    nim: "V3420003",
    name: "Michael Brown",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Keamanan Berbasis IoT",
    category: "Cyber Security",
    date: "17 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Keamanan",
  },
  {
    nim: "V3420004",
    name: "Jessica Smith",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Data Besar untuk Kesehatan",
    category: "Big Data",
    date: "18 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Data Besar",
  },
  {
    nim: "V3420005",
    name: "David Lee",
    avatar: "/api/placeholder/40/40",
    title: "Optimasi Algoritma Machine Learning",
    category: "Artificial Intelligence",
    date: "19 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420006",
    name: "Emily Clark",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Web untuk E-Commerce",
    category: "Web Development",
    date: "20 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420007",
    name: "Daniel Kim",
    avatar: "/api/placeholder/40/40",
    title: "Pengolahan Citra Digital",
    category: "Multimedia",
    date: "21 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420008",
    name: "Sophia Turner",
    avatar: "/api/placeholder/40/40",
    title: "Blockchain untuk Keamanan Data",
    category: "Blockchain",
    date: "22 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Blockchain",
  },
  {
    nim: "V3420009",
    name: "William Harris",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Pakar Diagnosa Penyakit",
    category: "Artificial Intelligence",
    date: "23 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420010",
    name: "Olivia Martinez",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Chatbot untuk Layanan Publik",
    category: "Web Development",
    date: "24 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420011",
    name: "James Wilson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Game Edukasi",
    category: "Multimedia",
    date: "25 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420012",
    name: "Mia Anderson",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Informasi Geografis",
    category: "Geographic Information System",
    date: "26 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. GIS",
  },
  {
    nim: "V3420013",
    name: "Benjamin Thomas",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Sentimen Media Sosial",
    category: "Big Data",
    date: "27 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Data Besar",
  },
  {
    nim: "V3420014",
    name: "Charlotte White",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Monitoring Kesehatan",
    category: "Mobile Development",
    date: "28 Mei 2024",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    nim: "V3420015",
    name: "Lucas Martin",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Rekomendasi Film",
    category: "Artificial Intelligence",
    date: "29 Mei 2024",
    session: "11:00 - 12:00",
    room: "Lab. AI",
  },
  {
    nim: "V3420016",
    name: "Amelia Walker",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Sistem E-Voting",
    category: "Cyber Security",
    date: "30 Mei 2024",
    session: "13:00 - 14:00",
    room: "Lab. Keamanan",
  },
  {
    nim: "V3420017",
    name: "Henry Young",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Manajemen Inventaris",
    category: "Web Development",
    date: "31 Mei 2024",
    session: "09:00 - 10:00",
    room: "Lab. Web",
  },
  {
    nim: "V3420018",
    name: "Ella King",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Deteksi Intrusi Jaringan",
    category: "Network Security",
    date: "1 Juni 2024",
    session: "10:00 - 11:00",
    room: "Lab. Jaringan",
  },
  {
    nim: "V3420019",
    name: "Alexander Scott",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi AR",
    category: "Multimedia",
    date: "2 Juni 2024",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    nim: "V3420020",
    name: "Grace Green",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Penjadwalan Otomatis",
    category: "Big Data",
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
];

const items = computed(() => {
  return mentorships.value;
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;

  const query = searchQuery.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.nim.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.date && item.date.toLowerCase().includes(query))
    );
  });
});

const router = useRouter();

const handleRowClick = (item) => {
  console.log("Navigating to detail for:", item);

  // Gunakan path untuk navigasi lebih aman
  router
    .push({
      path: "/dosen/tugas-akhir/ujian-ta/detail-ujian-ta",
      query: {
        nim: item.nim || "",
        name: item.name || "",
        category: item.category || "",
        title: item.title || "Judul Tidak Tersedia",
        date: item.date || "",
        session: item.session || "",
        room: item.room || "",
        _t: Date.now(),
      },
    })
    .catch((err) => {
      console.error("Navigation error:", err);
    });
};
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div
    v-if="!$route.path.includes('detail-ujian-ta')"
    class="bg-white rounded-lg shadow-md p-2 sm:p-4"
  >
    <!-- Search and Filter - Stack on mobile -->
    <div class="flex flex-row mb-2 gap-2">
      <div class="w-auto sm:w-auto sm:mr-2">
        <button
          class="flex items-center sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white text-xs text-gray-700 justify-between"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span class="hidden sm:inline">Kategori</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="sm:ms-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div class="flex-grow w-full">
        <div class="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 text-xs"
            v-model="searchQuery"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400 absolute left-3 top-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Table view for all screen sizes -->
    <Table
      :headers="tableHeaders"
      :items="filteredItems"
      @rowClick="handleRowClick"
    >
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
