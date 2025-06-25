<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header :userData="userData" />
      <div class="p-4">
        <div class="bg-white shadow rounded-lg p-6 mb-4">
          <h1 class="text-2xl font-semibold text-gray-800">Tambah Laporan Kekerasan Seksual</h1>
          <p class="text-gray-600 mt-2">Silakan isi formulir berikut untuk menambahkan laporan kekerasan seksual baru.</p>
        </div>

        <!-- Form Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="submitForm" class="space-y-6" name="reportForm" id="reportForm">
            <!-- Section 1: Detail Laporan -->
            <div class="border-b pb-6 mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Detail Laporan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div>
                  <!-- Judul/Nama Laporan -->
                  <div class="mb-4">
                    <label for="judul" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span class="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="judul"
                      name="judul"
                      v-model="formData.judul"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      autocomplete="off"
                      required
                    />
                    <div v-if="errors.judul" class="text-red-500 text-xs mt-1">
                      {{ errors.judul[0] }}
                    </div>
                  </div>

                  <!-- Kategori -->
                  <div class="mb-4">
                    <label for="category_id" class="block text-sm font-medium text-gray-700 mb-2">Kategori <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <select 
                        v-model="formData.category_id" 
                        id="category_id"
                        name="category_id"
                        class="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm"
                        required
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        <option v-for="category in kekerasanCategories" :key="category.category_id" :value="category.category_id">
                          {{ category.nama }}
                        </option>
                      </select>
                    </div>
                    <div v-if="errors.category_id" class="text-red-500 text-xs mt-1">
                      {{ errors.category_id[0] }}
                    </div>
                  </div>

                  <!-- Bukti Pelanggaran Checkboxes -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bukti Pelaporan <span class="text-red-500">*</span></label>
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
                    <label for="lampiran_link" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                    <input
                      type="url"
                      id="lampiran_link"
                      name="lampiran_link"
                      v-model="formData.lampiran_link"
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
                    <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span class="text-red-500">*</span></label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      v-model="formData.deskripsi"
                      rows="5"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                      autocomplete="off"
                      required
                    ></textarea>
                    <div v-if="errors.deskripsi" class="text-red-500 text-xs mt-1">
                      {{ errors.deskripsi[0] }}
                    </div>
                  </div>

                  <!-- Tanggal & Waktu Kejadian -->
                  <div class="mb-4">
                    <label for="tanggal_kejadian" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Kejadian <span class="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      id="tanggal_kejadian"
                      name="tanggal_kejadian"
                      v-model="formData.tanggal_kejadian"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                    <div v-if="errors.tanggal_kejadian" class="text-red-500 text-xs mt-1">
                      {{ errors.tanggal_kejadian[0] }}
                    </div>
                  </div>
                  
                  <!-- Bukti Laporan (File Input) Multiple -->
                  <div class="mb-4">
                    <label for="image_path" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                    <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                      <input
                        type="file"
                        id="image_path"
                        name="image_path"
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
                    <div v-if="errors.image_path" class="text-red-500 text-xs mt-1">
                      {{ errors.image_path[0] }}
                    </div>
                    
                    <!-- Image Previews -->
                    <div v-if="imagePreviews.length > 0" class="mt-4">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Preview Foto ({{ imagePreviews.length }} file)</h4>
                      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
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
            
            <!-- Section 2: Informasi Pelapor -->
            <div class="border-b pb-6 mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Pelapor</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div>
                  <div class="mb-4">
                    <label for="nama_pelapor" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                    <input
                      type="text"
                      id="nama_pelapor"
                      name="nama_pelapor"
                      v-model="formData.nama_pelapor"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                      autocomplete="name"
                      disabled
                    />
                  </div>

                  <div class="mb-4">
                    <label for="nim_pelapor" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                    <input
                      type="text"
                      id="nim_pelapor"
                      name="nim_pelapor"
                      v-model="formData.nim_pelapor"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                      autocomplete="off"
                      disabled
                    />
                  </div>

                  <div class="mb-4">
                    <label for="nomor_telepon" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                    <input
                      type="tel"
                      id="nomor_telepon"
                      name="nomor_telepon"
                      v-model="formData.nomor_telepon"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                      autocomplete="tel"
                      disabled
                    />
                  </div>
                  
                  <!-- Profesi Field (TAMBAHAN) -->
                  <div class="mb-4">
                    <label for="profesi" class="block text-sm font-medium text-gray-700 mb-1">Profesi <span class="text-red-500">*</span></label>
                    <select
                      id="profesi"
                      name="profesi"
                      v-model="formData.profesi"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    >
                      <option value="" disabled selected>Pilih Profesi</option>
                      <option value="Mahasiswa">Mahasiswa</option>
                      <option value="Dosen">Dosen</option>
                      <option value="Staff">Staff</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <div v-if="errors.profesi" class="text-red-500 text-xs mt-1">
                      {{ errors.profesi[0] }}
                    </div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div>
                  <!-- Jenis Kelamin Field (TAMBAHAN) -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin <span class="text-red-500">*</span></label>
                    <div class="space-y-2">
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="gender_male"
                          name="jenis_kelamin"
                          v-model="formData.jenis_kelamin"
                          value="laki-laki"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          required
                        />
                        <label for="gender_male" class="ml-2 text-sm text-gray-700">Laki-laki</label>
                      </div>
                      
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="gender_female"
                          name="jenis_kelamin"
                          v-model="formData.jenis_kelamin"
                          value="perempuan"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                        />
                        <label for="gender_female" class="ml-2 text-sm text-gray-700">Perempuan</label>
                      </div>
                    </div>
                    <div v-if="errors.jenis_kelamin" class="text-red-500 text-xs mt-1">
                      {{ errors.jenis_kelamin[0] }}
                    </div>
                  </div>
                  
                  <!-- Rentang Umur Field (TAMBAHAN) -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur <span class="text-red-500">*</span></label>
                    <div class="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-300">
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="below20"
                          name="umur_pelapor"
                          v-model="formData.umur_pelapor"
                          value="<20"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          required
                        />
                        <label for="below20" class="ml-2 text-sm text-gray-700">Kurang dari 20 tahun</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="20to40"
                          name="umur_pelapor"
                          v-model="formData.umur_pelapor"
                          value="20-40"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                        />
                        <label for="20to40" class="ml-2 text-sm text-gray-700">20 - 40 tahun</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="above40"
                          name="umur_pelapor"
                          v-model="formData.umur_pelapor"
                          value="40<"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                        />
                        <label for="above40" class="ml-2 text-sm text-gray-700">Lebih dari 40 tahun</label>
                      </div>
                    </div>
                    <div v-if="errors.umur_pelapor" class="text-red-500 text-xs mt-1">
                      {{ errors.umur_pelapor[0] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Informasi Terduga/Terlapor -->
            <div class="border-b pb-6 mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Terduga/Terlapor</h3>
              
              <div v-for="(terduga, index) in formData.terlapor" :key="index" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
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
                    
                    <!-- Unit Kerja/Prodi -->
                    <div class="mb-4">
                      <label :for="'terduga_unit_kerja_' + index" class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja/Program Studi <span class="text-red-500">*</span></label>
                      <select
                        :id="'terduga_unit_kerja_' + index"
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
                            v-model="terduga.umur_terlapor"
                            value="<20"
                            class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                            required
                          />
                          <label :for="`terlapor-below20-${index}`" class="ml-2 text-sm text-gray-700">Kurang dari 20 tahun</label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-20to40-${index}`"
                            v-model="terduga.umur_terlapor"
                            value="20-40"
                            class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          />
                          <label :for="`terlapor-20to40-${index}`" class="ml-2 text-sm text-gray-700">20 - 40 tahun</label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-above40-${index}`"
                            v-model="terduga.umur_terlapor"
                            value="40<"
                            class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                          />
                          <label :for="`terlapor-above40-${index}`" class="ml-2 text-sm text-gray-700">Lebih dari 40 tahun</label>
                        </div>
                      </div>
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
            
            <!-- Section 4: Informasi Saksi -->
            <div class="border-b pb-6 mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Saksi</h3>
              
              <div v-for="(saksi, index) in formData.saksi" :key="index" class="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
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

            <!-- Section 5: Pernyataan -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Pernyataan</h3>
              
              <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p class="font-medium mb-2">Dengan ini saya menyatakan bahwa:</p>
                <ol class="list-decimal pl-6 mb-4 space-y-2">
                  <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                  <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                  <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
                  <li>Saya menyatakan bersedia laporan ini diproses lebih lanjut sesuai dengan prosedur yang berlaku di UNS.</li>
                </ol>
                
                <div class="flex items-start mt-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    name="agreement"
                    v-model="formData.agreement"
                    class="mt-1 mr-2 focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                    required
                  />
                  <label for="agreement" class="text-sm">
                    Saya menyetujui pernyataan di atas <span class="text-red-500">*</span>
                  </label>
                </div>
                
                <div v-if="errors.agreement" class="text-red-500 text-xs mt-1 ml-6">
                  {{ errors.agreement[0] }}
                </div>
              </div>
            </div>

            <!-- reCAPTCHA v2 -->
            <div class="mb-6">
              <div class="flex flex-col items-center">
                <div ref="recaptchaContainer"></div>
                <div v-if="recaptchaError" class="text-red-500 text-xs mt-2">
                  {{ recaptchaError }}
                  <button 
                    type="button" 
                    @click="resetRecaptcha" 
                    class="text-blue-600 hover:underline ml-2"
                  >
                    Muat ulang reCAPTCHA
                  </button>
                </div>
                <div v-if="errors['g-recaptcha-response']" class="text-red-500 text-xs mt-2">
                  {{ errors['g-recaptcha-response'][0] }}
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                id="cancelButton"
                name="cancelButton"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                @click="goBack"
              >
                Batal
              </button>
              <button 
                type="submit" 
                id="submitButton"
                name="submitButton"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                :disabled="loading"
              >
                <span v-if="loading">Mengirim...</span>
                <span v-else>Simpan Laporan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { decryptData } from '../../../../services/encrypt';
import VueCookies from "vue-cookies";
import Swal from 'sweetalert2';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'AddKekerasanSeksual',
  components: {
    Sidebar,
    Header
  },
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
      currentUser: null,
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
    
    // Set the current date time in the required format
    const now = new Date();
    // Format as YYYY-MM-DD HH:MM:SS in UTC
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.formData.nama_pelapor = userData.name || '';
          this.formData.nim_pelapor = userData.nim || userData.nik || '';
          this.formData.nomor_telepon = userData.no_telp || '';
          
          // Check email domain to determine role
          const email = userData.email || (userData.dosen ? userData.dosen.email : '');
          
          // If email exists and contains "@student", set role as "Mahasiswa"
          if (email && email.includes('@student')) {
            this.formData.profesi = 'Mahasiswa';
          }
          
          // Update current user display if available
          if (userData.username) {
            this.currentUser = userData.username;
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
      
      // Add bukti_pelanggaran as array - EXACT match to AddKS.vue
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
      
      // Append multiple files if they exist - EXACT match to AddKS.vue
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append('image_path[]', this.selectedFiles[i]);
        }
      }
      
      // Agreement field
      formData.append('agreement', this.formData.agreement ? 1 : 0);
      
      // Create XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      // Configure request - EXACT match to AddKS.vue
      xhr.open('POST', `/api/laporan_kekerasan/add_laporan`, true);
      
      // Set timeout (30 seconds)
      xhr.timeout = 30000;
      
      // Handle completion - EXACT match to AddKS.vue
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
            // Redirect to appropriate page for mahasiswa
            this.$router.push('/pelaporan/kekerasan-seksual');
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
/* Additional styling if needed */
.text-red-500 {
  color: #f56565;
}
</style>