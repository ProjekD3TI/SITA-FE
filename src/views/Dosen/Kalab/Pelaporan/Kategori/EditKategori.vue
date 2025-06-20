<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Edit Kategori</h1>
      
      <div v-if="loading" class="flex justify-center my-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <span>{{ errorMessage }}</span>
      </div>
      
      <form v-if="!loading" @submit.prevent="handleSubmit" class="bg-white p-6 rounded shadow-md">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nama Kategori</label>
          <input 
            v-model="kategori.nama" 
            type="text" 
            class="w-full border p-2 rounded" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Gambar Kategori</label>
          <div class="mb-4">
            <!-- Current image display -->
            <div v-if="kategori.image_path && !newImageSelected" class="mb-2">
              <p class="text-sm text-gray-600 mb-1">Gambar Saat Ini:</p>
              <img 
                :src="getCurrentImageUrl()" 
                alt="Category Image" 
                class="h-32 w-32 object-cover border rounded"
                @error="handleImageError"
              />
            </div>
            
            <!-- New image preview -->
            <div v-if="imagePreview" class="mb-2">
              <p class="text-sm text-gray-600 mb-1">Gambar Baru:</p>
              <img 
                :src="imagePreview" 
                alt="New Category Image" 
                class="h-32 w-32 object-cover border rounded"
              />
            </div>
          </div>
          
          <input 
            type="file" 
            @change="handleImageChange" 
            accept="image/jpeg,image/png,image/jpg"
            class="w-full border p-2 rounded"
          />
          <p class="text-sm text-gray-500 mt-1">Format: JPG, JPEG, PNG. Maks: 2MB</p>
        </div>
        
        <div class="flex">
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="loading"
          >
            <span v-if="isSubmitting" class="inline-block animate-spin mr-2">⟳</span>
            Update Kategori
          </button>
          <button 
            type="button" 
            @click="goBack" 
            class="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      kategori: {
        nama: '',
        image_path: ''
      },
      categoryId: null,
      loading: true,
      isSubmitting: false,
      errorMessage: '',
      newImage: null,
      newImageSelected: false,
      imagePreview: null,
      apiBaseUrl: 'http://pelaporan-d3ti.my.id',
      imageUrls: [
        // Primary URL format
        '/Backend-Port/backend/engine/public/storage/category/',
        // Alternative URL format
        '/public/storage/category/'
      ]
    };
  },
  mounted() {
    console.log("Component mounted");
    this.parseAndSetCategoryData();

    // Add a global unhandled error handler to catch any errors
    window.addEventListener('error', this.handleGlobalError);
  },
  beforeDestroy() {
    window.removeEventListener('error', this.handleGlobalError);
  },
  methods: {
    // Get cookie by name (for auth token)
    getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },
    
    // Get auth token
    getAuthToken() {
      // Try cookie first (where we found it working)
      const encodedToken = this.getCookie('auth_token');
      if (encodedToken) {
        return decodeURIComponent(encodedToken);
      }
      
      // Fallback to localStorage
      return localStorage.getItem('auth_token');
    },
    
    handleGlobalError(event) {
      console.error("Global error caught:", event.error);
    },
    
    parseAndSetCategoryData() {
      console.log("Route query:", this.$route.query);
      
      // First try to get ID from route params
      this.categoryId = this.$route.params.id;
      console.log("ID from route params:", this.categoryId);
      
      if (this.$route.query.data) {
        try {
          const categoryData = JSON.parse(this.$route.query.data);
          console.log("Successfully parsed category data:", categoryData);
          
          // Set or update ID from parsed data
          if (!this.categoryId) {
            this.categoryId = categoryData.category_id;
          }
          console.log("Set categoryId to:", this.categoryId);
          
          // Set form data
          this.kategori.nama = categoryData.nama || '';
          this.kategori.image_path = categoryData.image_path || '';
          
          this.loading = false;
        } catch (error) {
          console.error("Error parsing category data:", error);
          this.errorMessage = "Invalid category data format";
          this.loading = false;
          
          // If parsing fails but we have an ID, try to fetch the data
          if (this.categoryId) {
            this.fetchCategoryData(this.categoryId);
          }
        }
      } else if (this.categoryId) {
        // No query data but we have ID, fetch the data
        this.fetchCategoryData(this.categoryId);
      } else {
        console.error("No category ID or data found");
        this.errorMessage = "Category data not found";
        this.loading = false;
      }
    },
    
    fetchCategoryData(id) {
      console.log("Fetching category data for ID:", id);
      
      axios.get(`${this.apiBaseUrl}/api/category/${id}`)
        .then(response => {
          console.log("Category data fetched:", response.data);
          
          if (response.data) {
            this.kategori.nama = response.data.nama || '';
            this.kategori.image_path = response.data.image_path || '';
          } else {
            this.errorMessage = "Kategori tidak ditemukan";
          }
        })
        .catch(error => {
          console.error("Error fetching category:", error);
          this.errorMessage = "Gagal mengambil data kategori";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    getCurrentImageUrl() {
      if (!this.kategori.image_path) return null;
      
      // Return the primary URL format
      return `${this.apiBaseUrl}${this.imageUrls[0]}${this.kategori.image_path}`;
    },
    
    handleImageError(event) {
      // If the primary URL format fails, try the alternative
      const img = event.target;
      const currentSrc = img.src;
      
      if (currentSrc.includes(this.imageUrls[0])) {
        // Switch to alternative URL format
        img.src = `${this.apiBaseUrl}${this.imageUrls[1]}${this.kategori.image_path}`;
      } else {
        // Use placeholder if both fail
        img.src = 'https://via.placeholder.com/150?text=No+Image';
      }
    },
    
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          this.errorMessage = "Format file harus JPG, JPEG, atau PNG";
          return;
        }
        
        // Validate file size (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          this.errorMessage = "Ukuran file tidak boleh melebihi 2MB";
          return;
        }
        
        this.newImage = file;
        this.newImageSelected = true;
        this.errorMessage = '';
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.newImage = null;
        this.newImageSelected = false;
        this.imagePreview = null;
      }
    },
    
    handleSubmit() {
      try {
        console.log("Submit triggered");
        
        if (!this.kategori.nama) {
          this.errorMessage = "Nama kategori tidak boleh kosong";
          return;
        }
        
        if (!this.categoryId) {
          this.errorMessage = "ID kategori tidak ditemukan";
          return;
        }
        
        this.isSubmitting = true;
        this.errorMessage = '';
        
        const formData = new FormData();
        formData.append('nama', this.kategori.nama);
        formData.append('_method', 'PUT'); // For Laravel's form method spoofing
        
        if (this.newImage) {
          formData.append('image_path', this.newImage);
        }
        
        // Get token from cookie (correctly decoded) or localStorage
        const token = this.getAuthToken();
        
        if (!token) {
          this.errorMessage = "Token autentikasi tidak ditemukan";
          this.isSubmitting = false;
          return;
        }
        
        // Use XMLHttpRequest for better control
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.apiBaseUrl}/api/category/update/${this.categoryId}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        // Don't set Content-Type for FormData, browser will handle it
        
        xhr.onload = () => {
          this.isSubmitting = false;
          
          if (xhr.status >= 200 && xhr.status < 300) {
            // Success
            console.log("Update successful:", xhr.responseText);
            
            // Use SweetAlert for success message
            Swal.fire({
              title: 'Success!',
              text: 'Kategori berhasil diperbarui',
              icon: 'success',
              confirmButtonText: 'OK',
              position: 'top-end',
              toast: true,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              this.goBack();
            });
          } else {
            // Error
            console.error('Error response:', xhr.status, xhr.responseText);
            
            try {
              const response = JSON.parse(xhr.responseText);
              this.errorMessage = response.message || 'Gagal memperbarui kategori';
            } catch (e) {
              this.errorMessage = `Gagal memperbarui kategori. Error: ${xhr.status}`;
            }
          }
        };
        
        xhr.onerror = () => {
          this.isSubmitting = false;
          console.error('Network error during update');
          this.errorMessage = "Terjadi kesalahan jaringan";
        };
        
        // Upload progress tracking
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
          }
        };
        
        // Send the request
        xhr.send(formData);
        
      } catch (e) {
        console.error("Exception in handleSubmit:", e);
        this.errorMessage = "Terjadi kesalahan yang tidak diharapkan";
        this.isSubmitting = false;
      }
    },
    
    goBack() {
      this.$router.push('/kalab/kategoripelaporan');
    }
  }
};
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>