<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Daftar Booking Ruang</h2>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <input v-model="searchTerm" type="text" placeholder="Cari booking..."
                class="px-3 py-2 border rounded-md w-full md:w-64" @input="onSearch" />

            <div class="flex space-x-2">
                <select v-model="statusFilter" @change="onFilterChange" class="px-3 py-2 border rounded-md">
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <Vue3EasyDataTable ref="dataTable" :headers="headers" :items="bookingList" :loading="loading"
                :server-options="serverOptions" :server-items-length="pagination.total"
                @update:options="onOptionsUpdate" :rows-per-page="serverOptions.rowsPerPage" :rows-items="[10, 25, 50]"
                :pagination="false" hide-footer empty-message="Tidak ada data booking" border-cell>

                <template #item-status="item">
                    <span :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                    ]">
                        {{ formatStatus(item.status) }}
                    </span>
                </template>

                <template #item-date="item">
                    {{ formatDate(item.date) }}
                </template>

                <template #item-time_range="item">
                    {{ getTimeRange(item) }}
                </template>

                <template #item-actions="item">
                    <div class="flex space-x-1">
                        <button @click="viewDetail(item)" class="text-blue-500 hover:text-blue-700 p-1" title="Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button v-if="item.status === 'pending'" @click="approveBooking(item)"
                            class="text-green-500 hover:text-green-700 p-1" title="Setujui">
                            <i class="fas fa-check"></i>
                        </button>
                        <button v-if="item.status === 'pending'" @click="rejectBooking(item)"
                            class="text-red-500 hover:text-red-700 p-1" title="Tolak">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </template>
            </Vue3EasyDataTable>
        </div>

        <!-- Pagination -->
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
                {{ pagination.total > 0 ? (pagination.current_page - 1) * pagination.per_page + 1 : 0 }}-{{
    Math.min(pagination.current_page * pagination.per_page, pagination.total)
}} of {{ pagination.total }}
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

        <!-- Detail Modal -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Detail Booking</h3>
                    <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div v-if="selectedBooking" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-600">Ruang</label>
                            <p class="text-gray-900">{{ selectedBooking.nama_ruang }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Status</label>
                            <p>
                                <span :class="[
                                    'px-2 py-1 rounded text-xs font-medium',
                                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        selectedBooking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                ]">
                                    {{ formatStatus(selectedBooking.status) }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Tanggal</label>
                            <p class="text-gray-900">{{ formatDate(selectedBooking.date) }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Waktu</label>
                            <p class="text-gray-900">{{ getTimeRange(selectedBooking) }}</p>
                        </div>
                    </div>

                    <div v-if="selectedBooking.keterangan">
                        <label class="text-sm font-medium text-gray-600">Keterangan</label>
                        <p class="text-gray-900">{{ selectedBooking.keterangan }}</p>
                    </div>
                    <div v-if="selectedBooking.keterangan">
                        <label class="text-sm font-medium text-gray-600">File</label>
                        <div class="mt-2">
                            <!-- Gambar preview -->
                            <img :src="getFileUrl(selectedBooking.files)" alt="Gambar Booking"
                                class="max-w-xs border rounded shadow mb-2" />

                            <!-- Link untuk buka file -->
                            <p>
                                <a :href="getFileUrl(selectedBooking.files)" target="_blank"
                                    class="text-blue-600 underline">
                                    Lihat file
                                </a>
                            </p>
                        </div>
                    </div>

                    <div v-if="selectedBooking.approved_by">
                        <label class="text-sm font-medium text-gray-600">Disetujui oleh</label>
                        <p class="text-gray-900">{{ selectedBooking.approved_by }}</p>
                    </div>

                    <div v-if="selectedBooking.notes">
                        <label class="text-sm font-medium text-gray-600">Catatan</label>
                        <p class="text-gray-900">{{ selectedBooking.notes }}</p>
                    </div>


                    <div v-if="selectedBooking.status === 'pending'" class="flex space-x-2 pt-4 border-t">
                        <button @click="approveBooking(selectedBooking)"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            <i class="fas fa-check mr-2"></i>
                            Setujui
                        </button>
                        <button @click="rejectBooking(selectedBooking)"
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            <i class="fas fa-times mr-2"></i>
                            Tolak
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Approval Modal -->
        <div v-if="showApprovalModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-medium mb-4">
                    {{ approvalAction === 'approved' ? 'Setujui' : 'Tolak' }} Booking
                </h3>

                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Catatan (Opsional)</label>
                        <textarea v-model="approvalNotes" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="approvalAction === 'approved' ? 'Catatan persetujuan...' : 'Alasan penolakan...'"></textarea>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 mt-6">
                    <button @click="showApprovalModal = false"
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Batal
                    </button>
                    <button @click="submitApproval" :disabled="isSubmitting" :class="[
                        'px-4 py-2 text-white rounded-md disabled:opacity-50',
                        approvalAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    ]">
                        {{ isSubmitting ? 'Memproses...' : (approvalAction === 'approved' ? 'Setujui' : 'Tolak') }}
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
const bookingList = ref([]);
const loading = ref(false);
const searchTerm = ref("");
const statusFilter = ref("");
const debounceTimeout = ref(null);
const showDetailModal = ref(false);
const showApprovalModal = ref(false);
const selectedBooking = ref(null);
const approvalAction = ref("");
const approvalNotes = ref("");
const isSubmitting = ref(false);

const headers = [
    { text: "No", value: "no" },
    { text: "Ruang", value: "nama_ruang" },
    { text: "Tanggal", value: "date" },
    { text: "Waktu", value: "time_range" },
    { text: "Status", value: "status" },
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

const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const fetchBookingList = async () => {
    try {
        loading.value = true;
        setupAxios();

        const params = {
            page: serverOptions.page,
            per_page: serverOptions.rowsPerPage,
            ...(searchTerm.value && { search: searchTerm.value }),
            ...(statusFilter.value && { status: statusFilter.value }),
        };

        // Menggunakan endpoint yang sama dengan filter status
        const response = await axios.get("/api/kalab/booking", { params });

        if (response.data && response.data.data) {
            const dataArray = Array.isArray(response.data.data)
                ? response.data.data
                : Object.values(response.data.data);

            bookingList.value = dataArray.map((item, index) => ({
                ...item,
                no: (serverOptions.page - 1) * serverOptions.rowsPerPage + index + 1,
            }));

            Object.assign(pagination, {
                current_page: response.data.pagination?.current_page || 1,
                per_page: response.data.pagination?.per_page || 10,
                total: response.data.pagination?.total || 0,
                last_page: response.data.pagination?.last_page || 1,
            });
        }
    } catch (error) {
        handleApiError(error, "Gagal memuat data booking");
    } finally {
        loading.value = false;
    }
};

const formatStatus = (status) => {
    const statusMap = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
    };
    return statusMap[status] || status;
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getTimeRange = (booking) => {
    return `Sesi ${booking.start_session} - ${booking.end_session}`;
};

const getFileUrl = (filename) => {
    if (!filename) return "#";
    return `${import.meta.env.VITE_API_BASE_URL}/storage/booking/${filename}`;
};

const viewDetail = (booking) => {
    selectedBooking.value = booking;
    showDetailModal.value = true;
};

const approveBooking = (booking) => {
    selectedBooking.value = booking;
    approvalAction.value = "approved";
    approvalNotes.value = "";
    showDetailModal.value = false;
    showApprovalModal.value = true;
};

const rejectBooking = (booking) => {
    selectedBooking.value = booking;
    approvalAction.value = "rejected";
    approvalNotes.value = "";
    showDetailModal.value = false;
    showApprovalModal.value = true;
};

const submitApproval = async () => {
    try {
        isSubmitting.value = true;
        setupAxios();

        const data = {
            status: approvalAction.value,
            notes: approvalNotes.value
        };

        const response = await axios.put(`/api/kalab/booking/approve/${selectedBooking.value.id}`, data);

        toast.success(response.data.message || "Booking berhasil diperbarui");
        showApprovalModal.value = false;
        fetchBookingList();
    } catch (error) {
        handleApiError(error, "Gagal memperbarui booking");
    } finally {
        isSubmitting.value = false;
    }
};

const onSearch = () => {
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
        serverOptions.page = 1;
        fetchBookingList();
    }, 300);
};

const onFilterChange = () => {
    serverOptions.page = 1;
    fetchBookingList();
};

const onOptionsUpdate = async (options) => {
    serverOptions.page = options.page || 1;
    serverOptions.rowsPerPage = options.rowsPerPage || 10;
    await fetchBookingList();
};

const onRowsPerPageChange = () => {
    serverOptions.page = 1;
    fetchBookingList();
};

const goToPreviousPage = () => {
    if (serverOptions.page > 1) {
        serverOptions.page--;
        fetchBookingList();
    }
};

const goToNextPage = () => {
    if (serverOptions.page < pagination.last_page) {
        serverOptions.page++;
        fetchBookingList();
    }
};

const handleApiError = (error, message) => {
    console.error(`${message}:`, error);
    if (error.response?.status === 401) {
        toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        router.push("/login");
    } else {
        toast.error(error.response?.data?.message || message);
    }
};

onMounted(() => {
    fetchBookingList();
});
</script>
