<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Peminjaman Inventaris</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari peminjaman..."
          class="px-3 py-2 border rounded-md w-full md:w-64"
          @input="onSearch"
        />

        <select
          v-model="statusFilter"
          class="px-3 py-2 border rounded-md"
          @change="onStatusFilterChange"
        >
          <option value="">Semua Status</option>
          <option value="Belum Dikembalikan">Belum Dikembalikan</option>
          <option value="Sebagian Dikembalikan">Sebagian Dikembalikan</option>
          <option value="Sudah Dikembalikan">Sudah Dikembalikan</option>
        </select>
      </div>

      <button
        @click="goToCreate()"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
      >
        Create
      </button>
    </div>

    <Vue3EasyDataTable
      ref="dataTable"
      :headers="headers"
      :items="peminjamanList"
      :loading="loading"
      :server-options="serverOptions"
      :server-items-length="pagination.total"
      @update:options="onOptionsUpdate"
      :rows-per-page="serverOptions.rowsPerPage"
      :rows-items="[10, 25, 50]"
      :pagination="false"
      hide-footer
      class="bg-white shadow-md rounded-lg overflow-hidden"
      empty-message="Tidak ada data peminjaman"
      border-cell
    >
      <template #item-status="item">
        <span
          :class="{
            'px-2 py-1 rounded text-xs font-medium': true,
            'bg-green-100 text-green-800': item.status === 'Sudah Dikembalikan',
            'bg-yellow-100 text-yellow-800':
              item.status === 'Sebagian Dikembalikan',
            'bg-blue-100 text-blue-800': item.status === 'Belum Dikembalikan',
          }"
        >
          {{ item.status }}
        </span>
      </template>

      <template #item-actions="item">
        <div class="flex space-x-2">
          <button
            @click="goToDetail(item.id_peminjaman_inventaris)"
            class="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
          >
            Detail
          </button>
          <button
            v-if="item.status !== 'Sudah Dikembalikan'"
            @click="goToReturn(item.id_peminjaman_inventaris)"
            class="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
          >
            Kembalikan
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
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
const totalItems = ref(0);
const searchTerm = ref("");
const statusFilter = ref("");
const debounceTimeout = ref(null);

const headers = [
  { text: "No Referensi", value: "referensi" },
  { text: "Nama Peminjam", value: "nama_peminjam" },
  { text: "Tanggal Pinjam", value: "tanggal_pinjam_formatted" },
  { text: "Jumlah Item", value: "total_Peminjaman" },
  { text: "Status", value: "status" },
  { text: "Aksi", value: "actions" },
];

const serverOptions = reactive({
  page: 1,
  rowsPerPage: 10,
  sortBy: "created_at",
  sortType: "desc",
});

const pagination = reactive({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
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

const onRowsPerPageChange = () => {
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

const fetchPeminjamanList = async () => {
  try {
    loading.value = true;
    setupAxios();

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
    };

    if (searchTerm.value) {
      params.search = searchTerm.value;
    }

    if (statusFilter.value) {
      params.status = statusFilter.value;
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

      peminjamanList.value = dataArray.map((item) => ({
        ...item,
        tanggal_pinjam_formatted: formatDate(item.tanggal_pinjam),
        status: item.return_status,
      }));

      Object.assign(pagination, {
        current_page: response.data.pagination?.current_page,
        per_page: response.data.pagination?.per_page,
        total: response.data.pagination?.total,
        last_page: response.data.pagination?.last_page,
      });
    } else {
      peminjamanList.value = [];
      toast.error("Format data tidak valid");
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Inventaris");
    peminjamanList.value = [];
  } finally {
    loading.value = false;
  }
};

const onOptionsUpdate = async (options) => {
  serverOptions.page = options.page || 1;
  serverOptions.rowsPerPage = options.rowsPerPage || 10;

  if (options.sortBy) {
    serverOptions.sortBy = options.sortBy;
    serverOptions.sortType = options.sortType;
    await fetchPeminjamanList();
  }
  await fetchPeminjamanList();
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

const onStatusFilterChange = () => {
  serverOptions.page = 1;
  fetchPeminjamanList();
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

onMounted(() => {
  fetchPeminjamanList();
});
</script>
