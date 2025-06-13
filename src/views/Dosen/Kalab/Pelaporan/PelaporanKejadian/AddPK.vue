<template>
  <div class="add-pk-container">
    <div class="form-header">
      <h1>Tambah Laporan Kejadian</h1>
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
                  v-for="category in filteredCategories" 
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
              <h2>Bukti Pelanggaran <span class="required">*</span></h2>
              <div v-if="errors.bukti_pelanggaran" class="alert alert-danger">
                {{ typeof errors.bukti_pelanggaran === 'string' ? errors.bukti_pelanggaran : 'Harap pilih minimal satu alat bukti' }}
              </div>
              
              <div class="checkbox-group">
                <div class="checkbox-option" v-for="(option, index) in buktiOptions" :key="index">
                  <input 
                    type="checkbox" 
                    :id="`bukti-${index}`"
                    :value="option.value" 
                    v-model="formData.bukti_pelanggaran"
                    class="checkbox-input"
                  />
                  <label :for="`bukti-${index}`" class="checkbox-label">
                    {{ option.label }}
                    <span v-if="option.description" class="option-desc">{{ option.description }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column - Detail Laporan lanjutan -->
          <div class="form-column">
            <!-- Tambahkan field Lampiran Link -->
            <div class="form-group">
              <label for="lampiran_link">Lampiran Link</label>
              <input
                type="text"
                id="lampiran_link"
                v-model="formData.lampiran_link"
                class="form-control"
                :class="{ 'is-invalid': errors.lampiran_link }"
                placeholder="http://example.com"
              />
              <div v-if="errors.lampiran_link" class="invalid-feedback">{{ errors.lampiran_link[0] }}</div>
              <small class="text-muted">Opsional: Masukkan URL yang berkaitan dengan laporan</small>
            </div>

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
        <div class="form-row">
          <!-- Left column for personal info -->
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
              <label for="ni_pelapor">NIM/NIK Pelapor</label>
              <input
                type="text"
                id="ni_pelapor"
                v-model="formData.ni_pelapor"
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
            
            <div class="form-group">
              <label for="profesi">Profesi <span class="required">*</span></label>
              <select
                id="profesi"
                v-model="formData.profesi"
                class="form-control"
                :class="{ 'is-invalid': errors.profesi }"
                required
              >
                <option value="" disabled selected>Pilih Profesi</option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Dosen">Dosen</option>
                <option value="Staff">Staff</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <div v-if="errors.profesi" class="invalid-feedback">{{ errors.profesi[0] }}</div>
            </div>
          </div>
          
          <!-- Right column for new fields -->
          <div class="form-column">
            <!-- Replace dropdown with radio buttons for jenis_kelamin -->
            <div class="form-group">
              <label>Jenis Kelamin <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors.jenis_kelamin }">
                <div class="radio-option">
                  <input
                    type="radio"
                    id="laki-laki"
                    v-model="formData.jenis_kelamin"
                    value="laki-laki"
                    required
                  />
                  <label for="laki-laki">Laki-laki</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="perempuan"
                    v-model="formData.jenis_kelamin"
                    value="perempuan"
                  />
                  <label for="perempuan">Perempuan</label>
                </div>
              </div>
              <div v-if="errors.jenis_kelamin" class="invalid-feedback">{{ errors.jenis_kelamin[0] }}</div>
            </div>

            <!-- Replace dropdown with radio buttons for umur_pelapor -->
            <div class="form-group">
              <label>Rentang Umur <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors.umur_pelapor }">
                <div class="radio-option">
                  <input
                    type="radio"
                    id="below20"
                    v-model="formData.umur_pelapor"
                    value="<20"
                    required
                  />
                  <label for="below20">Kurang dari 20 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="20to40"
                    v-model="formData.umur_pelapor"
                    value="20-40"
                  />
                  <label for="20to40">20 - 40 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="above40"
                    v-model="formData.umur_pelapor"
                    value="40<"
                  />
                  <label for="above40">Lebih dari 40 tahun</label>
                </div>
              </div>
              <div v-if="errors.umur_pelapor" class="invalid-feedback">{{ errors.umur_pelapor[0] }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Identitas Terlapor/Terduga -->
      <div class="form-section">
        <h2>Identitas Terlapor/Terduga</h2> <!-- Hapus span required -->
        <div v-if="errors.terlapor" class="alert alert-danger">
          {{ typeof errors.terlapor === 'string' ? errors.terlapor : 'Harap isi data terlapor dengan benar' }}
        </div>
        <p class="form-text text-muted">Opsional: Anda dapat mengosongkan semua field terlapor jika tidak ingin mengisikan.</p>
        
        <div v-for="(item, index) in formData.terlapor" :key="`terlapor-${index}`" class="terlapor-card">
          <div class="item-header">
            <h3>Terlapor #{{ index + 1 }}</h3>
            <button 
              type="button" 
              class="btn-remove" 
              @click="removeTerlapor(index)" 
              :disabled="formData.terlapor.length <= 1"
            >
              <i class="fas fa-times"></i> Hapus
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label :for="`terlapor-nama-${index}`">Nama Lengkap</label> <!-- Hapus span required -->
                <input
                  type="text"
                  :id="`terlapor-nama-${index}`"
                  v-model="item.nama_lengkap"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`terlapor.${index}.nama_lengkap`] }"
                />
                <div v-if="errors[`terlapor.${index}.nama_lengkap`]" class="invalid-feedback">
                  {{ errors[`terlapor.${index}.nama_lengkap`][0] }}
                </div>
              </div>
              
              <div class="form-group">
                <label :for="`terlapor-email-${index}`">Email</label>
                <input
                  type="email"
                  :id="`terlapor-email-${index}`"
                  v-model="item.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`terlapor.${index}.email`] }"
                />
                <div v-if="errors[`terlapor.${index}.email`]" class="invalid-feedback">
                  {{ errors[`terlapor.${index}.email`][0] }}
                </div>
              </div>
              
              <div class="form-group">
                <label :for="`terlapor-telepon-${index}`">Nomor Telepon</label>
                <input
                  type="text"
                  :id="`terlapor-telepon-${index}`"
                  v-model="item.nomor_telepon"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`terlapor.${index}.nomor_telepon`] }"
                />
                <div v-if="errors[`terlapor.${index}.nomor_telepon`]" class="invalid-feedback">
                  {{ errors[`terlapor.${index}.nomor_telepon`][0] }}
                </div>
              </div>
              
              <!-- New Gender Radio Button Group for Terlapor -->
              <div class="form-group">
                <label>Jenis Kelamin</label> <!-- Hapus span required -->
                <div class="radio-group" :class="{ 'is-invalid': errors[`terlapor.${index}.jenis_kelamin`] }">
                  <div class="radio-option">
                    <input
                      type="radio"
                      :id="`terlapor-laki-${index}`"
                      v-model="item.jenis_kelamin"
                      value="laki-laki"
                    />
                    <label :for="`terlapor-laki-${index}`">Laki-laki</label>
                  </div>
                  <div class="radio-option">
                    <input
                      type="radio"
                      :id="`terlapor-perempuan-${index}`"
                      v-model="item.jenis_kelamin"
                      value="perempuan"
                    />
                    <label :for="`terlapor-perempuan-${index}`">Perempuan</label>
                  </div>
                </div>
                <div v-if="errors[`terlapor.${index}.jenis_kelamin`]" class="invalid-feedback d-block">
                  {{ errors[`terlapor.${index}.jenis_kelamin`][0] }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Rentang Umur</label> <!-- Hapus span required -->
              <div class="radio-group" :class="{ 'is-invalid': errors[`terlapor.${index}.umur_terlapor`] }">
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-below20-${index}`"
                    v-model="item.umur_terlapor"
                    value="<20"
                  />
                  <label :for="`terlapor-below20-${index}`">Kurang dari 20 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-20to40-${index}`"
                    v-model="item.umur_terlapor"
                    value="20-40"
                  />
                  <label :for="`terlapor-20to40-${index}`">20 - 40 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    :id="`terlapor-above40-${index}`"
                    v-model="item.umur_terlapor"
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
                <label :for="`terlapor-status-${index}`">Status Warga UNS</label> <!-- Hapus span required -->
                <select
                  :id="`terlapor-status-${index}`"
                  v-model="item.status_warga"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`terlapor.${index}.status_warga`] }"
                >
                  <option value="" disabled selected>Pilih Status</option>
                  <option value="dosen">Dosen</option>
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="staff">Staff</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <div v-if="errors[`terlapor.${index}.status_warga`]" class="invalid-feedback">
                  {{ errors[`terlapor.${index}.status_warga`][0] }}
                </div>
              </div>
              
              <div class="form-group">
                <label :for="`terlapor-unit-${index}`">Unit Kerja</label> <!-- Hapus span required -->
                <select
                  :id="`terlapor-unit-${index}`"
                  v-model="item.unit_kerja"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`terlapor.${index}.unit_kerja`] }"
                >
                  <option value="" disabled selected>Pilih Unit Kerja</option>
                  <option value="Fakultas Teknik">Fakultas Teknik</option>
                  <option value="Fakultas MIPA">Fakultas MIPA</option>
                  <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                  <option value="Fakultas Hukum">Fakultas Hukum</option>
                  <option value="Fakultas Kedokteran">Fakultas Kedokteran</option>
                  <option value="Fakultas Pertanian">Fakultas Pertanian</option>
                  <option value="Fakultas KIP">Fakultas KIP</option>
                  <option value="Fakultas Ilmu Sosial dan Politik">Fakultas Ilmu Sosial dan Politik</option>
                  <option value="Fakultas Ilmu Budaya">Fakultas Ilmu Budaya</option>
                  <option value="Fakultas Seni Rupa dan Desain">Fakultas Seni Rupa dan Desain</option>
                </select>
                <div v-if="errors[`terlapor.${index}.unit_kerja`]" class="invalid-feedback">
                  {{ errors[`terlapor.${index}.unit_kerja`][0] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button type="button" class="btn btn-outline-primary add-button" @click="addTerlapor">
          <i class="fas fa-plus"></i> Tambah Terlapor
        </button>
      </div>

      <!-- Section 4: Saksi -->
      <div class="form-section">
        <h2>Saksi</h2> <!-- Hapus span required -->
        <div v-if="errors.saksi" class="alert alert-danger">
          {{ typeof errors.saksi === 'string' ? errors.saksi : 'Harap isi data saksi dengan benar' }}
        </div>
        <p class="form-text text-muted">Opsional: Anda dapat mengosongkan semua field saksi jika tidak ingin mengisikan.</p>
        
        <div v-for="(item, index) in formData.saksi" :key="`saksi-${index}`" class="saksi-card">
          <div class="item-header">
            <h3>Saksi #{{ index + 1 }}</h3>
            <button 
              type="button" 
              class="btn-remove" 
              @click="removeSaksi(index)" 
              :disabled="formData.saksi.length <= 1"
            >
              <i class="fas fa-times"></i> Hapus
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label :for="`saksi-nama-${index}`">Nama Lengkap</label> <!-- Hapus span required -->
                <input
                  type="text"
                  :id="`saksi-nama-${index}`"
                  v-model="item.nama_lengkap"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`saksi.${index}.nama_lengkap`] }"
                />
                <div v-if="errors[`saksi.${index}.nama_lengkap`]" class="invalid-feedback">
                  {{ errors[`saksi.${index}.nama_lengkap`][0] }}
                </div>
              </div>
            </div>
            
            <div class="form-column">
              <div class="form-group">
                <label :for="`saksi-email-${index}`">Email</label>
                <input
                  type="email"
                  :id="`saksi-email-${index}`"
                  v-model="item.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`saksi.${index}.email`] }"
                />
                <div v-if="errors[`saksi.${index}.email`]" class="invalid-feedback">
                  {{ errors[`saksi.${index}.email`][0] }}
                </div>
              </div>
              
              <div class="form-group">
                <label :for="`saksi-telepon-${index}`">Nomor Telepon</label>
                <input
                  type="text"
                  :id="`saksi-telepon-${index}`"
                  v-model="item.nomor_telepon"
                  class="form-control"
                  :class="{ 'is-invalid': errors[`saksi.${index}.nomor_telepon`] }"
                />
                <div v-if="errors[`saksi.${index}.nomor_telepon`]" class="invalid-feedback">
                  {{ errors[`saksi.${index}.nomor_telepon`][0] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button type="button" class="btn btn-outline-primary add-button" @click="addSaksi">
          <i class="fas fa-plus"></i> Tambah Saksi
        </button>
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
import { decryptData } from '../../../../../services/encrypt';
import VueCookies from "vue-cookies";
import Swal from 'sweetalert2';

export default {
  name: 'AddPK',
  data() {
    return {
      formData: {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: [],
        nama_pelapor: '',
        ni_pelapor: '',
        nomor_telepon: '',
        lampiran_link: '',
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: '',
        bukti_pelanggaran: [], // Array to store selected options
        terlapor: [
          // Initialize with one empty terlapor record
          {
            nama_lengkap: '',
            email: '',
            nomor_telepon: '',
            status_warga: '',
            unit_kerja: '',
            jenis_kelamin: '',
            umur_terlapor: ''
          }
        ],
        saksi: [
          // Initialize with one empty saksi record
          {
            nama_lengkap: '',
            email: '',
            nomor_telepon: ''
          }
        ],
        agreement: false
      },
      // Define available options for bukti_pelanggaran
      buktiOptions: [
        { value: 'bukti_transfer', label: 'Bukti transfer, cek, bukti penyetoran, dan rekening koran bank' },
        { value: 'dokumen_rekaman', label: 'Dokumen dan/atau rekaman' },
        { value: 'foto_dokumentasi', label: 'Foto dokumentasi' },
        { value: 'surat_disposisi', label: 'Surat disposisi perintah' },
        { value: 'identitas_sumber', label: 'Identitas sumber informasi' },
        { value: 'lainnya', label: 'Lainnya' },
      ],
      imagePreviews: [],
      categories: [],
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
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        !category.nama.startsWith('Kekerasan')
      );
    }
  },
  methods: {
    loadUserData() {
      try {
        // Set current date and time dynamically
        const now = new Date();
        this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:MM:SS
        this.currentUser = 'miftahul01';
        
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          
          // Set basic user data
          this.formData.nama_pelapor = userData.name || '';
          this.formData.ni_pelapor = userData.nim || userData.nik || '';
          this.formData.nomor_telepon = userData.no_telp || '';
          
          // Check email domain to determine role
          const email = userData.email || (userData.dosen ? userData.dosen.email : '');
          
          // If email exists and does NOT contain "@student", set role as "Dosen"
          if (email && !email.includes('@student')) {
            this.formData.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on non-student email domain');
          }
          // Check for other indicators of lecturer role
          else if (userData.jabatan_sekarang && userData.jabatan_sekarang.name === 'Dosen') {
            this.formData.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on user role');
          }
          else if (userData.dosen) {
            this.formData.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on dosen object');
          }
          // Check punya_jabatan array for active Dosen role
          else if (userData.punya_jabatan && Array.isArray(userData.punya_jabatan)) {
            const dosenRole = userData.punya_jabatan.find(jabatan => 
              jabatan.name === 'Dosen' && jabatan.is_active === 1
            );
            
            if (dosenRole) {
              this.formData.profesi = 'Dosen';
              console.log('Auto-selected profession: Dosen based on active role in punya_jabatan');
            }
          }
          
          console.log('User data loaded with profesi:', this.formData.profesi);
          console.log('Current date and time:', this.currentDateTime);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    fetchCategories() {
      axios.get('https://v3422040.mhs.d3tiuns.com/api/category')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
        });
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
    // Methods for terlapor management
    addTerlapor() {
      this.formData.terlapor.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        unit_kerja: '',
        jenis_kelamin: '',
        umur_terlapor: ''
      });
    },
    removeTerlapor(index) {
      // Ensure we always have at least one terlapor
      if (this.formData.terlapor.length > 1) {
        this.formData.terlapor.splice(index, 1);
      }
    },
    // Methods for saksi management
    addSaksi() {
      this.formData.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },
    removeSaksi(index) {
      // Ensure we always have at least one saksi
      if (this.formData.saksi.length > 1) {
        this.formData.saksi.splice(index, 1);
      }
    },
    validateTerlapor() {
      // Jika terlapor array kosong atau tidak ada, dianggap valid
      if (!this.formData.terlapor || this.formData.terlapor.length === 0) {
        return true;
      }
      
      // Jika ada entri terlapor, validasi hanya jika ada data yang diisi
      const invalidEntries = this.formData.terlapor.filter(item => {
        // Jika setidaknya satu field diisi, maka semua field wajib diisi
        const hasAnyData = item.nama_lengkap || item.status_warga || item.unit_kerja || item.jenis_kelamin || item.umur_terlapor;
        
        if (hasAnyData) {
          // Jika ada data yang diisi, semua field required harus diisi
          return !item.nama_lengkap || !item.status_warga || !item.unit_kerja || !item.jenis_kelamin || !item.umur_terlapor;
        }
        return false; // Jika tidak ada data yang diisi sama sekali, itu valid
      });
      
      return invalidEntries.length === 0;
    },
    validateSaksi() {
      // Jika saksi array kosong atau tidak ada, dianggap valid
      if (!this.formData.saksi || this.formData.saksi.length === 0) {
        return true;
      }
      
      // Jika ada entri saksi, validasi hanya jika ada data yang diisi
      const invalidEntries = this.formData.saksi.filter(item => {
        // Jika setidaknya satu field diisi, nama harus diisi
        const hasAnyData = item.nama_lengkap || item.email || item.nomor_telepon;
        
        if (hasAnyData) {
          return !item.nama_lengkap; // Nama tetap wajib jika ada data lain yang diisi
        }
        return false; // Jika tidak ada data yang diisi sama sekali, itu valid
      });
      
      return invalidEntries.length === 0;
    },
    validateForm() {
      let isValid = true;
      this.errors = {};

      if (!this.formData.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
        isValid = false;
      }

      // Validate bukti_pelanggaran (at least one must be selected)
      if (!this.formData.bukti_pelanggaran || this.formData.bukti_pelanggaran.length === 0) {
        this.errors.bukti_pelanggaran = ['Harap pilih minimal satu alat bukti'];
        isValid = false;
      }
      
      // Terlapor dan saksi tidak wajib, tapi jika diisi harus valid
      if (!this.validateTerlapor()) {
        this.errors.terlapor = 'Jika mengisi data terlapor, harap lengkapi semua field yang diperlukan';
        isValid = false;
      }
      
      if (!this.validateSaksi()) {
        this.errors.saksi = 'Jika mengisi data saksi, harap lengkapi setidaknya nama saksi';
        isValid = false;
      }

      return isValid;
    },

    submitForm() {
      // Validate form first
      if (!this.validateForm()) {
        // If errors with bukti_pelanggaran, scroll there
        if (this.errors.bukti_pelanggaran) {
          this.$nextTick(() => {
            document.querySelector('.checkbox-group').scrollIntoView({ behavior: 'smooth' });
          });
          return;
        }

        // If validation fails, scroll to the appropriate section with error
        if (this.errors.terlapor) {
          this.$nextTick(() => {
            document.querySelector('.terlapor-card').scrollIntoView({ behavior: 'smooth' });
          });
          return;
        }
        
        if (this.errors.saksi) {
          this.$nextTick(() => {
            document.querySelector('.saksi-card').scrollIntoView({ behavior: 'smooth' });
          });
          return;
        }
        
        return;
      }
      
      this.loading = true;
      
      const formData = new FormData();
      
      // Add basic fields
      formData.append('judul', this.formData.judul);
      formData.append('category_id', this.formData.category_id);
      formData.append('deskripsi', this.formData.deskripsi);
      formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
      formData.append('agreement', this.formData.agreement ? 1 : 0);
      formData.append('profesi', this.formData.profesi);
      formData.append('jenis_kelamin', this.formData.jenis_kelamin);
      formData.append('umur_pelapor', this.formData.umur_pelapor);
      
      // Add bukti_pelanggaran to the form data as individual items
      this.formData.bukti_pelanggaran.forEach((bukti, index) => {
        formData.append(`bukti_pelanggaran[${index}]`, bukti);
      });
      
      // Optional link
      if (this.formData.lampiran_link) {
        formData.append('lampiran_link', this.formData.lampiran_link);
      }
      
      // CRITICAL FIX: Handle terlapor ONLY if there are valid entries
      const validTerlapor = this.formData.terlapor.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon || item.status_warga || 
        item.unit_kerja || item.jenis_kelamin || item.umur_terlapor
      );
      
      if (validTerlapor.length > 0) {
        validTerlapor.forEach((item, index) => {
          // Only add fields that have values
          if (item.nama_lengkap) formData.append(`terlapor[${index}][nama_lengkap]`, item.nama_lengkap);
          if (item.email) formData.append(`terlapor[${index}][email]`, item.email);
          if (item.nomor_telepon) formData.append(`terlapor[${index}][nomor_telepon]`, item.nomor_telepon);
          if (item.status_warga) formData.append(`terlapor[${index}][status_warga]`, item.status_warga);
          if (item.unit_kerja) formData.append(`terlapor[${index}][unit_kerja]`, item.unit_kerja);
          if (item.jenis_kelamin) formData.append(`terlapor[${index}][jenis_kelamin]`, item.jenis_kelamin);
          if (item.umur_terlapor) formData.append(`terlapor[${index}][umur_terlapor]`, item.umur_terlapor);
        });
      }
      // IMPORTANT: Do NOT add any terlapor field if there are no valid entries
      
      // CRITICAL FIX: Handle saksi ONLY if there are valid entries
      const validSaksi = this.formData.saksi.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon
      );
      
      if (validSaksi.length > 0) {
        validSaksi.forEach((item, index) => {
          // Only add fields that have values
          if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
          if (item.email) formData.append(`saksi[${index}][email]`, item.email);
          if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
        });
      }
      // IMPORTANT: Do NOT add any saksi field if there are no valid entries
      
      // Fix the file handling in submitForm method
    if (this.formData.image_path && this.formData.image_path.length > 0) {
      // Try the format the server expects based on the error
      // Option 1: Using standard array notation
      this.formData.image_path.forEach((file, index) => {
        formData.append('image_path[]', file);
        console.log(`Appending image as array: image_path[]`, file.name, file.type, file.size);
      });
      
      // Option 2: Also try this format which might be what the server expects
      formData.append('image_path_count', this.formData.image_path.length.toString());
    }

    // Debug what is being sent
    console.log("Submitting form data:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Use XMLHttpRequest instead of axios for better upload control
    this.uploadWithXHR(formData)
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
          // Redirect or reset form as needed
          this.$router.push('/pelaporan/kejadian');
        });
      })
      .catch(error => {
        this.loading = false;
        console.error('Upload error:', error);
        
        // Handle authentication errors
        if (error.status === 401) {
          Swal.fire({
            title: 'Sesi Berakhir',
            text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.$router.push('/mahasiswa/login');
          });
        } else {
          // Handle other errors
          let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
          if (error.response && typeof error.response === 'string') {
            try {
              const responseData = JSON.parse(error.response);
              if (responseData.message) {
                errorMessage = responseData.message;
              } else if (responseData.error) {
                errorMessage = responseData.error;
              }
            } catch (e) {
              console.error('Error parsing response:', e);
            }
          }
          
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    },

    // Add this method to your component
    // Updated uploadWithXHR method
    uploadWithXHR(formData) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Make sure we're using the correct endpoint
        xhr.open('POST', 'https://v3422040.mhs.d3tiuns.com/api/laporan/add_laporan', true);
        
        // Get token from component data or from cookies
        const authToken = this.token || this.$cookies.get('auth_token');
        if (authToken) {
          xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }
        
        // Don't set Content-Type header - let the browser set it with the proper boundary
        // This is critical for multipart/form-data uploads
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            try {
              resolve(JSON.parse(xhr.response));
            } catch (e) {
              resolve(xhr.response);
            }
          } else {
            // More detailed error information
            console.error("Server error response:", xhr.response);
            reject({
              status: this.status,
              statusText: xhr.statusText,
              response: xhr.response
            });
          }
        };
        
        xhr.onerror = function() {
          console.error("XHR network error");
          reject({
            status: this.status,
            statusText: xhr.statusText,
            response: 'Network error occurred'
          });
        };
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
          }
        };
        
        // Before sending, log what we're about to send
        console.log("Preparing to send form data with these files:");
        if (this.formData.image_path) {
          this.formData.image_path.forEach((file, i) => {
            console.log(`File ${i}: ${file.name}, ${file.type}, ${file.size} bytes`);
          });
        }
        
        xhr.send(formData);
      });
    },

    resetForm() {
      this.formData = {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: [],
        nama_pelapor: this.formData.nama_pelapor,
        ni_pelapor: this.formData.ni_pelapor,
        nomor_telepon: this.formData.nomor_telepon,
        lampiran_link: '',
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: '',
        bukti_pelanggaran: [], // Reset bukti_pelanggaran
        terlapor: [
          {
            nama_lengkap: '',
            email: '',
            nomor_telepon: '',
            status_warga: '',
            unit_kerja: '',
            jenis_kelamin: '',
            umur_terlapor: ''
          }
        ],
        saksi: [
          {
            nama_lengkap: '',
            email: '',
            nomor_telepon: ''
          }
        ],
        agreement: false
      };
      this.imagePreviews = [];
      this.errors = {};
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
        this.$router.push('/kalab/pelaporankejadiankalab');
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

/* Radio Button Styling */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
}

.radio-option input[type="radio"] {
  margin-right: 0.5rem;
}

.radio-option label {
  font-weight: normal;
  margin-bottom: 0;
}

/* Checkbox Group Styling */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
}

.checkbox-input {
  margin-top: 0.25rem;
  margin-right: 0.75rem;
  cursor: pointer;
}

.checkbox-label {
  font-weight: 500;
  cursor: pointer;
}

.option-desc {
  font-size: 0.9em;
  color: #6b7280;
  display: inline-block;
  font-weight: normal;
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

/* Alert style */
.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
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

/* Styles for Terlapor and Saksi cards */
.terlapor-card, .saksi-card {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-header h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.btn-remove {
  background-color: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-remove:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #6c757d;
  color: #6c757d;
}

.add-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed #007bff;
  background-color: #f8f9fa;
  color: #007bff;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.add-button:hover {
  background-color: #e6f2ff;
}

.btn-outline-primary {
  background-color: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

/* Responsive layout */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>