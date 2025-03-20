<template>
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Categories</h1>
        <button
          @click="$router.push({ path: '/kalab/addkategoripelaporan' })"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <i class="fas fa-plus mr-1"></i> Add New Category
        </button>
      </div>
  
      <!-- Search and filter options -->
      <div class="mb-4 flex items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Search categories..."
          class="border rounded-md px-4 py-2 w-64"
          @input="handleSearch"
        />
      </div>
  
      <!-- Categories Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icon Image
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kategori
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                  class="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button 
                  @click="deleteCategory(category.category_id)" 
                  class="text-red-500 hover:text-red-700"
                >
                  Delete
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
              Previous
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages" 
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <!-- Desktop pagination controls -->
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ filteredCategories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }}</span>
                of
                <span class="font-medium">{{ filteredCategories.length }}</span>
                results
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
                  Page {{ currentPage }} of {{ totalPages || 1 }}
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
        <p>Loading categories...</p>
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
      async fetchCategories() {
        this.loading = true;
        try {
          const response = await axios.get('http://localhost:8000/api/category');
          this.categories = response.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
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
        // Use SweetAlert2 for confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: "This category will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
            // User confirmed, proceed with deletion
            const token = localStorage.getItem('auth_token');
            
            // Set up headers with the Bearer token
            const config = {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            };
            
            // Call API to delete the category
            axios.delete(`http://localhost:8000/api/category/${categoryId}`, config)
                .then(() => {
                // Show success message
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Category has been deleted.',
                    icon: 'success',
                    timer: 2000, // Auto close after 2 seconds
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                // Refresh the categories list
                this.fetchCategories();
                })
                .catch(error => {
                console.error('Error deleting category:', error);
                Swal.fire(
                    'Error!',
                    'Failed to delete category.',
                    'error'
                );
                });
            }
        });
      },
      getCategoryImageUrl(image_path) {
        if (!image_path) return "";
        return `${import.meta.env.VITE_API_BASE_URL}/storage/category/${image_path}`;
      },
    },
    created() {
      this.fetchCategories();
    },
    watch: {
      // Reset pagination when filtered results change significantly
      filteredCategories() {
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }
      }
    }
  };
  </script>