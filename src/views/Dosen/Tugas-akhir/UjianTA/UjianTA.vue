<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Table from "@/components/Tugas-akhir/Table.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import { useUjianTAForDosen } from "@/services/TugasAkhir/Dosen/ujianTA.js";

// Use the composable to get all the state and functions
const {
  ujianTAData,
  pagination,
  loading: loadingUjian,
  error: errorUjian,
  currentPage,
  fetchUjianTA,
  changePage,
  search,
  filterBySesi,
  searchQuery,
  selectedSesi,

  // Session related properties
  sessions,
  loadingSessions,
  errorSessions,
  fetchSessions,
} = useUjianTAForDosen();
const router = useRouter();

// Table headers for the Table component
const tableHeaders = [
  "NIM",
  "Nama Lengkap",
  "Judul Tugas Akhir",
  "Tanggal",
  "Sesi",
  "Ruang",
  "Aksi",
];

// Track selected sessions in an array (following Bimbingan pattern)
const selectedSessions = ref([]);

// Computed property to get session filter options
const filterSessions = computed(() => {
  if (
    !sessions.value ||
    !Array.isArray(sessions.value) ||
    sessions.value.length === 0
  ) {
    return [];
  }

  return sessions.value
    .map((session) => {
      if (typeof session === "string") {
        // If sessions are just strings
        return {
          value: session,
          label: session,
        };
      } else if (session && session.nama_sesi) {
        // If sessions have a proper structure with nama_sesi
        return {
          value: session.nama_sesi,
          label: session.nama_sesi,
        };
      } else if (session && session.id) {
        // Fallback if sessions have different structure
        return {
          value: session.id,
          label: session.id.toString(),
        };
      } else {
        return null;
      }
    })
    .filter(Boolean); // Remove any null items
});

// Handler for filter application
const applyFilter = ({ values }) => {
  selectedSessions.value = values;
  const selectedSesiValue = values.length > 0 ? values[0] : "";
  filterBySesi(selectedSesiValue);
};

// Handle search input
const handleSearch = (data) => {
  search(data.value);
};

// Handle page change from table component
const handlePageChange = (page) => {
  changePage(page);
};

// Fetch data when component is mounted
onMounted(() => {
  fetchSessions();
  fetchUjianTA();
});

// Add a function to handle row click navigation
const navigateToDetail = (item) => {
  router.push({
    name: "DetailUjianTAforDosen",
    params: { tugas_akhir_id: item.tugas_akhir_id },
  });
};
</script>

<template>
  <div v-if="!$route.path.includes('detail-ujian-ta')">
    <Breadcrumb />

    <div class="bg-white rounded-lg shadow-md p-8">
      <!-- Search and Filter - Stack on mobile -->
      <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
        <!-- Filter by Session -->
        <div class="w-auto">
          <!-- Pesan error jika sesi gagal dimuat -->
          <div v-if="errorSessions" class="text-red-500 text-sm">
            Gagal memuat sesi: {{ errorSessions }}
          </div>

          <!-- Tampilkan filter ketika sesi dimuat -->
          <ModalFilter
            v-else
            title="Sesi"
            :items="filterSessions"
            filterType="Sesi"
            @apply="applyFilter"
            triggerText="Sesi"
            :preselectedValues="selectedSessions"
          />
        </div>

        <!-- Search Bar -->
        <div class="flex-grow">
          <SearchBar
            v-model="searchQuery"
            placeholder="Cari..."
            :debounce="300"
            @search="handleSearch"
          />
        </div>
      </div>
      <!-- Status error -->
      <div v-if="loadingUjian" class="py-8">
        <Loading />
      </div>
      <div
        v-else-if="errorUjian"
        class="p-4 bg-red-100 text-red-700 rounded-lg my-4"
      >
        <p>{{ errorUjian }}</p>
        <Button
          @click="fetchUjianTA()"
          variant="outlined"
          size="sm"
          class="mt-2"
        >
          Coba Lagi
        </Button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!loadingUjian && ujianTAData.length === 0"
        class="text-center py-8 bg-gray-50 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="mt-2 text-gray-600">Tidak ada ujian tugas akhir</p>
      </div>

      <!-- When we have data to display -->
      <div v-else class="relative overflow-x-auto">
        <!-- Table with built-in pagination -->
        <Table
          :headers="tableHeaders"
          :items="ujianTAData"
          :pagination="pagination"
          @pageChange="handlePageChange"
        >
          <template #row="{ item }">
            <td class="px-6 py-4 whitespace-nowrap rounded-l-lg">
              {{ item.mahasiswa?.nim }}
            </td>
            <td class="px-6 py-4">
              {{ item.mahasiswa?.name }}
            </td>
            <td class="px-6 py-4">
              {{ item.judul_tugas_akhir }}
            </td>
            <td class="px-6 py-4">
              {{ item.tanggal_ujian }}
            </td>
            <td class="px-6 py-4">
              {{ `${item.sesi?.waktu_mulai} - ${item.sesi?.waktu_selesai}` }}
            </td>
            <td class="px-6 py-4">
              {{ item.ruang }}
            </td>
            <td class="px-6 py-4">
              <Button
                variant="primary"
                size="md"
                @click.stop="navigateToDetail(item)"
              >
                Detail
              </Button>
            </td>
          </template>
        </Table>
      </div>
    </div>
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
