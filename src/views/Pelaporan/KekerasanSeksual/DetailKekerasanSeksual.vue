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
          
          <div v-else class="detail-content">
            <div class="header-section">
              <h2>Detail Laporan Kejadian</h2>
              <div class="laporan-id">{{ laporan.nomor_laporan }}</div>
              <div class="status-badge" :class="getStatusClass">{{ laporan.status }}</div>
            </div>
            
            <div class="card">
              <h3>Informasi Kejadian</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Tanggal Kejadian</div>
                  <div class="value">{{ formatDate(laporan.tanggal_kejadian) }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Waktu</div>
                  <div class="value">{{ laporan.waktu_kejadian }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Jenis Kejadian</div>
                  <div class="value">{{ laporan.jenis_kejadian }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Lokasi</div>
                  <div class="value">{{ laporan.lokasi_kejadian }}</div>
                </div>
              </div>
            </div>
            
            <div class="card">
              <h3>Detail Kejadian</h3>
              <p class="deskripsi">{{ laporan.deskripsi_kejadian }}</p>
              <div v-if="laporan.foto_kejadian" class="foto-section">
                <h4>Foto Kejadian</h4>
                <img :src="laporan.foto_kejadian" alt="Foto Kejadian" class="kejadian-image">
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
                  <div class="label">Email</div>
                  <div class="value">{{ laporan.email_pelapor }}</div>
                </div>
                <div class="info-item">
                  <div class="label">Telepon</div>
                  <div class="value">{{ laporan.telepon_pelapor }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="laporan.tanggapan" class="card">
              <h3>Tanggapan</h3>
              <p class="tanggapan">{{ laporan.tanggapan }}</p>
            </div>
            
            <div v-if="isAdmin" class="action-buttons">
              <button class="btn btn-primary">Update Status</button>
              <button class="btn btn-secondary">Tambah Tanggapan</button>
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
  
  export default {
    components: {
      Header,
      Sidebar,
      Footer
    },
    data() {
      return {
        laporan: {},
        loading: true,
        isAdmin: false
      };
    },
    created() {
      const id = this.$route.params.id;
      this.fetchLaporan(id);
      this.checkUserRole();
    },
    computed: {
      getStatusClass() {
        const statusMap = {
          'Diproses': 'status-processing',
          'Selesai': 'status-completed',
          'Ditolak': 'status-rejected',
          'Menunggu': 'status-waiting'
        };
        return statusMap[this.laporan.status] || 'status-default';
      }
    },
    methods: {
      fetchLaporan(id) {
        // Temporary mock data for demonstration
        setTimeout(() => {
          this.laporan = {
            id: id,
            nomor_laporan: 'LK-2023-' + id,
            tanggal_kejadian: '2023-10-15',
            waktu_kejadian: '14:30',
            lokasi_kejadian: 'Jl. Contoh No. 123, Jakarta',
            jenis_kejadian: 'Kebakaran',
            status: 'Diproses',
            nama_pelapor: 'Ahmad Saputra',
            email_pelapor: 'ahmad@example.com',
            telepon_pelapor: '081234567890',
            deskripsi_kejadian: 'Terjadi kebakaran kecil di area dapur rumah warga. Api berhasil dipadamkan oleh warga sekitar sebelum menyebar lebih luas. Tidak ada korban jiwa, namun terdapat kerusakan material.',
            foto_kejadian: 'https://via.placeholder.com/500x300',
            tanggapan: 'Tim pemadam kebakaran telah melakukan pengecekan dan memastikan tidak ada potensi api kembali menyala. Area sudah disterilkan.'
          };
          this.loading = false;
        }, 1000);
      },
      
      checkUserRole() {
        // Implement your logic to check if user is admin
        // Example:
        // const userRole = localStorage.getItem('userRole');
        // this.isAdmin = userRole === 'admin';
        
        // For demonstration, set to true
        this.isAdmin = true;
      },
      
      formatDate(dateString) {
        if (!dateString) return '';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
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
  
  .foto-section {
    margin-top: 20px;
  }
  
  .foto-section h4 {
    margin-bottom: 10px;
  }
  
  .kejadian-image {
    max-width: 100%;
    border-radius: 4px;
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
  }
  </style>