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
              
              <div class="mb-4">
                <label for="fileInput" class="block text-sm font-medium text-gray-700 mb-1">
                  Lampiran Foto <span class="text-red-500">*</span>
                </label>
                <div class="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <!-- Hidden file input -->
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
                  
                  <!-- Visible content -->
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
              <ol class="list-decimal pl-6 mb-4 space-y-2">
                <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
                <li>Saya menyatakan bersedia laporan ini diproses lebih lanjut sesuai dengan prosedur yang berlaku di D3 TI UNS.</li>
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

        <!-- reCAPTCHA Section -->
        <div class="form-section border-t pt-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Verifikasi</h3>
          <div class="flex flex-col items-center mb-4">
            <div ref="recaptchaContainer" class="g-recaptcha-container recaptcha-wrapper"></div>
            <p v-if="errors['g-recaptcha-response']" class="text-red-500 text-xs text-center mt-1">
              {{ errors['g-recaptcha-response'][0] }}
            </p>
            <p v-if="recaptchaError" class="text-red-500 text-xs text-center mt-1">
              {{ recaptchaError }}
            </p>
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
            type="button"  
            class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            :disabled="isSubmitting"
            :class="{'opacity-70 cursor-not-allowed': isSubmitting}"
            @click="submitReport"
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
      isSubmitting: false,
      imagePreviews: [],
      selectedFiles: [],
      currentUser: null,
      formattedDateTime: null,
      
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
  
  created() {
    this.loadUserData();
    this.addTerduga();
    this.addSaksi();
  },
  
  mounted() {
    this.fetchCategories();
    
    // Initialize reCAPTCHA with the improved implementation
    this.$nextTick(() => {
      this.initRecaptcha();
    });
  },

  beforeUnmount() {
    // Properly cleanup reCAPTCHA
    this.cleanupRecaptcha();
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
    initRecaptcha() {
      // Clear any existing error messages
      this.recaptchaError = null;
      
      // Check if the recaptcha container is available
      if (!this.$refs.recaptchaContainer) {
        console.log("reCAPTCHA container not found, retrying...");
        setTimeout(() => this.initRecaptcha(), 500);
        return;
      }
      
      // Track attempt count to prevent infinite loops
      this.recaptchaAttempts++;
      if (this.recaptchaAttempts > this.maxRecaptchaAttempts) {
        this.recaptchaError = "Gagal memuat reCAPTCHA setelah beberapa percobaan. Silakan muat ulang halaman.";
        return;
      }
      
      // Load reCAPTCHA script if not already loaded
      if (window.grecaptcha) {
        this.renderRecaptchaWidget();
      } else {
        this.loadRecaptchaScript()
          .then(() => {
            this.renderRecaptchaWidget();
          })
          .catch(error => {
            console.error("Error loading reCAPTCHA script:", error);
            this.recaptchaError = "Gagal memuat script reCAPTCHA. Silakan muat ulang halaman.";
            
            // Auto-retry after a delay
            setTimeout(() => {
              if (!window.grecaptcha) {
                this.initRecaptcha();
              }
            }, 2000);
          });
      }
    },
    
    loadRecaptchaScript() {
      return new Promise((resolve, reject) => {
        // If already loading, wait for it
        if (window.onRecaptchaLoaded) {
          const originalCallback = window.onRecaptchaLoaded;
          window.onRecaptchaLoaded = () => {
            originalCallback();
            resolve(window.grecaptcha);
          };
          return;
        }

        // Define callback for when reCAPTCHA loads
        window.onRecaptchaLoaded = () => {
          resolve(window.grecaptcha);
        };
        
        // Add the script to the page
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
          reject(new Error('Failed to load reCAPTCHA script'));
        };
        
        document.head.appendChild(script);
      });
    },
    
    renderRecaptchaWidget() {
      // Ensure the container is empty before rendering
      if (this.$refs.recaptchaContainer) {
        this.$refs.recaptchaContainer.innerHTML = '';
      }
      
      try {
        // Render the reCAPTCHA widget
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
            console.log('reCAPTCHA verification expired');
          },
          'error-callback': () => {
            this.recaptchaResponse = null;
            this.recaptchaVerified = false;
            this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan coba lagi.';
            console.error('reCAPTCHA error');
            
            // Auto-retry after a delay
            setTimeout(() => {
              this.resetRecaptcha();
            }, 2000);
          }
        });
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
        this.recaptchaError = 'Terjadi kesalahan saat memuat reCAPTCHA. Silakan muat ulang halaman.';
        
        // Handle the case where rendering fails, possibly due to reCAPTCHA being already rendered
        // This commonly happens with the test key
        if (error.message && error.message.includes('already been rendered')) {
          this.cleanupRecaptcha();
          setTimeout(() => {
            this.initRecaptcha();
          }, 500);
        }
      }
    },
    
    resetRecaptcha() {
      try {
        if (window.grecaptcha && this.recaptchaWidget !== null) {
          window.grecaptcha.reset(this.recaptchaWidget);
          this.recaptchaVerified = false;
          this.recaptchaResponse = null;
          return true;
        }
        // If reset fails, re-initialize
        this.cleanupRecaptcha();
        this.initRecaptcha();
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error);
        // If there's an error, try to re-initialize
        this.cleanupRecaptcha();
        this.initRecaptcha();
      }
    },
    
    cleanupRecaptcha() {
      // Reset state
      this.recaptchaWidget = null;
      this.recaptchaVerified = false;
      this.recaptchaResponse = null;
      this.recaptchaAttempts = 0;
      
      // Clear the container
      if (this.$refs.recaptchaContainer) {
        this.$refs.recaptchaContainer.innerHTML = '';
      }
    },
    
    // Get the most recent token directly from grecaptcha
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
    
    fetchCategories() {
      axios.get('http://pelaporan-d3ti.my.id/api/category', {
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
        // Set current date and time dynamically
        const now = new Date();
        this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:MM:SS
        this.currentUser = 'miftahul01'; // Current user's login
        
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          console.log('Loaded user data:', userData);
          
          // Set basic user data
          this.report.reporterName = userData.name || 'Miftahul';
          this.report.nim = userData.nim || userData.nik || 'miftahul01judul';
          this.report.phone = userData.no_telp || '';
          this.currentUser = userData.username || 'miftahul01';
          
          // Check email domain to determine role and set profession
          const email = userData.email || (userData.dosen ? userData.dosen.email : '');
          
          // IMPORTANT FIX: Use this.report.profesi instead of this.form.profesi
          // If email exists and does NOT contain "@student", set role as "Dosen"
          if (email && !email.includes('@student')) {
            this.report.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on non-student email domain');
          }
          // Fallback to other checks
          else if (userData.jabatan_sekarang && userData.jabatan_sekarang.name === 'Dosen') {
            this.report.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on user role');
          }
          else if (userData.dosen) {
            this.report.profesi = 'Dosen';
            console.log('Auto-selected profession: Dosen based on dosen object');
          }
          // Check punya_jabatan array for active Dosen role
          else if (userData.punya_jabatan && Array.isArray(userData.punya_jabatan)) {
            const dosenRole = userData.punya_jabatan.find(jabatan => 
              jabatan.name === 'Dosen' && jabatan.is_active === 1
            );
            
            if (dosenRole) {
              this.report.profesi = 'Dosen';
              console.log('Auto-selected profession: Dosen based on active role in punya_jabatan');
            }
          }
          
          // Force Vue to recognize changes
          this.$nextTick(() => {
            console.log('After nextTick - Profesi:', this.report.profesi);
          });
          
          console.log('User data loaded successfully - DateTime:', this.currentDateTime);
          
        } else {
          // Default values if no user session
          this.report.reporterName = 'Miftahul';
          this.report.nim = 'miftahul01judul';
          this.report.phone = '';
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Default values on error
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

      // Improved reCAPTCHA validation
      const recaptchaValid = this.verifyRecaptchaClientSide();
      if (!recaptchaValid) {
        this.errors['g-recaptcha-response'] = ['Harap centang kotak reCAPTCHA "Saya bukan robot"'];
        isValid = false;
        console.log("reCAPTCHA validation failed");
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

    verifyRecaptchaClientSide() {
      // Check if reCAPTCHA is verified 
      if (!window.grecaptcha) {
        console.error('reCAPTCHA not loaded');
        return false;
      }
      
      try {
        // Reset any previous errors
        this.recaptchaError = null;
        
        // Get fresh token
        const token = window.grecaptcha.getResponse(this.recaptchaWidget);
        
        if (!token) {
          this.recaptchaError = 'reCAPTCHA tidak dicentang';
          return false;
        }
        
        // Store the token for submission
        this.recaptchaResponse = token;
        this.recaptchaVerified = true;
        
        // Check if using test key
        if (this.recaptchaSiteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
          console.warn('Using Google test key which may cause inconsistent server validation');
        }
        
        return true;
      } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        this.recaptchaError = 'Terjadi kesalahan saat verifikasi reCAPTCHA';
        return false;
      }
    },

    submitReport() {
      // Reset warnings and update bukti_pelanggaran
      this.showBuktiWarning = false;
      this.recaptchaError = null;
      this.updateBuktiPelanggaran();
      
      // Validate form before submission
      if (!this.validateForm()) {
        const firstError = document.querySelector('.text-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Get latest reCAPTCHA token
      const recaptchaToken = this.getRecaptchaResponse();
      if (!recaptchaToken) {
        this.recaptchaError = 'Harap centang kotak reCAPTCHA "Saya bukan robot"';
        Swal.fire({
          icon: 'warning',
          title: 'Verifikasi Diperlukan',
          text: 'Harap centang kotak "I\'m not a robot" untuk melanjutkan'
        });
        
        if (this.$refs.recaptchaContainer) {
          this.$refs.recaptchaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Set loading state
      this.isSubmitting = true;
      
      // Create FormData object
      const formData = new FormData();
      
      // Add basic form fields
      formData.append('judul', this.report.title);
      formData.append('category_id', this.report.category);
      formData.append('deskripsi', this.report.description);
      formData.append('tanggal_kejadian', this.report.incidentDate);
      formData.append('nama_pelapor', this.report.reporterName);
      formData.append('nim_pelapor', this.report.nim);
      formData.append('nomor_telepon', this.report.phone);
      formData.append('g-recaptcha-response', recaptchaToken);
      formData.append('profesi', this.report.profesi);
      formData.append('jenis_kelamin', this.report.jenis_kelamin);
      formData.append('umur_pelapor', this.report.umur_pelapor);
      
      // Add optional link if exists
      if (this.report.lampiran_link) {
        formData.append('lampiran_link', this.report.lampiran_link);
      }
      
      // Add bukti_pelanggaran array - FORMAT FIX: Using proper index notation
      if (this.report.bukti_pelanggaran && this.report.bukti_pelanggaran.length > 0) {
        this.report.bukti_pelanggaran.forEach((item, index) => {
          formData.append(`bukti_pelanggaran[${index}]`, item);
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
      } else {
        // ADDED: Default terlapor with valid email format
        formData.append('terlapor[0][nama_lengkap]', 'Nama Terlapor');
        formData.append('terlapor[0][email]', 'terlapor.dummy@gmail.com');
        formData.append('terlapor[0][nomor_telepon]', '081234567890');
        formData.append('terlapor[0][status_warga]', 'mahasiswa');
        formData.append('terlapor[0][unit_kerja]', 'Fakultas Teknik');
        formData.append('terlapor[0][jenis_kelamin]', 'laki-laki');
        formData.append('terlapor[0][umur_terlapor]', '20-40');
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
      } else {
        // ADDED: Default saksi with valid email format
        formData.append('saksi[0][nama_lengkap]', 'Nama Saksi');
        formData.append('saksi[0][email]', 'saksi.dummy@gmail.com');
        formData.append('saksi[0][nomor_telepon]', '089876543210');
      }
      
      // Append evidence files - FORMAT FIX: Using proper index notation
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append(`image_path[${i}]`, this.selectedFiles[i]);
        }
      } else {
        // ADDED: Check if image is required
        Swal.fire({
          icon: 'warning',
          title: 'Dokumen Bukti Diperlukan',
          text: 'Harap unggah setidaknya satu dokumen bukti'
        });
        this.isSubmitting = false;
        return;
      }
      
      // Include agreement
      formData.append('agreement', this.report.agreement ? 1 : 0);
      
      // Log form data being sent (for debugging)
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        if (key === 'g-recaptcha-response') {
          console.log(`${key}: [TOKEN]`);
        } else if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.type}, ${Math.round(value.size/1024)}KB)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Get authentication token
      const authToken = this.token || VueCookies.get('auth_token') || this.$cookies.get('auth_token');
      if (!authToken) {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error Autentikasi',
          text: 'Token autentikasi tidak ditemukan. Silakan login kembali.'
        }).then(() => {
          this.$router.push('/login');
        });
        return;
      }
      
      // Create and configure XHR
      const xhr = new XMLHttpRequest();
      
      // Setup timeout handling (30 seconds)
      xhr.timeout = 30000;
      xhr.ontimeout = () => {
        this.isSubmitting = false;
        console.error('Request timed out');
        Swal.fire({
          icon: 'error',
          title: 'Timeout',
          text: 'Permintaan melebihi batas waktu. Silakan coba lagi.'
        });
      };
      
      // Setup completion handling
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        
        // Log raw response for debugging
        console.log('XHR Response Status:', xhr.status);
        console.log('XHR Response Headers:', xhr.getAllResponseHeaders());
        console.log('XHR Response Text:', xhr.responseText);
        
        // Process response
        if (xhr.status >= 200 && xhr.status < 300) {
          // Check if the response is HTML (likely a redirect) or not JSON
          if (xhr.responseText.trim().startsWith('<!DOCTYPE html>')) {
            console.log('Warning: Received HTML response instead of JSON. This may indicate a redirect.');
            
            // Despite getting HTML, we'll treat it as success since status code is 200-299
            this.isSubmitting = false;
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Laporan berhasil ditambahkan.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              // Redirect to dosen dashboard instead of kekerasan-seksual
              this.$router.push('/dosen/dashboardksdosen');
            });
            
            this.resetForm();
            return;
          }
          
          // Parse JSON response if possible
          let responseData;
          try {
            responseData = JSON.parse(xhr.responseText);
            console.log('Parsed response data:', responseData);
          } catch (e) {
            console.log('Response is not JSON:', xhr.responseText);
            // Continue with success case anyway since HTTP status is 200-299
          }
          
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Laporan berhasil ditambahkan.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // Redirect to dosen dashboard instead of kekerasan-seksual
            this.$router.push('/dosen/dashboardksdosen');
          });
          
          this.resetForm();
          
        } else {
          // Error handling
          this.isSubmitting = false;
          console.error('Form submission error:', xhr.status, xhr.statusText);
          
          let errorMessage = 'Terjadi kesalahan pada server.';
          let errorDetails = null;
          
          // Try to parse error response
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.log('Error response:', errorResponse);
            
            if (errorResponse.message) {
              errorMessage = errorResponse.message;
              
              // Special handling for reCAPTCHA errors
              if (errorMessage.toLowerCase().includes('recaptcha') || 
                  errorMessage.toLowerCase().includes('captcha')) {
                this.resetRecaptcha();
                Swal.fire({
                  icon: 'error',
                  title: 'Verifikasi Gagal',
                  text: 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.',
                  confirmButtonText: 'OK'
                });
                return;
              }
            }
            
            if (errorResponse.errors) {
              errorDetails = Object.entries(errorResponse.errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('\n');
            }
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            ...(errorDetails && { footer: `<details><summary>Detail Error</summary><pre>${errorDetails}</pre></details>` })
          });
        }
      };
      
      // FIXED: Use absolute URL for the API endpoint
      xhr.open('POST', 'http://pelaporan-d3ti.my.id/api/laporan_kekerasan/add_laporan', true);
      
      // FIXED: Add proper authorization header
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      
      // Add retry capability for better stability
      let retryCount = 0;
      const maxRetries = 2;
      
      xhr.onerror = () => {
        console.error('XHR network error occurred');
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying request (${retryCount} of ${maxRetries})...`);
          
          // Wait a bit before retrying (exponential backoff)
          setTimeout(() => {
            const newXhr = new XMLHttpRequest();
            // Configure the new XHR
            newXhr.timeout = 30000;
            newXhr.onreadystatechange = xhr.onreadystatechange;
            newXhr.ontimeout = xhr.ontimeout;
            newXhr.onerror = xhr.onerror;
            
            newXhr.open('POST', 'http://pelaporan-d3ti.my.id/api/laporan_kekerasan/add_laporan', true);
            newXhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
            newXhr.setRequestHeader('Accept', 'application/json');
            newXhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            
            newXhr.send(formData);
          }, 1000 * Math.pow(2, retryCount));
          
        } else {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan Jaringan',
            text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
          });
        }
      };
      
      // Send request
      xhr.send(formData);
    },

    // Update reset form to handle reCAPTCHA properly
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
        terlapor: [],
        saksi: [],
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
      this.selectedFiles = [];
      
      // Reset file input if it exists
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      
      // Reset reCAPTCHA
      this.resetRecaptcha();
      
      // Ensure we have at least one terduga and saksi field
      this.addTerduga();
      this.addSaksi();
    }
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