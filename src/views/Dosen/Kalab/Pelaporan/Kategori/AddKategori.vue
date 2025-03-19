<template>
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Tambah Kategori</h5>
        </div>
        <div class="card-body">
          <!-- Display any validation errors -->
          <div v-if="Object.keys(errors).length > 0" class="alert alert-danger">
            <ul class="mb-0">
              <li v-for="(error, field) in errors" :key="field">{{ error[0] }}</li>
            </ul>
          </div>
  
          <form @submit.prevent="submitForm">
            <!-- Nama Kategori -->
            <div class="form-group mb-3">
              <label for="nama" class="required-label">Nama Kategori</label>
              <input 
                type="text" 
                class="form-control" 
                :class="{'is-invalid': errors.nama}"
                id="nama" 
                v-model="form.nama" 
                placeholder="Masukkan nama kategori"
              >
              <div v-if="errors.nama" class="invalid-feedback">
                {{ errors.nama[0] }}
              </div>
            </div>
            
            <!-- Image Upload -->
            <div class="form-group mb-3">
              <label for="image" class="required-label">Gambar Kategori</label>
              <div class="custom-file-upload">
                <input 
                  type="file" 
                  class="form-control" 
                  :class="{'is-invalid': errors.image_path}"
                  id="image" 
                  @change="handleImageUpload"
                  accept="image/*"
                >
                <div v-if="errors.image_path" class="invalid-feedback">
                  {{ errors.image_path[0] }}
                </div>
              </div>
              <!-- Preview image if selected -->
              <div v-if="imagePreview" class="mt-3">
                <img :src="imagePreview" alt="Preview" class="img-preview">
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">Simpan</button>
            </div>
          </form>
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
        form: {
          nama: '',
          image_path: null
        },
        errors: {},
        imagePreview: null
      }
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.form.image_path = file;
          this.imagePreview = URL.createObjectURL(file);
        }
      },
      submitForm() {
        // Reset errors
        this.errors = {};
        
        // Create form data to send
        const formData = new FormData();
        formData.append('nama', this.form.nama);
        if (this.form.image_path) {
          formData.append('image_path', this.form.image_path);
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');
        
        // Submit to API with bearer token
        axios.post('http://localhost:8000/api/category/add_category', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          // Handle success
          Swal.fire({
            title: 'Success!',
            text: 'Kategori berhasil ditambahkan',
            icon: 'success',
            confirmButtonText: 'OK',
            position: 'top-end',  // Position in top-right corner
            toast: true,  // Make it a toast notification
            timer: 3000,  // Auto close after 3 seconds
            timerProgressBar: true,  // Show progress bar
            showConfirmButton: false  // Remove the confirm button
          });
          
          // Clear form
          this.form.nama = '';
          this.form.image_path = null;
          this.imagePreview = null;
          
          // Redirect to category list after short delay
          setTimeout(() => {
            this.$router.push({ path: '/kalab/kategoripelaporan' });
          }, 3000);
        })
        .catch(error => {
          if (error.response && error.response.data.errors) {
            this.errors = error.response.data.errors;
          } else {
            Swal.fire({
              title: 'Error!',
              text: error.message || 'Something went wrong',
              icon: 'error',
              position: 'top-end',  // Position in top-right corner
              toast: true,  // Make it a toast notification
              timer: 3000,  // Auto close after 3 seconds
              timerProgressBar: true,  // Show progress bar
              showConfirmButton: false  // Remove the confirm button
            });
          }
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
    border: none;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 18px 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .card-body {
    padding: 24px;
    background-color: #ffffff;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-control {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    padding: 10px 15px;
    transition: border-color 0.2s, box-shadow 0.2s;
    display: block;
    width: 100%;
    margin-bottom: 0;
  }
  
  .form-control:focus {
    border-color: #8a2be2;
    box-shadow: 0 0 0 0.2rem rgba(138, 43, 226, 0.15);
    outline: none;
  }
  
  .is-invalid {
    border-color: #dc3545 !important;
  }
  
  .invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: #dc3545;
    padding-left: 8px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .btn {
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #8a2be2;
    border-color: #8a2be2;
  }
  
  .btn-primary:hover {
    background-color: #7526c0;
    border-color: #7526c0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(138, 43, 226, 0.2);
  }
  
  .required-label::after {
    content: "*";
    color: #dc3545;
    margin-left: 4px;
  }
  
  .custom-file-upload {
    position: relative;
    margin-bottom: 8px;
  }
  
  .img-preview {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
  
  /* Input groups for better spacing and structure */
  .input-wrapper {
    position: relative;
    margin-bottom: 4px;
  }
  </style>