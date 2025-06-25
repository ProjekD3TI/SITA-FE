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
              <div class="file-upload-container">
                <div class="file-upload-box relative">
                  <input
                    type="file"
                    id="image_path"
                    @change="handleFileUpload"
                    class="file-input"
                    :class="{ 'is-invalid': errors['image_path.0'] || errors.image_path }"
                    accept="image/*"
                    multiple
                    required
                  />
                  <div class="upload-icon-container">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Klik atau seret beberapa file foto</p>
                    <small>Format: JPG, PNG, GIF (Maks 5MB)</small>
                  </div>
                </div>
                <div v-if="errors['image_path.0']" class="invalid-feedback">{{ errors['image_path.0'][0] }}</div>
                <div v-if="errors.image_path" class="invalid-feedback">{{ errors.image_path[0] }}</div>
              </div>
              
              <div v-if="imagePreviews.length > 0" class="image-previews-container">
                <h4>Preview Foto ({{ imagePreviews.length }} file)</h4>
                <div class="image-previews">
                  <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-item">
                    <img :src="preview" alt="Preview" />
                    <button type="button" @click="removeImage(index)" class="remove-image" title="Hapus Foto">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
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
              <label>Bukti Pelaporan <span class="required">*</span></label>
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
        <div class="form-row">
          <!-- Left Column -->
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
              <div v-if="errors.nama_pelapor" class="invalid-feedback">{{ errors.nama_pelapor[0] }}</div>
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
              <div v-if="errors.nim_pelapor" class="invalid-feedback">{{ errors.nim_pelapor[0] }}</div>
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
              <div v-if="errors.nomor_telepon" class="invalid-feedback">{{ errors.nomor_telepon[0] }}</div>
            </div>
            
            <!-- Profesi Field -->
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
          
          <!-- Right Column -->
          <div class="form-column">
            <!-- Jenis Kelamin Field -->
            <div class="form-group">
              <label>Jenis Kelamin Pelapor <span class="required">*</span></label>
              <div class="radio-group" :class="{ 'is-invalid': errors.jenis_kelamin }">
                <div class="form-check form-check-inline">
                  <input 
                    type="radio" 
                    id="jenis_kelamin_male" 
                    name="jenis_kelamin" 
                    v-model="formData.jenis_kelamin" 
                    value="laki-laki"
                    class="form-check-input"
                    required
                  />
                  <label for="jenis_kelamin_male" class="form-check-label">Laki-laki</label>
                </div>
                <div class="form-check form-check-inline">
                  <input 
                    type="radio" 
                    id="jenis_kelamin_female" 
                    name="jenis_kelamin" 
                    v-model="formData.jenis_kelamin" 
                    value="perempuan"
                    class="form-check-input"
                    required
                  />
                  <label for="jenis_kelamin_female" class="form-check-label">Perempuan</label>
                </div>
              </div>
              <div v-if="errors.jenis_kelamin" class="invalid-feedback">{{ errors.jenis_kelamin[0] }}</div>
            </div>
            
            <!-- Rentang Umur Field -->
            <div class="form-group">
              <label>Rentang Umur <span class="required">*</span></label>
              <div class="radio-group standard-radio" :class="{ 'is-invalid': errors.umur_pelapor }">
                <div class="form-check">
                  <input
                    type="radio"
                    id="below20"
                    name="umur_pelapor"
                    v-model="formData.umur_pelapor"
                    value="<20"
                    class="form-check-input"
                    required
                  />
                  <label for="below20" class="form-check-label">Kurang dari 20 tahun</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    id="20to40"
                    name="umur_pelapor"
                    v-model="formData.umur_pelapor"
                    value="20-40"
                    class="form-check-input"
                  />
                  <label for="20to40" class="form-check-label">20 - 40 tahun</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    id="above40"
                    name="umur_pelapor"
                    v-model="formData.umur_pelapor"
                    value="40<"
                    class="form-check-input"
                  />
                  <label for="above40" class="form-check-label">Lebih dari 40 tahun</label>
                </div>
              </div>
              <div v-if="errors.umur_pelapor" class="invalid-feedback d-block">{{ errors.umur_pelapor[0] }}</div>
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
              <div class="radio-group standard-radio" :class="{ 'is-invalid': errors[`terlapor.${index}.umur_terlapor`] }">
                <div class="form-check">
                  <input
                    type="radio"
                    :id="`terlapor-below20-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="<20"
                    class="form-check-input"
                    required
                  />
                  <label :for="`terlapor-below20-${index}`" class="form-check-label">Kurang dari 20 tahun</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    :id="`terlapor-20to40-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="20-40"
                    class="form-check-input"
                  />
                  <label :for="`terlapor-20to40-${index}`" class="form-check-label">20 - 40 tahun</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    :id="`terlapor-above40-${index}`"
                    v-model="terduga.umur_terlapor"
                    value="40<"
                    class="form-check-input"
                  />
                  <label :for="`terlapor-above40-${index}`" class="form-check-label">Lebih dari 40 tahun</label>
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

      <!-- Section 5: reCAPTCHA verification -->
      <div class="form-section">
        <h2>Verifikasi</h2>
        <div class="form-row single-column">
          <div class="form-column">
            <div class="form-group">
              <div ref="recaptchaContainer" class="g-recaptcha-container"></div>
              <div v-if="errors['g-recaptcha-response']" class="invalid-feedback d-block">
                {{ errors['g-recaptcha-response'][0] || 'Harap centang reCAPTCHA' }}
              </div>
              <div v-if="recaptchaError" class="invalid-feedback d-block">
                {{ recaptchaError }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 6: Pernyataan -->
      <div class="form-section">
        <h2>Pernyataan</h2>
        <div class="statement-box">
          <p>Dengan ini saya menyatakan bahwa:</p>
            <ol class="list-decimal pl-6 mb-4 space-y-2">
              <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
              <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
              <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
              <li>Saya menyatakan bersedia laporan ini diproses lebih lanjut sesuai dengan prosedur yang berlaku di UNS.</li>
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
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Mengirim...
          </span>
          <span v-else>Kirim Laporan</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { decryptData } from '../../../../services/encrypt';
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
        agreement: false,
        // Added fields for pelapor information
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
      },
      selectedFiles: [], // Array for tracking selected files
      selectedBukti: [], // Array for selected bukti checkboxes
      buktiOptions: [
        'Bukti pemeriksaan medis',
        'Dokumen dan/atau rekaman',
        'Foto dan/atau video dokumentasi',
        'Surat atau kesaksian tertulis',
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
      loading: false,
      imagePreviews: [],
      // reCAPTCHA v2 Configuration
      recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
      recaptchaVerified: false,
      recaptchaResponse: null,
      recaptchaError: null,
      recaptchaWidget: null,
      recaptchaAttempts: 0,
      maxRecaptchaAttempts: 3
    };
  },
  computed: {
    kekerasanCategories() {
      // Filter for categories that start with "Kekerasan"
      return this.categories.filter(category => 
        category.nama && category.nama.startsWith('Kekerasan')
      );
    },
    apiBaseUrl() {
      return 'http://pelaporan-d3ti.my.id/api';
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
    this.loadRecaptchaScript();
  },
  methods: {
    // reCAPTCHA Methods
    loadRecaptchaScript() {
      if (window.grecaptcha) {
        this.renderRecaptchaWidget();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit`;
      script.async = true;
      script.defer = true;

      // Define callback when reCAPTCHA is loaded
      window.onRecaptchaLoaded = () => {
        this.renderRecaptchaWidget();
      };

      // Handle script loading errors
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        this.recaptchaError = 'Gagal memuat reCAPTCHA. Silakan muat ulang halaman.';
      };

      // Add script to document
      document.head.appendChild(script);
    },

    renderRecaptchaWidget() {
      // Wait until the container is mounted
      this.$nextTick(() => {
        if (!this.$refs.recaptchaContainer) {
          console.error('reCAPTCHA container not found');
          setTimeout(() => this.renderRecaptchaWidget(), 500);
          return;
        }

        try {
          // Render reCAPTCHA widget
          this.recaptchaWidget = window.grecaptcha.render(this.$refs.recaptchaContainer, {
            'sitekey': this.recaptchaSiteKey,
            'callback': (response) => {
              this.recaptchaResponse = response;
              this.recaptchaVerified = true;
              this.recaptchaError = null;
              console.log('reCAPTCHA verification successful');
            },
            'expired-callback': () => {
              this.recaptchaResponse = null;
              this.recaptchaVerified = false;
              this.recaptchaError = 'Verifikasi reCAPTCHA telah kedaluwarsa. Silakan centang kembali.';
            },
            'error-callback': () => {
              this.recaptchaResponse = null;
              this.recaptchaVerified = false;
              this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan coba lagi.';
            }
          });
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
          
          // If the widget is already rendered, just reset it
          if (error.message && error.message.includes('already been rendered')) {
            this.resetRecaptcha();
          } else {
            this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
          }
        }
      });
    },

    resetRecaptcha() {
      try {
        if (window.grecaptcha && this.recaptchaWidget !== null) {
          window.grecaptcha.reset(this.recaptchaWidget);
          this.recaptchaVerified = false;
          this.recaptchaResponse = null;
        } else {
          // If reset fails, re-initialize
          this.recaptchaAttempts = 0; 
          this.renderRecaptchaWidget();
        }
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error);
        this.recaptchaAttempts = 0;
        this.renderRecaptchaWidget();
      }
    },

    getRecaptchaResponse() {
      try {
        if (window.grecaptcha && this.recaptchaWidget !== null) {
          return window.grecaptcha.getResponse(this.recaptchaWidget);
        }
        return this.recaptchaResponse;
      } catch (error) {
        console.error('Error getting reCAPTCHA response:', error);
        return this.recaptchaResponse;
      }
    },

    // Data loading methods
    loadUserData() {
      try {
        // Set current date and time dynamically in UTC
        const now = new Date();
        // Format as YYYY-MM-DD HH:MM:SS in UTC
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        
        this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.formData.nama_pelapor = userData.name || '';
          this.formData.nim_pelapor = userData.nim || userData.nik || '';
          this.formData.nomor_telepon = userData.no_telp || '';
          
          // Check email domain to determine role
          const email = userData.email || (userData.dosen ? userData.dosen.email : '');
          
          // If email exists and does NOT contain "@student", set role as "Dosen"
          if (email && !email.includes('@student')) {
            this.formData.profesi = 'Dosen';
          }
          // Check for other indicators of lecturer role
          else if (userData.jabatan_sekarang && userData.jabatan_sekarang.name === 'Dosen') {
            this.formData.profesi = 'Dosen';
          }
          else if (userData.dosen) {
            this.formData.profesi = 'Dosen';
          }
          // Check punya_jabatan array for active Dosen role
          else if (userData.punya_jabatan && Array.isArray(userData.punya_jabatan)) {
            const dosenRole = userData.punya_jabatan.find(jabatan => 
              jabatan.name === 'Dosen' && jabatan.is_active === 1
            );
            
            if (dosenRole) {
              this.formData.profesi = 'Dosen';
            }
          }
        } else {
          this.setDefaultUserData();
        }
      } catch (error) {
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
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.apiBaseUrl}/category`, true);
      xhr.timeout = 10000; // 10 seconds
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (Array.isArray(response)) {
              this.categories = response;
            } else if (response && response.data) {
              this.categories = response.data;
            } else {
              console.error('Unexpected API response structure:', response);
              this.categories = [];
            }
          } catch (error) {
            console.error('Error parsing categories response:', error);
            this.categories = [];
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Gagal memuat kategori laporan.'
            });
          }
        } else {
          console.error('Failed to fetch categories:', xhr.status, xhr.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal memuat kategori laporan.'
          });
        }
      };
      
      xhr.onerror = () => {
        console.error('Network error while fetching categories');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal memuat kategori laporan. Periksa koneksi internet Anda.'
        });
      };
      
      xhr.ontimeout = () => {
        console.error('Timeout while fetching categories');
        Swal.fire({
          icon: 'error',
          title: 'Timeout',
          text: 'Permintaan kategori melebihi batas waktu. Silakan coba lagi.'
        });
      };
      
      xhr.send();
    },
    
    // File handling methods
    handleFileUpload(event) {
      const selectedFiles = Array.from(event.target.files);
      
      // Validate the files
      const { validFiles, invalidFiles } = this.validateFiles(selectedFiles);
      
      // Show warning for invalid files
      if (invalidFiles.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Beberapa file tidak valid',
          html: `
            <p>Beberapa file tidak dapat digunakan:</p>
            <ul>
              ${invalidFiles.map(name => `<li>${name}</li>`).join('')}
            </ul>
            <p>Pastikan semua file berformat JPEG, PNG, atau GIF dan ukuran tidak melebihi 5MB.</p>
          `
        });
      }
      
      // Store selected files for form submission
      this.selectedFiles = validFiles;
      
      // Create a new FileList-like object from valid files
      const dataTransfer = new DataTransfer();
      validFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      // Update the formData.image_path for form submission
      this.formData.image_path = dataTransfer.files;
      
      // Generate preview images
      this.imagePreviews = [];
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    
    removeImage(index) {
      // Remove from previews
      this.imagePreviews.splice(index, 1);
      
      // Remove from selectedFiles array
      this.selectedFiles.splice(index, 1);
      
      // Create a new FileList-like object from the remaining files
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      // Update the input element's files and form data
      this.formData.image_path = dataTransfer.files;
      document.getElementById('image_path').files = dataTransfer.files;
    },
    
    validateFiles(files) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      let validFiles = [];
      let invalidFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > maxSizeInBytes) {
          invalidFiles.push(`${file.name} (melebihi batas ukuran)`);
        } else if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(`${file.name} (format tidak didukung)`);
        } else {
          validFiles.push(file);
        }
      }
      
      return {
        validFiles,
        invalidFiles
      };
    },
    
    // Navigation methods
    goBack() {
      this.$router.go(-1);
    },
    
    // Form data handling methods
    updateBuktiPelanggaran() {
      // Start with selected standard options
      let buktiArray = [...this.selectedBukti];
      
      // Add "Lainnya" if it's checked and has a value
      if (this.showLainnyaInput && this.buktiLainnya.trim()) {
        buktiArray.push('Lainnya: ' + this.buktiLainnya.trim());
      }
      
      // Update the formData
      this.formData.bukti_pelanggaran = buktiArray;
      
      // Clear bukti warning if we have selected items
      if (buktiArray.length > 0) {
        this.showBuktiWarning = false;
      }
    },
    
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
    
    // Form validation and submission
    validateForm() {
      let isValid = true;
      this.errors = {};
      
      // Basic validations
      if (!this.formData.judul) {
        this.errors.judul = ['Judul laporan harus diisi'];
        isValid = false;
      }
      
      if (!this.formData.category_id) {
        this.errors.category_id = ['Kategori harus dipilih'];
        isValid = false;
      }
      
      if (!this.formData.deskripsi) {
        this.errors.deskripsi = ['Deskripsi harus diisi'];
        isValid = false;
      }
      
      if (!this.formData.tanggal_kejadian) {
        this.errors.tanggal_kejadian = ['Tanggal kejadian harus diisi'];
        isValid = false;
      }
      
      // Validate pelapor fields
      if (!this.formData.profesi) {
        this.errors.profesi = ['Profesi harus dipilih'];
        isValid = false;
      }
      
      if (!this.formData.jenis_kelamin) {
        this.errors.jenis_kelamin = ['Jenis kelamin harus dipilih'];
        isValid = false;
      }
      
      if (!this.formData.umur_pelapor) {
        this.errors.umur_pelapor = ['Rentang umur harus dipilih'];
        isValid = false;
      }
      
      // Validate bukti_pelanggaran
      if (this.formData.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        isValid = false;
      }
      
      // Validate file uploads
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        this.errors.image_path = ['Lampiran foto harus diunggah'];
        isValid = false;
      }
      
      // Validate reCAPTCHA
      const recaptchaResponse = this.getRecaptchaResponse();
      if (!recaptchaResponse) {
        this.errors['g-recaptcha-response'] = ['Harap centang reCAPTCHA'];
        isValid = false;
      }
      
      // Validate agreement
      if (!this.formData.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
        isValid = false;
      }
      
      return isValid;
    },
    
    submitForm() {
      // Update and validate bukti_pelanggaran
      this.updateBuktiPelanggaran();
      
      if (!this.validateForm()) {
        // Scroll to first error
        this.$nextTick(() => {
          const firstError = document.querySelector('.is-invalid') || 
                             document.querySelector('.invalid-feedback.d-block');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }
      
      this.loading = true;
      
      const formData = new FormData();
      formData.append('judul', this.formData.judul);
      formData.append('category_id', this.formData.category_id);
      formData.append('deskripsi', this.formData.deskripsi);
      formData.append('tanggal_kejadian', this.formData.tanggal_kejadian);
      formData.append('nama_pelapor', this.formData.nama_pelapor);
      formData.append('nim_pelapor', this.formData.nim_pelapor);
      formData.append('nomor_telepon', this.formData.nomor_telepon);
      formData.append('g-recaptcha-response', this.getRecaptchaResponse());
      
      // Add pelapor specific fields
      formData.append('profesi', this.formData.profesi);
      formData.append('jenis_kelamin', this.formData.jenis_kelamin);
      formData.append('umur_pelapor', this.formData.umur_pelapor);
      
      // Add lampiran_link if exists
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
            if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
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
            if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
              formData.append(`saksi[${index}][${key}]`, item[key]);
            }
          });
        });
      }
      
      // Append multiple files if they exist
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append('image_path[]', this.selectedFiles[i]);
        }
      }
      
      // Agreement field
      formData.append('agreement', this.formData.agreement ? 1 : 0);
      
      // Create XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      // Configure request
      xhr.open('POST', `${this.apiBaseUrl}/laporan_kekerasan/add_laporan`, true);
      
      // Set timeout (30 seconds)
      xhr.timeout = 30000;
      
      // Handle completion
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        
        this.loading = false;
        
        // Log raw response for debugging
        console.log('XHR Response Status:', xhr.status);
        console.log('XHR Response Headers:', xhr.getAllResponseHeaders());
        
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success response
          let responseData;
          try {
            responseData = JSON.parse(xhr.responseText);
            console.log('Parsed response data:', responseData);
          } catch (e) {
            console.log('Response is not JSON:', xhr.responseText);
          }
          
          // Reset reCAPTCHA
          this.resetRecaptcha();
          
          // Show success message
          Swal.fire({
            title: 'Berhasil!',
            text: 'Laporan berhasil ditambahkan.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.$router.push('/petugas/pelaporankekerasanseksualpetugas');
          });
          
          this.resetForm();
        } else {
          // Error handling
          console.error('Form submission error:', xhr.status, xhr.statusText);
          
          let errorMessage = 'Terjadi kesalahan pada server.';
          
          // Try to parse error response
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.log('Error response:', errorResponse);
            
            if (errorResponse.errors) {
              this.errors = errorResponse.errors;
            } else if (typeof errorResponse === 'object') {
              // Handle flattened validation errors
              this.errors = errorResponse;
            }
            
            // Check for reCAPTCHA errors
            if (this.errors['g-recaptcha-response'] || 
                (errorResponse.message && errorResponse.message.toLowerCase().includes('recaptcha'))) {
              this.resetRecaptcha();
            }
            
            if (errorResponse.message) {
              errorMessage = errorResponse.message;
            }
            
            console.error('Validation errors:', this.errors);
            
            // Scroll to first error
            this.$nextTick(() => {
              const firstError = document.querySelector('.is-invalid') || 
                                document.querySelector('.invalid-feedback.d-block');
              if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
          });
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        this.loading = false;
        console.error('Network error occurred');
        
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        });
      };
      
      // Handle timeouts
      xhr.ontimeout = () => {
        this.loading = false;
        console.error('Request timed out');
        
        Swal.fire({
          icon: 'error',
          title: 'Timeout',
          text: 'Permintaan melebihi batas waktu. Silakan coba lagi.'
        });
      };
      
      // Add upload progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
        }
      };
      
      // Send the request
      xhr.send(formData);
    },
    
    resetForm() {
      // Reset form data
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
        agreement: false,
        // Reset pelapor fields
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
      };
      
      // Reset other form state
      this.selectedFiles = [];
      this.selectedBukti = [];
      this.showLainnyaInput = false;
      this.buktiLainnya = '';
      this.showBuktiWarning = false;
      this.errors = {};
      this.imagePreviews = [];
      
      // Reset file input
      const fileInput = document.getElementById('image_path');
      if (fileInput) fileInput.value = '';
      
      // Reset reCAPTCHA
      this.resetRecaptcha();
    }
  }
};
</script>

<style scoped>
/* Main container styles */
.add-ks-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  color: #d32f2f;
  font-size: 2rem;
  font-weight: 600;
}

/* Form sections */
.form-section {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eaeaea;
}

.form-section h3 {
  color: #444;
  font-size: 1.25rem;
  margin: 1rem 0;
}

/* Form layout */
.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: -0.75rem;
}

.form-column {
  flex: 1 1 50%;
  padding: 0.75rem;
  min-width: 300px;
}

.form-row.single-column .form-column {
  flex: 1 1 100%;
}

/* Form controls */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #d32f2f;
  box-shadow: 0 0 0 0.2rem rgba(211, 47, 47, 0.25);
  outline: none;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

textarea.form-control {
  min-height: 150px;
  resize: vertical;
}

/* Form elements */
.required {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
  font-size: 0.875rem;
}

small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

/* Checkbox and radio styles */
.form-check {
  margin-bottom: 0.75rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-check-label {
  display: inline;
  vertical-align: middle;
}

.radio-group {
  margin-top: 0.5rem;
}

.form-check-inline {
  display: inline-flex;
  align-items: center;
  margin-right: 1.5rem;
}

.standard-radio .form-check {
  margin-bottom: 0.5rem;
}

/* Bukti pelanggaran section */
.bukti-checkbox-group {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
}

.bukti-check {
  margin-bottom: 0.5rem;
}

.lainnya-input-container {
  margin-top: 0.5rem;
  margin-left: 1.5rem;
}

/* File upload styles */
.file-upload-container {
  margin-bottom: 1rem;
}

.file-upload-box {
  border: 2px dashed #ced4da;
  border-radius: 6px;
  padding: 2rem 1rem;
  text-align: center;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-box:hover {
  background-color: #e9ecef;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-icon-container {
  color: #6c757d;
}

.upload-icon-container i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.upload-icon-container p {
  margin-bottom: 0.25rem;
}

/* Image previews */
.image-previews-container {
  margin-top: 1rem;
}

/* Image previews */
.image-previews-container {
  margin-top: 1rem;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.image-preview-item {
  position: relative;
}

.image-preview-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview-item:hover .remove-image {
  opacity: 1;
}

/* Terduga & Saksi containers */
.terduga-container, .saksi-container {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.terduga-actions, .saksi-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.terduga-add, .saksi-add {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

/* Statement box */
.statement-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1.5rem;
}

.statement-box p {
  font-weight: 500;
  margin-bottom: 1rem;
}

.statement-box ol {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.statement-box li {
  margin-bottom: 0.5rem;
}

/* reCAPTCHA container */
.g-recaptcha-container {
  margin: 20px 0;
  min-height: 78px;
  display: flex;
  justify-content: center;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

/* Buttons */
.btn {
  display: inline-block;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 4px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  cursor: pointer;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 3px;
}

.btn-danger {
  background-color: #d32f2f;
  border-color: #d32f2f;
  color: white;
}

.btn-danger:hover {
  background-color: #b71c1c;
  border-color: #b71c1c;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Fixing position class */
.relative {
  position: relative !important;
}

/* Display block utility */
.d-block {
  display: block !important;
}

/* Fix for the spinner icon */
.fa-spinner {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-column {
    flex: 100%;
  }
}
</style>