<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Edit Category</h1>
      
      <div v-if="loading" class="flex justify-center my-8">
        <p>Loading category data...</p>
      </div>
      
      <div v-else class="bg-white shadow-md rounded-lg p-6">
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="updateKategori">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nama">
              Category Name
            </label>
            <input 
              id="nama"
              v-model="kategori.nama"
              type="text" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
              Category Image
            </label>
            <input 
              id="image"
              type="file"
              @change="handleImageChange"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              accept="image/*"
            >
            
            <div v-if="imagePreview || (kategori.image_path && !newImageSelected)" class="mt-2">
              <p class="text-sm text-gray-600 mb-1">Current Image:</p>
              <img 
                :src="imagePreview || `http://localhost:8000/storage/category/${kategori.image_path}`"
                class="h-24 w-24 object-cover rounded"
                alt="Category image"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="submit" 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="submitting"
            >
              {{ submitting ? 'Updating...' : 'Update Category' }}
            </button>
            <button 
              type="button" 
              @click="$router.push('/kalab/kategoripelaporan')"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        kategori: {
          nama: '',
          image_path: null
        },
        newImage: null,
        newImageSelected: false,
        imagePreview: null,
        loading: true,
        submitting: false,
        errorMessage: ''
      };
    },
    created() {
      // Try to parse category data from query params first
      if (this.$route.query.data) {
        try {
          const categoryData = JSON.parse(this.$route.query.data);
          this.kategori = {
            nama: categoryData.nama,
            image_path: categoryData.image_path
          };
          this.loading = false;
        } catch (e) {
          // If parsing fails, fetch from API
          this.fetchKategori();
        }
      } else {
        // No query data, fetch from API
        this.fetchKategori();
      }
    },
    methods: {
      fetchKategori() {
        const id = this.$route.query.id;
        if (!id) {
          this.errorMessage = "Category ID not found";
          this.loading = false;
          return;
        }
        
        axios.get(`http://localhost:8000/api/category/${id}`)
          .then(response => {
            this.kategori = {
              nama: response.data.nama,
              image_path: response.data.image_path
            };
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching category:', error);
            this.errorMessage = 'Failed to load category details';
            this.loading = false;
          });
      },
      handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.newImage = file;
          this.newImageSelected = true;
          
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
      updateKategori() {
        this.submitting = true;
        this.errorMessage = '';
        
        const id = this.$route.query.id;
        if (!id) {
          this.errorMessage = "Category ID not found";
          this.submitting = false;
          return;
        }
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
          this.errorMessage = 'Authentication token not found';
          this.submitting = false;
          return;
        }
  
        // Create form data
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Method override for PUT
        formData.append('nama', this.kategori.nama); // Use nama instead of name
        
        // Only append image if a new one was selected
        if (this.newImage) {
          formData.append('image', this.newImage);
        }
  
        axios.post(`http://localhost:8000/api/category/update/${id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          // Navigate back to the category list page
          this.$router.push('/kalab/kategoripelaporan');
        })
        .catch(error => {
          console.error('Error updating category:', error);
          this.errorMessage = error.response?.data?.message || 'Failed to update category';
          this.submitting = false;
        });
      }
    }
  };
  </script>