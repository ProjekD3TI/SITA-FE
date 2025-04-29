<template>
  <div>
    <Header />
    <div class="container mx-auto px-4 py-8 mt-16">
      <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Laporan Kekerasan Seksual</h2>

        <form @submit.prevent="submitReport" class="space-y-6">
          <!-- Detail Laporan Section -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Detail Laporan</h3>
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
                  <div class="bg-gray-50 p-3 rounded-md border border-gray-300">
                    <div v-for="(bukti, index) in buktiOptions" :key="index" class="mb-2">
                      <div class="flex items-start">
                        <input
                          type="checkbox"
                          :id="'bukti_' + index"
                          v-model="selectedBukti"
                          :value="bukti"
                          class="mt-1 mr-2"
                          @change="updateBuktiPelanggaran"
                        />
                        <label :for="'bukti_' + index" class="text-sm">{{ bukti }}</label>
                      </div>
                    </div>
                    
                    <!-- Lainnya option -->
                    <div class="mb-2">
                      <div class="flex items-start">
                        <input
                          type="checkbox"
                          id="bukti_lainnya_check"
                          v-model="showLainnyaInput"
                          class="mt-1 mr-2"
                          @change="updateBuktiPelanggaran"
                        />
                        <label for="bukti_lainnya_check" class="text-sm">Lainnya</label>
                      </div>
                      
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
                    
                    <div v-if="showBuktiWarning" class="text-red-500 text-xs mt-1">
                      Pilih setidaknya satu bukti pelanggaran
                    </div>
                  </div>
                </div>

                <!-- Link Lampiran -->
                <div class="mb-4">
                  <label for="link" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                  <input
                    type="url"
                    id="link"
                    v-model="report.lampiran_link"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="https://drive.google.com/file/..."
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                    required
                  ></textarea>
                </div>

                <!-- Tanggal & Waktu Kejadian -->
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

                <!-- Multiple Image Upload -->
                <div class="mb-4">
                  <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                  <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                    <input
                      type="file"
                      id="evidence"
                      multiple
                      @change="handleFileUpload"
                      accept="image/*"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div class="space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="text-sm text-gray-600">Klik atau seret beberapa file foto</p>
                      <p class="text-xs text-gray-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                    </div>
                  </div>
                  
                  <!-- Image Previews -->
                  <div v-if="imagePreviews.length > 0" class="mt-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Preview Foto ({{ imagePreviews.length }} file)</h4>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div v-for="(preview, index) in imagePreviews" :key="index" class="relative group">
                        <img :src="preview" alt="Preview" class="w-full h-24 object-cover rounded-md border border-gray-300" />
                        <button 
                          type="button" 
                          @click="removeImage(index)" 
                          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          title="Hapus Foto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Pelapor Section -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Pelapor</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="mb-4">
                  <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="reporterName"
                    v-model="report.reporterName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="nim"
                    v-model="report.nim"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              <div>
                <div class="mb-4">
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor <span class="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="report.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Terduga/Terlapor Section -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Terduga/Terlapor</h3>
            
            <!-- Anonymous Instruction Info Box -->
            <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    Jika terduga adalah anonim, berikan inputan <span class="font-bold">"anonim"</span> untuk nama dan <span class="font-bold">"anonim@gmail.com"</span> untuk email.
                  </p>
                </div>
              </div>
            </div>
            
            <div v-for="(terduga, index) in report.terlapor" :key="index" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 class="font-medium text-lg mb-3 text-gray-700">Terduga {{ index + 1 }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <!-- Nama Terduga -->
                  <div class="mb-4">
                    <label :for="'terduga_nama_' + index" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
                    <input
                      :id="'terduga_nama_' + index"
                      type="text"
                      v-model="terduga.nama_lengkap"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Masukkan nama atau 'anonim'"
                      required
                    />
                  </div>

                  <!-- Email Terduga -->
                  <div class="mb-4">
                    <label :for="'terduga_email_' + index" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      :id="'terduga_email_' + index"
                      type="email"
                      v-model="terduga.email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Masukkan email atau 'anonim@gmail.com'"
                    />
                  </div>

                  <!-- Nomor Telepon Terduga -->
                  <div class="mb-4">
                    <label :for="'terduga_nomor_telepon_' + index" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    <input
                      :id="'terduga_nomor_telepon_' + index"
                      type="tel"
                      v-model="terduga.nomor_telepon"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <!-- Jenis Kelamin -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin <span class="text-red-500">*</span></label>
                    <div class="flex space-x-4">
                      <div class="flex items-center">
                        <input 
                          type="radio" 
                          :id="'gender_male_' + index" 
                          :name="'jenis_kelamin_' + index" 
                          v-model="terduga.jenis_kelamin" 
                          value="laki-laki"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          required
                        />
                        <label :for="'gender_male_' + index" class="ml-2 text-sm text-gray-700">Laki-laki</label>
                      </div>
                      
                      <div class="flex items-center">
                        <input 
                          type="radio" 
                          :id="'gender_female_' + index" 
                          :name="'jenis_kelamin_' + index" 
                          v-model="terduga.jenis_kelamin" 
                          value="perempuan"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          required
                        />
                        <label :for="'gender_female_' + index" class="ml-2 text-sm text-gray-700">Perempuan</label>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Status Warga -->
                  <div class="mb-4">
                    <label :for="'terduga_status_warga_' + index" class="block text-sm font-medium text-gray-700 mb-1">Status Warga <span class="text-red-500">*</span></label>
                    <select
                      :id="'terduga_status_warga_' + index"
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
                </div>
              </div>
              
              <!-- Terduga Actions -->
              <div class="text-right mt-2">
                <button 
                  type="button" 
                  @click="removeTerduga(index)" 
                  class="py-1 px-3 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Hapus Terduga
                </button>
              </div>
            </div>
            
            <!-- Add Terduga Button -->
            <button 
              type="button" 
              @click="addTerduga" 
              class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              + Tambah Terduga/Terlapor
            </button>
          </div>
          
          <!-- Informasi Saksi Section -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Saksi</h3>
            
            <div v-for="(saksi, index) in report.saksi" :key="index" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 class="font-medium text-lg mb-3 text-gray-700">Saksi {{ index + 1 }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <!-- Nama Saksi -->
                  <div class="mb-4">
                    <label :for="'saksi_nama_' + index" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Saksi <span class="text-red-500">*</span></label>
                    <input
                      :id="'saksi_nama_' + index"
                      type="text"
                      v-model="saksi.nama_lengkap"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <!-- Email Saksi -->
                  <div class="mb-4">
                    <label :for="'saksi_email_' + index" class="block text-sm font-medium text-gray-700 mb-1">Email Saksi <span class="text-red-500">*</span></label>
                    <input
                      :id="'saksi_email_' + index"
                      type="email"
                      v-model="saksi.email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <!-- Nomor Telepon Saksi -->
              <div class="mb-4 max-w-md">
                <label :for="'saksi_nomor_telepon_' + index" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon Saksi <span class="text-red-500">*</span></label>
                <input
                  :id="'saksi_nomor_telepon_' + index"
                  type="tel"
                  v-model="saksi.nomor_telepon"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
              
              <!-- Saksi Actions -->
              <div class="text-right mt-2">
                <button 
                  type="button" 
                  @click="removeSaksi(index)" 
                  class="py-1 px-3 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Hapus Saksi
                </button>
              </div>
            </div>
            
            <!-- Add Saksi Button -->
            <button 
              type="button" 
              @click="addSaksi" 
              class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              + Tambah Saksi
            </button>
          </div>

          <!-- Pernyataan Section -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-4 text-gray-700">Pernyataan</h3>
            
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p class="font-medium mb-2">Dengan ini saya menyatakan bahwa:</p>
              <ol class="list-decimal pl-6 mb-4 space-y-2">
                <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
              </ol>
              
              <div class="flex items-start mt-3">
                <input
                  type="checkbox"
                  id="agreement"
                  v-model="report.agreement"
                  class="mt-1 mr-2 focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                  required
                />
                <label for="agreement" class="text-sm">
                  Saya menyetujui pernyataan di atas <span class="text-red-500">*</span>
                </label>
              </div>
              
              <div v-if="showAgreementWarning" class="text-red-500 text-xs mt-1 ml-6">
                Anda harus menyetujui pernyataan ini untuk melanjutkan
              </div>
            </div>
          </div>
          
          <!-- reCAPTCHA v2 -->
          <div class="mb-6">
            <div class="flex flex-col items-center">
              <div ref="recaptchaContainer"></div>
              <div v-if="recaptchaError" class="text-red-500 text-xs mt-2">
                {{ recaptchaError }}
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              id="cancelButton"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="goBack"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="isSubmitting || !report.agreement || !recaptchaVerified"
              :class="{
                'opacity-75 cursor-not-allowed': !report.agreement || !recaptchaVerified,
                'hover:bg-red-700': report.agreement && recaptchaVerified
              }"
            >
              <span v-if="isSubmitting">Mengirim...</span>
              <span v-else>Simpan Laporan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../../components/Header.vue';
import Footer from '../../components/Footer.vue';

export default {
  name: 'LaporKekerasanSeksual',
  components: {
    Header,
    Footer
  },
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
        evidenceFiles: null,
        lampiran_link: '',
        bukti_pelanggaran: [],
        agreement: false,
        terlapor: [],
        saksi: []
      },
      categories: [],
      selectedBukti: [],
      buktiOptions: [
        'Bukti transfer, cek, bukti penyetoran, dan rekening koran bank',
        'Dokumen dan/atau rekaman',
        'Foto dokumentasi',
        'Surat disposisi perintah',
        'Identitas sumber informasi'
      ],
      showLainnyaInput: false,
      buktiLainnya: '',
      showBuktiWarning: false,
      showAgreementWarning: false,
      isSubmitting: false,
      imagePreviews: [],
      selectedFiles: [],
      currentDateTime: '2025-04-29 09:25:10', // Updated with the time you just provided
      currentUser: 'miftahul01',
      
      // reCAPTCHA v2 Configuration
      recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Replace with your reCAPTCHA v2 site key
      recaptchaVerified: false,
      recaptchaResponse: null,
      recaptchaError: null
    };
  },

  mounted() {
    this.fetchCategories();
    this.addTerduga();
    this.addSaksi();
    this.loadRecaptchaScript();
  },

  methods: {
    loadRecaptchaScript() {
      // Only load the script if it hasn't been loaded yet
      if (window.grecaptcha) {
        this.renderRecaptcha();
        return;
      }
      
      // Load the reCAPTCHA v2 script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
      script.async = true;
      script.defer = true;
      
      // Define the callback function that will be called when reCAPTCHA is loaded
      window.onRecaptchaLoaded = () => {
        this.renderRecaptcha();
      };
      
      script.onerror = () => {
        console.error('Error loading reCAPTCHA script');
        this.recaptchaError = 'Gagal memuat reCAPTCHA. Silakan muat ulang halaman.';
      };
      
      document.head.appendChild(script);
    },
    
    renderRecaptcha() {
      // Wait until the DOM element is available
      if (!this.$refs.recaptchaContainer) {
        setTimeout(() => this.renderRecaptcha(), 100);
        return;
      }
      
      try {
        // Render the reCAPTCHA v2 checkbox widget
        window.grecaptcha.render(this.$refs.recaptchaContainer, {
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
            console.log('reCAPTCHA verification expired');
          },
          'error-callback': () => {
            this.recaptchaResponse = null;
            this.recaptchaVerified = false;
            this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
            console.error('reCAPTCHA error');
          }
        });
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
        this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
      }
    },
    
    resetRecaptcha() {
      if (window.grecaptcha) {
        try {
          window.grecaptcha.reset();
          this.recaptchaVerified = false;
          this.recaptchaResponse = null;
        } catch (error) {
          console.error('Error resetting reCAPTCHA:', error);
        }
      }
    },
    
    fetchCategories() {
      axios.get('http://localhost:8000/api/category')
        .then(response => {
          // Check if response.data is an array directly
          if (Array.isArray(response.data)) {
            this.categories = response.data;
          } 
          // Otherwise check if it has a data property containing the array (as originally expected)
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
    
    resetForm() {
      this.report = {
        title: '',
        category: '',
        description: '',
        reporterName: '',
        nim: '',
        phone: '',
        incidentDate: '',
        evidenceFiles: null,
        lampiran_link: '',
        bukti_pelanggaran: [],
        agreement: false,
        terlapor: [{
          nama_lengkap: '',
          email: '',
          nomor_telepon: '',
          status_warga: '',
          jenis_kelamin: ''
        }],
        saksi: [{
          nama_lengkap: '',
          email: '',
          nomor_telepon: ''
        }]
      };
      this.selectedBukti = [];
      this.showLainnyaInput = false;
      this.buktiLainnya = '';
      this.showBuktiWarning = false;
      this.showAgreementWarning = false;
      this.imagePreviews = [];
      this.selectedFiles = [];
      this.recaptchaError = null;
      
      // Reset reCAPTCHA
      this.resetRecaptcha();
      
      // Reset file input
      const fileInput = document.getElementById('evidence');
      if (fileInput) fileInput.value = '';
    },
    
    async submitReport() {
      // Reset warnings
      this.showBuktiWarning = false;
      this.showAgreementWarning = false;
      this.recaptchaError = null;
      
      // Validate agreement
      if (!this.report.agreement) {
        this.showAgreementWarning = true;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Anda harus menyetujui pernyataan untuk melanjutkan'
        });
        return;
      }
      
      // Validate reCAPTCHA
      if (!this.recaptchaVerified || !this.recaptchaResponse) {
        this.recaptchaError = 'Harap centang kotak reCAPTCHA "Saya bukan robot"';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Harap centang kotak reCAPTCHA untuk melanjutkan'
        });
        return;
      }
      
      // Update bukti_pelanggaran array before submission
      this.updateBuktiPelanggaran();
      
      // Validate bukti_pelanggaran if needed
      if (this.report.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        return;
      }
      
      try {
        // Show loading state
        this.isSubmitting = true;
        
        // Create FormData object to handle file upload
        const formData = new FormData();
        formData.append('judul', this.report.title);
        formData.append('category_id', this.report.category);
        formData.append('deskripsi', this.report.description);
        formData.append('nama_pelapor', this.report.reporterName);
        formData.append('nim_pelapor', this.report.nim);
        formData.append('nomor_telepon', this.report.phone);
        formData.append('tanggal_kejadian', this.report.incidentDate);
        formData.append('current_datetime', this.currentDateTime);
        formData.append('username', this.currentUser);
        formData.append('g-recaptcha-response', this.recaptchaResponse);
        
        // Add lampiran_link
        if (this.report.lampiran_link) {
          formData.append('lampiran_link', this.report.lampiran_link);
        }
        
        // Add bukti_pelanggaran as array
        if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
          for (let i = 0; i < this.report.bukti_pelanggaran.length; i++) {
            formData.append('bukti_pelanggaran[]', this.report.bukti_pelanggaran[i]);
          }
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
        const response = await axios.post('http://localhost:8000/api/laporan_kekerasan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        
        // Handle success
        Swal.fire({
          icon: 'success',
          title: 'Sukses!',
          text: 'Laporan berhasil dikirimkan',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.resetForm();
        
      } catch (error) {
        // Handle error
        console.error('Error submitting report:', error);
        
        if (error.response && error.response.status === 400) {
          console.error('Validation errors:', error.response.data);
          
          let errorMessage = 'Terjadi kesalahan pada form:';
          const errors = error.response.data;
          
          // Create a readable error message
          Object.keys(errors).forEach(key => {
            errorMessage += `\n- ${errors[key][0]}`;
          });
          
          Swal.fire({
            icon: 'error',
            title: 'Validasi Form Gagal',
            text: errorMessage
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: typeof error === 'string' ? error : 'Terjadi kesalahan saat mengirim laporan.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      } finally {
        this.isSubmitting = false;
      }
    },
    
    handleFileUpload(event) {
      // Store selected files
      this.selectedFiles = Array.from(event.target.files);
      this.report.evidenceFiles = event.target.files;
      
      // Check file size limitations (max 5MB per file)
      let oversizedFiles = [];
      for (let file of this.selectedFiles) {
        if (file.size > 5 * 1024 * 1024) {
          oversizedFiles.push(file.name);
        }
      }
      
      if (oversizedFiles.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: `File berikut melebihi batas 5MB: ${oversizedFiles.join(', ')}`,
          confirmButtonColor: '#3085d6',
        });
        event.target.value = ''; // Clear the file input
        this.selectedFiles = [];
        this.report.evidenceFiles = null;
        return;
      }
      
      // Generate preview images
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
      this.selectedFiles.splice(index, 1);
      
      // Create a new FileList-like object from the remaining files
      const dataTransfer = new DataTransfer();
      this.selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      // Update the input element's files and form data
      this.report.evidenceFiles = dataTransfer.files;
      document.getElementById('evidence').files = dataTransfer.files;
    },
    
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
    
    addTerduga() {
      this.report.terlapor.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: '',
        status_warga: '',
        jenis_kelamin: ''
      });
    },
    
    removeTerduga(index) {
      this.report.terlapor.splice(index, 1);
      if (this.report.terlapor.length === 0) {
        this.addTerduga(); // Always keep at least one terduga field
      }
    },
    
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
    }
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category.nama && category.nama.startsWith('Kekerasan')
      );
    }
  }
};
</script>

<style scoped>
/* Custom styling */
.text-red-500 {
  color: #f56565;
}
</style>