<template>
  <div>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Edit Category</h1>
      
      <div v-if="loading" class="text-blue-500">Loading...</div>
      <div v-if="errorMessage" class="text-red-500 my-2">{{ errorMessage }}</div>
      <div v-if="successMessage" class="text-green-500 my-2">{{ successMessage }}</div>
      
      <form v-if="!loading" @submit.prevent="handleSubmit" class="bg-white p-6 rounded shadow-md">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Category Name</label>
          <input 
            v-model="kategori.nama" 
            type="text" 
            class="w-full border p-2 rounded" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Category Image</label>
          <img 
            v-if="kategori.image_path && !newImageSelected" 
            :src="`http://localhost:8000/storage/category/${kategori.image_path}`" 
            alt="Category Image" 
            class="h-32 w-32 object-cover mb-2"
          />
          <img 
            v-if="imagePreview" 
            :src="imagePreview" 
            alt="New Category Image" 
            class="h-32 w-32 object-cover mb-2"
          />
          <input 
            type="file" 
            @change="handleImageChange" 
            class="w-full border p-2 rounded"
          />
        </div>
        
        <div class="flex">
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="loading"
          >
            Update Category
          </button>
          <button 
            type="button" 
            @click="goBack" 
            class="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
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
      errorMessage: '',
      successMessage: '',
      newImage: null,
      newImageSelected: false,
      imagePreview: null
    };
  },
  // Use mounted instead of created to ensure DOM is ready
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
    handleGlobalError(event) {
      console.error("Global error caught:", event.error);
    },
    parseAndSetCategoryData() {
      console.log("Route query:", this.$route.query);
      
      if (this.$route.query.data) {
        try {
          const categoryData = JSON.parse(this.$route.query.data);
          console.log("Successfully parsed category data:", categoryData);
          
          // Store ID explicitly
          this.categoryId = categoryData.category_id;
          console.log("Set categoryId to:", this.categoryId);
          
          // Set form data
          this.kategori.nama = categoryData.nama;
          this.kategori.image_path = categoryData.image_path;
          
          this.loading = false;
        } catch (error) {
          console.error("Error parsing category data:", error);
          this.errorMessage = "Invalid category data format";
          this.loading = false;
        }
      } else {
        console.error("No data found in route query");
        this.errorMessage = "Category data not found";
        this.loading = false;
      }
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
    handleSubmit() {
      try {
        console.log("Submit triggered");
        
        if (!this.kategori.nama) {
          this.errorMessage = "Category name is required";
          return;
        }
        
        if (!this.categoryId) {
          if (this.$route.query.data) {
            try {
              const categoryData = JSON.parse(this.$route.query.data);
              this.categoryId = categoryData.category_id;
              console.log("Re-parsed categoryId:", this.categoryId);
            } catch (error) {
              console.error("Error re-parsing data:", error);
            }
          }
          
          if (!this.categoryId) {
            this.errorMessage = "Category ID not found";
            return;
          }
        }
        
        this.loading = true;
        this.errorMessage = '';
        
        const formData = new FormData();
        formData.append('nama', this.kategori.nama);
        formData.append('_method', 'PUT');
        
        if (this.newImage) {
          formData.append('image_path', this.newImage);
        }
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
          this.errorMessage = "Authentication token not found";
          this.loading = false;
          return;
        }
        
        axios.post(`http://localhost:8000/api/category/update/${this.categoryId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log("Update successful:", response.data);
          this.loading = false;
          
          // Use SweetAlert for success message
          Swal.fire({
            title: 'Success!',
            text: 'Kategori berhasil diedit',
            icon: 'success',
            confirmButtonText: 'OK',
            position: 'top-end',  // Position in top-right corner
            toast: true,  // Make it a toast notification
            timer: 3000,  // Auto close after 3 seconds
            timerProgressBar: true,  // Show progress bar
            showConfirmButton: false  // Remove the confirm button
          }).then(() => {
            // Navigate back after SweetAlert closes
            this.goBack();
          });
        })
        .catch(error => {
          console.error('Error updating category:', error);
          this.errorMessage = error.response?.data?.message || 'Failed to update category';
          this.loading = false;
        });
      } catch (e) {
        console.error("Exception in handleSubmit:", e);
        this.errorMessage = "An unexpected error occurred";
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push('/kalab/kategoripelaporan');
    }
  }
};
</script>