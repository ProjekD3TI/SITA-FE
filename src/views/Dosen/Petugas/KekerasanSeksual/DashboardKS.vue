<template>
  <div class="dashboard-pelaporan-kejadian">
    <h1 class="page-title">Dashboard Kekerasan Seksual</h1>
    
    <!-- Statistics Cards - Only Total Laporan -->
    <div class="statistics-cards">
      <div class="stats-card">
        <div class="stats-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stats-content">
          <h3>Total Laporan</h3>
          <p class="stats-number">{{ laporan.length }}</p>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="incident-table-container">
      <div class="table-actions">
        <h2>Daftar Laporan Kekerasan Seksual</h2>
      </div>

      <!-- Search and Action Buttons -->
      <div class="table-header">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari laporan..." 
            class="search-input"
            @input="handleSearch"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="action-buttons">
          <!-- Tombol Export PDF - langsung trigger download -->
          <button
            class="btn-export-pdf"
            @click="exportToPDF">
            <i class="fas fa-file-pdf"></i> Export PDF
          </button>
          
          <button class="btn-add-report" @click="addNewReport">
            <i class="fas fa-plus"></i> Tambah Laporan
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-container">
        <div class="filter-group">
          <label>Filter berdasarkan:</label>
          
          <div class="filter-select">
            <label for="categoryFilter">Kategori:</label>
            <select id="categoryFilter" v-model="filters.category_id" @change="applyFilters">
              <option value="">Semua</option>
              <option v-for="(name, id) in filteredCategories" :key="id" :value="id">
                {{ name }}
              </option>
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
              >
              <span>s/d</span>
              <input 
                type="date" 
                id="endDate" 
                v-model="filters.endDate" 
                @change="applyFilters"
              >
            </div>
          </div>
          
          <button class="btn-reset-filter" @click="resetFilters">
            <i class="fas fa-undo"></i> Reset Filter
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchData">Coba Lagi</button>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th @click="sort('nomor_laporan_kekerasan')" class="sortable-header">
                Nomor Laporan
                <i :class="getSortIcon('nomor_laporan_kekerasan')"></i>
              </th>
              <th @click="sort('created_at')" class="sortable-header">
                Tanggal Laporan Masuk
                <i :class="getSortIcon('created_at')"></i>
              </th>
              <th @click="sort('judul')" class="sortable-header">
                Judul
                <i :class="getSortIcon('judul')"></i>
              </th>
              <th @click="sort('category_id')" class="sortable-header">
                Kategori
                <i :class="getSortIcon('category_id')"></i>
              </th>
              <th @click="sort('nama_pelapor')" class="sortable-header">
                Nama Pelapor
                <i :class="getSortIcon('nama_pelapor')"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedLaporan" :key="item.laporan_kekerasan_id">
              <td>{{ startIndex + index + 1 }}</td>
              <td>{{ item.nomor_laporan_kekerasan }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>{{ item.judul }}</td>
              <td>{{ getCategoryName(item.category_id) }}</td>
              <td>{{ item.nama_pelapor }}</td>
              <td>
                <button class="btn-detail" @click="viewDetail(item)">
                  <i class="fas fa-eye"></i> Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- No Data State -->
        <div v-if="paginatedLaporan.length === 0" class="no-data">
          <i class="fas fa-info-circle"></i>
          <p>Tidak ada data laporan yang ditemukan</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error && filteredLaporan.length > 0" class="pagination-container">
        <div class="pagination-info-total">
          Total: {{ filteredLaporan.length }} laporan
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
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          
          <button 
            class="pagination-btn" 
            @click="nextPage" 
            :disabled="currentPage >= totalPages"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Template untuk PDF export (tersembunyi) -->
    <div id="pdf-content" style="display: none;">
      <div style="padding: 20px;">
        <!-- Logo di atas -->
        <div style="text-align: center; margin-bottom: 10px;">
          <img :src="d3tiLogoSrc" alt="D3TI Logo" style="height: 70px; margin: 0 auto;">
        </div>
        
        <!-- Judul yang lebih besar dari h2 dan bold -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">LAPORAN KEKERASAN SEKSUAL D3TI UNS</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div v-if="isFilterActive">
            <p v-if="filters.category_id">
              <strong>Kategori:</strong> {{ getCategoryName(filters.category_id) }}
            </p>
            <p v-if="filters.startDate || filters.endDate">
              <strong>Periode:</strong>
              {{ filters.startDate ? formatDate(filters.startDate) : '' }}
              {{ filters.startDate && filters.endDate ? ' s/d ' : '' }}
              {{ filters.endDate ? formatDate(filters.endDate) : '' }}
            </p>
            <p v-if="searchQuery">
              <strong>Pencarian:</strong> "{{ searchQuery }}"
            </p>
          </div>
          <p>
            <strong>Tanggal Export:</strong> {{ formatDate(new Date()) }}
          </p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">No</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Nomor Laporan</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Tanggal</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Judul</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Kategori</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Nama Pelapor</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataToExport" :key="index" :style="index % 2 === 0 ? '' : 'background-color: #f9f9f9;'">
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ index + 1 }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.nomor_laporan_kekerasan }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ formatDate(item.created_at) }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.judul }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ getCategoryName(item.category_id) }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.nama_pelapor }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">
                {{ item.tanggapan ? 'Sudah Ditanggapi' : 'Belum Ditanggapi' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies';
import html2pdf from 'html2pdf.js';
import d3tiLogo from '../../../../assets/images/d3ti-logo.png';
import { decryptData } from '../../../../services/encrypt';

export default {
  name: 'DashboardKS',
  data() {
    return {
      d3tiLogoSrc: d3tiLogo,
      apiBaseUrl: 'http://pelaporan-d3ti.my.id/api',
      laporan: [],
      categories: {},
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: '',
      filterCategory: 'all',
      selectedReport: null,
      filters: {
        category_id: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      exportInProgress: false,
      dataToExport: [],
      currentUser: 'miftahul01',
      currentDateTime: '2025-05-22 13:45:15',
      sortKey: '', // Column to sort by
      sortOrder: 1 // 1 for ascending, -1 for descending
    };
  },

  computed: {
    filteredCategories() {
      const filtered = {};
      
      // Loop through the categories object and include only those starting with "Kekerasan"
      for (const [id, name] of Object.entries(this.categories)) {
        if (name && name.startsWith('Kekerasan')) {
          filtered[id] = name;
        }
      }
      
      return filtered;
    },

    filteredLaporan() {
      let result = this.laporan;
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(item => 
          (item.judul && item.judul.toLowerCase().includes(query)) || 
          (item.nomor_laporan_kekerasan && item.nomor_laporan_kekerasan.toLowerCase().includes(query))
        );
      }
      
      // Apply category filter
      if (this.filters.category_id) {
        result = result.filter(item => 
          String(item.category_id) === String(this.filters.category_id)
        );
      }
      
      // Apply date range filter
      if (this.filters.startDate || this.filters.endDate) {
        result = result.filter(item => {
          // Convert to Date objects for comparison
          const itemDate = new Date(item.created_at || item.tanggal);
          
          // Check start date if specified
          if (this.filters.startDate) {
            const startDate = new Date(this.filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (itemDate < startDate) return false;
          }
          
          // Check end date if specified
          if (this.filters.endDate) {
            const endDate = new Date(this.filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (itemDate > endDate) return false;
          }
          
          return true;
        });
      }
      
      // Apply sorting if enabled
      if (this.sortKey) {
        result = this.sortItems([...result]);
      }
      
      return result;
    },
    
    paginatedLaporan() {
      return this.filteredLaporan.slice(
        this.startIndex,
        this.startIndex + this.itemsPerPage
      );
    },
    
    totalPages() {
      return Math.ceil(this.filteredLaporan.length / this.itemsPerPage);
    },
    
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    
    // Computed property untuk mendapatkan semua data yang terfilter tanpa pagination
    allFilteredData() {
      return this.filteredLaporan;
    },
    
    // Check if any filter is active
    isFilterActive() {
      return (
        this.searchQuery.trim() !== '' || 
        this.filters.category_id !== '' || 
        this.filters.startDate !== '' || 
        this.filters.endDate !== ''
      );
    }
  },

  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      
      try {
        // Use the getCurrentUser method to get user data
        const userData = this.getCurrentUser();
        let token = '';
        
        if (userData) {
          // Try to get token from userData
          token = userData.token || userData.access_token || '';
          
          // If we still don't have a token, check if the userData is the token itself
          if (!token && typeof userData === 'string') {
            token = userData;
          }
        }
        
        // Check if we have a token from authDosen
        if (!token && window.$auth && typeof window.$auth.getToken === 'function') {
          token = window.$auth.getToken();
        }

        console.log('Token available:', !!token, 'Token length:', token ? token.length : 0);
        
        if (!token) {
          // Try one more approach - direct access from cookies with a specific key
          const directToken = VueCookies.get('auth_token') || 
                              VueCookies.get('access_token') || 
                              VueCookies.get('token');
          
          if (directToken) {
            token = directToken;
          }
        }

        // If still no token, try to use authDosen for authentication
        if (!token && window.authDosen && typeof window.authDosen.getToken === 'function') {
          token = window.authDosen.getToken();
        }
        
        // Add token validation before proceeding
        if (!token) {
          // Show error but don't throw - this allows the UI to display properly
          this.error = 'Sesi login Anda telah berakhir. Silakan login kembali.';
          this.loading = false;
          
          // Add a button or auto-redirect to login
          setTimeout(() => {
            // Check if router is available
            if (this.$router) {
              this.$router.push('/login');
            } else {
              window.location.href = '/login';
            }
          }, 3000);
          
          return; // Exit the function early
        }

        console.log('Token available:', !!token, 'Token length:', token.length);
        
        // For debugging
        console.log('Token available:', !!token);
        
        // Use XMLHttpRequest instead of axios for better control
        const fetchCategories = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `${this.apiBaseUrl}/category`, true);
          xhr.setRequestHeader('Accept', 'application/json');
          
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                const categories = Array.isArray(response) ? 
                  response.reduce((acc, category) => {
                    acc[category.category_id] = category.nama;
                    return acc;
                  }, {}) : {};
                resolve(categories);
              } catch (error) {
                console.error('Error parsing categories response:', error);
                reject(new Error('Failed to parse categories data'));
              }
            } else {
              reject(new Error(`Failed to fetch categories: ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error('Network error while fetching categories'));
          };
          
          xhr.send();
        });
        
        const fetchLaporan = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `${this.apiBaseUrl}/laporan_kekerasan`, true);
          xhr.setRequestHeader('Accept', 'application/json');
          
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                console.error('Error parsing laporan response:', error);
                reject(new Error('Failed to parse laporan data'));
              }
            } else if (xhr.status === 401) {
              // Handle unauthorized specifically
              console.error('Authentication failed: 401 Unauthorized');
              reject(new Error('Authentication failed. Please login again.'));
            } else {
              reject(new Error(`Failed to fetch laporan: ${xhr.status}`));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error('Network error while fetching laporan'));
          };
          
          xhr.send();
        });

        try {
          // Try to fetch categories first
          this.categories = await fetchCategories;
          
          // Then try to fetch laporan data
          this.laporan = await fetchLaporan;
        } catch (error) {
          console.error('Error fetching data:', error);
          
          // If authentication failed, provide a more specific error
          if (error.message.includes('Authentication failed')) {
            this.error = 'Sesi login Anda telah berakhir. Silakan login kembali.';
          } else {
            this.error = 'Gagal memuat data. Silakan coba lagi nanti.';
          }
        }
      } catch (error) {
        console.error('Error in fetch operation:', error);
        this.error = 'Terjadi kesalahan. Silakan coba lagi nanti.';
      } finally {
        this.loading = false;
      }
    },

    // Add this method to your component
    getCurrentUser() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          // Try decryption first as this seems to be the expected format based on your getCurrentUser code
          try {
            const userData = decryptData(encryptedUserData);
            this.userData = userData;
            return userData;
          } catch (decryptError) {
            // If decryption fails, try parsing as JSON
            if (typeof encryptedUserData === 'string') {
              try {
                const parsedData = JSON.parse(encryptedUserData);
                this.userData = parsedData;
                return parsedData;
              } catch (jsonError) {
                // Not JSON either, might be just the token
                this.userData = { token: encryptedUserData };
                return { token: encryptedUserData };
              }
            } else if (typeof encryptedUserData === 'object') {
              this.userData = encryptedUserData;
              return encryptedUserData;
            }
          }
        }
        return null;
      } catch (error) {
        console.error("Error getting user data:", error);
        return null;
      }
    },

    getCategoryName(categoryId) {
      return this.categories[categoryId] || `Kategori ${categoryId}`;
    },

    getImageUrlForPath(path) {
      if (!path) return '';
        
      if (path.startsWith('http')) {
        return path;
      }
        
      const cleanPath = path.replace(/['"]/g, '');
        
      return `${this.apiBaseUrl.replace('/api', '')}/storage/laporankekerasan/${cleanPath}`;
    },

    viewReport(report) {
      this.selectedReport = report;
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.show();
    },

    viewDetail(id) {
      // Check what properties are available in the object
      console.log('ID being passed:', id, typeof id);
      
      // Extract the correct ID - it's laporan_kekerasan_id, not id
      let actualId;
      if (typeof id === 'object') {
        // First check for laporan_kekerasan_id
        if (id.laporan_kekerasan_id) {
          actualId = id.laporan_kekerasan_id;
        } 
        // Then try id as fallback
        else if (id.id) {
          actualId = id.id;
        } 
        // Log the object structure if we can't find the ID
        else {
          console.error('Cannot find ID in object:', Object.keys(id));
          return; // Don't navigate without a valid ID
        }
      } else {
        actualId = id;
      }
      
      console.log('Actual ID to use:', actualId);
      
      if (actualId) {
        // Use named route approach
        this.$router.push({ 
          name: 'DetailKS', // Make sure this matches the exact route name in your router config
          params: { id: actualId } 
        });
      }
    },

    handleSearch() {
      // Implement search logic
      this.applyFilters();
    },
    
    addNewReport() {
      // Navigate to form page or show modal for adding a new report
      console.log('Add new incident report');
      // For example:
      this.$router.push('/petugas/addpelaporankspetugas');
    },
    
    applyFilters() {
      console.log('Applying filters:', this.filters);
      
      // The filtering logic is now in the computed property
      // Just reset page when filters change
      this.currentPage = 1;
    },

    resetFilters() {
      this.filters = {
        category_id: '',
        status: '',
        startDate: '',
        endDate: ''
      };
      this.searchQuery = '';
      this.currentPage = 1;
      console.log('Filters reset');
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

    formatDate(dateString) {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      
      // Format to DD-MM-YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    },
    
    // New sorting methods
    sort(key) {
      // If already sorting by this key, reverse the order
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder * -1;
      } else {
        // Otherwise, set new sort key and default to ascending
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },
    
    sortItems(items) {
      const key = this.sortKey;
      const order = this.sortOrder;
      
      return items.sort((a, b) => {
        let valueA, valueB;
        
        // Special case for category which needs to be resolved to a name
        if (key === 'category_id') {
          valueA = this.getCategoryName(a[key]).toLowerCase();
          valueB = this.getCategoryName(b[key]).toLowerCase();
        } 
        // Special case for dates
        else if (key === 'created_at') {
          valueA = new Date(a[key] || 0).getTime();
          valueB = new Date(b[key] || 0).getTime();
        }
        // For nomor_laporan_kekerasan, extract the numeric part for sorting
        else if (key === 'nomor_laporan_kekerasan') {
          const numA = parseInt((a[key] || '').replace(/\D/g, '') || '0');
          const numB = parseInt((b[key] || '').replace(/\D/g, '') || '0');
          return (numA - numB) * order;
        }
        // Default case for string fields
        else {
          valueA = (a[key] || '').toLowerCase();
          valueB = (b[key] || '').toLowerCase();
        }
        
        // Standard comparison
        if (valueA < valueB) return -1 * order;
        if (valueA > valueB) return 1 * order;
        return 0;
      });
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fas fa-sort'; // default icon
      return this.sortOrder === 1 ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    
    // Method untuk export PDF dengan html2pdf.js
    async exportToPDF() {
      if (this.exportInProgress) return;
      
      this.exportInProgress = true;
      
      try {
        // Tentukan data yang akan diexport berdasarkan filter aktif atau semua data
        this.dataToExport = this.isFilterActive ? this.allFilteredData : this.laporan;
        
        // Tunggu sampai vue merender data di elemen tersembunyi
        await this.$nextTick();
        
        // Dapatkan elemen yang akan dikonversi ke PDF
        const element = document.getElementById('pdf-content');
        
        // Tampilkan dulu elemen
        element.style.display = 'block';
        
        // Menambahkan gaya khusus untuk export PDF untuk memastikan konten tidak terpotong
        const tempStyle = document.createElement('style');
        tempStyle.innerHTML = `
          #pdf-content table {
            page-break-inside: auto;
          }
          #pdf-content tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          #pdf-content table td, #pdf-content table th {
            overflow: visible !important;
            white-space: normal !important;
          }
        `;
        document.head.appendChild(tempStyle);
        
        // Opsi untuk html2pdf dengan margin yang ditingkatkan dan paging
        const options = {
          margin: [25, 15, 25, 15], // [top, right, bottom, left] in mm - margin lebih besar
          filename: `Laporan_Kekerasan_Seksual_${this.formatDate(new Date()).replace(/-/g, '')}.pdf`,
          image: { type: 'jpeg', quality: 1 }, // Kualitas maksimal
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: true,
            letterRendering: true,
            scrollY: 0,
            windowWidth: element.scrollWidth + 30, // Menambahkan padding untuk menghindari pemotongan
            windowHeight: element.scrollHeight + 30
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true,
            hotfixes: ["px_scaling"]
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        await html2pdf()
          .from(element)
          .set(options)
          .toPdf() // Convert to PDF object first
          .get('pdf')
          .then(pdf => {
            // Auto-calculate page count based on content
            const totalPages = pdf.internal.getNumberOfPages();
            // Ensure enough space at bottom of each page
            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(8);
              pdf.setTextColor(150);
              pdf.text(
                `Halaman ${i} dari ${totalPages} - Diekspor oleh: ${this.currentUser} - ${this.formatDate(new Date())}`,
                pdf.internal.pageSize.getWidth() / 2,
                pdf.internal.pageSize.getHeight() - 10,
                { align: 'center' }
              );
            }
          })
          .save(); // Save the PDF
        
        // Hapus style sementara
        document.head.removeChild(tempStyle);
        
        // Sembunyikan kembali elemen setelah diproses
        element.style.display = 'none';
        
        console.log('PDF berhasil dibuat dengan tanggal:', this.formatDate(new Date()));
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Terjadi kesalahan saat export PDF. Silakan coba lagi.');
      } finally {
        this.exportInProgress = false;
      }
    }
  },

  mounted() {
    this.fetchData();
    
    // Safer way to access currentUser information
    const userData = VueCookies.get('user_session');
    if (userData) {
      if (typeof userData === 'object' && userData.username) {
        this.currentUser = userData.username;
      } else if (typeof userData === 'string') {
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData && parsedData.username) {
            this.currentUser = parsedData.username;
          }
        } catch (e) {
          // Keep default value
        }
      }
    }
  }
}
</script>

<style scoped>
.dashboard-pelaporan-kejadian {
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
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
  background-color: #eb2525;
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
  box-shadow: 0 2px 5px rgba(235, 37, 37, 0.2);
}

.btn-add-report:hover {
  background-color: #d81d1d;
}

.btn-add-report i {
  font-size: 12px;
}

.btn-export-pdf {
  background-color: #16a34a;
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
  box-shadow: 0 2px 5px rgba(22, 163, 74, 0.2);
  margin-right: 10px;
}

.btn-export-pdf:hover {
  background-color: #15803d;
}

.btn-export-pdf i {
  font-size: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search-container {
  position: relative; /* Add this line */
  flex: 1;
  max-width: 400px;
}

.action-buttons {
  margin-left: 15px;
  display: flex;
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
  z-index: 1; /* Add this to ensure icon appears above input */
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

/* Loading State */
.loading-indicator {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-message {
  text-align: center;
  padding: 40px 0;
  color: #e53e3e;
}

.retry-button {
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #c53030;
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
  
  .btn-add-report, .btn-export-pdf {
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

<style scoped>
/* Table styling for proper spacing and layout */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

/* Column widths to maintain consistent spacing */
.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 5%;
  text-align: center;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 15%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 20%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 15%;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 15%;
}

.data-table th:nth-child(6),
.data-table td:nth-child(6) {
  width: 15%;
}

.data-table th:nth-child(7),
.data-table td:nth-child(7) {
  width: 15%;
  text-align: center;
}

/* New styles for sortable headers */
.sortable-header {
  cursor: pointer;
  position: relative;
  user-select: none;
}

.sortable-header:hover {
  background-color: #f2f2f2;
}

.sortable-header i {
  margin-left: 5px;
  font-size: 12px;
}

/* Status badge styling */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
}

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

/* Button styling */
.btn-detail {
  background-color: #e6f7ff;
  color: #0ea5e9;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-detail:hover {
  background-color: #0ea5e9;
  color: #e6f7ff;
}

.btn-detail i {
  font-size: 14px;
}

/* Loading & error states */
.loading-indicator, 
.error-message, 
.no-data {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.loading-indicator {
  color: #4b5563;
}

.error-message {
  color: #dc2626;
}

.no-data {
  color: #6b7280;
  font-style: italic;
}

/* Container styling */
.dashboard-container {
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - 64px); /* Adjust based on your header height */
}

/* Pagination styling */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination-info-total {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pagination-button {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  font-size: 14px;
  padding: 4px 8px;
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Table responsive fixes */
.table-responsive {
  overflow-x: auto;
  margin-bottom: 1.5rem;
  -webkit-overflow-scrolling: touch;
}
</style>

<style>
/* Global status badge styles */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

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
</style>