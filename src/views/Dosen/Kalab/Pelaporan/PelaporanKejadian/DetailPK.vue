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
                        <div class="info-value">{{ laporan.ni_pelapor }}</div>
                        
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ laporan.email }}</div>
                        
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">{{ laporan.nomor_telepon }}</div>
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
                            <span class="tanggapan-user">{{ item.user || 'Admin' }}</span>
                            <span class="tanggapan-time">{{ formatDate(item.timestamp) }}</span>
                        </div>
                        <p class="tanggapan-text">{{ item.text }}</p>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn-primary" @click="verifyReport" v-if="laporan.status === 'unverified'">
                    <i class="fas fa-check"></i> Verifikasi Laporan
                </button>
                <button class="btn-danger" @click="rejectReport" v-if="laporan.status === 'unverified'">
                    <i class="fas fa-times"></i> Tolak Laporan
                </button>
                <button class="btn-secondary" @click="showTanggapanModal = true">
                    <i class="fas fa-comment"></i> Tambah Tanggapan
                </button>
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

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    name: 'DetailPK',
    data() {
        return {
            laporanId: null,
            laporan: null,
            categories: {},
            loading: false,
            loadingAction: false,
            error: null,
            showFullImage: false,
            showTanggapanModal: false,
            tanggapanText: '',
            showVerificationModal: false,
            isVerifying: false,
            currentUser: 'miftahul01', // Current user's login as specified
        };
    },
    
    created() {
        this.laporanId = this.$route.params.id;
        this.fetchCategories();
        this.fetchLaporanDetail();
    },
    
    computed: {
        hasTanggapan() {
            if (!this.laporan) return false;
            if (!this.laporan.tanggapan) return false;
            
            if (Array.isArray(this.laporan.tanggapan)) {
                return this.laporan.tanggapan.length > 0;
            }
            
            return typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '';
        }
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
            this.loading = true;
            this.error = null;
            
            try {
                const response = await axios.get(`http://localhost:8000/api/laporan/${this.laporanId}`);
                this.laporan = response.data;
                
                // Process tanggapan data
                if (this.laporan.tanggapan) {
                    // Try to parse if it's a JSON string
                    try {
                        const parsed = JSON.parse(this.laporan.tanggapan);
                        if (Array.isArray(parsed)) {
                            this.laporan.tanggapan = parsed;
                        }
                    } catch (e) {
                        // If it's not valid JSON, keep it as a string
                        console.log('Tanggapan is not in JSON format, keeping as string');
                    }
                }
                
                this.tanggapanText = '';
            } catch (error) {
                console.error('Error fetching laporan detail:', error);
                this.error = 'Gagal memuat data laporan. Silakan coba lagi.';
            } finally {
                this.loading = false;
            }
        },
        
        goBack() {
            this.$router.go(-1);
        },
        
        formatDate(dateString) {
            if (!dateString) return '-';
            
            // If the date is already in the YYYY-MM-DD HH:MM:SS format with no 'T' and 'Z'
            // we need to convert it to a proper ISO format for the Date constructor
            let date;
            if (typeof dateString === 'string' && dateString.includes(' ') && !dateString.includes('T')) {
                // Replace space with 'T' and add 'Z' for UTC if not present
                const hasZ = dateString.endsWith('Z');
                date = new Date((dateString.replace(' ', 'T') + (hasZ ? '' : '')));
                
                // Adjust for Indonesia timezone (GMT+7)
                // This is needed if the date is coming as UTC and we need to add 7 hours
                date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
            } else {
                // If it's already in a proper format that JS Date can parse
                date = new Date(dateString);
            }
            
            // Format the date in Indonesian style
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta' // Set the timezone to Indonesia's timezone (GMT+7)
            };
            
            return date.toLocaleDateString('id-ID', options);
        },
        
        formatStatus(status) {
            const statusMap = {
                'unverified': 'Belum Diverifikasi',
                'verified': 'Diproses',
                'rejected': 'Ditolak'
            };
            
            return statusMap[status] || status;
        },
        
        getCategoryName(categoryId) {
            return this.categories[categoryId] || `Kategori ${categoryId}`;
        },
        
        getImageUrl(imagePath) {
            return `http://localhost:8000/storage/laporan/${imagePath}`;
        },
        
        async updateStatus(newStatus) {
            try {
                if (!this.laporanId) {
                    throw new Error('Laporan ID tidak ditemukan');
                }
                
                // Log what we're sending to help debug
                console.log('Updating status:', {
                    laporanId: this.laporanId,
                    newStatus: newStatus
                });
                
                // Make the API call using POST with _method: PUT
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('status', newStatus);

                const response = await axios.post(`http://localhost:8000/api/laporan/update_status/${this.laporanId}`, formData);
                                
                // Check if response has data
                console.log('Response:', response);
                
                // Just proceed if we get a 2xx response
                this.laporan.status = newStatus;
                this.$toast.success('Status berhasil diperbarui');
                
                // Refresh data
                await this.fetchLaporanDetail();
                
            } catch (error) {
                console.error('Error updating status:', error);
                // Safely access error message with optional chaining
                const errorMessage = error.response?.data?.message || 'Gagal memperbarui status';
                this.$toast.error(`Gagal memperbarui status: ${errorMessage}`);
            }
        },
        
        // Add specific methods for verification and rejection
        verifyReport() {
            this.showVerificationModal = true;
        },

        async confirmVerification() {
            this.isVerifying = true;
            
            try {
                // Your verification API call
                await axios.put(`http://localhost:8000/api/laporan/update_status/${this.laporanId}`, {
                    status: 'verified'
                });
                
                // Update local data after successful verification
                this.laporan.status = 'verified';
                
                // Show success message (optional)
                this.$toast.success('Laporan berhasil diverifikasi');
            } catch (error) {
                console.error('Verification failed:', error);
                // Show error message (optional)
                this.$toast.error('Gagal memverifikasi laporan');
            } finally {
                this.isVerifying = false;
                this.showVerificationModal = false; // Close the modal after processing
            }
        },

        async rejectReport() {
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
                
                // Log what we're sending to help debug
                console.log('Rejecting report:', {
                    laporanId: this.laporanId
                });
                
                // Make the API call using POST with _method: PUT
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('status', 'rejected');

                const response = await axios.post(
                    `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
                    formData
                );
                                
                // Check if response has data
                console.log('Response:', response);
                
                // Update local data after successful rejection
                this.laporan.status = 'rejected';
                
                // Show success message with Swal instead of toast
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
                await this.fetchLaporanDetail();
                
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
        },
        
        async saveTanggapan() {
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
                
                // Make the API call first to get updated_at value
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('tanggapan', this.tanggapanText); // Temporary single string for API call
                
                // Include the current status to maintain it
                if (this.laporan && this.laporan.status) {
                    formData.append('status', this.laporan.status);
                } else {
                    formData.append('status', 'pending');
                }
                
                const response = await axios.post(
                    `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
                    formData
                );
                
                console.log('Response:', response);
                
                // Get the updated data to get the new updated_at timestamp
                const updatedResponse = await axios.get(`http://localhost:8000/api/laporan/${this.laporanId}`);
                const updatedData = updatedResponse.data;
                
                // Now create the tanggapan array with the new timestamp from updated_at
                // Create a new response object with text and timestamp from the API's updated_at
                const newTanggapan = {
                    text: this.tanggapanText,
                    timestamp: updatedData.updated_at, // Using the updated_at from API response
                    user: this.currentUser
                };
                
                // Prepare the tanggapan array
                let tanggapanArray = [];
                
                if (this.laporan.tanggapan) {
                    // If tanggapan exists and is already an array, use it
                    if (Array.isArray(this.laporan.tanggapan)) {
                        tanggapanArray = [...this.laporan.tanggapan];
                    } 
                    // If tanggapan exists but is a string (old format), convert it to array
                    else if (typeof this.laporan.tanggapan === 'string' && this.laporan.tanggapan.trim() !== '') {
                        tanggapanArray = [{
                            text: this.laporan.tanggapan,
                            timestamp: this.laporan.updated_at, // Use the previous update time 
                            user: 'Admin'
                        }];
                    }
                }
                
                // Add the new response
                tanggapanArray.push(newTanggapan);
                
                // Update tanggapan with the array format
                const arrayFormData = new FormData();
                arrayFormData.append('_method', 'PUT');
                arrayFormData.append('tanggapan', JSON.stringify(tanggapanArray));
                
                // Include the current status to maintain it
                if (this.laporan && this.laporan.status) {
                    arrayFormData.append('status', this.laporan.status);
                } else {
                    arrayFormData.append('status', 'pending');
                }

                // Make second API call to update with the array
                await axios.post(
                    `http://localhost:8000/api/laporan/update_status/${this.laporanId}`, 
                    arrayFormData
                );
                
                // Update local data after successful submission
                this.laporan.tanggapan = tanggapanArray;
                this.laporan.updated_at = updatedData.updated_at;
                
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
                
                // Refresh data
                await this.fetchLaporanDetail();
                
            } catch (error) {
                console.error('Error saving tanggapan:', error);
                
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
    }
};
</script>

<style scoped>
.detail-pk-container {
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
</style>