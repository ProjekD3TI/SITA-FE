<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header :userData="userData" />
      <div class="content-wrapper">
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Memuat data laporan...</p>
        </div>
        
        <div v-else-if="error" class="loading-container">
          <div class="error-container">
            <p>{{ error }}</p>
            <button @click="fetchLaporan(laporanId)" class="btn btn-primary">Coba Lagi</button>
          </div>
        </div>
        
        <div v-else class="detail-content">
          <div class="header-section">
            <!-- Back button at the top -->
            <div class="w-full mb-3">
              <div class="back-button" @click="goBack">
                <i class="fas fa-arrow-left"></i> Kembali
              </div>
            </div>
            
            <!-- Detail information below the back button -->
            <div class="flex flex-wrap items-center w-full">
              <div class="left-content">
                <h2 class="text-2xl font-semibold">Detail Laporan Kejadian</h2>
                <div class="laporan-id">{{ laporan.nomor_laporan }}</div>
              </div>
              
              <!-- Wrap both buttons and status badge in a single container -->
              <div class="actions-status-wrapper">
                <div class="action-btn-container">
                  <button 
                    v-if="laporan && laporan.status === 'verified'" 
                    class="edit-button blue-btn"
                    @click="goToEditLaporan"
                    title="Lengkapi atau ubah data laporan">
                    <i class="fas fa-edit"></i> <span>Edit Laporan</span>
                  </button>
                </div>
                
                <div class="status-badge" :class="getStatusClass">
                  {{ formatStatus(laporan.status) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h3>Informasi Kejadian</h3>
            <div class="category-badge" v-if="laporan.category_id">
              <i class="fas fa-tag"></i> {{ getCategoryName(laporan.category_id) }}
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Tanggal dan Waktu Kejadian</div>
                <div class="value">{{ formatedDate(laporan.tanggal_kejadian) }}</div>
              </div>
              <div class="info-item">
                <div class="label">Kategori Kejadian</div>
                <div class="value">{{ getCategoryName(laporan.category_id) || laporan.jenis_kejadian || "-" }}</div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h3>Detail Kejadian</h3>
            <h4 v-if="laporan.judul" class="kejadian-judul">{{ laporan.judul }}</h4>
            <p class="deskripsi">{{ laporan.deskripsi || laporan.deskripsi_kejadian }}</p>
            
            <!-- Image Section - Updated for multiple images -->
            <div v-if="imagePaths && imagePaths.length > 0" class="foto-section">
              <h4>Foto Kejadian</h4>
              
              <!-- Image grid for all images -->
              <div class="image-grid">
                <div v-for="(path, index) in imagePaths" :key="index" class="image-item">
                  <img 
                    :src="getImageUrlForPath(path)"
                    :alt="`Foto Kejadian ${index + 1}`"
                    class="kejadian-image-thumbnail" 
                    @click="openFullImage(index)"
                    @error="handleImageError($event, index)"
                  >
                </div>
              </div>
              
              <div class="image-caption">Klik untuk memperbesar gambar</div>
            </div>
          </div>
          
          <div class="card">
            <h3>Informasi Pelapor</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Nama</div>
                <div class="value">{{ laporan.nama_pelapor }}</div>
              </div>
              <div class="info-item">
                <div class="label">NI Pelapor</div>
                <div class="value">{{ laporan.ni_pelapor || laporan.nim_pelapor || "-" }}</div>
              </div>
              <div class="info-item">
                <div class="label">Email</div>
                <div class="value">{{ laporan.email || laporan.email_pelapor || "-" }}</div>
              </div>
              <div class="info-item">
                <div class="label">Telepon</div>
                <div class="value">{{ laporan.nomor_telepon || laporan.telepon_pelapor || "-" }}</div>
              </div>
              <div class="info-item" v-if="laporan.profesi">
                <div class="label">Profesi</div>
                <div class="value">{{ laporan.profesi }}</div>
              </div>
              <div class="info-item" v-if="laporan.jenis_kelamin">
                <div class="label">Jenis Kelamin</div>
                <div class="value">{{ capitalizeSentence(laporan.jenis_kelamin) }}</div>
              </div>
              <div class="info-item" v-if="laporan.umur_pelapor">
                <div class="label">Umur</div>
                <div class="value">{{ laporan.umur_pelapor }}</div>
              </div>
            </div>
          </div>
          
          <!-- Terlapor (Reported Person) Section -->
          <div class="card" v-if="hasReportedPersons">
            <h3>Informasi Terlapor</h3>
            <div v-for="(person, index) in laporan.terlapor" :key="'reported-' + index" class="person-item">
              <h4 class="person-title">Terlapor {{ index + 1 }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Nama Lengkap</div>
                  <div class="value">{{ person.nama_lengkap || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Email</div>
                  <div class="value">{{ person.email || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Telepon</div>
                  <div class="value">{{ person.nomor_telepon || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Status</div>
                  <div class="value">{{ capitalizeSentence(person.status_warga) || '-' }}</div>
                </div>
                <div class="info-item" v-if="person.unit_kerja">
                  <div class="label">Unit Kerja / Fakultas</div>
                  <div class="value">{{ person.unit_kerja }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Saksi (Witnesses) Section -->
          <div class="card" v-if="hasWitnesses">
            <h3>Informasi Saksi</h3>
            <div v-for="(witness, index) in laporan.saksi" :key="'witness-' + index" class="person-item">
              <h4 class="person-title">Saksi {{ index + 1 }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Nama Lengkap</div>
                  <div class="value">{{ witness.nama_lengkap || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Email</div>
                  <div class="value">{{ witness.email || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Telepon</div>
                  <div class="value">{{ witness.nomor_telepon || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- External Link Section -->
          <div class="card" v-if="laporan.lampiran_link">
            <h3>Link Lampiran Pendukung</h3>
            <div class="link-container">
              <a :href="laporan.lampiran_link" target="_blank" class="external-link">
                <i class="fas fa-external-link-alt"></i> {{ laporan.lampiran_link }}
              </a>
            </div>
          </div>
          
          <div class="card">
            <h3>Status Laporan</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Status</div>
                <div class="value">
                  <span class="status-badge" :class="getStatusClass">
                    {{ formatStatus(laporan.status) }}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">Tanggal Laporan</div>
                <div class="value">{{ formatDate(laporan.created_at) }}</div>
              </div>
              <div class="info-item">
                <div class="label">Terakhir Diperbarui</div>
                <div class="value">{{ formatDate(laporan.updated_at) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Tanggapan Card -->
          <div class="card" v-if="hasTanggapan">
            <h3>
              <i class="fas fa-comment-alt"></i> Tanggapan
            </h3>
            
            <!-- For string tanggapan (old format) -->
            <p class="tanggapan-text" v-if="typeof laporan.tanggapan === 'string'">
              {{ laporan.tanggapan }}
            </p>
            
            <!-- For array tanggapan (new format) -->
            <div v-else class="tanggapan-list">
              <div v-for="(item, index) in laporan.tanggapan" :key="index" class="tanggapan-item">
                <div class="tanggapan-header">
                  <span class="tanggapan-user">
                    {{ item.role === 'kalab' ? 'Kalab - ' : '' }}{{ item.user || 'Admin' }}
                  </span>
                  <span class="tanggapan-time">{{ formatDate(item.timestamp) }}</span>
                </div>
                <p class="tanggapan-text">{{ item.text }}</p>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons for admin -->
          <div class="action-buttons" v-if="isAdmin">
            <button class="btn btn-secondary" @click="showTanggapanModal = true" v-if="laporan.status !== 'finished'">
              <i class="fas fa-comment"></i> Tambah Tanggapan
            </button>
            <button class="btn btn-success" @click="finishReport" v-if="laporan.status !== 'finished' && laporan.status !== 'unverified'">
              <i class="fas fa-check-circle"></i> Tutup Laporan
            </button>
          </div>
        </div>
        
        <!-- Modal for full image view -->
        <div class="fullscreen-modal" v-if="showFullImage" @click="showFullImage = false">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img 
              :src="currentFullImageUrl"
              alt="Bukti Kejadian" 
              class="fullscreen-image"
            >
            
            <!-- Navigation buttons for multiple images -->
            <div v-if="imagePaths && imagePaths.length > 1" class="image-navigation">
              <button class="nav-button prev" @click.stop="prevImage">&lt;</button>
              <div class="image-counter">{{ currentImageIndex + 1 }} / {{ imagePaths.length }}</div>
              <button class="nav-button next" @click.stop="nextImage">&gt;</button>
            </div>
          </div>
        </div>
        
        <!-- Modal for adding tanggapan -->
        <div class="modal-overlay" v-if="showTanggapanModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3>Tambah Tanggapan</h3>
              <button class="close-button" @click="showTanggapanModal = false">&times;</button>
            </div>
            <div class="modal-body">
              <textarea 
                v-model="tanggapanText" 
                placeholder="Masukkan tanggapan anda di sini..." 
                rows="5"
                class="tanggapan-textarea">
              </textarea>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" @click="showTanggapanModal = false">Batal</button>
              <button class="btn-save" @click="saveTanggapan" :disabled="!tanggapanText.trim()">
                Simpan Tanggapan
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';

export default {
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      authToken: null,
      laporanId: null,
      laporan: {},
      categories: {},
      loading: true,
      error: null,
      isAdmin: false,
      showFullImage: false,
      showTanggapanModal: false,
      tanggapanText: '',
      currentUser: localStorage.getItem('userName') || 'Miftahul',
      apiBaseUrl: 'http://pelaporan-d3ti.my.id/api',
      baseUrl: 'http://pelaporan-d3ti.my.id',
      
      // Image handling properties
      imagePaths: [],
      currentImageIndex: 0,
      currentFullImageUrl: '',
      userData: null
    };
  },
  created() {
    this.getAuthToken();
    this.laporanId = this.$route.params.id;
    
    this.getCurrentUser();
    
    if (!this.laporanId) {
      this.error = "ID laporan tidak ditemukan";
      this.loading = false;
      return;
    }
    
    this.fetchCategories();
    this.fetchLaporan(this.laporanId);
    this.checkUserRole();
  },
  computed: {
    getStatusClass() {
      const statusMap = {
        'unverified': 'status-waiting',
        'verified': 'status-processing',
        'rejected': 'status-rejected',
        'finished': 'status-completed',
      };
      return statusMap[this.laporan.status] || 'status-default';
    },
    hasTanggapan() {
      if (!this.laporan) return false;
      if (!this.laporan.tanggapan) return false;
      
      if (Array.isArray(this.laporan.tanggapan)) {
        return this.laporan.tanggapan.length > 0;
      }
      
      return typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '';
    },
    hasReportedPersons() {
      return this.laporan && this.laporan.terlapor && 
             Array.isArray(this.laporan.terlapor) && this.laporan.terlapor.length > 0;
    },
    hasWitnesses() {
      return this.laporan && this.laporan.saksi && 
             Array.isArray(this.laporan.saksi) && this.laporan.saksi.length > 0;
    },
    canEditLaporan() {
      return this.laporan && this.laporan.status === 'verified';
    },
  },
  methods: {
    checkAuth() {
      const token = VueCookies.get("auth_token");
      if (!token) {
        this.error = "Sesi login telah berakhir. Silakan login kembali.";
        return false;
      }
      return true;
    },
    
    goToEditLaporan() {
      if (!this.checkAuth()) return;
      
      // Add check for verified status
      if (this.laporan && this.laporan.status !== 'verified') {
        Swal.fire({
          icon: 'error',
          title: 'Tidak Dapat Mengedit',
          text: 'Laporan hanya dapat diedit ketika berstatus Diproses (Verified)',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      
      this.$router.push({ name: 'EditPelaporanKejadian', params: { id: this.laporanId } });
    },

    capitalizeSentence(text) {
      if (!text) return '';
      return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    },

    getAuthToken() {
      const token = VueCookies.get("auth_token");
      if (token) {
        this.authToken = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        this.error = "Sesi login telah berakhir. Silakan login kembali.";
      }
    },

    getCurrentUser() {
      try {
        const encryptedUserData = this.$cookies.get("user_session");
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
    
    parseImagePaths(imagePath) {
      if (!imagePath) {
        return [];
      }
      
      if (typeof imagePath === 'string') {
        if ((imagePath.startsWith('[') && imagePath.endsWith(']')) || 
            (imagePath.startsWith('"[') && imagePath.endsWith(']"'))) {
          
          try {
            let cleanedPath = imagePath.replace(/\\/g, '');
            
            if (cleanedPath.startsWith('"') && cleanedPath.endsWith('"')) {
              cleanedPath = cleanedPath.substring(1, cleanedPath.length - 1);
            }
            
            const parsed = JSON.parse(cleanedPath);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
        
        if (imagePath.includes(',')) {
          return imagePath.split(',').map(item => item.trim());
        }
        
        return [imagePath];
      }
      
      if (Array.isArray(imagePath)) {
        return imagePath;
      }
      
      return [];
    },

    getImageUrlForPath(path) {
      if (!path) return '';
      
      if (path.startsWith('http')) {
        return path;
      }
      
      const cleanPath = path.replace(/['"]/g, '');
      
      return `${this.baseUrl}/Backend-Port/backend/engine/public/storage/laporan/${cleanPath}`;
    },

    handleImageError(event, index) {
      const img = event.target;
      const originalSrc = img.src;
      const path = this.imagePaths[index];
      
      if (originalSrc.includes('fallback=4')) {
        img.src = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
        return;
      }
      
      const baseDomain = this.baseUrl;
      let newUrl;
      
      if (!originalSrc.includes('fallback=')) {
        newUrl = `${baseDomain}/public/storage/laporan/${path}?fallback=2`;
      } else if (originalSrc.includes('fallback=2')) {
        newUrl = `${baseDomain}/storage/laporan/${path}?fallback=3`;
      } else if (originalSrc.includes('fallback=3')) {
        newUrl = `${baseDomain}/storage/${path}?fallback=4`;
      } else {
        newUrl = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
      }
      
      img.src = newUrl;
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/category`);
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          this.categories = response.data.data.reduce((acc, category) => {
            acc[category.category_id || category.id] = category.nama || category.name;
            return acc;
          }, {});
        } else if (Array.isArray(response.data)) {
          this.categories = response.data.reduce((acc, category) => {
            acc[category.category_id || category.id] = category.nama || category.name;
            return acc;
          }, {});
        } else {
          console.error('Unexpected category data format:', response.data);
          this.categories = {};
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.categories = {};
      }
    },
    
    async fetchLaporan(id) {
      if (!id) {
        this.error = "ID laporan tidak valid";
        this.loading = false;
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${this.apiBaseUrl}/laporan/${id}`);
        
        if (response.data && response.data.data) {
          this.laporan = response.data.data;
        } else {
          this.laporan = response.data;
        }
        
        // Process image paths
        if (this.laporan.image_path) {
          let imagePathData = this.laporan.image_path;
          
          if (typeof imagePathData === 'string' && imagePathData.startsWith('"[') && imagePathData.endsWith(']"')) {
            try {
              imagePathData = JSON.parse(imagePathData);
            } catch (e) {
              console.error('Error unescaping image_path:', e);
            }
          }
          
          this.imagePaths = this.parseImagePaths(imagePathData);
          this.laporan.image_paths = this.imagePaths;
        }
        
        // Process tanggapan data
        if (this.laporan.tanggapan) {
          try {
            const parsed = JSON.parse(this.laporan.tanggapan);
            if (Array.isArray(parsed)) {
              this.laporan.tanggapan = parsed;
            }
          } catch (e) {
            // If it's not valid JSON, keep it as a string
          }
        }
        
        this.tanggapanText = '';
        this.loading = false;
      } catch (error) {
        console.error('Error fetching laporan:', error);
        
        if (error.response) {
          this.error = `Error ${error.response.status}: ${error.response.data.message || 'Gagal memuat data laporan'}`;
        } else if (error.request) {
          this.error = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else {
          this.error = error.message || 'Gagal memuat data laporan';
        }
        
        this.loading = false;
      }
    },
    
    openFullImage(index) {
      if (this.imagePaths && this.imagePaths.length > index) {
        this.currentImageIndex = index;
        this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[index]);
        this.showFullImage = true;
      }
    },
    
    nextImage(e) {
      if (e) e.stopPropagation();
      if (!this.imagePaths || this.imagePaths.length <= 1) return;
      
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagePaths.length;
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[this.currentImageIndex]);
    },
    
    prevImage(e) {
      if (e) e.stopPropagation();
      if (!this.imagePaths || this.imagePaths.length <= 1) return;
      
      this.currentImageIndex = (this.currentImageIndex - 1 + this.imagePaths.length) % this.imagePaths.length;
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[this.currentImageIndex]);
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    formatedDate(dateString) {
      if (!dateString) return '-';
      
      try {
        let date = new Date(dateString.replace(' ', 'T') + 'Z');
        
        const options = { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        };
        
        return date.toLocaleDateString('id-ID', options);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString || '-';
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      
      try {
        const date = new Date(dateString);
        
        const formatter = new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta'
        });
        
        return formatter.format(date);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString || '-';
      }
    },
    
    formatStatus(status) {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Diproses',
        'rejected': 'Ditolak',
        'finished': 'Laporan Selesai',
      };
      
      return statusMap[status] || status || '-';
    },
    
    getCategoryName(categoryId) {
      return this.categories[categoryId] || `Kategori ${categoryId}`;
    },
    
    checkUserRole() {
      // For demonstration, set to true
      this.isAdmin = true;
    },
    
    async finishReport() {
      try {
        if (!this.laporanId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Laporan ID tidak ditemukan',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          return;
        }
        
        const result = await Swal.fire({
          title: 'Tutup Kasus Laporan',
          text: 'Apakah Anda yakin ingin menutup dan menyelesaikan kasus laporan ini?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, Selesaikan!',
          cancelButtonText: 'Batal'
        });
        
        if (!result.isConfirmed) {
          return;
        }
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'finished');
        
        if (this.laporan.tanggapan) {
          let tanggapanData = this.laporan.tanggapan;
          
          if (typeof tanggapanData !== 'string') {
            tanggapanData = JSON.stringify(tanggapanData);
          }
          
          formData.append('tanggapan', tanggapanData);
        }

        const response = await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          formData
        );
                      
        this.laporan.status = 'finished';
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan berhasil ditutup dan selesai',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        
        await this.fetchLaporan(this.laporanId);
        
      } catch (error) {
        console.error('Error finishing report:', error);
        const errorMessage = error.response?.data?.message || 'Gagal menyelesaikan laporan';
        
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: `Gagal menyelesaikan laporan: ${errorMessage}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    },
    
    async saveTanggapan() {
      try {
        if (!this.laporanId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Laporan ID tidak ditemukan',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          return;
        }
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('tanggapan', this.tanggapanText);
        
        if (this.laporan && this.laporan.status) {
          formData.append('status', this.laporan.status);
        } else {
          formData.append('status', 'pending');
        }
        
        const response = await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          formData
        );
        
        const updatedResponse = await axios.get(`${this.apiBaseUrl}/laporan/${this.laporanId}`);
        const updatedData = updatedResponse.data.data || updatedResponse.data;
        
        const newTanggapan = {
          text: this.tanggapanText,
          timestamp: updatedData.updated_at,
          user: this.currentUser
        };
        
        let tanggapanArray = [];
        
        if (this.laporan.tanggapan) {
          if (Array.isArray(this.laporan.tanggapan)) {
            tanggapanArray = [...this.laporan.tanggapan];
          } else if (typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '') {
            tanggapanArray = [{
              text: this.laporan.tanggapan,
              timestamp: this.laporan.updated_at,
              user: 'Admin'
            }];
          }
        }
        
        tanggapanArray.push(newTanggapan);
        
        const arrayFormData = new FormData();
        arrayFormData.append('_method', 'PUT');
        arrayFormData.append('tanggapan', JSON.stringify(tanggapanArray));
        
        if (this.laporan && this.laporan.status) {
          arrayFormData.append('status', this.laporan.status);
        } else {
          arrayFormData.append('status', 'pending');
        }

        await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          arrayFormData
        );
        
        this.laporan.tanggapan = tanggapanArray;
        this.laporan.updated_at = updatedData.updated_at;
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Tanggapan berhasil disimpan',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        
        this.tanggapanText = '';
        this.showTanggapanModal = false;
        
        await this.fetchLaporan(this.laporanId);
        
      } catch (error) {
        console.error('Error saving tanggapan:', error);
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Gagal menyimpan tanggapan';
        
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: `Gagal menyimpan tanggapan: ${errorMessage}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    }
  }
};
</script>

<style scoped>
.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.error-container {
  text-align: center;
  padding: 20px;
  max-width: 500px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f3f4f6;
  margin-bottom: 10px;
  width: fit-content;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #e5e7eb;
}

.back-button i {
  margin-right: 8px;
}

.header-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.header-section .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.header-section .left-content {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: auto; /* Pushes other content to the right */
}

.header-section h2 {
  margin-right: 15px;
  margin-bottom: 0;
}

.laporan-id {
  font-weight: 500;
  margin-right: 20px;
  color: #666;
}

.status-badge {
  margin-left: 0; /* Remove auto margin that was pushing it to the right edge */
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.actions-status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px; /* Controls spacing between button and badge */
}

.status-processing {
  background-color: #fff3e0;
  color: #ef6c00;
}

.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-rejected {
  background-color: #ffebee;
  color: #c62828;
}

.status-waiting {
  background-color: #fff3e0;
  color: #ef6c00;
}

.status-finished {
  background-color: #d1fae5;
  color: #059669;
}

.action-btn-container {
  display: flex;
  align-items: center;
  margin-right: 8px; /* Small space between button and badge */
  gap: 10px;
}

.blue-btn {
  background-color: #3490dc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.blue-btn:hover {
  background-color: #2779bd;
}

.blue-btn i {
  font-size: 1rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.category-badge {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
}

.category-badge i {
  margin-right: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.info-item .label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.info-item .value {
  font-weight: 500;
  word-break: break-word;
  overflow-wrap: break-word;
}

.kejadian-judul {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.deskripsi, .tanggapan-text {
  line-height: 1.6;
  white-space: pre-line;
}

.foto-section {
  margin-top: 20px;
}

.foto-section h4 {
  margin-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.kejadian-image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.kejadian-image-thumbnail:hover {
  transform: scale(1.05);
}

.image-caption {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.person-item {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.person-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.person-title {
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid #3b82f6;
}

.link-container {
  margin-top: 10px;
}

.external-link {
  display: inline-block;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.external-link:hover {
  text-decoration: underline;
}

.external-link i {
  margin-right: 6px;
}

.tanggapan-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tanggapan-item {
  border-left: 3px solid #3b82f6;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.tanggapan-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tanggapan-user {
  font-weight: 600;
  color: #4b5563;
}

.tanggapan-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-modal {
  position: absolute;
  top: 20px;
  right: 30px;
  color: white;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
}

.image-navigation {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.image-counter {
  color: white;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-weight: 600;
  color: #111827;
  margin: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 24px;
}

.tanggapan-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel, .btn-save {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-save {
  background-color: #2563eb;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .header-section .flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions-status-wrapper {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between; /* On mobile, space them out more */
  }
  
  .status-badge {
    margin-left: 0;
  }
  
  .action-btn-container {
    margin-right: 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>