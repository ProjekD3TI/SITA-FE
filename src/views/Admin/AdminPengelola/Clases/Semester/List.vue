<template>
    <div class="p-6 max-w-5xl mx-auto overflow-hidden">
        <h2 class="text-2xl font-bold mb-6">Daftar Mahasiswa</h2>

        <div class="grid grid-cols-1 gap-4 mb-4">
            <div class="flex gap-2">
                <div class="relative flex-1">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input v-model="searchTerm" type="text"
                        placeholder="Cari berdasarkan nama mahasiswa, NIM, atau kelas..."
                        class="pl-10 pr-3 py-2 border rounded-md w-full" @input="onSearch" />
                </div>
            </div>

            <div class="flex flex-wrap justify-end gap-2">
                <button @click="goToCreate()"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2">
                    <!-- <i class="fas fa-plus"></i> -->
                    Tambah Mahasiswa
                </button>
            </div>
        </div>

        <div class="relative overflow-x-auto">
            <Vue3EasyDataTable ref="dataTable" :headers="headers" :items="semesterList" :loading="loading"
                :server-options="serverOptions" :server-items-length="pagination.total"
                @update:server-options="onServerOptionsUpdate" :rows-per-page="serverOptions.rowsPerPage"
                :rows-items="[10, 25, 50]" :pagination="false" hide-footer class="bg-white shadow-md rounded-lg"
                empty-message="Tidak ada data Semester" border-cell server-side-sort :key="tableKey">
                <template #item-student_info="item">
                    <div class="flex flex-col">
                        <span class="font-medium">{{ item.student_name }}</span>
                    </div>
                </template>

                <template #item-class_name="item">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {{ item.class_name }}
                    </span>
                </template>

                <template #item-actions="item">
                    <div class="flex space-x-1">
                        <button @click.stop="goToEdit(item.id_semester)" class="text-blue-500 hover:text-blue-700 p-1"
                            title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button @click.stop="handleDelete(item)" class="text-red-500 hover:text-red-700 p-1"
                            title="Hapus">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </template>
            </Vue3EasyDataTable>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-center mt-4 p-4 bg-gray-50 rounded-md gap-4">
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Rows per page:</span>
                <select v-model="serverOptions.rowsPerPage" @change="onRowsPerPageChange"
                    class="px-2 py-1 border rounded-md text-sm">
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

            <div class="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
                <button @click="goToPreviousPage" :disabled="pagination.current_page <= 1"
                    class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]">
                    Previous
                </button>
                <div class="px-3 py-1 bg-white border rounded">
                    Page {{ pagination.current_page }} of
                    {{ pagination.last_page || 1 }}
                </div>
                <button @click="goToNextPage" :disabled="pagination.current_page >= pagination.last_page"
                    class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]">
                    Next
                </button>
            </div>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-medium mb-4">Konfirmasi Hapus</h3>
                <p class="mb-6">
                    Apakah Anda yakin ingin menghapus data semester untuk mahasiswa "{{
                        selectedItem?.student_name
                    }}" ({{ selectedItem?.student_nim }})? Tindakan ini tidak dapat
                    dibatalkan.
                </p>
                <div class="flex justify-end space-x-2">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Batal
                    </button>
                    <button @click="deleteSemester" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        :disabled="isDeleting">
                        {{ isDeleting ? "Menghapus..." : "Hapus" }}
                    </button>
                </div>
            </div>
        </div>
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
const semesterList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const debounceTimeout = ref(null);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const tableKey = ref(0);

const headers = [
    { text: "No", value: "no", sortable: true },
    { text: "Nama Mahasiswa", value: "student_name", sortable: false },
    { text: "NIM", value: "student_nim", sortable: true },
    { text: "Kelas", value: "class_name", sortable: true },
    { text: "Aksi", value: "actions", sortable: false },
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

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const fetchSemesterList = async () => {
    try {
        loading.value = true;
        setupAxios();

        const params = {
            page: serverOptions.page,
            per_page: serverOptions.rowsPerPage,
            ...(searchTerm.value && { search: searchTerm.value }),
        };

        if (serverOptions.sortBy && serverOptions.sortType) {
            params.sort_by = serverOptions.sortBy;
            params.sort_type = serverOptions.sortType;
        }

        const response = await axios.get("/api/admin_pengelola/semester", {
            params,
        });

        if (response.data && response.data.data) {
            const dataArray = Array.isArray(response.data.data)
                ? response.data.data
                : Object.values(response.data.data);

            semesterList.value = dataArray.map((item, index) => ({
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
            semesterList.value = [];
            toast.error("Format data tidak valid");
        }
    } catch (error) {
        handleApiError(error, "Gagal memuat data Semester");
        semesterList.value = [];
    } finally {
        loading.value = false;
    }
};

const goToCreate = () => router.push("/admin-pengelola/semester/create");
const goToEdit = (id) => router.push(`/admin-pengelola/semester/update/${id}`);

const onSearch = () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
        serverOptions.page = 1;
        fetchSemesterList();
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
    await fetchSemesterList();
};

const onRowsPerPageChange = () => {
    serverOptions.page = 1;
    fetchSemesterList();
};

const goToPreviousPage = () => {
    if (serverOptions.page > 1) {
        serverOptions.page--;
        fetchSemesterList();
    }
};

const goToNextPage = () => {
    if (serverOptions.page < pagination.last_page) {
        serverOptions.page++;
        fetchSemesterList();
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const handleApiError = (error, message) => {
    if (error.response?.status === 401) {
        toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        router.push("/login-admin");
    } else {
        toast.error(error.response?.data?.message || message);
    }
};

const handleDelete = (item) => {
    selectedItem.value = item;
    showDeleteModal.value = true;
};

const deleteSemester = async () => {
    if (!selectedItem.value) return;

    try {
        isDeleting.value = true;
        setupAxios();
        const response = await axios.delete(
            `/api/admin_pengelola/semester/${selectedItem.value.id_semester}`
        );
        toast.success(response.data.message || "Data Semester berhasil dihapus");
        fetchSemesterList();
    } catch (error) {
        handleApiError(error, "Gagal menghapus data Semester");
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
    }
};

onMounted(() => {
    fetchSemesterList();
});
</script>
  
