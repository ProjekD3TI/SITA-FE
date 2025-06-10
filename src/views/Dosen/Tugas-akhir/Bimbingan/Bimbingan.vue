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
import ErrorMsg from "@/components/ErrorMsg.vue";
import {
  useRequestPembimbing,
  useDibimbing,
  useKategori,
} from "@/services/TugasAkhir/Dosen/bimbingan";

const activeTab = ref("permintaan");
const currentPage = ref(1);
const currentPagePermintaan = ref(1);
const searchQueryPermintaan = ref("");
const searchQueryBimbingan = ref("");
const router = useRouter();

// Inisialisasi layanan
const {
  requests: requestsData,
  loading: loadingRequests,
  error: errorRequests,
  fetchRequests,
  updateApproval,
  pagination: paginationRequests,
  changePage: changePageRequests,
  search: searchRequests,
  filterByKategori: filterByKategoriRequests,
} = useRequestPembimbing();

const {
  tugasAkhirList,
  loadingTugasAkhir,
  errorTugasAkhir,
  fetchTugasAkhir,
  pagination: paginationTugasAkhir,
  changePage: changePageTugasAkhir,
  search: searchTugasAkhir,
  filterByKategori: filterByKategoriTugasAkhir,
} = useDibimbing();

const {
  categories,
  loading: loadingCategories,
  error: errorCategories,
  fetchCategories,
} = useKategori();

// Mengubah format kategori untuk filter
const categoryOptions = computed(() => {
  if (!categories.value) return [];

  return categories.value.map((category) => ({
    value: category.id,
    label: category.nama_kategori,
  }));
});

const selectedCategoriesPermintaan = ref([]);
const selectedCategoriesBimbingan = ref([]);

// Menangani penerapan filter untuk tab Permintaan
const applyFilterPermintaan = ({ values }) => {
  selectedCategoriesPermintaan.value = values;
  currentPagePermintaan.value = 1;
  const kategoriStr = getSelectedKategoriLabel(
    selectedCategoriesPermintaan.value
  );
  filterByKategoriRequests(kategoriStr);
};

// Menangani penerapan filter untuk tab Dibimbing
const applyFilterBimbingan = ({ values }) => {
  selectedCategoriesBimbingan.value = values;
  currentPage.value = 1;
  const kategoriStr = getSelectedKategoriLabel(
    selectedCategoriesBimbingan.value
  );
  filterByKategoriTugasAkhir(kategoriStr);
};

function getSelectedKategoriLabel(selectedCategories) {
  if (selectedCategories.length > 0) {
    // Ambil semua label kategori yang dipilih
    const selectedLabels = selectedCategories
      .map((catId) => {
        const cat = categoryOptions.value.find((c) => c.value === catId);
        return cat ? cat.label : "";
      })
      .filter(Boolean);
    return selectedLabels.join(",");
  }
  return "";
}

// Handle search functions
function onSearchPermintaan({ value }) {
  currentPagePermintaan.value = 1;
  searchRequests(value);
}

function onSearchBimbingan({ value }) {
  currentPage.value = 1;
  searchTugasAkhir(value);
}

const modalRef = ref(null);
const selectedItem = ref(null);
const modalTitle = ref("Respon Permintaan Bimbingan");
const modalContent = ref("");

// Memetakan data API untuk tab permintaan
const requests = computed(() => {
  if (!requestsData.value) return [];

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

  return tugasAkhirList.value.map((ta) => {
    return {
      id: ta.tugas_akhir_id,
      nim: ta.mahasiswa?.nim || "N/A",
      name: ta.mahasiswa?.name || "Tidak diketahui",
      avatar: "/api/placeholder/40/40",
      title: ta.judul_tugas_akhir || "Judul Tidak Tersedia",
      category: ta.kategori?.nama_kategori || "Tidak terkategorisasi",
      jumlah_bimbingan: ta.jumlah_bimbingan || 0,
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

const pagination = computed(() => {
  return activeTab.value === "permintaan"
    ? paginationRequests.value
    : paginationTugasAkhir.value;
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
    await fetchRequests(
      currentPagePermintaan.value,
      searchQueryPermintaan.value,
      getSelectedKategoriLabel(selectedCategoriesPermintaan.value)
    );
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menerima permintaan:", err);
  }
};

const handleRejectRequest = async () => {
  try {
    await updateApproval(selectedItem.value.id, 2);
    await fetchRequests(
      currentPagePermintaan.value,
      searchQueryPermintaan.value,
      getSelectedKategoriLabel(selectedCategoriesPermintaan.value)
    );
    modalRef.value.close();
  } catch (err) {
    console.error("Error saat menolak permintaan:", err);
  }
};

// Handle page change
const handlePageChange = (page) => {
  if (activeTab.value === "permintaan") {
    currentPagePermintaan.value = page;
    changePageRequests(page);
  } else {
    currentPage.value = page;
    changePageTugasAkhir(page);
  }
};

// Computed for tab definitions
const tabs = computed(() => [
  {
    id: "permintaan",
    label: "Permintaan",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    count: requests.value.length,
  },
  {
    id: "dibimbing",
    label: "Dibimbing",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    count: mentorships.value.length,
  },
]);

// Mengambil data ketika tab aktif berubah
watch(activeTab, (newTab) => {
  if (newTab === "permintaan") {
    fetchRequests(
      currentPagePermintaan.value,
      searchQueryPermintaan.value,
      selectedCategoriesPermintaan.value.join(",")
    );
  } else if (newTab === "dibimbing") {
    fetchTugasAkhir(
      currentPage.value,
      searchQueryBimbingan.value,
      selectedCategoriesBimbingan.value.join(",")
    );
  }
});

// Mengambil data awal ketika komponen dimuat
onMounted(() => {
  fetchCategories();

  if (activeTab.value === "permintaan") {
    fetchRequests(currentPagePermintaan.value);
  } else {
    fetchTugasAkhir(currentPage.value);
  }
});
</script>

<template>
  <div v-if="!$route.path.includes('detail-bimbingan')">
    <div>
      <!-- Breadcrumb muncul setelah loading selesai -->
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Status error -->
      <div v-if="error" class="p-4 my-4 text-red-700 bg-red-100 rounded-lg">
        <p>{{ error }}</p>
        <Button
          @click="
            activeTab === 'permintaan'
              ? fetchRequests(
                  currentPagePermintaan,
                  searchQueryPermintaan,
                  selectedCategoriesPermintaan.join(',')
                )
              : fetchTugasAkhir(
                  currentPage,
                  searchQueryBimbingan,
                  selectedCategoriesBimbingan.join(',')
                )
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
        :tabs="tabs"
        :default-tab="activeTab"
        :use-named-slots="true"
        @tab-changed="activeTab = $event"
      >
        <!-- Tab Permintaan Bimbingan -->
        <template #permintaan>
          <!-- Pencarian dan Filter untuk Tab Permintaan -->
          <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
            <ModalFilter
              title="Kategori"
              :items="categoryOptions"
              filterType="Kategori"
              @apply="applyFilterPermintaan"
              triggerText="Kategori"
              :preselectedValues="selectedCategoriesPermintaan"
            />

            <div v-if="errorCategories" class="text-sm text-red-500">
              Gagal memuat kategori: {{ errorCategories }}
            </div>

            <SearchBar
              v-model="searchQueryPermintaan"
              placeholder="Cari..."
              :debounce="300"
              @search="onSearchPermintaan"
              filterKey="permintaan"
            />
          </div>

          <!-- Status loading untuk Tab Permintaan -->
          <div v-if="loadingRequests" class="py-8">
            <Loading />
          </div>

          <!-- Status kosong jika tidak ada permintaan -->
          <div
            v-else-if="requests.length === 0"
            class="py-8 text-center rounded-lg bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mx-auto text-gray-400"
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
            <p class="mt-2 text-gray-600">Tidak ada permintaan bimbingan</p>
          </div>

          <!-- Tabel Permintaan Bimbingan -->
          <div v-else class="relative overflow-x-auto">
            <Table
              :headers="['NIM', 'Nama', 'Kategori', 'Tanggal', 'Aksi']"
              :items="requests"
              :pagination="paginationRequests"
              @pageChange="
                (page) => {
                  currentPagePermintaan = page;
                  changePageRequests(page);
                }
              "
            >
              <template #row="{ item }">
                <td
                  class="px-6 py-4 font-medium text-gray-900 rounded-l-lg whitespace-nowrap"
                >
                  {{ item.nim }}
                </td>
                <td class="px-6 py-4">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4">
                  {{ item.category }}
                </td>
                <td class="px-6 py-4">
                  {{ item.date }}
                </td>
                <!-- Kolom Aksi -->
                <td class="px-6 py-4 rounded-r-lg">
                  <Button
                    variant="secondary"
                    size="md"
                    @click="showResponModal(item)"
                  >
                    Respon
                  </Button>
                </td>
              </template>
            </Table>
          </div>
        </template>

        <!-- Tab Mahasiswa yang Dibimbing -->
        <template #dibimbing>
          <!-- Pencarian dan Filter untuk Tab Dibimbing -->
          <div class="flex items-center justify-between gap-2 mb-4 lg:gap-4">
            <ModalFilter
              title="Kategori"
              :items="categoryOptions"
              filterType="Kategori"
              @apply="applyFilterBimbingan"
              triggerText="Kategori"
              :preselectedValues="selectedCategoriesBimbingan"
            />

            <div v-if="errorCategories" class="text-sm text-red-500">
              Gagal memuat kategori: {{ errorCategories }}
            </div>

            <SearchBar
              v-model="searchQueryBimbingan"
              placeholder="Cari..."
              :debounce="300"
              @search="onSearchBimbingan"
              filterKey="bimbingan"
            />
          </div>

          <!-- Status loading untuk Tab Dibimbing -->
          <div v-if="loadingTugasAkhir" class="py-8">
            <Loading />
          </div>

          <!-- Status kosong jika tidak ada yang dibimbing -->
          <div
            v-else-if="mentorships.length === 0"
            class="py-8 text-center rounded-lg bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mx-auto text-gray-400"
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
            <p class="mt-2 text-gray-600">Tidak ada mahasiswa bimbingan</p>
          </div>

          <!-- Tabel Mahasiswa yang Dibimbing -->
          <div v-else class="relative overflow-x-auto">
            <Table
              :headers="[
                'NIM',
                'Nama',
                'Kategori',
                'Judul',
                'Pertemuan',
                'Aksi',
              ]"
              :items="mentorships"
              :pagination="paginationTugasAkhir"
              @pageChange="
                (page) => {
                  currentPage = page;
                  changePageTugasAkhir(page);
                }
              "
            >
              <template #row="{ item }">
                <td
                  class="px-6 py-4 font-medium text-gray-900 rounded-l-lg whitespace-nowrap"
                >
                  {{ item.nim }}
                </td>
                <td class="px-6 py-4">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4">
                  {{ item.category }}
                </td>
                <td class="px-6 py-4">
                  {{ item.title }}
                </td>
                <td
                  class="px-6 py-4"
                  :class="
                    item.jumlah_bimbingan == null ||
                    item.jumlah_bimbingan === undefined ||
                    item.jumlah_bimbingan === 0
                      ? 'text-secondary'
                      : 'text-blackText'
                  "
                >
                  {{
                    item.jumlah_bimbingan == null ||
                    item.jumlah_bimbingan === undefined ||
                    item.jumlah_bimbingan === 0
                      ? "Belum ada pertemuan"
                      : item.jumlah_bimbingan + "/9"
                  }}
                </td>
                <!-- Kolom Aksi -->
                <td class="px-6 py-4 rounded-r-lg">
                  <router-link
                    :to="{
                      name: 'DetailBimbinganforDosen',
                      params: { tugas_akhir_id: item.id },
                    }"
                  >
                    <Button variant="primary" size="md"> Detail </Button>
                  </router-link>
                </td>
              </template>
            </Table>
          </div>
        </template>
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
