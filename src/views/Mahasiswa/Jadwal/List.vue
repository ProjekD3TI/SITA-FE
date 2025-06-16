<template>
    <div class="p-6 max-w-5xl mx-auto overflow-hidden">
        <h2 class="text-2xl font-bold mb-6">Daftar Jadwal Tetap</h2>

        <div class="grid grid-cols-1 gap-4 mb-4">
            <div class="flex gap-2">
                <div class="relative flex-1">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input v-model="searchTerm" type="text"
                        placeholder="Cari berdasarkan pemakaian atau penanggung jawab..."
                        class="pl-10 pr-3 py-2 border rounded-md w-full" @input="onSearch" />
                </div>
            </div>

            <!-- <div class="flex flex-wrap justify-end gap-2">
                <button @click="exportSchedule()"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2">
                    <i class="fas fa-file-excel"></i>
                    Export Excel
                </button>
            </div> -->
        </div>

        <div class="relative overflow-x-auto">
            <Vue3EasyDataTable ref="dataTable" :headers="headers" :items="scheduleList" :loading="loading"
                :server-options="serverOptions" :server-items-length="pagination.total"
                @update:server-options="onServerOptionsUpdate" :rows-per-page="serverOptions.rowsPerPage"
                :rows-items="[10, 25, 50]" :pagination="false" hide-footer class="bg-white shadow-md rounded-lg"
                empty-message="Tidak ada data Jadwal Tetap" border-cell server-side-sort :key="tableKey">
                <template #item-hari="item">
                    <div class="space-y-2">
                        <div v-for="(sessionGroup, index) in item.sessions" :key="index" class="py-1">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {{ formatHari(sessionGroup.hari) }}
                            </span>
                        </div>
                    </div>
                </template>

                <template #item-jam="item">
                    <div class="space-y-2">
                        <div v-for="(sessionGroup, index) in item.sessions" :key="index" class="py-1">
                            <span class="text-sm">
                                {{ sessionGroup.jam_mulai }} - {{ sessionGroup.jam_selesai }}
                            </span>
                        </div>
                    </div>
                </template>

                <template #item-ruang="item">
                    <span class="text-sm">
                        {{ item.ruang || "N/A" }}
                    </span>
                </template>

                <template #item-created_at="item">
                    <span class="text-sm text-gray-600">
                        {{ formatDate(item.created_at) }}
                    </span>
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import VueCookies from "vue-cookies";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const router = useRouter();
const toast = useToast();
const dataTable = ref(null);
const scheduleList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const debounceTimeout = ref(null);
const tableKey = ref(0);

const headers = [
    { text: "No", value: "no", sortable: true },
    { text: "Pemakaian", value: "pemakaian", sortable: true },
    { text: "Hari", value: "hari", sortable: true },
    { text: "Jam", value: "jam", sortable: false },
    { text: "Ruang", value: "ruang", sortable: true },
    { text: "Penanggung Jawab", value: "penanggung_jawab", sortable: true },
    { text: "Tanggal Dibuat", value: "created_at", sortable: true },
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
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

};

const fetchScheduleList = async () => {
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

        const response = await axios.get("/api/mahaiswa/fixed_schedule", {
            params,
        });

        if (response.data && response.data.data) {
            const dataArray = Array.isArray(response.data.data)
                ? response.data.data
                : Object.values(response.data.data);

            scheduleList.value = dataArray.map((item, index) => ({
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
            scheduleList.value = [];
            toast.error("Format data tidak valid");
        }
    } catch (error) {
        handleApiError(error, "Gagal memuat data Jadwal Tetap");
        scheduleList.value = [];
    } finally {
        loading.value = false;
    }
};

const onSearch = () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
        serverOptions.page = 1;
        fetchScheduleList();
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
    await fetchScheduleList();
};

const onRowsPerPageChange = () => {
    serverOptions.page = 1;
    fetchScheduleList();
};

const goToPreviousPage = () => {
    if (serverOptions.page > 1) {
        serverOptions.page--;
        fetchScheduleList();
    }
};

const goToNextPage = () => {
    if (serverOptions.page < pagination.last_page) {
        serverOptions.page++;
        fetchScheduleList();
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatHari = (hari) => {
    const hariMap = {
        1: "Senin",
        2: "Selasa",
        3: "Rabu",
        4: "Kamis",
        5: "Jumat",
        6: "Sabtu",
        7: "Minggu",
        monday: "Senin",
        tuesday: "Selasa",
        wednesday: "Rabu",
        thursday: "Kamis",
        friday: "Jumat",
        saturday: "Sabtu",
        sunday: "Minggu",
    };
    return hariMap[hari] || hari;
};

const handleApiError = (error, message) => {
    if (error.response?.status === 401) {
        toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        router.push("/login");
    } else {
        toast.error(error.response?.data?.message || message);
    }
};

// const exportSchedule = async () => {
//     try {
//         setupAxios();
//         const params = {
//             search: searchTerm.value,
//         };

//         if (serverOptions.sortBy && serverOptions.sortType) {
//             params.sort_by = serverOptions.sortBy;
//             params.sort_type = serverOptions.sortType;
//         }

//         const response = await axios.get("/api/mahasiswa/fixed_schedule/export", {
//             responseType: "blob",
//             params,
//         });

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         const today = new Date().toISOString().split("T")[0];

//         link.href = url;
//         link.setAttribute("download", jadwal_tetap_${ today }.xlsx);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         toast.success("Export berhasil");
//     } catch (error) {
//         handleApiError(error, "Gagal mengexport data Jadwal Tetap");
//     }
// };

onMounted(() => {
    fetchScheduleList();
});
</script>