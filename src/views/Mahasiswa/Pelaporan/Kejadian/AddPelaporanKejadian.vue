<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="p-4">
        <div class="bg-white shadow rounded-lg p-6 mb-4">
          <h1 class="text-2xl font-semibold text-gray-800">Tambah Laporan Kejadian</h1>
          <p class="text-gray-600 mt-2">Silakan isi formulir berikut untuk menambahkan laporan kejadian baru.</p>
        </div>
        
        <!-- Form Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column - 4 inputs -->
              <div>
                <div class="mb-4">
                  <label for="judul" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    :class="{ 'border-red-500': errors.judul }"
                    id="judul" 
                    v-model="form.judul" 
                    required
                  >
                  <div v-if="errors.judul" class="text-red-500 text-sm mt-1">{{ errors.judul[0] }}</div>
                </div>
                <div class="mb-4">
                  <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">Kategori <span class="text-red-500">*</span></label>
                  <select 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    :class="{ 'border-red-500': errors.category_id }"
                    id="category_id" 
                    v-model="form.category_id" 
                    required
                  >
                    <option value="" disabled selected>Pilih Kategori</option>
                    <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
                      {{ category.nama }}
                    </option>
                  </select>
                  <div v-if="errors.category_id" class="text-red-500 text-sm mt-1">{{ errors.category_id[0] }}</div>
                </div>
                <div class="mb-4">
                  <label for="lampiran" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                  <input 
                    type="file" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    :class="{ 'border-red-500': errors.image_path }"
                    id="lampiran" 
                    accept="image/*"
                    @change="handleFileUpload"
                    required
                  >
                  <div v-if="errors.image_path" class="text-red-500 text-sm mt-1">{{ errors.image_path[0] }}</div>
                  <div v-if="imagePreview" class="mt-2">
                    <img :src="imagePreview" alt="Preview" class="max-h-48 rounded-md">
                  </div>
                </div>
                <div class="mb-4">
                  <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kejadian <span class="text-red-500">*</span></label>
                  <textarea 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    :class="{ 'border-red-500': errors.deskripsi }"
                    id="deskripsi" 
                    v-model="form.deskripsi" 
                    rows="5" 
                    required
                  ></textarea>
                  <div v-if="errors.deskripsi" class="text-red-500 text-sm mt-1">{{ errors.deskripsi[0] }}</div>
                </div>
                <div class="mb-4">
                  <label for="tanggal_kejadian" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Kejadian <span class="text-red-500">*</span></label>
                  <input 
                    type="datetime-local" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    :class="{ 'border-red-500': errors.tanggal_kejadian }"
                    id="tanggal_kejadian" 
                    v-model="form.tanggal_kejadian" 
                    required
                  >
                  <div v-if="errors.tanggal_kejadian" class="text-red-500 text-sm mt-1">{{ errors.tanggal_kejadian[0] }}</div>
                </div>
              </div>

              <!-- Right Column - 4 inputs -->
              <div>
                <div class="mb-4">
                  <label for="nama_pelapor" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                    id="nama_pelapor" 
                    v-model="form.nama_pelapor" 
                    disabled
                  >
                </div>
                <div class="mb-4">
                  <label for="nim_pelapor" class="block text-sm font-medium text-gray-700 mb-1">NIM/NIK Pelapor</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                    id="nim_pelapor" 
                    v-model="form.nim_pelapor" 
                    disabled
                  >
                </div>
                <div class="mb-4">
                  <label for="nomor_telepon" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                    id="nomor_telepon" 
                    v-model="form.nomor_telepon" 
                    disabled
                  >
                </div>
              </div>
            </div>

            <!-- Full width fields -->
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="goBack"
              >
                Kembali
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="loading"
              >
                <span v-if="loading">Mengirim...</span>
                <span v-else>Kirim Laporan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" :class="{ 'text-green-600': isSuccess, 'text-red-600': !isSuccess }">
                  {{ modalTitle }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ modalMessage }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { decryptData } from '../../../../services/encrypt';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2';

export default {
  name: 'AddPelaporanKejadian',
  components: {
    Sidebar,
    Header,
    Footer
  },
  data() {
    return {
      form: {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: null,
        nama_pelapor: '',
        nim_pelapor: '',
        nomor_telepon: ''
      },
      imagePreview: null,
      categories: [],
      errors: {},
      loading: false,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      isSuccess: false
    };
  },
  mounted() {
    this.fetchCategories();
    this.loadUserData();
  },
  computed: {
    filteredCategories() {
      // Filter out categories that start with "Kekerasan" if needed
      return this.categories.filter(category => 
        !category.nama.startsWith('Kekerasan')
      );
    }
  },
  methods: {
    loadUserData() {
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        this.form.nama_pelapor = userData.name || '';
        this.form.nim_pelapor = userData.nim || userData.nik || '';
        this.form.nomor_telepon = userData.no_telp || '';
      }
    },
    fetchCategories() {
      axios.get('http://localhost:8000/api/category')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
        });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.imagePreview = null;
        this.form.image_path = null;
        return;
      }

      this.form.image_path = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    submitForm() {
      this.loading = true;
      this.errors = {};
      
      const formData = new FormData();
      formData.append('judul', this.formData.judul);
      formData.append('category_id', this.formData.category_id);
      formData.append('deskripsi', this.formData.deskripsi);
      formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
      formData.append('image_path', this.formData.image_path);

      axios.post('http://localhost:8000/api/laporan/add_laporan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          this.loading = false;
          Swal.fire({
            title: 'Berhasil!',
            text: 'Laporan berhasil ditambahkan.',
            icon: 'success',
            timer: 2000,                // Auto-close after 2 seconds (2000ms)
            timerProgressBar: true,     // Show a progress bar counting down
            showConfirmButton: false    // Hide the confirmation button
          }).then(() => {
            // After the timer finishes or alert is closed
            this.$router.push('/kalab/pelaporankejadiankalab');
          });
          this.resetForm();
        })
        .catch(error => {
          this.loading = false;
          if (error.response && error.response.status === 400) {
            this.errors = error.response.data;
          } else {
            this.showNotification('Error', 'Terjadi kesalahan saat mengirim laporan.', false);
          }
        });
    },
    resetForm() {
      this.form = {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: null,
        nama_pelapor: this.form.nama_pelapor,
        nim_pelapor: this.form.nim_pelapor,
        nomor_telepon: this.form.nomor_telepon
      };
      this.imagePreview = null;
      this.errors = {};
    },
    goBack() {
      this.$router.go(-1);
    },
    showNotification(title, message, isSuccess) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.isSuccess = isSuccess;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      if (this.isSuccess) {
        this.$router.push('/pelaporan/kejadian');
      }
    }
  }
};
</script>

<style scoped>
/* Adding focused styles for form elements */
input:focus, select:focus, textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  outline: none;
}

/* Style for disabled inputs */
input:disabled, select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Required field indicator */
.text-red-500 {
  color: #ef4444;
}

/* Button hover effects */
button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Image preview */
.image-preview img {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  max-height: 12rem;
  object-fit: contain;
}
</style>