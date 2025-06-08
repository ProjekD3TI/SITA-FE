<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import { RouterLink, useRouter } from "vue-router";
import TabDiv from "@/components/Tugas-akhir/TabDiv.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import ModalResponBimbingan from "@/components/Tugas-akhir/Modals/ModalResponBimbingan.vue";
import SearchBar from "@/components/Tugas-akhir/Forms/SearchBar.vue";
import ModalFilter from "@/components/Tugas-akhir/Modals/ModalFilter.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Loading from "@/components/Loading.vue";
import { useRequestPembimbing } from "@/services/TugasAkhir/Dosen/requestPembimbing";
import { useDibimbing } from "@/services/TugasAkhir/Dosen/bimbingan";
import { useKategori } from "@/services/TugasAkhir/Dosen/kategori";

const activeTab = ref("permintaan");
const searchQuery = ref("");
const router = useRouter();

// Inisialisasi layanan
const {
  requests: requestsData,
  loading: loadingRequests,
  error: errorRequests,
  fetchRequests,
  updateApproval,
} = useRequestPembimbing();
const { tugasAkhirList, loadingTugasAkhir, errorTugasAkhir, fetchTugasAkhir } =
  useDibimbing();
const {
  categories,
  loading: loadingCategories,
  error: errorCategories,
  fetchCategories,
} = useKategori();

// Menggunakan computed property untuk kategori filter
const filterCategories = computed(() => {
  if (categories.value && categories.value.length > 0) {
    return categories.value.map((category) => category.nama_kategori);
  }

  return loadingCategories.value ? ["Memuat kategori..."] : [];
});

const selectedFilters = ref([]);

// Menangani penerapan filter
const applyFilter = (filterData) => {
  selectedFilters.value = filterData.values;
  console.log("Filter diterapkan:", selectedFilters.value);
};

const modalRef = ref(null);
const selectedItem = ref(null);
const modalTitle = ref("Respon Permintaan Bimbingan");
const modalContent = ref("");

// Memetakan data API untuk tab permintaan
const requests = computed(() => {
  if (!requestsData.value) return [];

  console.log("Data permintaan mentah:", requestsData.value);

  return requestsData.value.map((req) => {
    return {
      id: req.request_pembimbing_id,
      nim: req.mahasiswa?.nim || "N/A",
      name: req.mahasiswa?.name || "Tidak diketahui",
      avatar: "/api/placeholder/40/40",
      category: req.kategori?.nama_kategori || "Tidak terkategorisasi",
      date: req.tanggal_request || new Date().toLocaleDateString("id-ID"),
      status_request: 0,
      tugas_akhir_id: req.tugas_akhir_id,
    };
  });
});

// Memetakan data API untuk tab dibimbing
const mentorships = computed(() => {
  if (!tugasAkhirList.value) return [];

  console.log("Data tugas akhir mentah:", tugasAkhirList.value);

  return tugasAkhirList.value.map((ta) => {
    return {
      id: ta.tugas_akhir_id,
      nim: ta.mahasiswa?.nim || "N/A",
      name: ta.mahasiswa?.name || "Tidak diketahui",
      avatar: "/api/placeholder/40/40",
      title: ta.judul_tugas_akhir || "Judul Tidak Tersedia",
      category: ta.kategori?.nama_kategori || "Tidak terkategorisasi",
    };
  });
});

// Status loading dan error untuk konten utama
const loading = computed(() =>
  activeTab.value === "permintaan"
    ? loadingRequests.value
    : loadingTugasAkhir.value
);

const error = computed(() =>
  activeTab.value === "permintaan" ? errorRequests.value : errorTugasAkhir.value
);

// Item berdasarkan tab aktif
const items = computed(() => {
  return activeTab.value === "permintaan" ? requests.value : mentorships.value;
});

// Item yang sudah difilter berdasarkan pencarian dan filter kategori
const filteredItems = computed(() => {
  let filtered = items.value;

  // Menerapkan filter pencarian teks
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.nim && item.nim.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.date && item.date.toLowerCase().includes(query))
      );
    });
  }

  // Menerapkan filter kategori jika ada yang dipilih
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedFilters.value.includes(item.category)
    );
  }

  return filtered;
});

// Fungsi untuk menampilkan modal respon
const showResponModal = (item) => {
  selectedItem.value = item;
  modalContent.value = `Respon permintaan ${item.name} sebagai mahasiswa bimbingan anda.`;
  modalRef.value.open();
};

// Menangani tindakan menerima dan menolak dari modal
const handleAcceptRequest = async () => {
  try {
    await updateApproval(selectedItem.value.id, 1);
    await fetchRequests();
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menerima permintaan:", err);
  }
};

const handleRejectRequest = async () => {
  try {
    await updateApproval(selectedItem.value.id, 2);
    await fetchRequests();
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menolak permintaan:", err);
  }
};

// Mengambil data ketika tab aktif berubah
watch(activeTab, (newTab) => {
  if (newTab === "permintaan") {
    fetchRequests();
  } else if (newTab === "dibimbing") {
    fetchTugasAkhir();
  }
});

// Mengambil data awal ketika komponen dimuat
onMounted(() => {
  fetchCategories();

  if (activeTab.value === "permintaan") {
    fetchRequests();
  } else {
    fetchTugasAkhir();
  }
});
</script>

<template>
  <div v-if="!$route.path.includes('detail-bimbingan')">
    <!-- Status loading -->
    <div
      v-if="loading"
      class="flex justify-center items-center min-h-[75vh] w-full"
    >
      <Loading />
    </div>

    <!-- Konten setelah loading -->
    <div v-else>
      <!-- Breadcrumb muncul setelah loading selesai -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Status error -->
      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg my-4">
        <p>{{ error }}</p>
        <Button
          @click="
            activeTab === 'permintaan' ? fetchRequests() : fetchTugasAkhir()
          "
          variant="outlined"
          size="sm"
          class="mt-2"
        >
          Coba Lagi
        </Button>
      </div>

      <TabDiv
        v-else
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
            count: mentorships.length,
          },
        ]"
        :default-tab="activeTab"
        @tab-changed="activeTab = $event"
      >
        <!-- Pencarian dan Filter -->
        <div class="flex flex-row mb-2 gap-2">
          <div class="w-auto sm:w-auto sm:mr-2">
            <!-- Indikator loading untuk kategori -->
            <div
              v-if="loadingCategories"
              class="flex justify-center items-center py-2 w-full"
            >
              <Loading />
            </div>

            <!-- Pesan error jika kategori gagal dimuat -->
            <div v-else-if="errorCategories" class="text-red-500 text-sm">
              Gagal memuat kategori: {{ errorCategories }}
            </div>

            <!-- Tampilkan filter ketika kategori dimuat -->
            <ModalFilter
              v-else
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
              placeholder="Cari..."
              :debounce="300"
              @search="(query) => console.log('Mencari:', query)"
            />
          </div>
        </div>

        <!-- Status kosong jika tidak ada item -->
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
            {{
              activeTab === "permintaan"
                ? "Tidak ada permintaan bimbingan"
                : "Tidak ada mahasiswa bimbingan"
            }}
          </p>
        </div>

        <!-- Implementasi tabel untuk semua ukuran layar -->
        <div v-else class="relative overflow-x-auto">
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
                {{ item.name }}
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
                <!-- Tombol untuk tab permintaan -->
                <Button
                  v-if="activeTab === 'permintaan'"
                  variant="secondary"
                  size="md"
                  @click="showResponModal(item)"
                >
                  Respon
                </Button>

                <!-- Tombol untuk tab dibimbing -->
                <router-link
                  v-if="activeTab === 'dibimbing'"
                  :to="{
                    path: '/dosen/tugas-akhir/bimbingan/detail-bimbingan',
                    query: {
                      id: item.id,
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
