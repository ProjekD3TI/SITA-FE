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
          <div class="spinner"></div>
          <p>{{ error }}</p>
          <button @click="fetchLaporan(laporanId)" class="btn btn-primary">Coba Lagi</button>
        </div>
        
        <div v-else class="detail-content">
          <div class="header-section">
            <div class="back-button" @click="goBack">
              <i class="fas fa-arrow-left"></i> Kembali
            </div>
            <h2>Detail Laporan Kejadian</h2>
            <div class="laporan-id">{{ laporan.nomor_laporan }}</div>
            <div class="status-badge" :class="getStatusClass">{{ formatStatus(laporan.status) }}</div>
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
            <div v-if="laporan.image_path || laporan.foto_kejadian" class="foto-section">
              <h4>Foto Kejadian</h4>
              <div style="text-align: center;">
                <img 
                  :src="laporan.image_path ? getImageUrl(laporan.image_path) : laporan.foto_kejadian" 
                  alt="Foto Kejadian" 
                  class="kejadian-image" 
                  style="max-width: 100%; max-height: 300px; object-fit: contain;" 
                  @click="showFullImage = true"
                >
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
              <div class="value">{{ laporan.ni_pelapor || "-" }}</div>
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
          
          <div v-if="laporan.tanggapan" class="card">
            <h3>Tanggapan dari Kalab</h3>
            <p class="tanggapan">{{ laporan.tanggapan }}</p>
          </div>
        </div>
        
        <!-- Modal for full image view -->
        <div class="fullscreen-modal" v-if="showFullImage" @click="showFullImage = false">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img 
              :src="laporan.image_path ? getImageUrl(laporan.image_path) : laporan.foto_kejadian" 
              alt="Bukti Kejadian" 
              class="fullscreen-image"
            >
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
      showVerificationModal: false,
      showTanggapanModal: false,
      tanggapanText: '',
      isVerifying: false
    };
  },
  created() {
    this.laporanId = this.$route.params.id;
    console.log("ID dari route:", this.laporanId); // Debug log
    
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
      };
      return statusMap[this.laporan.status] || 'status-default';
    }
  },
  methods: {
    async fetchCategories() {
      try {
        try {
          const response = await axios.get('http://localhost:8000/api/category');
          if (Array.isArray(response.data)) {
            this.categories = response.data.reduce((acc, category) => {
              acc[category.category_id] = category.nama;
              return acc;
            }, {});
          } else {
            console.error('Unexpected category data format:', response.data);
            this.categories = fallbackCategories;
          }
        } catch (apiError) {
          console.error('Error fetching categories:', apiError);
          this.categories = fallbackCategories;
        }
      } catch (error) {
        console.error('Error in fetchCategories:', error);
      }
    },
    
    async fetchLaporan(id) {
      if (!id) {
        console.error("Attempted to fetch report with undefined ID");
        this.error = "ID laporan tidak valid";
        this.loading = false;
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        try {
          console.log(`Fetching report with ID: ${id}`);
          const response = await axios.get(`http://localhost:8000/api/laporan/${id}`);
          console.log("API Response:", response.data);
          this.laporan = response.data;
          this.tanggapanText = this.laporan.tanggapan || '';
          this.loading = false;
        } catch (apiError) {
          console.error('Error fetching laporan detail:', apiError);
          
          // Fallback data jika API gagal
          console.log("Using fallback data for development");

          this.error = null;
          this.loading = false;
          this.tanggapanText = this.laporan.tanggapan || '';
        }
      } catch (error) {
        console.error('Error in fetchLaporan:', error);
        this.error = 'Gagal memuat data laporan. Silakan coba lagi.';
        this.loading = false;
      }
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      
      try {
        const options = { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        
        return new Date(dateString).toLocaleDateString('id-ID', options);
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
      }
    },
    
    formatStatus(status) {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Diverifikasi',
        'rejected': 'Ditolak',
        'completed': 'Selesai',
        'Diproses': 'Diproses',
        'Selesai': 'Selesai',
        'Ditolak': 'Ditolak',
        'Menunggu': 'Menunggu'
      };
      
      return statusMap[status] || status;
    },
    
    getCategoryName(categoryId) {
      return this.categories[categoryId] || `Kategori ${categoryId}`;
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      
      // Cek jika imagePath adalah URL lengkap
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      return `http://localhost:8000/storage/laporan/${imagePath}`;
    },
    
    checkUserRole() {
      // Implement your logic to check if user is admin
      // Example:
      // const userRole = localStorage.getItem('userRole');
      // this.isAdmin = userRole === 'admin';
      
      // For demonstration, set to true
      this.isAdmin = true;
    },
    
    verifyReport() {
      this.showVerificationModal = true;
    },
  }
};
</script>

<style scoped>
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
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

.header-section h2 {
  margin-right: 15px;
  margin-bottom: 0;
}

.laporan-id {
  font-weight: 500;
  color: #666;
  margin-right: 15px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.status-processing {
  background-color: #e3f2fd;
  color: #1976d2;
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

.kejadian-image {
  max-width: 100%;
  border-radius: 4px;
  cursor: pointer;
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
}
</style>