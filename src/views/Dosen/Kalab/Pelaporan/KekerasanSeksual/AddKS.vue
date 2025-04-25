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
                  multiple
                  required
                />
                <small class="text-muted">Anda dapat memilih beberapa file foto</small>
                <div v-if="errors['image_path.0']" class="invalid-feedback">{{ errors['image_path.0'][0] }}</div>
                <div v-if="errors.image_path" class="invalid-feedback">{{ errors.image_path[0] }}</div>
              </div>
              <div v-if="selectedFiles.length > 0" class="selected-files mt-2">
                <p class="mb-1">File yang dipilih:</p>
                <ul>
                  <li v-for="(file, index) in selectedFiles" :key="index">
                    {{ file.name }} ({{ (file.size/1024).toFixed(2) }} KB)
                  </li>
                </ul>
              </div>
            </div>

            <div class="form-group">
              <label for="lampiran_link">Link Lampiran Tambahan</label>
              <input
                type="url"
                id="lampiran_link"
                v-model="formData.lampiran_link"
                class="form-control"
                :class="{ 'is-invalid': errors.lampiran_link }"
                placeholder="https://drive.google.com/file/..."
              />
              <div v-if="errors.lampiran_link" class="invalid-feedback">{{ errors.lampiran_link[0] }}</div>
              <small class="text-muted">Masukkan URL Google Drive, Dropbox, atau layanan cloud lainnya</small>
            </div>
            
            <!-- Bukti Pelanggaran Checkboxes Section -->
            <div class="form-group bukti-pelanggaran-container">
              <label>Bukti Pelanggaran <span class="required">*</span></label>
              <div class="bukti-checkbox-group" :class="{ 'is-invalid': errors.bukti_pelanggaran }">
                <div class="form-check bukti-check" v-for="(bukti, index) in buktiOptions" :key="index">
                  <input
                    type="checkbox"
                    :id="'bukti_' + index"
                    v-model="selectedBukti"
                    :value="bukti"
                    class="form-check-input"
                    @change="updateBuktiPelanggaran"
                  />
                  <label :for="'bukti_' + index" class="form-check-label">{{ bukti }}</label>
                </div>
                
                <!-- Lainnya option with text input -->
                <div class="form-check bukti-check">
                  <input
                    type="checkbox"
                    id="bukti_lainnya_check"
                    v-model="showLainnyaInput"
                    class="form-check-input"
                    @change="updateBuktiPelanggaran"
                  />
                  <label for="bukti_lainnya_check" class="form-check-label">Lainnya</label>
                  
                  <div v-if="showLainnyaInput" class="lainnya-input-container">
                    <input
                      type="text"
                      v-model="buktiLainnya"
                      class="form-control"
                      placeholder="Sebutkan bukti lainnya"
                      @input="updateBuktiPelanggaran"
                    />
                  </div>
                </div>
              </div>
              <div v-if="errors.bukti_pelanggaran" class="invalid-feedback">{{ errors.bukti_pelanggaran[0] }}</div>
              <div v-if="selectedBukti.length === 0 && !showLainnyaInput && showBuktiWarning" class="invalid-feedback d-block">
                Pilih setidaknya satu bukti pelanggaran
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

      <!-- Section 3: Informasi Terduga -->
      <div class="form-section">
        <h2>Informasi Terduga/Terlapor</h2>
        <div v-for="(terduga, index) in formData.terlapor" :key="index" class="terduga-container">
          <h3>Terduga {{ index + 1 }}</h3>
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label :for="'terduga_nama_' + index">Nama Lengkap <span class="required">*</span></label>
                <input
                  :id="'terduga_nama_' + index"
                  type="text"
                  v-model="terduga.nama_lengkap"
                  class="form-control"
                  :class="{ 'is-invalid': errors['terlapor.' + index + '.nama_lengkap'] }"
                  required
                />
                <div v-if="errors['terlapor.' + index + '.nama_lengkap']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.nama_lengkap'][0] }}
                </div>
              </div>

              <div class="form-group">
                <label :for="'terduga_email_' + index">Email</label>
                <input
                  :id="'terduga_email_' + index"
                  type="email"
                  v-model="terduga.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors['terlapor.' + index + '.email'] }"
                />
                <div v-if="errors['terlapor.' + index + '.email']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.email'][0] }}
                </div>
              </div>

              <div class="form-group">
                <label :for="'terduga_nomor_telepon_' + index">Nomor Telepon</label>
                <input
                  :id="'terduga_nomor_telepon_' + index"
                  type="tel"
                  v-model="terduga.nomor_telepon"
                  class="form-control"
                  :class="{ 'is-invalid': errors['terlapor.' + index + '.nomor_telepon'] }"
                />
                <div v-if="errors['terlapor.' + index + '.nomor_telepon']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.nomor_telepon'][0] }}
                </div>
              </div>

              <!-- Radio buttons for gender -->
              <div class="form-group">
                <label>Jenis Kelamin <span class="required">*</span></label>
                <div class="radio-group" :class="{ 'is-invalid': errors['terlapor.' + index + '.jenis_kelamin'] }">
                  <div class="form-check form-check-inline">
                    <input 
                      type="radio" 
                      :id="'gender_male_' + index" 
                      :name="'jenis_kelamin_' + index" 
                      v-model="terduga.jenis_kelamin" 
                      value="laki-laki"
                      class="form-check-input"
                      required
                    />
                    <label :for="'gender_male_' + index" class="form-check-label">Laki-laki</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input 
                      type="radio" 
                      :id="'gender_female_' + index" 
                      :name="'jenis_kelamin_' + index" 
                      v-model="terduga.jenis_kelamin" 
                      value="perempuan"
                      class="form-check-input"
                      required
                    />
                    <label :for="'gender_female_' + index" class="form-check-label">Perempuan</label>
                  </div>
                </div>
                <div v-if="errors['terlapor.' + index + '.jenis_kelamin']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.jenis_kelamin'][0] }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Rentang Umur <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors[`terlapor.${index}.umur_terlapor`] }">
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-below20-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="<20"
                    required
                  />
                  <label :for="`terlapor-below20-${index}`">Kurang dari 20 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-20to40-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="20-40"
                  />
                  <label :for="`terlapor-20to40-${index}`">20 - 40 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-above40-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="40<"
                  />
                  <label :for="`terlapor-above40-${index}`">Lebih dari 40 tahun</label>
                </div>
              </div>
              <div v-if="errors[`terlapor.${index}.umur_terlapor`]" class="invalid-feedback d-block">
                {{ errors[`terlapor.${index}.umur_terlapor`][0] }}
              </div>
            </div>

            <div class="form-column">
              <div class="form-group">
                <label :for="'terduga_status_warga_' + index">Status Warga <span class="required">*</span></label>
                <select
                  :id="'terduga_status_warga_' + index"
                  v-model="terduga.status_warga"
                  class="form-control"
                  :class="{ 'is-invalid': errors['terlapor.' + index + '.status_warga'] }"
                  required
                >
                  <option value="" disabled selected>Pilih Status</option>
                  <option value="dosen">Dosen</option>
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="staff">Staff</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <div v-if="errors['terlapor.' + index + '.status_warga']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.status_warga'][0] }}
                </div>
              </div>

              <div class="form-group">
                <label :for="'terduga_unit_kerja_' + index">Unit Kerja/Program Studi <span class="required">*</span></label>
                <select
                  :id="'terduga_unit_kerja_' + index"
                  v-model="terduga.unit_kerja"
                  class="form-control"
                  :class="{ 'is-invalid': errors['terlapor.' + index + '.unit_kerja'] }"
                  required
                >
                  <option value="" disabled selected>Pilih Unit Kerja/Prodi</option>
                  <option v-for="(unit, unitIndex) in unitKerjaOptions" :key="unitIndex" :value="unit">
                    {{ unit }}
                  </option>
                </select>
                <div v-if="errors['terlapor.' + index + '.unit_kerja']" class="invalid-feedback">
                  {{ errors['terlapor.' + index + '.unit_kerja'][0] }}
                </div>
              </div>
            </div>
          </div>
          <div class="terduga-actions">
            <button type="button" class="btn btn-danger btn-sm" @click="removeTerduga(index)">
              Hapus Terduga
            </button>
          </div>
        </div>
        <div class="terduga-add">
          <button type="button" class="btn btn-secondary btn-sm" @click="addTerduga">
            + Tambah Terduga/Terlapor
          </button>
        </div>
      </div>

      <!-- Section 4: Informasi Saksi -->
      <div class="form-section">
        <h2>Informasi Saksi</h2>
        <div v-for="(saksi, index) in formData.saksi" :key="index" class="saksi-container">
          <h3>Saksi {{ index + 1 }}</h3>
          <div class="form-row single-column">
            <div class="form-column">
              <div class="form-group">
                <label :for="'saksi_nama_' + index">Nama Lengkap Saksi <span class="required">*</span></label>
                <input
                  :id="'saksi_nama_' + index"
                  type="text"
                  v-model="saksi.nama_lengkap"
                  class="form-control"
                  :class="{ 'is-invalid': errors['saksi.' + index + '.nama_lengkap'] }"
                  required
                />
                <div v-if="errors['saksi.' + index + '.nama_lengkap']" class="invalid-feedback">
                  {{ errors['saksi.' + index + '.nama_lengkap'][0] }}
                </div>
              </div>

              <div class="form-group">
                <label :for="'saksi_email_' + index">Email Saksi <span class="required">*</span></label>
                <input
                  :id="'saksi_email_' + index"
                  type="email"
                  v-model="saksi.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors['saksi.' + index + '.email'] }"
                  required
                />
                <div v-if="errors['saksi.' + index + '.email']" class="invalid-feedback">
                  {{ errors['saksi.' + index + '.email'][0] }}
                </div>
              </div>

              <div class="form-group">
                <label :for="'saksi_nomor_telepon_' + index">Nomor Telepon Saksi <span class="required">*</span></label>
                <input
                  :id="'saksi_nomor_telepon_' + index"
                  type="tel"
                  v-model="saksi.nomor_telepon"
                  class="form-control"
                  :class="{ 'is-invalid': errors['saksi.' + index + '.nomor_telepon'] }"
                  required
                />
                <div v-if="errors['saksi.' + index + '.nomor_telepon']" class="invalid-feedback">
                  {{ errors['saksi.' + index + '.nomor_telepon'][0] }}
                </div>
              </div>
            </div>
          </div>
          <div class="saksi-actions">
            <button type="button" class="btn btn-danger btn-sm" @click="removeSaksi(index)">
              Hapus Saksi
            </button>
          </div>
        </div>
        <div class="saksi-add">
          <button type="button" class="btn btn-secondary btn-sm" @click="addSaksi">
            + Tambah Saksi
          </button>
        </div>
      </div>

      <!-- Section 5: Pernyataan -->
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
        <button type="submit" class="btn btn-danger" :disabled="loading || !formData.agreement">
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
        lampiran_link: '',
        bukti_pelanggaran: [], // Array for bukti_pelanggaran
        terlapor: [], // Array for terduga/terlapor
        saksi: [], // Array for saksi
        agreement: false
      },
      selectedFiles: [], // Array for tracking selected files
      selectedBukti: [], // Array for selected bukti checkboxes
      buktiOptions: [
        'Bukti transfer, cek, bukti penyetoran, dan rekening koran bank',
        'Dokumen dan/atau rekaman',
        'Foto dokumentasi',
        'Surat disposisi perintah',
        'Identitas sumber informasi'
      ],
      unitKerjaOptions: [
        'D3 Teknik Informatika',
        'D4 Teknik Informatika',
        'S1 Teknik Informatika',
        'S1 Sistem Informasi',
        'Fakultas Ilmu Komputer',
        'Fakultas Ekonomi dan Bisnis',
        'Fakultas Hukum',
        'Fakultas Teknik',
        'Rektorat',
        'LPPM',
        'UPT Perpustakaan',
        'UPT TIK',
        'Bagian Umum',
        'Bagian Keuangan',
        'Bagian Akademik',
        'Bagian Kemahasiswaan',
        'Lainnya'
      ],
      showLainnyaInput: false,
      buktiLainnya: '',
      showBuktiWarning: false,
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
    // Initialize with one empty object for terduga and saksi
    this.addTerduga();
    this.addSaksi();
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
      // Store selected files for display in UI
      this.selectedFiles = Array.from(event.target.files);
      // Update the formData.image_path for form submission
      this.formData.image_path = event.target.files;
    },
    goBack() {
      this.$router.go(-1);
    },
    // Method for updating the bukti_pelanggaran array based on selected checkboxes
    updateBuktiPelanggaran() {
      // Start with selected standard options
      let buktiArray = [...this.selectedBukti];
      
      // Add "Lainnya" if it's checked and has a value
      if (this.showLainnyaInput && this.buktiLainnya.trim()) {
        buktiArray.push('Lainnya: ' + this.buktiLainnya.trim());
      }
      
      // Update the formData
      this.formData.bukti_pelanggaran = buktiArray;
    },
    // New methods for handling terlapor
    addTerduga() {
      this.formData.terlapor.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        unit_kerja: '',
        jenis_kelamin: '',
        umur_terlapor:''
      });
    },
    removeTerduga(index) {
      this.formData.terlapor.splice(index, 1);
      if (this.formData.terlapor.length === 0) {
        this.addTerduga(); // Always keep at least one terduga field
      }
    },
    // New methods for handling saksi
    addSaksi() {
      this.formData.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },
    removeSaksi(index) {
      this.formData.saksi.splice(index, 1);
      if (this.formData.saksi.length === 0) {
        this.addSaksi(); // Always keep at least one saksi field
      }
    },
    submitForm() {
      // Reset warnings
      this.showBuktiWarning = false;
      
      // Validate agreement
      if (!this.formData.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
        return;
      }
      
      // Update bukti_pelanggaran array before submission
      this.updateBuktiPelanggaran();
      
      // Validate bukti_pelanggaran
      if (this.formData.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
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
      
      // Add lampiran_link
      if (this.formData.lampiran_link) {
        formData.append('lampiran_link', this.formData.lampiran_link);
      }
      
      // Add bukti_pelanggaran as array
      if (this.formData.bukti_pelanggaran && this.formData.bukti_pelanggaran.length > 0) {
        for (let i = 0; i < this.formData.bukti_pelanggaran.length; i++) {
          formData.append('bukti_pelanggaran[]', this.formData.bukti_pelanggaran[i]);
        }
      }
      
      // Add terlapor with proper array format for Laravel
      const terlaporFiltered = this.formData.terlapor.filter(t => t.nama_lengkap.trim() !== '');
      if (terlaporFiltered.length > 0) {
        terlaporFiltered.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            if (item[key]) { // Only append if value exists
              formData.append(`terlapor[${index}][${key}]`, item[key]);
            }
          });
        });
      }
      
      // Add saksi with proper array format for Laravel
      const saksiFiltered = this.formData.saksi.filter(s => s.nama_lengkap.trim() !== '');
      if (saksiFiltered.length > 0) {
        saksiFiltered.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            if (item[key]) { // Only append if value exists
              formData.append(`saksi[${index}][${key}]`, item[key]);
            }
          });
        });
      }
      
      // Append multiple files if they exist
      if (this.formData.image_path && this.formData.image_path.length > 0) {
        for (let i = 0; i < this.formData.image_path.length; i++) {
          formData.append('image_path[]', this.formData.image_path[i]);
        }
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
            console.error('Validation errors:', this.errors);
          } else {
            console.error('Error submitting form:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Terjadi kesalahan saat mengirim laporan.'
            });
          }
        });
    },
    // Special handling for bukti_pelanggaran array error
    handleBuktiPelanggaranError() {
      const formData = new FormData();
      formData.append('judul', this.formData.judul);
      formData.append('category_id', this.formData.category_id);
      formData.append('deskripsi', this.formData.deskripsi);
      formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
      formData.append('nama_pelapor', this.formData.nama_pelapor);
      formData.append('nim_pelapor', this.formData.nim_pelapor);
      formData.append('nomor_telepon', this.formData.nomor_telepon);
      
      if (this.formData.lampiran_link) {
        formData.append('lampiran_link', this.formData.lampiran_link);
      }
      
      // Try a different format for bukti_pelanggaran
      // Instead of JSON.stringify, try adding each item separately
      if (this.formData.bukti_pelanggaran && this.formData.bukti_pelanggaran.length > 0) {
        for (let i = 0; i < this.formData.bukti_pelanggaran.length; i++) {
          formData.append('bukti_pelanggaran[]', this.formData.bukti_pelanggaran[i]);
        }
      } else {
        // Ensure there's at least an empty array
        formData.append('bukti_pelanggaran[]', '');
      }
      
      formData.append('terlapor', JSON.stringify(this.formData.terlapor.filter(t => t.nama_lengkap.trim() !== '')));
      formData.append('saksi', JSON.stringify(this.formData.saksi.filter(s => s.nama_lengkap.trim() !== '')));
      
      if (this.formData.image_path && this.formData.image_path.length > 0) {
        for (let i = 0; i < this.formData.image_path.length; i++) {
          formData.append('image_path[]', this.formData.image_path[i]);
        }
      }
      
      formData.append('agreement', this.formData.agreement);

      this.loading = true;
      
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
            console.error('Validation errors after retry:', this.errors);
          } else {
            console.error('Error submitting form after retry:', error);
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
        lampiran_link: '',
        bukti_pelanggaran: [],
        terlapor: [{ 
          nama_lengkap: '',
          email: '',
          nomor_telepon: '',
          status_warga: '',
          unit_kerja: '',
          jenis_kelamin: '',
          umur_terlapor:''
        }],
        saksi: [{ 
          nama_lengkap: '',
          email: '',
          nomor_telepon: ''
        }],
        agreement: false
      };
      this.selectedFiles = [];
      this.selectedBukti = [];
      this.showLainnyaInput = false;
      this.buktiLainnya = '';
      this.showBuktiWarning = false;
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

.form-section h3 {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1rem;
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

.d-block {
  display: block;
}

.custom-file-upload {
  position: relative;
}

.text-muted {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Selected Files Display */
.selected-files {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.875rem;
}

.selected-files p {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.selected-files ul {
  margin: 0;
  padding-left: 1.25rem;
}

.selected-files li {
  margin-bottom: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

/* Radio buttons styling */
.radio-group {
  padding: 0.5rem 0;
}

.form-check-inline {
  display: inline-flex;
  align-items: center;
  margin-right: 1.5rem;
}

.form-check-input[type="radio"] {
  margin-top: 0;
}

/* Bukti Pelanggaran Checkboxes */
.bukti-pelanggaran-container {
  margin-top: 1rem;
}

.bukti-checkbox-group {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 0.5rem;
  background-color: #f8f9fa;
}

.bukti-checkbox-group.is-invalid {
  border-color: #dc3545;
}

.bukti-check {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
}

.bukti-check .form-check-input {
  margin-top: 0.25rem;
  margin-right: 0.5rem;
}

.bukti-check .form-check-label {
  font-weight: normal;
}

.lainnya-input-container {
  margin-top: 0.5rem;
  margin-left: 1.5rem;
  width: 100%;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Styles for terduga and saksi sections */
.terduga-container, .saksi-container {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #dee2e6;
}

.terduga-actions, .saksi-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.terduga-add, .saksi-add {
  margin-top: 1rem;
}

/* Responsive layout */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .lainnya-input-container {
    margin-left: 0;
    margin-top: 0.75rem;
  }
  
  .form-check-inline {
    margin-right: 1rem;
  }
}
</style>