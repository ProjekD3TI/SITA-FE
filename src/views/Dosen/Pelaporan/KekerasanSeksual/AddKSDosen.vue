<template>
  <div>
    <div class="container mx-auto px-4 py-8 mt-16">
      <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Laporan Kekerasan Seksual</h2>

        <form @submit.prevent="submitReport" class="space-y-6">
          <!-- Section 1: Detail Laporan -->
          <div class="form-section">
            <h3 class="text-xl font-semibold mb-4">Detail Laporan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div>
                <!-- Judul/Nama Laporan -->
                <div class="mb-4">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="title"
                    v-model="report.title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <!-- Kategori -->
                <div class="mb-4">
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Kategori <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select 
                      v-model="report.category" 
                      id="category"
                      class="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm"
                      required
                    >
                      <option value="" disabled>Pilih Kategori</option>
                      <option v-for="category in filteredCategories" :key="category.category_id" :value="category.category_id">
                        {{ category.nama }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Bukti Pelanggaran Checkboxes -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bukti Pelanggaran <span class="text-red-500">*</span></label>
                  <div class="border border-gray-300 rounded-md p-3 bg-gray-50">
                    <div v-for="(bukti, index) in buktiOptions" :key="index" class="mb-2">
                      <label class="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          v-model="selectedBukti" 
                          :value="bukti"
                          class="form-checkbox h-4 w-4 text-red-600" 
                          @change="updateBuktiPelanggaran"
                        />
                        <span class="ml-2 text-sm text-gray-700">{{ bukti }}</span>
                      </label>
                    </div>
                    
                    <!-- Lainnya option with text input -->
                    <div class="mb-2">
                      <label class="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          v-model="showLainnyaInput"
                          class="form-checkbox h-4 w-4 text-red-600"
                          @change="updateBuktiPelanggaran"
                        />
                        <span class="ml-2 text-sm text-gray-700">Lainnya</span>
                      </label>
                      <div v-if="showLainnyaInput" class="mt-2 ml-6">
                        <input
                          type="text"
                          v-model="buktiLainnya"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder="Sebutkan bukti lainnya"
                          @input="updateBuktiPelanggaran"
                        />
                      </div>
                    </div>
                  </div>
                  <p v-if="selectedBukti.length === 0 && !showLainnyaInput && showBuktiWarning" class="text-sm text-red-500 mt-1">
                    Pilih setidaknya satu bukti pelanggaran
                  </p>
                </div>

                <!-- Bukti Laporan (File Input) -->
                <div class="mb-4">
                  <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Bukti Laporan (Foto) <span class="text-red-500">*</span></label>
                  <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input
                      type="file"
                      id="evidence"
                      @change="handleFileUpload"
                      accept="image/*"
                      multiple
                      class="hidden"
                      ref="fileInput"
                    />
                    <div class="cursor-pointer" @click="triggerFileInput">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="mt-1 text-sm text-gray-600">Klik atau seret beberapa file foto</p>
                      <p class="mt-1 text-xs text-gray-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                    </div>
                  </div>
                </div>

                <!-- Image Previews -->
                <div v-if="imagePreviews.length > 0" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Preview Foto ({{ imagePreviews.length }} file)</h4>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div v-for="(preview, index) in imagePreviews" :key="index" class="relative">
                      <img :src="preview" alt="Preview" class="h-24 w-full object-cover rounded-md" />
                      <button 
                        type="button" 
                        @click="removeImage(index)" 
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600"
                        title="Hapus Foto"
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Link Lampiran -->
                <div class="mb-4">
                  <label for="linkLampiran" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                  <input
                    type="url"
                    id="linkLampiran"
                    v-model="report.linkLampiran"
                    placeholder="https://drive.google.com/file/..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Masukkan URL Google Drive, Dropbox, atau layanan cloud lainnya</p>
                </div>
              </div>

              <!-- Right Column -->
              <div>
                <!-- Deskripsi Laporan -->
                <div class="mb-4">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span class="text-red-500">*</span></label>
                  <textarea
                    id="description"
                    v-model="report.description"
                    rows="5"
                    placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  ></textarea>
                </div>

                <!-- Tanggal Kejadian -->
                <div class="mb-4">
                  <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Kejadian <span class="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    id="incidentDate"
                    v-model="report.incidentDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section 2: Informasi Pelapor -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Informasi Pelapor</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                <input
                  type="text"
                  id="reporterName"
                  v-model="report.reporterName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                <input
                  type="text"
                  id="nim"
                  v-model="report.nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="report.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Informasi Terduga/Terlapor -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Informasi Terduga/Terlapor</h3>
            <div v-for="(terduga, index) in report.terlapor" :key="index" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 class="font-medium text-lg mb-3">Terduga {{ index + 1 }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Left column -->
                <div>
                  <div class="mb-4">
                    <label :for="'terduga_nama_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <input
                      :id="'terduga_nama_' + index"
                      type="text"
                      v-model="terduga.nama_lengkap"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div class="mb-4">
                    <label :for="'terduga_email_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      :id="'terduga_email_' + index"
                      type="email"
                      v-model="terduga.email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div class="mb-4">
                    <label :for="'terduga_telepon_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      :id="'terduga_telepon_' + index"
                      type="tel"
                      v-model="terduga.nomor_telepon"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <!-- Radio buttons for gender -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin <span class="text-red-500">*</span></label>
                    <div class="flex space-x-4">
                      <label class="inline-flex items-center">
                        <input 
                          type="radio" 
                          :name="'jenis_kelamin_' + index"
                          v-model="terduga.jenis_kelamin" 
                          value="laki-laki"
                          class="form-radio h-4 w-4 text-red-600" 
                          required
                        />
                        <span class="ml-2 text-sm text-gray-700">Laki-laki</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input 
                          type="radio" 
                          :name="'jenis_kelamin_' + index"
                          v-model="terduga.jenis_kelamin" 
                          value="perempuan"
                          class="form-radio h-4 w-4 text-red-600" 
                          required
                        />
                        <span class="ml-2 text-sm text-gray-700">Perempuan</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Right column -->
                <div>
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur <span class="text-red-500">*</span></label>
                    <div class="bg-white p-3 border border-gray-300 rounded-md">
                      <label class="block mb-2">
                        <input
                          type="radio"
                          :name="'umur_' + index"
                          v-model="terduga.umur_terlapor"
                          value="<20"
                          class="form-radio h-4 w-4 text-red-600"
                          required
                        />
                        <span class="ml-2 text-sm">Kurang dari 20 tahun</span>
                      </label>
                      <label class="block mb-2">
                        <input
                          type="radio"
                          :name="'umur_' + index"
                          v-model="terduga.umur_terlapor"
                          value="20-40"
                          class="form-radio h-4 w-4 text-red-600"
                        />
                        <span class="ml-2 text-sm">20 - 40 tahun</span>
                      </label>
                      <label class="block">
                        <input
                          type="radio"
                          :name="'umur_' + index"
                          v-model="terduga.umur_terlapor"
                          value="40<"
                          class="form-radio h-4 w-4 text-red-600"
                        />
                        <span class="ml-2 text-sm">Lebih dari 40 tahun</span>
                      </label>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label :for="'terduga_status_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                      Status Warga <span class="text-red-500">*</span>
                    </label>
                    <select
                      :id="'terduga_status_' + index"
                      v-model="terduga.status_warga"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    >
                      <option value="" disabled selected>Pilih Status</option>
                      <option value="dosen">Dosen</option>
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="staff">Staff</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label :for="'terduga_unit_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                      Unit Kerja/Program Studi <span class="text-red-500">*</span>
                    </label>
                    <select
                      :id="'terduga_unit_' + index"
                      v-model="terduga.unit_kerja"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    >
                      <option value="" disabled selected>Pilih Unit Kerja/Prodi</option>
                      <option v-for="(unit, unitIndex) in unitKerjaOptions" :key="unitIndex" :value="unit">
                        {{ unit }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="button" 
                  @click="removeTerduga(index)"
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Hapus Terduga
                </button>
              </div>
            </div>
            
            <div class="mt-4">
              <button 
                type="button" 
                @click="addTerduga"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm flex items-center"
              >
                <span class="mr-1">+</span> Tambah Terduga/Terlapor
              </button>
            </div>
          </div>

          <!-- Section 4: Informasi Saksi -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Informasi Saksi</h3>
            <div v-for="(saksi, index) in report.saksi" :key="index" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 class="font-medium text-lg mb-3">Saksi {{ index + 1 }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label :for="'saksi_nama_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap Saksi <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="'saksi_nama_' + index"
                    type="text"
                    v-model="saksi.nama_lengkap"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label :for="'saksi_email_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Saksi <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="'saksi_email_' + index"
                    type="email"
                    v-model="saksi.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label :for="'saksi_telepon_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon Saksi <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="'saksi_telepon_' + index"
                    type="tel"
                    v-model="saksi.nomor_telepon"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              
              <div class="flex justify-end mt-4">
                <button 
                  type="button" 
                  @click="removeSaksi(index)"
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Hapus Saksi
                </button>
              </div>
            </div>
            
            <div class="mt-4">
              <button 
                type="button" 
                @click="addSaksi"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm flex items-center"
              >
                <span class="mr-1">+</span> Tambah Saksi
              </button>
            </div>
          </div>

          <!-- Section 5: Pernyataan -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Pernyataan</h3>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="font-medium">Dengan ini saya menyatakan bahwa:</p>
              <ol class="list-decimal ml-5 my-3 space-y-2">
                <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
              </ol>
              
              <div class="mt-4">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="report.agreement"
                    class="form-checkbox h-5 w-5 text-red-600"
                    required
                  />
                  <span class="ml-2 text-gray-700">Saya menyetujui pernyataan di atas <span class="text-red-500">*</span></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-between pt-6">
            <button
              type="button"
              @click="goBack"
              class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              :disabled="isSubmitting || !report.agreement"
            >
              <span v-if="isSubmitting">Mengirim...</span>
              <span v-else>Kirim Laporan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from 'vue-cookies';
import { decryptData } from '../../../../services/encrypt';

export default {
  name: 'AddKSDosen',
  data() {
    return {
      report: {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFiles: [], // Changed to array for multiple files
        linkLampiran: '',
        agreement: false,
        terlapor: [], // Array for terduga/terlapor
        saksi: [], // Array for saksi
        bukti_pelanggaran: [] // Array for bukti_pelanggaran
      },
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
      isSubmitting: false,
      imagePreviews: []
    };
  },

  mounted() {
    this.fetchCategories();
    this.loadUserData();
    this.addTerduga(); // Initialize with one empty terduga
    this.addSaksi(); // Initialize with one empty saksi
  },

  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category.nama.startsWith('Kekerasan')
      );
    }
  },

  methods: {
    fetchCategories() {
      axios.get('https://v3422040.mhs.d3tiuns.com/api/category')
        .then(response => {
          // Check if response.data is an array directly
          if (Array.isArray(response.data)) {
            this.categories = response.data;
          } 
          // Otherwise check if it has a data property containing the array
          else if (response.data && response.data.data) {
            this.categories = response.data.data;
          } 
          // Handle unexpected formats
          else {
            console.error('Unexpected API response structure:', response.data);
            this.categories = [];
          }
          console.log('Categories loaded:', this.categories);
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
    
    loadUserData() {
      const encryptedUserData = VueCookies.get("user_session");
      if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        this.report.reporterName = userData.name || '';
        this.report.nim = userData.nim || userData.nik || '';
        this.report.phone = userData.no_telp || '';
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      this.report.evidenceFiles = Array.from(event.target.files);
      
      // Generate image previews
      this.imagePreviews = [];
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
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
      this.report.evidenceFiles.splice(index, 1);
      
      // Create a new FileList-like object from the remaining files
      if (this.report.evidenceFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        this.report.evidenceFiles.forEach(file => {
          dataTransfer.items.add(file);
        });
        this.$refs.fileInput.files = dataTransfer.files;
      } else {
        // Reset file input if no more files
        this.$refs.fileInput.value = '';
      }
    },
    
    // Method to update the bukti_pelanggaran array
    updateBuktiPelanggaran() {
      // Start with selected standard options
      let buktiArray = [...this.selectedBukti];
      
      // Add "Lainnya" if it's checked and has a value
      if (this.showLainnyaInput && this.buktiLainnya.trim()) {
        buktiArray.push('Lainnya: ' + this.buktiLainnya.trim());
      }
      
      // Update the report data
      this.report.bukti_pelanggaran = buktiArray;
    },
    
    // Methods for handling terduga/terlapor
    addTerduga() {
      this.report.terlapor.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        unit_kerja: '',
        jenis_kelamin: '',
        umur_terlapor: ''
      });
    },
    
    removeTerduga(index) {
      this.report.terlapor.splice(index, 1);
      if (this.report.terlapor.length === 0) {
        this.addTerduga(); // Always keep at least one terduga field
      }
    },
    
    // Methods for handling saksi
    addSaksi() {
      this.report.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },
    
    removeSaksi(index) {
      this.report.saksi.splice(index, 1);
      if (this.report.saksi.length === 0) {
        this.addSaksi(); // Always keep at least one saksi field
      }
    },
    
    goBack() {
      this.$router.go(-1);
    },
    
    resetForm() {
      this.report = {
        title: '',
        category: '',
        description: '',
        reporterName: this.report.reporterName,
        nim: this.report.nim,
        phone: this.report.phone,
        incidentDate: '',
        evidenceFiles: [],
        linkLampiran: '',
        agreement: false,
        terlapor: [{
          nama_lengkap: '',
          email: '',
          nomor_telepon: '',
          status_warga: '',
          unit_kerja: '',
          jenis_kelamin: '',
          umur_terlapor: ''
        }],
        saksi: [{
          nama_lengkap: '',
          email: '',
          nomor_telepon: ''
        }],
        bukti_pelanggaran: []
      };
      
      this.selectedBukti = [];
      this.showLainnyaInput = false;
      this.buktiLainnya = '';
      this.showBuktiWarning = false;
      this.errors = {};
      this.imagePreviews = [];
      
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    async submitReport() {
      // Reset warnings
      this.showBuktiWarning = false;
      
      // Validate agreement
      if (!this.report.agreement) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Anda harus menyetujui pernyataan untuk melanjutkan'
        });
        return;
      }
      
      // Update bukti_pelanggaran array before submission
      this.updateBuktiPelanggaran();
      
      // Validate bukti_pelanggaran
      if (this.report.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        return;
      }
      
      try {
        this.isSubmitting = true;
        this.errors = {};
        
        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append('judul', this.report.title);
        formData.append('category_id', this.report.category);
        formData.append('deskripsi', this.report.description);
        formData.append('tanggal_kejadian', this.report.incidentDate);
        formData.append('nama_pelapor', this.report.reporterName);
        formData.append('nim_pelapor', this.report.nim);
        formData.append('nomor_telepon', this.report.phone);
        
        // Add lampiran_link
        if (this.report.linkLampiran) {
          formData.append('lampiran_link', this.report.linkLampiran);
        }
        
        // Add bukti_pelanggaran as array
        if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
          this.report.bukti_pelanggaran.forEach(bukti => {
            formData.append('bukti_pelanggaran[]', bukti);
          });
        }
        
        // Add terlapor with proper array format for Laravel
        const terlaporFiltered = this.report.terlapor.filter(t => t.nama_lengkap.trim() !== '');
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
        const saksiFiltered = this.report.saksi.filter(s => s.nama_lengkap.trim() !== '');
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
        if (this.report.evidenceFiles && this.report.evidenceFiles.length > 0) {
          for (let i = 0; i < this.report.evidenceFiles.length; i++) {
            formData.append('image_path[]', this.report.evidenceFiles[i]);
          }
        }
        
        // Agreement field
        formData.append('agreement', this.report.agreement);
        
        // Submit the data to the API
        const response = await axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Handle success
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan berhasil ditambahkan.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.$router.push('/kalab/pelaporankekerasanseksual');
        });
        
        this.resetForm();
        
      } catch (error) {
        console.error('Error submitting form:', error);
        
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data;
          
          // Display first error message
          const firstError = Object.values(this.errors)[0][0];
          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: firstError || 'Mohon periksa kembali form Anda'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Terjadi kesalahan saat mengirim laporan.'
          });
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* No need for additional CSS since we're using Tailwind classes */
</style>