<template>
  <div class="p-6 max-w-5xl mx-auto overflow-hidden">
    <h2 class="text-2xl font-bold mb-6">Daftar Jenis Inventaris</h2>

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
            placeholder="Cari Jenis Inventaris..."
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
                    <i class="fas fa-building text-gray-400 mr-2"></i>
                    Peruntukan
                  </label>
                  <select
                    v-model="filters.peruntukan"
                    @change="onFilterChange"
                    class="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Semua Peruntukan</option>
                    <option value="alat_lab">Alat Laboratorium</option>
                    <option value="inventaris_kantor">Inventaris Kantor</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-globe text-gray-400 mr-2"></i>
                    Status Import
                  </label>
                  <select
                    v-model="filters.status_import"
                    @change="onFilterChange"
                    class="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Semua Status Import</option>
                    <option value="produk_luar_negeri">
                      Produk Luar Negeri
                    </option>
                    <option value="produk_dalam_negeri">
                      Produk Dalam Negeri
                    </option>
                  </select>
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
          @click="exportJenisInventaris()"
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
          Tambah Jenis
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
        empty-message="Tidak ada data Jenis Inventaris"
        border-cell
        server-side-sort
        :key="tableKey"
      >
        <template #item-peruntukan="item">
          <span
            :class="{
              'px-2 py-1 rounded text-xs font-medium': true,
              'bg-blue-100 text-blue-800': item.peruntukan === 'alat_lab',
              'bg-green-100 text-green-800':
                item.peruntukan === 'inventaris_kantor',
            }"
            >{{ formatPeruntukan(item.peruntukan) }}</span
          >
        </template>

        <template #item-status_import="item">
          <span
            :class="{
              'px-2 py-1 rounded text-xs font-medium': true,
              'bg-purple-100 text-purple-800':
                item.status_import === 'produk_luar_negeri',
              'bg-amber-100 text-amber-800':
                item.status_import === 'produk_dalam_negeri',
            }"
            >{{ formatStatusImport(item.status_import) }}</span
          >
        </template>

        <template #item-actions="item">
          <div class="flex space-x-1">
            <button
              @click.stop="goToDetail(item.id_jenis_inventaris)"
              class="text-blue-500 hover:text-blue-700 p-1"
              title="Detail"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click.stop="goToEdit(item.id_jenis_inventaris)"
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
          Apakah Anda yakin ingin menghapus Jenis Inventaris "{{
            selectedItem?.nama_inventaris
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
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const tableKey = ref(0);
const showFilterDropdown = ref(false);

const headers = [
  { text: "No", value: "no", sortable: true },
  { text: "Nama Inventaris", value: "nama_inventaris", sortable: true },
  { text: "Merk", value: "nama_merk", sortable: true },
  { text: "Tipe", value: "nama_tipe", sortable: true },
  { text: "Peruntukan", value: "peruntukan", sortable: true },
  { text: "Status Import", value: "status_import", sortable: true },
  { text: "Aksi", value: "actions", sortable: false },
];

const filters = reactive({
  peruntukan: "",
  status_import: "",
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

const hasActiveFilters = computed(() => {
  return filters.peruntukan || filters.status_import;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.peruntukan) count++;
  if (filters.status_import) count++;
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
  filters.peruntukan = "";
  filters.status_import = "";
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
      ...(filters.peruntukan && { peruntukan: filters.peruntukan }),
      ...(filters.status_import && { status_import: filters.status_import }),
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get("/api/admin_pengelola/jenis_inventaris", {
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
    handleApiError(error, "Gagal memuat data Jenis Inventaris");
    inventarisList.value = [];
  } finally {
    loading.value = false;
  }
};

const goToCreate = () =>
  router.push("/admin-pengelola/jenis-inventaris/create");
const goToEdit = (id) =>
  router.push(`/admin-pengelola/jenis-inventaris/edit/${id}`);
const goToDetail = (id) =>
  router.push(`/admin-pengelola/jenis-inventaris/detail/${id}`);

const onSearch = () => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchInventarisList();
  }, 300);
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

const formatPeruntukan = (value) => {
  const formats = {
    alat_lab: "Alat Laboratorium",
    inventaris_kantor: "Inventaris Kantor",
  };
  return formats[value] || value;
};

const formatStatusImport = (value) => {
  const formats = {
    produk_luar_negeri: "Produk Luar Negeri",
    produk_dalam_negeri: "Produk Dalam Negeri",
  };
  return formats[value] || value;
};

const handleApiError = (error, message) => {
  if (error.response?.status === 401) {
    toast.error("Sesi anda telah berakhir. Silakan login kembali.");
    router.push("/login-admin");
  } else {
    toast.error(error.response?.data?.message || message);
  }
};

const exportJenisInventaris = async () => {
  try {
    setupAxios();
    const params = {
      search: searchTerm.value,
      status_import: filters.status_import,
      peruntukan: filters.peruntukan,
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get(
      "/api/admin_pengelola/jenis_inventaris/export",
      {
        responseType: "blob",
        params,
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];

    link.href = url;
    link.setAttribute("download", `jenis_inventaris_${today}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export berhasil");
  } catch (error) {
    handleApiError(error, "Gagal mengexport data Jenis Inventaris");
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
      `/api/admin_pengelola/jenis_inventaris/${selectedItem.value.id_jenis_inventaris}`
    );
    toast.success(response.data.message || "Jenis Inventaris berhasil dihapus");
    fetchInventarisList();
  } catch (error) {
    handleApiError(error, "Gagal menghapus Jenis Inventaris");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

onMounted(() => {
  fetchInventarisList();
});
</script>
