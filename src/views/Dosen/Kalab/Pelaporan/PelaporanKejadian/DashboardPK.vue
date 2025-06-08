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
          <p class="stats-number">{{ laporan.length }}</p>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon-procces">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stats-content">
          <h3>Dalam Proses</h3>
          <p class="stats-number">{{ unverifiedCount }}</p>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="stats-icon-done">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stats-content">
          <h3>Selesai Ditangani</h3>
          <p class="stats-number">{{ verifiedCount }}</p>
        </div>
      </div>
    </div>
    
    <!-- Table with search, filters and pagination -->
    <div class="incident-table-container">
      <div class="table-actions">
        <h2>Daftar Kejadian</h2>
      </div>
      
      <div class="table-header">
        <div class="search-container">
          <input
            v-model="search"
            type="text"
            placeholder="Cari laporan..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="action-buttons">
          <!-- Tombol Export PDF - langsung trigger download -->
          <button
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
            @click="exportToPDF">
            <i class="fas fa-file-pdf"></i> Export PDF
          </button>

          <button 
            class="urgent-report-btn ms-2" 
            @click="openUrgentReportDialog"
          >
            <i class="mdi mdi-alert-circle"></i>
            Tambah Laporan Mendesak
          </button>
          
          <button                               
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            @click="addNewReport">
            <i class="fas fa-plus"></i> Tambah Laporan
          </button>
        </div>
      </div>
      
      <!-- Filter controls -->
      <div class="filter-container">
        <div class="filter-group">
          <label class="filter-title">Filter berdasarkan:</label>
          
          <!-- Category Filter -->
          <div class="filter-select">
            <label for="categoryFilter">Kategori:</label>
            <select 
              id="categoryFilter" 
              v-model="filters.category_id" 
              @change="applyFilters"
              class="filter-input"
            >
              <option value="">Semua</option>
              <option v-for="(name, id) in filteredCategories" :key="id" :value="id">
                {{ name }}
              </option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div class="filter-select">
            <label for="statusFilter">Status:</label>
            <select 
              id="statusFilter" 
              v-model="filters.status" 
              @change="applyFilters"
              class="filter-input"
            >
              <option value="">Semua</option>
              <option value="Belum Diverifikasi">Belum Diverifikasi</option>
              <option value="Diproses">Diproses</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          
          <!-- Date Range Filter -->
          <div class="filter-date">
            <label for="dateFilter">Periode:</label>
            <div class="date-inputs">
              <input 
                type="date" 
                id="startDate" 
                v-model="filters.startDate" 
                @change="applyFilters"
                class="filter-input"
                placeholder="Tanggal Mulai"
              >
              <span class="date-separator">s/d</span>
              <input 
                type="date" 
                id="endDate" 
                v-model="filters.endDate" 
                @change="applyFilters"
                class="filter-input"
                placeholder="Tanggal Akhir"
              >
            </div>
          </div>
          
          <!-- Reset Filter Button -->
          <button class="btn-reset-filter" @click="resetFilters">
            <i class="fas fa-undo"></i> Reset Filter
          </button>
        </div>
      </div>
      
      <!-- Table section -->
      <table class="data-table">
        <thead>
            <tr>
              <th>No</th>
              <th @click="sortBy('nomor_laporan')" class="sortable">
                Nomor Laporan
                <i :class="getSortIcon('nomor_laporan')"></i>
              </th>
              <th @click="sortBy('created_at')" class="sortable">
                Tanggal Laporan Masuk
                <i :class="getSortIcon('created_at')"></i>
              </th>
              <th @click="sortBy('judul')" class="sortable">
                Judul
                <i :class="getSortIcon('judul')"></i>
              </th>
              <th @click="sortBy('category_id')" class="sortable">
                Kategori
                <i :class="getSortIcon('category_id')"></i>
              </th>
              <th @click="sortBy('nama_pelapor')" class="sortable">
                Nama Pelapor
                <i :class="getSortIcon('nama_pelapor')"></i>
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <i :class="getSortIcon('status')"></i>
              </th>
              <th>Aksi</th>
            </tr>
          </thead>
        <tbody>
          <tr v-for="(item, index) in filteredLaporan" :key="item.id">
            <td>{{ startIndex + index + 1 }}</td>
            <td>{{ item.nomor_laporan }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ item.judul }}</td>
            <td>{{ getCategoryName(item.category_id) }}</td>
            <td>{{ item.nama_pelapor }}</td>
            <td>
              <span :class="['status-badge', item.status.toLowerCase()]">
                {{ formatStatus(item.status) }}
              </span>
            </td>
            <td>
              <button class="btn-detail" @click="viewDetail(item.laporan_id)">
                <i class="fas fa-eye"></i> Detail
              </button>
            </td>
          </tr>
          <tr v-if="displayedLaporan.length === 0">
            <td colspan="8" class="no-data">Tidak ada data yang ditampilkan</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredLaporan.length === 0" class="no-data">
        <p>Tidak ada data yang sesuai dengan kriteria pencarian dan filter.</p>
      </div>
      
      <div class="pagination-container">
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
    
    <!-- Style Tabel untuk ekspor PDF -->
    <div id="pdf-content" style="display: none;">
      <div style="padding: 20px;">
        <!-- Logo di atas -->
        <div style="text-align: center; margin-bottom: 10px;">
          <img :src="d3tiLogoSrc" alt="D3TI Logo" style="height: 70px; margin: 0 auto;">
        </div>
        
        <!-- Judul yang lebih besar dari h2 dan bold -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">LAPORAN KEJADIAN D3TI UNS</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div v-if="isFilterActive">
            <p v-if="filters.category_id">
              <strong>Kategori:</strong> {{ getCategoryName(filters.category_id) }}
            </p>
            <p v-if="filters.status">
              <strong>Status:</strong> {{ filters.status }}
            </p>
            <p v-if="filters.startDate || filters.endDate">
              <strong>Periode:</strong>
              {{ filters.startDate ? formatDate(filters.startDate) : '' }}
              {{ filters.startDate && filters.endDate ? ' s/d ' : '' }}
              {{ filters.endDate ? formatDate(filters.endDate) : '' }}
            </p>
            <p v-if="search">
              <strong>Pencarian:</strong> "{{ search }}"
            </p>
          </div>
          <p>
            <strong>Tanggal Export:</strong> {{ formatDate(new Date()) }}
          </p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle; width: 5%;">No</th>
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
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.nomor_laporan }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ formatDate(item.created_at) }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.judul }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ getCategoryName(item.category_id) }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ item.nama_pelapor }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle;">{{ formatStatus(item.status) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { decryptData } from "../../../../../services/encrypt";
import VueCookies from "vue-cookies";
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import d3tiLogo from '../../../../../assets/images/d3ti-logo.png';
import { useRouter } from 'vue-router';

const router = useRouter();

// State with ref
const d3tiLogoSrc = ref(d3tiLogo);
const currentPage = ref(1);
const pageSize = ref(10);
const filters = ref({
  category_id: '',
  status: '',
  startDate: '',
  endDate: ''
});
const laporan = ref([]); // This will store API data
const categories = ref({});
const selectedStatus = ref('all');
const itemsPerPage = ref(10);
const loading = ref(true); // Start with loading true
const error = ref(null);
const search = ref(''); // Replace or use alongside searchQuery if you prefer
const totalFilteredCount = ref(0); // New property to store total filtered count
const exportInProgress = ref(false); // Flag to prevent multiple exports at once
const dataToExport = ref([]); // Data that will be exported to PDF
const sortKey = ref('created_at');  // Default sort by creation date
const sortOrder = ref('desc');      // Default to descending (newest first)

// Computed properties
const filteredLaporan = computed(() => {
  // Start with all reports
  let result = [...laporan.value];
  
  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(item => 
      (item.judul && item.judul.toLowerCase().includes(searchTerm)) || 
      (item.nomor_laporan && item.nomor_laporan.toLowerCase().includes(searchTerm)) ||
      (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      let aValue = a[sortKey.value];
      let bValue = b[sortKey.value];
      
      // Special handling for category_id
      if (sortKey.value === 'category_id') {
        aValue = getCategoryName(aValue);
        bValue = getCategoryName(bValue);
      }
      
      // Special handling for status
      if (sortKey.value === 'status') {
        aValue = formatStatus(aValue);
        bValue = formatStatus(bValue);
      }
      
      // Handle dates
      if (sortKey.value === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Compare the values
      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortOrder.value === 'desc' ? -comparison : comparison;
    });
  }
  
  // Apply category filter
  if (filters.value.category_id) {
    result = result.filter(item => 
      String(item.category_id) === String(filters.value.category_id)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    // Map frontend status labels to actual status values in the data
    const statusMap = {
      'Belum Diverifikasi': 'unverified',
      'Diproses': 'verified',
      'Ditolak': 'rejected',
      'Selesai': 'finished'
    };
    
    const statusValue = statusMap[filters.value.status] || filters.value.status;
    result = result.filter(item => item.status === statusValue);
  }
  
  // Apply date range filter
  if (filters.value.startDate || filters.value.endDate) {
    result = result.filter(item => {
      // Convert to Date objects for comparison
      const itemDate = new Date(item.created_at || item.tanggal);
      
      // Check start date if specified
      if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (itemDate < startDate) return false;
      }
      
      // Check end date if specified
      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) return false;
      }
      
      return true;
    });
  }
  
  // Store total filtered count before pagination
  totalFilteredCount.value = result.length;
  
  // Apply pagination directly in filteredLaporan
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  
  return result.slice(start, end);
});

// Computed property untuk mendapatkan semua data yang terfilter tanpa pagination
const allFilteredData = computed(() => {
  // Start with all reports
  let result = [...laporan.value];
  
  // Apply search filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter(item => 
      (item.judul && item.judul.toLowerCase().includes(searchTerm)) || 
      (item.nomor_laporan && item.nomor_laporan.toLowerCase().includes(searchTerm)) ||
      (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply category filter
  if (filters.value.category_id) {
    result = result.filter(item => 
      String(item.category_id) === String(filters.value.category_id)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    // Map frontend status labels to actual status values in the data
    const statusMap = {
      'Belum Diverifikasi': 'unverified',
      'Diproses': 'verified',
      'Ditolak': 'rejected'
    };
    
    const statusValue = statusMap[filters.value.status] || filters.value.status;
    result = result.filter(item => item.status === statusValue);
  }
  
  // Apply date range filter
  if (filters.value.startDate || filters.value.endDate) {
    result = result.filter(item => {
      // Convert to Date objects for comparison
      const itemDate = new Date(item.created_at || item.tanggal);
      
      // Check start date if specified
      if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (itemDate < startDate) return false;
      }
      
      // Check end date if specified
      if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) return false;
      }
      
      return true;
    });
  }
  
  return result;
});

// Check if any filter is active
const isFilterActive = computed(() => {
  return (
    search.value.trim() !== '' || 
    filters.value.category_id !== '' || 
    filters.value.status !== '' || 
    filters.value.startDate !== '' || 
    filters.value.endDate !== ''
  );
});

// Update totalPages to use totalFilteredCount
const totalPages = computed(() => {
  return Math.ceil(totalFilteredCount.value / pageSize.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + filteredLaporan.value.length, totalFilteredCount.value);
});

const unverifiedCount = computed(() => {
  return laporan.value.filter(item => item.status === 'verified').length;
});

const verifiedCount = computed(() => {
  return laporan.value.filter(item => item.status === 'finished').length;
});

// Display data should be based on filteredLaporan instead of laporan directly
const displayedLaporan = computed(() => {
  const start = startIndex.value;
  const end = start + itemsPerPage.value;
  return filteredLaporan.value.slice(start, end);
});

const filteredCategories = computed(() => {
  const filtered = {};
  
  // Loop through the categories object and exclude those starting with "Kekerasan"
  for (const [id, name] of Object.entries(categories.value)) {
    if (!name.startsWith('Kekerasan')) {
      filtered[id] = name;
    }
  }
  
  return filtered;
});

// Methods
const fetchData = async () => {
  loading.value = true;
  try {
    // Check for authentication token in cookies
    const token = VueCookies.get('auth_token');
    if (token) {
      // You can use the decryptData function here if needed
      // const decryptedToken = decryptData(token);
      
      // Set axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch categories first
    const categoriesResponse = await axios.get('https://v3422040.mhs.d3tiuns.com/api/category');
    // Transform categories array to an object with id as key for easy lookup
    categories.value = categoriesResponse.data.reduce((acc, category) => {
      acc[category.category_id] = category.nama;
      return acc;
    }, {});
    
    // Then fetch laporan data
    const laporanResponse = await axios.get('https://v3422040.mhs.d3tiuns.com/api/laporan');
    laporan.value = laporanResponse.data;
    
    console.log('Laporan data loaded:', laporan.value); // Debug log
    console.log('Categories loaded:', categories.value); // Debug log
  } catch (error) {
    console.error('Error fetching data:', error);
    error.value = 'Gagal memuat data. Silakan coba lagi nanti.';
  } finally {
    loading.value = false;
  }
};

// Modify your sortBy function (if it exists) or add it
const sortBy = (key) => {
  if (sortKey.value === key) {
    // Toggle order if clicking the same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to descending for dates, ascending for others
    sortKey.value = key;
    sortOrder.value = key === 'created_at' ? 'desc' : 'asc';
  }
};

// Update your getSortIcon function if it exists
const getSortIcon = (key) => {
  if (sortKey.value !== key) return 'fas fa-sort';
  return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
};

const getCategoryName = (categoryId) => {
  return categories.value[categoryId] || 'Tidak ada kategori';
};

const formatStatus = (status) => {
  const statusMap = {
    'unverified': 'Belum Diverifikasi',
    'verified': 'Diproses',
    'rejected': 'Ditolak',
    'finished': 'Selesai'
  };
  
  return statusMap[status] || status;
};

const openUrgentReportDialog = () => {
  // Add your logic to open a dialog or navigate to urgent report form
  router.push('/kalab/addpelaporankejadianmendesakkalab'); // Or use a dialog instead
};

const addNewReport = () => {
  // Navigate to form page or show modal for adding a new report
  console.log('Add new incident report');
  // For example:
  router.push('/kalab/addpelaporankejadiankalab');
};

const viewDetail = (laporanId) => {
  // Explicitly use the correct route name with parameter
  router.push({ 
    name: 'DetailPK', 
    params: { id: laporanId } 
  });
};

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// New filtering method
const applyFilters = () => {
  // The computed property will automatically apply filters
  // Just reset the current page
  currentPage.value = 1;
};

const resetFilters = () => {
  filters.value = {
    category_id: '',
    status: '',
    startDate: '',
    endDate: ''
  };
  search.value = '';
  currentPage.value = 1;
};

const handleSearch = () => {
  // Reset to first page when search term changes
  currentPage.value = 1;
};

const resetPage = () => {
  // Reset to page 1 when page size changes
  currentPage.value = 1;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Format to DD-MM-YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Method untuk export PDF dengan html2pdf.js
const exportToPDF = async () => {
  if (exportInProgress.value) return;

  exportInProgress.value = true;

  try {
    // Determine the data to export based on active filters or all data
    dataToExport.value = isFilterActive.value ? allFilteredData.value : laporan.value;

    // Wait for Vue to render hidden elements
    await nextTick();

    // Get the element to be converted to PDF
    const element = document.getElementById('pdf-content');

    // Ensure the element is visible
    element.style.display = 'block';

    // Options for html2pdf
    const options = {
      margin: [20, 10, 20, 10], // [top, right, bottom, left] in mm
      filename: `Laporan_Kejadian_${formatDate(new Date()).replace(/-/g, '')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Generate PDF
    await html2pdf()
      .from(element)
      .set(options)
      .save();

    // Hide the element again after processing
    element.style.display = 'none';
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Terjadi kesalahan saat export PDF. Silakan coba lagi.');
  } finally {
    exportInProgress.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchData();

  const savedPageSize = localStorage.getItem('dashboardPkPageSize');
  if (savedPageSize) {
    pageSize.value = parseInt(savedPageSize);
  }
});

// Clean up any event listeners or resources when component unmounts
onBeforeUnmount(() => {
  // Any cleanup logic needed
});

// Watchers
watch(search, () => {
  currentPage.value = 1;
});

watch(pageSize, (newValue) => {
  // Optionally save the user's preference to localStorage
  localStorage.setItem('dashboardPkPageSize', newValue);
});

watch(filters, () => {
  resetPage();
}, { deep: true });

// Reset pagination when filtered results change significantly
watch(totalFilteredCount, (newCount) => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});
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

.stats-icon-procces {
  font-size: 24px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f4f8;
  color: #d97706;
}

.stats-icon-done {
  font-size: 24px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f4f8;
  color: #16a34a;
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
}

.data-table th:nth-child(8),
.data-table td:nth-child(8) {
  width: 15%;
  text-align: center;
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

.finished {
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

/* You can keep your existing styles and add these if needed */
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

#pdf-content table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

#pdf-content th, #pdf-content td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
  page-break-inside: avoid; /* Prevent cells from splitting across pages */
}

#pdf-content thead {
  display: table-header-group; /* Ensure headers repeat on each page */
}

#pdf-content tbody tr {
  page-break-inside: avoid; /* Prevent rows from splitting */
}

#pdf-content {
  page-break-inside: auto; /* Ensure the container doesn't break poorly */
}

.urgent-report-btn {
  background-color: #FF5252; /* error color for urgency */
  color: white;
  border: none;
  border-radius: 8px; /* matching the rounded corners of other buttons */
  padding: 8px 16px; /* same padding as other buttons */
  font-size: 14px; /* match font size */
  font-weight: 500; /* adding medium font weight for consistency */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px; /* consistent spacing between buttons */
  margin-left: 8px; /* consistent spacing between buttons */
  height: 40px; /* ensuring consistent height */
  box-shadow: 0 2px 5px rgba(255, 82, 82, 0.2); /* subtle shadow like other buttons */
  transition: background-color 0.2s;
}

.urgent-report-btn:hover {
  background-color: #FF1744; /* darker shade on hover */
}

.urgent-report-btn i {
  font-size: 16px; /* slightly smaller icon size for better alignment */
}
</style>