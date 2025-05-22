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
import VueCookies from 'vue-cookies';

export default {
    name: 'DetailKS',
    data() {
        return {
            apiBaseUrl: 'https://v3422040.mhs.d3tiuns.com/api',
            laporanId: null,
            laporan: {},
            categories: {},
            loading: true,
            error: null,
            showFullImage: false,
            currentImageIndex: 0,
            showTanggapanModal: false,
            tanggapanText: ''
        };
    },
    
    computed: {
        // Process images for display
        processedImages() {
            if (!this.laporan.image_path) return [];
            
            try {
                // Check if image_path is already an array
                if (Array.isArray(this.laporan.image_path)) {
                    return this.laporan.image_path;
                }
                
                // Check if it's a JSON string
                if (typeof this.laporan.image_path === 'string') {
                    try {
                        const parsed = JSON.parse(this.laporan.image_path);
                        if (Array.isArray(parsed)) {
                            return parsed;
                        }
                    } catch (e) {
                        // Not JSON, treat as a single image
                    }
                }
                
                // Fallback to treating as a single image
                return [this.laporan.image_path];
                
            } catch (error) {
                console.error('Error processing images:', error);
                return [this.laporan.image_path];
            }
        },
        
        // Get current image for fullscreen view
        currentImageSrc() {
            if (!this.processedImages || this.processedImages.length === 0) return '';
            return this.getImageUrl(this.processedImages[this.currentImageIndex]);
        },
        
        // Process bukti_pelanggaran for display
        processedBuktiPelanggaran() {
            if (!this.laporan.bukti_pelanggaran) return [];
            
            try {
                // Check if already an array
                if (Array.isArray(this.laporan.bukti_pelanggaran)) {
                    return this.laporan.bukti_pelanggaran;
                }
                
                // Check if it's a JSON string
                if (typeof this.laporan.bukti_pelanggaran === 'string') {
                    try {
                        const parsed = JSON.parse(this.laporan.bukti_pelanggaran);
                        if (Array.isArray(parsed)) {
                            return parsed;
                        }
                    } catch (e) {
                        // Not JSON, return as is
                        return [this.laporan.bukti_pelanggaran];
                    }
                }
                
                return [];
            } catch (error) {
                console.error('Error processing bukti_pelanggaran:', error);
                return [];
            }
        },
        
        // Process terlapor for display
        processedTerlapor() {
            if (!this.laporan.terlapor) return [];
            
            try {
                // Check if already an array
                if (Array.isArray(this.laporan.terlapor)) {
                    return this.laporan.terlapor;
                }
                
                // Check if it's a JSON string
                if (typeof this.laporan.terlapor === 'string') {
                    try {
                        const parsed = JSON.parse(this.laporan.terlapor);
                        if (Array.isArray(parsed)) {
                            return parsed;
                        } else if (typeof parsed === 'object') {
                            return [parsed];
                        }
                    } catch (e) {
                        // Not JSON, return as is
                        return [];
                    }
                }
                
                return [];
            } catch (error) {
                console.error('Error processing terlapor:', error);
                return [];
            }
        },
        
        // Process saksi for display
        processedSaksi() {
            if (!this.laporan.saksi) return [];
            
            try {
                // Check if already an array
                if (Array.isArray(this.laporan.saksi)) {
                    return this.laporan.saksi;
                }
                
                // Check if it's a JSON string
                if (typeof this.laporan.saksi === 'string') {
                    try {
                        const parsed = JSON.parse(this.laporan.saksi);
                        if (Array.isArray(parsed)) {
                            return parsed;
                        } else if (typeof parsed === 'object') {
                            return [parsed];
                        }
                    } catch (e) {
                        // Not JSON, return as is
                        return [];
                    }
                }
                
                return [];
            } catch (error) {
                console.error('Error processing saksi:', error);
                return [];
            }
        },
        
        hasBuktiPelanggaran() {
            return this.processedBuktiPelanggaran && this.processedBuktiPelanggaran.length > 0;
        },
        
        hasTerlapor() {
            return this.processedTerlapor && this.processedTerlapor.length > 0;
        },
        
        hasSaksi() {
            return this.processedSaksi && this.processedSaksi.length > 0;
        }
    },
    
    created() {
        // Extract the ID from the route params
        const routeParam = this.$route.params.id;
        console.log('Route param received:', routeParam, typeof routeParam);
        
        // Handle different formats of the ID parameter
        if (typeof routeParam === 'object') {
            // If it's an object, try to extract the ID
            if (routeParam.id) {
                this.laporanId = routeParam.id;
            } else {
                // Try to find the ID in the object
                const keys = Object.keys(routeParam);
                if (keys.length > 0) {
                    this.laporanId = routeParam[keys[0]];
                } else {
                    console.error('Could not extract ID from object');
                    this.error = 'Invalid report ID';
                    return;
                }
            }
        } else {
            this.laporanId = routeParam;
        }
        
        console.log('Extracted ID:', this.laporanId);
        this.fetchCategories();
        this.fetchLaporanDetail();
    },
    
    methods: {
        // API calls with XMLHttpRequest
        fetchCategories() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${this.apiBaseUrl}/category`, true);
            xhr.timeout = 10000; // 10 seconds timeout
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        
                        // Create a map of category_id to category name
                        this.categories = Array.isArray(response) ? 
                            response.reduce((acc, category) => {
                                acc[category.category_id] = category.nama;
                                return acc;
                            }, {}) : {};
                            
                        console.log('Categories loaded:', this.categories);
                    } catch (error) {
                        console.error('Error parsing categories:', error);
                    }
                } else {
                    console.error('Failed to fetch categories:', xhr.status);
                }
            };
            
            xhr.onerror = () => {
                console.error('Network error while fetching categories');
            };
            
            xhr.ontimeout = () => {
                console.error('Timeout while fetching categories');
            };
            
            xhr.send();
        },
        
        fetchLaporanDetail() {
            try {
                if (!this.laporanId) {
                    this.error = 'No valid ID provided';
                    this.loading = false;
                    return;
                }
                
                this.loading = true;
                
                // Get token from Vue Cookies
                const userData = VueCookies.get('user_session');
                let token = '';
                
                if (userData) {
                    // If it's an object with token property
                    if (typeof userData === 'object' && userData.token) {
                        token = userData.token;
                    }
                    // If it's a string (possibly JSON)
                    else if (typeof userData === 'string') {
                        try {
                            const parsedData = JSON.parse(userData);
                            if (parsedData.token) {
                                token = parsedData.token;
                            }
                        } catch (e) {
                            // Not JSON, might be just the token
                            token = userData;
                        }
                    }
                }
                
                console.log('Fetching with ID:', this.laporanId, typeof this.laporanId);
                
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}`, true);
                xhr.timeout = 15000; // 15 seconds timeout
                
                // Set headers
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                xhr.setRequestHeader('Accept', 'application/json');
                
                xhr.onload = () => {
                    this.loading = false;
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            this.laporan = response;
                            console.log('Laporan data:', this.laporan);
                        } catch (error) {
                            console.error('Error parsing response:', error);
                            this.error = 'Failed to parse response data';
                        }
                    } else {
                        console.error('Error fetching laporan detail:', xhr.status);
                        this.error = 'Failed to load laporan detail';
                    }
                };
                
                xhr.onerror = () => {
                    this.loading = false;
                    console.error('Network error occurred');
                    this.error = 'Network error. Please check your connection.';
                };
                
                xhr.ontimeout = () => {
                    this.loading = false;
                    console.error('Request timed out');
                    this.error = 'Request timed out. Please try again.';
                };
                
                xhr.send();
                
            } catch (error) {
                console.error('Error in fetchLaporanDetail:', error);
                this.error = 'Failed to load laporan detail';
                this.loading = false;
            }
        },
        
        async updateStatus(newStatus) {
            try {
                this.loading = true;
                
                // Get token from Vue Cookies
                const userData = VueCookies.get('user_session');
                let token = '';
                
                if (userData) {
                    if (typeof userData === 'object' && userData.token) {
                        token = userData.token;
                    } else if (typeof userData === 'string') {
                        try {
                            const parsedData = JSON.parse(userData);
                            if (parsedData.token) {
                                token = parsedData.token;
                            }
                        } catch (e) {
                            token = userData;
                        }
                    }
                }
                
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', `${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}/status`, true);
                xhr.timeout = 10000;
                
                // Set headers
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
                
                xhr.onload = () => {
                    this.loading = false;
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        this.laporan.status = newStatus;
                        this.$notify({
                            type: 'success',
                            text: `Status laporan berhasil diperbarui menjadi ${this.formatStatus(newStatus)}`
                        });
                    } else {
                        console.error('Error updating status:', xhr.status);
                        this.$notify({
                            type: 'error',
                            text: 'Gagal memperbarui status laporan'
                        });
                    }
                };
                
                xhr.onerror = () => {
                    this.loading = false;
                    console.error('Network error occurred');
                    this.$notify({
                        type: 'error',
                        text: 'Gagal memperbarui status laporan karena masalah jaringan'
                    });
                };
                
                xhr.ontimeout = () => {
                    this.loading = false;
                    console.error('Request timed out');
                    this.$notify({
                        type: 'error',
                        text: 'Permintaan melebihi batas waktu. Silakan coba lagi.'
                    });
                };
                
                // Send request with data
                xhr.send(JSON.stringify({ status: newStatus }));
                
            } catch (error) {
                this.loading = false;
                console.error('Error in updateStatus:', error);
                this.$notify({
                    type: 'error',
                    text: 'Gagal memperbarui status laporan'
                });
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
                
                // Get token from Vue Cookies
                const userData = VueCookies.get('user_session');
                let token = '';
                
                if (userData) {
                    if (typeof userData === 'object' && userData.token) {
                        token = userData.token;
                    } else if (typeof userData === 'string') {
                        try {
                            const parsedData = JSON.parse(userData);
                            if (parsedData.token) {
                                token = parsedData.token;
                            }
                        } catch (e) {
                            token = userData;
                        }
                    }
                }
                
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', `${this.apiBaseUrl}/laporan_kekerasan/${this.laporanId}/tanggapan`, true);
                xhr.timeout = 10000;
                
                // Set headers
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
                
                xhr.onload = () => {
                    this.loading = false;
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        this.laporan.tanggapan = this.tanggapanText;
                        this.showTanggapanModal = false;
                        this.tanggapanText = '';
                        
                        this.$notify({
                            type: 'success',
                            text: 'Tanggapan berhasil disimpan'
                        });
                    } else {
                        console.error('Error saving tanggapan:', xhr.status);
                        this.$notify({
                            type: 'error',
                            text: 'Gagal menyimpan tanggapan'
                        });
                    }
                };
                
                xhr.onerror = () => {
                    this.loading = false;
                    console.error('Network error occurred');
                    this.$notify({
                        type: 'error',
                        text: 'Gagal menyimpan tanggapan karena masalah jaringan'
                    });
                };
                
                xhr.ontimeout = () => {
                    this.loading = false;
                    console.error('Request timed out');
                    this.$notify({
                        type: 'error',
                        text: 'Permintaan melebihi batas waktu. Silakan coba lagi.'
                    });
                };
                
                // Send request with data
                xhr.send(JSON.stringify({ tanggapan: this.tanggapanText }));
                
            } catch (error) {
                this.loading = false;
                console.error('Error in saveTanggapan:', error);
                this.$notify({
                    type: 'error',
                    text: 'Gagal menyimpan tanggapan'
                });
            }
        },
        
        // Helper Methods
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
                'rejected': 'Ditolak',
                'finished': 'Selesai'
            };
            
            return statusMap[status] || 'Belum Diverifikasi';
        },
        
        formatJenisKelamin(jenisKelamin) {
            if (!jenisKelamin) return 'Tidak ada';
            
            const formattedMap = {
                'laki-laki': 'Laki-laki',
                'perempuan': 'Perempuan'
            };
            
            return formattedMap[jenisKelamin] || jenisKelamin;
        },

        formatUmur(umur) {
            if (umur === '<20') return 'Kurang dari 20 tahun';
            if (umur === '20-40') return '20 - 40 tahun';
            if (umur === '40<') return 'Lebih dari 40 tahun';
            return umur;
        },
        
        getCategoryName(categoryId) {
            return this.categories[categoryId] || `Kategori ${categoryId}`;
        },
        
        getImageUrl(imagePath) {
            if (!imagePath) return '';
            return `${this.apiBaseUrl.replace('/api', '')}/storage/laporankekerasan/${imagePath}`;
        },
        
        startChat() {
            // Get the phone number from the laporan data
            let phoneNumber = this.laporan.nomor_telepon;
            this.startChatWithPerson(phoneNumber);
        },
        
        startChatWithPerson(phoneNumber) {
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