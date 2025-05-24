<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { RouterLink, useRouter } from "vue-router";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalResponBimbingan from "@/components/Tugas-akhir/Modals/ModalResponBimbingan.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import Button from "@/components/Tugas-akhir/Button.vue";

const activeTab = ref("permintaan");
const searchQuery = ref("");

// Update filter categories to only 10 items
const filterCategories = ref([
  "Internet of Things",
  "Mobile Development",
  "Cyber Security",
  "Big Data",
  "Artificial Intelligence",
  "Web Development",
  "Multimedia",
  "Blockchain",
  "Geographic Information System",
  "Network Security",
]);
const selectedFilters = ref([]);

// Handle filter application
const applyFilter = (filterData) => {
  selectedFilters.value = filterData.values;
  console.log("Filters applied:", selectedFilters.value);
};

const modalRef = ref(null);
const selectedItem = ref(null);
const modalTitle = ref("Respon Permintaan Bimbingan");
const modalContent = ref("");

const requests = ref([
  {
    nim: "V3420101",
    name: "Christine Brooks",
    avatar: "/api/placeholder/40/40",
    category: "Internet of Things",
    date: "04 Sep 2023",
  },
  {
    nim: "V3420102",
    name: "David Johnson",
    avatar: "/api/placeholder/40/40",
    category: "Artificial Intelligence",
    date: "15 Oct 2023",
  },
  {
    nim: "V3420103",
    name: "Emily Wilson",
    avatar: "/api/placeholder/40/40",
    category: "Big Data",
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
    category: "Cyber Security",
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
    category: "Network Security",
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
    category: "Big Data",
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
    category: "Blockchain",
    date: "27 Apr 2024",
  },
  {
    nim: "V3420113",
    name: "Olivia White",
    avatar: "/api/placeholder/40/40",
    category: "Geographic Information System",
    date: "15 May 2024",
  },
  {
    nim: "V3420114",
    name: "Daniel Lewis",
    avatar: "/api/placeholder/40/40",
    category: "Multimedia",
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
    category: "Web Development",
    date: "05 Jul 2024",
  },
  {
    nim: "V3420117",
    name: "Sophia Martin",
    avatar: "/api/placeholder/40/40",
    category: "Artificial Intelligence",
    date: "22 Jul 2024",
  },
  {
    nim: "V3420118",
    name: "Lucas Moore",
    avatar: "/api/placeholder/40/40",
    category: "Internet of Things",
    date: "10 Aug 2024",
  },
  {
    nim: "V3420119",
    name: "Victoria Jackson",
    avatar: "/api/placeholder/40/40",
    category: "Multimedia",
    date: "28 Aug 2024",
  },
  {
    nim: "V3420120",
    name: "Ryan Adams",
    avatar: "/api/placeholder/40/40",
    category: "Mobile Development",
    date: "15 Sep 2024",
  },
]);

const mentorships = ref([
  {
    nim: "V3420001",
    name: "Andrew Parker",
    avatar: "/api/placeholder/40/40",
    title: "Implementasi IoT untuk Smart Home",
    category: "Internet of Things",
  },
  {
    nim: "V3420002",
    name: "Michelle Williams",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Prediksi menggunakan AI",
    category: "Artificial Intelligence",
  },
  {
    nim: "V3420003",
    name: "Christopher Allen",
    avatar: "/api/placeholder/40/40",
    title: "Analisis Sentimen pada Data Media Sosial",
    category: "Big Data",
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
    category: "Cyber Security",
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
    title: "Arsitektur Jaringan Aman",
    category: "Network Security",
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
    category: "Big Data",
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
    title: "Sistem Transaksi Berbasis Blockchain",
    category: "Blockchain",
  },
  {
    nim: "V3420013",
    name: "Peter Henderson",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Informasi Geografis untuk Pemetaan Bencana",
    category: "Geographic Information System",
  },
  {
    nim: "V3420014",
    name: "Nancy Ross",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Pengenalan Objek pada Video Streaming",
    category: "Multimedia",
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
    title: "Aplikasi Web Interaktif untuk E-Learning",
    category: "Web Development",
  },
  {
    nim: "V3420017",
    name: "Timothy Butler",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Terjemahan Bahasa Otomatis",
    category: "Artificial Intelligence",
  },
  {
    nim: "V3420018",
    name: "Rachel Morgan",
    avatar: "/api/placeholder/40/40",
    title: "Sistem Kendali Smart Factory",
    category: "Internet of Things",
  },
  {
    nim: "V3420019",
    name: "Kyle Russell",
    avatar: "/api/placeholder/40/40",
    title: "Pengembangan Game Edukasi Interaktif",
    category: "Multimedia",
  },
  {
    nim: "V3420020",
    name: "Elizabeth Price",
    avatar: "/api/placeholder/40/40",
    title: "Aplikasi Mobile Edukasi Anak",
    category: "Mobile Development",
  },
]);

const items = computed(() => {
  return activeTab.value === "permintaan" ? requests.value : mentorships.value;
});

const filteredItems = computed(() => {
  let filtered = items.value;

  // Apply text search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.nim.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.date && item.date.toLowerCase().includes(query))
      );
    });
  }

  // Apply category filter if any selected
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedFilters.value.includes(item.category)
    );
  }

  return filtered;
});

const router = useRouter();

// New function to show response modal
const showResponModal = (item) => {
  selectedItem.value = item;
  modalContent.value = `Respon permintaan ${item.name} sebagai mahasiswa bimbingan anda.`;
  modalRef.value.open();
};

// Handle accept and reject actions from modal
const handleAcceptRequest = () => {
  console.log("Request accepted for:", selectedItem.value);
  // Here you would implement the API call to accept the request
  // After successful response, you might want to refresh the data
  // or move the item from requests to mentorships
};

const handleRejectRequest = () => {
  console.log("Request rejected for:", selectedItem.value);
  // Here you would implement the API call to reject the request
  // After successful response, you might want to remove the item from the list
};
</script>

<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div v-if="!$route.path.includes('detail-bimbingan')">
    <!-- Tab Navigation -->
    <TabDiv
      :tabs="[
        {
          id: 'permintaan',
          label: 'Permintaan',
          icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
          count: requests.length,
        },
        {
          id: 'dibimbing',
          label: 'Dibimbing',
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        },
      ]"
      :default-tab="activeTab"
      @tab-changed="activeTab = $event"
    >
      <!-- Search and Filter - Stack on mobile -->
      <div class="flex flex-row mb-2 gap-2">
        <div class="w-auto sm:w-auto sm:mr-2">
          <ModalFilter
            title="Kategori"
            :items="filterCategories"
            :preselectedValues="selectedFilters"
            filterType="category"
            triggerText="Kategori"
            triggerVariant="outlined-black"
            hint="*Pilih kategori tugas akhir"
            modalPosition="bottom"
            @apply="applyFilter"
          />
        </div>
        <div class="flex-grow w-full">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search..."
            :debounce="300"
            @search="(query) => console.log('Searching for:', query)"
          />
        </div>
      </div>

      <!-- Table implementation for all screen sizes -->
      <div class="relative overflow-x-auto">
        <Table
          :headers="
            activeTab === 'permintaan'
              ? ['NIM', 'Nama', 'Kategori', 'Tanggal', 'Aksi']
              : ['NIM', 'Nama', 'Kategori', 'Judul', 'Aksi']
          "
          :items="filteredItems"
        >
          <template #row="{ item }">
            <td
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap rounded-l-lg"
            >
              {{ item.nim }}
            </td>
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
            <td v-if="activeTab === 'permintaan'" class="px-6 py-4">
              {{ item.date }}
            </td>
            <td v-if="activeTab === 'dibimbing'" class="px-6 py-4">
              {{ item.title }}
            </td>
            <!-- Kolom Aksi -->
            <td class="px-6 py-4 rounded-r-lg">
              <!-- Button for permintaan tab -->
              <Button
                v-if="activeTab === 'permintaan'"
                variant="secondary"
                size="md"
                @click="showResponModal(item)"
              >
                Respon
              </Button>

              <!-- Button for dibimbing tab -->
              <router-link
                v-if="activeTab === 'dibimbing'"
                :to="{
                  path: '/dosen/tugas-akhir/bimbingan/detail-bimbingan',
                  query: {
                    nim: item.nim || '',
                    name: item.name || '',
                    category: item.category || '',
                    title: item.title || 'Judul Tidak Tersedia',
                    _t: Date.now(),
                  },
                }"
              >
                <Button variant="primary" size="md"> Detail </Button>
              </router-link>
            </td>
          </template>
        </Table>
      </div>
    </TabDiv>
  </div>
  <router-view v-else></router-view>

  <!-- Modal Respon Bimbingan -->
  <ModalResponBimbingan
    ref="modalRef"
    :title="modalTitle"
    :content="modalContent"
    @accept="handleAcceptRequest"
    @reject="handleRejectRequest"
  />
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
