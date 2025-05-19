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

                <!-- Bukti Laporan (File Input) -->
                <div class="mb-4">
                  <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Bukti Laporan (Foto) <span class="text-red-500">*</span></label>
                  <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="evidence"
                      @change="handleFileUpload"
                      accept="image/*"
                      multiple
                      class="hidden"
                      ref="fileInput"
                      required
                    />
                    <div @click="triggerFileInput">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="mt-1 text-sm text-gray-600">Klik atau seret beberapa file foto</p>
                      <p class="mt-1 text-xs text-gray-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                    </div>
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

                <!-- Link Lampiran -->
                <div class="mb-4">
                  <label for="linkLampiran" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                  <input
                    type="url"
                    id="linkLampiran"
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
                    v-model="report.description"
                    rows="5"
                    placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  ></textarea>
                  <p v-if="errors.deskripsi" class="text-red-500 text-xs mt-1">{{ errors.deskripsi[0] }}</p>
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
                  <p v-if="errors.tanggal_kejadian" class="text-red-500 text-xs mt-1">{{ errors.tanggal_kejadian[0] }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section 2: Informasi Pelapor -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Informasi Pelapor</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
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

              <div>
                <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM/NIK Pelapor</label>
                <input
                  type="text"
                  id="nim"
                  v-model="report.nim"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                  disabled
                />
                <p v-if="errors.nim_pelapor" class="text-red-500 text-xs mt-1">{{ errors.nim_pelapor[0] }}</p>
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
                <p v-if="errors.nomor_telepon" class="text-red-500 text-xs mt-1">{{ errors.nomor_telepon[0] }}</p>
              </div>
            </div>
            
            <!-- Moved these three fields here as requested -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              
              <!-- Jenis Kelamin Field -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin Pelapor <span class="text-red-500">*</span></label>
                <div class="flex space-x-4">
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="jenis_kelamin" 
                      v-model="report.jenis_kelamin" 
                      value="laki-laki"
                      class="form-radio h-4 w-4 text-red-600" 
                      required
                    />
                    <span class="ml-2 text-sm text-gray-700">Laki-laki</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="jenis_kelamin" 
                      v-model="report.jenis_kelamin" 
                      value="perempuan"
                      class="form-radio h-4 w-4 text-red-600" 
                      required
                    />
                    <span class="ml-2 text-sm text-gray-700">Perempuan</span>
                  </label>
                </div>
                <p v-if="errors.jenis_kelamin" class="text-red-500 text-xs mt-1">{{ errors.jenis_kelamin[0] }}</p>
              </div>
              
              <!-- Rentang Umur Field - Made vertical as requested -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur Pelapor <span class="text-red-500">*</span></label>
                <div class="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-300">
                  <div class="block">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="umur_pelapor"
                        v-model="report.umur_pelapor"
                        value="<20"
                        class="form-radio h-4 w-4 text-red-600"
                        required
                      />
                      <span class="ml-2 text-sm">Kurang dari 20 tahun</span>
                    </label>
                  </div>
                  <div class="block">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="umur_pelapor"
                        v-model="report.umur_pelapor"
                        value="20-40"
                        class="form-radio h-4 w-4 text-red-600"
                      />
                      <span class="ml-2 text-sm">20 - 40 tahun</span>
                    </label>
                  </div>
                  <div class="block">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        name="umur_pelapor"
                        v-model="report.umur_pelapor"
                        value="40<"
                        class="form-radio h-4 w-4 text-red-600"
                      />
                      <span class="ml-2 text-sm">Lebih dari 40 tahun</span>
                    </label>
                  </div>
                </div>
                <p v-if="errors.umur_pelapor" class="text-red-500 text-xs mt-1">{{ errors.umur_pelapor[0] }}</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Informasi Terduga/Terlapor -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Informasi Terduga/Terlapor</h3>
            <p v-if="errors.terlapor" class="text-red-500 text-sm mb-2">{{ errors.terlapor[0] }}</p>
            
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
                <p v-if="errors.agreement" class="text-red-500 text-xs mt-1">{{ errors.agreement[0] }}</p>
              </div>
            </div>
          </div>
          
          <!-- reCAPTCHA Section -->
          <div class="form-section border-t pt-6">
            <h3 class="text-xl font-semibold mb-4">Verifikasi</h3>
            <div class="flex flex-col items-center mb-4">
              <!-- Standard reCAPTCHA implementation -->
              <div id="recaptcha-element" class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
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
              type="submit"
              class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              :disabled="isSubmitting"
              :class="{'opacity-70 cursor-not-allowed': isSubmitting}"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
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
  name: 'AddKekerasanSeksual',
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
      currentUser: 'miftahul01judul', // Updated with the exact username provided
      formattedDateTime: '2025-05-19 06:23:52', // Updated with the exact date/time provided
      recaptchaError: null,
    };
  },

  computed: {
    filteredCategories() {
      return this.categories.filter(category => 
        category && category.nama && category.nama.startsWith('Kekerasan')
      );
    }
  },

  mounted() {
    this.fetchCategories();
    this.loadUserData();
    this.addTerduga();
    this.addSaksi();
    this.loadRecaptchaScript();
  },

  methods: {
    loadRecaptchaScript() {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
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
          } else if (response.data && Array.isArray(response.data.data)) {
            this.categories = response.data.data;
          } else {
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
          this.currentUser = userData.username || 'miftahul01judul'; // Using exact username provided
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

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      // Clear old files
      this.report.evidenceFiles = [];
      this.imagePreviews = [];
      
      let hasInvalidFile = false;
      
      // Validate and add new files - file size limit increased to 5MB as per spec
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.match('image.*')) {
          hasInvalidFile = true;
          continue;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          hasInvalidFile = true;
          continue;
        }
        
        // Add to files array
        this.report.evidenceFiles.push(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
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
      if (window.grecaptcha) {
        try {
          window.grecaptcha.reset();
        } catch (e) {
          console.error("Error resetting reCAPTCHA:", e);
        }
      }
    },
    
    validateForm() {
      let isValid = true;
      this.errors = {};
      this.showBuktiWarning = false;
      
      // Title validation (max 50 chars)
      if (!this.report.title) {
        this.errors.title = ['Judul laporan harus diisi'];
        isValid = false;
      } else if (this.report.title.length > 50) {
        this.errors.title = ['Judul laporan maksimal 50 karakter'];
        isValid = false;
      }
      
      // Category validation
      if (!this.report.category) {
        this.errors.category_id = ['Kategori harus dipilih'];
        isValid = false;
      }
      
      // Description validation
      if (!this.report.description) {
        this.errors.deskripsi = ['Deskripsi harus diisi'];
        isValid = false;
      }
      
      // Incident date validation
      if (!this.report.incidentDate) {
        this.errors.tanggal_kejadian = ['Tanggal kejadian harus diisi'];
        isValid = false;
      }
      
      // Profesi validation
      if (!this.report.profesi) {
        this.errors.profesi = ['Profesi harus dipilih'];
        isValid = false;
      }
      
      // Jenis kelamin validation (must be laki-laki or perempuan)
      if (!this.report.jenis_kelamin) {
        this.errors.jenis_kelamin = ['Jenis kelamin harus dipilih'];
        isValid = false;
      } else if (!['laki-laki', 'perempuan'].includes(this.report.jenis_kelamin)) {
        this.errors.jenis_kelamin = ['Jenis kelamin harus laki-laki atau perempuan'];
        isValid = false;
      }
      
      // Umur pelapor validation (must be <20, 20-40, or 40<)
      if (!this.report.umur_pelapor) {
        this.errors.umur_pelapor = ['Rentang umur harus dipilih'];
        isValid = false;
      } else if (!['<20', '20-40', '40<'].includes(this.report.umur_pelapor)) {
        this.errors.umur_pelapor = ['Rentang umur tidak valid'];
        isValid = false;
      }
      
      // Bukti pelanggaran validation
      if (this.report.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        isValid = false;
      }
      
      // Evidence files validation
      if (this.report.evidenceFiles.length === 0) {
        this.errors.image_path = ['File bukti foto harus diunggah'];
        isValid = false;
      }
      
      // Terlapor validation
      if (this.report.terlapor.length === 0) {
        this.errors.terlapor = ['Minimal satu terlapor harus diisi'];
        isValid = false;
      } else {
        // Check each terlapor for required fields
        const invalidTerlapor = this.report.terlapor.some(t => {
          // Check required fields
          if (!t.nama_lengkap || !t.jenis_kelamin || !t.umur_terlapor || !t.status_warga || !t.unit_kerja) {
            return true;
          }
          
          // Validate field lengths
          if (t.nama_lengkap && t.nama_lengkap.length > 255) return true;
          if (t.email && t.email.length > 255) return true;
          if (t.nomor_telepon && t.nomor_telepon.length > 20) return true;
          
          // Validate jenis_kelamin values
          if (t.jenis_kelamin && !['laki-laki', 'perempuan'].includes(t.jenis_kelamin)) return true;
          
          // Validate status_warga values
          if (t.status_warga && !['dosen', 'mahasiswa', 'staff', 'lainnya'].includes(t.status_warga)) return true;
          
          // Validate umur_terlapor values
          if (t.umur_terlapor && !['<20', '20-40', '40<'].includes(t.umur_terlapor)) return true;
          
          return false;
        });
        
        if (invalidTerlapor) {
          this.errors.terlapor = ['Data terlapor tidak lengkap atau tidak valid'];
          isValid = false;
        }
      }
      
      // Saksi validation
      if (this.report.saksi.length === 0) {
        this.errors.saksi = ['Minimal satu saksi harus diisi'];
        isValid = false;
      } else {
        // Check each saksi for required fields
        const invalidSaksi = this.report.saksi.some(s => {
          // Check required fields
          if (!s.nama_lengkap || !s.email || !s.nomor_telepon) {
            return true;
          }
          
          // Validate field lengths
          if (s.nama_lengkap && s.nama_lengkap.length > 255) return true;
          if (s.email && s.email.length > 255) return true;
          if (s.nomor_telepon && s.nomor_telepon.length > 20) return true;
          
          return false;
        });
        
        if (invalidSaksi) {
          this.errors.saksi = ['Data saksi tidak lengkap atau tidak valid'];
          isValid = false;
        }
      }
      
      // Agreement validation
      if (!this.report.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan'];
        isValid = false;
      }
      
      // reCAPTCHA validation
      const recaptchaResponse = window.grecaptcha?.getResponse();
      if (!recaptchaResponse) {
        this.errors['g-recaptcha-response'] = ['Silakan verifikasi bahwa Anda bukan robot'];
        this.recaptchaError = 'Silakan verifikasi bahwa Anda bukan robot';
        isValid = false;
      }
      
      return isValid;
    },
    
    async submitReport() {
      // Validate form first
      if (!this.validateForm()) {
        const firstErrorKey = Object.keys(this.errors)[0];
        if (firstErrorKey) {
          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: this.errors[firstErrorKey][0] || 'Mohon periksa kembali form Anda'
          });
        }
        return;
      }
      
      try {
        this.isSubmitting = true;
        
        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append('judul', this.report.title);
        formData.append('category_id', this.report.category);
        formData.append('deskripsi', this.report.description);
        formData.append('tanggal_kejadian', this.report.incidentDate);
        formData.append('nama_pelapor', this.report.reporterName);
        formData.append('nim_pelapor', this.report.nim);
        formData.append('nomor_telepon', this.report.phone);
        
        // Add additional fields
        formData.append('profesi', this.report.profesi);
        formData.append('jenis_kelamin', this.report.jenis_kelamin);
        formData.append('umur_pelapor', this.report.umur_pelapor);
        
        // Add lampiran_link if present
        if (this.report.lampiran_link) {
          formData.append('lampiran_link', this.report.lampiran_link);
        }
        
        // Add bukti_pelanggaran as array
        if (this.report.bukti_pelanggaran.length > 0) {
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
        if (this.report.evidenceFiles.length > 0) {
          for (let i = 0; i < this.report.evidenceFiles.length; i++) {
            formData.append('image_path[]', this.report.evidenceFiles[i]);
          }
        }
        
        // Agreement field - make sure it's 1 or 0
        formData.append('agreement', this.report.agreement ? 1 : 0);
        
        // Additional fields
        formData.append('current_datetime', this.formattedDateTime);
        formData.append('username', this.currentUser);
        
        // Add reCAPTCHA response
        const recaptchaResponse = window.grecaptcha?.getResponse();
        if (recaptchaResponse) {
          formData.append('g-recaptcha-response', recaptchaResponse);
        }
        
        // Submit the data to the API
        const response = await axios.post('https://v3422040.mhs.d3tiuns.com/api/laporan_kekerasan/add_laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
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
          this.$router.push('/pelaporan/kekerasan-seksual');
        });
        
        this.resetForm();
        
      } catch (error) {
        console.error('Error submitting form:', error);
        
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 422) {
            // Handle validation errors
            const errorData = error.response.data;
            
            if (typeof errorData === 'object') {
              this.errors = errorData.errors || errorData;
              
              let firstErrorMessage = '';
              if (this.errors) {
                const firstErrorKey = Object.keys(this.errors)[0];
                if (firstErrorKey && this.errors[firstErrorKey][0]) {
                  firstErrorMessage = this.errors[firstErrorKey][0];
                }
              }
              
              // Check for reCAPTCHA specific errors
              if (errorData.message && errorData.message.toLowerCase().includes('recaptcha')) {
                // Reset reCAPTCHA
                if (window.grecaptcha) {
                  window.grecaptcha.reset();
                }
                
                Swal.fire({
                  icon: 'error',
                  title: 'Verifikasi Gagal',
                  text: 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.'
                });
                return;
              }
              
              Swal.fire({
                icon: 'error',
                title: 'Validasi Gagal',
                text: firstErrorMessage || 'Mohon periksa kembali form Anda'
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
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  
  beforeDestroy() {
    // Clean up any event listeners or global state
  }
};
</script>

<style scoped>
/* Add styling for reCAPTCHA container */
.g-recaptcha {
  display: inline-block;
  margin: 0 auto;
}
</style>