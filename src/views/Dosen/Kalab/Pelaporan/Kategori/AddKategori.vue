<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h2 class="mb-0 font-weight-bold">Tambah Kategori</h2>
      </div>
      <div class="card-body">
        <!-- Jabatan Status Check -->
        <div v-if="showJabatanWarning" class="alert alert-warning mb-3">
          <h6>⚠️ Masalah Jabatan Terdeteksi</h6>
          <p class="mb-2">
            <strong>Jabatan di profil:</strong> {{ currentUser?.jabatan }}<br>
            <strong>Jabatan aktif:</strong> {{ currentJabatan || 'Tidak diketahui' }}
          </p>
          <button @click="switchToKalab" class="btn btn-sm btn-warning" :disabled="switchingJabatan">
            <span v-if="switchingJabatan" class="spinner-border spinner-border-sm mr-1"></span>
            🔄 Aktifkan Jabatan Kalab
          </button>
        </div>

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
              placeholder="Masukkan nama kategori"
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
              :disabled="isSubmitting || !isKalabActive"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary ml-2"
              @click="$router.push({ path: '/kalab/kategoripelaporan' })"
              :disabled="isSubmitting"
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
import { decryptData } from "../../../../../services/encrypt";
import VueCookies from "vue-cookies";

export default {
  name: 'TambahKategori',
  data() {
    return {
      form: {
        nama: '',
        image_path: null
      },
      imagePreview: null,
      errors: {},
      isSubmitting: false,
      switchingJabatan: false,
      currentUser: null,
      currentJabatan: null,
      // API Configuration
      apiConfig: {
        baseURL: 'https://v3422040.mhs.d3tiuns.com',
        endpoint: '/api/category/add_category'
      }
    }
  },
  computed: {
    isKalabActive() {
      return this.currentJabatan === 'Kalab' || this.currentUser?.jabatan === 'Kalab';
    },
    showJabatanWarning() {
      return this.currentUser && 
             this.currentUser.jabatan === 'Kalab' && 
             this.currentJabatan && 
             this.currentJabatan !== 'Kalab';
    }
  },
  mounted() {
    this.getCurrentUser();
    this.initializeJabatan();
  },
  methods: {
    // Get current user from encrypted session
    getCurrentUser() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          this.currentUser = decryptData(encryptedUserData);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        this.currentUser = null;
      }
    },

    async initializeJabatan() {
      await this.checkCurrentJabatan();
    },

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
    
    getToken() {
      const encodedToken = this.getCookie('auth_token');
      return encodedToken ? decodeURIComponent(encodedToken) : null;
    },

    // Check current active jabatan
    async checkCurrentJabatan() {
      try {
        const token = this.getToken();
        if (!token) return;

        const response = await fetch(`${this.apiConfig.baseURL}/api/dosen/current_jabatan`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.currentJabatan = data.current_jabatan || data.jabatan || null;
        }
      } catch (error) {
        console.error('Error checking current jabatan:', error);
      }
    },

    // Switch to Kalab jabatan
    async switchToKalab() {
      try {
        this.switchingJabatan = true;
        const token = this.getToken();
        if (!token) return;

        const response = await fetch(`${this.apiConfig.baseURL}/api/dosen/switch_jabatan`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jabatan: 'Kalab'
          })
        });

        if (response.ok) {
          this.currentJabatan = 'Kalab';
          
          Swal.fire({
            title: 'Berhasil!',
            text: 'Jabatan berhasil diubah ke Kalab',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          const errorData = await response.json();
          
          Swal.fire({
            title: 'Gagal!',
            text: errorData.message || 'Gagal mengubah jabatan',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Terjadi kesalahan saat mengubah jabatan',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        this.switchingJabatan = false;
      }
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.image_path = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Clear any previous image errors
        if (this.errors.image_path) {
          delete this.errors.image_path;
        }
      }
    },
    
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // Check jabatan first
      if (!this.isKalabActive) {
        this.errors.jabatan = "Jabatan harus diset ke 'Kalab' untuk menambahkan kategori";
        isValid = false;
      }
      
      // Validate nama
      if (!this.form.nama || this.form.nama.trim() === '') {
        this.errors.nama = "Nama kategori tidak boleh kosong";
        isValid = false;
      } else if (this.form.nama.trim().length < 3) {
        this.errors.nama = "Nama kategori minimal 3 karakter";
        isValid = false;
      }
      
      // Validate image
      if (!this.form.image_path) {
        this.errors.image_path = "Gambar kategori diperlukan";
        isValid = false;
      } else {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        
        if (!allowedTypes.includes(this.form.image_path.type)) {
          this.errors.image_path = "Format gambar harus JPG, JPEG, atau PNG";
          isValid = false;
        } else if (this.form.image_path.size > maxSize) {
          this.errors.image_path = "Ukuran gambar maksimal 2MB";
          isValid = false;
        }
      }
      
      return isValid;
    },

    async submitForm() {
      this.isSubmitting = true;
      
      // Check jabatan before proceeding
      if (!this.isKalabActive) {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Jabatan Tidak Sesuai!',
          text: 'Anda harus mengaktifkan jabatan "Kalab" terlebih dahulu',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      if (!this.validateForm()) {
        this.isSubmitting = false;
        return;
      }
      
      const token = this.getToken();
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

      // Prepare form data
      const formData = new FormData();
      formData.append('nama', this.form.nama.trim());
      formData.append('image_path', this.form.image_path, this.form.image_path.name);
      
      // Build request URL
      const requestURL = `${this.apiConfig.baseURL}${this.apiConfig.endpoint}`;
      
      try {
        const response = await fetch(requestURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formData
        });
        
        const responseData = await response.json();
        this.isSubmitting = false;
        
        if (response.ok) {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Kategori berhasil ditambahkan',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#2b53e2'
          }).then(() => {
            this.$router.push('/kalab/kategoripelaporan');
          });
        } else if (response.status === 403) {
          // Refresh jabatan status
          await this.checkCurrentJabatan();
          
          Swal.fire({
            title: 'Akses Ditolak!',
            html: `
              <p>Anda tidak memiliki izin untuk menambahkan kategori.</p>
              <small><strong>Jabatan aktif:</strong> ${this.currentJabatan || 'Tidak diketahui'}</small><br>
              <small><strong>Jabatan dibutuhkan:</strong> Kalab</small><br>
              <small>Silakan pastikan jabatan "Kalab" sudah aktif.</small>
            `,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else if (response.status === 401) {
          Swal.fire({
            title: 'Error!',
            text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            document.cookie = 'auth_token=; Max-Age=0; path=/';
            VueCookies.remove('user_session');
            this.$router.push('/login');
          });
        } else if (response.status === 422 && responseData.errors) {
          this.errors = responseData.errors;
          
          if (this.errors.image_path && Array.isArray(this.errors.image_path)) {
            this.errors.image_path = this.errors.image_path[0];
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: responseData.message || `Terjadi kesalahan (${response.status}). Silakan coba lagi.`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Error Jaringan!',
          text: 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda dan coba lagi.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
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

.badge {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
}

.badge-info {
  background-color: #17a2b8;
  color: white;
}

.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}

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

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

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

.btn-primary:hover:not(:disabled) {
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

.btn-secondary:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #e9ecef;
  color: #6c757d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary:disabled {
  background-color: #d6d8db;
  border-color: #d6d8db;
  color: #a6a6a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background-color: #e0a800;
  border-color: #e0a800;
}

.btn-warning:disabled {
  background-color: #ffcd39;
  border-color: #ffcd39;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.img-thumbnail {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.text-muted {
  color: #6c757d;
}

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

.spinner-border-sm {
  width: 0.75rem;
  height: 0.75rem;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 15px;
}

.mt-4 {
  margin-top: 1.5rem;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875em;
}
</style>