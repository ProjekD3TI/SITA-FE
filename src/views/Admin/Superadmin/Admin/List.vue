<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Daftar Admin</h2>

    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Cari Admin..."
          class="px-3 py-2 border rounded-md w-full md:w-64"
          @input="onSearch"
        />
      </div>

      <div class="flex space-x-2 w-full md:w-auto">
        <button
          @click="goToCreate()"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto"
        >
          <i class="fas fa-plus mr-2"> </i>
          Tambah Admin
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
              @click="sort('role')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Role
              <span v-if="serverOptions.sortBy === 'role'">
                {{ serverOptions.sortType === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              @click="sort('created_at')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Tanggal Dibuat
              <span v-if="serverOptions.sortBy === 'created_at'">
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
            v-for="admin in adminList"
            :key="admin.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ admin.no }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ admin.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ admin.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getRoleBadgeClass(admin.role)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ formatRole(admin.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(admin.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  v-if="!isCurrentUser(admin)"
                  @click="goToEdit(admin.id)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <i class="fas fa-edit mr-1"></i> Edit
                </button>
                <!-- <button
                  v-if="!isCurrentUser(admin)"
                  @click="confirmDelete(admin)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <i class="fas fa-trash-alt mr-1"></i> Hapus
                </button> -->
                <span
                  v-if="isCurrentUser(admin)"
                  class="px-3 py-1 text-sm bg-gray-400 text-gray-600 rounded cursor-not-allowed"
                  title="Tidak dapat mengedit atau menghapus akun sendiri"
                >
                  <i class="fas fa-user mr-1"></i> Akun Anda
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="adminList.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data admin
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
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Konfirmasi Hapus</h3>
        <p class="mb-6">
          Apakah Anda yakin ingin menghapus Admin "{{ selectedItem?.name }}"?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            @click="deleteAdmin"
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
import { decryptData } from "../../../../services/encrypt";

const router = useRouter();
const toast = useToast();
const adminList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const debounceTimeout = ref(null);
const currentUser = ref(null);

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

const setupAxios = () => {
  const token = VueCookies.get("auth_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const getCurrentUser = () => {
  try {
    const encryptedUserData = VueCookies.get("user_session");
    if (encryptedUserData) {
      const userData = decryptData(encryptedUserData);
      if (userData) {
        currentUser.value = userData;
      }
    }
  } catch (error) {
    console.error("Error fetching current user from cookie:", error);
  }
};

const isCurrentUser = (admin) => {
  if (!currentUser.value) {
    console.log("No current user data available");
    return false;
  }

  const currentUserEmail = currentUser.value.email;
  const adminEmail = admin.email;
  const result = currentUserEmail === adminEmail;

  return result;
};

const fetchAdminList = async () => {
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

    const response = await axios.get("/api/sa/admin", { params });

    if (response.data && response.data.data) {
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : Object.values(response.data.data);

      adminList.value = dataArray.map((item, index) => ({
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
      adminList.value = [];
      toast.error("Format data tidak valid");
    }
  } catch (error) {
    handleApiError(error, "Gagal memuat data Admin");
    adminList.value = [];
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
  fetchAdminList();
};

const onSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(() => {
    serverOptions.page = 1;
    fetchAdminList();
  }, 300);
};

const onRowsPerPageChange = () => {
  serverOptions.page = 1;
  fetchAdminList();
};

const goToPreviousPage = () => {
  if (serverOptions.page > 1) {
    serverOptions.page--;
    fetchAdminList();
  }
};

const goToNextPage = () => {
  if (serverOptions.page < pagination.last_page) {
    serverOptions.page++;
    fetchAdminList();
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
  router.push("/superadmin/admin/create");
};

const goToEdit = (id) => {
  router.push(`/superadmin/admin/edit/${id}`);
};

const confirmDelete = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const deleteAdmin = async () => {
  if (!selectedItem.value) return;

  try {
    isDeleting.value = true;
    setupAxios();
    const response = await axios.delete(
      `/api/sa/admin/${selectedItem.value.id}`
    );
    toast.success(response.data.message || "Admin berhasil dihapus");
    fetchAdminList();
  } catch (error) {
    console.error("Error deleting Admin:", error);
    if (error.response?.status === 401) {
      toast.error("Sesi anda telah berakhir. Silakan login kembali.");
      router.push("/login-admin");
    } else {
      toast.error(error.response?.data?.message || "Gagal menghapus Admin");
    }
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

const getRoleBadgeClass = (role) => {
  const classes = {
    superadmin: "bg-purple-100 text-purple-800",
    admin_pengelola: "bg-blue-100 text-blue-800",
    admin_ta: "bg-green-100 text-green-800",
  };
  return classes[role] || "bg-gray-100 text-gray-800";
};

const formatRole = (role) => {
  const roles = {
    superadmin: "Super Admin",
    admin_pengelola: "Admin Pengelola",
    admin_ta: "Admin TA",
  };
  return roles[role] || role;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchAdminList();
  getCurrentUser();
});
</script>
