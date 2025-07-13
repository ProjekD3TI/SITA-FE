<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Booking Ruang</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">Informasi Booking</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Ruang</label>
            <select v-model="formData.id_ruang"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">Pilih Ruang</option>
              <option v-for="ruang in ruangList" :key="ruang.id_ruang" :value="ruang.id_ruang">
                {{ ruang.display_name || `${ruang.nama_ruang} -- ${ruang.gedung?.nama_gedung || 'N/A'} --
                ${ruang.gedung?.lantai?.nama_lantai || 'N/A'}` }}
              </option>
            </select>
            <p v-if="errors.id_ruang" class="text-sm text-red-500">{{ errors.id_ruang[0] }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tanggal</label>
            <input v-model="formData.date" type="date" :min="minDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="errors.date" class="text-sm text-red-500">{{ errors.date[0] }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sesi Mulai</label>
            <select v-model="formData.start_session" @change="onStartSessionChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Sesi Mulai</option>
              <option v-for="session in sessionList" :key="session.id" :value="session.id">
                {{ session.name_session }} ({{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }})
              </option>
            </select>
            <p v-if="errors.start_session" class="text-sm text-red-500">{{ errors.start_session[0] }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sesi Selesai</label>
            <select v-model="formData.end_session"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Sesi Selesai</option>
              <option v-for="session in availableEndSessions" :key="session.id" :value="session.id">
                {{ session.name_session }} ({{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }})
              </option>
            </select>
            <p v-if="errors.end_session" class="text-sm text-red-500">{{ errors.end_session[0] }}</p>
          </div>
        </div>

        <div class="space-y-2 mt-4">
          <label class="text-sm font-medium text-gray-700">Keterangan</label>
          <textarea v-model="formData.keterangan" rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan keterangan atau tujuan penggunaan ruang"></textarea>
          <p v-if="errors.keterangan" class="text-sm text-red-500">{{ errors.keterangan[0] }}</p>
        </div>

        <div class="space-y-2 mt-4">
          <label class="text-sm font-medium text-gray-700">File Pendukung </label>
          <input type="file" @change="onFileChange" accept=".pdf,.jpg,.jpeg,.png"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p class="text-xs text-gray-500">Format: PDF, JPG, JPEG, PNG. Maksimal 5MB</p>
          <p v-if="errors.files" class="text-sm text-red-500">{{ errors.files[0] }}</p>
        </div>
      </div>

      <!-- Preview Booking -->
      <div v-if="formData.start_session && formData.end_session"
        class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 class="font-medium text-blue-900 mb-2">Preview Booking</h4>
        <div class="text-sm text-blue-800">
          <p><strong>Ruang:</strong> {{ getSelectedRoomName() }}</p>
          <p><strong>Tanggal:</strong> {{ formatDate(formData.date) }}</p>
          <p><strong>Waktu:</strong> {{ getBookingTimeRange() }}</p>
          <p><strong>Durasi:</strong> {{ getBookingDuration() }}</p>
        </div>
      </div>

      <div class="flex space-x-2">
        <button type="submit" :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? "Memproses..." : "Submit Booking" }}
        </button>
        <button type="button" @click="resetForm"
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  import { useToast } from "vue-toastification";
  import VueCookies from "vue-cookies";
  
  const router = useRouter();
  const toast = useToast();
  const isSubmitting = ref(false);
  const ruangList = ref([]);
  const sessionList = ref([]);
  const selectedFile = ref(null);
  
  const formData = reactive({
    id_ruang: "",
    date: "",
    start_session: "",
    end_session: "",
    keterangan: "",
  });
  
  const errors = reactive({});
  
  const minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const availableEndSessions = computed(() => {
    if (!formData.start_session) return [];
    
    const startIndex = sessionList.value.findIndex(s => s.id == formData.start_session);
    if (startIndex === -1) return [];
    
    return sessionList.value.slice(startIndex);
  });
  
  const setupAxios = () => {
    const token = VueCookies.get("auth_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };
  
  const fetchRuang = async () => {
    try {
      setupAxios();
      const response = await axios.get("/api/mahasiswa/ruang");
      if (response.data && response.data.data) {
        ruangList.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching ruang:", error);
      toast.error("Gagal memuat data ruang");
    }
  };
  
  const fetchSessions = async () => {
    try {
      setupAxios();
      const response = await axios.get("/api/mahasiswa/session", {
        params: {
          all: 'true'
        }
      });
      if (response.data && response.data.data) {
        sessionList.value = response.data.data.sort((a, b) =>
          a.start_time.localeCompare(b.start_time)
        );
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Gagal memuat data sesi");
    }
  };

  
  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const getSelectedRoomName = () => {
    const room = ruangList.value.find(r => r.id_ruang == formData.id_ruang);
    return room ? room.nama_ruang : "";
  };
  
  const getBookingTimeRange = () => {
    const startSession = sessionList.value.find(s => s.id == formData.start_session);
    const endSession = sessionList.value.find(s => s.id == formData.end_session);
    
    if (!startSession || !endSession) return "";
    
    return `${formatTime(startSession.start_time)} - ${formatTime(endSession.end_time)}`;
  };
  
  const getBookingDuration = () => {
    const startSession = sessionList.value.find(s => s.id == formData.start_session);
    const endSession = sessionList.value.find(s => s.id == formData.end_session);
    
    if (!startSession || !endSession) return "";
    
    const startTime = new Date(`2000-01-01 ${startSession.start_time}`);
    const endTime = new Date(`2000-01-01 ${endSession.end_time}`);
    const diffMs = endTime - startTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours} jam ${diffMinutes} menit`;
  };
  
  const onRoomChange = () => {
    // Reset sessions when room changes
    formData.start_session = "";
    formData.end_session = "";
  };
  
  const onStartSessionChange = () => {
    // Reset end session when start session changes
    formData.end_session = "";
  };
  
  const onFileChange = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = "";
    });
    selectedFile.value = null;
    Object.keys(errors).forEach(key => delete errors[key]);
  };
  
  const handleSubmit = async () => {
    try {
      isSubmitting.value = true;
      setupAxios();
  
      Object.keys(errors).forEach(key => delete errors[key]);
  
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
  
      if (selectedFile.value) {
        submitData.append('files', selectedFile.value);
      }
  
      const response = await axios.post("/api/mahasiswa/booking/create", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      toast.success(response.data.message || "Booking berhasil dibuat");
      router.push("/mahasiswa/pinjam");
    } catch (error) {
      if (error.response?.status === 422) {
        if (error.response.data.errors) {
          Object.assign(errors, error.response.data.errors);
        }
        toast.error(error.response.data.message || "Validasi gagal");
      } else if (error.response?.status === 401) {
        toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        router.push("/login");
      } else {
        toast.error(error.response?.data?.message || "Gagal membuat booking");
      }
    } finally {
      isSubmitting.value = false;
    }
  };
  
  onMounted(() => {
    fetchRuang();
    fetchSessions();
  });
  </script>
  