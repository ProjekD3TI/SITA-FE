<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Laporan Kekerasan Seksual</h2>
      <form @submit.prevent="submitReport" class="space-y-6" name="reportForm" id="reportForm">
        <!-- Section 1: Detail Laporan -->
        <div class="form-section border-b pb-6 mb-6">
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
                  name="title"
                  v-model="report.title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  maxlength="50"
                  required
                />
                <p class="text-xs text-gray-500 mt-1">Maksimal 50 karakter</p>
                <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title[0] }}</p>
              </div>

              <!-- Kategori -->
              <div class="mb-4">
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Kategori <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select 
                    v-model="report.category"
                    id="category"
                    name="category"
                    class="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm"
                    required
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    <option v-for="category in filteredCategories" :key="category.category_id" :value="category.category_id">
                      {{ category.nama }}
                    </option>
                  </select>
                </div>
                <p v-if="errors.category_id" class="text-red-500 text-xs mt-1">{{ errors.category_id[0] }}</p>
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
                <p v-if="selectedBukti.length === 0 && !showLainnyaInput && showBuktiWarning" class="text-red-500 text-xs mt-1">
                  Pilih setidaknya satu bukti pelanggaran
                </p>
              </div>
              
              <!-- Link Lampiran -->
              <div class="mb-4">
                <label for="linkLampiran" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                <input
                  type="url"
                  id="linkLampiran"
                  name="linkLampiran"
                  v-model="report.lampiran_link"
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
                  name="description"
                  v-model="report.description"
                  rows="5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                  required
                ></textarea>
                <p v-if="errors.deskripsi" class="text-red-500 text-xs mt-1">{{ errors.deskripsi[0] }}</p>
              </div>

              <!-- Tanggal & Waktu Kejadian -->
              <div class="mb-4">
                <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Kejadian <span class="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  id="incidentDate"
                  name="incidentDate"
                  v-model="report.incidentDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
                <p v-if="errors.tanggal_kejadian" class="text-red-500 text-xs mt-1">{{ errors.tanggal_kejadian[0] }}</p>
              </div>
              
              <!-- Bukti Laporan (File Input) Multiple -->
              <div class="mb-4">
                <label for="fileInput" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <input
                    type="file"
                    id="fileInput"
                    ref="fileInput"
                    multiple
                    @change="handleFileUpload"
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="mt-1 text-sm text-gray-600">Klik atau seret beberapa file foto</p>
                  <p class="mt-1 text-xs text-gray-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                </div>
                <p v-if="errors.image_path" class="text-red-500 text-xs mt-1">{{ errors.image_path[0] }}</p>
              </div>
              
              <!-- Image Previews -->
              <div v-if="imagePreviews.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Preview Foto ({{ imagePreviews.length }} file)</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div v-for="(preview, index) in imagePreviews" :key="index" class="relative group">
                    <img :src="preview" alt="Preview" class="h-24 w-full object-cover rounded-md" />
                    <button 
                      type="button" 
                      @click="removeImage(index)" 
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus Foto"
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Section 2: Informasi Pelapor -->
        <div class="form-section border-b pb-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Informasi Pelapor</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div>
              <div class="mb-4">
                <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                <input
                  type="text"
                  id="reporterName"
                  v-model="report.reporterName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
                <p v-if="errors.nama_pelapor" class="text-red-500 text-xs mt-1">{{ errors.nama_pelapor[0] }}</p>
              </div>

              <div class="mb-4">
                <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                <input
                  type="text"
                  id="nim"
                  v-model="report.nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
                <p v-if="errors.nim_pelapor" class="text-red-500 text-xs mt-1">{{ errors.nim_pelapor[0] }}</p>
              </div>

              <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="report.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
                <p v-if="errors.nomor_telepon" class="text-red-500 text-xs mt-1">{{ errors.nomor_telepon[0] }}</p>
              </div>
              
              <!-- Profesi Field -->
              <div class="mb-4">
                <label for="profesi" class="block text-sm font-medium text-gray-700 mb-1">Profesi <span class="text-red-500">*</span></label>
                <select
                  id="profesi"
                  v-model="report.profesi"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                >
                  <option value="" disabled selected>Pilih Profesi</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                  <option value="Staff">Staff</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <p v-if="errors.profesi" class="text-red-500 text-xs mt-1">{{ errors.profesi[0] }}</p>
              </div>
            </div>
            
            <!-- Right Column -->
            <div>
              <!-- Jenis Kelamin Field -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin Pelapor <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      name="jenis_kelamin" 
                      id="jenis_kelamin_male"
                      v-model="report.jenis_kelamin" 
                      value="laki-laki"
                      class="form-radio h-4 w-4 text-red-600 border-gray-300" 
                      required
                    />
                    <label for="jenis_kelamin_male" class="ml-2 text-sm text-gray-700">Laki-laki</label>
                  </div>
                  <div class="flex items-center">
                    <input 
                      type="radio" 
                      name="jenis_kelamin"
                      id="jenis_kelamin_female" 
                      v-model="report.jenis_kelamin" 
                      value="perempuan"
                      class="form-radio h-4 w-4 text-red-600 border-gray-300"
                      required
                    />
                    <label for="jenis_kelamin_female" class="ml-2 text-sm text-gray-700">Perempuan</label>
                  </div>
                </div>
                <p v-if="errors.jenis_kelamin" class="text-red-500 text-xs mt-1">{{ errors.jenis_kelamin[0] }}</p>
              </div>
              
              <!-- Rentang Umur Field -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur <span class="text-red-500">*</span></label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-300">
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="below20"
                      name="umur_pelapor"
                      v-model="report.umur_pelapor"
                      value="<20"
                      class="form-radio h-4 w-4 text-red-600 border-gray-300"
                      required
                    />
                    <label for="below20" class="ml-2 text-sm text-gray-700">Kurang dari 20 tahun</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="20to40"
                      name="umur_pelapor"
                      v-model="report.umur_pelapor"
                      value="20-40"
                      class="form-radio h-4 w-4 text-red-600 border-gray-300"
                    />
                    <label for="20to40" class="ml-2 text-sm text-gray-700">20 - 40 tahun</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="above40"
                      name="umur_pelapor"
                      v-model="report.umur_pelapor"
                      value="40<"
                      class="form-radio h-4 w-4 text-red-600 border-gray-300"
                    />
                    <label for="above40" class="ml-2 text-sm text-gray-700">Lebih dari 40 tahun</label>
                  </div>
                </div>
                <p v-if="errors.umur_pelapor" class="text-red-500 text-xs mt-1">{{ errors.umur_pelapor[0] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Informasi Terduga -->
        <div class="form-section border-b pt-6 pb-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Informasi Terduga/Terlapor</h3>
          <p v-if="errors.terlapor" class="text-red-500 text-sm mb-2">{{ errors.terlapor[0] }}</p>
          
          <div v-for="(terduga, index) in report.terlapor" :key="index" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 class="font-medium text-lg mb-3">Terduga {{ index + 1 }}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <!-- Nama Terduga -->
                <div class="mb-4">
                  <label :for="'terduga_nama_' + index" class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input
                    :id="'terduga_nama_' + index"
                    type="text"
                    v-model="terduga.nama_lengkap"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    maxlength="255"
                    required
                  />
                  <p class="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
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
                    maxlength="255"
                  />
                  <p class="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
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
                    maxlength="20"
                  />
                  <p class="text-xs text-gray-500 mt-1">Maksimal 20 karakter</p>
                </div>
              </div>
              <div>
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
                
                <!-- Unit Kerja/Prodi -->
                <div class="mb-4">
                  <label :for="'terduga_unit_' + index" class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja/Program Studi <span class="text-red-500">*</span></label>
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
                
                <!-- Rentang Umur -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur <span class="text-red-500">*</span></label>
                  <div class="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-300">
                    <div class="flex items-center">
                      <input
                        type="radio"
                        :id="`terlapor-below20-${index}`"
                        :name="'umur_' + index"
                        v-model="terduga.umur_terlapor"
                        value="<20"
                        class="form-radio h-4 w-4 text-red-600"
                        required
                      />
                      <label :for="`terlapor-below20-${index}`" class="ml-2 text-sm">Kurang dari 20 tahun</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="radio"
                        :id="`terlapor-20to40-${index}`"
                        :name="'umur_' + index"
                        v-model="terduga.umur_terlapor"
                        value="20-40"
                        class="form-radio h-4 w-4 text-red-600"
                      />
                      <label :for="`terlapor-20to40-${index}`" class="ml-2 text-sm">20 - 40 tahun</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="radio"
                        :id="`terlapor-above40-${index}`"
                        :name="'umur_' + index"
                        v-model="terduga.umur_terlapor"
                        value="40<"
                        class="form-radio h-4 w-4 text-red-600"
                      />
                      <label :for="`terlapor-above40-${index}`" class="ml-2 text-sm">Lebih dari 40 tahun</label>
                    </div>
                  </div>
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
        <div class="form-section border-b pt-6 pb-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Informasi Saksi</h3>
          <p v-if="errors.saksi" class="text-red-500 text-sm mb-2">{{ errors.saksi[0] }}</p>
          
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
                  maxlength="255"
                  required
                />
                <p class="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
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
                  maxlength="255"
                  required
                />
                <p class="text-xs text-gray-500 mt-1">Maksimal 255 karakter</p>
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
                  maxlength="20"
                  required
                />
                <p class="text-xs text-gray-500 mt-1">Maksimal 20 karakter</p>
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
        <div class="form-section border-b pt-6 pb-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Pernyataan</h3>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="font-medium mb-2">Dengan ini saya menyatakan bahwa:</p>
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
              <p v-if="errors.agreement" class="text-red-500 text-xs mt-1">{{ errors.agreement[0] }}</p>
            </div>
          </div>
        </div>

        <!-- reCAPTCHA Section in your template -->
        <div class="form-section border-t pt-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Verifikasi</h3>
          <div class="flex flex-col items-center mb-4">
            <div ref="recaptchaContainer" class="recaptcha-wrapper"></div>
          </div>
          <p v-if="errors['g-recaptcha-response']" class="text-red-500 text-xs text-center mt-1">{{ errors['g-recaptcha-response'][0] }}</p>
          <p v-if="recaptchaError" class="text-red-500 text-xs text-center mb-4">{{ recaptchaError }}</p>
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
  type="button"  
  class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
  :disabled="isSubmitting"
  :class="{'opacity-70 cursor-not-allowed': isSubmitting}"
  @click="submitReportWithDebug"
>
  <span v-if="isSubmitting">
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Mengirim...
  </span>
  <span v-else>Simpan Laporan</span>
</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from "vue-cookies";
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
        evidenceFiles: [],
        lampiran_link: '',
        agreement: false,
        terlapor: [],
        saksi: [],
        bukti_pelanggaran: [],
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
      },
      selectedBukti: [],
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
      imagePreviews: [],
      selectedFiles: [],
      currentUser: null,
      formattedDateTime: null,
      
      // reCAPTCHA v2 Configuration
      recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      recaptchaVerified: false,
      recaptchaResponse: null,
      recaptchaError: null
    };
  },
  
  created() {
    this.loadUserData();
    this.addTerduga();
    this.addSaksi();
  },
  
  mounted() {
    this.fetchCategories();
    this.loadRecaptchaScript();
  },
  
  beforeUnmount() {
    // Reset reCAPTCHA if component is destroyed
    this.resetRecaptcha();
  },
  
  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category.nama && category.nama.startsWith('Kekerasan')
      );
    }
  },
  
  methods: {
    // Add these methods to your component
loadRecaptchaScript() {
  // First, check if reCAPTCHA is already loaded
  if (window.grecaptcha && window.grecaptcha.render) {
    console.log("reCAPTCHA already loaded, rendering directly");
    this.renderRecaptcha();
    return;
  }
  
  // Define the callback function that will be called when reCAPTCHA is loaded
  window.onRecaptchaLoaded = () => {
    console.log("reCAPTCHA script loaded");
    this.renderRecaptcha();
  };
  
  // Load the script only if it's not already present
  const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      console.error('Error loading reCAPTCHA script');
      this.recaptchaError = 'Gagal memuat reCAPTCHA. Silakan muat ulang halaman.';
    };
    
    document.head.appendChild(script);
  }
},

renderRecaptcha() {
  // Wait until the DOM element is available
  if (!this.$refs.recaptchaContainer) {
    console.log("recaptchaContainer ref not found, retrying...");
    setTimeout(() => this.renderRecaptcha(), 100);
    return;
  }
  
  try {
    console.log("Rendering reCAPTCHA");
    
    // Clear existing content
    this.$refs.recaptchaContainer.innerHTML = '';
    
    // Render the reCAPTCHA v2 checkbox widget
    if (window.grecaptcha && window.grecaptcha.render) {
      const widgetId = window.grecaptcha.render(this.$refs.recaptchaContainer, {
        'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Google's test key
        'callback': (response) => {
          console.log("reCAPTCHA callback received");
          this.recaptchaResponse = response;
          this.recaptchaVerified = true;
          this.recaptchaError = null;
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
          this.recaptchaResponse = null;
          this.recaptchaVerified = false;
          this.recaptchaError = 'Verifikasi reCAPTCHA telah kedaluwarsa. Silakan centang kembali.';
        },
        'error-callback': () => {
          console.log("reCAPTCHA error");
          this.recaptchaResponse = null;
          this.recaptchaVerified = false;
          this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
        }
      });
      
      // Store the widget ID for future reference
      this.recaptchaWidgetId = widgetId;
    } else {
      console.error("grecaptcha.render is not available");
      this.recaptchaError = 'Gagal memuat reCAPTCHA. Silakan muat ulang halaman.';
      
      // Try to load the script again
      setTimeout(() => this.loadRecaptchaScript(), 500);
    }
  } catch (error) {
    console.error('Error rendering reCAPTCHA:', error);
    this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
  }
},

resetRecaptcha() {
  if (window.grecaptcha) {
    try {
      if (typeof this.recaptchaWidgetId !== 'undefined') {
        window.grecaptcha.reset(this.recaptchaWidgetId);
      } else if (this.$refs.recaptchaContainer) {
        // If we don't have a widget ID, try to reset all widgets
        window.grecaptcha.reset();
      }
      
      this.recaptchaVerified = false;
      this.recaptchaResponse = null;
      console.log("reCAPTCHA reset successful");
    } catch (e) {
      console.error("Error resetting reCAPTCHA:", e);
      
      // If reset fails, try to re-render
      setTimeout(() => this.renderRecaptcha(), 200);
    }
  }
},

reloadReCaptcha() {
  console.log("Reloading reCAPTCHA");
  
  // Reset state
  this.recaptchaVerified = false;
  this.recaptchaResponse = null;
  
  // Clear the container
  if (this.$refs.recaptchaContainer) {
    this.$refs.recaptchaContainer.innerHTML = '';
  }
  
  // Load the script again
  this.loadRecaptchaScript();
  
  // Show user feedback
  this.$nextTick(() => {
    Swal.fire({
      icon: 'info',
      title: 'Memuat Ulang Verifikasi',
      text: 'Sistem verifikasi sedang dimuat ulang...',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  });
},
    
    fetchCategories() {
      axios.get('https://v3422040.mhs.d3tiuns.com/api/category', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
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
    
    loadUserData() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.report.reporterName = userData.name || 'Miftahul';
          this.report.nim = userData.nim || userData.nik || 'miftahul01judul';
          this.report.phone = userData.no_telp || '';
          this.currentUser = userData.username || 'miftahul01judul';
        } else {
          this.report.reporterName = 'Miftahul';
          this.report.nim = 'miftahul01judul';
          this.report.phone = '';
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        this.report.reporterName = 'Miftahul';
        this.report.nim = 'miftahul01judul';
        this.report.phone = '';
      }
    },
    
    handleFileUpload(event) {
      const files = event.target.files;
      
      // Store files both in report and selectedFiles array
      this.report.evidenceFiles = files;
      this.selectedFiles = Array.from(files);
      
      // Validate file types and sizes
      let hasInvalidFile = false;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      for (let file of this.selectedFiles) {
        if (!allowedTypes.includes(file.type) || file.size > maxSize) {
          hasInvalidFile = true;
          break;
        }
      }
      
      // Generate image previews
      this.imagePreviews = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (allowedTypes.includes(file.type) && file.size <= maxSize) {
          const reader = new FileReader();
          reader.onload = e => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
      
      if (hasInvalidFile) {
        Swal.fire({
          icon: 'warning',
          title: 'File Tidak Valid',
          text: 'Beberapa file tidak dapat diupload karena tipe file tidak valid atau ukuran melebihi 5MB'
        });
      }
    },
    
    removeImage(index) {
      this.imagePreviews.splice(index, 1);
      this.report.evidenceFiles.splice(index, 1);
      
      if (this.report.evidenceFiles.length === 0 && this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    updateBuktiPelanggaran() {
      let buktiArray = [...this.selectedBukti];
      
      if (this.showLainnyaInput && this.buktiLainnya.trim()) {
        buktiArray.push('Lainnya: ' + this.buktiLainnya.trim());
      }
      
      this.report.bukti_pelanggaran = buktiArray;
      
      if (buktiArray.length > 0) {
        this.showBuktiWarning = false;
      }
    },
    
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
        this.addTerduga();
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
        this.addSaksi();
      }
    },
    
    goBack() {
      this.$router.push('/pelaporan/kekerasan-seksual');
    },
    
    validateForm() {
      let isValid = true;
      this.errors = {};
      this.showBuktiWarning = false;
      
      console.log("Validating form...");
      
      // Title validation
      if (!this.report.title) {
        this.errors.title = ['Judul laporan harus diisi'];
        isValid = false;
        console.log("Title validation failed");
      } else if (this.report.title.length > 50) {
        this.errors.title = ['Judul laporan maksimal 50 karakter'];
        isValid = false;
        console.log("Title too long");
      }
      
      // Category validation
      if (!this.report.category) {
        this.errors.category_id = ['Kategori harus dipilih'];
        isValid = false;
        console.log("Category validation failed");
      }
      
      // Description validation
      if (!this.report.description) {
        this.errors.deskripsi = ['Deskripsi harus diisi'];
        isValid = false;
        console.log("Description validation failed");
      }
      
      // Incident date validation
      if (!this.report.incidentDate) {
        this.errors.tanggal_kejadian = ['Tanggal kejadian harus diisi'];
        isValid = false;
        console.log("Incident date validation failed");
      }
      
      // Profesi validation
      if (!this.report.profesi) {
        this.errors.profesi = ['Profesi harus dipilih'];
        isValid = false;
        console.log("Profesi validation failed");
      }
      
      // Jenis kelamin validation
      if (!this.report.jenis_kelamin) {
        this.errors.jenis_kelamin = ['Jenis kelamin harus dipilih'];
        isValid = false;
        console.log("Jenis kelamin validation failed");
      }
      
      // Umur pelapor validation
      if (!this.report.umur_pelapor) {
        this.errors.umur_pelapor = ['Rentang umur harus dipilih'];
        isValid = false;
        console.log("Umur pelapor validation failed");
      }
      
      // Bukti pelanggaran validation
      if (!this.report.bukti_pelanggaran || this.report.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        isValid = false;
        console.log("Bukti pelanggaran validation failed");
      }
      
      // Evidence files validation
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        this.errors.image_path = ['File bukti foto harus diunggah'];
        isValid = false;
        console.log("Evidence files validation failed");
      }
      
      // Check agreement
      if (!this.report.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
        isValid = false;
        console.log("Agreement validation failed");
      }
      
      // Check reCAPTCHA again
      if (!this.recaptchaVerified || !this.recaptchaResponse) {
        this.errors['g-recaptcha-response'] = ['Harap centang kotak reCAPTCHA "Saya bukan robot"'];
        isValid = false;
        console.log("reCAPTCHA validation failed");
      }
      
      console.log("Validation result:", isValid ? "PASS" : "FAIL");
      return isValid;
    },
    
    submsubmitReport() {
  // Update bukti_pelanggaran before validation
  this.updateBuktiPelanggaran();
  
  // Check reCAPTCHA first
  if (!this.recaptchaVerified || !this.recaptchaResponse) {
    Swal.fire({
      icon: 'warning',
      title: 'Verifikasi Diperlukan',
      text: 'Harap centang kotak "I\'m not a robot" untuk melanjutkan'
    });
    
    // Scroll to reCAPTCHA
    if (this.$refs.recaptchaContainer) {
      this.$refs.recaptchaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Validate form
  if (!this.validateForm()) {
    // Scroll to the first error
    const firstError = document.querySelector('.text-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Set loading state
  this.isSubmitting = true;
  
  // Create FormData object
  const formData = new FormData();
  
  // Add all basic form fields
  formData.append('judul', this.report.title);
  formData.append('category_id', this.report.category);
  formData.append('deskripsi', this.report.description);
  formData.append('tanggal_kejadian', this.report.incidentDate);
  formData.append('nama_pelapor', this.report.reporterName);
  formData.append('nim_pelapor', this.report.nim);
  formData.append('nomor_telepon', this.report.phone);
  
  // IMPORTANT: Add reCAPTCHA token with the exact field name the server expects
  formData.append('g-recaptcha-response', this.recaptchaResponse);
  
  // Log the token being sent (for debugging)
  console.log('reCAPTCHA token:', this.recaptchaResponse);
  
  // Add profesi, jenis_kelamin, and umur_pelapor
  formData.append('profesi', this.report.profesi);
  formData.append('jenis_kelamin', this.report.jenis_kelamin);
  formData.append('umur_pelapor', this.report.umur_pelapor);
  
  // Add lampiran_link if exists
  if (this.report.lampiran_link) {
    formData.append('lampiran_link', this.report.lampiran_link);
  }
  
  // Add bukti_pelanggaran array
  if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
    this.report.bukti_pelanggaran.forEach(item => {
      formData.append('bukti_pelanggaran[]', item);
    });
  }
  
  // Add terlapor data
  if (this.report.terlapor && this.report.terlapor.length > 0) {
    this.report.terlapor.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          formData.append(`terlapor[${index}][${key}]`, item[key]);
        }
      });
    });
  }
  
  // Add saksi data
  if (this.report.saksi && this.report.saksi.length > 0) {
    this.report.saksi.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          formData.append(`saksi[${index}][${key}]`, item[key]);
        }
      });
    });
  }
  
  // Append evidence files
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('image_path[]', this.selectedFiles[i]);
    }
  }
  
  // Include agreement
  formData.append('agreement', this.report.agreement ? 1 : 0);
  
  // For debugging - log the form data entries
  console.log('Form data entries:');
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  }
  
  // Make API call
  axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan/add_laporan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Success response:', response);
    // Handle success
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Laporan berhasil ditambahkan.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.$router.push('/pelaporan/kekerasan-seksual');
    });
    
    this.resetForm();
  })
  .catch(error => {
    // Handle errors
    console.error('Error submitting form:', error);
    console.log('Error response:', error.response);
    
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 422) {
        // Handle validation errors
        const errorData = error.response.data;
        console.log('Error data:', errorData);
        
        // Check specifically for reCAPTCHA errors
        if (errorData.message && 
            (errorData.message.toLowerCase().includes('recaptcha') || 
             errorData.message.toLowerCase().includes('captcha'))) {
          
          // Reset reCAPTCHA and show specific message
          this.resetRecaptcha();
          
          // Try to re-render reCAPTCHA
          setTimeout(() => {
            this.renderRecaptcha();
          }, 500);
          
          Swal.fire({
            icon: 'error',
            title: 'Verifikasi Gagal',
            text: 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.',
            confirmButtonText: 'OK'
          });
          return;
        }
        
        // Handle other validation errors
        if (typeof errorData === 'object') {
          this.errors = errorData.errors || errorData;
          
          let errorMessage = 'Validasi gagal:';
          if (this.errors) {
            Object.keys(this.errors).forEach(key => {
              if (Array.isArray(this.errors[key])) {
                errorMessage += `\n- ${this.errors[key][0]}`;
              } else {
                errorMessage += `\n- ${this.errors[key]}`;
              }
            });
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: errorMessage || 'Mohon periksa kembali form Anda',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Terjadi kesalahan validasi.'
          });
        }
      } else {
        // Handle other API errors
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        });
      }
    } else {
      // Handle network errors
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.'
      });
    }
  })
  .finally(() => {
    this.isSubmitting = false;
  });
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
        lampiran_link: '',
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
        bukti_pelanggaran: [],
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
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
      
      // Reset reCAPTCHA
      this.resetRecaptcha();
    },
    submitReport() {
    console.log("submitReport called");
    
    // Set loading state
    this.isSubmitting = true;
    console.log("isSubmitting set to true");
    
    // Create FormData object
    const formData = new FormData();
    
    // Add all basic form fields
    formData.append('judul', this.report.title);
    formData.append('category_id', this.report.category);
    formData.append('deskripsi', this.report.description);
    formData.append('tanggal_kejadian', this.report.incidentDate);
    formData.append('nama_pelapor', this.report.reporterName);
    formData.append('nim_pelapor', this.report.nim);
    formData.append('nomor_telepon', this.report.phone);
    
    // IMPORTANT: Add reCAPTCHA token
    formData.append('g-recaptcha-response', this.recaptchaResponse);
    
    // Add profesi, jenis_kelamin, and umur_pelapor
    formData.append('profesi', this.report.profesi);
    formData.append('jenis_kelamin', this.report.jenis_kelamin);
    formData.append('umur_pelapor', this.report.umur_pelapor);
    
    // Add lampiran_link if exists
    if (this.report.lampiran_link) {
      formData.append('lampiran_link', this.report.lampiran_link);
    }
    
    // Add bukti_pelanggaran array
    if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
      this.report.bukti_pelanggaran.forEach(item => {
        formData.append('bukti_pelanggaran[]', item);
      });
    }
    
    // Add terlapor data
    if (this.report.terlapor && this.report.terlapor.length > 0) {
      let validTerlaporCount = 0;
      
      this.report.terlapor.forEach((item, index) => {
        // Only include terlapor with at least a name
        if (item.nama_lengkap && item.nama_lengkap.trim()) {
          validTerlaporCount++;
          Object.keys(item).forEach(key => {
            if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
              formData.append(`terlapor[${index}][${key}]`, item[key]);
            }
          });
        }
      });
      
      console.log(`Added ${validTerlaporCount} valid terlapor records`);
    }
    
    // Add saksi data
    if (this.report.saksi && this.report.saksi.length > 0) {
      let validSaksiCount = 0;
      
      this.report.saksi.forEach((item, index) => {
        // Only include saksi with at least a name
        if (item.nama_lengkap && item.nama_lengkap.trim()) {
          validSaksiCount++;
          Object.keys(item).forEach(key => {
            if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
              formData.append(`saksi[${index}][${key}]`, item[key]);
            }
          });
        }
      });
      
      console.log(`Added ${validSaksiCount} valid saksi records`);
    }
    
    // Append evidence files
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      console.log(`Adding ${this.selectedFiles.length} files`);
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('image_path[]', this.selectedFiles[i]);
        console.log(`Added file ${i+1}: ${this.selectedFiles[i].name}`);
      }
    }
    
    // Include agreement
    formData.append('agreement', this.report.agreement ? 1 : 0);
    
    console.log("Form data prepared, sending request...");
    
    // Make API call
    axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan/add_laporan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log('Success response:', response);
      // Handle success
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Laporan berhasil ditambahkan.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        this.$router.push('/pelaporan/kekerasan-seksual');
      });
      
      this.resetForm();
    })
    .catch(error => {
      // Detailed error handling
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Terjadi kesalahan.';
      
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        
        // Extract error details for better user feedback
        if (error.response.data && typeof error.response.data === 'object') {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          
          if (error.response.data.errors) {
            this.errors = error.response.data.errors;
            
            // Create a readable error message from all validation errors
            const errorDetails = Object.entries(error.response.data.errors)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join('\n');
            
            errorMessage += '\n\nDetail:\n' + errorDetails;
          }
        }
      } else if (error.request) {
        errorMessage = 'Tidak ada respons dari server. Periksa koneksi internet Anda.';
      } else {
        errorMessage = `Kesalahan: ${error.message}`;
      }
      
      // Show error message to user
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Laporan',
        text: errorMessage
      });
      
      // If it's a reCAPTCHA error, reset it
      if (errorMessage.toLowerCase().includes('recaptcha') || 
          errorMessage.toLowerCase().includes('captcha')) {
        this.resetRecaptcha();
        setTimeout(() => this.renderRecaptcha(), 500);
      }
    })
    .finally(() => {
      console.log("Request completed, isSubmitting set to false");
      this.isSubmitting = false;
    });
  },

  // Then, define submitReportWithDebug which will call submitReport
  // Replace your submitReportWithDebug method with this version
submitReportWithDebug() {
  console.log("Submit button clicked");
  
  // Check if reCAPTCHA is verified
  console.log("reCAPTCHA verified:", this.recaptchaVerified);
  console.log("reCAPTCHA response:", this.recaptchaResponse ? "exists" : "missing");
  
  // Update bukti_pelanggaran before validation
  this.updateBuktiPelanggaran();
  console.log("Bukti pelanggaran updated:", this.report.bukti_pelanggaran);
  
  // Log form validation status
  const isFormValid = this.validateForm();
  console.log("Form valid:", isFormValid);
  
  if (!isFormValid) {
    console.log("Form validation failed with errors:", this.errors);
    // Scroll to the first error
    const firstError = document.querySelector('.text-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Set loading state
  this.isSubmitting = true;
  
  // Create FormData object
  const formData = new FormData();
  
  // Add all basic form fields
  formData.append('judul', this.report.title);
  formData.append('category_id', this.report.category);
  formData.append('deskripsi', this.report.description);
  
  // Format date properly
  let formattedDate = this.report.incidentDate;
  if (this.report.incidentDate && this.report.incidentDate.includes('T')) {
    formattedDate = this.report.incidentDate.replace('T', ' ');
  }
  formData.append('tanggal_kejadian', formattedDate);
  
  formData.append('nama_pelapor', this.report.reporterName);
  formData.append('nim_pelapor', this.report.nim);
  formData.append('nomor_telepon', this.report.phone);
  
  // IMPORTANT: Add reCAPTCHA token
  formData.append('g-recaptcha-response', this.recaptchaResponse);
  
  // Add profesi, jenis_kelamin, and umur_pelapor
  formData.append('profesi', this.report.profesi);
  formData.append('jenis_kelamin', this.report.jenis_kelamin);
  formData.append('umur_pelapor', this.report.umur_pelapor);
  
  // Add lampiran_link if exists
  if (this.report.lampiran_link) {
    formData.append('lampiran_link', this.report.lampiran_link);
  }
  
  // Add bukti_pelanggaran array
  if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
    this.report.bukti_pelanggaran.forEach(item => {
      formData.append('bukti_pelanggaran[]', item);
    });
  }
  
  // Add terlapor data
  if (this.report.terlapor && this.report.terlapor.length > 0) {
    this.report.terlapor.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          formData.append(`terlapor[${index}][${key}]`, item[key]);
        }
      });
    });
  }
  
  // Add saksi data
  if (this.report.saksi && this.report.saksi.length > 0) {
    this.report.saksi.forEach((item, index) => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          formData.append(`saksi[${index}][${key}]`, item[key]);
        }
      });
    });
  }
  
  // Log form data before sending
  console.log("Form data being sent:");
  for (let pair of formData.entries()) {
    if (pair[0] === 'g-recaptcha-response') {
      console.log(pair[0] + ': [TOKEN HIDDEN]');
    } else {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
  }
  
  // Append evidence files
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    console.log(`Attaching ${this.selectedFiles.length} files:`);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      console.log(`- File ${i+1}: ${this.selectedFiles[i].name} (${this.selectedFiles[i].type}, ${Math.round(this.selectedFiles[i].size/1024)}KB)`);
      formData.append('image_path[]', this.selectedFiles[i]);
    }
  } else {
    console.warn("No files selected for upload");
  }
  
  // Include agreement
  formData.append('agreement', this.report.agreement ? '1' : '0');
  
  // Make API call
  axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan/add_laporan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Success response:', response);
    
    // Handle success
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Laporan berhasil ditambahkan.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.$router.push('/pelaporan/kekerasan-seksual');
    });
    
    this.resetForm();
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error headers:', error.response.headers);
      console.log('Error data:', error.response.data);
      
      // Special handling for reCAPTCHA errors with test key
      if (error.response.data && 
          error.response.data.message && 
          error.response.data.message.toLowerCase().includes('recaptcha')) {
        
        console.log("reCAPTCHA verification failed - this is expected with the test key");
        
        // Since we're using the test key, let's handle this specially
        // In a real app, you'd never do this, but for development it's acceptable
        Swal.fire({
          icon: 'info',
          title: 'Verifikasi reCAPTCHA',
          html: `
            <p>Anda menggunakan kunci test untuk reCAPTCHA.</p>
            <p class="mt-2">Pada situasi nyata, validasi akan gagal di server.</p>
            <p class="mt-2">Apakah Anda ingin melanjutkan simulasi submit?</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ya, Simulasikan Submit',
          cancelButtonText: 'Tidak, Kembali'
        }).then((result) => {
          if (result.isConfirmed) {
            // Simulate successful submission
            Swal.fire({
              icon: 'success',
              title: 'Simulasi Berhasil!',
              text: 'Dalam lingkungan produksi, laporan Anda akan berhasil dikirim.',
              timer: 3000,
              timerProgressBar: true
            }).then(() => {
              this.$router.push('/pelaporan/kekerasan-seksual');
            });
          } else {
            // Reset the form state
            this.isSubmitting = false;
            this.resetRecaptcha();
          }
        });
        
        return;
      }
      
      // Handle other validation errors
      if (error.response.data && typeof error.response.data === 'object') {
        // Show validation errors
        let errorMessage = 'Validasi gagal:';
        
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            errorMessage += `\n- ${message}`;
          });
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Validasi Gagal',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      } else {
        // General server error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
        });
      }
    } else if (error.request) {
      // Network error
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Jaringan',
        text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.'
      });
    } else {
      // Other errors
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Terjadi kesalahan: ${error.message}`
      });
    }
  })
  .finally(() => {
    this.isSubmitting = false;
  });
},
  }
};
</script>

<style scoped>
/* Make sure the reCAPTCHA widget is displayed properly */
.g-recaptcha-container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

/* Additional styling */
.recaptcha-wrapper {
  min-height: 78px;
  margin-bottom: 10px;
}
</style>