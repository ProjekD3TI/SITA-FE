<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Peminjaman Inventaris</h2>

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
            placeholder="Cari peminjaman inventaris..."
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
                    <i class="fas fa-clipboard-check text-gray-400 mr-2"></i>
                    Status Pengembalian
                  </label>
                  <select
                    v-model="filters.status"
                    @change="onFilterChange"
                    class="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Semua Status</option>
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dikembalikan Sebagian">
                      Dikembalikan Sebagian
                    </option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-calendar-alt text-gray-400 mr-2"></i>
                    Rentang Tanggal Peminjaman
                  </label>
                  <div class="space-y-2">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Dari Tanggal</label
                      >
                      <input
                        v-model="filters.start_date"
                        type="date"
                        class="w-full px-3 py-2 border rounded-md text-sm"
                        @change="onDateChange"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1"
                        >Sampai Tanggal</label
                      >
                      <input
                        v-model="filters.end_date"
                        type="date"
                        class="w-full px-3 py-2 border rounded-md text-sm"
                        @change="onDateChange"
                        :min="filters.start_date"
                      />
                    </div>
                  </div>
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
          @click="exportPeminjamanInventaris()"
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
          Tambah Peminjaman
        </button>
      </div>
    </div>

    <Vue3EasyDataTable
      ref="dataTable"
      :headers="headers"
      :items="peminjamanList"
      :loading="loading"
      :server-options="serverOptions"
      :server-items-length="pagination.total"
      @update:server-options="onServerOptionsUpdate"
      :rows-per-page="serverOptions.rowsPerPage"
      :rows-items="[10, 25, 50]"
      :pagination="false"
      hide-footer
      class="bg-white shadow-md rounded-lg overflow-hidden"
      empty-message="Tidak ada data peminjaman inventaris"
      border-cell
      server-side-sort
      :key="tableKey"
    >
      <template #item-nomor_inventaris="item">
        <div class="max-w-xs">
          <div
            v-if="item.inventaris_data && item.inventaris_data.length > 0"
            class="text-sm"
          >
            <div
              v-if="expandedItems[item.id_peminjaman_inventaris]"
              class="flex flex-col gap-1"
            >
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(inventaris, index) in item.inventaris_data"
                  :key="index"
                  class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ inventaris.no_inventaris }}
                </span>
              </div>
              <button
                @click.stop="toggleExpand(item.id_peminjaman_inventaris)"
                class="text-blue-600 text-xs mt-1 hover:text-blue-800 transition flex items-center gap-1 self-start"
              >
                <i class="fas fa-chevron-up"></i> Sembunyikan
              </button>
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="(inventaris, index) in item.inventaris_data.slice(0, 3)"
                :key="index"
                class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ inventaris.no_inventaris }}
              </span>
              <button
                v-if="item.inventaris_data.length > 3"
                @click.stop="toggleExpand(item.id_peminjaman_inventaris)"
                class="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200 transition"
              >
                +{{ item.inventaris_data.length - 3 }} lainnya
              </button>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm italic">Tidak ada data</div>
        </div>
      </template>

      <template #item-status="item">
        <span
          :class="{
            'px-2 py-1 rounded text-xs font-medium flex items-center gap-1': true,
            'bg-green-100 text-green-800': item.status === 'Selesai',
            'bg-yellow-100 text-yellow-800':
              item.status === 'Dikembalikan Sebagian',
            'bg-blue-100 text-blue-800': item.status === 'Dipinjam',
          }"
        >
          <i
            :class="{
              'fas fa-check-circle': item.status === 'Selesai',
              'fas fa-exclamation-triangle':
                item.status === 'Dikembalikan Sebagian',
              'fas fa-clock': item.status === 'Dipinjam',
            }"
          ></i>
          {{ item.status }}
        </span>
      </template>

      <template #item-actions="item">
        <div class="flex space-x-2">
          <button
            @click="goToDetail(item.id_peminjaman_inventaris)"
            class="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition"
          >
            <i class="fas fa-eye mr-1"></i>
            Detail
          </button>
          <button
            v-if="item.status == 'Dipinjam'"
            @click="goToEdit(item.id_peminjaman_inventaris)"
            class="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
          >
            <i class="fas fa-edit mr-1"></i>
            Edit
          </button>
          <button
            v-if="item.status !== 'Selesai'"
            @click="goToReturn(item.id_peminjaman_inventaris)"
            class="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
          >
            <i class="fas fa-undo mr-1"></i>
            Kembalikan
          </button>
          <button
            v-if="item.status == 'Dipinjam'"
            @click.stop="handleDelete(item)"
            class="text-white bg-red-600 rounded px-3 py-1 transition hover:bg-red-700 w-24"
            title="Hapus"
          >
            <i class="fas fa-trash-alt mr-1"></i>
            Hapus
          </button>
        </div>
      </template>
    </Vue3EasyDataTable>

    <div
      class="flex flex-col md:flex-row justify-between items-center mt-4 p-4 bg-gray-50 rounded-md gap-4"
    >
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 whitespace-nowrap"
          >Rows per page:</span
        >
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

      <div class="text-sm text-gray-600 text-center w-full md:w-auto">
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
          :disabled="serverOptions.page <= 1"
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]"
        >
          Previous
        </button>

        <div class="px-3 py-1 bg-white border rounded whitespace-nowrap">
          Page {{ pagination.current_page }} of {{ pagination.last_page || 1 }}
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
          Apakah Anda yakin ingin menghapus Peminjaman untuk "{{
            selectedItem?.nama_peminjam
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
            @click="deletePeminjaman"
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
const peminjamanList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const selectedItem = ref(null);
const isDeleting = ref(false);
const debounceTimeout = ref(null);
const dateDebounceTimeout = ref(null);
const tableKey = ref(0);
const showFilterDropdown = ref(false);
const expandedItems = ref({});

const headers = [
  { text: "No", value: "no", sortable: true },
  { text: "No Referensi", value: "referensi", sortable: true },
  { text: "Nama Peminjam", value: "nama_peminjam", sortable: true },
  { text: "Tanggal Pinjam", value: "tanggal_pinjam_formatted", sortable: true },
  {
    text: "Nomor Inventaris",
    value: "nomor_inventaris",
    sortable: true,
    width: 200,
  },
  { text: "Jumlah Item", value: "total_Peminjaman", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Aksi", value: "actions", sortable: false },
];

const filters = reactive({
  status: "",
  start_date: "",
  end_date: "",
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
  return filters.status || filters.start_date || filters.end_date;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.status) count++;
  if (filters.start_date || filters.end_date) count++;
  return count;
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID");
};

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const closeFilterDropdown = () => {
  showFilterDropdown.value = false;
};

const clearAllFilters = () => {
  filters.status = "";
  filters.start_date = "";
  filters.end_date = "";
  serverOptions.page = 1;
  fetchPeminjamanList();
};

const toggleExpand = (id) => {
  expandedItems.value = {
    ...expandedItems.value,
    [id]: !expandedItems.value[id],
  };
};

const extractInventarisData = (detailPeminjamanInventaris) => {
  if (
    !detailPeminjamanInventaris ||
    !Array.isArray(detailPeminjamanInventaris)
  ) {
    return [];
  }

  return detailPeminjamanInventaris
    .map((detail) => ({
      no_inventaris:
        detail.inventaris?.no_inventaris ||
        detail.no_inventaris ||
        `INV-${detail.id}`,
    }))
    .filter((item) => item.no_inventaris);
};

const fetchPeminjamanList = async () => {
  try {
    loading.value = true;
    setupAxios();

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
      ...(searchTerm.value && { search: searchTerm.value }),
      ...(filters.status && { status: filters.status }),
      ...(filters.start_date && { start_date: filters.start_date }),
      ...(filters.end_date && { end_date: filters.end_date }),
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get(
      "/api/admin_pengelola/peminjaman_inventaris",
      {
        params,
      }
    );

    if (response.data && response.data.data) {
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      peminjamanList.value = dataArray.map((item, index) => ({
        ...item,
        no: (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1,
        tanggal_pinjam_formatted: formatDate(item.tanggal_pinjam),
        status: item.return_status,
        inventaris_data: extractInventarisData(
          item.detail_peminjaman_inventaris
        ),
      }));

      Object.assign(pagination, {
        current_page: response.data.pagination?.current_page || 1,
        per_page: response.data.pagination?.per_page || 10,
        total: response.data.pagination?.total || 0,
        last_page: response.data.pagination?.last_page || 1,
      });
    } else {
      peminjamanList.value = [];
      toast.error("Format data tidak valid");
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Peminjaman Inventaris");
    peminjamanList.value = [];
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchPeminjamanList();
  }, 300);
};

const onDateChange = () => {
  if (dateDebounceTimeout.value) clearTimeout(dateDebounceTimeout.value);
  dateDebounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchPeminjamanList();
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
  await fetchPeminjamanList();
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchPeminjamanList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchPeminjamanList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchPeminjamanList();
  }
};

const onFilterChange = () => {
  serverOptions.page = 1;
  fetchPeminjamanList();
};

const handleApiError = (error, message) => {
  console.error(`${message}:`, error);
  if (error.response?.status === 401) {
    toast.error("Sesi anda telah berakhir. Silakan login kembali.");
    router.push("/login-admin");
  } else {
    toast.error(error.response?.data?.message || message);
  }
};

const exportPeminjamanInventaris = async () => {
  try {
    setupAxios();
    const params = {
      search: searchTerm.value,
      status: filters.status,
      start_date: filters.start_date,
      end_date: filters.end_date,
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get(
      "/api/admin_pengelola/peminjaman_inventaris/export",
      {
        responseType: "blob",
        params,
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];

    const filename = `peminjaman_inventaris_${today}.xlsx`;

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export berhasil");
  } catch (error) {
    handleApiError(error, "Gagal mengexport data Peminjaman Inventaris");
  }
};

const handleDelete = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const deletePeminjaman = async () => {
  if (!selectedItem.value) return;

  try {
    isDeleting.value = true;
    setupAxios();
    const response = await axios.delete(
      `/api/admin_pengelola/peminjaman_inventaris/${selectedItem.value.id_peminjaman_bhp}`
    );
    toast.success(response.data.message || "Peminjaman berhasil dihapus");
    fetchPeminjamanList();
  } catch (error) {
    handleApiError(error, "Gagal menghapus Peminjaman");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

const goToCreate = () => {
  router.push(`/admin-pengelola/peminjaman-inventaris/create`);
};

const goToDetail = (id) => {
  router.push(`/admin-pengelola/peminjaman-inventaris/detail/${id}`);
};

const goToReturn = (id) => {
  router.push(`/admin-pengelola/peminjaman-inventaris/kembalikan/${id}`);
};
const goToEdit = (id) => {
  router.push(`/admin-pengelola/peminjaman-inventaris/edit/${id}`);
};

onMounted(() => {
  fetchPeminjamanList();
});
</script>
