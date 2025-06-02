<template>
  <div class="p-6 max-w-5xl mx-auto overflow-hidden">
    <h2 class="text-2xl font-bold mb-6">Daftar Inventaris</h2>

    <div class="grid grid-cols-1 gap-4 mb-4">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Cari Inventaris..."
            class="pl-10 pr-3 py-2 border rounded-md w-full"
            @input="onSearch"
          />
        </div>

        <div class="relative">
          <button
            @click="toggleFilterDropdown"
            class="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 transition flex items-center gap-2 relative"
            :class="{ 'bg-blue-50 border-blue-300': hasActiveFilters }"
          >
            <i class="fa fa-filter" aria-hidden="true"></i>
            Filter
            <span
              v-if="hasActiveFilters"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ activeFilterCount }}
            </span>
          </button>

          <div
            v-if="showFilterDropdown"
            class="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50"
          >
            <div class="p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-900">Filter Data</h3>
                <button
                  @click="clearAllFilters"
                  class="text-sm text-red-600 hover:text-red-800"
                  v-if="hasActiveFilters"
                >
                  Clear All
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-tools text-gray-400 mr-2"></i>
                    Kondisi
                  </label>
                  <select
                    v-model="filters.kondisi"
                    @change="onFilterChange"
                    class="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Semua Kondisi</option>
                    <option value="baik">Baik</option>
                    <option value="rusak">Rusak</option>
                    <option value="hilang">Hilang</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-check-circle text-gray-400 mr-2"></i>
                    Status
                  </label>
                  <select
                    v-model="filters.status"
                    @change="onFilterChange"
                    class="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Semua Status</option>
                    <option value="1">Bisa Digunakan</option>
                    <option value="0">Dipinjam</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-calendar-alt text-gray-400 mr-2"></i>
                    Tahun Pengadaan
                  </label>
                  <input
                    v-model="filters.year"
                    type="number"
                    placeholder="Contoh: 2024"
                    min="2000"
                    :max="currentYear"
                    class="w-full px-3 py-2 border rounded-md"
                    @input="onYearChange"
                  />
                </div>
              </div>

              <div class="mt-4 pt-4 border-t flex justify-end">
                <button
                  @click="closeFilterDropdown"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-between gap-2">
        <button
          @click="exportInventaris()"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
        >
          <i class="fas fa-file-excel"></i>
          Export Excel
        </button>
        <button
          @click="goToCreate()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          Tambah Inventaris
        </button>
      </div>
    </div>

    <div class="relative overflow-x-auto">
      <Vue3EasyDataTable
        ref="dataTable"
        :headers="headers"
        :items="inventarisList"
        :loading="loading"
        :server-options="serverOptions"
        :server-items-length="pagination.total"
        @update:server-options="onServerOptionsUpdate"
        :rows-per-page="serverOptions.rowsPerPage"
        :rows-items="[10, 25, 50]"
        :pagination="false"
        hide-footer
        class="bg-white shadow-md rounded-lg"
        empty-message="Tidak ada data Inventaris"
        border-cell
        server-side-sort
        :key="tableKey"
      >
        <template #item-kondisi="item">
          <span
            :class="{
              'px-2 py-1 rounded text-xs font-medium flex items-center gap-1': true,
              'bg-green-100 text-green-800': item.kondisi === 'baik',
              'bg-yellow-100 text-red-800': item.kondisi === 'rusak',
              'bg-red-200 text-red-800': item.kondisi === 'hilang',
            }"
          >
            <i
              :class="{
                'fas fa-check-circle': item.kondisi === 'baik',
                'fas fa-exclamation-triangle': item.kondisi === 'rusak',
                'fas fa-times-circle': item.kondisi === 'hilang',
              }"
            ></i>
            {{ formatKondisi(item.kondisi) }}
          </span>
        </template>

        <template #item-status="item">
          <span
            :class="{
              'px-2 py-1 rounded text-xs font-medium flex items-center gap-1': true,
              'bg-blue-100 text-blue-800': item.status === 1,
              'bg-yellow-100 text-yellow-800': item.status === 0,
            }"
          >
            <i
              :class="{
                'fas fa-check': item.status === 1,
                'fas fa-hand-paper': item.status === 0,
              }"
            ></i>
            {{ formatStatus(item.status) }}
          </span>
        </template>

        <template #item-actions="item">
          <div class="flex space-x-1">
            <button
              @click.stop="goToDetail(item.id_inventaris)"
              class="text-blue-500 hover:text-blue-700 p-1"
              title="Detail"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click.stop="goToEdit(item.id_inventaris)"
              class="text-blue-500 hover:text-blue-700 p-1"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click.stop="handleDelete(item)"
              class="text-red-500 hover:text-red-700 p-1"
              title="Hapus"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>

    <div
      class="flex flex-col md:flex-row justify-between items-center mt-4 p-4 bg-gray-50 rounded-md gap-4"
    >
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Rows per page:</span>
        <select
          v-model="serverOptions.rowsPerPage"
          @change="onRowsPerPageChange"
          class="px-2 py-1 border rounded-md text-sm"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

      <div class="text-sm text-gray-600 text-center">
        {{
          pagination.total > 0
            ? (pagination.current_page - 1) * pagination.per_page + 1
            : 0
        }}-{{
          Math.min(
            pagination.current_page * pagination.per_page,
            pagination.total
          )
        }}
        of {{ pagination.total }}
      </div>

      <div
        class="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end"
      >
        <button
          @click="goToPreviousPage"
          :disabled="pagination.current_page <= 1"
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]"
        >
          Previous
        </button>
        <div class="px-3 py-1 bg-white border rounded">
          Page {{ pagination.current_page }} of
          {{ pagination.last_page || 1 }}
        </div>
        <button
          @click="goToNextPage"
          :disabled="pagination.current_page >= pagination.last_page"
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]"
        >
          Next
        </button>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Konfirmasi Hapus</h3>
        <p class="mb-6">
          Apakah Anda yakin ingin menghapus Inventaris "{{
            selectedItem?.no_inventaris
          }}"? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="deleteInventaris"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? "Menghapus..." : "Hapus" }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showFilterDropdown"
      @click="closeFilterDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const router = useRouter();
const toast = useToast();
const dataTable = ref(null);
const inventarisList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const debounceTimeout = ref(null);
const yearDebounceTimeout = ref(null);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const tableKey = ref(0);
const showFilterDropdown = ref(false);

const headers = [
  { text: "No", value: "no", sortable: true },
  { text: "No Inventaris", value: "no_inventaris", sortable: true },
  { text: "Nama Inventaris", value: "nama_inventaris", sortable: true },
  { text: "Ruang", value: "nama_ruang", sortable: true },
  { text: "Kondisi", value: "kondisi", sortable: true },
  { text: "Tahun Pengadaan", value: "tahun_pengadaan", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Aksi", value: "actions", sortable: false },
];

const filters = reactive({
  kondisi: "",
  status: "",
  year: "",
});

const serverOptions = reactive({
  page: 1,
  rowsPerPage: 10,
  sortBy: null,
  sortType: null,
});

const pagination = reactive({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
});

const currentYear = computed(() => new Date().getFullYear());

const hasActiveFilters = computed(() => {
  return filters.kondisi || filters.status || filters.year;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.kondisi) count++;
  if (filters.status) count++;
  if (filters.year) count++;
  return count;
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const closeFilterDropdown = () => {
  showFilterDropdown.value = false;
};

const clearAllFilters = () => {
  filters.kondisi = "";
  filters.status = "";
  filters.year = "";
  serverOptions.page = 1;
  fetchInventarisList();
};

const fetchInventarisList = async () => {
  try {
    loading.value = true;
    setupAxios();

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
      ...(searchTerm.value && { search: searchTerm.value }),
      ...(filters.kondisi && { kondisi: filters.kondisi }),
      ...(filters.status && { status: filters.status }),
      ...(filters.year && { year: filters.year }),
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get("/api/admin_pengelola/inventaris", {
      params,
    });

    if (response.data && response.data.data) {
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      inventarisList.value = dataArray.map((item, index) => ({
        ...item,
        no: (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1,
      }));

      Object.assign(pagination, {
        current_page: response.data.pagination?.current_page || 1,
        per_page: response.data.pagination?.per_page || 10,
        total: response.data.pagination?.total || 0,
        last_page: response.data.pagination?.last_page || 1,
      });
    } else {
      inventarisList.value = [];
      toast.error("Format data tidak valid");
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Inventaris");
    inventarisList.value = [];
  } finally {
    loading.value = false;
  }
};

const goToCreate = () => router.push("/admin-pengelola/inventaris/create");
const goToEdit = (id) => router.push(`/admin-pengelola/inventaris/edit/${id}`);
const goToDetail = (id) =>
  router.push(`/admin-pengelola/inventaris/detail/${id}`);

const onSearch = () => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchInventarisList();
  }, 300);
};

const onYearChange = () => {
  if (yearDebounceTimeout.value) clearTimeout(yearDebounceTimeout.value);
  yearDebounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchInventarisList();
  }, 500);
};

const onServerOptionsUpdate = async (options) => {
  if (options.page !== undefined) {
    serverOptions.page = options.page;
  }
  if (options.rowsPerPage !== undefined) {
    serverOptions.rowsPerPage = options.rowsPerPage;
  }

  if (options.sortBy !== undefined && options.sortType !== undefined) {
    const newSortBy = options.sortBy;
    const newSortType = options.sortType;

    if (serverOptions.sortBy === newSortBy) {
      if (serverOptions.sortType === "asc") {
        serverOptions.sortType = "desc";
      } else if (serverOptions.sortType === "desc") {
        serverOptions.sortBy = null;
        serverOptions.sortType = null;
      } else {
        serverOptions.sortType = "asc";
      }
    } else {
      serverOptions.sortBy = newSortBy;
      serverOptions.sortType = "asc";
    }
  }

  tableKey.value++;

  await nextTick();
  await fetchInventarisList();
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchInventarisList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchInventarisList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchInventarisList();
  }
};

const onFilterChange = () => {
  serverOptions.page = 1;
  fetchInventarisList();
};

const formatKondisi = (value) => {
  const formats = {
    baik: "Baik",
    rusak: "Rusak",
    hilang: "Hilang",
  };
  return formats[value] || value;
};

const formatStatus = (value) => {
  return value === 1 ? "Bisa Digunakan" : "Dipinjam";
};

const handleApiError = (error, message) => {
  if (error.response?.status === 401) {
    toast.error("Sesi anda telah berakhir. Silakan login kembali.");
    router.push("/login-admin");
  } else {
    toast.error(error.response?.data?.message || message);
  }
};

const exportInventaris = async () => {
  try {
    setupAxios();
    const params = {
      search: searchTerm.value,
      status: filters.status,
      kondisi: filters.kondisi,
      year: filters.year,
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get("/api/admin_pengelola/inventaris/export", {
      responseType: "blob",
      params,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.href = url;
    link.setAttribute("download", `inventaris_${today}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export berhasil");
  } catch (error) {
    handleApiError(error, "Gagal mengexport data Inventaris");
  }
};

const handleDelete = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const deleteInventaris = async () => {
  if (!selectedItem.value) return;

  try {
    isDeleting.value = true;
    setupAxios();
    const response = await axios.delete(
      `/api/admin_pengelola/inventaris/${selectedItem.value.id_inventaris}`
    );
    toast.success(response.data.message || "Inventaris berhasil dihapus");
    fetchInventarisList();
  } catch (error) {
    handleApiError(error, "Gagal menghapus Inventaris");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

onMounted(() => {
  fetchInventarisList();
});
</script>
