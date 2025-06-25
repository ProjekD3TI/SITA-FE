<template>
    <div class="add-pk-container">
        <div class="form-header">
            <h1>Tambah Laporan Kejadian Mendesak</h1>
        </div>

        <form @submit.prevent="submitForm" class="pk-form">
            <!-- Section 1: Detail Laporan -->
            <div class="form-section">
                <h2>Detail Laporan</h2>
                <div class="form-row">
                    <!-- Left column -->
                    <div class="form-column">
                        <div class="form-group">
                            <label for="judul">Judul Laporan <span class="required">*</span></label>
                            <input
                                type="text"
                                id="judul"
                                v-model="formData.judul"
                                class="form-control"
                                :class="{ 'is-invalid': errors.judul }"
                                required
                            />
                            <div v-if="errors.judul" class="invalid-feedback">{{ errors.judul[0] }}</div>
                        </div>

                        <div class="form-group">
                            <label for="image_path">Lampiran Foto <span class="required">*</span></label>
                            <div class="custom-file-upload">
                                <input
                                    type="file"
                                    id="image_path"
                                    @change="handleFileUpload"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors['image_path.0'] || errors.image_path }"
                                    accept="image/*"
                                    multiple
                                    required
                                />
                                <div v-if="errors['image_path.0']" class="invalid-feedback">{{ errors['image_path.0'][0] }}</div>
                                <div v-if="errors.image_path" class="invalid-feedback">{{ errors.image_path[0] }}</div>
                                <div> 
                                    <small class="text-muted">Anda dapat memilih beberapa foto sekaligus</small>
                                </div>
                            </div>
                            <div v-if="imagePreviews.length > 0" class="image-previews">
                                <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-item">
                                    <img :src="preview" alt="Preview" />
                                    <button type="button" @click="removeImage(index)" class="remove-image">×</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="category">Kategori <span class="required">*</span></label>
                            <select
                                id="category"
                                v-model="formData.category_id"
                                class="form-control"
                                :class="{ 'is-invalid': errors.category_id }"
                                disabled
                                required
                            >
                                <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                                    {{ category.nama }}
                                </option>
                            </select>
                            <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id[0] }}</div>
                            <small class="text-muted">Kategori tidak dapat diubah</small>
                        </div>
                    </div>

                    <!-- Right column -->
                    <div class="form-column">
                        <div class="form-group">
                            <label for="tanggal_kejadian">Tanggal & Waktu Kejadian <span class="required">*</span></label>
                            <input
                                type="datetime-local"
                                id="tanggal_kejadian"
                                v-model="formData.tanggal_kejadian"
                                class="form-control"
                                :class="{ 'is-invalid': errors.tanggal_kejadian }"
                                required
                            />
                            <div v-if="errors.tanggal_kejadian" class="invalid-feedback">{{ errors.tanggal_kejadian[0] }}</div>
                            <small class="text-muted">Terisi otomatis dengan waktu Indonesia saat ini (WIB)</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="lampiran_link">Lampiran Link <span class="required">*</span></label>
                            <input
                                type="url"
                                id="lampiran_link"
                                v-model="formData.lampiran_link"
                                class="form-control"
                                :class="{ 'is-invalid': errors.lampiran_link }"
                                placeholder="https://www.example.com"
                                required
                            />
                            <div v-if="errors.lampiran_link" class="invalid-feedback">{{ errors.lampiran_link[0] }}</div>
                            <small class="text-muted">Masukkan URL yang valid, contoh: https://www.example.com</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pernyataan -->
            <div class="form-section">
                <h2>Pernyataan</h2>
                <div class="statement-box">
                    <p>Dengan ini saya menyatakan bahwa:</p>
                    <ol>
                        <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                        <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                        <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
                    </ol>
                    <div class="form-check">
                        <input
                            type="checkbox"
                            id="agreement"
                            v-model="formData.agreement"
                            class="form-check-input"
                            required
                        />
                        <label for="agreement" class="form-check-label">
                            Saya menyetujui pernyataan di atas <span class="required">*</span>
                        </label>
                        <div v-if="errors.agreement" class="invalid-feedback">{{ errors.agreement[0] }}</div>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" @click="goBack" class="btn btn-secondary">Kembali</button>
                <button type="submit" class="btn btn-primary" :disabled="loading || !formData.agreement">
                    <span v-if="loading">Mengirim...</span>
                    <span v-else>Kirim Laporan</span>
                </button>
            </div>
        </form>

        <!-- Notification modal -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header" :class="{ 'success': isSuccess, 'error': !isSuccess }">
                    <h3>{{ modalTitle }}</h3>
                </div>
                <div class="modal-body">
                    <p>{{ modalMessage }}</p>
                </div>
                <div class="modal-footer">
                    <button @click="closeModal" class="btn btn-primary">OK</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { decryptData } from '../../../../services/encrypt';
import VueCookies from "vue-cookies";
import Swal from 'sweetalert2';

export default {
    name: 'AddPKMendesakDosen',
    data() {
        return {
            formData: {
                judul: '',
                category_id: null, // Will be set automatically to "Darurat dan Mendesak"
                deskripsi: '-', // Default value
                tanggal_kejadian: '',
                image_path: [],
                nama_pelapor: '',
                ni_pelapor: '',
                nomor_telepon: '',
                lampiran_link: '',
                profesi: 'Dosen', // Default value for dosen
                jenis_kelamin: 'laki-laki', // Default value
                umur_pelapor: '20-40', // Default value
                bukti_pelanggaran: ['foto_dokumentasi'], // Default value
                terlapor: [
                    {
                        nama_lengkap: '-',
                        email: '-',
                        nomor_telepon: '-',
                        status_warga: 'lainnya',
                        unit_kerja: 'Fakultas Teknik',
                        jenis_kelamin: 'laki-laki',
                        umur_terlapor: '20-40'
                    }
                ],
                saksi: [
                    {
                        nama_lengkap: '-',
                        email: '-',
                        nomor_telepon: '-'
                    }
                ],
                agreement: false
            },
            buktiOptions: [
                { value: 'dokumen_rekaman', label: 'Dokumen dan/atau rekaman video' },
                { value: 'foto_dokumentasi', label: 'Foto dokumentasi kejadian' },
                { value: 'surat_pernyataan', label: 'Surat pernyataan kejadian' },
                { value: 'laporan_saksi', label: 'Keterangan saksi kejadian' },
                { value: 'identitas_sumber', label: 'Identitas sumber informasi pihak ketiga' },
                { value: 'lainnya', label: 'Lainnya' },
            ],
            imagePreviews: [],
            categories: [],
            emergencyCategoryId: null, // Will store the ID of "Darurat dan Mendesak" category
            errors: {},
            loading: false,
            showModal: false,
            modalTitle: '',
            modalMessage: '',
            isSuccess: false
        };
    },
    mounted() {
        this.fetchCategories();
        this.loadUserData();
        this.setIndonesianDateTime(); // Set current Indonesian date and time when component mounts
        
        // Update the time every minute to keep it current
        this.timeUpdateInterval = setInterval(() => {
            this.setIndonesianDateTime();
        }, 60000); // 60000 ms = 1 minute
    },
    beforeDestroy() {
        // Clear the interval when component is destroyed
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
    },
    methods: {
        // Method for setting current Indonesian date and time (UTC+7)
        setIndonesianDateTime() {
            // Create a date object with the current time
            const now = new Date();
            
            // Add 7 hours to get Indonesian time (UTC+7)
            const indonesianTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
            
            // Format date and time as required by datetime-local input (YYYY-MM-DDThh:mm)
            const year = indonesianTime.getUTCFullYear();
            const month = String(indonesianTime.getUTCMonth() + 1).padStart(2, '0');
            const day = String(indonesianTime.getUTCDate()).padStart(2, '0');
            const hours = String(indonesianTime.getUTCHours()).padStart(2, '0');
            const minutes = String(indonesianTime.getUTCMinutes()).padStart(2, '0');
            
            // Format: YYYY-MM-DDThh:mm
            this.formData.tanggal_kejadian = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            console.log('Current Indonesian date and time set:', this.formData.tanggal_kejadian);
        },
        loadUserData() {
            try {
                const encryptedUserData = VueCookies.get("user_session");
                if (encryptedUserData) {
                    const userData = decryptData(encryptedUserData);
                    this.formData.nama_pelapor = userData.name || '';
                    this.formData.ni_pelapor = userData.nim || userData.nik || '';
                    this.formData.nomor_telepon = userData.no_telp || '';
                    
                    // You could also set gender and age range based on user profile if available
                    if (userData.jenis_kelamin) {
                        this.formData.jenis_kelamin = userData.jenis_kelamin;
                    }
                    
                    if (userData.umur) {
                        this.formData.umur_pelapor = userData.umur;
                    }
                    
                    console.log('User data loaded for current user');
                } else {
                    console.warn('No user session found in cookies');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('http://pelaporan-d3ti.my.id/api/category');
                this.categories = response.data;
                
                // Find the "Darurat dan Mendesak" category
                const mendesakCategory = this.categories.find(cat => cat.nama === "Darurat dan Mendesak");
                if (mendesakCategory) {
                    this.formData.category_id = mendesakCategory.category_id;
                } else if (this.categories.length > 0) {
                    // Fallback to the first category if "Darurat dan Mendesak" is not found
                    this.formData.category_id = this.categories[0].category_id;
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // If API fails, create a fallback category
                this.categories = [{
                    category_id: 21,
                    nama: "Darurat dan Mendesak"
                }];
                this.formData.category_id = 21;
            }
        },
        handleFileUpload(event) {
            const files = event.target.files;
            if (!files || files.length === 0) {
                return;
            }
            
            if (!this.formData.image_path) {
                this.formData.image_path = [];
            }
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                this.formData.image_path.push(file);
                
                const reader = new FileReader();
                reader.onload = e => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
        removeImage(index) {
            this.imagePreviews.splice(index, 1);
            this.formData.image_path.splice(index, 1);
        },
        validateForm() {
            let isValid = true;
            this.errors = {};

            if (!this.formData.judul) {
                this.errors.judul = ['Judul laporan harus diisi'];
                isValid = false;
            }

            if (!this.formData.tanggal_kejadian) {
                this.errors.tanggal_kejadian = ['Tanggal dan waktu kejadian harus diisi'];
                isValid = false;
            }

            if (!this.formData.image_path || this.formData.image_path.length === 0) {
                this.errors.image_path = ['Lampiran foto harus diisi'];
                isValid = false;
            }

            if (!this.formData.lampiran_link) {
                this.errors.lampiran_link = ['Lampiran link harus diisi'];
                isValid = false;
            } else if (!this.isValidUrl(this.formData.lampiran_link)) {
                this.errors.lampiran_link = ['Masukkan URL yang valid, contoh: https://www.example.com'];
                isValid = false;
            }

            if (!this.formData.agreement) {
                this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
                isValid = false;
            }

            return isValid;
        },
        isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        },
        submitForm() {
            // Validate form first
            if (!this.validateForm()) {
                this.$nextTick(() => {
                    const firstError = document.querySelector('.is-invalid');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                return;
            }

            // Set loading state
            this.loading = true;
            
            const formData = new FormData();

            // FIXED: Ensure required fields have values (no empty fields)
            formData.append('judul', this.formData.judul || 'Laporan Kejadian Mendesak');
            formData.append('category_id', this.formData.category_id || '1');
            formData.append('deskripsi', this.formData.deskripsi || 'Laporan kejadian mendesak yang perlu segera ditangani');
            
            // FIXED: Format date in YYYY-MM-DD HH:MM:SS format as expected by the API
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('.')[0].replace('T', ' ');
            formData.append('tanggal_kejadian', this.formData.tanggal_kejadian || formattedDate);
            
            // FIXED: Set default values for user data based on current login (miftahul01)
            formData.append('profesi', this.formData.profesi || 'Dosen');
            formData.append('jenis_kelamin', this.formData.jenis_kelamin || 'laki-laki');
            formData.append('umur_pelapor', this.formData.umur_pelapor || '20-40');
            
            // FIXED: Always include agreement value
            formData.append('agreement', '1');
            
            // Add optional fields if provided
            if (this.formData.lampiran_link) {
                formData.append('lampiran_link', this.formData.lampiran_link);
            }
            
            // Process image uploads - ensure at least one image exists
            if (!this.formData.image_path || this.formData.image_path.length === 0) {
                this.errors.image_path = ['Lampiran foto harus diunggah'];
                this.loading = false;
                this.$nextTick(() => {
                    const firstError = document.querySelector('.is-invalid');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                return;
            }
            
            // FIXED: Changed image upload format from wrong format to the correct format
            this.formData.image_path.forEach((file, index) => {
                formData.append(`image_path[${index}]`, file);
                console.log(`Appending file: ${file.name}, size: ${file.size}, type: ${file.type}`);
            });
            
            // Process terlapor data
            const validTerlapor = this.formData.terlapor ? this.formData.terlapor.filter(item => 
                item.nama_lengkap || item.email || item.nomor_telepon || item.status_warga || 
                item.unit_kerja || item.jenis_kelamin || item.umur_terlapor
            ) : [];
            
            if (validTerlapor.length > 0) {
                validTerlapor.forEach((item, index) => {
                    if (item.nama_lengkap) formData.append(`terlapor[${index}][nama_lengkap]`, item.nama_lengkap);
                    if (item.email) formData.append(`terlapor[${index}][email]`, item.email);
                    if (item.nomor_telepon) formData.append(`terlapor[${index}][nomor_telepon]`, item.nomor_telepon);
                    if (item.status_warga) formData.append(`terlapor[${index}][status_warga]`, item.status_warga);
                    if (item.unit_kerja) formData.append(`terlapor[${index}][unit_kerja]`, item.unit_kerja);
                    if (item.jenis_kelamin) formData.append(`terlapor[${index}][jenis_kelamin]`, item.jenis_kelamin);
                    if (item.umur_terlapor) formData.append(`terlapor[${index}][umur_terlapor]`, item.umur_terlapor);
                });
            } else {
                // FIXED: Ensure default terlapor has all required fields
                formData.append('terlapor[0][nama_lengkap]', 'Nama Terlapor');
                formData.append('terlapor[0][email]', 'terlapor@example.com');
                formData.append('terlapor[0][nomor_telepon]', '081234567890');
                formData.append('terlapor[0][status_warga]', 'mahasiswa');
                formData.append('terlapor[0][unit_kerja]', 'Fakultas Teknik');
                formData.append('terlapor[0][jenis_kelamin]', 'laki-laki');
                formData.append('terlapor[0][umur_terlapor]', '20-40');
            }

            // Process saksi data
            const validSaksi = this.formData.saksi ? this.formData.saksi.filter(item => 
                item.nama_lengkap || item.email || item.nomor_telepon
            ) : [];
            
            if (validSaksi.length > 0) {
                validSaksi.forEach((item, index) => {
                    if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
                    if (item.email) formData.append(`saksi[${index}][email]`, item.email);
                    if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
                });
            } else {
                // Use default values if no saksi data
                formData.append('saksi[0][nama_lengkap]', 'Nama Saksi');
                formData.append('saksi[0][email]', 'saksi@example.com');
                formData.append('saksi[0][nomor_telepon]', '089876543210');
            }

            // Process bukti_pelanggaran
            if (this.formData.bukti_pelanggaran && this.formData.bukti_pelanggaran.length > 0) {
                this.formData.bukti_pelanggaran.forEach((item, index) => {
                    formData.append(`bukti_pelanggaran[${index}]`, item);
                });
            } else {
                formData.append('bukti_pelanggaran[0]', 'foto_dokumentasi');
            }

            // Debug what's being sent
            console.log("Form data being submitted:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }
            
            // Get authentication token
            // FIXED: Try multiple methods to get the auth token
            const authToken = this.token || VueCookies.get('auth_token') || this.$cookies.get('auth_token');
            if (!authToken) {
                this.loading = false;
                Swal.fire({
                    title: 'Error Autentikasi',
                    text: 'Token autentikasi tidak ditemukan. Silakan login kembali.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    this.$router.push('/login');
                });
                return;
            }

            // FIXED: Debug the auth token (first few characters only for security)
            console.log(`Using auth token: ${authToken.substring(0, 15)}...`);
            
            // Create and configure XMLHttpRequest
            const xhr = new XMLHttpRequest();
            
            // Use absolute URL to ensure correct endpoint
            xhr.open('POST', 'http://pelaporan-d3ti.my.id/api/laporan/add_laporan', true);
            
            // Set headers
            xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            
            // Set timeout - 30 seconds
            xhr.timeout = 30000;
            
            // Handle successful response
            xhr.onload = () => {
                this.loading = false;
                
                console.log(`Response status: ${xhr.status}`);
                console.log(`Response text: ${xhr.responseText}`);
                
                // Handle response based on status code
                if (xhr.status === 200 || xhr.status === 201) {
                    try {
                        // Parse response
                        const response = JSON.parse(xhr.response);
                        console.log("Submission successful:", response);
                        
                        // Show success message
                        Swal.fire({
                            title: 'Sukses!',
                            text: 'Laporan berhasil dikirim!',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            // Redirect to dashboard
                            this.$router.push('/dosen/dashboardpkdosen');
                        });
                        
                        // Reset the form
                        this.resetForm();
                        
                    } catch (error) {
                        // If JSON parse fails but status is success, still consider it a success
                        console.warn('Server returned non-JSON response with success status:', xhr.response);
                        
                        Swal.fire({
                            title: 'Sukses!',
                            text: 'Laporan berhasil dikirim!',
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => {
                            this.$router.push('/dosen/dashboardpkdosen');
                        });
                        
                        // Reset the form
                        this.resetForm();
                    }
                } else if (xhr.status === 400) {
                    // FIXED: Enhanced 400 error handling with more detailed logging
                    try {
                        const response = JSON.parse(xhr.response);
                        console.log('Server returned 400 error:', response);
                        
                        // Extract detailed validation errors
                        this.errors = response.errors || {};
                        
                        // Create readable error message
                        let errorMessage = 'Silakan periksa kembali isian form Anda.';
                        if (response.message) {
                            errorMessage = response.message;
                        } else if (Object.keys(this.errors).length > 0) {
                            // Get first error
                            const firstErrorField = Object.keys(this.errors)[0];
                            const firstError = this.errors[firstErrorField][0];
                            errorMessage = `${firstError} (${firstErrorField})`;
                        }
                        
                        Swal.fire({
                            title: 'Validasi Gagal',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        
                        this.$nextTick(() => {
                            const firstError = document.querySelector('.is-invalid');
                            if (firstError) {
                                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                    } catch (error) {
                        console.error('Error parsing 400 response:', error, xhr.response);
                        Swal.fire({
                            title: 'Validasi Gagal',
                            text: 'Format data tidak sesuai dengan yang diharapkan server.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } else if (xhr.status === 401) {
                    // FIXED: Clear invalid tokens and provide clear error message
                    VueCookies.remove('auth_token');
                    if (this.$cookies && this.$cookies.remove) {
                        this.$cookies.remove('auth_token');
                    }
                    
                    Swal.fire({
                        title: 'Sesi Berakhir',
                        text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        this.$router.push('/login');
                    });
                } else {
                    // Handle other server errors
                    console.error(`Server error (${xhr.status}):`, xhr.response);
                    let errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
                    
                    try {
                        const errorResponse = JSON.parse(xhr.response);
                        if (errorResponse.message) {
                            errorMessage = errorResponse.message;
                        }
                        if (errorResponse.error_details) {
                            console.error('Error details:', errorResponse.error_details);
                            errorMessage += ` (${errorResponse.error_details})`;
                        }
                    } catch (e) {
                        // Use default message if parsing fails
                        console.error('Could not parse error response:', e);
                    }
                    
                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            };
            
            // Handle network errors
            xhr.onerror = () => {
                this.loading = false;
                console.error('Network error during request');
                
                Swal.fire({
                    title: 'Error Koneksi',
                    text: 'Gagal menghubungi server. Periksa koneksi internet Anda.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            };
            
            // Handle timeout
            xhr.ontimeout = () => {
                this.loading = false;
                console.error('Request timed out');
                
                Swal.fire({
                    title: 'Timeout',
                    text: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            };
            
            // Track upload progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
                    // You can update a progress UI element here if you have one
                    // this.uploadProgress = percentComplete;
                }
            };
            
            // Send the request
            console.log("Sending request to API endpoint");
            try {
                xhr.send(formData);
            } catch (error) {
                this.loading = false;
                console.error('Error sending request:', error);
                
                Swal.fire({
                    title: 'Error',
                    text: 'Gagal mengirim data: ' + error.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },

        goBack() {
            this.$router.go(-1);
        },
        showNotification(title, message, isSuccess) {
            this.modalTitle = title;
            this.modalMessage = message;
            this.isSuccess = isSuccess;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            if (this.isSuccess) {
                this.$router.push('/dosen/dashboardpkdosen');
            }
        }
    }
};
</script>

<style scoped>
.add-pk-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
    margin-bottom: 2rem;
    text-align: center;
}

.form-header h1 {
    font-size: 1.8rem;
    color: #333;
}

.form-section {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.form-section h2 {
    font-size: 1.4rem;
    color: #333;
    margin-bottom: 1.5rem;
}

.pk-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-row {
    display: flex;
    gap: 2rem;
}

.form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: 600;
    color: #333;
}

.required {
    color: #dc3545;
}

.form-control {
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
}

.form-control:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.custom-file-upload {
    position: relative;
}

.image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 1rem;
}

.image-preview-item {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ddd;
}

.image-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-image {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    color: #dc3545;
}

.remove-image:hover {
    background: rgba(255, 255, 255, 0.9);
}

.text-muted {
    color: #6c757d;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Styling untuk section pernyataan */
.statement-box {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.statement-box p {
    font-weight: 600;
    margin-bottom: 1rem;
}

.statement-box ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
}

.statement-box ol li {
    margin-bottom: 0.75rem;
    line-height: 1.5;
}

.form-check {
    display: flex;
    align-items: flex-start;
    margin-top: 1rem;
}

.form-check-input {
    margin-top: 0.25rem;
    margin-right: 0.5rem;
}

.form-check-label {
    font-weight: 500;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0069d9;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #5a6268;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1rem;
    text-align: center;
}

.modal-header.success {
    background-color: #28a745;
    color: white;
}

.modal-header.error {
    background-color: #dc3545;
    color: white;
}

.modal-body {
    padding: 1.5rem;
    text-align: center;
}

.modal-footer {
    padding: 1rem;
    display: flex;
    justify-content: center;
}

/* Responsive layout */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>