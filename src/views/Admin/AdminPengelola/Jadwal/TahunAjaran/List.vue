<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Tahun Ajaran</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari Tahun Ajaran..."
          class="px-3 py-2 border rounded-md w-full md:w-64"
          @input="onSearch"
        />
      </div>

      <div class="flex space-x-2 w-full md:w-auto">
        <button
          @click="goToCreate()"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          Tambah Tahun Ajaran
        </button>
      </div>
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
              @click="sort('no')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              No
              <span v-if="serverOptions.sortBy === 'no'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('name')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Nama Tahun Ajaran
              <span v-if="serverOptions.sortBy === 'name'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('start_date')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Tanggal Mulai
              <span v-if="serverOptions.sortBy === 'start_date'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('end_date')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Tanggal Berakhir
              <span v-if="serverOptions.sortBy === 'end_date'">
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
            v-for="(year, index) in schoolYears"
            :key="year.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{
                (pagination.current_page - 1) * pagination.per_page + index + 1
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ year.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(year.start_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(year.end_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="goToEdit(year.id)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(year)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="schoolYears.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data tahun ajaran
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
        Showing {{ schoolYears.length }} of {{ pagination.total }} entries
      </div>

      <div
        class="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end"
      >
        <button
          @click="prevPage"
          :disabled="pagination.current_page <= 1"
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]"
        >
          Previous
        </button>
        <button
          @click="nextPage"
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
          Apakah Anda yakin ingin menghapus Tahun Ajaran "{{
            selectedItem?.name
          }}"?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="deleteSchoolYear"
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
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const router = useRouter();
const schoolYears = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const toast = useToast();

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

const fetchSchoolYears = async () => {
  try {
    loading.value = true;

    const params = {
      page: serverOptions.page,
      per_page: serverOptions.rowsPerPage,
      search: searchTerm.value,
      sort_by: serverOptions.sortBy,
      sort_type: serverOptions.sortType,
    };

    const response = await axios.get("/api/admin_pengelola/school_year", {
      params,
    });

    schoolYears.value = response.data.data;
    pagination.total = response.data.data.length;
    pagination.current_page = serverOptions.page;
    pagination.per_page = serverOptions.rowsPerPage;
  } catch (error) {
    console.error("Error fetching school years:", error);
  } finally {
    loading.value = false;
  }
};

const sort = (column) => {
  if (serverOptions.sortBy === column) {
    serverOptions.sortType = serverOptions.sortType === "asc" ? "desc" : "asc";
  } else {
    serverOptions.sortBy = column;
    serverOptions.sortType = "asc";
  }
  fetchSchoolYears();
};

const onSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    serverOptions.page = 1;
    fetchSchoolYears();
  }, 500);
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchSchoolYears();
};

const prevPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchSchoolYears();
  }
};

const nextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchSchoolYears();
  }
};

const goToCreate = () => {
  router.push("/admin-pengelola/tahun-ajaran/create");
};

const goToEdit = (id) => {
  router.push(`/admin-pengelola/tahun-ajaran/edit/${id}`);
};

const confirmDelete = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const deleteSchoolYear = async () => {
  if (!selectedItem.value) return;

  try {
    isDeleting.value = true;
    await axios.delete(
     `/api/admin_pengelola/school_year/${selectedItem.value.id}`
    );
    toast.success("Tahun ajaran berhasil dihapus", "success");
    fetchSchoolYears();
  } catch (error) {
    console.error("Error deleting school year:", error);
    toast.error("Gagal menghapus tahun ajaran", "error");
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

let searchTimeout = null;

onMounted(() => {
  fetchSchoolYears();
});
</script>