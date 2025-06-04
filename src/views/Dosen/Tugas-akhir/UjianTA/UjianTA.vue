<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import Table from "@/components/Tugas-akhir/Table.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import { useUjianTAForDosen } from "@/services/TugasAkhir/Dosen/ujianTA.js";
import { useSesiForDosen } from "@/services/TugasAkhir/Dosen/sesi.js";

// Use the composable to get all the state and functions
const {
  ujianTAData,
  pagination,
  loading: loadingUjian,
  error: errorUjian,
  currentPage,
  fetchUjianTA,
  changePage,
} = useUjianTAForDosen();

const {
  sessions,
  loading: loadingSessions,
  error: errorSessions,
  fetchSessions,
} = useSesiForDosen();

const searchQuery = ref("");
const selectedFilters = ref([]);

// Table headers for the Table component
const tableHeaders = [
  "NIM",
  "Nama",
  "Judul Tugas Akhir",
  "Tanggal",
  "Sesi",
  "Ruang",
  "Aksi",
];

// Computed property to get session filter options
const filterSessions = computed(() => {
  if (sessions.value && sessions.value.length > 0) {
    return sessions.value.map(
      (session) => `${session.waktu_mulai} - ${session.waktu_selesai}`
    );
  }
  return loadingSessions.value ? ["Memuat sesi..."] : [];
});

// Handler for filter application
const applyFilter = (filterData) => {
  selectedFilters.value = filterData.values;
  console.log("Filter diterapkan:", selectedFilters.value);
};

const filteredItems = computed(() => {
  if (!ujianTAData.value) return [];

  let filtered = ujianTAData.value;

  // Apply text search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.mahasiswa?.name?.toLowerCase().includes(query) ||
        item.mahasiswa?.nim?.toLowerCase().includes(query) ||
        item.judul_tugas_akhir?.toLowerCase().includes(query) ||
        item.tanggal_ujian?.toLowerCase().includes(query) ||
        `${item.sesi?.waktu_mulai} - ${item.sesi?.waktu_selesai}`
          .toLowerCase()
          .includes(query) ||
        item.ruang?.toLowerCase().includes(query)
      );
    });
  }

  // Apply session filter if any selected
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter((item) => {
      const sessionTime = `${item.sesi?.waktu_mulai} - ${item.sesi?.waktu_selesai}`;
      return selectedFilters.value.includes(sessionTime);
    });
  }

  return filtered;
});

// Handle page change from table component
const handlePageChange = (page) => {
  changePage(page);
};

// Fetch data when component is mounted
onMounted(() => {
  fetchSessions();
  fetchUjianTA();
});
</script>

<template>
  <div
    v-if="loadingUjian"
    class="flex items-center justify-center min-h-[80dvh]"
  >
    <Loading />
  </div>
  <div v-else-if="!$route.path.includes('detail-ujian-ta')">
    <Breadcrumb :items="breadcrumbItems" />

    <div class="bg-white rounded-lg shadow-md p-8">
      <!-- Search and Filter - Stack on mobile -->
      <div class="flex flex-row mb-2 gap-2">
        <!-- Filter by Session -->
        <div class="w-auto sm:w-auto sm:mr-2">
          <!-- Indikator loading untuk sesi -->
          <div v-if="loadingSessions" class="inline-flex items-center">
            <Loading />
          </div>

          <!-- Pesan error jika sesi gagal dimuat -->
          <div v-else-if="errorSessions" class="text-red-500 text-sm">
            Gagal memuat sesi: {{ errorSessions }}
          </div>

          <!-- Tampilkan filter ketika sesi dimuat -->
          <ModalFilter
            v-else
            title="Sesi"
            :items="filterSessions"
            :preselectedValues="selectedFilters"
            filterType="session"
            triggerText="Sesi"
            triggerVariant="outlined-black"
            hint="*Pilih sesi ujian"
            modalPosition="bottom"
            @apply="applyFilter"
          />
        </div>

        <!-- Search Bar -->
        <div class="flex-grow w-full">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search..."
            @search="(data) => (searchQuery = data.value)"
          />
        </div>
      </div>
      <!-- Status error -->
      <div
        v-if="errorUjian"
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
        <!-- Empty filtered results state -->
        <div
          v-if="filteredItems.length === 0"
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
          <p class="mt-2 text-gray-600">
            Tidak ada jadwal ujian yang sesuai dengan filter
          </p>
        </div>

        <!-- Table with built-in pagination -->
        <Table
          v-else
          :headers="tableHeaders"
          :items="filteredItems"
          :pagination="pagination"
          @pageChange="handlePageChange"
        >
          <template #row="{ item }">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.mahasiswa?.nim }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.mahasiswa?.name }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap truncate max-w-[200px] sm:max-w-[300px] md:max-w-[350px]"
            >
              {{ item.judul_tugas_akhir }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.tanggal_ujian }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.sesi?.waktu_mulai }} - {{ item.sesi?.waktu_selesai }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ item.ruang }}
            </td>
            <td class="px-6 py-4">
              <router-link
                :to="{
                  path: '/dosen/tugas-akhir/ujian-ta/detail-ujian-ta',
                  query: {
                    tugas_akhir_id: item.tugas_akhir_id || '',
                    nim: item.mahasiswa?.nim || '',
                    name: item.mahasiswa?.name || '',
                    title: item.judul_tugas_akhir || 'Judul Tidak Tersedia',
                    date: item.tanggal_ujian || '',
                    session:
                      `${item.sesi?.waktu_mulai} - ${item.sesi?.waktu_selesai}` ||
                      '',
                    room: item.ruang || '',
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
