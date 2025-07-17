<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Tipe</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari Tipe..."
          class="px-3 py-2 border rounded-md w-full md:w-64"
          @input="onSearch"
        />
      </div>

      <div class="flex space-x-2 w-full md:w-auto">
        <button
          @click="goToCreate()"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          Tambah Tipe
        </button>
      </div>
    </div>

    <Vue3EasyDataTable
      ref="dataTable"
      :headers="headers"
      :items="tipeList"
      :loading="loading"
      :server-options="serverOptions"
      :server-items-length="pagination.total"
      @update:server-options="onServerOptionsUpdate"
      :rows-per-page="serverOptions.rowsPerPage"
      :rows-items="[10, 25, 50]"
      :pagination="false"
      hide-footer
      class="bg-white shadow-md rounded-lg overflow-hidden"
      empty-message="Tidak ada data Tipe"
      border-cell
    >
      <template #item-actions="item">
        <div class="flex space-x-2">
          <button
            @click.stop="goToEdit(item.id_tipe)"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <i class="fas fa-edit mr-1"></i> Edit
          </button>
          <button
            @click.stop="confirmDelete(item)"
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <i class="fas fa-trash-alt mr-1"></i> Hapus
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
          :disabled="pagination.current_page <= 1"
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
          Apakah Anda yakin ingin menghapus Tipe "{{
            selectedItem?.nama_tipe
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
            @click="deleteTipe"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? "Menghapus..." : "Hapus" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick,
} from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const router = useRouter();
const toast = useToast();
const dataTable = ref(null);
const actionMenuRef = ref(null);
const tipeList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const debounceTimeout = ref(null);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const activeActionMenu = ref(null);
const bottomRowIds = ref([]);
const tableKey = ref(0);

const headers = [
  { text: "No", value: "no", sortable: true },
  { text: "Nama Tipe", value: "nama_tipe", sortable: true },
  { text: "Aksi", value: "actions" },
];

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

const updateBottomRowIds = () => {
  if (tipeList.value.length <= 2) {
    bottomRowIds.value = tipeList.value.map((item) => item.id_tipe);
    return;
  }

  bottomRowIds.value = tipeList.value.slice(-2).map((item) => item.id_tipe);
};

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const fetchTipeList = async () => {
  try {
    loading.value = true;
    setupAxios();

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
    };
    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }
    if (searchTerm.value) {
      params.search = searchTerm.value;
    }
    const response = await axios.get("/api/admin_pengelola/tipe", { params });

    if (response.data && response.data.data) {
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      tipeList.value = dataArray.map((item, index) => ({
        ...item,
        no: (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1,
      }));

      Object.assign(pagination, {
        current_page: response.data.pagination.current_page || 1,
        per_page: response.data.pagination.per_page || 10,
        total: response.data.pagination.total || 0,
        last_page: response.data.pagination.last_page || 1,
      });
    } else {
      tipeList.value = [];
      toast.error("Format data tidak valid");
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Tipe");
    tipeList.value = [];
  } finally {
    loading.value = false;
  }
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

  await fetchTipeList();
};

const onSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchTipeList();
  }, 300);
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchTipeList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchTipeList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchTipeList();
  }
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

const goToCreate = () => {
  router.push("/admin-pengelola/tipe/create");
};

const goToEdit = (id) => {
  router.push(`/admin-pengelola/tipe/edit/${id}`);
};

const confirmDelete = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const deleteTipe = async () => {
  if (!selectedItem.value) return;

  try {
    isDeleting.value = true;
    setupAxios();
    const response = await axios.delete(
      `/api/admin_pengelola/tipe/${selectedItem.value.id_tipe}`
    );
    toast.success(response.data.message || "Tipe berhasil dihapus");
    fetchTipeList();
  } catch (error) {
    console.error("Error deleting Tipe:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error(error.response?.data?.message || "Gagal menghapus Tipe");
    }
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

onMounted(() => {
  fetchTipeList();
});
</script>
