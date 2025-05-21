<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { RouterLink, useRouter } from "vue-router";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalResponBimbingan from "@/components/Tugas-akhir/Modals/ModalResponBimbingan.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";

const activeTab = ref("permintaan");
const searchQuery = ref("");

const modalRef = ref(null);
const selectedItem = ref(null);
const modalTitle = ref("Respon Permintaan Bimbingan");
const modalContent = ref("");

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

const router = useRouter();

const handleRowClick = (item) => {
  if (activeTab.value === "dibimbing") {
    if (item.nim) {
      console.log("Navigating to detail for:", item);

      // Cek apakah rute tersedia
      console.log(
        "Available routes:",
        router.getRoutes().map((route) => route.name)
      );

      // Gunakan path untuk navigasi lebih aman
      router
        .push({
          path: "/dosen/tugas-akhir/bimbingan/detail-bimbingan",
          query: {
            nim: item.nim || "",
            name: item.name || "",
            category: item.category || "",
            title: item.title || "Judul Tidak Tersedia",
            _t: Date.now(),
          },
        })
        .catch((err) => {
          console.error("Navigation error:", err);
        });
    }
  } else if (activeTab.value === "permintaan") {
    // Show the modal for responding to the request
    selectedItem.value = item;
    modalContent.value = `Respon permintaan ${item.name} sebagai mahasiswa bimbingan anda.`;
    modalRef.value.open();
  }
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
            :items="[
              'Internet Of Things',
              'Machine Learning',
              'Data Science',
              'Web Development',
              'Cybersecurity',
              'Artificial Intelligence',
            ]"
            filterType="category"
            triggerText="Kategori"
            triggerVariant="outlined-black"
            hint="*Pilih kategori tugas akhir"
            @apply="(filter) => console.log('Filter applied:', filter)"
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
              ? ['NIM', 'Nama', 'Kategori', 'Tanggal']
              : ['NIM', 'Nama', 'Kategori', 'Judul']
          "
          :items="filteredItems"
          @rowClick="handleRowClick"
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
            <td
              v-if="activeTab === 'permintaan'"
              class="px-6 py-4 rounded-r-lg"
            >
              {{ item.date }}
            </td>
            <td v-if="activeTab === 'dibimbing'" class="px-6 py-4 rounded-r-lg">
              {{ item.title }}
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
