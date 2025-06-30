<template>
    <div class="detail-pk-container">
        <div class="detail-header">
            <div class="back-button" @click="goBack">
                <i class="fas fa-arrow-left"></i> Kembali
            </div>
        </div>

        <h1 class="page-title">Detail Pelaporan Kejadian</h1>

        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Memuat data...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button class="retry-button" @click="fetchLaporanDetail">Coba Lagi</button>
        </div>

        <div v-else-if="laporan" class="detail-content">
            <div class="status-header">
                <div class="laporan-number">{{ laporan.nomor_laporan }}</div>
                <div class="action-btn-container">
                    <button 
                        v-if="laporan && laporan.status !== 'finished'" 
                        class="edit-button"
                        @click="goToEditLaporan"
                        title="Lengkapi atau ubah data laporan">
                        <i class="fas fa-edit"></i> <span>Edit Laporan</span>
                    </button>
                    <div :class="['status-badge', laporan.status]">
                        {{ formatStatus(laporan.status) }}
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Detail Laporan</h3>
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
                
                <!-- Menampilkan Lampiran Link jika ada -->
                <div v-if="laporan.lampiran_link" >
                    <h3 class="link-title">Lampiran Link</h3>
                    <a :href="laporan.lampiran_link" target="_blank" class="lampiran-link">
                        {{ laporan.lampiran_link }}
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>

                <div v-if="buktiPelanggaranArray && buktiPelanggaranArray.length > 0" class="bukti-section">
                    <h3 class="bukti-title"><i class="fas fa-file-alt"></i> Bukti Pelanggaran</h3>
                    <div class="bukti-list">
                        <div v-for="(bukti, index) in buktiPelanggaranArray" :key="`bukti-${index}`" class="bukti-item">
                            <i class="fas fa-check-circle"></i>
                            <span>{{ formatBuktiPelanggaran(bukti) }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Multiple images gallery -->
                <div v-if="imageArray.length > 0" class="images-gallery">
                    <h3 class="gallery-title">Foto Bukti Kejadian</h3>
                    <div class="image-grid">
                        <div 
                            v-for="(image, index) in imageArray" 
                            :key="index" 
                            class="image-item"
                            @click="openLightbox(index)"
                        >
                        <img 
                            :src="getImageUrl(image)" 
                            :alt="`Bukti Kejadian ${index + 1}`" 
                            class="evidence-image"
                            @error="handleLaporanImageError"
                        />
                        </div>
                    </div>
                    <div class="image-caption">Klik foto untuk memperbesar</div>
                </div>
            </div>

            <!-- SECTION TERLAPOR/TERDUGA -->
            <div class="detail-card" v-if="terlaporArray && terlaporArray.length > 0">
                <h3 class="detail-section-title"><i class="fas fa-user-times"></i> Identitas Terlapor/Terduga</h3>
                
                <div v-for="(terlapor, index) in terlaporArray" :key="`terlapor-${index}`" class="terlapor-item">
                    <h4 class="sub-title">Terlapor #{{ index + 1 }}</h4>
                    <div class="info-grid">
                        <div class="info-label">Nama Lengkap:</div>
                        <div class="info-value">{{ terlapor.nama_lengkap }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ terlapor.email || '-' }}</div>
                        
                        <div class="info-label">Nomor Telepon:</div>
                        <div class="info-value">{{ terlapor.nomor_telepon || '-' }}</div>

                        <div class="info-label">Jenis Kelamin:</div>
                        <div class="info-value">{{ formatJenisKelamin(terlapor.jenis_kelamin) || '-' }}</div>

                        <div class="info-label">Rentang Umur:</div>
                        <div class="info-value">{{ formatUmur(terlapor.umur_terlapor) || '-' }}</div>
                        
                        <div class="info-label">Status Warga:</div>
                        <div class="info-value">{{ formatStatusWarga(terlapor.status_warga) }}</div>
                        
                        <div class="info-label">Unit Kerja:</div>
                        <div class="info-value">{{ terlapor.unit_kerja }}</div>
                    </div>
                </div>
            </div>

            <!-- SECTION SAKSI -->
            <div class="detail-card" v-if="saksiArray && saksiArray.length > 0">
                <h3 class="detail-section-title"><i class="fas fa-user-shield"></i> Saksi</h3>
                
                <div v-for="(saksi, index) in saksiArray" :key="`saksi-${index}`" class="saksi-item">
                    <h4 class="sub-title">Saksi #{{ index + 1 }}</h4>
                    <div class="info-grid">
                        <div class="info-label">Nama Lengkap:</div>
                        <div class="info-value">{{ saksi.nama_lengkap }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ saksi.email || '-' }}</div>
                        
                        <div class="info-label">Nomor Telepon:</div>
                        <div class="info-value">{{ saksi.nomor_telepon || '-' }}</div>
                    </div>
                </div>
            </div>

            <div class="detail-cards-row">
                <div class="detail-card">
                    <h3 class="detail-section-title"><i class="fas fa-user"></i> Informasi Pelapor</h3>
                    <div class="info-grid">
                        <div class="info-label">Nama:</div>
                        <div class="info-value">{{ laporan.nama_pelapor }}</div>
                        
                        <div class="info-label">NI Pelapor:</div>
                        <div class="info-value">{{ laporan.ni_pelapor }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ laporan.email || '-' }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">{{ laporan.nomor_telepon }}</div>
                        
                        <!-- Display new fields if they exist -->
                        <div v-if="laporan.profesi" class="info-label">Profesi:</div>
                        <div v-if="laporan.profesi" class="info-value">{{ laporan.profesi }}</div>
                        
                        <div v-if="laporan.jenis_kelamin" class="info-label">Jenis Kelamin:</div>
                        <div v-if="laporan.jenis_kelamin" class="info-value">{{ formatJenisKelamin(laporan.jenis_kelamin) }}</div>
                        
                        <div v-if="laporan.umur_pelapor" class="info-label">Rentang Umur:</div>
                        <div v-if="laporan.umur_pelapor" class="info-value">{{ formatUmur(laporan.umur_pelapor) }}</div>
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

            <div class="detail-card" v-if="hasTanggapan">
                <h3 class="detail-section-title"><i class="fas fa-comment-alt"></i> Tanggapan</h3>
                
                <!-- For string tanggapan (old format) -->
                <p class="tanggapan-text" v-if="typeof laporan.tanggapan === 'string'">
                    {{ laporan.tanggapan }}
                </p>
                
                <!-- For array tanggapan (new format) -->
                <div v-else class="tanggapan-list">
                    <div v-for="(item, index) in laporan.tanggapan" :key="index" class="tanggapan-item">
                        <div class="tanggapan-header">
                            <span class="tanggapan-user">Kalab - {{ getDisplayName(item) }}</span>
                            <span class="tanggapan-time">{{ formatDate(item.timestamp) }}</span>
                        </div>
                        <p class="tanggapan-text">{{ item.text }}</p>
                    </div>
                </div>
            </div>

            <!-- Floating action button for mobile view -->
            <div class="floating-edit-btn" @click="goToEditLaporan">
                <i class="fas fa-edit"></i>
            </div>

            <div class="action-buttons">
                <button class="btn-primary" @click="verifyReport" v-if="laporan.status === 'unverified'">
                    <i class="fas fa-check"></i> Verifikasi Laporan
                </button>
                <button class="btn-danger" @click="rejectReport" v-if="laporan.status === 'unverified'">
                    <i class="fas fa-times"></i> Tolak Laporan
                </button>
                <button class="btn-secondary" @click="showTanggapanModal = true" v-if="laporan.status !== 'finished'">
                    <i class="fas fa-comment"></i> Tambah Tanggapan
                </button>
                <button class="btn-success" @click="finishReport" v-if="laporan.status === 'verified' || laporan.status === 'processed'">
                    <i class="fas fa-check-circle"></i> Tutup Kasus
                </button>
            </div>
        </div>

        <!-- Modal for full image view -->
        <div class="fullscreen-modal" v-if="showLightbox" @click="closeLightbox">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img :src="currentImageIndex >= 0 && imageArray.length > currentImageIndex ? getImageUrl(imageArray[currentImageIndex]) : ''" alt="Bukti Kejadian" class="fullscreen-image">
                
                <!-- Navigation buttons for multiple images -->
                <div class="lightbox-navigation" @click.stop v-if="imageArray.length > 1">
                    <button class="nav-button prev" @click.stop="prevImage" v-if="currentImageIndex > 0">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="image-counter">{{ currentImageIndex + 1 }} / {{ imageArray.length }}</div>
                    <button class="nav-button next" @click.stop="nextImage" v-if="currentImageIndex < imageArray.length - 1">
                        <i class="fas fa-chevron-right"></i>
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
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { decryptData } from "../../../../../services/encrypt";
import VueCookies from "vue-cookies";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { getUserData } from "../../../../../services/authDosen"; // Adjust the path as needed


const route = useRoute();
const router = useRouter();

// State with ref
const laporanId = ref(null);
const laporan = ref(null);
const categories = ref({});
const loading = ref(true);
const loadingAction = ref(false);
const error = ref(null);
const showLightbox = ref(false);
const currentImageIndex = ref(0);
const showTanggapanModal = ref(false);
const tanggapanText = ref('');
const showVerificationModal = ref(false);
const isVerifying = ref(false);
const kalabInfo = ref(null); // Add this to store kalab information

// Initialize data
onMounted(() => {
    laporanId.value = route.params.id;
    fetchCategories();
    fetchLaporanDetail();
    fetchKalabData();
});

// Computed properties
const hasTanggapan = computed(() => {
    if (!laporan.value) return false;
    if (!laporan.value.tanggapan) return false;
    
    if (Array.isArray(laporan.value.tanggapan)) {
        return laporan.value.tanggapan.length > 0;
    }
    
    return typeof laporan.value.tanggapan === 'string' && laporan.value.tanggapan.trim() !== '';
});

// Process image path to get an array of images
const imageArray = computed(() => {
    if (!laporan.value || !laporan.value.image_path) return [];
    
    // If already an array, return it
    if (Array.isArray(laporan.value.image_path)) {
        return laporan.value.image_path;
    }
    
    // If it's a JSON string, parse it
    if (typeof laporan.value.image_path === 'string') {
        try {
            const parsedArray = JSON.parse(laporan.value.image_path);
            if (Array.isArray(parsedArray)) {
                return parsedArray;
            }
        } catch (e) {
            // Not a valid JSON or parsing error, treat as a single image
            console.log('Not a JSON string, treating as single image');
        }
        
        // If not a parseable JSON array, return as single item array
        return [laporan.value.image_path];
    }
    
    return [];
});

// Process terlapor data to get an array
const terlaporArray = computed(() => {
    if (!laporan.value || !laporan.value.terlapor) return [];
    
    // If already an array, return it
    if (Array.isArray(laporan.value.terlapor)) {
        return laporan.value.terlapor;
    }
    
    // If it's a JSON string, parse it
    if (typeof laporan.value.terlapor === 'string') {
        try {
            const parsedArray = JSON.parse(laporan.value.terlapor);
            if (Array.isArray(parsedArray)) {
                return parsedArray;
            }
        } catch (e) {
            console.log('Terlapor is not a valid JSON string', e);
        }
    }
    
    return [];
});

// Process saksi data to get an array
const saksiArray = computed(() => {
    if (!laporan.value || !laporan.value.saksi) return [];
    
    // If already an array, return it
    if (Array.isArray(laporan.value.saksi)) {
        return laporan.value.saksi;
    }
    
    // If it's a JSON string, parse it
    if (typeof laporan.value.saksi === 'string') {
        try {
            const parsedArray = JSON.parse(laporan.value.saksi);
            if (Array.isArray(parsedArray)) {
                return parsedArray;
            }
        } catch (e) {
            console.log('Saksi is not a valid JSON string', e);
        }
    }
    
    return [];
});

const buktiPelanggaranArray = computed(() => {
    if (!laporan.value || !laporan.value.bukti_pelanggaran) return [];
    
    // If already an array, return it
    if (Array.isArray(laporan.value.bukti_pelanggaran)) {
        return laporan.value.bukti_pelanggaran;
    }
    
    // If it's a JSON string, parse it
    if (typeof laporan.value.bukti_pelanggaran === 'string') {
        try {
            const parsedArray = JSON.parse(laporan.value.bukti_pelanggaran);
            if (Array.isArray(parsedArray)) {
                return parsedArray;
            }
        } catch (e) {
            console.log('bukti_pelanggaran is not a valid JSON string', e);
        }
    }
    
    return [];
});

// Methods
const fetchCategories = async () => {
    try {
        // Check for authentication token in cookies
        const token = VueCookies.get('auth_token');
        if (token) {
            // Just use the token directly without attempting to decrypt it
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // const response = await axios.get('http://pelaporan-d3ti.my.id/api/category');
        const response = await axios.get('https://v3422040.mhs.d3tiuns.com/api/category');
        categories.value = response.data.reduce((acc, category) => {
            acc[category.category_id] = category.nama;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// Enhanced getDisplayName to handle kalab role
const getDisplayName = (item) => {
    // If no user data, fallback to 'Admin'
    if (!item.user) return 'Admin';
    
    // If user is kalab and we have kalab data, use the name
    if (item.role === 'kalab' && kalabInfo.value) {
        return kalabInfo.value.name; // This will now be the name from user session
    }
    
    // Otherwise return the user name as is
    return item.user;
};

// Replace your current fetchKalabData function with this
const fetchKalabData = () => {
  try {
    // Import the helper function to get user data from cookies
    const userData = getUserData(); // This comes from your authDosen.js
    
    if (userData) {
      // Create a kalabInfo object using the userData from the session
      kalabInfo.value = {
        name: userData.name,
        email: userData.email,
        nik: userData.nik,
        id: userData.dosenId,
        no_telp: userData.no_telp
      };
    } else {
      // Fallback if no user data available
      kalabInfo.value = { name: "Kalab" };
    }
  } catch (error) {
    console.error('Error retrieving kalab data:', error);
    kalabInfo.value = { name: "Kalab" };
  }
};

const fetchLaporanDetail = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        // const response = await axios.get(`http://pelaporan-d3ti.my.id/api/laporan/${laporanId.value}`);
        const response = await axios.get(`https://v3422040.mhs.d3tiuns.com/api/laporan/${laporanId.value}`);
        laporan.value = response.data;
        
        // Process tanggapan data
        if (laporan.value.tanggapan) {
            // Try to parse if it's a JSON string
            try {
                const parsed = JSON.parse(laporan.value.tanggapan);
                if (Array.isArray(parsed)) {
                    laporan.value.tanggapan = parsed;
                }
            } catch (e) {
                // If it's not valid JSON, keep it as a string
                console.log('Tanggapan is not in JSON format, keeping as string');
            }
        }
        
        tanggapanText.value = '';
        
        // Fetch kalab data after successfully loading the laporan
        fetchKalabData();
    } catch (error) {
        console.error('Error fetching laporan detail:', error);
        error.value = 'Gagal memuat data laporan. Silakan coba lagi.';
    } finally {
        loading.value = false;
    }
};

const goToEditLaporan = () => {
    // Navigate to the edit page using the current laporan ID
    router.push({
        name: "EditPelaporanKejadianKalab",
        params: {
            id: laporanId.value
        }
    });
};

const goBack = () => {
    router.go(-1);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
        let date;
        
        // Special case for tanggal_kejadian - Apply timezone adjustment for MySQL format
        if (typeof dateString === 'string' && laporan.value && dateString === laporan.value.tanggal_kejadian) {
            const [datePart, timePart] = dateString.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes, seconds] = timePart.split(':').map(Number);
            
            // For tanggal_kejadian, assume it's UTC and add 7 hours for Jakarta
            date = new Date(Date.UTC(year, month-1, day, hours, minutes, seconds));
            date.setTime(date.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours
        }
        // For tanggapan timestamps (typically in ISO format)
        else if (typeof dateString === 'string' && dateString.includes('T')) {
            // Parse ISO format but don't add hours because tanggapan timestamps are already in Jakarta time
            date = new Date(dateString);
        }
        // For all other dates (like created_at, updated_at in MySQL format)
        else if (typeof dateString === 'string' && dateString.includes(' ')) {
            // Parse MySQL date format
            const [datePart, timePart] = dateString.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes, seconds] = timePart.split(':').map(Number);
            
            // For regular MySQL dates, assume they're already in local time
            date = new Date(year, month-1, day, hours, minutes, seconds);
        }
        else {
            // Fallback for any other format
            date = new Date(dateString);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return '-';
        }
        
        // Format using Indonesian month names
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        // Return formatted date
        return `${day} ${month} ${year} pukul ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString || '-';
    }
};

const formatedDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
        // Parse the date string
        let date;
        
        if (typeof dateString === 'string') {
            // Handle different date formats
            if (dateString.includes(' ') && !dateString.includes('T')) {
                // MySQL format: "2025-04-24 11:01:00" - Assume this is already in Jakarta time
                const [datePart, timePart] = dateString.split(' ');
                const [year, month, day] = datePart.split('-').map(Number);
                const [hours, minutes] = timePart.split(':').map(Number);
                
                // Create date object directly without timezone adjustment
                // since we assume the time is already in Jakarta time
                date = new Date(year, month-1, day, hours, minutes);
            } 
            else if (dateString.includes('T')) {
                // ISO format: "2025-04-24T04:01:38.000000Z"
                // This is in UTC, so we need to adjust to Jakarta time
                const utcDate = new Date(dateString);
                
                // Adjust for Jakarta timezone (UTC+7)
                const jakartaOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
                date = new Date(utcDate.getTime() + jakartaOffset);
            }
            else {
                // Other format
                date = new Date(dateString);
            }
        } else {
            date = new Date(dateString);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return '-';
        }
        
        // Format manually using Indonesian month names
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        // Format time with leading zeros
        let hours = date.getHours();
        let minutes = date.getMinutes();
        
        // Ensure two digits for hours and minutes
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        
        // Return formatted date with "pukul" for time
        return `${day} ${month} ${year} pukul ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString || '-';
    }
};

const formatJenisKelamin = (jenis) => {
    if (jenis === 'laki-laki') return 'Laki-laki';
    if (jenis === 'perempuan') return 'Perempuan';
    return jenis;
};

const formatUmur = (umur) => {
    if (umur === '<20') return 'Kurang dari 20 tahun';
    if (umur === '20-40') return '20 - 40 tahun';
    if (umur === '40<') return 'Lebih dari 40 tahun';
    return umur;
};

const formatStatusWarga = (status) => {
    const statusMap = {
        'dosen': 'Dosen',
        'mahasiswa': 'Mahasiswa', 
        'staff': 'Staff',
        'lainnya': 'Lainnya'
    };
    
    return statusMap[status] || status;
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

const getCategoryName = (categoryId) => {
    return categories.value[categoryId] || `Kategori ${categoryId}`;
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Clean the path by removing any quotes if present
    const cleanPath = typeof imagePath === 'string' ? imagePath.replace(/['"]/g, '') : imagePath;
    
    // Check if it's already a full URL
    if (typeof cleanPath === 'string' && cleanPath.startsWith('http')) {
        return cleanPath;
    }
    
    // Define the base URL
    // const baseUrl = 'http://pelaporan-d3ti.my.id';
    const baseUrl = 'https://v3422040.mhs.d3tiuns.com';
    
    // Primary URL format (same pattern as your category images)
    return `${baseUrl}/Backend-Port/backend/engine/public/storage/laporan/${cleanPath}`;
};

// Add this method to your Vue component methods
const handleLaporanImageError = (event) => {
    // If the image fails to load, try the alternative URL format
    const img = event.target;
    const currentSrc = img.src;
    
    if (currentSrc.includes('/Backend-Port/backend/engine/public/storage/')) {
        // If the second format failed, try the first format
        img.src = currentSrc.replace(
            '/Backend-Port/backend/engine/public/storage/', 
            '/public/storage/'
        );
    } else if (currentSrc.includes('/public/storage/')) {
        // If the first format failed, show a placeholder
        img.src = 'https://via.placeholder.com/150?text=No+Image';
    }
};

// Lightbox methods for multiple images
const openLightbox = (index) => {
    currentImageIndex.value = index;
    showLightbox.value = true;
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    showLightbox.value = false;
    // Restore scrolling
    document.body.style.overflow = '';
};

const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
    }
};

const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (currentImageIndex.value < imageArray.value.length - 1) {
        currentImageIndex.value++;
    }
};

// Verification methods
const verifyReport = () => {
    showVerificationModal.value = true;
};

const confirmVerification = async () => {
    isVerifying.value = true;
    
    try {
        // Use FormData for consistency with other methods
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'verified');
        
        // Make the API call using POST with _method: PUT for compatibility
        // await axios.post(`http://pelaporan-d3ti.my.id/api/laporan/update_status/${laporanId.value}`, formData);
        await axios.post(`https://v3422040.mhs.d3tiuns.com/api/laporan/update_status/${laporanId.value}`, formData);
        
        // Update local data after successful verification
        laporan.value.status = 'verified';
        
        // Show success message using Swal for consistency
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Laporan berhasil diverifikasi',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        
        // Refresh data
        await fetchLaporanDetail();
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
        isVerifying.value = false;
        showVerificationModal.value = false; // Close the modal after processing
    }
};

const rejectReport = async () => {
    try {
        if (!laporanId.value) {
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
        
        // Make the API call using POST with _method: PUT
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'rejected');

        await axios.post(
            // `http://pelaporan-d3ti.my.id/api/laporan/update_status/${laporanId.value}`, 
            `https://v3422040.mhs.d3tiuns.com/api/laporan/update_status/${laporanId.value}`,
            formData
        );
                    
        // Update local data after successful rejection
        laporan.value.status = 'rejected';
        
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
        await fetchLaporanDetail();
        
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
};

const saveTanggapan = async () => {
    try {
        if (!laporanId.value) {
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
        
        if (!tanggapanText.value.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Tanggapan tidak boleh kosong',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }
        
        // Prepare tanggapan array
        let tanggapanArray = [];
        
        if (laporan.value.tanggapan) {
            // If tanggapan exists and is already an array, use it
            if (Array.isArray(laporan.value.tanggapan)) {
                tanggapanArray = [...laporan.value.tanggapan];
            } 
            // If tanggapan exists but is a string (old format), convert it to array
            else if (typeof laporan.value.tanggapan === 'string' && laporan.value.tanggapan.trim() !== '') {
                tanggapanArray = [{
                    text: laporan.value.tanggapan,
                    timestamp: laporan.value.updated_at, // Use the previous update time 
                    user: 'Admin'
                }];
            }
        }
        
        // Create a new tanggapan object
        const newTanggapan = {
            text: tanggapanText.value,
            timestamp: new Date().toISOString(),
            user: kalabInfo.value?.name || 'Kalab', // Use name from API data or fallback
            role: 'kalab' // Set role as kalab to ensure proper display
        };
        
        // Add the new tanggapan
        tanggapanArray.push(newTanggapan);
        
        // Make the API call
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('tanggapan', JSON.stringify(tanggapanArray));
        
        // Include the current status to maintain it
        if (laporan.value && laporan.value.status) {
            formData.append('status', laporan.value.status);
        }

        await axios.post(
            // `http://pelaporan-d3ti.my.id/api/laporan/update_status/${laporanId.value}`, 
            `https://v3422040.mhs.d3tiuns.com/api/laporan/update_status/${laporanId.value}`,
            formData
        );
        
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
        tanggapanText.value = '';
        showTanggapanModal.value = false;
        
        // Refresh data
        await fetchLaporanDetail();
        
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
};

const finishReport = async () => {
    try {
        if (!laporanId.value) {
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
        if (laporan.value.tanggapan) {
            let tanggapanData = laporan.value.tanggapan;
            
            // If it's already a string (old format), keep it as is
            if (typeof tanggapanData !== 'string') {
                // If it's an array (new format), convert it to JSON string
                tanggapanData = JSON.stringify(tanggapanData);
            }
            
            formData.append('tanggapan', tanggapanData);
        }

        await axios.post(
            // `http://pelaporan-d3ti.my.id/api/laporan/update_status/${laporanId.value}`, 
            `https://v3422040.mhs.d3tiuns.com/api/laporan/update_status/${laporanId.value}`,
            formData
        );
                    
        // Update local data after successful completion
        laporan.value.status = 'finished';
        
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
        
        // Refresh data
        await fetchLaporanDetail();
        
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
};

const formatBuktiPelanggaran = (bukti) => {
    const buktiMap = {
        'bukti_transfer': 'Bukti transfer, cek, bukti penyetoran, dan rekening koran bank',
        'dokumen_rekaman': 'Dokumen dan/atau rekaman',
        'foto_dokumentasi': 'Foto dokumentasi',
        'surat_disposisi': 'Surat disposisi perintah',
        'identitas_sumber': 'Identitas sumber informasi',
        'lainnya': 'Lainnya'
    };
    
    return buktiMap[bukti] || bukti;
};

// Add a watcher to fetch kalab data when laporan changes
watch(() => laporan.value?.tanggapan, () => {
    if (laporan.value && Array.isArray(laporan.value.tanggapan)) {
        fetchKalabData();
    }
}, { deep: true });

// Clean up resources when component is unmounted
onBeforeUnmount(() => {
    // Reset any global state or remove event listeners if needed
    if (showLightbox.value) {
        document.body.style.overflow = ''; // Restore scrolling if lightbox was open
    }
});
</script>

<style scoped>
/* Your CSS styles remain unchanged */
.detail-pk-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Add new styles for terlapor and saksi sections */
.terlapor-item, .saksi-item {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
    border-left: 4px solid #3b82f6;
}

.terlapor-item:last-child, .saksi-item:last-child {
    margin-bottom: 0;
}

.sub-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
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

/* Styles for Lampiran Link */
.link-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.link-title i {
    margin-right: 8px;
    color: #3b82f6;
}

.lampiran-link {
    display: block;
    color: #2563eb;
    font-size: 0.95rem;
    word-break: break-all;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 6px;
    background-color: #eff6ff;
    transition: background-color 0.2s;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lampiran-link:hover {
    background-color: #dbeafe;
    text-decoration: underline;
}

.lampiran-link i {
    margin-left: 8px;
    font-size: 0.8rem;
    vertical-align: top;
}

/* Updated styles for multiple images */
.images-gallery {
    margin-top: 24px;
}

.gallery-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 12px;
}

.image-item {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.image-item:hover {
    transform: scale(1.03);
}

.evidence-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-caption {
    margin-top: 8px;
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
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
}

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

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
}

.btn-primary, .btn-success, .btn-danger, .btn-secondary {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
}

.btn-primary i, .btn-success i, .btn-danger i, .btn-secondary i {
    margin-right: 8px;
}

.btn-primary {
    background-color: #2563eb;
    color: white;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.btn-success {
    background-color: #059669;
    color: white;
}

.btn-success:hover {
    background-color: #047857;
}

.btn-danger {
    background-color: #dc2626;
    color: white;
}

.btn-danger:hover {
    background-color: #b91c1c;
}

.btn-secondary {
    background-color: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background-color: #4b5563;
}

/* Updated lightbox for multiple images */
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

/* Navigation for image lightbox */
.lightbox-navigation {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.nav-button {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.nav-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.image-counter {
    color: white;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 6px 12px;
    border-radius: 16px;
}

/* Tanggapan modal */
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

.finished {
    background-color: #d1fae5;
    color: #059669;
}

.rejected {
    background-color: #fee2e2;
    color: #dc2626;
}

/* Bukti Pelanggaran styles */
.bukti-section {
    margin-top: 20px;
    margin-bottom: 20px;
}

.bukti-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.bukti-title i {
    margin-right: 8px;
    color: #3b82f6;
}

.bukti-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9fafb;
    border-radius: 6px;
    padding: 12px 16px;
}

.bukti-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
}

.bukti-item i {
    color: #10b981;
    font-size: 1rem;
}

.bukti-item span {
    color: #374151;
    font-size: 0.95rem;
}

/* Enhanced Edit Button Styling */
.action-btn-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.edit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-button i {
    margin-right: 8px;
    font-size: 16px;
}

/* Floating Edit Button for Mobile */
.floating-edit-btn {
    display: none;
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    z-index: 100;
    transition: all 0.3s ease;
}

.floating-edit-btn:hover {
    background-color: #2980b9;
    transform: scale(1.05);
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
    
    .image-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .edit-button span {
        display: none; /* Hide text on mobile */
    }
    
    .edit-button {
        padding: 8px;
    }
    
    .edit-button i {
        margin-right: 0;
    }

    .floating-edit-btn {
        display: flex; /* Show floating button on mobile */
    }
}

@media (max-width: 480px) {
    .image-grid {
        grid-template-columns: 1fr;
    }
}
</style>