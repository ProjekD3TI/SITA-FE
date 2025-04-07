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
                <div class="laporan-number">{{ laporan.nomor_laporan }}</div>
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
                
                <div v-if="laporan.image_path" class="image-container">
                    <img :src="getImageUrl(laporan.image_path)" alt="Gambar Kejadian" class="evidence-image" @click="showFullImage = true">
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
        </div>

        <!-- Modal for full image view -->
        <div class="fullscreen-modal" v-if="showFullImage" @click="showFullImage = false">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img :src="getImageUrl(laporan.image_path)" alt="Bukti Kejadian" class="fullscreen-image">
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
            showTanggapanModal: false,
            tanggapanText: '',
        };
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
                'rejected': 'Ditolak'
            };
            
            return statusMap[status] || status;
        },
        
        getCategoryName(categoryId) {
            return this.categories[categoryId] || `Kategori ${categoryId}`;
        },
        
        getImageUrl(imagePath) {
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
                this.$notify({
                    type: 'error',
                    text: 'Nomor telepon tidak tersedia'
                });
            }
        },
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

.tanggapan-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-line;
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

.phone-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4B5563;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-button:hover {
  background-color: #374151;
}

.field-row {
  display: flex;
  margin-bottom: 12px;
}

.field-label {
  font-weight: 500;
  width: 150px;
  flex-shrink: 0;
}

.field-value {
  display: flex;
  align-items: center;
  gap: 10px;
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
</style>