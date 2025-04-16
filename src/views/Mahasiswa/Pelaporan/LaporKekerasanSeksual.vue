<template>
  <div>
    <HeaderLogin />
    <div class="container mx-auto px-4 py-8 mt-16">
      <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Laporan Kekerasan Seksual</h2>

        <form @submit.prevent="submitReport" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div>
              <!-- Judul/Nama Laporan -->
              <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                <input
                  type="text"
                  id="title"
                  v-model="report.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
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
                  v-model="report.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
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
                  v-model="report.reporterName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                <input
                  type="text"
                  id="nim"
                  v-model="report.nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="report.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal dan Waktu Kejadian</label>
                <input
                  type="datetime-local"
                  id="incidentDate"
                  v-model="report.incidentDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <!-- Tombol Kirim -->
              <div class="mt-6">
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-[#E53935] text-white rounded-md hover:bg-red-700 transition duration-300 font-medium"
                >
                  Kirim Laporan
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import HeaderLogin from '../../../components/HeaderLogin.vue';
import Footer from '../../../components/Footer.vue';

export default {
  name: 'LaporKekerasanSeksual',
  components: {
    Header,
    Footer
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
      isSubmitting: false
    };
  },

  mounted() {
    this.fetchCategories();
  },

  methods: {
    fetchCategories() {
      axios.get('http://localhost:8000/api/category')
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
      this.report.evidenceFile = event.target.files[0];
    },
    
    async submitReport() {
      try {
        // Basic validation
        if (!this.report.title || !this.report.category || !this.report.description) {
          alert('Please fill in all required fields');
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
        
        if (this.report.evidenceFile) {
          formData.append('image_path', this.report.evidenceFile);
        }
        
        // Show loading state
        this.isSubmitting = true;
        
        // Submit the data to the API
        const response = await axios.post('http://localhost:8000/api/laporan_kekerasan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Handle success
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Report submitted successfully',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.resetForm();
        
      } catch (error) {
        // Handle error
        console.error('Error submitting report:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit report. Please try again.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category.nama.startsWith('Kekerasan')
      );
    }
  }
};
</script>

<style scoped>
/* Custom styling */
</style>