<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { ref, computed, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";

const activeTab = ref("permintaan");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const isMobileView = ref(window.innerWidth < 768);

// Add window resize event listener
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  isMobileView.value = window.innerWidth < 768;
};

const mentorships = ref([
  {
    name: "Andrew Parker",
    avatar: "/api/placeholder/40/40",
    title: "Implementasi IoT untuk Smart Home",
    date: "2023-10-01",
    session: "09:00 - 10:00",
    room: "Lab. Jaringan",
  },
  {
    name: "Sarah Johnson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi Mobile",
    date: "2023-10-02",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    name: "Michael Brown",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Keamanan Berbasis IoT",
    date: "2023-10-03",
    session: "11:00 - 12:00",
    room: "Lab. Keamanan",
  },
  {
    name: "Jessica Smith",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Data Besar untuk Kesehatan",
    date: "2023-10-04",
    session: "13:00 - 14:00",
    room: "Lab. Data Besar",
  },
  {
    name: "David Lee",
    avatar: "/api/placeholder/40/40",
    title: "Optimasi Algoritma Machine Learning",
    date: "2023-10-05",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    name: "Emily Clark",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Web untuk E-Commerce",
    date: "2023-10-06",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    name: "Daniel Kim",
    avatar: "/api/placeholder/40/40",
    title: "Pengolahan Citra Digital",
    date: "2023-10-07",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    name: "Sophia Turner",
    avatar: "/api/placeholder/40/40",
    title: "Blockchain untuk Keamanan Data",
    date: "2023-10-08",
    session: "13:00 - 14:00",
    room: "Lab. Blockchain",
  },
  {
    name: "William Harris",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Pakar Diagnosa Penyakit",
    date: "2023-10-09",
    session: "09:00 - 10:00",
    room: "Lab. AI",
  },
  {
    name: "Olivia Martinez",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Chatbot untuk Layanan Publik",
    date: "2023-10-10",
    session: "10:00 - 11:00",
    room: "Lab. Web",
  },
  {
    name: "James Wilson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Game Edukasi",
    date: "2023-10-11",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    name: "Mia Anderson",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Informasi Geografis",
    date: "2023-10-12",
    session: "13:00 - 14:00",
    room: "Lab. GIS",
  },
  {
    name: "Benjamin Thomas",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Sentimen Media Sosial",
    date: "2023-10-13",
    session: "09:00 - 10:00",
    room: "Lab. Data Besar",
  },
  {
    name: "Charlotte White",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Monitoring Kesehatan",
    date: "2023-10-14",
    session: "10:00 - 11:00",
    room: "Lab. Mobile",
  },
  {
    name: "Lucas Martin",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Rekomendasi Film",
    date: "2023-10-15",
    session: "11:00 - 12:00",
    room: "Lab. AI",
  },
  {
    name: "Amelia Walker",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Sistem E-Voting",
    date: "2023-10-16",
    session: "13:00 - 14:00",
    room: "Lab. Keamanan",
  },
  {
    name: "Henry Young",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Manajemen Inventaris",
    date: "2023-10-17",
    session: "09:00 - 10:00",
    room: "Lab. Web",
  },
  {
    name: "Ella King",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Deteksi Intrusi Jaringan",
    date: "2023-10-18",
    session: "10:00 - 11:00",
    room: "Lab. Jaringan",
  },
  {
    name: "Alexander Scott",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Aplikasi AR",
    date: "2023-10-19",
    session: "11:00 - 12:00",
    room: "Lab. Multimedia",
  },
  {
    name: "Grace Green",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Penjadwalan Otomatis",
    date: "2023-10-20",
    session: "13:00 - 14:00",
    room: "Lab. Data Besar",
  },
]);

// Rest of your computed properties and methods

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

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

// Get current page items
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredItems.value.slice(startIndex, endIndex);
});

// Navigation methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Reset to first page when changing tabs or search query
const resetPagination = () => {
  currentPage.value = 1;
};

const router = useRouter();

const handleRowClick = (item) => {
  if (activeTab.value === "dibimbing") {
    router.push("/dosen/tugas-akhir/ujian-ta/detail-ujian-ta");
  }
  console.log("Row clicked:", item);
};
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div class="bg-white rounded-lg shadow-md p-2 sm:p-4">
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

    <!-- Responsive Table for desktop view -->
    <div class="hidden md:block relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right">
        <thead class="text-xs uppercase bg-primary-bg">
          <tr>
            <th scope="col" class="px-6 py-5 rounded-l-lg">Nama Lengkap</th>
            <th scope="col" class="px-6 py-5">Judul Tugas Akhir</th>
            <th scope="col" class="px-6 py-5">Tanggal</th>
            <th scope="col" class="px-6 py-5 rounded-r-lg">Sesi</th>
            <th scope="col" class="px-6 py-5 rounded-r-lg">Ruang</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedItems"
            :key="index"
            class="bg-white border-b rounded-l-lg hover:bg-gray-50 cursor-pointer transition-colors"
            @click="handleRowClick(item)"
            role="button"
            tabindex="0"
          >
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
            <td
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap rounded-l-lg"
            >
              {{ item.title }}
            </td>
            <td class="px-6 py-4">
              {{ item.date }}
            </td>
            <td class="px-6 py-4 rounded-r-lg">
              {{ item.session }}
            </td>
            <td class="px-6 py-4 rounded-r-lg">
              {{ item.room }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card view for mobile devices
    <div class="md:hidden">
      <div
        v-for="(item, index) in paginatedItems"
        :key="index"
        class="border rounded-lg mb-3 p-3 shadow-sm hover:bg-gray-50"
      >
        <div class="flex items-center mb-2">
          <div class="h-10 w-10 mr-3">
            <img class="h-10 w-10 rounded-full" :src="item.avatar" alt="" />
          </div>
          <div>
            <div class="text-sm font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.nim }}</div>
          </div>
        </div>

        <div class="text-xs grid grid-cols-2 gap-2">
          <div v-if="activeTab === 'dibimbing'" class="col-span-2">
            <span class="font-medium">Judul:</span> {{ item.title }}
          </div>
          <div>
            <span class="font-medium">Kategori:</span> {{ item.category }}
          </div>
          <div v-if="activeTab === 'permintaan'">
            <span class="font-medium">Tanggal:</span> {{ item.date }}
          </div>
        </div>
      </div>
    </div> -->

    <!-- Pagination with responsive design -->
    <div
      class="flex flex-wrap justify-between items-center px-2 mt-4 text-xs text-gray-500"
    >
      <div class="w-full sm:w-auto mb-2 sm:mb-0 text-center sm:text-left">
        Menampilkan
        {{
          filteredItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
        }}-{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} dari
        {{ filteredItems.length }}
      </div>
      <div class="flex justify-center w-full sm:w-auto">
        <button
          class="p-1 border border-gray-300 rounded-md mr-1"
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="px-3 py-1 my-auto"
          >{{ currentPage }} / {{ totalPages }}</span
        >
        <button
          class="p-1 border border-gray-300 rounded-md"
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
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
