<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h2 class="mb-0 font-weight-bold">Tambah Kategori</h2>
      </div>
      <div class="card-body">
        <!-- Display any validation errors -->
        <div v-if="Object.keys(errors).length > 0" class="alert alert-danger">
          <ul class="mb-0">
            <li v-for="(error, field) in errors" :key="field">
              {{ Array.isArray(errors[field]) ? errors[field][0] : errors[field] }}
            </li>
          </ul>
        </div>

        <form @submit.prevent="submitForm">
          <!-- Nama Kategori -->
          <div class="form-group">
            <label for="nama">Nama Kategori</label>
            <input 
              type="text" 
              id="nama" 
              v-model="form.nama" 
              class="form-control" 
              :class="{'is-invalid': errors.nama}" 
            />
            <div class="invalid-feedback" v-if="errors.nama">
              {{ Array.isArray(errors.nama) ? errors.nama[0] : errors.nama }}
            </div>
          </div>
          
          <!-- Image Upload -->
          <div class="form-group">
            <label for="image_path">Gambar Kategori</label>
            <input 
              type="file" 
              id="image_path"
              @change="handleImageUpload" 
              class="form-control-file" 
              :class="{'is-invalid': errors.image_path}"
              accept="image/jpeg,image/png,image/jpg"
            />
            <div class="invalid-feedback" v-if="errors.image_path">
              {{ Array.isArray(errors.image_path) ? errors.image_path[0] : errors.image_path }}
            </div>
            <small class="form-text text-muted">Format: JPG, JPEG, PNG. Max: 2MB</small>
            
            <div v-if="imagePreview" class="mt-2">
              <img :src="imagePreview" alt="Preview" class="img-thumbnail" style="max-height: 200px">
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="d-flex mt-3">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Simpan
            </button>
            <button 
              type="button" 
              class="btn btn-secondary ml-2"
              @click="$router.push({ path: '/kalab/kategoripelaporan' })"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      form: {
        nama: '',
        image_path: null
      },
      imagePreview: null,
      errors: {},
      isSubmitting: false
    }
  },
  mounted() {
    // Check for auth token as soon as component mounts
    this.checkToken();
  },
  methods: {
    // Get a cookie value by name
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
    
    checkToken() {
      console.log("============ TOKEN INFORMATION ============");
      
      // Get auth_token from cookie and decode it
      const encodedToken = this.getCookie('auth_token');
      const token = encodedToken ? decodeURIComponent(encodedToken) : null;
      
      console.log('Cookie auth_token (decoded):', token ? 
                 (token.length > 20 ? token.substring(0, 10) + '...' + token.substring(token.length - 10) : token) 
                 : 'Not found');
      
      console.log("=========================================");
      return token;
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log('Selected file:', file);
        this.form.image_path = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    
    submitForm() {
      // Reset errors and set loading state
      this.errors = {};
      this.isSubmitting = true;
      
      // Validate form before submission
      if (!this.form.nama) {
        this.errors.nama = "Nama kategori tidak boleh kosong";
        this.isSubmitting = false;
        return;
      }
      
      // Validate image if required
      if (!this.form.image_path) {
        this.errors.image_path = "Gambar kategori diperlukan";
        this.isSubmitting = false;
        return;
      }
      
      // Check file type and size
      if (this.form.image_path) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        console.log('File type:', this.form.image_path.type);
        
        if (!allowedTypes.includes(this.form.image_path.type)) {
          this.errors.image_path = "Format gambar harus JPG, JPEG, atau PNG";
          this.isSubmitting = false;
          return;
        }
        
        if (this.form.image_path.size > maxSize) {
          this.errors.image_path = "Ukuran gambar maksimal 2MB";
          this.isSubmitting = false;
          return;
        }
      }
      
      // Create form data to send
      const formData = new FormData();
      formData.append('nama', this.form.nama.trim());
      if (this.form.image_path) {
        formData.append('image_path', this.form.image_path, this.form.image_path.name);
        console.log('Form data image:', this.form.image_path.name, this.form.image_path.type, this.form.image_path.size);
      }
      
      // Get token from cookie (correctly decoded)
      const encodedToken = this.getCookie('auth_token');
      const token = encodedToken ? decodeURIComponent(encodedToken) : null;
      
      if (!token) {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Error!',
          text: 'Anda perlu login kembali untuk melanjutkan',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      // Use XMLHttpRequest instead of axios
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://v3422040.mhs.d3tiuns.com/api/category/add_category');
      
      // Set request headers
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      // Don't set Content-Type for FormData, browser will handle it with correct boundary
      
      // Track upload progress (optional)
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
        }
      };
      
      // Handle response
      xhr.onload = () => {
        this.isSubmitting = false;
        
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          console.log('Success:', xhr.responseText);
          
          Swal.fire({
            title: 'Success!',
            text: 'Kategori berhasil ditambahkan',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push('/kalab/kategoripelaporan');
          });
        } else {
          // Error
          console.error('Error:', xhr.status, xhr.responseText);
          
          try {
            const response = JSON.parse(xhr.responseText);
            
            if (response.errors) {
              this.errors = response.errors;
              
              // Check for specific image_path errors
              if (this.errors.image_path) {
                console.log('Image path error:', this.errors.image_path);
                // Ensure error is displayed as string if it's an array
                if (Array.isArray(this.errors.image_path)) {
                  this.errors.image_path = this.errors.image_path[0];
                }
              }
            } else {
              Swal.fire({
                title: 'Error!',
                text: response.message || 'Gagal menambahkan kategori',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          } catch (e) {
            Swal.fire({
              title: 'Error!',
              text: 'Terjadi kesalahan saat menambahkan kategori',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        this.isSubmitting = false;
        console.error('Network Error');
        
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan jaringan, silakan coba lagi',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      };
      
      // Send the request
      console.log('Sending request to:', 'https://v3422040.mhs.d3tiuns.com/api/category/add_category');
      console.log('With token:', token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'No token');
      xhr.send(formData);
    }
  }
}
</script>

<style scoped>
/* Card styles */
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

/* Form element styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
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
  border-color: #2b53e2;
  box-shadow: 0 0 0 0.25rem rgba(43, 83, 226, 0.25);
  outline: 0;
}

.form-control-file {
  display: block;
  width: 100%;
  padding: 0.375rem 0;
}

/* Validation styles */
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

.alert {
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

/* Button styles */
.btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(43, 83, 226, 0.25);
}

.btn-primary {
  background-color: #2b53e2;
  border-color: #2b53e2;
  color: white;
}

.btn-primary:hover {
  background-color: #2638c0;
  border-color: #2638c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(43, 83, 226, 0.3);
}

.btn-primary:disabled {
  background-color: #6c8ae4;
  border-color: #6c8ae4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background-color: #c0c0c0;
  border-color: #f8f9fa;
  color: #565b60;
}

.btn-secondary:hover {
  background-color: #e9ecef;
  border-color: #e9ecef;
  color: #6c757d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Image preview styles */
.img-thumbnail {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Utility classes */
.d-flex {
  display: flex;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mb-0 {
  margin-bottom: 0;
}

.text-muted {
  color: #6c757d;
}

/* Loading spinner */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>