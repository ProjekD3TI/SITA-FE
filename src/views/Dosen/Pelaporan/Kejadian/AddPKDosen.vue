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
                v-model="form.judul"
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
                v-model="form.category_id"
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

            <!-- Make sure your form has an input for image files like this -->
<div class="form-group">
  <label for="image_path">Lampiran Foto <span class="required">*</span></label>
  <input 
    type="file" 
    id="image_path" 
    class="form-control" 
    :class="{ 'is-invalid': errors.image_path || errors['image_path.0'] }"
    @change="handleFileUpload" 
    multiple 
    accept="image/jpeg,image/jpg,image/png"
  />
  <div v-if="errors.image_path" class="invalid-feedback">
    {{ Array.isArray(errors.image_path) ? errors.image_path[0] : errors.image_path }}
  </div>
  <div v-if="errors['image_path.0']" class="invalid-feedback">
    {{ errors['image_path.0'][0] }}
  </div>
  <small class="form-text text-muted">Format: JPG, PNG, maks. 2MB per file</small>
  
  <!-- Image preview -->
  <div v-if="imagePreviews.length > 0" class="image-previews mt-2">
    <div 
      v-for="(preview, index) in imagePreviews" 
      :key="index"
      class="image-preview-item"
    >
      <img :src="preview" class="img-thumbnail" style="max-height: 100px;" />
      <button 
        type="button" 
        class="btn btn-sm btn-danger" 
        @click="removeImage(index)"
        style="position: absolute; top: 0; right: 0;"
      >
        <i class="fa fa-times"></i>
      </button>
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
                    v-model="form.bukti_pelanggaran"
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
            <div class="form-group">
              <label for="lampiran_link">Lampiran Link</label>
              <input
                type="text"
                id="lampiran_link"
                v-model="form.lampiran_link"
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
                v-model="form.deskripsi"
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
                v-model="form.tanggal_kejadian"
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
                v-model="form.nama_pelapor"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
              <label for="ni_pelapor">NIM/NIK Pelapor</label>
              <input
                type="text"
                id="ni_pelapor"
                v-model="form.ni_pelapor"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
              <label for="nomor_telepon">Nomor HP Pelapor</label>
              <input
                type="text"
                id="nomor_telepon"
                v-model="form.nomor_telepon"
                class="form-control"
                disabled
              />
            </div>
            
            <div class="form-group">
              <label for="profesi">Profesi <span class="required">*</span></label>
              <select
                id="profesi"
                v-model="form.profesi"
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
            <div class="form-group">
              <label>Jenis Kelamin <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors.jenis_kelamin }">
                <div class="radio-option">
                  <input
                    type="radio"
                    id="laki-laki"
                    v-model="form.jenis_kelamin"
                    value="laki-laki"
                    required
                  />
                  <label for="laki-laki">Laki-laki</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="perempuan"
                    v-model="form.jenis_kelamin"
                    value="perempuan"
                  />
                  <label for="perempuan">Perempuan</label>
                </div>
              </div>
              <div v-if="errors.jenis_kelamin" class="invalid-feedback">{{ errors.jenis_kelamin[0] }}</div>
            </div>

            <div class="form-group">
              <label>Rentang Umur <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors.umur_pelapor }">
                <div class="radio-option">
                  <input
                    type="radio"
                    id="below20"
                    v-model="form.umur_pelapor"
                    value="<20"
                    required
                  />
                  <label for="below20">Kurang dari 20 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="20to40"
                    v-model="form.umur_pelapor"
                    value="20-40"
                  />
                  <label for="20to40">20 - 40 tahun</label>
                </div>
                <div class="radio-option">
                  <input
                    type="radio"
                    id="above40"
                    v-model="form.umur_pelapor"
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
        <h2>Identitas Terlapor/Terduga</h2>
        <div v-if="errors.terlapor" class="alert alert-danger">
          {{ typeof errors.terlapor === 'string' ? errors.terlapor : 'Harap isi data terlapor dengan benar' }}
        </div>
        <p class="form-text text-muted">Opsional: Anda dapat mengosongkan semua field terlapor jika tidak ingin mengisikan.</p>
        
        <div v-for="(item, index) in form.terlapor" :key="`terlapor-${index}`" class="terlapor-card">
          <div class="item-header">
            <h3>Terlapor #{{ index + 1 }}</h3>
            <button 
              type="button" 
              class="btn-remove" 
              @click="removeTerlapor(index)" 
              :disabled="form.terlapor.length <= 1"
            >
              <i class="fas fa-times"></i> Hapus
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label :for="`terlapor-nama-${index}`">Nama Lengkap</label>
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
              
              <div class="form-group">
                <label>Jenis Kelamin</label>
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

            <div class="form-column">
              <div class="form-group">
                <label>Rentang Umur</label>
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
              
              <div class="form-group">
                <label :for="`terlapor-status-${index}`">Status Warga UNS</label>
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
                <label :for="`terlapor-unit-${index}`">Unit Kerja</label>
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
        <h2>Saksi</h2>
        <div v-if="errors.saksi" class="alert alert-danger">
          {{ typeof errors.saksi === 'string' ? errors.saksi : 'Harap isi data saksi dengan benar' }}
        </div>
        <p class="form-text text-muted">Opsional: Anda dapat mengosongkan semua field saksi jika tidak ingin mengisikan.</p>
        
        <div v-for="(item, index) in form.saksi" :key="`saksi-${index}`" class="saksi-card">
          <div class="item-header">
            <h3>Saksi #{{ index + 1 }}</h3>
            <button 
              type="button" 
              class="btn-remove" 
              @click="removeSaksi(index)" 
              :disabled="form.saksi.length <= 1"
            >
              <i class="fas fa-times"></i> Hapus
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label :for="`saksi-nama-${index}`">Nama Lengkap</label>
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
              v-model="form.agreement"
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
        <button type="submit" class="btn btn-primary" :disabled="loading || !form.agreement">
          <span v-if="loading">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mengirim...
          </span>
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
  name: 'AddPK',
  data() {
    return {
      currentDateTime: '2025-05-17 01:12:14', // Updated current time
      currentUser: 'miftahul01',
      form: {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: [], // Array for multiple images
        nama_pelapor: '',
        nim_pelapor: '',
        nomor_telepon: '',
        lampiran_link: '',
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: '',
        bukti_pelanggaran: [], // Array for bukti pelanggaran checkboxes
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
      },
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
      isSuccess: false,
      token: null
    };
  },
  mounted() {
    this.getAuthTokenFromCookie();
    this.fetchCategories();
    this.loadUserData();
  },
  computed: {
    filteredCategories() {
      // Check if categories exists and has items
      if (!this.categories || (Array.isArray(this.categories) && this.categories.length === 0) || 
          (typeof this.categories === 'object' && Object.keys(this.categories).length === 0)) {
        return [];
      }
      
      // Convert to array if it's an object
      const categoryArray = Array.isArray(this.categories) 
        ? this.categories 
        : Object.entries(this.categories).map(([id, name]) => ({ 
            category_id: id, 
            nama: typeof name === 'string' ? name : name.nama || name.name 
          }));
      
      // Track unique category names
      const uniqueNames = new Set();
      
      // Filter out duplicates and categories starting with 'Kekerasan'
      return categoryArray.filter(category => {
        // Get the name regardless of property name used (nama or name)
        const name = category.nama || category.name || '';
        
        // If name already exists in our set or starts with 'Kekerasan', skip it
        if (uniqueNames.has(name) || name.startsWith('Kekerasan')) {
          return false;
        }
        
        // Otherwise add to unique set and keep this category
        uniqueNames.add(name);
        return true;
      });
    }
  },
  methods: {
    loadUserData() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          console.log('Loaded user data:', userData);
          
          // Set basic user information - keep original variable names
          this.form.nama_pelapor = userData.name || (userData.dosen ? userData.dosen.name : '');
          this.form.ni_pelapor = userData.nim || userData.nik || (userData.dosen ? userData.dosen.nik : '');
          this.form.nomor_telepon = userData.no_telp || (userData.dosen ? userData.dosen.no_telp : '');
          
          // Check email domain to determine role
          const email = userData.email || (userData.dosen ? userData.dosen.email : '');
          
          // If email exists and does NOT contain "@student", set role as "Dosen"
          if (email && !email.includes('@student')) {
            this.form.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on non-student email domain');
          }
          // Fallback to previous checks if email check doesn't trigger
          else if (userData.jabatan_sekarang && userData.jabatan_sekarang.name === 'Dosen') {
            this.form.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on user role');
          }
          else if (userData.dosen) {
            this.form.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on dosen object');
          }
          // Check punya_jabatan array for active Dosen role
          else if (userData.punya_jabatan && Array.isArray(userData.punya_jabatan)) {
            const dosenRole = userData.punya_jabatan.find(jabatan => 
              jabatan.name === 'Dosen' && jabatan.is_active === 1
            );
            
            if (dosenRole) {
              this.form.profesi = 'Dosen';
              console.log('Auto-selected profession: Dosen based on active role in punya_jabatan');
            }
          }
          
          // Log the values for debugging
          console.log('User data loaded - Name:', this.form.nama_pelapor, 
                    'NI/NIK:', this.form.ni_pelapor, 
                    'Profesi:', this.form.profesi);
        } else {
          console.log('No user session found');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },

    getAuthTokenFromCookie() {
      const token = VueCookies.get('auth_token');
      if (token) {
        this.token = token;
        return token;
      }
      return null;
    },

    fetchCategories() {
      this.loading = true;
      axios.get('https://v3422040.mhs.d3tiuns.com/api/category')
        .then(response => {
          if (response.data && response.data.data) {
            this.categories = response.data.data;
          } else {
            this.categories = response.data;
          }
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Add the missing showNotification method
    showNotification(title, message, isSuccess) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.isSuccess = isSuccess;
      this.showModal = true;
    },

    // Add the missing handleSubmissionError method
    handleSubmissionError(error) {
      this.loading = false;
      console.error('Error response:', error.response?.status, error.response?.data);
      
      if (error.response?.status === 401) {
        VueCookies.remove("auth_token");
        VueCookies.remove("user_session");
        this.showNotification('Error Autentikasi', 'Sesi login Anda telah berakhir.', false);
        setTimeout(() => {
          this.$router.push('/mahasiswa/login');
        }, 2000);
      } else {
        const errorData = error.response?.data;
        
        if (errorData?.['image_path'] || errorData?.['image_path.0'] || errorData?.['image_path.1']) {
          const errorMsg = errorData['image_path'] || errorData['image_path.0'] || errorData['image_path.1'];
          this.errors.image_path = Array.isArray(errorMsg) ? errorMsg : [errorMsg];
          
          this.showNotification(
            'Gagal Mengunggah Gambar', 
            'Terdapat masalah dengan unggahan gambar. Pastikan ukuran file tidak terlalu besar (maksimal 2MB per file) dan format file didukung (JPG, PNG).',
            false
          );
        } else {
          this.errors = errorData || {};
          const errorMessage = typeof errorData === 'string' ? errorData : 'Terjadi kesalahan saat mengirim laporan.';
          this.showNotification('Error', errorMessage, false);
        }
      }
    },

    // Add the missing closeModal method
    closeModal() {
      this.showModal = false;
      if (this.isSuccess) {
        this.$router.push('/pelaporan/kejadian');
      }
    },

    // Add the missing goBack method
    goBack() {
      this.$router.go(-1);
    },

    // Update your handleFileUpload method
    handleFileUpload(event) {
      const fileInput = event.target;
      const files = fileInput.files;
      
      // Clear previous errors
      this.errors.image_path = null;
      delete this.errors['image_path.0'];
      delete this.errors['image_path.1'];
      
      // Validate files
      if (!files || files.length === 0) {
        this.errors.image_path = ['Tidak ada file yang dipilih'];
        return;
      }
      
      // Reset arrays
      this.form.image_path = [];
      this.imagePreviews = [];
      
      // Define restrictions
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit
      const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
      let hasError = false;
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file object
        if (!file || !(file instanceof File)) {
          this.errors.image_path = ['File tidak valid'];
          hasError = true;
          break;
        }
        
        // Check file type
        if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
          this.errors.image_path = [`File "${file.name}" memiliki format yang tidak didukung. Gunakan format JPG atau PNG.`];
          hasError = true;
          break;
        }
        
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          this.errors.image_path = [
            `File "${file.name}" terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maksimal 2MB per file.`
          ];
          hasError = true;
          break;
        }
        
        // Add file to array
        this.form.image_path.push(file);
        
        // Create image preview with error handling
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            if (e.target && e.target.result) {
              this.imagePreviews.push(e.target.result);
            }
          } catch (error) {
            console.error('Error creating preview:', error);
          }
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        
        // Start reading the file
        try {
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error initiating file read:', error);
        }
      }
      
      // If error occurred, clear the file input and arrays
      if (hasError) {
        fileInput.value = '';
        this.form.image_path = [];
        this.imagePreviews = [];
        return;
      }
      
      // Validate final state
      if (this.form.image_path.length === 0) {
        this.errors.image_path = ['Tidak ada file yang berhasil diunggah'];
        fileInput.value = '';
        return;
      }
      
      // Log success for debugging
      console.log(`Successfully processed ${this.form.image_path.length} files:`, 
        this.form.image_path.map(f => ({
          name: f.name,
          type: f.type,
          size: `${(f.size / (1024 * 1024)).toFixed(2)}MB`
        }))
      );
    },

    removeImage(index) {
      if (index >= 0 && index < this.form.image_path.length) {
        this.form.image_path.splice(index, 1);
        this.imagePreviews.splice(index, 1);
        
        // Reset errors related to images
        this.errors.image_path = null;
        delete this.errors['image_path.0'];
        delete this.errors['image_path.1'];
        
        // If no images left, show validation error
        if (this.form.image_path.length === 0) {
          this.errors.image_path = ['Lampiran foto harus diunggah'];
        }
      }
    },

    addTerlapor() {
      this.form.terlapor.push({
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
      if (this.form.terlapor.length > 1) {
        this.form.terlapor.splice(index, 1);
      }
    },

    addSaksi() {
      this.form.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },

    removeSaksi(index) {
      if (this.form.saksi.length > 1) {
        this.form.saksi.splice(index, 1);
      }
    },

    validateForm() {
      let isValid = true;
      this.errors = {};

      if (!this.form.judul) {
        this.errors.judul = ['Judul laporan harus diisi'];
        isValid = false;
      }

      if (!this.form.category_id) {
        this.errors.category_id = ['Kategori harus dipilih'];
        isValid = false;
      }

      if (!this.form.deskripsi) {
        this.errors.deskripsi = ['Deskripsi harus diisi'];
        isValid = false;
      }

      if (!this.form.tanggal_kejadian) {
        this.errors.tanggal_kejadian = ['Tanggal kejadian harus diisi'];
        isValid = false;
      }

      if (!this.form.image_path || this.form.image_path.length === 0) {
        this.errors.image_path = ['Lampiran foto harus diunggah'];
        isValid = false;
      }

      if (this.form.bukti_pelanggaran.length === 0) {
        this.errors.bukti_pelanggaran = ['Minimal satu bukti pelanggaran harus dipilih'];
        isValid = false;
      }

      if (!this.form.profesi) {
        this.errors.profesi = ['Profesi harus dipilih'];
        isValid = false;
      }

      if (!this.form.jenis_kelamin) {
        this.errors.jenis_kelamin = ['Jenis kelamin harus dipilih'];
        isValid = false;
      }

      if (!this.form.umur_pelapor) {
        this.errors.umur_pelapor = ['Rentang umur harus dipilih'];
        isValid = false;
      }

      if (!this.form.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan'];
        isValid = false;
      }

      return isValid;
    },

    validateTerlapor() {
      // If terlapor array is empty or doesn't exist, it's valid
      if (!this.form.terlapor || this.form.terlapor.length === 0) {
        return true;
      }
      
      // If there are terlapor entries, validate only if there's data filled in
      const invalidEntries = this.form.terlapor.filter(item => {
        // If at least one field is filled, all required fields must be filled
        const hasAnyData = item.nama_lengkap || item.status_warga || item.unit_kerja || 
                           item.jenis_kelamin || item.umur_terlapor || item.email || item.nomor_telepon;
        
        if (hasAnyData) {
          // If any data is filled, required fields must be filled
          return !item.nama_lengkap || !item.status_warga || !item.unit_kerja || 
                 !item.jenis_kelamin || !item.umur_terlapor;
        }
        return false; // If no data is filled at all, it's valid
      });
      
      return invalidEntries.length === 0;
    },
    validateSaksi() {
      // If saksi array is empty or doesn't exist, it's valid
      if (!this.form.saksi || this.form.saksi.length === 0) {
        return true;
      }
      
      // If there are saksi entries, validate only if there's data filled in
      const invalidEntries = this.form.saksi.filter(item => {
        // If at least one field is filled, nama must be filled
        const hasAnyData = item.nama_lengkap || item.email || item.nomor_telepon;
        
        if (hasAnyData) {
          return !item.nama_lengkap; // Name is still required if any data is filled
        }
        return false; // If no data is filled at all, it's valid
      });
      
      return invalidEntries.length === 0;
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
      
      // Create FormData object
      const formData = new FormData();
      
      // Append basic fields
      formData.append('judul', this.form.judul);
      formData.append('category_id', this.form.category_id);
      formData.append('deskripsi', this.form.deskripsi);
      formData.append('tanggal_kejadian', this.form.tanggal_kejadian);
      formData.append('profesi', this.form.profesi);
      formData.append('jenis_kelamin', this.form.jenis_kelamin);
      formData.append('umur_pelapor', this.form.umur_pelapor);
      formData.append('agreement', this.form.agreement ? 1 : 0);
      
      // Add bukti_pelanggaran as array
      if (this.form.bukti_pelanggaran && this.form.bukti_pelanggaran.length > 0) {
        this.form.bukti_pelanggaran.forEach((item, index) => {
          formData.append(`bukti_pelanggaran[${index}]`, item);
        });
      }
      
      // Add optional fields if provided
      if (this.form.lampiran_link) {
        formData.append('lampiran_link', this.form.lampiran_link);
      }
      
      // Process terlapor data
      const validTerlapor = this.form.terlapor.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon || item.status_warga || 
        item.unit_kerja || item.jenis_kelamin || item.umur_terlapor
      );
      
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
      }
      
      // Process saksi data
      const validSaksi = this.form.saksi.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon
      );
      
      if (validSaksi.length > 0) {
        validSaksi.forEach((item, index) => {
          if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
          if (item.email) formData.append(`saksi[${index}][email]`, item.email);
          if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
        });
      }

      // Process image uploads - ensure at least one image exists
      if (!this.form.image_path || this.form.image_path.length === 0) {
        this.errors.image_path = ['Lampiran foto harus diunggah'];
        return;
      }
      
      // Add images with the format the server expects
      this.form.image_path.forEach((file, index) => {
        formData.append(`image_path[${index}]`, file);
      });
      
      // Set loading state
      this.loading = true;
      
      // Get the auth token
      const authToken = this.token || VueCookies.get('auth_token');
      if (!authToken) {
        this.loading = false;
        this.showNotification('Error Autentikasi', 'Token autentikasi tidak ditemukan. Silakan login kembali.', false);
        setTimeout(() => this.$router.push('/login'), 2000);
        return;
      }
      
      // Use XMLHttpRequest directly like in AddPelaporanKejadian.vue
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://v3422040.mhs.d3tiuns.com/api/laporan/add_laporan');
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      
      xhr.onload = () => {
        this.loading = false;
        
        // Handle response based on status code
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            // Parse response
            const response = JSON.parse(xhr.response);
            
            // Always consider 200/201 responses as success regardless of response body
            // Use auto-dismiss Sweet Alert
            Swal.fire({
              title: 'Sukses!',
              text: 'Laporan berhasil dikirim!',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              // Redirect to dashboard after auto-dismiss
              this.$router.push('/dosen/dashboardpkdosen');
            });
            
            // Reset the form in the background while the alert shows
            this.resetForm();
            
          } catch (error) {
            // If JSON parse fails but status is success, still consider it a success
            Swal.fire({
              title: 'Sukses!',
              text: 'Laporan berhasil dikirim!',
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              // Redirect to dashboard after auto-dismiss
              this.$router.push('/dosen/dashboardpkdosen');
            });
            
            // Reset the form in the background while the alert shows
            this.resetForm();
          }
        } else if (xhr.status === 400) {
          // Handle validation errors as before
          try {
            const response = JSON.parse(xhr.response);
            this.errors = response.errors || response;
            console.log('Server validation errors:', this.errors);
            
            // Show validation error notification that auto-dismisses
            Swal.fire({
              title: 'Validasi Gagal',
              text: 'Silakan periksa kembali isian form Anda.',
              icon: 'error',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false
            });
            
            this.$nextTick(() => {
              const firstError = document.querySelector('.is-invalid');
              if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          } catch (error) {
            Swal.fire({
              title: 'Validasi Gagal',
              text: 'Silakan periksa kembali isian form Anda.',
              icon: 'error',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false
            });
          }
        } else if (xhr.status === 401) {
          Swal.fire({
            title: 'Sesi Berakhir',
            text: 'Sesi login Anda telah berakhir. Silakan login kembali.',
            icon: 'warning',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.$router.push('/login');
          });
        } else {
          console.error(`Server error (${xhr.status}):`, xhr.response);
          Swal.fire({
            title: 'Error',
            text: `Terjadi kesalahan pada server. Silakan coba lagi nanti.`,
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      };
      
      xhr.onerror = () => {
        this.loading = false;
        console.error('Network error during request');
        Swal.fire({
          title: 'Error Koneksi',
          text: 'Gagal menghubungi server. Periksa koneksi internet Anda.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      };

      // Send the form data
      try {
        xhr.send(formData);
      } catch (error) {
        this.loading = false;
        console.error('Error sending request:', error);
        Swal.fire({
          title: 'Error',
          text: 'Gagal mengirim data: ' + error.message,
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    },
    // Add this method to your methods section
    resetForm() {
      // Reset main form fields
      this.form = {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: '',
        lampiran_link: '',
        agreement: false,
        image_path: [],
        bukti_pelanggaran: [],
        terlapor: [this.createEmptyTerlapor()],
        saksi: [this.createEmptySaksi()]
      };
      
      // Reset file input by getting a reference to it and resetting its value
      const fileInput = document.getElementById('image_upload');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Reset preview images
      this.imagePreviews = [];
      
      // Reset errors
      this.errors = {};
      
      // Reset loading state
      this.loading = false;
    },

    createEmptyTerlapor() {
      return {
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        unit_kerja: '',
        jenis_kelamin: '',
        umur_terlapor: ''
      };
    },

    createEmptySaksi() {
      return {
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      };
    },
  },
  created() {
    // Set the base URL for all axios requests
    axios.defaults.baseURL = 'https://v3422040.mhs.d3tiuns.com';
    
    // Get the auth token
    this.token = this.getAuthTokenFromCookie();
    if (!this.token) {
      console.error('No authentication token found');
      Swal.fire({
        title: 'Authentication Error',
        text: 'You need to login first',
        icon: 'error'
      });
      this.$router.push('/dosen/login');
    } else {
      console.log('Token found:', this.token.substring(0, 10) + '...');
    }
  },
  getAuthTokenFromCookie() {
    try {
      const encryptedToken = VueCookies.get('dosen_token');
      if (!encryptedToken) {
        console.error('No encrypted token found in cookies');
        return null;
      }
      
      const token = decryptData(encryptedToken);
      if (!token) {
        console.error('Failed to decrypt token');
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token from cookie:', error);
      return null;
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