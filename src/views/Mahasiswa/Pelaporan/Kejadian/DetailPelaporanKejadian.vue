<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
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
              <h2 class="text-2xl font-semibold mr-3">Detail Laporan Kejadian</h2>
              <div class="laporan-id mr-3">{{ laporan.nomor_laporan }}</div>
              <div class="status-badge" :class="getStatusClass">{{ formatStatus(laporan.status) }}</div>
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
                <div class="value">{{ formatDate(laporan.tanggal_kejadian) }}</div>
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
                  >
                </div>
              </div>
              
              <div class="image-caption">Klik untuk memperbesar gambar</div>
            </div>
          </div>
          
          <div class="card">
            <h3>Informasi Pelapor</h3>
            <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px; row-gap: 20px;">
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
                <div class="value" style="word-break: break-word; overflow-wrap: break-word;">{{ laporan.email || laporan.email_pelapor || "-" }}</div>
              </div>
              <div class="info-item">
                <div class="label">Telepon</div>
                <div class="value">{{ laporan.nomor_telepon || laporan.telepon_pelapor || "-" }}</div>
              </div>
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
                  <span class="tanggapan-user">{{ item.user || 'Admin' }}</span>
                  <span class="tanggapan-time">{{ formatDate(item.timestamp) }}</span>
                </div>
                <p class="tanggapan-text">{{ item.text }}</p>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons - Tombol untuk admin -->
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

export default {
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
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
      apiBaseUrl: 'https://v3422040.mhs.d3tiuns.com/api',
      
      // New properties for better image handling
      imagePaths: [],
      currentImageIndex: 0,
      currentFullImageUrl: ''
    };
  },
  created() {
    this.laporanId = this.$route.params.id;
    
    // Get current user information
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
    }
  },
  methods: {
    getCurrentUser() {
      // Get current user information from localStorage or any other auth source
      this.currentUser = localStorage.getItem('userName') || 'Miftahul';
      
      // If no user in localStorage, try to get from authenticated user object
      if (this.currentUser === 'Miftahul' && localStorage.getItem('user')) {
        try {
          const userObj = JSON.parse(localStorage.getItem('user'));
          if (userObj && userObj.name) {
            this.currentUser = userObj.name;
          }
        } catch (e) {
          console.error('Failed to parse user from localStorage', e);
        }
      }
    },
    
    // First, remove the duplicate parseImagePaths method - you have two versions defined
// Keep only this version with improvements:

parseImagePaths(imagePath) {
  console.log('[DEBUG] parseImagePaths input:', imagePath);
  
  if (!imagePath) {
    console.log('[DEBUG] parseImagePaths: empty input');
    return [];
  }
  
  // If it's a string, handle different formats
  if (typeof imagePath === 'string') {
    // Check if it looks like JSON format
    if ((imagePath.startsWith('[') && imagePath.endsWith(']')) || 
        (imagePath.startsWith('"[') && imagePath.endsWith(']"'))) {
      
      console.log('[DEBUG] Attempting to parse as JSON array');
      try {
        // Clean up the string for parsing
        let cleanedPath = imagePath.replace(/\\/g, '');
        
        // If it's double-quoted JSON string, remove outer quotes
        if (cleanedPath.startsWith('"') && cleanedPath.endsWith('"')) {
          cleanedPath = cleanedPath.substring(1, cleanedPath.length - 1);
        }
        
        console.log('[DEBUG] Cleaned JSON string:', cleanedPath);
        
        const parsed = JSON.parse(cleanedPath);
        if (Array.isArray(parsed)) {
          console.log('[DEBUG] Successfully parsed as array with length:', parsed.length);
          return parsed;
        } else {
          console.log('[DEBUG] JSON parsing result is not an array');
        }
      } catch (e) {
        console.error('[DEBUG] Error parsing JSON:', e);
      }
    }
    
    // If string contains commas, it might be a comma-separated list
    if (imagePath.includes(',')) {
      console.log('[DEBUG] Treating as comma-separated list');
      return imagePath.split(',').map(item => item.trim());
    }
    
    // If none of the above worked, treat as single path
    console.log('[DEBUG] Treating as single file path');
    return [imagePath];
  }
  
  // Handle case where image_path is already an array
  if (Array.isArray(imagePath)) {
    console.log('[DEBUG] Input is already an array with length:', imagePath.length);
    return imagePath;
  }
  
  console.log('[DEBUG] Could not process input, returning empty array');
  return [];
},

getImageUrlForPath(path) {
  console.log('[DEBUG] getImageUrlForPath input:', path);
  
  if (!path) {
    console.log('[DEBUG] Empty path provided');
    return '';
  }
  
  // Check if path is already a full URL
  if (path.startsWith('http')) {
    console.log('[DEBUG] Path is already a full URL');
    return path;
  }
  
  // Clean the path
  // Replace any special characters or weird sequences
  let cleanPath = path;
  
  // Remove quotes if present
  if (cleanPath.startsWith('"') && cleanPath.endsWith('"')) {
    cleanPath = cleanPath.substring(1, cleanPath.length - 1);
  }
  
  // Remove any characters that aren't part of filenames
  cleanPath = cleanPath.replace(/[^\w\-\.\/]/g, '');
  
  console.log('[DEBUG] Cleaned path:', cleanPath);
  
  // Try all possible URL formats based on your server structure
  // Return the most likely URL format
  const baseUrl = 'https://v3422040.mhs.d3tiuns.com';
  
  // If the image was just uploaded, it might be in the storage/laporan folder
  const url = `${baseUrl}/storage/laporan/${cleanPath}`;
  console.log('[DEBUG] Returning URL:', url);
  return url;
},

handleImageError(event, index) {
  console.log(`[DEBUG] Image at index ${index} failed to load:`, this.imagePaths[index]);
  
  // Try alternative URL formats as fallbacks
  const img = event.target;
  const originalSrc = img.src;
  const path = this.imagePaths[index];
  
  // If we've already tried all fallbacks, show placeholder
  if (originalSrc.includes('fallback=3')) {
    console.log('[DEBUG] All fallbacks exhausted, showing placeholder');
    img.src = 'https://via.placeholder.com/150?text=Not+Found';
    return;
  }
  
  // Try different paths in sequence based on fallback count
  const fallbackCount = originalSrc.includes('fallback=') ? 
    parseInt(originalSrc.split('fallback=')[1][0]) + 1 : 1;
    
  console.log('[DEBUG] Trying fallback', fallbackCount);
  
  const baseUrl = 'https://v3422040.mhs.d3tiuns.com';
  let newSrc;
  
  // Clean the path for better compatibility
  const cleanPath = path.replace(/[^\w\-\.]/g, '');
  
  switch(fallbackCount) {
    case 1:
      // Try public/storage path
      newSrc = `${baseUrl}/public/storage/laporan/${cleanPath}?fallback=1`;
      break;
    case 2:
      // Try storage/app/public path
      newSrc = `${baseUrl}/storage/app/public/laporan/${cleanPath}?fallback=2`;
      break;
    case 3:
      // Try without laporan subfolder
      newSrc = `${baseUrl}/storage/${cleanPath}?fallback=3`;
      break;
    default:
      // Final fallback to placeholder
      newSrc = 'https://via.placeholder.com/150?text=Not+Found';
  }
  
  console.log('[DEBUG] Trying URL:', newSrc);
  img.src = newSrc;
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
    console.log('[DEBUG] API response:', response.data);
    
    // Handle different response formats
    if (response.data && response.data.data) {
      this.laporan = response.data.data;
    } else {
      this.laporan = response.data;
    }
    
    // Log the raw image_path data from the API
    console.log('[DEBUG] Raw image_path from API:', this.laporan.image_path);
    
    // Check data type and log it
    console.log('[DEBUG] image_path data type:', typeof this.laporan.image_path);
    
    // Process image paths
    if (this.laporan.image_path) {
      // Try to fix common issues with data format before parsing
      let imagePathData = this.laporan.image_path;
      
      // Fix double-encoded JSON (common issue)
      if (typeof imagePathData === 'string' && imagePathData.startsWith('"[') && imagePathData.endsWith(']"')) {
        try {
          // First unescape the string
          imagePathData = JSON.parse(imagePathData);
          console.log('[DEBUG] Unescaped image_path:', imagePathData);
        } catch (e) {
          console.error('[DEBUG] Error unescaping image_path:', e);
        }
      }
      
      this.imagePaths = this.parseImagePaths(imagePathData);
      console.log('[DEBUG] Processed imagePaths array:', this.imagePaths);
      
      if (this.imagePaths.length > 0) {
        // Log the first image URL for debugging
        const firstImageUrl = this.getImageUrlForPath(this.imagePaths[0]);
        console.log('[DEBUG] First image URL:', firstImageUrl);
        
        // Log all image URLs
        this.imagePaths.forEach((path, index) => {
          console.log(`[DEBUG] Image ${index} URL:`, this.getImageUrlForPath(path));
        });
        
        // Try to make a direct fetch request to verify the URL
        this.checkImageUrlsViaFetch();
      }
      
      // Store in laporan object for consistency
      this.laporan.image_paths = this.imagePaths;
    }
    
    // Rest of your existing code...
    
    this.tanggapanText = '';
    this.loading = false;
  } catch (error) {
    console.error('[DEBUG] Error fetching laporan:', error);
    
    // Rest of your existing error handling...
    
    this.loading = false;
  }
},

// New method to check image URLs via fetch
async checkImageUrlsViaFetch() {
  if (!this.imagePaths || this.imagePaths.length === 0) return;
  
  console.log('[DEBUG] Testing image URLs via fetch...');
  
  for (let i = 0; i < this.imagePaths.length; i++) {
    const path = this.imagePaths[i];
    const url = this.getImageUrlForPath(path);
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`[DEBUG] Image ${i} (${url}) - Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`[DEBUG] Error checking ${url}:`, error);
    }
  }
},
    
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/category`);
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Handle API that returns data inside a data property
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
        
        // Handle different response formats
        if (response.data && response.data.data) {
          this.laporan = response.data.data;
        } else {
          this.laporan = response.data;
        }
        
        // Process image paths
        if (this.laporan.image_path) {
          this.imagePaths = this.parseImagePaths(this.laporan.image_path);
          
          // Store in laporan object for consistency
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
            console.log('Tanggapan is not in JSON format or already parsed');
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
    
    formatDate(dateString) {
      if (!dateString) return '-';
      
      try {
        // If the date is already in the YYYY-MM-DD HH:MM:SS format with no 'T' and 'Z'
        // we need to convert it to a proper ISO format for the Date constructor
        let date;
        if (typeof dateString === 'string' && dateString.includes(' ') && !dateString.includes('T')) {
          // Replace space with 'T' and add 'Z' for UTC if not present
          const hasZ = dateString.endsWith('Z');
          date = new Date((dateString.replace(' ', 'T') + (hasZ ? '' : '')));
          
          // Adjust for Indonesia timezone (GMT+7)
          // This is needed if the date is coming as UTC and we need to add 7 hours
          date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
        } else {
          // If it's already in a proper format that JS Date can parse
          date = new Date(dateString);
        }
        
        // Format the date in Indonesian style
        const options = { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta' // Set the timezone to Indonesia's timezone (GMT+7)
        };
        
        return date.toLocaleDateString('id-ID', options);
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
      // Implement your logic to check if user is admin
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
        
        // Show confirmation dialog first
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
          return; // User canceled
        }
        
        // Make the API call using POST with _method: PUT
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'finished');
        
        // IMPORTANT: Preserve the existing tanggapan data
        if (this.laporan.tanggapan) {
          let tanggapanData = this.laporan.tanggapan;
          
          // If it's already a string (old format), keep it as is
          if (typeof tanggapanData !== 'string') {
            // If it's an array (new format), convert it to JSON string
            tanggapanData = JSON.stringify(tanggapanData);
          }
          
          formData.append('tanggapan', tanggapanData);
        }

        const response = await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          formData
        );
                      
        // Update local data after successful completion
        this.laporan.status = 'finished';
        
        // Show success message with Swal
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan berhasil ditutup dan selesai',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        
        // Refresh data to ensure we have the latest tanggapan
        await this.fetchLaporan(this.laporanId);
        
      } catch (error) {
        console.error('Error finishing report:', error);
        // Safely access error message with optional chaining
        const errorMessage = error.response?.data?.message || 'Gagal menyelesaikan laporan';
        
        // Show error message with Swal
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
        
        // Make the API call first to get updated_at value
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('tanggapan', this.tanggapanText); // Temporary single string for API call
        
        // Include the current status to maintain it
        if (this.laporan && this.laporan.status) {
          formData.append('status', this.laporan.status);
        } else {
          formData.append('status', 'pending');
        }
        
        const response = await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          formData
        );
        
        // Get the updated data to get the new updated_at timestamp
        const updatedResponse = await axios.get(`${this.apiBaseUrl}/laporan/${this.laporanId}`);
        const updatedData = updatedResponse.data.data || updatedResponse.data;
        
        // Now create the tanggapan array with the new timestamp from updated_at
        // Create a new response object with text and timestamp from the API's updated_at
        const newTanggapan = {
          text: this.tanggapanText,
          timestamp: updatedData.updated_at, // Using the updated_at from API response
          user: this.currentUser
        };
        
        // Prepare the tanggapan array
        let tanggapanArray = [];
        
        if (this.laporan.tanggapan) {
          // If tanggapan exists and is already an array, use it
          if (Array.isArray(this.laporan.tanggapan)) {
            tanggapanArray = [...this.laporan.tanggapan];
          } 
          // If tanggapan exists but is a string (old format), convert it to array
          else if (typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '') {
            tanggapanArray = [{
              text: this.laporan.tanggapan,
              timestamp: this.laporan.updated_at, // Use the previous update time 
              user: 'Admin'
            }];
          }
        }
        
        // Add the new response
        tanggapanArray.push(newTanggapan);
        
        // Update tanggapan with the array format
        const arrayFormData = new FormData();
        arrayFormData.append('_method', 'PUT');
        arrayFormData.append('tanggapan', JSON.stringify(tanggapanArray));
        
        // Include the current status to maintain it
        if (this.laporan && this.laporan.status) {
          arrayFormData.append('status', this.laporan.status);
        } else {
          arrayFormData.append('status', 'pending');
        }

        // Make second API call to update with the array
        await axios.post(
          `${this.apiBaseUrl}/laporan/update_status/${this.laporanId}`, 
          arrayFormData
        );
        
        // Update local data after successful submission
        this.laporan.tanggapan = tanggapanArray;
        this.laporan.updated_at = updatedData.updated_at;
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Tanggapan berhasil disimpan',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        
        // Reset and close modal
        this.tanggapanText = '';
        this.showTanggapanModal = false;
        
        // Refresh data
        await this.fetchLaporan(this.laporanId);
        
      } catch (error) {
        console.error('Error saving tanggapan:', error);
        
        // Try to get a more specific error message
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
/* All styles remain the same, just adding the new ones for image grid */
.detail-laporan-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

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

.header-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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

.header-section h2 {
  margin-right: 15px;
  margin-bottom: 0;
}

.laporan-id {
  font-weight: 500;
  color: #666;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
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
}

.deskripsi, .tanggapan {
  line-height: 1.6;
  white-space: pre-line;
}

.kejadian-judul {
  font-size: 18px;
  margin-bottom: 16px;
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

.foto-section {
  margin-top: 20px;
}

.foto-section h4 {
  margin-bottom: 10px;
}

/* Image grid styles */
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

/* Fullscreen modal */
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

/* Image navigation */
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

/* Modal overlay */
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

/* Tanggapan styling */
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

.tanggapan-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-line;
  margin: 0;
}

.status-finished {
  background-color: #d1fae5;
  color: #059669;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-section h2 {
    margin-bottom: 10px;
  }
  
  .laporan-id, .status-badge {
    margin-bottom: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>