<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="content-wrapper">
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
            <div :class="['status-badge', laporan.status]">
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
            
            <!-- Updated image handling for multiple images -->
            <div v-if="imagePaths && imagePaths.length > 0" class="image-container">
              <h4 class="font-medium mb-2 mt-4">Foto Bukti Kejadian</h4>
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

            <!-- Fallback for single image (old format) -->
            <div v-else-if="laporan.image_path && !imagePaths.length" class="image-container">
              <img 
                :src="getImageUrl(laporan.image_path)" 
                alt="Gambar Kejadian" 
                class="evidence-image" 
                @click="showFullImage = true"
                @error="handleSingleImageError"
              >
              <div class="image-caption">Foto Bukti Kejadian (klik untuk memperbesar)</div>
            </div>
          </div>

          <div class="detail-cards-row">
            <div class="detail-card">
              <h3 class="detail-section-title"><i class="fas fa-user"></i> Informasi Pelapor</h3>
              <div class="info-grid">
                <div class="info-label">Nama:</div>
                <div class="info-value">{{ laporan.nama_pelapor }}</div>
                
                <div class="info-label">NI Pelapor:</div>
                <div class="info-value">{{ laporan.nim_pelapor }}</div>
                
                <div class="info-label">No. Telepon:</div>
                <div class="info-value">
                  {{ laporan.nomor_telepon || 'Tidak ada' }}
                  <button class="chat-icon-button" @click="startChat" title="Chat dengan pengguna">
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
                  <span :class="['status-badge', laporan.status]">
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
          
          <!-- NEW SECTION: Terlapor (Reported Person) -->
          <div class="detail-card" v-if="hasReportedPersons">
            <h3 class="detail-section-title"><i class="fas fa-user-shield"></i> Informasi Terlapor</h3>
            <div v-for="(person, index) in laporan.terlapor" :key="'reported-' + index" class="person-item">
              <h4 class="person-title">Terlapor {{ index + 1 }}</h4>
              <div class="info-grid" style="grid-template-columns: 130px 1fr;">
                <div class="info-label">Nama Lengkap:</div>
                <div class="info-value">{{ person.nama_lengkap || '-' }}</div>
                
                <div class="info-label">Email:</div>
                <div class="info-value">{{ person.email || '-' }}</div>
                
                <div class="info-label">Telepon:</div>
                <div class="info-value">{{ person.nomor_telepon || '-' }}</div>
                
                <div class="info-label">Status:</div>
                <div class="info-value">{{ capitalizeSentence(person.status_warga) || '-' }}</div>
                
                <div class="info-label" v-if="person.unit_kerja">Unit Kerja:</div>
                <div class="info-value" v-if="person.unit_kerja">{{ person.unit_kerja }}</div>
              </div>
            </div>
          </div>
          
          <!-- NEW SECTION: Saksi (Witnesses) -->
          <div class="detail-card" v-if="hasWitnesses">
            <h3 class="detail-section-title"><i class="fas fa-eye"></i> Informasi Saksi</h3>
            <div v-for="(witness, index) in laporan.saksi" :key="'witness-' + index" class="person-item">
              <h4 class="person-title">Saksi {{ index + 1 }}</h4>
              <div class="info-grid" style="grid-template-columns: 130px 1fr;">
                <div class="info-label">Nama Lengkap:</div>
                <div class="info-value">{{ witness.nama_lengkap || '-' }}</div>
                
                <div class="info-label">Email:</div>
                <div class="info-value">{{ witness.email || '-' }}</div>
                
                <div class="info-label">Telepon:</div>
                <div class="info-value">{{ witness.nomor_telepon || '-' }}</div>
              </div>
            </div>
          </div>
          
          <!-- External Link Section -->
          <div class="detail-card" v-if="laporan.lampiran_link">
            <h3 class="detail-section-title"><i class="fas fa-link"></i> Link Lampiran</h3>
            <div class="link-container">
              <a :href="laporan.lampiran_link" target="_blank" class="external-link">
                <i class="fas fa-external-link-alt"></i> {{ laporan.lampiran_link }}
              </a>
            </div>
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
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'DetailKekerasanSeksual',
  components: {
    Header,
    Sidebar,
    Footer
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const laporanId = ref(null);
    const laporan = ref({});
    const categories = ref({});
    const loading = ref(true);
    const error = ref(null);
    const showFullImage = ref(false);
    const isAdmin = ref(false);
    const authToken = ref('');
    const userData = ref(null);
    const baseUrl = ref('https://v3422040.mhs.d3tiuns.com');
    
    // New properties for image handling
    const imagePaths = ref([]);
    const currentImageIndex = ref(0);
    const currentFullImageUrl = ref('');
    const currentDateTime = ref('2025-05-16 03:03:05'); // Current datetime from your request
    const currentUser = ref('miftahul01'); // Current user's login
    
    // Computed properties
    const hasReportedPersons = computed(() => {
      return laporan.value && 
             laporan.value.terlapor && 
             Array.isArray(laporan.value.terlapor) && 
             laporan.value.terlapor.length > 0;
    });
    
    const hasWitnesses = computed(() => {
      return laporan.value && 
             laporan.value.saksi && 
             Array.isArray(laporan.value.saksi) && 
             laporan.value.saksi.length > 0;
    });
    
    // Get current user and auth token from cookies
    const getCurrentUser = () => {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          userData.value = decryptData(encryptedUserData);
          console.log("Current user loaded:", userData.value.name);
        }
        
        // Get auth token from cookies
        const token = VueCookies.get("auth_token");
        if (token) {
          authToken.value = token;
          // Set default Authorization header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log("Auth token loaded");
        } else {
          console.warn("No auth token found in cookies");
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    };
    
    onMounted(() => {
      // Load auth token first
      getCurrentUser();
      
      // Extract the ID from the route params
      const routeParam = route.params.id;
      console.log('Route param received:', routeParam, typeof routeParam);
      
      // Handle different formats of the ID parameter
      if (typeof routeParam === 'object') {
        // If it's an object, try to extract the ID
        if (routeParam.id) {
          laporanId.value = routeParam.id;
        } else {
          // Try to find the ID in the object
          const keys = Object.keys(routeParam);
          if (keys.length > 0) {
            laporanId.value = routeParam[keys[0]];
          } else {
            console.error('Could not extract ID from object');
            error.value = 'Invalid report ID';
            return;
          }
        }
      } else {
        laporanId.value = routeParam;
      }
      
      console.log('Extracted ID:', laporanId.value);
      fetchCategories();
      fetchLaporanDetail();
      checkUserRole();
    });
    
    const parseImagePaths = (imagePath) => {
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
    };
    
    const getImageUrlForPath = (path) => {
      if (!path) return '';
      
      // If it's already a full URL, return it as is
      if (path.startsWith('http')) {
        return path;
      }
      
      // Clean up the path - remove any quotes
      const cleanPath = path.replace(/['"]/g, '');
      
      // Use the first format you provided
      return `${baseUrl.value}/public/storage/laporankekerasan/${cleanPath}`;
    };
    
    const handleImageError = (event, index) => {
      const img = event.target;
      const originalSrc = img.src;
      const path = imagePaths.value[index];
      
      // If we've already tried all fallbacks, show placeholder
      if (originalSrc.includes('fallback=4')) {
        img.src = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
        return;
      }
      
      const baseDomain = baseUrl.value;
      let newUrl;
      
      // Try different path patterns for the image
      if (!originalSrc.includes('fallback=')) {
        // First try: Backend-Port path 
        newUrl = `${baseDomain}/Backend-Port/backend/engine/public/storage/laporankekerasan/${path}?fallback=2`;
      } else if (originalSrc.includes('fallback=2')) {
        // Second try: api/storage path
        newUrl = `${baseDomain}/api/storage/laporankekerasan/${path}?fallback=3`;
      } else if (originalSrc.includes('fallback=3')) {
        // Third try: direct storage path
        newUrl = `${baseDomain}/storage/laporankekerasan/${path}?fallback=4`;
      } else {
        // If all else fails, show placeholder
        newUrl = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
      }
      
      img.src = newUrl;
    };
    
    const handleSingleImageError = (event) => {
      const img = event.target;
      const originalSrc = img.src;
      
      // If we've already tried all fallbacks, show placeholder
      if (originalSrc.includes('fallback=4')) {
        img.src = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
        return;
      }
      
      const baseDomain = baseUrl.value;
      let newUrl;
      
      // Try different path patterns for a single image
      if (!originalSrc.includes('fallback=')) {
        // First try: Backend-Port path 
        newUrl = `${baseDomain}/Backend-Port/backend/engine/public/storage/laporankekerasan/${laporan.value.image_path}?fallback=2`;
      } else if (originalSrc.includes('fallback=2')) {
        // Second try: api/storage path
        newUrl = `${baseDomain}/api/storage/laporankekerasan/${laporan.value.image_path}?fallback=3`;
      } else if (originalSrc.includes('fallback=3')) {
        // Third try: direct storage path
        newUrl = `${baseDomain}/storage/laporankekerasan/${laporan.value.image_path}?fallback=4`;
      } else {
        // If all else fails, show placeholder
        newUrl = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
      }
      
      img.src = newUrl;
    };
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl.value}/api/category`);
        categories.value = response.data.reduce((acc, category) => {
          acc[category.category_id] = category.nama;
          return acc;
        }, {});
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    const fetchLaporanDetail = async () => {
      try {
        if (!laporanId.value) {
          error.value = 'No valid ID provided';
          loading.value = false;
          return;
        }
        
        loading.value = true;
        
        // Check if we have an auth token before making API calls
        if (!authToken.value) {
          error.value = 'Anda tidak memiliki akses. Silakan login kembali.';
          loading.value = false;
          return;
        }
        
        // Configure axios with auth header
        const config = {
          headers: {
            'Authorization': `Bearer ${authToken.value}`
          }
        };
        
        console.log('Fetching with ID:', laporanId.value, typeof laporanId.value);
        
        const response = await axios.get(`${baseUrl.value}/api/laporan_kekerasan/${laporanId.value}`, config);
        
        laporan.value = response.data;
        
        // Process images
        if (laporan.value.image_path) {
          // Try to fix common issues with data format before parsing
          let imagePathData = laporan.value.image_path;
          
          // Fix double-encoded JSON (common issue)
          if (typeof imagePathData === 'string' && imagePathData.startsWith('"[') && imagePathData.endsWith(']"')) {
            try {
              imagePathData = JSON.parse(imagePathData);
            } catch (e) {
              console.error('Error unescaping image_path:', e);
            }
          }
          
          imagePaths.value = parseImagePaths(imagePathData);
          console.log('Parsed image paths:', imagePaths.value);
        }
        
        loading.value = false;
      } catch (err) {
        console.error('Error fetching laporan detail:', err);
        if (err.response && err.response.status === 401) {
          error.value = 'Sesi anda telah berakhir. Silakan login kembali.';
        } else {
          error.value = 'Gagal memuat detail laporan';
        }
        loading.value = false;
      }
    };
    
    const capitalizeSentence = (text) => {
      if (!text) return '';
      return text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
    
    const openFullImage = (index) => {
      if (imagePaths.value && imagePaths.value.length > index) {
        currentImageIndex.value = index;
        currentFullImageUrl.value = getImageUrlForPath(imagePaths.value[index]);
        showFullImage.value = true;
      }
    };
    
    const nextImage = (e) => {
      if (e) e.stopPropagation();
      if (!imagePaths.value || imagePaths.value.length <= 1) return;
      
      currentImageIndex.value = (currentImageIndex.value + 1) % imagePaths.value.length;
      currentFullImageUrl.value = getImageUrlForPath(imagePaths.value[currentImageIndex.value]);
    };
    
    const prevImage = (e) => {
      if (e) e.stopPropagation();
      if (!imagePaths.value || imagePaths.value.length <= 1) return;
      
      currentImageIndex.value = (currentImageIndex.value - 1 + imagePaths.value.length) % imagePaths.value.length;
      currentFullImageUrl.value = getImageUrlForPath(imagePaths.value[currentImageIndex.value]);
    };
    
    const goBack = () => {
      router.go(-1);
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return new Date(dateString).toLocaleDateString('id-ID', options);
    };
    
    const formatStatus = (status) => {
      const statusMap = {
        'unverified': 'Belum Diverifikasi',
        'verified': 'Diverifikasi',
        'processed': 'Diproses',
        'completed': 'Selesai',
        'rejected': 'Ditolak'
      };
      
      return statusMap[status] || status;
    };
    
    const getCategoryName = (categoryId) => {
      return categories.value[categoryId] || `Kategori ${categoryId}`;
    };
    
    const getImageUrl = (imagePath) => {
      if (!imagePath) return '';
      
      // Check if image_path is a JSON string and parse it
      if (typeof imagePath === 'string' && (imagePath.startsWith('[') || imagePath.startsWith('["'))) {
        try {
          const images = JSON.parse(imagePath);
          if (Array.isArray(images) && images.length > 0) {
            // Use the first image from the array
            return `${baseUrl.value}/Backend-Port/backend/engine/public/storage/laporankekerasan/${images[0]}`;
          }
        } catch (e) {
          console.error('Error parsing image path:', e);
        }
      }
      
      // If not a JSON string or parsing failed, return as is
      return `${baseUrl.value}/Backend-Port/backend/engine/public/storage/laporankekerasan/${imagePath}`;
    };
    
    const checkUserRole = () => {
      // Check if user data is loaded
      if (userData.value && userData.value.role) {
        isAdmin.value = userData.value.role === 'admin';
      } else {
        isAdmin.value = false;
      }
    };
    
    const startChat = () => {
      // Get the phone number from the laporan data
      let phoneNumber = laporan.value.nomor_telepon;
      
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
        alert('Nomor telepon tidak tersedia');
      }
    };
    
    return {
      laporanId,
      laporan,
      categories,
      loading,
      error,
      showFullImage,
      isAdmin,
      authToken,
      userData,
      imagePaths,
      currentImageIndex,
      currentFullImageUrl,
      hasReportedPersons,
      hasWitnesses,
      getCurrentUser,
      fetchCategories,
      fetchLaporanDetail,
      goBack,
      formatDate,
      formatStatus,
      getCategoryName,
      getImageUrl,
      getImageUrlForPath,
      handleImageError,
      handleSingleImageError,
      capitalizeSentence,
      openFullImage,
      nextImage,
      prevImage,
      checkUserRole,
      startChat
    };
  }
};
</script>

<style scoped>
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
  margin-bottom: 20px;
}

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

.image-container {
  margin-top: 20px;
}

.evidence-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.evidence-image:hover {
  transform: scale(1.02);
}

.image-caption {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

/* Image grid styling */
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
  display: flex;
  align-items: center;
}

/* Person item styling */
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

/* Link container styling */
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

/* Full image modal */
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

.chat-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #4b5563;
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

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Status badge colors */
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

/* Responsive design */
@media (max-width: 768px) {
  .detail-cards-row {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary, .btn-success, .btn-danger, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>