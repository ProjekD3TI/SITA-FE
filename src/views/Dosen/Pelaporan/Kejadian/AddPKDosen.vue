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
        <h2>Identitas Terlapor/Terduga</h2>
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
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        this.formData.nama_pelapor = userData.name || '';
        this.formData.ni_pelapor = userData.nim || userData.nik || '';
        this.formData.nomor_telepon = userData.no_telp || '';
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
      
      // Initialize image_path as array if it's not already
      if (!this.formData.image_path) {
        this.formData.image_path = [];
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.formData.image_path.push(file);
        
        // Create image preview
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
      // Ensure we always have at least one terlapor form
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
      // Ensure we always have at least one saksi form
      if (this.formData.saksi.length > 1) {
        this.formData.saksi.splice(index, 1);
      }
    },
    validateTerlapor() {
      // If terlapor array is empty or doesn't exist, it's valid
      if (!this.formData.terlapor || this.formData.terlapor.length === 0) {
        return true;
      }
      
      // If there are terlapor entries, validate only if data is filled
      const invalidEntries = this.formData.terlapor.filter(item => {
        // If at least one field is filled, then all required fields must be filled
        const hasAnyData = item.nama_lengkap || item.status_warga || item.unit_kerja || item.jenis_kelamin || item.umur_terlapor;
        
        if (hasAnyData) {
          // If any data is filled, all required fields must be filled
          return !item.nama_lengkap || !item.status_warga || !item.unit_kerja || !item.jenis_kelamin || !item.umur_terlapor;
        }
        return false; // If no data is filled at all, it's valid
      });
      
      return invalidEntries.length === 0;
    },
    validateSaksi() {
      // If saksi array is empty or doesn't exist, it's valid
      if (!this.formData.saksi || this.formData.saksi.length === 0) {
        return true;
      }
      
      // If there are saksi entries, validate only if data is filled
      const invalidEntries = this.formData.saksi.filter(item => {
        // If at least one field is filled, name must be filled
        const hasAnyData = item.nama_lengkap || item.email || item.nomor_telepon;
        
        if (hasAnyData) {
          return !item.nama_lengkap; // Name is required if any other data is filled
        }
        return false; // If no data is filled at all, it's valid
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
      
      // Terlapor dan saksi are not required, but if filled must be valid
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
    async submitForm() {
  // Debug logs to see where the issue is
  console.log("Starting form submission...");
  
  // Use formData since that's what's defined in your component
  let formReference = this.formData;
  
  if (!formReference) {
    console.error("No form data found!");
    this.showNotification('Error', 'Form data could not be found. Please refresh the page and try again.', false);
    return;
  }

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
  
  // Extra validation for images
  if (!formReference.image_path || !Array.isArray(formReference.image_path) || formReference.image_path.length === 0) {
    this.errors.image_path = ['Lampiran foto harus diunggah'];
    return;
  }

  // Validate each image before attempting to upload
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  
  for (let i = 0; i < formReference.image_path.length; i++) {
    const file = formReference.image_path[i];
    
    if (file.size > MAX_FILE_SIZE) {
      this.showNotification(
        'File Terlalu Besar', 
        `File "${file.name}" berukuran ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maksimal 2MB per file.`,
        false
      );
      return;
    }
    
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      this.showNotification(
        'Format File Tidak Didukung', 
        `File "${file.name}" memiliki format ${file.type}. Format yang didukung: JPG, PNG.`,
        false
      );
      return;
    }
  }
  
  this.loading = true;
  this.errors = {};
  
  // Re-check the token before submitting
  const authToken = VueCookies.get('auth_token');
  if (!authToken) {
    this.loading = false;
    this.showNotification('Error Autentikasi', 'Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.', false);
    setTimeout(() => {
      this.$router.push('/mahasiswa/login');
    }, 2000);
    return;
  }
  
  const formData = new FormData();
  
  // Append basic fields
  formData.append('judul', formReference.judul);
  formData.append('category_id', formReference.category_id);
  formData.append('deskripsi', formReference.deskripsi);
  formData.append('tanggal_kejadian', formReference.tanggal_kejadian);
  formData.append('profesi', formReference.profesi);
  formData.append('jenis_kelamin', formReference.jenis_kelamin);
  formData.append('umur_pelapor', formReference.umur_pelapor);
  formData.append('agreement', formReference.agreement ? 1 : 0);
  
  // Append optional link if provided
  if (formReference.lampiran_link) {
    formData.append('lampiran_link', formReference.lampiran_link);
  }
  
  // Append bukti_pelanggaran
  if (formReference.bukti_pelanggaran && formReference.bukti_pelanggaran.length > 0) {
    formReference.bukti_pelanggaran.forEach((bukti) => {
      formData.append('bukti_pelanggaran[]', bukti);
    });
  }
  
  // FIXED: Handle file uploads with the exact field name format expected by the server
  if (formReference.image_path && formReference.image_path.length > 0) {
    console.log("Images to upload:", formReference.image_path.length);
    
    // Use ONLY the indexed format that the server expects
    for (let idx = 0; idx < formReference.image_path.length; idx++) {
      const file = formReference.image_path[idx];
      console.log(`Appending file ${idx+1}: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
      
      // IMPORTANT: Use EXACTLY this format - "image_path.0", "image_path.1", etc.
      formData.append(`image_path.${idx}`, file);
    }
  }
  
  // Process terlapor data
  const validTerlapor = formReference.terlapor.filter(item => 
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
  const validSaksi = formReference.saksi.filter(item => 
    item.nama_lengkap || item.email || item.nomor_telepon
  );
  
  if (validSaksi.length > 0) {
    validSaksi.forEach((item, index) => {
      if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
      if (item.email) formData.append(`saksi[${index}][email]`, item.email);
      if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
    });
  }

  // Log form data entries for debugging
  console.log("Form data entries being sent:");
  for (let pair of formData.entries()) {
    if (pair[1] instanceof File) {
      console.log(`${pair[0]}: File ${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes`);
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }

  // Send the request using axios
  try {
    const response = await axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan/add_laporan', formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    // Handle success
    this.loading = false;
    console.log('Success response:', response.data);
    
    Swal.fire({
      title: 'Berhasil!',
      text: 'Laporan berhasil ditambahkan.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.$router.push('/pelaporan/kejadian');
    });
    
    this.resetForm();
  } catch (error) {
    this.loading = false;
    console.error('Error response:', error.response?.status, error.response?.data);
    
    if (error.response) {
      if (error.response.status === 401) {
        VueCookies.remove("auth_token");
        VueCookies.remove("user_session");
        
        this.showNotification('Error Autentikasi', 'Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.', false);
        
        setTimeout(() => {
          this.$router.push('/mahasiswa/login');
        }, 2000);
      } else {
        // Get error data
        const errorData = error.response.data;
        console.error("API Error details:", errorData);
        
        // Handle image upload errors
        if (errorData['image_path'] || errorData['image_path.0'] || errorData['image_path.1']) {
          const errorMsg = errorData['image_path'] || errorData['image_path.0'] || errorData['image_path.1'];
          
          this.errors.image_path = Array.isArray(errorMsg) ? errorMsg : [errorMsg];
          
          this.showNotification(
            'Gagal Mengunggah Gambar', 
            'Terdapat masalah dengan unggahan gambar. Pastikan ukuran file tidak terlalu besar (maksimal 2MB per file) dan format file didukung (JPG, PNG).',
            false
          );
        } else {
          // Handle other validation errors
          this.errors = errorData;
          
          // Show general error
          const errorMessage = typeof errorData === 'string' ? errorData : 'Terjadi kesalahan saat mengirim laporan.';
          this.showNotification('Error Validasi', errorMessage, false);
        }
        
        // Scroll to first error
        this.$nextTick(() => {
          const firstError = document.querySelector('.is-invalid');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
      this.showNotification(
        'Error Server', 
        'Permintaan terkirim tetapi server tidak memberikan respon. Silakan coba lagi nanti.',
        false
      );
    } else {
      // Something happened in setting up the request
      console.error('Error in request setup:', error.message);
      this.showNotification('Error', error.message, false);
    }
  }
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
        bukti_pelanggaran: [],
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