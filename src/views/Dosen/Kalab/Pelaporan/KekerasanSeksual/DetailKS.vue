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
import axios from 'axios';

export default {
    name: 'DetailKS',
    data() {
        return {
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
        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8000/api/category');
                this.categories = response.data.reduce((acc, category) => {
                    acc[category.category_id] = category.nama;
                    return acc;
                }, {});
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        
        async fetchLaporanDetail() {
            try {
                if (!this.laporanId) {
                  this.error = 'No valid ID provided';
                  this.loading = false;
                  return;
                }
                
                this.loading = true;
                const token = localStorage.getItem('token'); // Make sure this matches your storage key
                
                console.log('Fetching with ID:', this.laporanId, typeof this.laporanId);
                
                const response = await axios.get(`http://localhost:8000/api/laporan_kekerasan/${this.laporanId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                this.laporan = response.data;
                console.log('Laporan data:', this.laporan);
                
                this.loading = false;
            } catch (error) {
                console.error('Error fetching laporan detail:', error);
                this.error = 'Failed to load laporan detail';
                this.loading = false;
            }
        },
        
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
            return `http://localhost:8000/storage/laporankekerasan/${imagePath}`;
        },
        
        async updateStatus(newStatus) {
            try {
                this.loading = true;
                
                const response = await axios.put(`http://localhost:8000/api/laporan_kekerasan/${this.laporanId}/status`, {
                    status: newStatus
                });
                
                this.laporan.status = newStatus;
                this.$notify({
                    type: 'success',
                    text: `Status laporan berhasil diperbarui menjadi ${this.formatStatus(newStatus)}`
                });
            } catch (error) {
                console.error('Error updating status:', error);
                this.$notify({
                    type: 'error',
                    text: 'Gagal memperbarui status laporan'
                });
            } finally {
                this.loading = false;
            }
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
                
                const response = await axios.put(`http://localhost:8000/api/laporan_kekerasan/${this.laporanId}/tanggapan`, {
                    tanggapan: this.tanggapanText
                });
                
                this.laporan.tanggapan = this.tanggapanText;
                this.showTanggapanModal = false;
                this.tanggapanText = '';
                
                this.$notify({
                    type: 'success',
                    text: 'Tanggapan berhasil disimpan'
                });
            } catch (error) {
                console.error('Error saving tanggapan:', error);
                this.$notify({
                    type: 'error',
                    text: 'Gagal menyimpan tanggapan'
                });
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.detail-ks-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
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

.image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
}

.image-item {
    width: 200px;
    height: 200px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    width: 100%;
    margin-top: 12px;
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
    display: flex;
    align-items: center;
}

.tanggapan-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-line;
}

.bukti-list ul {
    list-style-type: disc;
    padding-left: 20px;
}

.bukti-list li {
    margin-bottom: 8px;
}

.terlapor-item, .saksi-item {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
}

.terlapor-item h4, .saksi-item h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #4b5563;
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

.completed, .finished {
    background-color: #d1fae5;
    color: #059669;
}

.rejected {
    background-color: #fee2e2;
    color: #dc2626;
}

.chat-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #4B5563;
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

/* Responsive design */
@media (max-width: 768px) {
    .detail-cards-row {
        grid-template-columns: 1fr;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .info-label {
        font-weight: 600;
        margin-top: 8px;
    }
    
    .image-item {
        width: 100%;
        height: auto;
    }
}
</style>