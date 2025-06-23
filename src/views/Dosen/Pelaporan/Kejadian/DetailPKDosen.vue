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

        <div v-else class="detail-content">
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
                </div>
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
                
                <!-- Image Gallery untuk multiple images -->
                <div v-if="imagePaths && imagePaths.length > 0" class="image-gallery">
                    <h4 class="gallery-title">Foto Bukti Kejadian</h4>
                    <div class="image-grid">
                        <div v-for="(path, index) in imagePaths" :key="index" class="image-item">
                            <img 
                                :src="getImageUrl(path)" 
                                :data-path="path"
                                :alt="`Foto Kejadian ${index + 1}`" 
                                class="evidence-image" 
                                @click="openFullImage(index)"
                                @error="handleImageError"
                            >
                        </div>
                    </div>
                    <div class="image-caption">Klik untuk memperbesar gambar</div>
                </div>

                <!-- Modal for full image view -->
                <div class="fullscreen-modal" v-if="showFullImage" @click="showFullImage = false">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <img 
                            :src="currentFullImageUrl" 
                            alt="Bukti Kejadian" 
                            class="fullscreen-image"
                            @error="handleFullscreenImageError"
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

            <div class="detail-cards-row">
                <div class="detail-card">
                    <h3 class="detail-section-title"><i class="fas fa-user"></i> Informasi Pelapor</h3>
                    <div class="info-grid">
                        <div class="info-label">Nama:</div>
                        <div class="info-value">{{ laporan.nama_pelapor }}</div>
                        
                        <div class="info-label">NI Pelapor:</div>
                        <div class="info-value">{{ laporan.ni_pelapor }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ laporan.email }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">{{ laporan.nomor_telepon }}</div>

                        <!-- Tambahan informasi pelapor -->
                        <div class="info-label">Jenis Kelamin:</div>
                        <div class="info-value">{{ formatJenisKelamin(laporan.jenis_kelamin) || '-' }}</div>
                        
                        <div class="info-label">Profesi:</div>
                        <div class="info-value">{{ formatStatusWarga(laporan.profesi) || '-' }}</div>
                        
                        <div class="info-label">Rentang Umur:</div>
                        <div class="info-value">{{ formatUmur(laporan.umur_pelapor) || '-' }}</div>
                    </div>
                </div>

                <!-- Add this inside your content-wrapper div after the existing cards/sections -->

                <!-- Terlapor Section -->
                <div class="detail-card" v-if="terlaporArray && terlaporArray.length > 0">
                    <h3 class="detail-section-title"><i class="fas fa-user-shield"></i> Informasi Terlapor/Terduga</h3>
                    
                    <div v-for="(terlapor, index) in terlaporArray" :key="`terlapor-${index}`" class="person-item">
                        <h4 class="person-title">Terlapor #{{ index + 1 }}</h4>
                        <div class="info-grid">
                            <div class="info-label">Nama Lengkap:</div>
                            <div class="info-value">{{ terlapor.nama_lengkap || '-' }}</div>
                            
                            <div class="info-label">Email:</div>
                            <div class="info-value">{{ terlapor.email || '-' }}</div>
                            
                            <div class="info-label">Nomor Telepon:</div>
                            <div class="info-value">{{ terlapor.nomor_telepon || '-' }}</div>
                            
                            <div class="info-label">Jenis Kelamin:</div>
                            <div class="info-value">{{ formatJenisKelamin(terlapor.jenis_kelamin) || '-' }}</div>
                            
                            <div class="info-label">Rentang Umur:</div>
                            <div class="info-value">{{ formatUmur(terlapor.umur_terlapor) || '-' }}</div>
                            
                            <div class="info-label">Status Warga:</div>
                            <div class="info-value">{{ formatStatusWarga(terlapor.status_warga) || '-' }}</div>
                            
                            <div class="info-label">Unit Kerja:</div>
                            <div class="info-value">{{ terlapor.unit_kerja || '-' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Saksi Section -->
                <div class="detail-card" v-if="saksiArray && saksiArray.length > 0">
                    <h3 class="detail-section-title"><i class="fas fa-eye"></i> Informasi Saksi</h3>
                    
                    <div v-for="(saksi, index) in saksiArray" :key="`saksi-${index}`" class="person-item">
                        <h4 class="person-title">Saksi #{{ index + 1 }}</h4>
                        <div class="info-grid">
                            <div class="info-label">Nama Lengkap:</div>
                            <div class="info-value">{{ saksi.nama_lengkap || '-' }}</div>
                            
                            <div class="info-label">Email:</div>
                            <div class="info-value">{{ saksi.email || '-' }}</div>
                            
                            <div class="info-label">Nomor Telepon:</div>
                            <div class="info-value">{{ saksi.nomor_telepon || '-' }}</div>
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
                <div v-else-if="Array.isArray(laporan.tanggapan)" class="tanggapan-list">
                    <div v-for="(item, index) in laporan.tanggapan" :key="index" class="tanggapan-item">
                        <div class="tanggapan-header">
                            <!-- Add Kalab prefix for items with role "kalab" -->
                            <span class="tanggapan-user">
                                {{ item.role === 'kalab' ? 'Kalab - ' : '' }}{{ item.user || 'Admin' }}
                            </span>
                            <span class="tanggapan-time">{{ formatDate(item.timestamp) }}</span>
                        </div>
                        <p class="tanggapan-text">{{ item.text }}</p>
                    </div>
                </div>
                
                <!-- Fallback for unexpected formats -->
                <p v-else class="tanggapan-text">
                    {{ JSON.stringify(laporan.tanggapan) }}
                </p>
            </div>
          
          <!-- Action Buttons - Tombol untuk admin -->
          <div class="action-buttons" v-if="isAdmin">
            <button class="btn btn-secondary" @click="showTanggapanModal = true" v-if="laporan.status !== 'finished'">
              <i class="fas fa-comment"></i> Tambah Tanggapan
            </button>
            <button class="btn btn-success" @click="finishReport" v-if="laporan.status !== 'finished' && laporan.status !== 'unverified'">
              <i class="fas fa-check-circle"></i> Tutup Kasus
            </button>
          </div>
        </div>

        <!-- Close report confirmation modal -->
        <div class="modal-overlay" v-if="showCloseModal">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h3>Konfirmasi Tutup Laporan</h3>
                    <button class="close-button" @click="showCloseModal = false" :disabled="isClosing">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Apakah Anda yakin ingin menutup laporan ini? Laporan yang sudah ditutup akan mendapatkan status Selesai.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="showCloseModal = false" :disabled="isClosing">Batal</button>
                    <button class="btn-success" @click="closeReport" :disabled="isClosing">
                        <span v-if="isClosing">
                            <i class="fas fa-spinner fa-spin"></i> Memproses...
                        </span>
                        <span v-else>
                            <i class="fas fa-check"></i> Yakin, Tutup Laporan
                        </span>
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
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';

export default {
    name: 'DetailPKDosen',
    data() {
        return {
            laporanId: null,
            laporan: null,
            categories: {},
            loading: true,
            loadingAction: false,
            error: null,
            showFullImage: false,
            showTanggapanModal: false,
            tanggapanText: '',
            showVerificationModal: false,
            isVerifying: false,
            showCloseModal: false,
            isClosing: false,
            isAdmin: false,
            currentUser: null,
            // Auth data
            token: null,
            userRole: null,
            imagePaths: [],
            currentImageIndex: 0,
            currentFullImageUrl: ''
        };
    },
    
    created() {
        this.checkAuth();
        this.laporanId = this.$route.params.id;
        
        if (this.token) {
            this.setupAxiosInterceptors();
            this.fetchCategories();
            this.fetchLaporanDetail();
        }

        this.$watch('laporan', (newVal) => {
            if (newVal && newVal.image_path) {
                this.imagePaths = this.parseImagePaths(newVal.image_path);
                console.log('Image paths loaded:', this.imagePaths);
            }
        }, { immediate: true });
    },
    
    methods: {
        checkAuth() {
            // Get authentication data from cookies
            this.token = this.$cookies.get('auth_token');
            this.currentUser = this.$cookies.get('user_name') || 'miftahul01';
            this.userRole = this.$cookies.get('user_role');
            this.isAdmin = this.userRole === 'admin' || this.userRole === 'superadmin';
            
            console.log('Auth check:', {
                token: this.token ? 'exists' : null,
                user: this.currentUser,
                role: this.userRole,
                isAdmin: this.isAdmin
            });
            
            if (!this.token) {
                this.handleUnauthorized();
                return false;
            }
            
            return true;
        },
        
        handleUnauthorized() {
            console.warn('Unauthorized: No auth token found');
            this.error = 'Sesi Anda telah berakhir. Silakan login kembali.';
            
            // Redirect to login page after a brief delay
            setTimeout(() => {
                this.$router.push('/login'); // Adjust this to your login route
            }, 2000);
        },
        
        setupAxiosInterceptors() {
            // Add authorization header to all requests
            axios.interceptors.request.use(config => {
                if (this.token) {
                    config.headers['Authorization'] = `Bearer ${this.token}`;
                }
                return config;
            });
            
            // Handle 401 responses globally
            axios.interceptors.response.use(
                response => response,
                error => {
                    if (error.response && error.response.status === 401) {
                        console.log('Intercepted 401 error, handling unauthorized');
                        this.handleUnauthorized();
                    }
                    return Promise.reject(error);
                }
            );
        },
        
        async fetchCategories() {
            if (!this.checkAuth()) return;
            
            try {
                const response = await axios.get('http://pelaporan-d3ti.my.id/api/category', {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.categories = response.data.reduce((acc, category) => {
                    acc[category.category_id] = category.nama;
                    return acc;
                }, {});
            } catch (error) {
                console.error('Error fetching categories:', error);
                if (error.response && error.response.status === 401) {
                    this.handleUnauthorized();
                }
            }
        },
        
        async fetchLaporanDetail() {
            if (!this.checkAuth()) return;
            
            this.loading = true;
            this.error = null;
            
            try {
                const response = await axios.get(`http://pelaporan-d3ti.my.id/api/laporan/${this.laporanId}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.laporan = response.data;
                
                // Process tanggapan data: Parse it if it's a JSON string
                if (this.laporan.tanggapan && typeof this.laporan.tanggapan === 'string') {
                    try {
                        // Try to parse it as JSON
                        const parsedTanggapan = JSON.parse(this.laporan.tanggapan);
                        if (Array.isArray(parsedTanggapan)) {
                            this.laporan.tanggapan = parsedTanggapan;
                            console.log('Parsed tanggapan into array:', this.laporan.tanggapan);
                        }
                    } catch (parseError) {
                        console.log('Tanggapan is not in JSON format:', parseError);
                        // Keep it as a string if it's not valid JSON
                    }
                }
                
                this.tanggapanText = '';
            } catch (error) {
                console.error('Error fetching laporan detail:', error);
                this.error = 'Gagal memuat data laporan. Silakan coba lagi.';
                
                if (error.response) {
                    if (error.response.status === 401) {
                        this.handleUnauthorized();
                    } else if (error.response.data && error.response.data.message) {
                        this.error = error.response.data.message;
                    }
                }
            } finally {
                this.loading = false;
            }
        },
        
        goBack() {
            this.$router.go(-1);
        },

        goToEditLaporan() {
            if (!this.checkAuth()) return;
            this.$router.push({ name: 'EditPelaporanKejadianDosen', params: { id: this.laporanId } });
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
                'verified': 'Diproses',
                'rejected': 'Ditolak',
                'finished': 'Selesai'
            };
            
            return statusMap[status] || status;
        },
        
        getCategoryName(categoryId) {
            return this.categories[categoryId] || `Kategori ${categoryId}`;
        },
        
        parseImagePaths(imagePath) {
            if (!imagePath) {
                return [];
            }
            
            if (typeof imagePath === 'string') {
                // Check if it's a JSON array string
                if ((imagePath.startsWith('[') && imagePath.endsWith(']')) || 
                    (imagePath.startsWith('"[') && imagePath.endsWith(']"'))) {
                    try {
                        // Clean the string and parse it
                        let cleanedPath = imagePath.replace(/\\/g, '');
                        
                        if (cleanedPath.startsWith('"') && cleanedPath.endsWith('"')) {
                            cleanedPath = cleanedPath.substring(1, cleanedPath.length - 1);
                        }
                        
                        const parsed = JSON.parse(cleanedPath);
                        if (Array.isArray(parsed)) {
                            return parsed;
                        }
                    } catch (e) {
                        console.error('Error parsing image path JSON:', e);
                        // If parse fails, treat as single path
                        return [imagePath];
                    }
                }
                
                // Handle comma-separated paths
                if (imagePath.includes(',')) {
                    return imagePath.split(',').map(p => p.trim());
                }
                
                // Single path case
                return [imagePath];
            }
            
            // If already an array
            if (Array.isArray(imagePath)) {
                return imagePath;
            }
            
            return [];
        },
        
        getImageUrl(path) {
            if (!path) return '';
            
            // Clean the path by removing any quotes if present
            const cleanPath = typeof path === 'string' ? path.replace(/['"]/g, '') : path;
            
            // Check if it's already a full URL
            if (typeof cleanPath === 'string' && cleanPath.startsWith('http')) {
                return cleanPath;
            }
            
            // Define the base URL - using pelaporan-d3ti.my.id domain as requested
            const baseUrl = 'http://pelaporan-d3ti.my.id';
            
            // Primary URL format
            return `${baseUrl}/Backend-Port/backend/engine/public/storage/laporan/${cleanPath}`;
        },

        handleLaporanImageError(event) {
            // If the image fails to load, try the alternative URL format
            const img = event.target;
            const currentSrc = img.src;
            const path = img.dataset.path;
            
            if (currentSrc.includes('/Backend-Port/backend/engine/public/storage/')) {
                // If the first format failed, try the second format
                img.src = currentSrc.replace(
                    '/Backend-Port/backend/engine/public/storage/', 
                    '/public/storage/'
                );
            } else if (currentSrc.includes('/public/storage/')) {
                // If the second format failed, show a placeholder
                img.src = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
            }
        },

        // Updated handleImageError with the pelaporan-d3ti domain
        handleImageError(event, index) {
            const img = event.target;
            const originalSrc = img.src;
            const path = img.dataset.path;
            
            if (originalSrc.includes('fallback=4')) {
                img.src = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
                return;
            }
            
            const baseDomain = 'http://pelaporan-d3ti.my.id';
            let newUrl;
            
            if (!originalSrc.includes('fallback=')) {
                newUrl = `${baseDomain}/public/storage/laporan/${path}?fallback=2`;
            } else if (originalSrc.includes('fallback=2')) {
                newUrl = `${baseDomain}/storage/laporan/${path}?fallback=3`;
            } else if (originalSrc.includes('fallback=3')) {
                newUrl = `${baseDomain}/storage/${path}?fallback=4`;
            } else {
                newUrl = 'https://via.placeholder.com/150?text=Tidak+Ditemukan';
            }
            
            img.src = newUrl;
        },
        
        openFullImage(index) {
            this.currentImageIndex = index || 0;
            this.currentFullImageUrl = this.getImageUrl(this.imagePaths[this.currentImageIndex]);
            this.showFullImage = true;
        },

        nextImage(e) {
            if (e) e.stopPropagation();
            if (!this.imagePaths || this.imagePaths.length <= 1) return;
            
            this.currentImageIndex = (this.currentImageIndex + 1) % this.imagePaths.length;
            this.currentFullImageUrl = this.getImageUrl(this.imagePaths[this.currentImageIndex]);
        },

        prevImage(e) {
            if (e) e.stopPropagation();
            if (!this.imagePaths || this.imagePaths.length <= 1) return;
            
            this.currentImageIndex = (this.currentImageIndex - 1 + this.imagePaths.length) % this.imagePaths.length;
            this.currentFullImageUrl = this.getImageUrl(this.imagePaths[this.currentImageIndex]);
        },

        handleFullscreenImageError(event) {
            const img = event.target;
            const originalSrc = img.src;
            const path = this.imagePaths[this.currentImageIndex];
            
            if (originalSrc.includes('fallback=4')) {
                img.src = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Ditemukan';
                return;
            }
            
            const baseDomain = 'https://v3422040.mhs.d3tiuns.com';
            let newUrl;
            
            if (!originalSrc.includes('fallback=')) {
                newUrl = `${baseDomain}/public/storage/laporan/${path}?fallback=2`;
            } else if (originalSrc.includes('fallback=2')) {
                newUrl = `${baseDomain}/storage/laporan/${path}?fallback=3`;
            } else if (originalSrc.includes('fallback=3')) {
                newUrl = `${baseDomain}/storage/${path}?fallback=4`;
            } else {
                newUrl = 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Ditemukan';
            }
            
            img.src = newUrl;
        },
        
        formatJenisKelamin(jenis) {
            if (!jenis) return '-';
            
            if (typeof jenis === 'string') {
                if (jenis.toLowerCase() === 'laki-laki') return 'Laki-laki';
                if (jenis.toLowerCase() === 'perempuan') return 'Perempuan';
            }
            return jenis;
        },
        
        formatUmur(umur) {
            if (!umur) return '-';
            
            if (typeof umur === 'string') {
                if (umur === '<20') return 'Kurang dari 20 tahun';
                if (umur === '20-40') return '20 - 40 tahun';
                if (umur === '40<') return 'Lebih dari 40 tahun';
            }
            return umur;
        },
        
        formatStatusWarga(status) {
            if (!status) return '-';
            
            const statusMap = {
                'dosen': 'Dosen',
                'mahasiswa': 'Mahasiswa', 
                'staff': 'Staff',
                'lainnya': 'Lainnya'
            };
            
            return statusMap[status] || status;
        },

        verifyReport() {
            if (!this.checkAuth()) return;
            this.showVerificationModal = true;
        },

        finishReport() {
            if (!this.checkAuth()) return;
            this.showCloseModal = true;
        },
        
        async saveTanggapan() {
            if (!this.checkAuth()) return;
            
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
                
                console.log('Current tanggapan before adding new:', this.laporan.tanggapan);
                
                // Create a new tanggapan object
                const newTanggapan = {
                    text: this.tanggapanText,
                    timestamp: new Date().toISOString(),
                    user: this.currentUser // Using the current user from cookie
                };
                
                // Create/update the tanggapan array
                let tanggapanArray = [];
                
                // If there's existing tanggapan data
                if (this.laporan.tanggapan) {
                    // If it's already an array, use it
                    if (Array.isArray(this.laporan.tanggapan)) {
                        tanggapanArray = [...this.laporan.tanggapan];
                    } 
                    // If it's a string but looks like JSON, try to parse it
                    else if (typeof this.laporan.tanggapan === 'string' && 
                        (this.laporan.tanggapan.startsWith('[') || this.laporan.tanggapan.startsWith('{'))) {
                        try {
                            const parsed = JSON.parse(this.laporan.tanggapan);
                            if (Array.isArray(parsed)) {
                                tanggapanArray = parsed;
                            } else {
                                // If it parsed but isn't an array, create a new array with the parsed item
                                tanggapanArray = [{
                                    text: this.laporan.tanggapan,
                                    timestamp: this.laporan.updated_at,
                                    user: 'System'
                                }];
                            }
                        } catch (e) {
                            // If parsing failed, treat it as a regular string
                            tanggapanArray = [{
                                text: this.laporan.tanggapan,
                                timestamp: this.laporan.updated_at,
                                user: 'System'
                            }];
                        }
                    } 
                    // If it's a regular string, convert it to an array with one item
                    else if (typeof this.laporan.tanggapan === 'string') {
                        tanggapanArray = [{
                            text: this.laporan.tanggapan,
                            timestamp: this.laporan.updated_at,
                            user: 'System'
                        }];
                    }
                }
                
                // Add the new tanggapan to the array
                tanggapanArray.push(newTanggapan);
                
                console.log('Tanggapan array to be sent:', tanggapanArray);
                
                // Make the API call using POST with _method: PUT
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('tanggapan', JSON.stringify(tanggapanArray));
                
                // Include the current status to maintain it
                if (this.laporan && this.laporan.status) {
                    formData.append('status', this.laporan.status);
                } else {
                    formData.append('status', 'pending');
                }

                // For debugging, log the FormData
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1] instanceof Blob ? 'File/Blob data' : pair[1]}`);
                }

                const response = await axios.post(
                    `http://pelaporan-d3ti.my.id/api/laporan/update_status/${this.laporanId}`, 
                    formData,
                    {
                        headers: { 
                            Authorization: `Bearer ${this.token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                console.log('Response:', response);
                
                // Update local data after successful submission
                this.laporan.tanggapan = tanggapanArray;
                
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
                
                // Refresh data to ensure everything is up to date
                await this.fetchLaporanDetail();
                
            } catch (error) {
                console.error('Error saving tanggapan:', error);
                
                if (error.response && error.response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
                
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
        },

        async closeReport() {
            if (!this.checkAuth()) return;
            
            try {
                this.isClosing = true;
                
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
                
                console.log('Closing report:', {
                    laporanId: this.laporanId
                });
                
                // Make the API call using POST with _method: PUT
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('status', 'finished');
                
                // If there's tanggapan, preserve it
                if (this.laporan.tanggapan) {
                    if (typeof this.laporan.tanggapan === 'string') {
                        formData.append('tanggapan', this.laporan.tanggapan);
                    } else {
                        formData.append('tanggapan', JSON.stringify(this.laporan.tanggapan));
                    }
                }

                const response = await axios.post(
                    `http://pelaporan-d3ti.my.id/api/laporan/update_status/${this.laporanId}`, 
                    formData,
                    {
                        headers: { 
                            Authorization: `Bearer ${this.token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                        
                console.log('Response:', response);
                
                // Update local data after successful completion
                this.laporan.status = 'finished';
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Laporan berhasil ditutup dan dinyatakan selesai',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                
                // Refresh data
                await this.fetchLaporanDetail();
                
            } catch (error) {
                console.error('Error closing report:', error);
                
                if (error.response && error.response.status === 401) {
                    this.handleUnauthorized();
                    return;
                }
                
                // Safely access error message with optional chaining
                const errorMessage = error.response?.data?.message || 'Gagal menutup laporan';
                
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: `Gagal menutup laporan: ${errorMessage}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } finally {
                this.isClosing = false;
                this.showCloseModal = false;
            }
        },
    },
    
    computed: {
        hasTanggapan() {
            if (!this.laporan) return false;
            if (!this.laporan.tanggapan) return false;
            
            if (Array.isArray(this.laporan.tanggapan)) {
                return this.laporan.tanggapan.length > 0;
            }
            
            return typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '';
        },
        
        // Process terlapor data to get an array
        terlaporArray() {
            if (!this.laporan || !this.laporan.terlapor) return [];
            
            // If already an array, return it
            if (Array.isArray(this.laporan.terlapor)) {
                return this.laporan.terlapor;
            }
            
            // If it's a JSON string, parse it
            if (typeof this.laporan.terlapor === 'string') {
                try {
                    const parsedArray = JSON.parse(this.laporan.terlapor);
                    if (Array.isArray(parsedArray)) {
                        return parsedArray;
                    }
                } catch (e) {
                    console.log('Terlapor is not a valid JSON string', e);
                }
            }
            
            return [];
        },
        
        // Process saksi data to get an array
        saksiArray() {
            if (!this.laporan || !this.laporan.saksi) return [];
            
            // If already an array, return it
            if (Array.isArray(this.laporan.saksi)) {
                return this.laporan.saksi;
            }
            
            // If it's a JSON string, parse it
            if (typeof this.laporan.saksi === 'string') {
                try {
                    const parsedArray = JSON.parse(this.laporan.saksi);
                    if (Array.isArray(parsedArray)) {
                        return parsedArray;
                    }
                } catch (e) {
                    console.log('Saksi is not a valid JSON string', e);
                }
            }
            
            return [];
        }
    }
};
</script>

<style scoped>
/* Main container */
.detail-pk-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Header section */
.detail-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.header-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;
}

.header-section .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
}

.header-section .left-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
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

/* Loading and Error states */
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

/* Detail content */
.detail-content {
    margin-top: 24px;
}

/* Status header */
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

.action-btn-container {
    margin-left: auto; /* Push to right */
    display: flex;
    align-items: center;
    margin-right: 16px; /* Add space between button and status badge */
}

.edit-button {
    background-color: #3490dc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.edit-button:hover {
    background-color: #2779bd;
}

.edit-button i {
    font-size: 1rem;
}

/* Status badge */
.status-badge {
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
}

/* Status colors */
.unverified {
    background-color: #fff3e0;
    color: #ef6c00;
}

.verified {
    background-color: #e0f2fe;
    color: #0369a1;
}

.rejected {
    background-color: #ffebee;
    color: #c62828;
}

.finished {
    background-color: #e8f5e9;
    color: #2e7d32;
}

/* Card styling */
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

/* Image gallery */
.image-gallery {
    margin-top: 20px;
}

.gallery-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 10px;
}

.image-item {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.evidence-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s;
}

.evidence-image:hover {
    transform: scale(1.05);
}

.image-caption {
    margin-top: 8px;
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
}

/* Fullscreen modal for images */
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

/* Detail cards layout */
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

/* Person items (terlapor/saksi) */
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

.info-item {
    margin-bottom: 12px;
}

.info-item .label {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
}

.info-item .value {
    color: #111827;
    font-weight: 500;
}

/* Tanggapan section */
.card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
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
    background-color: #f9fafb;
    border-radius: 0 6px 6px 0;
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

/* Action buttons */
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

/* Modal */
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