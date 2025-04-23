<template>
  <div class="add-ks-container">
    <div class="form-header">
      <h1>Laporan Kekerasan Seksual</h1>
    </div>

    <form @submit.prevent="submitForm" class="ks-form">
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
              <label for="category_id">Kategori <span class="required">*</span></label>
              <select
                id="category_id"
                v-model="formData.category_id"
                class="form-control"
                :class="{ 'is-invalid': errors.category_id }"
                required
              >
                <option value="" disabled selected>Pilih Kategori</option>
                <option 
                  v-for="category in kekerasanCategories" 
                  :key="category.category_id" 
                  :value="category.category_id"
                >
                  {{ category.nama }}
                </option>
              </select>
              <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id[0] }}</div>
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
                  required
                />
                <div v-if="errors['image_path.0']" class="invalid-feedback">{{ errors['image_path.0'][0] }}</div>
                <div v-if="errors.image_path" class="invalid-feedback">{{ errors.image_path[0] }}</div>
              </div>
            </div>
          </div>

          <!-- Right column - Detail Laporan lanjutan -->
          <div class="form-column">
            <div class="form-group">
              <label for="deskripsi">Deskripsi <span class="required">*</span></label>
              <textarea
                id="deskripsi"
                v-model="formData.deskripsi"
                class="form-control"
                :class="{ 'is-invalid': errors.deskripsi }"
                rows="5"
                placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                required
              ></textarea>
              <div v-if="errors.deskripsi" class="invalid-feedback">{{ errors.deskripsi[0] }}</div>
            </div>

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
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Informasi Pelapor -->
      <div class="form-section">
        <h2>Informasi Pelapor</h2>
        <div class="form-row single-column">
          <div class="form-column">
            <div class="form-group">
              <label for="nama_pelapor">Nama Pelapor</label>
              <input
                type="text"
                id="nama_pelapor"
                v-model="formData.nama_pelapor"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
              <label for="nim_pelapor">NIM Pelapor</label>
              <input
                type="text"
                id="nim_pelapor"
                v-model="formData.nim_pelapor"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
              <label for="nomor_telepon">Nomor HP Pelapor</label>
              <input
                type="text"
                id="nomor_telepon"
                v-model="formData.nomor_telepon"
                class="form-control"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Informasi Saksi -->
      <div class="form-section">
        <h2>Informasi Saksi</h2>
        <div class="form-row single-column">
          <div class="form-column">
            <div class="form-group">
              <label for="saksi_nama">Nama Lengkap Saksi <span class="required">*</span></label>
              <input
                type="text"
                id="saksi_nama"
                v-model="formData.saksi_nama"
                class="form-control"
                :class="{ 'is-invalid': errors.saksi_nama }"
                required
              />
              <div v-if="errors.saksi_nama" class="invalid-feedback">{{ errors.saksi_nama[0] }}</div>
            </div>

            <div class="form-group">
              <label for="saksi_email">Email Saksi <span class="required">*</span></label>
              <input
                type="email"
                id="saksi_email"
                v-model="formData.saksi_email"
                class="form-control"
                :class="{ 'is-invalid': errors.saksi_email }"
                required
              />
              <div v-if="errors.saksi_email" class="invalid-feedback">{{ errors.saksi_email[0] }}</div>
            </div>

            <div class="form-group">
              <label for="saksi_nomor_telepon">Nomor Telepon Saksi <span class="required">*</span></label>
              <input
                type="tel"
                id="saksi_nomor_telepon"
                v-model="formData.saksi_nomor_telepon"
                class="form-control"
                :class="{ 'is-invalid': errors.saksi_nomor_telepon }"
                required
              />
              <div v-if="errors.saksi_nomor_telepon" class="invalid-feedback">{{ errors.saksi_nomor_telepon[0] }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Pernyataan -->
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
  </div>
</template>

<script>
import axios from 'axios';
import { decryptData } from '../../../../../services/encrypt';
import VueCookies from "vue-cookies";
import Swal from 'sweetalert2';

export default {
name: 'AddKS',
data() {
  return {
    formData: {
      judul: '',
      category_id: '',
      deskripsi: '',
      tanggal_kejadian: '',
      image_path: null,
      nama_pelapor: '',
      nim_pelapor: '',
      nomor_telepon: '',
      saksi_nama: '',
      saksi_email: '',
      saksi_nomor_telepon: '',
      agreement: false
    },
    categories: [],
    errors: {},
    loading: false
  };
},
computed: {
  kekerasanCategories() {
    // Filter for categories that start with "Kekerasan"
    return this.categories.filter(category => 
      category.nama.startsWith('Kekerasan')
    );
  }
},
created() {
  this.loadUserData();
},
mounted() {
  this.fetchCategories();
},
methods: {
  loadUserData() {
    try {
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        this.formData.nama_pelapor = userData.name || '';
        this.formData.nim_pelapor = userData.nim || userData.nik || '';
        this.formData.nomor_telepon = userData.no_telp || '';
        console.log("User data loaded successfully");
      } else {
        console.log("No user data found in cookies, using default data");
        this.setDefaultUserData();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      this.setDefaultUserData();
    }
  },
  setDefaultUserData() {
    // Default user data if cookie is not available
    this.formData.nama_pelapor = 'Miftahul';
    this.formData.nim_pelapor = 'miftahul01';
    this.formData.nomor_telepon = '';
  },
  fetchCategories() {
    axios.get('http://localhost:8000/api/category')
      .then(response => {
        if (Array.isArray(response.data)) {
          this.categories = response.data;
        } else if (response.data && response.data.data) {
          this.categories = response.data.data;
        } else {
          console.error('Unexpected API response structure:', response.data);
          this.categories = [];
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat kategori laporan.'
        });
      });
  },
  handleFileUpload(event) {
    this.formData.image_path = event.target.files[0];
  },
  goBack() {
    this.$router.go(-1);
  },
  submitForm() {
    if (!this.formData.agreement) {
      this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
      return;
    }
    
    this.loading = true;
    this.errors = {};
    
    const formData = new FormData();
    formData.append('judul', this.formData.judul);
    formData.append('category_id', this.formData.category_id);
    formData.append('deskripsi', this.formData.deskripsi);
    formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
    formData.append('nama_pelapor', this.formData.nama_pelapor);
    formData.append('nim_pelapor', this.formData.nim_pelapor);
    formData.append('nomor_telepon', this.formData.nomor_telepon);
    
    // Saksi fields
    formData.append('saksi_nama', this.formData.saksi_nama);
    formData.append('saksi_email', this.formData.saksi_email);
    formData.append('saksi_nomor_telepon', this.formData.saksi_nomor_telepon);
    
    if (this.formData.image_path) {
      formData.append('image_path', this.formData.image_path);
    }
    
    // Agreement field
    formData.append('agreement', this.formData.agreement);

    axios.post('http://localhost:8000/api/laporan_kekerasan/add_laporan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        this.loading = false;
        Swal.fire({
          title: 'Berhasil!',
          text: 'Laporan berhasil ditambahkan.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.$router.push('/kalab/pelaporankekerasanseksual');
        });
        this.resetForm();
      })
      .catch(error => {
        this.loading = false;
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Terjadi kesalahan saat mengirim laporan.'
          });
        }
      });
  },
  resetForm() {
    this.formData = {
      judul: '',
      category_id: '',
      deskripsi: '',
      tanggal_kejadian: '',
      image_path: null,
      nama_pelapor: this.formData.nama_pelapor,
      nim_pelapor: this.formData.nim_pelapor,
      nomor_telepon: this.formData.nomor_telepon,
      saksi_nama: '',
      saksi_email: '',
      saksi_nomor_telepon: '',
      agreement: false
    };
    this.errors = {};
  }
}
};
</script>

<style scoped>
.add-ks-container {
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

.ks-form {
display: flex;
flex-direction: column;
gap: 1.5rem;
}

.form-row {
display: flex;
gap: 2rem;
}

.form-row.single-column {
max-width: 600px;
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

.form-control:disabled {
background-color: #e9ecef;
opacity: 1;
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

.btn-primary {
background-color: #007bff;
color: white;
}

.btn-primary:hover {
background-color: #0069d9;
}

.btn-secondary {
background-color: #6c757d;
color: white;
}

.btn-secondary:hover {
background-color: #5a6268;
}

.btn:disabled {
opacity: 0.65;
cursor: not-allowed;
}

/* Responsive layout */
@media (max-width: 768px) {
.form-row {
  flex-direction: column;
  gap: 1rem;
}
}
</style>