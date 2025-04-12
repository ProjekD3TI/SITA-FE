<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="p-4">
        <div class="bg-white shadow rounded-lg p-6 mb-4">
          <h1 class="text-2xl font-semibold text-gray-800">Tambah Laporan Kekerasan Seksual</h1>
          <p class="text-gray-600 mt-2">Silakan isi formulir berikut untuk menambahkan laporan kekerasan seksual baru.</p>
        </div>
        
        <!-- Form Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="submitReport" class="space-y-6" name="reportForm" id="reportForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div>
                <!-- Judul/Nama Laporan -->
                <div class="mb-4">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    v-model="report.title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    autocomplete="off"
                    required
                  />
                </div>

                <!-- Kategori -->
                <div class="mb-4">
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <div class="relative">
                    <select 
                      v-model="report.category" 
                      id="category"
                      name="category"
                      class="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm"
                      required
                    >
                      <option value="" disabled>Pilih Kategori</option>
                      <option v-for="category in filteredCategories" :key="category.category_id" :value="category.category_id">
                        {{ category.nama }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Bukti Laporan (File Input) -->
                <div class="mb-4">
                  <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Bukti Laporan (Foto)</label>
                  <input
                    type="file"
                    id="evidence"
                    name="evidence"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Format yang didukung: JPG, PNG, JPEG (max 5MB)</p>
                </div>

                <!-- Deskripsi Laporan -->
                <div class="mb-4">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Laporan</label>
                  <textarea
                    id="description"
                    name="description"
                    v-model="report.description"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    autocomplete="off"
                    required
                  ></textarea>
                </div>
              </div>

              <!-- Right Column -->
              <div>
                <!-- Informasi Pelapor -->
                <div class="mb-4">
                  <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                  <input
                    type="text"
                    id="reporterName"
                    name="reporterName"
                    v-model="report.reporterName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    autocomplete="name"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                  <input
                    type="text"
                    id="nim"
                    name="nim"
                    v-model="report.nim"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    autocomplete="off"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    v-model="report.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    autocomplete="tel"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal dan Waktu Kejadian</label>
                  <input
                    type="datetime-local"
                    id="incidentDate"
                    name="incidentDate"
                    v-model="report.incidentDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                id="cancelButton"
                name="cancelButton"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="$router.push('/pelaporan-kejadian')"
              >
                Batal
              </button>
              <button 
                type="submit" 
                id="submitButton"
                name="submitButton"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              >
                Simpan Laporan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AddKekerasanSeksual',
  components: {
    Sidebar,
    Header
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      report: {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFile: null
      },
      categories: [],
      isSubmitting: false,
      currentUser: 'miftahul01',
      formattedDateTime: ''
    };
  },

  created() {
    // Set initial date/time with the required format
    this.updateDateTime();
    // Update time every minute
    this.timerInterval = setInterval(this.updateDateTime, 60000);
  },

  beforeUnmount() {
    // Clear interval when component is destroyed
    clearInterval(this.timerInterval);
  },

  mounted() {
    this.fetchCategories();
    this.loadUserData();
  },

  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      // Format as "YYYY-MM-DD HH:MM:SS"
      this.formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    
    fetchCategories() {
      axios.get('http://localhost:8000/api/category', {
        // Add these headers to help prevent CORB issues
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => {
          // Check if response.data is an array directly
          if (Array.isArray(response.data)) {
            this.categories = response.data;
          } 
          // Otherwise check if it has a data property containing the array (as originally expected)
          else if (response.data && response.data.data) {
            this.categories = response.data.data;
          } 
          // Handle unexpected formats
          else {
            console.error('Unexpected API response structure:', response.data);
            this.categories = [];
          }
          console.log('Categories loaded:', this.categories);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          // If you have a notification system
          // this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
        });
    },
    
    resetForm() {
      this.report = {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFile: null
      };
      // Reset file input if you have one
      const fileInput = document.getElementById('evidence');
      if (fileInput) fileInput.value = '';
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: 'error',
            title: 'File Terlalu Besar',
            text: 'Ukuran file maksimal adalah 5MB',
            confirmButtonColor: '#3085d6',
          });
          event.target.value = ''; // Clear the file input
          return;
        }
        
        this.report.evidenceFile = file;
      }
    },
    
    async submitReport() {
      try {
        // Basic validation
        if (!this.report.title || !this.report.category || !this.report.description) {
          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: 'Mohon isi semua field yang diperlukan',
            confirmButtonColor: '#3085d6',
          });
          return;
        }
        
        // Create FormData object to handle file upload
        const formData = new FormData();
        formData.append('judul', this.report.title);
        formData.append('category_id', this.report.category);
        formData.append('deskripsi', this.report.description);
        formData.append('nama_pelapor', this.report.reporterName);
        formData.append('nim_pelapor', this.report.nim);
        formData.append('nomor_telepon', this.report.phone);
        formData.append('tanggal_kejadian', this.report.incidentDate);
        formData.append('current_datetime', this.formattedDateTime);
        formData.append('username', this.currentUser);
        
        if (this.report.evidenceFile) {
          formData.append('image_path', this.report.evidenceFile);
        }
        
        // Show loading state
        this.isSubmitting = true;
        
        // Submit the data to the API
        const response = await axios.post('http://localhost:8000/api/laporan_kekerasan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        
        // Handle success
        Swal.fire({
          icon: 'success',
          title: 'Sukses!',
          text: 'Laporan berhasil dikirim',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.resetForm();
        this.$router.push('/kekerasan-seksual');
        
      } catch (error) {
        // Handle error
        console.error('Error submitting report:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Gagal mengirim laporan. Silakan coba lagi.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    loadUserData() {
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        try {
          const userData = decryptData(encryptedUserData);
          this.report.reporterName = userData.name || '';
          this.report.nim = userData.nim || userData.nik || '';
          this.report.phone = userData.no_telp || '';
          
          // Update current user display if available
          if (userData.username) {
            this.currentUser = userData.username;
          }
        } catch (error) {
          console.error('Error decrypting user data:', error);
        }
      }
    }
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category.nama && category.nama.startsWith('Kekerasan')
      );
    }
  }
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  margin-right: 10px;
}
</style>