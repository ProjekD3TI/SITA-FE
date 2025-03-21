<template>
  <div class="dashboard-pelaporan-kejadian">
    <h1 class="page-title">Dashboard Pelaporan Kejadian</h1>
    
    <div class="statistics-cards">
      <div class="stats-card">
        <div class="stats-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stats-content">
          <h3>Total Kejadian</h3>
          <p class="stats-number">24</p>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stats-content">
          <h3>Dalam Proses</h3>
          <p class="stats-number">18</p>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stats-content">
          <h3>Selesai Ditangani</h3>
          <p class="stats-number">6</p>
        </div>
      </div>
    </div>
    
    <!-- Table with search, filters and pagination -->
    <div class="incident-table-container">
      <div class="table-actions">
        <h2>Daftar Kejadian</h2>
        <div class="action-buttons">
          <button class="btn-add-report" @click="addNewReport">
            <i class="fas fa-plus"></i> Tambah Laporan
          </button>
        </div>
      </div>
      
      <div class="table-header">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari kejadian..." 
            class="search-input"
            @input="handleSearch"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
      
      <!-- Filter controls -->
      <div class="filter-container">
        <div class="filter-group">
          <label>Filter berdasarkan:</label>
          
          <div class="filter-select">
            <label for="jenisKejadianFilter">Jenis Kejadian:</label>
            <select id="jenisKejadianFilter" v-model="filters.jenisKejadian" @change="applyFilters">
              <option value="">Semua</option>
              <option v-for="jenis in uniqueJenisKejadian" :key="jenis" :value="jenis">
                {{ jenis }}
              </option>
            </select>
          </div>
          
          <div class="filter-select">
            <label for="statusFilter">Status:</label>
            <select id="statusFilter" v-model="filters.status" @change="applyFilters">
              <option value="">Semua</option>
              <option value="Selesai">Selesai</option>
              <option value="Proses">Dalam Proses</option>
            </select>
          </div>
          
          <div class="filter-date">
            <label for="dateFilter">Periode:</label>
            <div class="date-inputs">
              <input 
                type="date" 
                id="startDate" 
                v-model="filters.startDate" 
                @change="applyFilters"
                placeholder="Tanggal Mulai"
              >
              <span>s/d</span>
              <input 
                type="date" 
                id="endDate" 
                v-model="filters.endDate" 
                @change="applyFilters"
                placeholder="Tanggal Akhir"
              >
            </div>
          </div>
          
          <button class="btn-reset-filter" @click="resetFilters">
            <i class="fas fa-undo"></i> Reset Filter
          </button>
        </div>
      </div>
      
      <table class="incident-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Jenis Kejadian</th>
            <th>Lokasi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(incident, index) in paginatedIncidents" :key="incident.id">
            <td>{{ startIndex + index + 1 }}</td>
            <td>{{ incident.tanggal }}</td>
            <td>{{ incident.jenisKejadian }}</td>
            <td>{{ incident.lokasi }}</td>
            <td>
              <span :class="['status-badge', incident.status.toLowerCase()]">
                {{ incident.status }}
              </span>
            </td>
            <td>
              <button class="btn-detail" @click="viewDetail(incident.id)">
                <i class="fas fa-eye"></i> Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredIncidents.length === 0" class="no-data">
        <p>Tidak ada data yang sesuai dengan kriteria pencarian dan filter.</p>
      </div>
      
      <div class="pagination-container">
        <div class="pagination-info-total">
          Total: {{ filteredIncidents.length }} kejadian
        </div>
        
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            @click="prevPage" 
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="pagination-info">
            Halaman {{ currentPage }} dari {{ totalPages || 1 }}
          </span>
          
          <button 
            class="pagination-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages || totalPages === 0"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <select v-model="pageSize" class="page-size-select" @change="resetPage">
            <option :value="5">5 per halaman</option>
            <option :value="10">10 per halaman</option>
            <option :value="20">20 per halaman</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPelaporanKejadian',
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: {
        jenisKejadian: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      incidents: [
        { id: 1, tanggal: '2023-05-01', jenisKejadian: 'Kebakaran', lokasi: 'Jl. Sudirman No. 45', status: 'Selesai' },
        { id: 2, tanggal: '2023-05-03', jenisKejadian: 'Banjir', lokasi: 'Kp. Melayu', status: 'Selesai' },
        { id: 3, tanggal: '2023-05-05', jenisKejadian: 'Pohon Tumbang', lokasi: 'Jl. Gatot Subroto', status: 'Proses' },
        { id: 4, tanggal: '2023-05-07', jenisKejadian: 'Kebakaran', lokasi: 'Psr. Minggu', status: 'Selesai' },
        { id: 5, tanggal: '2023-05-10', jenisKejadian: 'Kecelakaan', lokasi: 'Tol Dalam Kota', status: 'Selesai' },
        { id: 6, tanggal: '2023-05-12', jenisKejadian: 'Bangunan Runtuh', lokasi: 'Tanah Abang', status: 'Proses' },
        { id: 7, tanggal: '2023-05-15', jenisKejadian: 'Kebakaran', lokasi: 'Kemayoran', status: 'Selesai' },
        { id: 8, tanggal: '2023-05-18', jenisKejadian: 'Banjir', lokasi: 'Kampung Melayu', status: 'Proses' },
        { id: 9, tanggal: '2023-05-20', jenisKejadian: 'Kebakaran', lokasi: 'Jl. Diponegoro', status: 'Selesai' },
        { id: 10, tanggal: '2023-05-22', jenisKejadian: 'Longsor', lokasi: 'Puncak', status: 'Proses' },
        { id: 11, tanggal: '2023-05-25', jenisKejadian: 'Kebakaran', lokasi: 'Kelapa Gading', status: 'Selesai' },
        { id: 12, tanggal: '2023-05-28', jenisKejadian: 'Kecelakaan', lokasi: 'Jl. Rasuna Said', status: 'Proses' },
        { id: 13, tanggal: '2023-06-01', jenisKejadian: 'Banjir', lokasi: 'Manggarai', status: 'Selesai' },
        { id: 14, tanggal: '2023-06-05', jenisKejadian: 'Longsor', lokasi: 'Sentul', status: 'Proses' },
        { id: 15, tanggal: '2023-06-10', jenisKejadian: 'Pohon Tumbang', lokasi: 'Jl. Thamrin', status: 'Selesai' },
      ]
    };
  },
  computed: {
    uniqueJenisKejadian() {
      // Get unique jenis kejadian for filter dropdown
      return [...new Set(this.incidents.map(item => item.jenisKejadian))];
    },
    filteredIncidents() {
      // First apply search filter
      let result = this.incidents;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(incident => 
          incident.jenisKejadian.toLowerCase().includes(query) ||
          incident.lokasi.toLowerCase().includes(query) ||
          incident.status.toLowerCase().includes(query) ||
          incident.tanggal.includes(query)
        );
      }
      
      // Then apply dropdown filters
      if (this.filters.jenisKejadian) {
        result = result.filter(incident => 
          incident.jenisKejadian === this.filters.jenisKejadian
        );
      }
      
      if (this.filters.status) {
        result = result.filter(incident => 
          incident.status === this.filters.status
        );
      }
      
      // Apply date range filter
      if (this.filters.startDate && this.filters.endDate) {
        const startDate = new Date(this.filters.startDate);
        const endDate = new Date(this.filters.endDate);
        endDate.setDate(endDate.getDate() + 1); // Include the end date
        
        result = result.filter(incident => {
          const incidentDate = new Date(incident.tanggal);
          return incidentDate >= startDate && incidentDate < endDate;
        });
      } else if (this.filters.startDate) {
        const startDate = new Date(this.filters.startDate);
        result = result.filter(incident => 
          new Date(incident.tanggal) >= startDate
        );
      } else if (this.filters.endDate) {
        const endDate = new Date(this.filters.endDate);
        endDate.setDate(endDate.getDate() + 1); // Include the end date
        result = result.filter(incident => 
          new Date(incident.tanggal) < endDate
        );
      }
      
      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredIncidents.length / this.pageSize);
    },
    paginatedIncidents() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredIncidents.slice(startIndex, endIndex);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1; // Reset to first page when searching
    },
    applyFilters() {
      this.currentPage = 1; // Reset to first page when applying filters
    },
    resetFilters() {
      this.filters = {
        jenisKejadian: '',
        status: '',
        startDate: '',
        endDate: ''
      };
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    resetPage() {
      this.currentPage = 1;
    },
    viewDetail(id) {
      // Navigate to detail page or show modal
      console.log('View detail for incident ID:', id);
    },
    addNewReport() {
      // Navigate to form page or show modal for adding a new report
      console.log('Add new incident report');
      // For example:
      // this.$router.push('/tambah-laporan');
    }
  }
};
</script>

<style scoped>
.dashboard-pelaporan-kejadian {
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  color: #2c3e50;
}

.statistics-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  flex: 1;
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  font-size: 24px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f4f8;
  color: #3498db;
}

.stats-content h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: #7f8c8d;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

/* Table styles */
.incident-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* Table actions and add button */
.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-add-report {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2);
}

.btn-add-report:hover {
  background-color: #1d4ed8;
}

.btn-add-report i {
  font-size: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

/* Filter styles */
.filter-container {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #edf2f7;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
}

.filter-group > label {
  font-weight: 600;
  margin-right: 5px;
  color: #4a5568;
}

.filter-select, .filter-date {
  display: flex;
  align-items: center;
}

.filter-select label, .filter-date label {
  margin-right: 8px;
  font-size: 14px;
  color: #4a5568;
}

.filter-select select, .filter-date input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-inputs span {
  color: #718096;
  font-size: 14px;
}

.btn-reset-filter {
  background-color: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-reset-filter:hover {
  background-color: #e2e8f0;
}

.incident-table {
  width: 100%;
  border-collapse: collapse;
}

.incident-table th,
.incident-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.incident-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.selesai {
  background-color: #d4f9e2;
  color: #16a34a;
}

.status-badge.proses {
  background-color: #fef3c7;
  color: #d97706;
}

.btn-detail {
  background-color: #e6f7ff;
  color: #0ea5e9;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-detail:hover {
  background-color: #d1eeff;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-info-total {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 15px;
  font-size: 14px;
  color: #64748b;
}

.page-size-select {
  margin-left: 15px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .statistics-cards {
    flex-direction: column;
  }
  
  .table-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .btn-add-report {
    width: 100%;
    justify-content: center;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-select, .filter-date {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>