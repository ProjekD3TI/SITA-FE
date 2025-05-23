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
                <div :class="['status-badge', laporan.status || 'unverified']">
                    {{ formatStatus(laporan.status) }}
                </div>
            </div>

            <div class="detail-card main-info">
                <h2 class="detail-card-title">{{ laporan.judul }}</h2>
                <div class="category-badge">
                    <i class="fas fa-tag"></i> {{ getCategoryName(laporan.category_id) }}
                </div>
                <div class="date-info">
                    <i class="fas fa-calendar-alt"></i> Tanggal Kejadian: {{ formatDate(laporan.tanggal_kejadian) }}
                </div>
                <p class="description">{{ laporan.deskripsi }}</p>
                
                <div v-if="laporan.image_path" class="image-container">
                    <div v-for="(image, index) in processedImages" :key="index" class="image-item">
                        <img :src="getImageUrl(image)" alt="Gambar Kejadian" class="evidence-image" @click="showFullImage = true; currentImageIndex = index">
                    </div>
                    <div class="image-caption">Foto Bukti Kejadian (klik untuk memperbesar)</div>
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
                        <div class="info-label">Status:</div>
                        <div class="info-value">
                            <span :class="['status-badge', laporan.status || 'unverified']">
                                {{ formatStatus(laporan.status) }}
                            </span>
                        </div>
                        
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
        <div class="fullscreen-modal" v-if="showFullImage" @click="showFullImage = false">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img :src="currentImageSrc" alt="Bukti Kejadian" class="fullscreen-image">
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
      apiBaseUrl: 'https://v3422040.mhs.d3tiuns.com/api',
      baseUrl: 'https://v3422040.mhs.d3tiuns.com',
      authToken: null,
      imagePaths: [],
      currentImageIndex: 0,
      currentFullImageUrl: ''
    };
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
        console.log('Laporan data received successfully');
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
    
    // The rest of your methods remain unchanged
    goBack() {
      this.$router.go(-1);
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
      
      return statusMap[status] || status;
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

    getImageUrlForPath(path) {
      if (!path) return '';
      
      if (path.startsWith('http')) {
        return path;
      }
      
      const cleanPath = path.replace(/['"]/g, '');
      
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
    
    openFullImage(index) {
      this.currentImageIndex = index;
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[index]);
      this.showFullImage = true;
    },

    navigateImages(direction) {
      if (direction === 'prev' && this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else if (direction === 'next' && this.currentImageIndex < this.imagePaths.length - 1) {
        this.currentImageIndex++;
      }
      
      this.currentFullImageUrl = this.getImageUrlForPath(this.imagePaths[this.currentImageIndex]);
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
    }
  }
};
</script>

<style scoped>
/* Your existing CSS remains unchanged */
</style>