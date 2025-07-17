<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Dosen</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari Dosen..."
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
          <i class="fas fa-plus mr-2"></i> Tambah Dosen
        </button>
      </div>
    </div>

    <div
      v-if="isSelectionMode && selectedDosens.length > 0"
      class="mb-4 p-3 bg-gray-50 rounded-md flex flex-wrap items-center gap-3"
    >
      <span class="text-sm font-medium"
        >{{ selectedDosens.length }} dosen terpilih</span
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
              @click="sort('nik')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              NIK
              <span v-if="serverOptions.sortBy === 'nik'">
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
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Jabatan
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
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(dosen, index) in dosenList"
            :key="dosen.id"
            class="hover:bg-gray-50"
          >
            <td v-if="isSelectionMode" class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                :checked="isSelected(dosen.id)"
                @change="toggleSelect(dosen.id)"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{
                (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ dosen.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ dosen.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ dosen.nik }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ dosen.no_telp || "-" }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="jabatan in getDosenJabatan(dosen.id)"
                  :key="jabatan.id"
                  :class="
                    jabatan.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="px-2 py-1 text-xs rounded-full inline-flex items-center"
                >
                  {{ jabatan.jabatan.name }}
                  <button
                    v-if="jabatan.jabatan.name !== 'Dosen'"
                    @click="deleteJabatanDosen(jabatan.id)"
                    class="ml-1 text-red-500 hover:text-red-700 text-xs"
                    title="Hapus jabatan"
                  >
                    ×
                  </button>
                </span>
                <button
                  v-if="availableJabatanCount(dosen.id) > 0"
                  @click="openAddJabatanModal(dosen)"
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 inline-flex items-center"
                  title="Tambah jabatan"
                >
                  <i class="fas fa-plus text-xs"></i>
                </button>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="confirmToggleStatus(dosen)"
                :class="
                  dosen.status === 1
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                "
                class="px-3 py-1.5 text-sm text-white rounded transition"
              >
                {{ dosen.status === 1 ? "Aktif" : "Nonaktif" }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="goToEdit(dosen.id)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  title="Edit dosen"
                >
                  <i class="fas fa-edit mr-1"></i> Edit
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="dosenList.length === 0">
            <td
              :colspan="isSelectionMode ? 9 : 8"
              class="px-6 py-4 text-center text-gray-500"
            >
              Tidak ada data dosen
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

    <div
      v-if="showAddJabatanModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">
          Tambah Jabatan untuk {{ selectedDosen?.name }}
        </h3>

        <form @submit.prevent="addJabatanToDosen">
          <div class="space-y-2">
            <label class="text-sm font-medium">Pilih Jabatan</label>
            <select
              v-model="selectedJabatanId"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Jabatan</option>
              <option
                v-for="jabatan in availableJabatan"
                :key="jabatan.id"
                :value="jabatan.id"
              >
                {{ jabatan.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="showAddJabatanModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              :disabled="!selectedJabatanId || isAddingJabatan"
            >
              {{ isAddingJabatan ? "Menambah..." : "Tambah" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Konfirmasi Perubahan Status</h3>
        <p class="mb-6">
          Apakah Anda yakin ingin
          {{ selectedDosen?.status === 1 ? "menonaktifkan" : "mengaktifkan" }}
          dosen "{{ selectedDosen?.name }}"?
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
              selectedDosen?.status === 1
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            "
            :disabled="changingStatusId !== null"
          >
            {{
              changingStatusId !== null
                ? "Mengubah..."
                : selectedDosen?.status === 1
                ? "Nonaktifkan"
                : "Aktifkan"
            }}
          </button>
        </div>
      </div>
    </div>

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
          {{ selectedDosens.length }} dosen yang dipilih?
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
const dosenList = ref([]);
const jabatanList = ref([]);
const jabatanDosenList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const showJabatanModal = ref(false);
const showAddJabatanModal = ref(false);
const showStatusModal = ref(false);
const showBulkStatusModal = ref(false);
const selectedDosen = ref(null);
const selectedJabatanId = ref("");
const isCreatingJabatan = ref(false);
const isAddingJabatan = ref(false);
const changingStatusId = ref(null);
const debounceTimeout = ref(null);
const selectedDosens = ref([]);
const bulkNewStatus = ref(false);
const isChangingBulkStatus = ref(false);
const isSelectionMode = ref(false);

const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value;

  if (!isSelectionMode.value) {
    selectedDosens.value = [];
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

const jabatanForm = reactive({
  name: "",
  description: "",
});

const isAllSelected = computed(() => {
  return (
    dosenList.value.length > 0 &&
    dosenList.value.every((dosen) => selectedDosens.value.includes(dosen.id))
  );
});

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const availableJabatanCount = (dosenId) => {
  const dosenJabatanIds = getDosenJabatan(dosenId).map((j) => j.jabatan.id);
  return jabatanList.value.filter(
    (jabatan) => !dosenJabatanIds.includes(jabatan.id)
  ).length;
};

const availableJabatan = computed(() => {
  if (!selectedDosen.value) return jabatanList.value;

  const dosenJabatanIds = getDosenJabatan(selectedDosen.value.id).map(
    (j) => j.jabatan.id
  );
  return jabatanList.value.filter(
    (jabatan) => !dosenJabatanIds.includes(jabatan.id)
  );
});

const getDosenJabatan = (dosenId) => {
  return jabatanDosenList.value.filter((jd) => jd.dosen_id === dosenId);
};

const isSelected = (dosenId) => {
  return selectedDosens.value.includes(dosenId);
};

const toggleSelect = (dosenId) => {
  const index = selectedDosens.value.indexOf(dosenId);
  if (index === -1) {
    selectedDosens.value.push(dosenId);
  } else {
    selectedDosens.value.splice(index, 1);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedDosens.value = [];
  } else {
    selectedDosens.value = dosenList.value.map((dosen) => dosen.id);
  }
};

const confirmBulkToggleStatus = (newStatus) => {
  if (selectedDosens.value.length === 0) {
    toast.warning("Pilih minimal satu dosen");
    return;
  }

  bulkNewStatus.value = newStatus;
  showBulkStatusModal.value = true;
};

const bulkToggleStatus = async () => {
  if (selectedDosens.value.length === 0) return;

  try {
    isChangingBulkStatus.value = true;
    setupAxios();

    const response = await axios.post("/api/superadmin/dosen/set_status", {
      id: selectedDosens.value,
      status: bulkNewStatus.value,
    });

    dosenList.value.forEach((dosen) => {
      if (selectedDosens.value.includes(dosen.id)) {
        dosen.status = bulkNewStatus.value ? 1 : 0;
      }
    });

    const actionLabel = bulkNewStatus.value ? "diaktifkan" : "dinonaktifkan";
    toast.success(
      `${response.data.data.updated_count} dosen berhasil ${actionLabel}`
    );

    showBulkStatusModal.value = false;
    selectedDosens.value = [];
  } catch (error) {
    handleApiError(error, "Gagal mengubah status dosen");
  } finally {
    isChangingBulkStatus.value = false;
  }
};

const fetchDosenList = async () => {
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

    const response = await axios.get("/api/superadmin/dosen", { params });

    if (response.data && response.data.data) {
      dosenList.value = Array.isArray(response.data.data)
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

      selectedDosens.value = [];
    } else {
      dosenList.value = [];
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Dosen");
    dosenList.value = [];
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
  fetchDosenList();
};

const fetchJabatanData = async () => {
  try {
    setupAxios();
    const response = await axios.get("/api/superadmin/jabatan");

    if (response.data.data) {
      jabatanList.value = response.data.data.jabatans || [];
      jabatanDosenList.value = response.data.data.jabatan_dosen || [];
    }
  } catch (error) {
    console.error("Error fetching jabatan:", error);
    handleApiError(error, "Gagal memuat data Jabatan");
  }
};

const confirmToggleStatus = (dosen) => {
  selectedDosen.value = dosen;
  showStatusModal.value = true;
};

const toggleStatus = async () => {
  if (!selectedDosen.value) return;

  try {
    changingStatusId.value = selectedDosen.value.id;
    setupAxios();
    const newStatus = selectedDosen.value.status === 1 ? false : true;

    await axios.post("/api/superadmin/dosen/set_status", {
      id: [selectedDosen.value.id],
      status: newStatus,
    });

    const dosen = dosenList.value.find((d) => d.id === selectedDosen.value.id);
    if (dosen) {
      dosen.status = newStatus ? 1 : 0;
    }

    const actionLabel = newStatus ? "diaktifkan" : "dinonaktifkan";
    toast.success(`Dosen ${selectedDosen.value.name} berhasil ${actionLabel}`);

    showStatusModal.value = false;
  } catch (error) {
    handleApiError(error, "Gagal mengubah status dosen");
  } finally {
    changingStatusId.value = null;
  }
};

const openAddJabatanModal = (dosen) => {
  selectedDosen.value = dosen;
  selectedJabatanId.value = "";
  showAddJabatanModal.value = true;
};

const addJabatanToDosen = async () => {
  try {
    isAddingJabatan.value = true;
    setupAxios();

    await axios.post("/api/superadmin/insert_jabatan", {
      dosen_id: selectedDosen.value.id,
      jabatan_id: parseInt(selectedJabatanId.value),
    });

    await fetchJabatanData();

    showAddJabatanModal.value = false;
    toast.success("Jabatan berhasil ditambahkan ke dosen");
  } catch (error) {
    handleApiError(error, "Gagal menambahkan jabatan ke dosen");
  } finally {
    isAddingJabatan.value = false;
  }
};

const deleteJabatanDosen = async (jabatanDosenId) => {
  if (!confirm("Apakah Anda yakin ingin menghapus jabatan ini?")) return;

  try {
    setupAxios();

    await axios.delete("/api/superadmin/delete_jabatan", {
      data: { id: jabatanDosenId },
    });

    await fetchJabatanData();

    toast.success("Jabatan berhasil dihapus");
  } catch (error) {
    handleApiError(error, "Gagal menghapus jabatan");
  }
};

const onSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchDosenList();
  }, 300);
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchDosenList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchDosenList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchDosenList();
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
  router.push("/superadmin/dosen/create");
};

const goToEdit = (id) => {
  router.push(`/superadmin/dosen/edit/${id}`);
};

onMounted(() => {
  fetchDosenList();
  fetchJabatanData();
});
</script>
