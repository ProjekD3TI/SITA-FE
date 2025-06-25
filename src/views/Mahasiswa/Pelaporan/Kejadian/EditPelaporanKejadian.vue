<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header :userData="userData" />
      <div class="edit-laporan-container">
        <h1>Edit Laporan Kejadian</h1>
        
        <div class="loading-container" v-if="loading">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>
        
        <div class="form-container" v-else>
          <div class="form-group">
            <label for="judul">Judul</label>
            <input 
              type="text" 
              id="judul" 
              v-model="formData.judul" 
              :class="{ 'is-invalid': errors.judul }" 
              required
            >
            <div v-if="errors.judul" class="error-message">{{ errors.judul[0] }}</div>
          </div>
          
          <div class="form-group">
            <label for="category">Kategori <span class="required">*</span></label>
            <select
              id="category"
              v-model="formData.category_id"
              class="form-control"
              :class="{ 'is-invalid': errors.category_id }"
              :disabled="true"
              required
            >
              <option v-if="!categoriesLoaded" value="">Loading categories...</option>
              <option 
                v-for="category in categories" 
                :key="category.category_id" 
                :value="category.category_id"
              >
                {{ category.nama }}
              </option>
            </select>
            <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id[0] }}</div>
            <small class="text-muted">Kategori tidak dapat diubah</small>
          </div>
          
          <div class="form-group">
            <label for="deskripsi">Deskripsi</label>
            <textarea 
              id="deskripsi" 
              v-model="formData.deskripsi" 
              :class="{ 'is-invalid': errors.deskripsi }" 
              rows="5" 
              required
            ></textarea>
            <div v-if="errors.deskripsi" class="error-message">{{ errors.deskripsi[0] }}</div>
          </div>
          
          <div class="form-group">
            <label for="tanggal_kejadian">Tanggal & Waktu Kejadian</label>
            <input 
              type="datetime-local" 
              id="tanggal_kejadian" 
              v-model="formData.tanggal_kejadian" 
              :class="{ 'is-invalid': errors.tanggal_kejadian }" 
              required
            >
            <div v-if="errors.tanggal_kejadian" class="error-message">{{ errors.tanggal_kejadian[0] }}</div>
          </div>
          
          <div class="form-group">
            <label for="lampiran_link">Lampiran Link</label>
            <input 
              type="text" 
              id="lampiran_link" 
              v-model="formData.lampiran_link" 
              :class="{ 'is-invalid': errors.lampiran_link }"
            >
            <div v-if="errors.lampiran_link" class="error-message">{{ errors.lampiran_link[0] }}</div>
            <small>Opsional: Masukkan URL yang berkaitan dengan laporan</small>
          </div>
          
          <div class="form-group">
            <h3>Bukti Pelanggaran</h3>
            <div v-if="errors.bukti_pelanggaran" class="error-message">
              {{ typeof errors.bukti_pelanggaran === 'string' ? errors.bukti_pelanggaran : 'Harap pilih minimal satu alat bukti' }}
            </div>
            
            <div class="checkbox-group">
              <div class="checkbox-option" v-for="(option, index) in buktiOptions" :key="index">
                <input 
                  type="checkbox" 
                  :id="'bukti-' + option.value" 
                  :value="option.value" 
                  v-model="formData.bukti_pelanggaran"
                >
                <label :for="'bukti-' + option.value">{{ option.label }}</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
              <label for="image_path">Lampiran Foto</label>
              <div class="custom-file-upload">
                  <input 
                      type="file" 
                      id="image_path" 
                      @change="handleFileUpload" 
                      multiple 
                      accept="image/*"
                  >
                  <small>Anda dapat memilih beberapa file gambar sekaligus.</small>
              </div>
              
              <div v-if="imagePreviews.length > 0" class="image-previews">
                  <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-container">
                      <img 
                          :src="preview" 
                          alt="Preview" 
                          class="image-preview"
                          @error="handleLaporanImageError"
                      >
                      <button type="button" class="remove-image" @click="removeImage(index)">&times;</button>
                  </div>
              </div>
          </div>
          
          <!-- Terlapor Section -->
          <div class="form-section">
            <h3>Identitas Terlapor/Terduga</h3>
            <div v-if="errors.terlapor" class="error-message">
              {{ typeof errors.terlapor === 'string' ? errors.terlapor : 'Harap isi data terlapor dengan benar' }}
            </div>
            <p class="form-helper-text">Opsional: Anda dapat mengosongkan semua field terlapor jika tidak ingin mengisikan.</p>
            
            <div 
              v-for="(item, index) in formData.terlapor" 
              :key="`terlapor-${index}`" 
              class="terlapor-card"
            >
              <div class="card-header">
                <h4>Terlapor #{{ index + 1 }}</h4>
                <button 
                  type="button" 
                  class="btn-remove" 
                  @click="removeTerlapor(index)" 
                  :disabled="formData.terlapor.length <= 1"
                >
                  <i class="fas fa-times"></i> Hapus
                </button>
              </div>
              
              <div class="form-row">
                <div class="form-column">
                  <div class="form-group">
                    <label :for="`terlapor-nama-${index}`">Nama Lengkap</label>
                    <input 
                      type="text" 
                      :id="`terlapor-nama-${index}`" 
                      v-model="item.nama_lengkap"
                      :class="{ 'is-invalid': errors[`terlapor.${index}.nama_lengkap`] }"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label :for="`terlapor-email-${index}`">Email</label>
                    <input 
                      type="email" 
                      :id="`terlapor-email-${index}`" 
                      v-model="item.email"
                      :class="{ 'is-invalid': errors[`terlapor.${index}.email`] }"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label :for="`terlapor-telepon-${index}`">Nomor Telepon</label>
                    <input 
                      type="text" 
                      :id="`terlapor-telepon-${index}`" 
                      v-model="item.nomor_telepon"
                      :class="{ 'is-invalid': errors[`terlapor.${index}.nomor_telepon`] }"
                    >
                  </div>
                </div>
                
                <div class="form-column">
                  <div class="form-group">
                    <label :for="`terlapor-status-${index}`">Status</label>
                    <select 
                      :id="`terlapor-status-${index}`" 
                      v-model="item.status_warga"
                      :class="{ 'is-invalid': errors[`terlapor.${index}.status_warga`] }"
                    >
                      <option value="" disabled selected>Pilih Status</option>
                      <option value="dosen">Dosen</option>
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="staff">Staff</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label :for="`terlapor-unit-${index}`">Unit Kerja</label>
                    <input 
                      type="text" 
                      :id="`terlapor-unit-${index}`" 
                      v-model="item.unit_kerja"
                      :class="{ 'is-invalid': errors[`terlapor.${index}.unit_kerja`] }"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label>Jenis Kelamin</label>
                    <div class="radio-group">
                      <div class="radio-option">
                        <input 
                          type="radio" 
                          :id="`terlapor-laki-${index}`" 
                          v-model="item.jenis_kelamin" 
                          value="laki-laki"
                        >
                        <label :for="`terlapor-laki-${index}`">Laki-laki</label>
                      </div>
                      <div class="radio-option">
                        <input 
                          type="radio" 
                          :id="`terlapor-perempuan-${index}`" 
                          v-model="item.jenis_kelamin" 
                          value="perempuan"
                        >
                        <label :for="`terlapor-perempuan-${index}`">Perempuan</label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Rentang Umur</label>
                    <div class="radio-group">
                      <div class="radio-option">
                        <input 
                          type="radio" 
                          :id="`terlapor-umur1-${index}`" 
                          v-model="item.umur_terlapor" 
                          value="<20"
                        >
                        <label :for="`terlapor-umur1-${index}`">Kurang dari 20 tahun</label>
                      </div>
                      <div class="radio-option">
                        <input 
                          type="radio" 
                          :id="`terlapor-umur2-${index}`" 
                          v-model="item.umur_terlapor" 
                          value="20-40"
                        >
                        <label :for="`terlapor-umur2-${index}`">20 - 40 tahun</label>
                      </div>
                      <div class="radio-option">
                        <input 
                          type="radio" 
                          :id="`terlapor-umur3-${index}`" 
                          v-model="item.umur_terlapor" 
                          value="40<"
                        >
                        <label :for="`terlapor-umur3-${index}`">Lebih dari 40 tahun</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button type="button" class="btn-add" @click="addTerlapor">
              <i class="fas fa-plus"></i> Tambah Terlapor
            </button>
          </div>
          
          <!-- Saksi Section -->
          <div class="form-section">
            <h3>Saksi</h3>
            <div v-if="errors.saksi" class="error-message">
              {{ typeof errors.saksi === 'string' ? errors.saksi : 'Harap isi data saksi dengan benar' }}
            </div>
            <p class="form-helper-text">Opsional: Anda dapat mengosongkan semua field saksi jika tidak ingin mengisikan.</p>
            
            <div 
              v-for="(item, index) in formData.saksi" 
              :key="`saksi-${index}`" 
              class="saksi-card"
            >
              <div class="card-header">
                <h4>Saksi #{{ index + 1 }}</h4>
                <button 
                  type="button" 
                  class="btn-remove" 
                  @click="removeSaksi(index)" 
                  :disabled="formData.saksi.length <= 1"
                >
                  <i class="fas fa-times"></i> Hapus
                </button>
              </div>
              
              <div class="form-row">
                <div class="form-column">
                  <div class="form-group">
                    <label :for="`saksi-nama-${index}`">Nama Lengkap</label>
                    <input 
                      type="text" 
                      :id="`saksi-nama-${index}`" 
                      v-model="item.nama_lengkap"
                      :class="{ 'is-invalid': errors[`saksi.${index}.nama_lengkap`] }"
                    >
                  </div>
                </div>
                
                <div class="form-column">
                  <div class="form-group">
                    <label :for="`saksi-email-${index}`">Email</label>
                    <input 
                      type="email" 
                      :id="`saksi-email-${index}`" 
                      v-model="item.email"
                      :class="{ 'is-invalid': errors[`saksi.${index}.email`] }"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label :for="`saksi-telepon-${index}`">Nomor Telepon</label>
                    <input 
                      type="text" 
                      :id="`saksi-telepon-${index}`" 
                      v-model="item.nomor_telepon"
                      :class="{ 'is-invalid': errors[`saksi.${index}.nomor_telepon`] }"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <button type="button" class="btn-add" @click="addSaksi">
              <i class="fas fa-plus"></i> Tambah Saksi
            </button>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="goBack" class="btn-secondary">Kembali</button>
            <button 
              type="button" 
              @click="submitForm" 
              class="btn-primary" 
              :disabled="submitting"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import { decryptData } from '../../../../services/encrypt';

export default {
  name: 'EditPelaporanKejadian',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      userData: null,
      laporanId: null,
      formData: {
        judul: '',
        category_id: '',
        deskripsi: '',
        nomor_telepon: '',
        nama_pelapor: '',
        ni_pelapor: '',
        lampiran_link: '',
        tanggal_kejadian: '',
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: '',
        image_path: [],
        terlapor: [],
        saksi: [],
        bukti_pelanggaran: []
      },
      originalImages: [],
      imagePreviews: [],
      categories: [],
      categoriesLoaded: false,
      loading: true,
      submitting: false,
      errors: {},
      buktiOptions: [
        { value: 'bukti_transfer', label: 'Bukti transfer, cek, bukti penyetoran, dan rekening koran bank' },
        { value: 'dokumen_rekaman', label: 'Dokumen dan/atau rekaman' },
        { value: 'foto_dokumentasi', label: 'Foto dokumentasi' },
        { value: 'surat_disposisi', label: 'Surat disposisi perintah' },
        { value: 'identitas_sumber', label: 'Identitas sumber informasi' },
        { value: 'lainnya', label: 'Lainnya' },
      ],
    };
  },
  created() {
    this.laporanId = this.$route.params.id;
    this.getCurrentUser();
    this.fetchCategories();
    this.fetchLaporanDetails();
  },
  methods: {
    getCurrentUser() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          this.userData = decryptData(encryptedUserData);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error getting user data:", error);
        return false;
      }
    },
    
    getAuthToken() {
      try {
        const token = VueCookies.get('auth_token');
        
        if (!token) {
          console.warn('Auth token not found in cookies');
          return null;
        }
        
        return token;
      } catch (error) {
        console.error('Error retrieving auth token:', error);
        return null;
      }
    },

    fetchCategories() {
      return axios.get('http://pelaporan-d3ti.my.id/api/category')
        .then(response => {
          this.categories = response.data;
          this.categoriesLoaded = true;
        })
        .catch(error => {
          console.error('Failed to fetch categories', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal memuat daftar kategori'
          });
          this.categories = [{ category_id: 0, nama: 'Kategori tidak tersedia' }];
        });
    },
    
    fetchLaporanDetails() {
      this.loading = true;
      
      this.fetchCategories()
        .finally(() => {
          const token = this.getAuthToken();
          
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          axios.get(`http://pelaporan-d3ti.my.id/api/laporan/${this.laporanId}`)
            .then(response => {
              const data = response.data;
              
              // Set basic fields
              this.formData.judul = data.judul || '';
              this.formData.category_id = data.category_id ? parseInt(data.category_id) : '';
              this.formData.deskripsi = data.deskripsi || '';
              this.formData.nomor_telepon = data.nomor_telepon || '';
              this.formData.nama_pelapor = data.nama_pelapor || '';
              this.formData.ni_pelapor = data.ni_pelapor || '';
              this.formData.lampiran_link = data.lampiran_link || '';
              this.formData.tanggal_kejadian = this.formatDateForInput(data.tanggal_kejadian) || '';
              this.formData.profesi = data.profesi || '';
              this.formData.jenis_kelamin = data.jenis_kelamin || '';
              this.formData.umur_pelapor = data.umur_pelapor || '';
              
              // Handle bukti_pelanggaran
              if (data.bukti_pelanggaran) {
                if (typeof data.bukti_pelanggaran === 'string') {
                  try {
                    this.formData.bukti_pelanggaran = JSON.parse(data.bukti_pelanggaran);
                  } catch(e) {
                    this.formData.bukti_pelanggaran = [data.bukti_pelanggaran];
                  }
                } else if (Array.isArray(data.bukti_pelanggaran)) {
                  this.formData.bukti_pelanggaran = data.bukti_pelanggaran;
                }
              } else {
                this.formData.bukti_pelanggaran = [];
              }
              
              // Handle images
              if (data.image_path) {
                try {
                  if (typeof data.image_path === 'string') {
                    const parsedImages = JSON.parse(data.image_path);
                    this.originalImages = Array.isArray(parsedImages) ? parsedImages : [data.image_path];
                  } else if (Array.isArray(data.image_path)) {
                    this.originalImages = data.image_path;
                  } else {
                    this.originalImages = [];
                  }
                } catch(e) {
                  this.originalImages = [data.image_path];
                }
                
                this.imagePreviews = [];
                
                this.originalImages.forEach(image => {
                  this.imagePreviews.push(this.getImageUrl(image));
                });
              }
              
              // Handle image_paths if available
              if (data.image_paths && Array.isArray(data.image_paths)) {
                this.originalImages = data.image_paths;
                this.imagePreviews = [];
                
                data.image_paths.forEach(image => {
                  this.imagePreviews.push(this.getImageUrl(image));
                });
              }
              
              // Handle terlapor
              if (data.terlapor) {
                if (typeof data.terlapor === 'string') {
                  try {
                    this.formData.terlapor = JSON.parse(data.terlapor);
                  } catch(e) {
                    console.error('Error parsing terlapor:', e);
                    this.formData.terlapor = [];
                  }
                } else if (Array.isArray(data.terlapor)) {
                  this.formData.terlapor = data.terlapor;
                } else {
                  this.formData.terlapor = [];
                }
              } else {
                this.formData.terlapor = [];
              }
              
              // Ensure at least one empty terlapor
              if (this.formData.terlapor.length === 0) {
                this.addTerlapor();
              }
              
              // Handle saksi
              if (data.saksi) {
                if (typeof data.saksi === 'string') {
                  try {
                    this.formData.saksi = JSON.parse(data.saksi);
                  } catch(e) {
                    console.error('Error parsing saksi:', e);
                    this.formData.saksi = [];
                  }
                } else if (Array.isArray(data.saksi)) {
                  this.formData.saksi = data.saksi;
                } else {
                  this.formData.saksi = [];
                }
              } else {
                this.formData.saksi = [];
              }
              
              // Ensure at least one empty saksi
              if (this.formData.saksi.length === 0) {
                this.addSaksi();
              }
            })
            .catch(error => {
              console.error('Failed to fetch laporan details', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memuat detail laporan'
              });
            })
            .finally(() => {
              this.loading = false;
            });
        });
    },
    
    formatDateForInput(dateString) {
      if (!dateString) return '';
      
      try {
        let date;
        
        // Handle MySQL datetime format (YYYY-MM-DD HH:MM:SS)
        if (typeof dateString === 'string' && dateString.includes(' ')) {
          const parts = dateString.split(' ');
          const datePart = parts[0];
          const timePart = parts[1] || '00:00:00';
          date = new Date(`${datePart}T${timePart}`);
        } 
        // Handle ISO format
        else if (typeof dateString === 'string' && dateString.includes('T')) {
          date = new Date(dateString);
        }
        // Handle other formats
        else {
          date = new Date(dateString);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return '';
        }
        
        // Format as YYYY-MM-DDTHH:MM
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch (error) {
        console.error('Error formatting date for input:', error);
        return '';
      }
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      
      const cleanPath = typeof imagePath === 'string' ? imagePath.replace(/['"]/g, '') : imagePath;
      
      if (typeof cleanPath === 'string' && cleanPath.startsWith('http')) {
        return cleanPath;
      }
      
      return `http://pelaporan-d3ti.my.id/Backend-Port/backend/engine/public/storage/laporan/${cleanPath}`;
    },
    
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      if (!this.formData.image_path) {
        this.formData.image_path = [];
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.formData.image_path.push(file);
        
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    handleLaporanImageError(event) {
        // If the image fails to load, try the alternative URL format
        const img = event.target;
        const currentSrc = img.src;
        
        if (currentSrc.includes('/Backend-Port/backend/engine/public/storage/')) {
            // If the first format failed, try the second format
            img.src = currentSrc.replace(
                '/Backend-Port/backend/engine/public/storage/', 
                '/public/storage/'
            );
        } else if (currentSrc.includes('/public/storage/')) {
            // If the second format failed, show a placeholder
            img.src = 'https://via.placeholder.com/150?text=No+Image';
        }
    },
    
    removeImage(index) {
      if (index < this.originalImages.length) {
        this.originalImages.splice(index, 1);
      } else {
        const newImageIndex = index - this.originalImages.length;
        this.formData.image_path.splice(newImageIndex, 1);
      }
      
      this.imagePreviews.splice(index, 1);
    },
    
    addTerlapor() {
      this.formData.terlapor.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        unit_kerja: '',
        jenis_kelamin: '',
        umur_terlapor: ''
      });
    },
    
    removeTerlapor(index) {
      if (this.formData.terlapor.length > 1) {
        this.formData.terlapor.splice(index, 1);
      }
    },
    
    addSaksi() {
      this.formData.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },
    
    removeSaksi(index) {
      if (this.formData.saksi.length > 1) {
        this.formData.saksi.splice(index, 1);
      }
    },
    
    validateTerlapor() {
      if (!this.formData.terlapor || this.formData.terlapor.length === 0) {
        return true;
      }
      
      const invalidEntries = this.formData.terlapor.filter(item => {
        const hasAnyData = item.nama_lengkap || item.email || item.nomor_telepon || 
                        item.status_warga || item.unit_kerja || item.jenis_kelamin || 
                        item.umur_terlapor;
        
        if (hasAnyData) {
          return !item.nama_lengkap || !item.status_warga || !item.unit_kerja || 
              !item.jenis_kelamin || !item.umur_terlapor;
        }
        return false;
      });
      
      return invalidEntries.length === 0;
    },
    
    validateSaksi() {
      if (!this.formData.saksi || this.formData.saksi.length === 0) {
        return true;
      }
      
      const invalidEntries = this.formData.saksi.filter(item => {
        const hasAnyData = item.nama_lengkap || item.email || item.nomor_telepon;
        
        if (hasAnyData) {
          return !item.nama_lengkap;
        }
        return false;
      });
      
      return invalidEntries.length === 0;
    },
    
    validateForm() {
      let isValid = true;
      this.errors = {};
      
      // Required fields validation
      if (!this.formData.judul) {
        this.errors.judul = ['Judul wajib diisi'];
        isValid = false;
      }
      
      if (!this.formData.category_id) {
        this.errors.category_id = ['Kategori wajib dipilih'];
        isValid = false;
      }
      
      if (!this.formData.deskripsi) {
        this.errors.deskripsi = ['Deskripsi wajib diisi'];
        isValid = false;
      }
      
      if (!this.formData.tanggal_kejadian) {
        this.errors.tanggal_kejadian = ['Tanggal kejadian wajib diisi'];
        isValid = false;
      }
      
      // Validate bukti_pelanggaran
      if (!this.formData.bukti_pelanggaran || this.formData.bukti_pelanggaran.length === 0) {
        this.errors.bukti_pelanggaran = ['Harap pilih minimal satu alat bukti'];
        isValid = false;
      }
      
      // Validate terlapor if provided
      if (!this.validateTerlapor()) {
        this.errors.terlapor = 'Jika mengisi data terlapor, harap lengkapi semua field yang diperlukan';
        isValid = false;
      }
      
      // Validate saksi if provided
      if (!this.validateSaksi()) {
        this.errors.saksi = 'Jika mengisi data saksi, harap lengkapi setidaknya nama saksi';
        isValid = false;
      }
      
      return isValid;
    },
    
    submitForm() {
      try {
        // Validation
        if (!this.validateForm()) {
          this.submitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Harap perbaiki kesalahan pada form'
          });
          return;
        }
        
        this.submitting = true;
        this.errors = {};
        
        // Create FormData instance
        const formData = new FormData();
        
        // Add basic text fields
        formData.append('judul', this.formData.judul);
        formData.append('category_id', this.formData.category_id);
        formData.append('deskripsi', this.formData.deskripsi);
        formData.append('nomor_telepon', this.formData.nomor_telepon || '');
        formData.append('nama_pelapor', this.formData.nama_pelapor || '');
        formData.append('ni_pelapor', this.formData.ni_pelapor || '');
        formData.append('lampiran_link', this.formData.lampiran_link || '');
        formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
        formData.append('profesi', this.formData.profesi || '');
        formData.append('jenis_kelamin', this.formData.jenis_kelamin || '');
        formData.append('umur_pelapor', this.formData.umur_pelapor || '');
        
        // Method spoofing for Laravel
        formData.append('_method', 'PUT');
        
        // Filter out empty objects from terlapor array
        let terlapor = (this.formData.terlapor || []).filter(t => 
          t.nama_lengkap || t.email || t.nomor_telepon || t.status_warga
        );
        
        // Create individual array entries for bukti_pelanggaran[]
        if (this.formData.bukti_pelanggaran && this.formData.bukti_pelanggaran.length > 0) {
          this.formData.bukti_pelanggaran.forEach((item, index) => {
            formData.append(`bukti_pelanggaran[${index}]`, item);
          });
        } else {
          formData.append('bukti_pelanggaran[]', '');
        }
        
        // Handle terlapor as individual array entries
        if (terlapor.length > 0) {
          terlapor.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              if (item[key]) {
                formData.append(`terlapor[${index}][${key}]`, item[key]);
              }
            });
          });
        } else {
          formData.append('terlapor[]', '');
        }
        
        // Filter out empty objects from saksi array
        let saksi = (this.formData.saksi || []).filter(s => 
          s.nama_lengkap || s.email || s.nomor_telepon
        );
        
        // Handle saksi as individual array entries
        if (saksi.length > 0) {
          saksi.forEach((item, index) => {
            Object.keys(item).forEach(key => {
              if (item[key]) {
                formData.append(`saksi[${index}][${key}]`, item[key]);
              }
            });
          });
        } else {
          formData.append('saksi[]', '');
        }
        
        // Handle new image uploads
        if (this.formData.image_path && this.formData.image_path.length > 0) {
          for (let i = 0; i < this.formData.image_path.length; i++) {
            formData.append(`new_images[${i}]`, this.formData.image_path[i]);
          }
        }
        
        // Keep existing images
        if (this.originalImages && this.originalImages.length > 0) {
          this.originalImages.forEach((image, index) => {
            formData.append(`keep_images[${index}]`, image);
          });
        } else {
          formData.append('keep_images[]', '');
        }
        
        const token = VueCookies.get('auth_token');
        
        if (!token) {
          this.submitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Token autentikasi tidak ditemukan'
          });
          return;
        }
        
        // Create and configure XHR
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://pelaporan-d3ti.my.id/api/laporan/update/${this.laporanId}`);
        
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = () => {
          this.submitting = false;
          
          if (xhr.status >= 200 && xhr.status < 300) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Data berhasil diperbarui',
              confirmButtonText: 'OK'
            }).then(() => {
              this.$router.go(-1);
            });
          } else {
            let errorMessage = 'Gagal memperbarui data. Silakan coba lagi.';
            
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.message) {
                errorMessage = response.message;
              }
              
              if (response.errors) {
                this.errors = response.errors;
                
                const errorDetails = Object.entries(response.errors)
                  .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                  .join('\n');
                  
                errorMessage += '\n\n' + errorDetails;
              }
            } catch (e) {
              console.error('Error parsing error response:', e);
            }
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMessage,
              customClass: {
                content: 'text-left'
              }
            });
          }
        };
        
        xhr.onerror = () => {
          this.submitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.'
          });
        };
        
        xhr.send(formData);
      } catch (e) {
        this.submitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan yang tidak diharapkan'
        });
      }
    },
    
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.edit-laporan-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 700;
  font-size: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #2563eb;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.required {
  color: #dc2626;
}

input[type="text"],
input[type="email"],
input[type="datetime-local"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="datetime-local"]:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.is-invalid {
  border-color: #dc2626 !important;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  margin-top: 5px;
}

small, .text-muted {
  color: #6b7280;
  font-size: 14px;
}

.form-section {
  margin-top: 40px;
  border-top: 1px solid #e5e7eb;
  padding-top: 30px;
}

.form-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-helper-text {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.terlapor-card, .saksi-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h4 {
  margin: 0;
  color: #333;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-column {
  flex: 1;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 15px;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
}

.checkbox-option input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 3px;
}

.custom-file-upload {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 10px;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.image-preview-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  color: #dc2626;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add, .btn-remove {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add {
  background-color: #e5e7eb;
  color: #4b5563;
  border: none;
}

.btn-add:hover {
  background-color: #d1d5db;
}

.btn-remove {
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.btn-remove:hover {
  background-color: #fee2e2;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-remove i, .btn-add i {
  margin-right: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #4b5563;
  border: none;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
  
  .btn-secondary {
    order: 2;
  }
}
</style>