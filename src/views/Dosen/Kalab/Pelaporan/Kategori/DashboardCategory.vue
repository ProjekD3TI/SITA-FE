<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-4xl font-bold">Kategori Laporan</h1>
      </div>
  
      <!-- Search and Add Category section -->
      <div class="flex justify-between items-center mb-4">
        <div class="relative w-64">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <!-- Search icon (SVG) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Cari Kategori..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            @input="handleSearch"
          />
        </div>
        
        <button
          @click="$router.push({ path: '/kalab/addkategoripelaporan' })"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
        <i class="fas fa-plus mr-1"></i> Tambah Kategori
        </button>
      </div>
  
      <!-- Categories Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                No.
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                Icon Image
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                Nama Kategori
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(category, index) in paginatedCategories" :key="category.category_id">
              <td class="px-6 py-4 whitespace-nowrap text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center">
                  <img 
                    v-if="category.image_path"
                    :src="getCategoryImageUrl(category.image_path)" 
                    :alt="category.nama"
                    class="max-h-20 max-w-20 object-contain rounded-md"
                    @error="handleImageError($event)"
                  />
                  <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-500 text-xs">No image</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">{{ category.nama }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button 
                  @click="editCategory(category)"
                  class="text-blue-500 hover:text-blue-700 mr-3 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  @click="deleteCategory(category.category_id)" 
                  class="text-red-500 hover:text-red-700 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="paginatedCategories.length === 0 && !loading">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No categories found.
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination controls -->
        <div v-if="filteredCategories.length > 0" class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <!-- Mobile pagination controls -->
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="currentPage--" 
              :disabled="currentPage <= 1" 
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sebelum
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages" 
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
          
          <!-- Desktop pagination controls -->
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium">{{ filteredCategories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span>
                -
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }}</span>
                dari
                <span class="font-medium">{{ filteredCategories.length }}</span>
                kategori
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage = 1" 
                  :disabled="currentPage <= 1" 
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">First</span>
                  &laquo;
                </button>
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage <= 1" 
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Previous</span>
                  &lsaquo;
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Halaman {{ currentPage }} dari {{ totalPages || 1 }}
                </span>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage >= totalPages" 
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Next</span>
                  &rsaquo;
                </button>
                <button 
                  @click="currentPage = totalPages" 
                  :disabled="currentPage >= totalPages" 
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Last</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading indicator -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      categories: [],
      search: '',
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      apiBaseUrl: 'https://v3422040.mhs.d3tiuns.com',
    };
  },
  computed: {
    filteredCategories() {
      if (!this.search) {
        return this.categories;
      }
      
      const searchTerm = this.search.toLowerCase();
      return this.categories.filter(category => 
        category.nama.toLowerCase().includes(searchTerm)
      );
    },
    paginatedCategories() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage;
      const endIdx = startIdx + this.itemsPerPage;
      return this.filteredCategories.slice(startIdx, endIdx);
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    }
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

    async fetchCategories() {
      this.loading = true;
      try {
        const response = await axios.get(`${this.apiBaseUrl}/api/category`);
        this.categories = response.data;
        console.log('Categories loaded:', this.categories.length);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Gagal memuat kategori. Silakan coba lagi nanti.',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    
    handleSearch() {
      // Reset to first page when search term changes
      this.currentPage = 1;
    },
    
    editCategory(category) {
      // Navigate to the EditKategori component with the category ID as a parameter
      this.$router.push({
        name: 'EditKatPelaporan', // Use the route name defined in your router
        params: { id: category.category_id },
        // Optionally pass the category data as query params to avoid additional API call
        query: { data: JSON.stringify(category) }
      });
    },
    
    deleteCategory(categoryId) {
      // Confirmation dialog
      Swal.fire({
        title: 'Konfirmasi Hapus',
        text: "Kategori ini akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          // Show loading state
          this.loading = true;
          
          // Get token - try multiple sources
          let token = null;
          
          // Method 1: Try cookie
          const getCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              let cookie = cookies[i].trim();
              if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
              }
            }
            return null;
          };
          
          // Get token from cookie and decode it
          const encodedToken = getCookie('auth_token');
          if (encodedToken) {
            token = decodeURIComponent(encodedToken);
            console.log('Token found in cookie');
          } 
          // Method 2: Try localStorage
          else {
            token = localStorage.getItem('auth_token');
            console.log('Token found in localStorage');
          }
          
          if (!token) {
            this.loading = false;
            Swal.fire('Error!', 'Anda perlu login kembali untuk melanjutkan', 'error');
            return;
          }
          
          // For debugging in production - log token format
          console.log('Token type:', typeof token);
          console.log('Token length:', token.length);
          console.log('Token preview:', token.substring(0, 10) + '...' + token.substring(token.length - 10));
          
          // Production-friendly API call using form-data with method spoofing
          const formData = new FormData();
          formData.append('_method', 'DELETE');
          
          // Make the request - using POST with _method=DELETE for better compatibility
          fetch(`https://v3422040.mhs.d3tiuns.com/api/category/${categoryId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
              // Don't set Content-Type with FormData
            },
            body: formData,
            credentials: 'include' // Include cookies
          })
          .then(response => {
            this.loading = false;
            
            // Log full response for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
              // Try to get error details
              return response.text().then(text => {
                try {
                  return Promise.reject(JSON.parse(text));
                } catch (e) {
                  return Promise.reject({message: `Server error: ${response.status}`});
                }
              });
            }
            
            return response.json();
          })
          .then(data => {
            console.log('Delete successful:', data);
            
            Swal.fire({
              title: 'Berhasil!',
              text: 'Kategori telah dihapus.',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
            
            // Refresh the categories list
            this.fetchCategories();
          })
          .catch(error => {
            console.error('Delete error:', error);
            
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Gagal menghapus kategori.',
              icon: 'error'
            });
          });
        }
      });
    },
    
    getCategoryImageUrl(image_path) {
      if (!image_path) return "";
      // Use the first URL format provided
      //return `${this.apiBaseUrl}/public/storage/category/${image_path}`;
      
      // Use the second format
      return `${this.apiBaseUrl}/Backend-Port/backend/engine/public/storage/category/${image_path}`;
    },
    
    handleImageError(event) {
      // If the image fails to load, try the alternative URL format
      const img = event.target;
      const currentSrc = img.src;
      
      if (currentSrc.includes('/Backend-Port/backend/engine/public/storage/')) {
        // If the second format failed, try the first format
        img.src = currentSrc.replace(
          '/Backend-Port/backend/engine/public/storage/', 
          '/public/storage/'
        );
      } else if (currentSrc.includes('/public/storage/')) {
        // If the first format failed, show a placeholder
        img.src = 'https://via.placeholder.com/150?text=No+Image';
      }
    }
  },
  created() {
    this.fetchCategories();
  },
  watch: {
    search() {
      this.handleSearch();
    },
    // Reset pagination when filtered results change significantly
    filteredCategories() {
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      }
    }
  }
};
</script>

<style scoped>
/* You can add any specific styling here if needed */
.max-h-20 {
  max-height: 5rem;
}

.max-w-20 {
  max-width: 5rem;
}

/* Add a loading animation for image loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

img[src*="placeholder.com"] {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>