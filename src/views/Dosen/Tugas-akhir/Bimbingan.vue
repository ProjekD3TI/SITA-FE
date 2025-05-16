<script setup>
import { ref, computed, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Sidebar from "@/components/Admin/Sidebar.vue";
import SidebarLink from "@/components/Tugas-akhir/SidebarLink.vue";

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

const requests = ref([
  {
    nim: "V3420101",
    name: "Christine Brooks",
    avatar: "/api/placeholder/40/40",
    category: "Internet Of Things",
    date: "04 Sep 2023",
  },
  {
    nim: "V3420102",
    name: "David Johnson",
    avatar: "/api/placeholder/40/40",
    category: "Machine Learning",
    date: "15 Oct 2023",
  },
  {
    nim: "V3420103",
    name: "Emily Wilson",
    avatar: "/api/placeholder/40/40",
    category: "Data Science",
    date: "22 Nov 2023",
  },
  {
    nim: "V3420104",
    name: "Michael Brown",
    avatar: "/api/placeholder/40/40",
    category: "Web Development",
    date: "10 Dec 2023",
  },
  {
    nim: "V3420105",
    name: "Sarah Thompson",
    avatar: "/api/placeholder/40/40",
    category: "Cybersecurity",
    date: "05 Jan 2024",
  },
  {
    nim: "V3420106",
    name: "Jason Rodriguez",
    avatar: "/api/placeholder/40/40",
    category: "Artificial Intelligence",
    date: "18 Jan 2024",
  },
  {
    nim: "V3420107",
    name: "Laura Martinez",
    avatar: "/api/placeholder/40/40",
    category: "Cloud Computing",
    date: "02 Feb 2024",
  },
  {
    nim: "V3420108",
    name: "Kevin Anderson",
    avatar: "/api/placeholder/40/40",
    category: "Mobile Development",
    date: "20 Feb 2024",
  },
  {
    nim: "V3420109",
    name: "Jennifer Davis",
    avatar: "/api/placeholder/40/40",
    category: "Data Mining",
    date: "07 Mar 2024",
  },
  {
    nim: "V3420110",
    name: "Robert Wilson",
    avatar: "/api/placeholder/40/40",
    category: "Network Security",
    date: "25 Mar 2024",
  },
  {
    nim: "V3420111",
    name: "Anna Lee",
    avatar: "/api/placeholder/40/40",
    category: "Big Data",
    date: "10 Apr 2024",
  },
  {
    nim: "V3420112",
    name: "Thomas Clark",
    avatar: "/api/placeholder/40/40",
    category: "Software Engineering",
    date: "27 Apr 2024",
  },
  {
    nim: "V3420113",
    name: "Olivia White",
    avatar: "/api/placeholder/40/40",
    category: "Database Systems",
    date: "15 May 2024",
  },
  {
    nim: "V3420114",
    name: "Daniel Lewis",
    avatar: "/api/placeholder/40/40",
    category: "Computer Vision",
    date: "01 Jun 2024",
  },
  {
    nim: "V3420115",
    name: "Emma Garcia",
    avatar: "/api/placeholder/40/40",
    category: "Blockchain",
    date: "18 Jun 2024",
  },
  {
    nim: "V3420116",
    name: "Brandon Taylor",
    avatar: "/api/placeholder/40/40",
    category: "Human-Computer Interaction",
    date: "05 Jul 2024",
  },
  {
    nim: "V3420117",
    name: "Sophia Martin",
    avatar: "/api/placeholder/40/40",
    category: "Natural Language Processing",
    date: "22 Jul 2024",
  },
  {
    nim: "V3420118",
    name: "Lucas Moore",
    avatar: "/api/placeholder/40/40",
    category: "Embedded Systems",
    date: "10 Aug 2024",
  },
  {
    nim: "V3420119",
    name: "Victoria Jackson",
    avatar: "/api/placeholder/40/40",
    category: "Game Development",
    date: "28 Aug 2024",
  },
  {
    nim: "V3420120",
    name: "Ryan Adams",
    avatar: "/api/placeholder/40/40",
    category: "Quantum Computing",
    date: "15 Sep 2024",
  },
]);

const mentorships = ref([
  {
    nim: "V3420001",
    name: "Andrew Parker",
    avatar: "/api/placeholder/40/40",
    title: "Implementasi IoT untuk Smart Home",
    category: "Internet Of Things",
  },
  {
    nim: "V3420002",
    name: "Michelle Williams",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Prediksi Cuaca dengan Machine Learning",
    category: "Machine Learning",
  },
  {
    nim: "V3420003",
    name: "Christopher Allen",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Sentimen pada Data Media Sosial",
    category: "Data Science",
  },
  {
    nim: "V3420004",
    name: "Rebecca Nelson",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Progressive Web App",
    category: "Web Development",
  },
  {
    nim: "V3420005",
    name: "Jonathan Hill",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Deteksi Intrusi Berbasis AI",
    category: "Cybersecurity",
  },
  {
    nim: "V3420006",
    name: "Amanda Scott",
    avatar: "/api/placeholder/40/40",
    title: "Asisten Virtual Menggunakan Deep Learning",
    category: "Artificial Intelligence",
  },
  {
    nim: "V3420007",
    name: "Brian Green",
    avatar: "/api/placeholder/40/40",
    title: "Arsitektur Microservices pada Cloud",
    category: "Cloud Computing",
  },
  {
    nim: "V3420008",
    name: "Melissa King",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Mobile untuk Tracking Kesehatan",
    category: "Mobile Development",
  },
  {
    nim: "V3420009",
    name: "Steven Baker",
    avatar: "/api/placeholder/40/40",
    title: "Clustering Data Pelanggan E-commerce",
    category: "Data Mining",
  },
  {
    nim: "V3420010",
    name: "Jessica Cooper",
    avatar: "/api/placeholder/40/40",
    title: "Keamanan Jaringan pada Infrastruktur Kritis",
    category: "Network Security",
  },
  {
    nim: "V3420011",
    name: "Gregory Roberts",
    avatar: "/api/placeholder/40/40",
    title: "Pengolahan Data Streaming Real-time",
    category: "Big Data",
  },
  {
    nim: "V3420012",
    name: "Catherine Phillips",
    avatar: "/api/placeholder/40/40",
    title: "Penerapan Metode Agile pada Proyek Skala Besar",
    category: "Software Engineering",
  },
  {
    nim: "V3420013",
    name: "Peter Henderson",
    avatar: "/api/placeholder/40/40",
    title: "Optimasi Query NoSQL Database",
    category: "Database Systems",
  },
  {
    nim: "V3420014",
    name: "Nancy Ross",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Pengenalan Objek pada Video Streaming",
    category: "Computer Vision",
  },
  {
    nim: "V3420015",
    name: "Mark Edwards",
    avatar: "/api/placeholder/40/40",
    title: "Smart Contract untuk Supply Chain",
    category: "Blockchain",
  },
  {
    nim: "V3420016",
    name: "Diana Watson",
    avatar: "/api/placeholder/40/40",
    title: "Desain Antarmuka Adaptif untuk Aksesibilitas",
    category: "Human-Computer Interaction",
  },
  {
    nim: "V3420017",
    name: "Timothy Butler",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Terjemahan Bahasa Daerah Otomatis",
    category: "Natural Language Processing",
  },
  {
    nim: "V3420018",
    name: "Rachel Morgan",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Kendali Smart Factory",
    category: "Embedded Systems",
  },
  {
    nim: "V3420019",
    name: "Kyle Russell",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Game Edukasi Interaktif",
    category: "Game Development",
  },
  {
    nim: "V3420020",
    name: "Elizabeth Price",
    avatar: "/api/placeholder/40/40",
    title: "Simulasi Algoritma Kuantum",
    category: "Quantum Computing",
  },
]);

// Rest of your computed properties and methods

const items = computed(() => {
  return activeTab.value === "permintaan" ? requests.value : mentorships.value;
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

  console.log("Row clicked:", item);
  router.push("/dosen/tugas-akhir/bimbingan/detail-bimbingan");
}
};

watch(activeTab, () => resetPagination());
watch(searchQuery, () => resetPagination());
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div class="bg-white rounded-lg shadow-md p-2 sm:p-4">
    <!-- Tab Navigation -->
    <div class="flex flex-wrap border-b mb-4">
      <button
        @click="activeTab = 'permintaan'"
        :class="[
          'flex items-center px-2 sm:px-4 py-2 border-b-2 text-xs sm:text-sm font-medium w-1/2 sm:w-auto justify-center sm:justify-start',
          activeTab === 'permintaan'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <span>Permintaan</span>
        <span
          :class="[
            'ml-1 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 rounded-full',
            activeTab === 'permintaan'
              ? 'bg-primary text-white'
              : 'bg-gray-500 text-white',
          ]"
          >{{ requests.length }}</span
        >
      </button>
      <button
        @click="activeTab = 'dibimbing'"
        :class="[
          'flex items-center px-2 sm:px-4 py-2 border-b-2 text-xs sm:text-sm font-medium w-1/2 sm:w-auto justify-center sm:justify-start',
          activeTab === 'dibimbing'
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span>Dibimbing</span>
      </button>
    </div>

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
            <th scope="col" class="px-6 py-5 rounded-l-lg">NIM</th>
            <th scope="col" class="px-6 py-5">Nama</th>
            <th scope="col" class="px-6 py-5">Kategori</th>
            <th
              v-if="activeTab === 'permintaan'"
              scope="col"
              class="px-6 py-5 rounded-r-lg"
            >
              Tanggal
            </th>
            <th
              v-if="activeTab === 'dibimbing'"
              scope="col"
              class="px-6 py-5 rounded-r-lg"
            >
              Judul
            </th>
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
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap rounded-l-lg"
            >
              {{ item.nim }}
            </th>
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
            <td class="px-6 py-4">
              {{ item.category }}
            </td>
            <td
              v-if="activeTab === 'permintaan'"
              class="px-6 py-4 rounded-r-lg"
            >
              {{ item.date }}
            </td>
            <td v-if="activeTab === 'dibimbing'" class="px-6 py-4 rounded-r-lg">
              {{ item.title }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card view for mobile devices -->
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
    </div>

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
