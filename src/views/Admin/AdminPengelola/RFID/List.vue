<template>
    <div class="p-6 max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Daftar RFID Tag</h2>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <input v-model="searchTerm" type="text" placeholder="Cari RFID tag..."
                class="px-3 py-2 border rounded-md w-full md:w-64" @input="onSearch" />

            <div class="flex space-x-2 w-full md:w-auto">
                <button @click="goToCreate()"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-auto">
                    Tambah RFID Tag
                </button>
            </div>
        </div>

        <!-- Debug Panel (Uncomment untuk debugging) -->
        <!-- <div v-if="debugData" class="mb-4 p-4 bg-gray-100 rounded overflow-auto max-h-40">
            <pre class="text-xs">{{ JSON.stringify(debugData, null, 2) }}</pre>
        </div> -->

        <div class="relative">
            <Vue3EasyDataTable ref="dataTable" :headers="headers" :items="rfidList" :loading="loading"
                :server-options="serverOptions" :server-items-length="pagination.total"
                @update:options="onOptionsUpdate" :rows-per-page="serverOptions.rowsPerPage" :rows-items="[10, 25, 50]"
                :pagination="false" hide-footer class="bg-white shadow-md rounded-lg overflow-hidden"
                empty-message="Tidak ada data RFID tag" border-cell>

                <template #item-user_type="item">
                    <span :class="{
                        'px-2 py-1 rounded text-xs font-medium': true,
                        'bg-blue-100 text-blue-800': getUserType(item) === 'student',
                        'bg-green-100 text-green-800': getUserType(item) === 'dosen',
                    }">
                        {{ formatUserType(getUserType(item)) }}
                    </span>
                </template>

                <!-- <template #item-user_name="item">
                    <span>{{ extractUserName(item) }}</span>
                </template> -->

                <template #item-actions="item">
                    <div class="flex space-x-1">
                        <button @click.stop="goToEdit(item.id)" class="text-blue-500 hover:text-blue-700 p-1"
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

            <div class="text-sm text-gray-600">
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

            <div class="flex items-center space-x-2">
                <button @click="goToPreviousPage" :disabled="pagination.current_page <= 1"
                    class="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 transition min-w-[80px]">
                    Previous
                </button>
                <div class="px-3 py-1 bg-white border rounded">
                    Page {{ pagination.current_page }} of {{ pagination.last_page || 1 }}
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
                    Apakah Anda yakin ingin menghapus RFID tag "{{
                        selectedItem?.rfid_code
                    }}"? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="flex justify-end space-x-2">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Batal
                    </button>
                    <button @click="deleteRfidTag" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        :disabled="isDeleting">
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
const toast = useToast();
const dataTable = ref(null);
const rfidList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const debounceTimeout = ref(null);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const isDeleting = ref(false);
const debugData = ref(null); // Untuk debugging

const headers = [
    { text: "No", value: "no" },
    { text: "Kode RFID", value: "rfid_code" },
    { text: "Tipe User", value: "user_type" },
    // { text: "Nama User", value: "user_name" },
    { text: "Aksi", value: "actions" },
];

const serverOptions = reactive({
    page: 1,
    rowsPerPage: 10,
});

const pagination = reactive({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
});

const formatUserType = (userType) => {
    const types = {
        student: "Mahasiswa",
        dosen: "Dosen",
    };
    return types[userType] || userType;
};

const getUserType = (item) => {
    // Coba deteksi tipe user berdasarkan field yang ada
    if (item.id_student || item.student_id || item.mahasiswa_id) {
        return 'student';
    } else if (item.id_dosen || item.dosen_id) {
        return 'dosen';
    }

    // Jika tidak bisa dideteksi, coba cek field lain
    if (item.user_type) {
        return item.user_type;
    }

    return 'unknown';
};

const extractUserName = (item) => {
    // Coba semua kemungkinan path untuk mendapatkan nama user

    // Jika ada objek student/mahasiswa
    if (item.student && item.student.name) return item.student.name;
    if (item.student && item.student.nama) return item.student.nama;
    if (item.mahasiswa && item.mahasiswa.name) return item.mahasiswa.name;
    if (item.mahasiswa && item.mahasiswa.nama) return item.mahasiswa.nama;

    // Jika ada objek dosen
    if (item.dosen && item.dosen.name) return item.dosen.name;
    if (item.dosen && item.dosen.nama) return item.dosen.nama;

    // Jika ada field nama langsung
    if (item.student_name) return item.student_name;
    if (item.dosen_name) return item.dosen_name;
    if (item.mahasiswa_name) return item.mahasiswa_name;
    if (item.user_name) return item.user_name;
    if (item.nama_user) return item.nama_user;

    // Jika tidak ada, tampilkan placeholder
    return "Nama tidak tersedia";
};

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const fetchRfidList = async () => {
    try {
        loading.value = true;
        setupAxios();

        const params = {
            page: serverOptions.page,
            per_page: serverOptions.rowsPerPage,
            ...(searchTerm.value && { search: searchTerm.value }),
        };

        const response = await axios.get("/api/admin_pengelola/rfid_tag", { params });

        // Untuk debugging
        if (response.data && response.data.data && response.data.data.length > 0) {
            debugData.value = {
                firstItem: response.data.data[0],
                structure: Object.keys(response.data.data[0])
            };
            console.log("API Response:", response.data);
            console.log("First RFID item:", response.data.data[0]);
        }

        if (response.data && response.data.data) {
            const dataArray = Array.isArray(response.data.data)
                ? response.data.data
                : Object.values(response.data.data);

            // Jika data tidak memiliki informasi user, coba ambil dari API
            const enrichedData = await Promise.all(dataArray.map(async (item, index) => {
                const enrichedItem = {
                    ...item,
                    no: (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1
                };

                // Jika tidak ada informasi user, coba ambil dari API
                if (!extractUserName(item) || extractUserName(item) === "Nama tidak tersedia") {
                    try {
                        const userType = getUserType(item);
                        const userId = item.id_student || item.student_id || item.mahasiswa_id || item.id_dosen || item.dosen_id;

                        if (userId && (userType === 'student' || userType === 'dosen')) {
                            const endpoint = userType === 'student'
                                ? `/api/admin_pengelola/mahasiswa/${userId}`
                                : `/api/admin_pengelola/dosen/${userId}`;

                            const userResponse = await axios.get(endpoint);

                            if (userResponse.data && userResponse.data.data) {
                                const userData = userResponse.data.data;

                                // Tambahkan informasi user ke item
                                if (userType === 'student') {
                                    enrichedItem.student = userData;
                                    enrichedItem.student_name = userData.name || userData.nama;
                                } else {
                                    enrichedItem.dosen = userData;
                                    enrichedItem.dosen_name = userData.name || userData.nama;
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching user details:", error);
                    }
                }

                return enrichedItem;
            }));

            rfidList.value = enrichedData;

            Object.assign(pagination, {
                current_page: response.data.pagination?.current_page || 1,
                per_page: response.data.pagination?.per_page || 10,
                total: response.data.pagination?.total || 0,
                last_page: response.data.pagination?.last_page || 1,
            });
        } else {
            rfidList.value = [];
            toast.error("Format data tidak valid");
        }
    } catch (error) {
        handleApiError(error, "Gagal memuat data RFID tag");
        rfidList.value = [];
    } finally {
        loading.value = false;
    }
};

const goToCreate = () => router.push("/admin-pengelola/RFID/create");
const goToEdit = (id) => router.push(`/admin-pengelola/RFID/edit/${id}`);

const onSearch = () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
        serverOptions.page = 1;
        fetchRfidList();
    }, 300);
};

const onOptionsUpdate = async (options) => {
    serverOptions.page = options.page || 1;
    serverOptions.rowsPerPage = options.rowsPerPage || 10;
    await fetchRfidList();
};

const onRowsPerPageChange = () => {
    serverOptions.page = 1;
    fetchRfidList();
};

const goToPreviousPage = () => {
    if (serverOptions.page > 1) {
        serverOptions.page--;
        fetchRfidList();
    }
};

const goToNextPage = () => {
    if (serverOptions.page < pagination.last_page) {
        serverOptions.page++;
        fetchRfidList();
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

const handleDelete = (item) => {
    selectedItem.value = item;
    showDeleteModal.value = true;
};

const deleteRfidTag = async () => {
    if (!selectedItem.value) return;

    try {
        isDeleting.value = true;
        setupAxios();
        const response = await axios.delete(
            `/api/admin_pengelola/rfid_tag/${selectedItem.value.id}`
        );
        toast.success(response.data.message || "RFID tag berhasil dihapus");
        fetchRfidList();
    } catch (error) {
        handleApiError(error, "Gagal menghapus RFID tag");
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
    }
};

onMounted(() => {
    fetchRfidList();
});
</script>