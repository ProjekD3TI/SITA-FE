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
          
          <!-- Tanggapan Card - Updated to handle both string and array types -->
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
            <button class="btn btn-primary" @click="verifyReport" v-if="laporan.status === 'unverified'">
              <i class="fas fa-check"></i> Verifikasi Laporan
            </button>
            <button class="btn btn-danger" @click="rejectReport" v-if="laporan.status === 'unverified'">
              <i class="fas fa-times"></i> Tolak Laporan
            </button>
            <button class="btn btn-secondary" @click="showTanggapanModal = true">
              <i class="fas fa-comment"></i> Tambah Tanggapan
            </button>
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
        
        <!-- Verification confirmation modal -->
        <div class="modal-overlay" v-if="showVerificationModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3>Konfirmasi Verifikasi</h3>
              <button class="close-button" @click="showVerificationModal = false" :disabled="isVerifying">&times;</button>
            </div>
            <div class="modal-body">
              <p>Apakah Anda yakin ingin memverifikasi laporan ini? Pastikan semua data sudah benar.</p>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="showVerificationModal = false" :disabled="isVerifying">Batal</button>
              <button class="btn-primary" @click="confirmVerification" :disabled="isVerifying">
                <span v-if="isVerifying">
                  <i class="fas fa-spinner fa-spin"></i> Memproses...
                </span>
                <span v-else>
                  <i class="fas fa-check"></i> Yakin, Verifikasi
                </span>
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
      showVerificationModal: false,
      showTanggapanModal: false,
      tanggapanText: '',
      isVerifying: false,
      currentUser: localStorage.getItem('userName') || 'Miftahul',
    };
  },
  created() {
    this.laporanId = this.$route.params.id;
    console.log("ID dari route:", this.laporanId); // Debug log
    
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
    
    console.log("Current user:", this.currentUser);
    
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
            this.categories = {};
          }
        } catch (apiError) {
          console.error('Error fetching categories:', apiError);
          this.categories = {};
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
          
          // Process tanggapan data
          if (this.laporan.tanggapan) {
            // Try to parse if it's a JSON string
            try {
              const parsed = JSON.parse(this.laporan.tanggapan);
              if (Array.isArray(parsed)) {
                this.laporan.tanggapan = parsed;
              }
            } catch (e) {
              // If it's not valid JSON, keep it as a string
              console.log('Tanggapan is not in JSON format, keeping as string');
            }
          }
          
          this.tanggapanText = '';
          this.loading = false;
        } catch (apiError) {
          console.error('Error fetching laporan detail:', apiError);
          
          // Fallback data jika API gagal
          console.log("Using fallback data for development");

          this.error = null;
          this.loading = false;
          this.tanggapanText = '';
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
    
    async confirmVerification() {
      this.isVerifying = true;
      
      try {
        // Your verification API call
        await axios.put(`http://localhost:8000/api/laporan/update_status/${this.laporanId}`, {
          status: 'verified'
        });
        
        // Update local data after successful verification
        this.laporan.status = 'verified';
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan berhasil diverifikasi',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (error) {
        console.error('Verification failed:', error);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal memverifikasi laporan',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } finally {
        this.isVerifying = false;
        this.showVerificationModal = false; // Close the modal after processing
      }
    },
    
    async rejectReport() {
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
        
        // Log what we're sending to help debug
        console.log('Rejecting report:', {
          laporanId: this.laporanId
        });
        
        // Make the API call using POST with _method: PUT
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'rejected');

        const response = await axios.post(
          `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
          formData
        );
                      
        // Check if response has data
        console.log('Response:', response);
        
        // Update local data after successful rejection
        this.laporan.status = 'rejected';
        
        // Show success message with Swal
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan berhasil ditolak',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        
        // Refresh data
        await this.fetchLaporan(this.laporanId);
        
      } catch (error) {
        console.error('Error rejecting report:', error);
        // Safely access error message with optional chaining
        const errorMessage = error.response?.data?.message || 'Gagal menolak laporan';
        
        // Show error message with Swal
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: `Gagal menolak laporan: ${errorMessage}`,
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
          `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
          formData
        );
        
        console.log('Response:', response);
        
        // Get the updated data to get the new updated_at timestamp
        const updatedResponse = await axios.get(`http://localhost:8000/api/laporan/${this.laporanId}`);
        const updatedData = updatedResponse.data;
        
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
          `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
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
        
        // More detailed error logging for debugging
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        }
        
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

/* Tanggapan styling from DetailPK.vue */
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