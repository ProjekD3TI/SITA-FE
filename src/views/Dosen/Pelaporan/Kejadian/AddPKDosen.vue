<template>
    <div class="add-pk-container">
      <div class="form-header">
        <h1>Tambah Laporan Kejadian</h1>
      </div>
  
      <form @submit.prevent="submitForm" class="pk-form">
        <!-- Two column layout -->
        <div class="form-row">
          <!-- Left column -->
          <div class="form-column">
            <div class="form-group">
              <label for="judul">Judul Laporan <span class="required">*</span></label>
              <input
                type="text"
                id="judul"
                v-model="formData.judul"
                class="form-control"
                :class="{ 'is-invalid': errors.judul }"
                required
              />
              <div v-if="errors.judul" class="invalid-feedback">{{ errors.judul[0] }}</div>
            </div>
  
            <div class="form-group">
              <label for="category_id">Kategori <span class="required">*</span></label>
              <select
                id="category_id"
                v-model="formData.category_id"
                class="form-control"
                :class="{ 'is-invalid': errors.category_id }"
                required
              >
                <option value="" disabled selected>Pilih Kategori</option>
                <option 
                  v-for="category in filteredCategories" 
                  :key="category.category_id" 
                  :value="category.category_id"
                >
                  {{ category.nama }}
                </option>
              </select>
              <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id[0] }}</div>
            </div>

            <div class="form-group">
              <label for="image_path">Lampiran Foto <span class="required">*</span></label>
              <div class="custom-file-upload">
                <input
                  type="file"
                  id="image_path"
                  @change="handleFileUpload"
                  class="form-control"
                  :class="{ 'is-invalid': errors.image_path }"
                  accept="image/*"
                  required
                />
                <div v-if="errors.image_path" class="invalid-feedback">{{ errors.image_path[0] }}</div>
              </div>
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
              </div>
            </div>

            <div class="form-group">
              <label for="deskripsi">Deskripsi <span class="required">*</span></label>
              <textarea
                id="deskripsi"
                v-model="formData.deskripsi"
                class="form-control"
                :class="{ 'is-invalid': errors.deskripsi }"
                rows="5"
                required
              ></textarea>
              <div v-if="errors.deskripsi" class="invalid-feedback">{{ errors.deskripsi[0] }}</div>
            </div>
  
            
  
            <div class="form-group">
              <label for="tanggal_kejadian">Tanggal Kejadian <span class="required">*</span></label>
              <input
                type="date"
                id="tanggal_kejadian"
                v-model="formData.tanggal_kejadian"
                class="form-control"
                :class="{ 'is-invalid': errors.tanggal_kejadian }"
                required
              />
              <div v-if="errors.tanggal_kejadian" class="invalid-feedback">{{ errors.tanggal_kejadian[0] }}</div>
            </div>
          </div>
  
          <!-- Right column -->
          <div class="form-column">
            <div class="form-group">
              <label for="nama_pelapor">Nama Pelapor</label>
              <input
                type="text"
                id="nama_pelapor"
                v-model="formData.nama_pelapor"
                class="form-control"
                disabled
              />
            </div>
  
            <div class="form-group">
              <label for="ni_pelapor">NIM/NIK Pelapor</label>
              <input
                type="text"
                id="ni_pelapor"
                v-model="formData.ni_pelapor"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
                <label for="nomor_telepon">Nomor HP Pelapor</label>
                <input
                    type="text"
                    id="nomor_telepon"
                    v-model="formData.nomor_telepon"
                    class="form-control"
                    disabled
                />
            </div>
          </div>
        </div>
  
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-secondary">Kembali</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Mengirim...</span>
            <span v-else>Kirim Laporan</span>
          </button>
        </div>
      </form>
  
      <!-- Notification modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header" :class="{ 'success': isSuccess, 'error': !isSuccess }">
            <h3>{{ modalTitle }}</h3>
          </div>
          <div class="modal-body">
            <p>{{ modalMessage }}</p>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-primary">OK</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { decryptData } from '../../../../../services/encrypt';
  import VueCookies from "vue-cookies";
  
  export default {
    name: 'AddPK',
    data() {
      return {
        formData: {
          judul: '',
          category_id: '',
          deskripsi: '',
          tanggal_kejadian: '',
          image_path: null,
          nama_pelapor: '',
          ni_pelapor: '',
          nomor_telepon: ''
        },
        imagePreview: null,
        categories: [],
        errors: {},
        loading: false,
        showModal: false,
        modalTitle: '',
        modalMessage: '',
        isSuccess: false
      };
    },
    mounted() {
      this.fetchCategories();
      this.loadUserData();
    },
    computed: {
      filteredCategories() {
        // Filter out categories that start with "Kekerasan"
        return this.categories.filter(category => 
          !category.nama.startsWith('Kekerasan')
        );
      }
    },
    methods: {
      loadUserData() {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.formData.nama_pelapor = userData.name || '';
          this.formData.ni_pelapor = userData.nim || userData.nik || '';
          this.formData.nomor_telepon = userData.no_telp || '';
        }
      },
      fetchCategories() {
        axios.get('http://localhost:8000/api/category')
          .then(response => {
            this.categories = response.data;
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
            this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
          });
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
          this.imagePreview = null;
          this.formData.image_path = null;
          return;
        }
  
        this.formData.image_path = file;
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      submitForm() {
        this.loading = true;
        this.errors = {};
        
        const formData = new FormData();
        formData.append('judul', this.formData.judul);
        formData.append('category_id', this.formData.category_id);
        formData.append('deskripsi', this.formData.deskripsi);
        formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
        formData.append('image_path', this.formData.image_path);
  
        axios.post('http://localhost:8000/api/laporan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            this.loading = false;
            this.showNotification('Berhasil', 'Laporan berhasil ditambahkan.', true);
            this.resetForm();
          })
          .catch(error => {
            this.loading = false;
            if (error.response && error.response.status === 400) {
              this.errors = error.response.data;
            } else {
              this.showNotification('Error', 'Terjadi kesalahan saat mengirim laporan.', false);
            }
          });
      },
      resetForm() {
        this.formData = {
          judul: '',
          category_id: '',
          deskripsi: '',
          tanggal_kejadian: '',
          image_path: null,
          nama_pelapor: this.formData.nama_pelapor,
          ni_pelapor: this.formData.ni_pelapor,
          nomor_telepon: this.formData.nomor_telepon
        };
        this.imagePreview = null;
        this.errors = {};
      },
      goBack() {
        this.$router.go(-1);
      },
      showNotification(title, message, isSuccess) {
        this.modalTitle = title;
        this.modalMessage = message;
        this.isSuccess = isSuccess;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        if (this.isSuccess) {
          this.$router.push('/kalab/pelaporankejadiankalab');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .add-pk-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .form-header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .form-header h1 {
    font-size: 1.8rem;
    color: #333;
  }
  
  .pk-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-row {
    display: flex;
    gap: 2rem;
  }
  
  .form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: 600;
    color: #333;
  }
  
  .required {
    color: #dc3545;
  }
  
  .form-control {
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  .form-control:disabled {
    background-color: #e9ecef;
    opacity: 1;
  }
  
  .is-invalid {
    border-color: #dc3545;
  }
  
  .invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .custom-file-upload {
    position: relative;
  }
  
  .image-preview {
    margin-top: 1rem;
    max-width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .image-preview img {
    max-width: 300px;
    max-height: 200px;
    object-fit: contain;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    padding: 1rem;
    text-align: center;
  }
  
  .modal-header.success {
    background-color: #28a745;
    color: white;
  }
  
  .modal-header.error {
    background-color: #dc3545;
    color: white;
  }
  
  .modal-body {
    padding: 1.5rem;
    text-align: center;
  }
  
  .modal-footer {
    padding: 1rem;
    display: flex;
    justify-content: center;
  }
  
  /* Responsive layout */
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 1rem;
    }
  }
  </style>