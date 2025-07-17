<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Mahasiswa</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari Mahasiswa..."
          class="px-3 py-2 border rounded-md w-full md:w-64"
          @input="onSearch"
        />
      </div>

      <div class="flex space-x-2 w-full md:w-auto">
        <button
          @click="toggleSelectionMode"
          class="inline-flex items-center px-4 py-2 border rounded hover:bg-gray-50 transition w-full md:w-auto"
          :class="
            isSelectionMode
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white border-gray-300 text-gray-700'
          "
        >
          <i class="fas fa-check-square mr-2"></i>
          {{ isSelectionMode ? "Unselect" : "Select" }}
        </button>
        <button
          @click="goToCreate()"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          <i class="fas fa-plus mr-2"></i> Tambah Mahasiswa
        </button>
      </div>
    </div>

    <div
      v-if="isSelectionMode && selectedMahasiswas.length > 0"
      class="mb-4 p-3 bg-gray-50 rounded-md flex flex-wrap items-center gap-3"
    >
      <span class="text-sm font-medium"
        >{{ selectedMahasiswas.length }} mahasiswa terpilih</span
      >
      <button
        @click="confirmBulkToggleStatus(true)"
        class="px-3 py-1.5 text-sm text-white rounded transition bg-green-600 hover:bg-green-700"
      >
        Aktifkan Semua
      </button>
      <button
        @click="confirmBulkToggleStatus(false)"
        class="px-3 py-1.5 text-sm text-white rounded transition bg-red-600 hover:bg-red-700"
      >
        Nonaktifkan Semua
      </button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
        ></div>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-if="isSelectionMode"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                />
              </div>
            </th>
            <th
              @click="sort('id')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              No
              <span v-if="serverOptions.sortBy === 'id'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Nama
              <span v-if="serverOptions.sortBy === 'name'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('email')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Email
              <span v-if="serverOptions.sortBy === 'email'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('nim')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              NIM
              <span v-if="serverOptions.sortBy === 'nim'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('no_telp')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              No. Telp
              <span v-if="serverOptions.sortBy === 'no_telp'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('status')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Status
              <span v-if="serverOptions.sortBy === 'status'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(mahasiswa, index) in mahasiswaList"
            :key="mahasiswa.id"
            class="hover:bg-gray-50"
          >
            <td v-if="isSelectionMode" class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :checked="isSelected(mahasiswa.id)"
                @change="toggleSelect(mahasiswa.id)"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{
                (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ mahasiswa.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ mahasiswa.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ mahasiswa.nim }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ mahasiswa.no_telp || "-" }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="confirmToggleStatus(mahasiswa)"
                :class="
                  mahasiswa.status === 1
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                "
                class="px-3 py-1.5 text-sm text-white rounded transition"
              >
                {{ mahasiswa.status === 1 ? "Aktif" : "Nonaktif" }}
              </button>
            </td>
          </tr>
          <tr v-if="mahasiswaList.length === 0">
            <td
              :colspan="isSelectionMode ? 8 : 7"
              class="px-6 py-4 text-center text-gray-500"
            >
              Tidak ada data mahasiswa
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

    <!-- Status Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Konfirmasi Perubahan Status</h3>
        <p class="mb-6">
          Apakah Anda yakin ingin
          {{
            selectedMahasiswa?.status === 1 ? "menonaktifkan" : "mengaktifkan"
          }}
          mahasiswa "{{ selectedMahasiswa?.name }}"?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showStatusModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="toggleStatus"
            class="px-4 py-2 text-white rounded"
            :class="
              selectedMahasiswa?.status === 1
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            "
            :disabled="changingStatusId !== null"
          >
            {{
              changingStatusId !== null
                ? "Mengubah..."
                : selectedMahasiswa?.status === 1
                ? "Nonaktifkan"
                : "Aktifkan"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Status Modal -->
    <div
      v-if="showBulkStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">
          Konfirmasi Perubahan Status Massal
        </h3>
        <p class="mb-6">
          Apakah Anda yakin ingin
          {{ bulkNewStatus ? "mengaktifkan" : "menonaktifkan" }}
          {{ selectedMahasiswas.length }} mahasiswa yang dipilih?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showBulkStatusModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="bulkToggleStatus"
            class="px-4 py-2 text-white rounded"
            :class="
              bulkNewStatus
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            "
            :disabled="isChangingBulkStatus"
          >
            <span v-if="isChangingBulkStatus" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengubah...
            </span>
            <span v-else>
              {{ bulkNewStatus ? "Aktifkan" : "Nonaktifkan" }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";

const router = useRouter();
const toast = useToast();
const mahasiswaList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const showStatusModal = ref(false);
const showBulkStatusModal = ref(false);
const selectedMahasiswa = ref(null);
const changingStatusId = ref(null);
const debounceTimeout = ref(null);
const selectedMahasiswas = ref([]);
const bulkNewStatus = ref(false);
const isChangingBulkStatus = ref(false);
const isSelectionMode = ref(false);

const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value;

  if (!isSelectionMode.value) {
    selectedMahasiswas.value = [];
  }
};

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

const isAllSelected = computed(() => {
  return (
    mahasiswaList.value.length > 0 &&
    mahasiswaList.value.every((mahasiswa) =>
      selectedMahasiswas.value.includes(mahasiswa.id)
    )
  );
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const isSelected = (mahasiswaId) => {
  return selectedMahasiswas.value.includes(mahasiswaId);
};

const toggleSelect = (mahasiswaId) => {
  const index = selectedMahasiswas.value.indexOf(mahasiswaId);
  if (index === -1) {
    selectedMahasiswas.value.push(mahasiswaId);
  } else {
    selectedMahasiswas.value.splice(index, 1);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedMahasiswas.value = [];
  } else {
    selectedMahasiswas.value = mahasiswaList.value.map(
      (mahasiswa) => mahasiswa.id
    );
  }
};

const confirmBulkToggleStatus = (newStatus) => {
  if (selectedMahasiswas.value.length === 0) {
    toast.warning("Pilih minimal satu mahasiswa");
    return;
  }

  bulkNewStatus.value = newStatus;
  showBulkStatusModal.value = true;
};

const bulkToggleStatus = async () => {
  if (selectedMahasiswas.value.length === 0) return;

  try {
    isChangingBulkStatus.value = true;
    setupAxios();

    const response = await axios.post("/api/superadmin/mahasiswa/set_status", {
      id: selectedMahasiswas.value,
      status: bulkNewStatus.value,
    });

    mahasiswaList.value.forEach((mahasiswa) => {
      if (selectedMahasiswas.value.includes(mahasiswa.id)) {
        mahasiswa.status = bulkNewStatus.value ? 1 : 0;
      }
    });

    const actionLabel = bulkNewStatus.value ? "diaktifkan" : "dinonaktifkan";
    toast.success(
      `${response.data.data.updated_count} mahasiswa berhasil ${actionLabel}`
    );

    showBulkStatusModal.value = false;
    selectedMahasiswas.value = [];
  } catch (error) {
    handleApiError(error, "Gagal mengubah status mahasiswa");
  } finally {
    isChangingBulkStatus.value = false;
  }
};

const fetchMahasiswaList = async () => {
  try {
    loading.value = true;
    setupAxios();

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
      search: searchTerm.value || undefined,
    };

    if (serverOptions.sortBy && serverOptions.sortType) {
      params.sort_by = serverOptions.sortBy;
      params.sort_type = serverOptions.sortType;
    }

    const response = await axios.get("/api/superadmin/mahasiswa", { params });

    if (response.data && response.data.data) {
      mahasiswaList.value = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      if (response.data.pagination) {
        Object.assign(pagination, {
          current_page: response.data.pagination.current_page || 1,
          per_page: response.data.pagination.per_page || 10,
          total: response.data.pagination.total || 0,
          last_page: response.data.pagination.last_page || 1,
        });
      }

      selectedMahasiswas.value = [];
    } else {
      mahasiswaList.value = [];
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Mahasiswa");
    mahasiswaList.value = [];
  } finally {
    loading.value = false;
  }
};

const sort = (column) => {
  if (serverOptions.sortBy === column) {
    if (serverOptions.sortType === "asc") {
      serverOptions.sortType = "desc";
    } else if (serverOptions.sortType === "desc") {
      serverOptions.sortBy = null;
      serverOptions.sortType = null;
    } else {
      serverOptions.sortType = "asc";
    }
  } else {
    serverOptions.sortBy = column;
    serverOptions.sortType = "asc";
  }

  serverOptions.page = 1;
  fetchMahasiswaList();
};

const confirmToggleStatus = (mahasiswa) => {
  selectedMahasiswa.value = mahasiswa;
  showStatusModal.value = true;
};

const toggleStatus = async () => {
  if (!selectedMahasiswa.value) return;

  try {
    changingStatusId.value = selectedMahasiswa.value.id;
    setupAxios();
    const newStatus = selectedMahasiswa.value.status === 1 ? false : true;

    await axios.post("/api/superadmin/mahasiswa/set_status", {
      id: [selectedMahasiswa.value.id],
      status: newStatus,
    });

    const mahasiswa = mahasiswaList.value.find(
      (m) => m.id === selectedMahasiswa.value.id
    );
    if (mahasiswa) {
      mahasiswa.status = newStatus ? 1 : 0;
    }

    const actionLabel = newStatus ? "diaktifkan" : "dinonaktifkan";
    toast.success(
      `Mahasiswa ${selectedMahasiswa.value.name} berhasil ${actionLabel}`
    );

    showStatusModal.value = false;
  } catch (error) {
    handleApiError(error, "Gagal mengubah status mahasiswa");
  } finally {
    changingStatusId.value = null;
  }
};

const onSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchMahasiswaList();
  }, 300);
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchMahasiswaList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchMahasiswaList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchMahasiswaList();
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
  router.push("/superadmin/mahasiswa/create");
};

const goToEdit = (id) => {
  router.push(`/superadmin/mahasiswa/edit/${id}`);
};

onMounted(() => {
  fetchMahasiswaList();
});
</script>
