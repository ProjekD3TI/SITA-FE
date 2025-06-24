<template>
    <div class="detail-ks-container">
        <div class="detail-header">
            <div class="back-button" @click="goBack">
                <i class="fas fa-arrow-left"></i> Kembali
            </div>
        </div>

        <h1 class="page-title">Detail Pelaporan Kekerasan Seksual</h1>

        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Memuat data...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button class="retry-button" @click="fetchLaporanDetail">Coba Lagi</button>
        </div>

        <div v-else class="detail-content">
            <div class="status-header">
                <div class="laporan-number">{{ laporan.nomor_laporan_kekerasan }}</div>
            </div>

            <div class="detail-card main-info">
                <h2 class="detail-card-title">{{ laporan.judul }}</h2>
                <div class="category-badge">
                    <i class="fas fa-tag"></i> {{ getCategoryName(laporan.category_id) }}
                </div>
                <div class="date-info">
                    <i class="fas fa-calendar-alt"></i> Tanggal Kejadian: {{ formatedDate(laporan.tanggal_kejadian) }}
                </div>
                <p class="description">{{ laporan.deskripsi }}</p>
                
                <!-- Evidence Images section -->
                <div v-if="imagePaths && imagePaths.length > 0" class="image-container">
                    <h4 class="image-section-title">Foto Bukti Kejadian</h4>
                    <div class="image-grid">
                        <div v-for="(path, index) in imagePaths" :key="index" class="image-item">
                        <img 
                            :src="getImageUrlForPath(path)" 
                            :alt="`Bukti Kejadian ${index + 1}`" 
                            class="kejadian-image-thumbnail" 
                            @click="openFullImage(index)"
                            @error="handleImageError($event, index)"
                        />
                        </div>
                    </div>
                    <div class="image-caption">Klik untuk memperbesar</div>
                </div>
            </div>

            <div class="detail-cards-row">
                <div class="detail-card">
                    <h3 class="detail-section-title"><i class="fas fa-user"></i> Informasi Pelapor</h3>
                    <div class="info-grid">
                        <div class="info-label">Nama:</div>
                        <div class="info-value">{{ laporan.nama_pelapor }}</div>
                        
                        <div class="info-label">NIM Pelapor:</div>
                        <div class="info-value">{{ laporan.nim_pelapor }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">
                            {{ laporan.nomor_telepon || 'Tidak ada' }}
                            <button class="chat-icon-button" @click="startChat" title="Chat dengan pengguna" v-if="laporan.nomor_telepon">
                                <i class="fas fa-comment"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="detail-card">
                    <h3 class="detail-section-title"><i class="fas fa-clipboard-check"></i> Status Laporan</h3>
                    <div class="info-grid">
                        
                        <div class="info-label">Tanggal Laporan:</div>
                        <div class="info-value">{{ formatDate(laporan.created_at) }}</div>
                        
                        <div class="info-label">Terakhir Diperbarui:</div>
                        <div class="info-value">{{ formatDate(laporan.updated_at) }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Display bukti_pelanggaran if available -->
            <div class="detail-card" v-if="hasBuktiPelanggaran">
                <h3 class="detail-section-title"><i class="fas fa-file-alt"></i> Bukti Pelanggaran</h3>
                <div class="bukti-list">
                    <ul>
                        <li v-for="(bukti, index) in processedBuktiPelanggaran" :key="index">{{ bukti }}</li>
                    </ul>
                </div>
            </div>
            
            <!-- Display terlapor information if available -->
            <div class="detail-card" v-if="hasTerlapor">
                <h3 class="detail-section-title"><i class="fas fa-user-shield"></i> Informasi Terlapor</h3>
                <div v-for="(person, index) in processedTerlapor" :key="index" class="terlapor-item">
                    <h4>Terlapor {{ index + 1 }}</h4>
                    <div class="info-grid">
                        <div class="info-label">Nama:</div>
                        <div class="info-value">{{ person.nama_lengkap || 'Tidak ada' }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ person.email || 'Tidak ada' }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">
                            {{ person.nomor_telepon || 'Tidak ada' }}
                            <button class="chat-icon-button" 
                                @click="startChatWithPerson(person.nomor_telepon)" 
                                title="Chat dengan terlapor"
                                v-if="person.nomor_telepon">
                                <i class="fas fa-comment"></i>
                            </button>
                        </div>
                        
                        <div class="info-label">Status:</div>
                        <div class="info-value">{{ person.status_warga || 'Tidak ada' }}</div>
                        
                        <div class="info-label">Unit Kerja:</div>
                        <div class="info-value">{{ person.unit_kerja || 'Tidak ada' }}</div>
                        
                        <div class="info-label">Jenis Kelamin:</div>
                        <div class="info-value">{{ formatJenisKelamin(person.jenis_kelamin) }}</div>

                        <div class="info-label">Rentang Umur:</div>
                        <div class="info-value">{{ formatUmur(person.umur_terlapor) || '-' }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Display saksi information if available -->
            <div class="detail-card" v-if="hasSaksi">
                <h3 class="detail-section-title"><i class="fas fa-users"></i> Informasi Saksi</h3>
                <div v-for="(saksi, index) in processedSaksi" :key="index" class="saksi-item">
                    <h4>Saksi {{ index + 1 }}</h4>
                    <div class="info-grid">
                        <div class="info-label">Nama:</div>
                        <div class="info-value">{{ saksi.nama_lengkap || 'Tidak ada' }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ saksi.email || 'Tidak ada' }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">
                            {{ saksi.nomor_telepon || 'Tidak ada' }}
                            <button class="chat-icon-button" 
                                @click="startChatWithPerson(saksi.nomor_telepon)" 
                                title="Chat dengan saksi"
                                v-if="saksi.nomor_telepon">
                                <i class="fas fa-comment"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Display tanggapan if available -->
            <div class="detail-card" v-if="laporan.tanggapan">
                <h3 class="detail-section-title"><i class="fas fa-comment-dots"></i> Tanggapan</h3>
                <p class="tanggapan-text">{{ laporan.tanggapan }}</p>
            </div>
        </div>

        <!-- Modal for full image view -->
        <div class="fullscreen-modal" v-if="showFullImage" @click="closeFullImage">
            <div class="modal-content" @click.stop>
                <span class="close-modal" @click.stop="closeFullImage">&times;</span>
                <img :src="currentFullImageUrl" alt="Bukti Kejadian" class="fullscreen-image" @error="handleFullImageError">
                
                <!-- Image navigation if multiple images -->
                <div class="image-navigation" v-if="imagePaths.length > 1">
                    <button 
                        class="nav-button" 
                        @click.stop="navigateImages('prev')" 
                        :disabled="currentImageIndex === 0"
                    >
                        &lt; Prev
                    </button>
                    <span class="image-counter">{{ currentImageIndex + 1 }} / {{ imagePaths.length }}</span>
                    <button 
                        class="nav-button" 
                        @click.stop="navigateImages('next')" 
                        :disabled="currentImageIndex === imagePaths.length - 1"
                    >
                        Next &gt;
                    </button>
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
                    <button class="btn-save" @click="saveTanggapan">Simpan Tanggapan</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'DetailKS',
  
  data() {
    return {
      laporanId: null,
      laporan: {},
      categories: {},
      loading: true,
      error: null,
      showFullImage: false,
      showTanggapanModal: false,
      tanggapanText: '',
      apiBaseUrl: 'http://pelaporan-d3ti.my.id/api',
      baseUrl: 'http://pelaporan-d3ti.my.id',
      authToken: null,
      imagePaths: [],
      currentImageIndex: 0,
      currentFullImageUrl: ''
    };
  },
  
  computed: {
    // Process bukti pelanggaran data
    processedBuktiPelanggaran() {
      try {
        if (!this.laporan.bukti_pelanggaran) return [];
        
        // Handle array
        if (Array.isArray(this.laporan.bukti_pelanggaran)) {
          return this.laporan.bukti_pelanggaran;
        }
        
        // Handle JSON string
        if (typeof this.laporan.bukti_pelanggaran === 'string') {
          try {
            const parsed = JSON.parse(this.laporan.bukti_pelanggaran);
            if (Array.isArray(parsed)) {
              return parsed;
            } else if (typeof parsed === 'object') {
              return Object.values(parsed);
            }
            return [parsed];
          } catch (e) {
            // If it's not valid JSON, check if it's comma-separated
            if (this.laporan.bukti_pelanggaran.includes(',')) {
              return this.laporan.bukti_pelanggaran.split(',').map(item => item.trim());
            }
            return [this.laporan.bukti_pelanggaran];
          }
        }
        
        return [];
      } catch (error) {
        console.error('Error processing bukti_pelanggaran:', error);
        return [];
      }
    },
    
    // Process terlapor data
    processedTerlapor() {
      try {
        if (!this.laporan.terlapor) return [];
        
        // Handle array
        if (Array.isArray(this.laporan.terlapor)) {
          return this.laporan.terlapor;
        }
        
        // Handle JSON string
        if (typeof this.laporan.terlapor === 'string') {
          try {
            const parsed = JSON.parse(this.laporan.terlapor);
            if (Array.isArray(parsed)) {
              return parsed;
            } else if (typeof parsed === 'object') {
              return [parsed];
            }
          } catch (e) {
            console.error('Error parsing terlapor data:', e);
          }
        }
        
        // Handle single object
        if (typeof this.laporan.terlapor === 'object' && !Array.isArray(this.laporan.terlapor)) {
          return [this.laporan.terlapor];
        }
        
        return [];
      } catch (error) {
        console.error('Error processing terlapor data:', error);
        return [];
      }
    },
    
    // Process saksi data
    processedSaksi() {
      try {
        if (!this.laporan.saksi) return [];
        
        // Handle array
        if (Array.isArray(this.laporan.saksi)) {
          return this.laporan.saksi;
        }
        
        // Handle JSON string
        if (typeof this.laporan.saksi === 'string') {
          try {
            const parsed = JSON.parse(this.laporan.saksi);
            if (Array.isArray(parsed)) {
              return parsed;
            } else if (typeof parsed === 'object') {
              return [parsed];
            }
          } catch (e) {
            console.error('Error parsing saksi data:', e);
          }
        }
        
        // Handle single object
        if (typeof this.laporan.saksi === 'object' && !Array.isArray(this.laporan.saksi)) {
          return [this.laporan.saksi];
        }
        
        return [];
      } catch (error) {
        console.error('Error processing saksi data:', error);
        return [];
      }
    },
    
    // Process images
    processedImages() {
      if (!this.laporan.image_path) return [];
      
      return this.parseImagePaths(this.laporan.image_path);
    },
    
    // Helper computed properties for checking existence
    hasBuktiPelanggaran() {
      return this.processedBuktiPelanggaran.length > 0;
    },
    
    hasTerlapor() {
      return this.processedTerlapor.length > 0;
    },
    
    hasSaksi() {
      return this.processedSaksi.length > 0;
    },
    
    // Current image src for fullscreen modal
    currentImageSrc() {
        if (this.imagePaths.length === 0 || this.currentImageIndex >= this.imagePaths.length) {
        return '';
        }
        
        const imagePath = this.imagePaths[this.currentImageIndex];
        return this.getImageUrlForPath(imagePath);
    }
  },
  
  created() {
    this.initializeComponent();
  },
  
  methods: {
    initializeComponent() {
      // Extract the ID from the route params
      const routeParam = this.$route.params.id;
      console.log('Route param received:', routeParam, typeof routeParam);
      
      // Handle different formats of the ID parameter
      if (typeof routeParam === 'object') {
        this.laporanId = this.extractIdFromObject(routeParam);
      } else {
        this.laporanId = routeParam;
      }
      
      console.log('Extracted ID:', this.laporanId);
      
      if (!this.laporanId) {
        this.error = 'Invalid report ID';
        this.loading = false;
        return;
      }
      
      this.fetchCategories();
      this.fetchLaporanDetail();
    },
    
    extractIdFromObject(routeParam) {
      if (routeParam.id) {
        return routeParam.id;
      } else {
        // Try to find the ID in the object
        const keys = Object.keys(routeParam);
        if (keys.length > 0) {
          return routeParam[keys[0]];
        }
        return null;
      }
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/category`);
        this.categories = response.data.reduce((acc, category) => {
          acc[category.category_id] = category.nama;
          return acc;
        }, {});
        console.log('Categories loaded successfully');
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    
    getAuthToken() {
      // Try to get token from auth_token cookie first
      let token = VueCookies.get("auth_token");
      
      // If not found, check user_session as fallback
      if (!token) {
        const userData = VueCookies.get("user_session");
        if (userData) {
          // If userData exists, try to extract token based on its type
          if (typeof userData === 'object' && userData.token) {
            token = userData.token;
          } else if (typeof userData === 'string') {
            try {
              // Try parsing as JSON
              const parsed = JSON.parse(userData);
              if (parsed && parsed.token) {
                token = parsed.token;
              }
            } catch (e) {
              // Not JSON, use as is
              token = userData;
            }
          }
        }
      }
      
      if (token) {
        this.authToken = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Auth token loaded and set in axios defaults');
        return true;
      } else {
        console.warn('No auth token found in cookies');
        this.error = "Sesi login telah berakhir. Silakan login kembali.";
        return false;
      }
    },

    async fetchLaporanDetail() {
      if (!this.laporanId) {
        this.error = "ID laporan tidak valid";
        this.loading = false;
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        if (!this.authToken && !this.getAuthToken()) {
          return;
        }

        console.log('Fetching laporan detail with ID:', this.laporanId);
        console.log('Using auth token:', this.authToken ? 'Yes (available)' : 'No');
        
        const response = await axios.get(`${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}`, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });
        
        // Process the response
        this.laporan = response.data;
        console.log('Laporan data received successfully', this.laporan);
        this.processImagePaths();
        
      } catch (err) {
        console.error('Error fetching laporan detail:', err);
        
        if (err.response && err.response.status === 401) {
          this.error = 'Sesi anda telah berakhir. Silakan login kembali.';
          
          // Try to refresh token or redirect to login
          this.handleAuthError();
        } else {
          this.error = 'Gagal memuat detail laporan. Silakan coba lagi.';
        }
      } finally {
        this.loading = false;
      }
    },
    
    handleAuthError() {
      // Clear the invalid token
      this.authToken = null;
      VueCookies.remove('auth_token');
      
      // Optionally redirect to login page
      // setTimeout(() => this.$router.push('/login'), 2000);
    },
    
    processImagePaths() {
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
        console.log('Parsed image paths:', this.imagePaths);
      }
    },
    
    goBack() {
      this.$router.go(-1);
    },

    formatedDate(dateString) {
      if (!dateString) return '-';
      
      try {
        // Parse the date string
        const date = new Date(dateString);
        
        // Add 7 hours for GMT+7 (Indonesia timezone)
        // This is a simple way to adjust for Indonesia's timezone
        const indonesiaDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
        
        // Format tanggal dalam gaya Indonesia
        const options = { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // 24-hour format which is common in Indonesia
        };
        
        return indonesiaDate.toLocaleDateString('id-ID', options);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString || '-';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    
    formatStatus(status) {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Diverifikasi',
        'processed': 'Diproses',
        'completed': 'Selesai',
        'rejected': 'Ditolak'
      };
      
      return statusMap[status] || status || 'Belum Diverifikasi';
    },
    
    formatJenisKelamin(jenisKelamin) {
      if (!jenisKelamin) return 'Tidak ada data';
      
      const genderMap = {
        'laki-laki': 'Laki-laki',
        'perempuan': 'Perempuan'
      };
      
      return genderMap[jenisKelamin] || jenisKelamin;
    },
    
    formatUmur(umur) {
      if (!umur) return 'Tidak ada data';
      
      const ageMap = {
        '<20': 'Kurang dari 20 tahun',
        '20-40': '20 - 40 tahun',
        '40<': 'Lebih dari 40 tahun'
      };
      
      return ageMap[umur] || umur;
    },
    
    getCategoryName(categoryId) {
      return this.categories[categoryId] || `Kategori ${categoryId}`;
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      
      // Check if image_path is a JSON string and parse it
      if (typeof imagePath === 'string' && (imagePath.startsWith('[') || imagePath.startsWith('["'))) {
        try {
          const images = JSON.parse(imagePath);
          if (Array.isArray(images) && images.length > 0) {
            // Use the first image from the array
            return `${this.baseUrl}/public/storage/laporankekerasan/${images[0]}`;
          }
        } catch (e) {
          console.error('Error parsing image path:', e);
        }
      }
      
      // If not a JSON string or parsing failed, return as is
      return `${this.baseUrl}/public/storage/laporankekerasan/${imagePath}`;
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

    // Updated getImageUrlForPath method
    getImageUrlForPath(path) {
        if (!path) return '';
        
        // Check if path is already a full URL
        if (path.startsWith('http')) {
          return path;
        }
        
        // Clean up the path (remove quotes)
        const cleanPath = path.replace(/['"]/g, '');
        
        // Construct the correct URL - make sure to use the exact format from the console logs
        return `${this.baseUrl}/public/storage/laporankekerasan/${cleanPath}`;
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
        // Try Backend-Port path first
        newUrl = `${baseDomain}/Backend-Port/backend/engine/public/storage/laporankekerasan/${path}?fallback=2`;
      } else if (originalSrc.includes('fallback=2')) {
        newUrl = `${baseDomain}/api/storage/laporankekerasan/${path}?fallback=3`;
      } else if (originalSrc.includes('fallback=3')) {
        newUrl = `${baseDomain}/storage/laporankekerasan/${path}?fallback=4`;
      } else {
        newUrl = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
      }
      
      img.src = newUrl;
    },
    
    // Handle errors for fullscreen image
    handleFullImageError(event) {
      const img = event.target;
      const originalSrc = img.src;
      const path = this.imagePaths[this.currentImageIndex];
      
      if (originalSrc.includes('fallback=4')) {
        img.src = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
        return;
      }
      
      const baseDomain = this.baseUrl;
      let newUrl;
      
      if (!originalSrc.includes('fallback=')) {
        newUrl = `${baseDomain}/Backend-Port/backend/engine/public/storage/laporankekerasan/${path}?fallback=2`;
      } else if (originalSrc.includes('fallback=2')) {
        newUrl = `${baseDomain}/api/storage/laporankekerasan/${path}?fallback=3`;
      } else if (originalSrc.includes('fallback=3')) {
        newUrl = `${baseDomain}/storage/laporankekerasan/${path}?fallback=4`;
      } else {
        newUrl = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
      }
      
      img.src = newUrl;
    },
    
    // Updated openFullImage method
    openFullImage(index) {
      this.currentImageIndex = index;
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[index]);
      this.showFullImage = true;
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    },

    // Updated navigateImages method
    navigateImages(direction) {
      if (direction === 'prev' && this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else if (direction === 'next' && this.currentImageIndex < this.imagePaths.length - 1) {
        this.currentImageIndex++;
      }
      
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[this.currentImageIndex]);
    },
    
    // Updated method to close the modal
    closeFullImage() {
      this.showFullImage = false;
      
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    },
    
    startChat() {
      // Get the phone number from the laporan data
      let phoneNumber = this.laporan.nomor_telepon;
      
      // Validate and format the phone number
      if (phoneNumber) {
        // Remove any non-digit characters
        phoneNumber = phoneNumber.replace(/\D/g, '');
        
        // Add country code if not present (assuming Indonesia +62)
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62')) {
          phoneNumber = '62' + phoneNumber;
        }
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
      } else {
        this.$notify({
          type: 'error',
          text: 'Nomor telepon tidak tersedia'
        });
      }
    },
    
    startChatWithPerson(phoneNumber) {
      // Validate and format the phone number
      if (phoneNumber) {
        // Remove any non-digit characters
        phoneNumber = phoneNumber.replace(/\D/g, '');
        
        // Add country code if not present (assuming Indonesia +62)
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62') && !phoneNumber.startsWith('+')) {
          phoneNumber = '62' + phoneNumber;
        } else if (phoneNumber.startsWith('+')) {
          phoneNumber = phoneNumber.substring(1); // Remove the + sign
        }
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
      } else {
        this.$notify({
          type: 'error',
          text: 'Nomor telepon tidak tersedia'
        });
      }
    },
    
    async updateStatus(newStatus) {
      try {
        this.loading = true;
        
        // Ensure we have a valid auth token
        if (!this.authToken && !this.getAuthToken()) {
          return;
        }
        
        await axios.put(`${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}/status`, {
          status: newStatus
        }, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });
        
        this.laporan.status = newStatus;
        this.$notify({
          type: 'success',
          text: `Status laporan berhasil diperbarui menjadi ${this.formatStatus(newStatus)}`
        });
        
        // Refresh data after status update
        await this.fetchLaporanDetail();
      } catch (error) {
        console.error('Error updating status:', error);
        
        // Check if it's an authentication error
        if (error.response && error.response.status === 401) {
          this.$notify({
            type: 'error',
            text: 'Sesi anda telah berakhir. Silakan login kembali.'
          });
          this.handleAuthError();
        } else {
          this.$notify({
            type: 'error',
            text: 'Gagal mengubah status laporan'
          });
        }
      } finally {
        this.loading = false;
      }
    },
    
    async saveTanggapan() {
      if (!this.tanggapanText.trim()) {
        this.$notify({
          type: 'error',
          text: 'Tanggapan tidak boleh kosong'
        });
        return;
      }
      
      try {
        this.loading = true;
        
        // Ensure we have a valid auth token
        if (!this.authToken && !this.getAuthToken()) {
          return;
        }
        
        await axios.put(`${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}/tanggapan`, {
          tanggapan: this.tanggapanText
        }, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });
        
        this.laporan.tanggapan = this.tanggapanText;
        this.showTanggapanModal = false;
        
        this.$notify({
          type: 'success',
          text: 'Tanggapan berhasil disimpan'
        });
        
        // Refresh data
        await this.fetchLaporanDetail();
      } catch (error) {
        console.error('Error saving tanggapan:', error);
        
        // Check if it's an authentication error
        if (error.response && error.response.status === 401) {
          this.$notify({
            type: 'error',
            text: 'Sesi anda telah berakhir. Silakan login kembali.'
          });
          this.handleAuthError();
        } else {
          this.$notify({
            type: 'error',
            text: 'Gagal menyimpan tanggapan'
          });
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.detail-ks-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f3f4f6;
  margin-right: 16px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #e5e7eb;
}

.back-button i {
  margin-right: 8px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  flex: 1;
}

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 8px;
  padding: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 24px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: #b91c1c;
}

.error-container i {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-button {
  margin-top: 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #dc2626;
}

/* Main Content Styles */
.detail-content {
  margin-top: 24px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.laporan-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 6px 12px;
  border-radius: 6px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-card {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.main-info {
  position: relative;
}

.detail-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
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

.date-info {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.date-info i {
  margin-right: 4px;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 20px;
  white-space: pre-line;
}

/* Image Container Styles */
.image-container {
  margin-top: 24px;
  width: 100%;
}

.image-section-title {
  font-weight: 500;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #374151;
}

/* Image grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1 / 1;
  height: auto;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  cursor: pointer;
}

.kejadian-image-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.kejadian-image-thumbnail:hover {
  transform: scale(1.05);
}

.image-caption {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
}

/* Fullscreen Modal */
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
  z-index: 10000;
}

.modal-content {
  position: relative;
  z-index: 10002;
  max-width: 95%;
  max-height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
}

.close-modal {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10003;
}

.image-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  width: 100%;
  padding: 10px;
}

.nav-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-button:not(:disabled):hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.image-counter {
  color: white;
  font-size: 14px;
  margin: 0 16px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 4px;
}

/* Detail Cards */
.detail-cards-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.detail-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.detail-section-title i {
  margin-right: 8px;
  color: #4b5563;
}

.info-grid {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 12px;
}

.info-label {
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  color: #111827;
}

/* Bukti Pelanggaran Styles */
.bukti-list ul {
  padding-left: 20px;
  margin-top: 0;
}

.bukti-list li {
  margin-bottom: 8px;
  color: #374151;
}

/* Terlapor & Saksi Styles */
.terlapor-item, .saksi-item {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.terlapor-item:last-child, .saksi-item:last-child {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.terlapor-item h4, .saksi-item h4 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin-top: 0;
  margin-bottom: 12px;
}

/* Tanggapan Styles */
.tanggapan-text {
  white-space: pre-line;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Tanggapan Modal */
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

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-save {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-save:hover {
  background-color: #1d4ed8;
}

/* Status Colors */
.unverified {
  background-color: #f3f4f6;
  color: #4b5563;
}

.verified {
  background-color: #dbeafe;
  color: #2563eb;
}

.processed {
  background-color: #fef3c7;
  color: #d97706;
}

.completed {
  background-color: #d1fae5;
  color: #059669;
}

.rejected {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Chat Button */
.chat-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #4B5563;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  transition: background-color 0.2s;
}

.chat-icon-button:hover {
  background-color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .detail-cards-row {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 100px 1fr;
  }
  
  .close-modal {
    top: -20px;
    right: -10px;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

@media (max-width: 480px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .nav-button {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .image-counter {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>