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
                  <label for="judul" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="judul" 
                    v-model="form.judul" 
                    required
                  >
                </div>
                <div class="mb-4">
                  <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="category_id" 
                    v-model="form.category_id" 
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="nama_pelapor" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="nama_pelapor" 
                    v-model="form.nama_pelapor" 
                    required
                  >
                </div>
                <div class="mb-4">
                  <label for="kontak_pelapor" class="block text-sm font-medium text-gray-700 mb-1">Kontak Pelapor</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="kontak_pelapor" 
                    v-model="form.kontak_pelapor" 
                    required
                  >
                </div>
              </div>

              <!-- Right Column - 4 inputs -->
              <div>
                <div class="mb-4">
                  <label for="tanggal_kejadian" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Kejadian</label>
                  <input 
                    type="date" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="tanggal_kejadian" 
                    v-model="form.tanggal_kejadian" 
                    required
                  >
                </div>
                <div class="mb-4">
                  <label for="lokasi" class="block text-sm font-medium text-gray-700 mb-1">Lokasi Kejadian</label>
                  <input 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="lokasi" 
                    v-model="form.lokasi" 
                    required
                  >
                </div>
                <div class="mb-4">
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="status" 
                    v-model="form.status" 
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="process">Diproses</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="prioritas" class="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    id="prioritas" 
                    v-model="form.prioritas" 
                    required
                  >
                    <option value="">Pilih Prioritas</option>
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Full width fields -->
            <div class="mt-4">
              <div class="mb-4">
                <label for="lampiran" class="block text-sm font-medium text-gray-700 mb-1">Lampiran</label>
                <input 
                  type="file" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  id="lampiran" 
                  @change="handleFileUpload"
                >
              </div>
              <div class="mb-4">
                <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kejadian</label>
                <textarea 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  id="deskripsi" 
                  v-model="form.deskripsi" 
                  rows="5" 
                  required
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="$router.push('/pelaporan-kejadian')"
              >
                Batal
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AddPelaporanKejadian',
  components: {
    Sidebar,
    Header,
    Footer
  },
  setup() {
    const router = useRouter();
    
    // Form data
    const form = ref({
      judul: '',
      category_id: '',
      deskripsi: '',
      nomor_telepon: '',
      nomor_laporan: '',
      nama_pelapor: '',
      nim_pelapor: '',
      tanggal_kejadian: '',
      image: null,
      kontak_pelapor: '',
      waktu_kejadian: '',
      lokasi: '',
      status: '',
      prioritas: '',
      lampiran: null
    });
    
    const imagePreview = ref(null);
    const categories = ref([]);
    const loading = ref(false);
    const error = ref(null);
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        categories.value = response.data;
      } catch (err) {
        console.error('Error fetching categories:', err);
        error.value = 'Failed to load categories';
      }
    };
    
    // Handle file upload
    const previewImage = (event) => {
      const file = event.target.files[0];
      if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };
    
    // Handle file upload for lampiran
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        form.value.lampiran = file;
      }
    };
    
    // Submit form
    const submitForm = async () => {
      loading.value = true;
      try {
        const formData = new FormData();
        Object.keys(form.value).forEach(key => {
          formData.append(key, form.value[key]);
        });

        await axios.post('/api/pelaporan-kejadian', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        router.push('/pelaporan-kejadian');
      } catch (err) {
        console.error('Error submitting form:', err);
        error.value = 'Failed to submit form';
      } finally {
        loading.value = false;
      }
    };
    
    // Cancel form
    const cancelForm = () => {
      router.push('/pelaporan-kejadian');
    };
    
    // Fetch categories on created
    fetchCategories();
    
    return {
      form,
      imagePreview,
      categories,
      loading,
      error,
      previewImage,
      handleFileUpload,
      submitForm,
      cancelForm
    };
  }
}
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