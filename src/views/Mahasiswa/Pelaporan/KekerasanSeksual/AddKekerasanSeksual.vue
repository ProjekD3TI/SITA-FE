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
          <form @submit.prevent="submitReport" class="space-y-6" name="reportForm" id="reportForm">
            <!-- Section 1: Detail Laporan -->
            <div class="border-b pb-6 mb-6">
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
                      name="title"
                      v-model="report.title"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      autocomplete="off"
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
                    <label for="link" class="block text-sm font-medium text-gray-700 mb-1">Link Lampiran Tambahan</label>
                    <input
                      type="url"
                      id="link"
                      name="link"
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
                      name="description"
                      v-model="report.description"
                      rows="5"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                      autocomplete="off"
                      required
                    ></textarea>
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
                  </div>
                  
                  <!-- Bukti Laporan (File Input) Multiple -->
                  <div class="mb-4">
                    <label for="evidence" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                    <div class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                      <input
                        type="file"
                        id="evidence"
                        name="evidence"
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
                    <label for="reporterName" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                    <input
                      type="text"
                      id="reporterName"
                      name="reporterName"
                      v-model="report.reporterName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                      autocomplete="name"
                      disabled
                    />
                  </div>

                  <div class="mb-4">
                    <label for="nim" class="block text-sm font-medium text-gray-700 mb-1">NIM Pelapor</label>
                    <input
                      type="text"
                      id="nim"
                      name="nim"
                      v-model="report.nim"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-100"
                      autocomplete="off"
                      disabled
                    />
                  </div>

                  <div class="mb-4">
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      v-model="report.phone"
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
                          v-model="report.jenis_kelamin"
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
                          v-model="report.jenis_kelamin"
                          value="perempuan"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                        />
                        <label for="gender_female" class="ml-2 text-sm text-gray-700">Perempuan</label>
                      </div>
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
                          v-model="report.umur_pelapor"
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
                          v-model="report.umur_pelapor"
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
                          v-model="report.umur_pelapor"
                          value="40<"
                          class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                        />
                        <label for="above40" class="ml-2 text-sm text-gray-700">Lebih dari 40 tahun</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Informasi Terduga/Terlapor -->
            <div class="border-b pb-6 mb-6">
              <h3 class="text-xl font-semibold mb-4 text-gray-700">Informasi Terduga/Terlapor</h3>
              
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCookies from "vue-cookies";
import { decryptData } from '../../../../services/encrypt';
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
        saksi: [],
        // Tambahkan field baru
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
      },
      categories: [],
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
      showAgreementWarning: false,
      isSubmitting: false,
      imagePreviews: [],
      selectedFiles: [],
      currentUser: null,
      formattedDateTime: null,
      
      // reCAPTCHA improved configuration
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
    // Initialize with one empty object for terduga and saksi
    this.addTerduga();
    this.addSaksi();
    
    // Set the current date time in the required format
    const now = new Date();
    this.formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
  },

  beforeUnmount() {
    // Properly cleanup reCAPTCHA
    this.cleanupRecaptcha();
  },

  mounted() {
    this.fetchCategories();
    
    // Improved reCAPTCHA initialization with retry mechanism
    this.$nextTick(() => {
      this.initRecaptcha();
    });
  },

  methods: {
    // Improved reCAPTCHA methods
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
    
    // Your existing methods (keep these unchanged)
    loadUserData() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.report.reporterName = userData.name || '';
          this.report.nim = userData.nim || userData.nik || '';
          this.report.phone = userData.no_telp || '';
          
          // Auto-select profession based on email domain
          if (userData.email && userData.email.includes('@student')) {
            this.report.profesi = 'Mahasiswa';
            console.log('Auto-selected profession: Mahasiswa based on student email');
          }
          
          // Update current user display if available
          if (userData.username) {
            this.currentUser = userData.username;
          }
          
          console.log("User data loaded successfully");
        } else {
          console.log("No user data found in cookies, using default data");
          this.setDefaultUserData();
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        this.setDefaultUserData();
      }
    },
    
    setDefaultUserData() {
      // Default user data if cookie is not available
      this.report.reporterName = 'Miftahul';
      this.report.nim = 'miftahul01';
      this.report.phone = '';
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

    validateForm() {
      let isValid = true;
      let errors = [];
      
      // Check required fields
      if (!this.report.title) {
        errors.push('Judul Laporan wajib diisi');
        isValid = false;
      }
      
      if (!this.report.category) {
        errors.push('Kategori wajib dipilih');
        isValid = false;
      }
      
      if (!this.report.description) {
        errors.push('Deskripsi wajib diisi');
        isValid = false;
      }
      
      if (!this.report.incidentDate) {
        errors.push('Tanggal & Waktu Kejadian wajib diisi');
        isValid = false;
      }
      
      if (this.report.bukti_pelanggaran.length === 0) {
        errors.push('Bukti Pelanggaran wajib dipilih minimal satu');
        isValid = false;
      }
      
      if (!this.report.profesi) {
        errors.push('Profesi wajib dipilih');
        isValid = false;
      }
      
      if (!this.report.jenis_kelamin) {
        errors.push('Jenis Kelamin wajib dipilih');
        isValid = false;
      }
      
      if (!this.report.umur_pelapor) {
        errors.push('Rentang Umur wajib dipilih');
        isValid = false;
      }
      
      // Check if evidence files exist
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        errors.push('Lampiran Foto wajib diupload');
        isValid = false;
      }
      
      // Check terlapor entries
      let validTerlapor = false;
      for (const terduga of this.report.terlapor) {
        if (terduga.nama_lengkap && terduga.jenis_kelamin && 
            terduga.status_warga && terduga.unit_kerja && 
            terduga.umur_terlapor) {
          validTerlapor = true;
          break;
        }
      }
      
      if (!validTerlapor) {
        errors.push('Data Terduga/Terlapor wajib diisi lengkap minimal untuk satu orang');
        isValid = false;
      }
      
      // Check saksi entries
      let validSaksi = false;
      for (const saksi of this.report.saksi) {
        if (saksi.nama_lengkap && saksi.email && saksi.nomor_telepon) {
          validSaksi = true;
          break;
        }
      }
      
      if (!validSaksi) {
        errors.push('Data Saksi wajib diisi lengkap minimal untuk satu orang');
        isValid = false;
      }
      
      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Form Tidak Lengkap',
          html: '<ul><li>' + errors.join('</li><li>') + '</li></ul>'
        });
      }
      
      return isValid;
    },
    
    // Improved form submission method
    submitReport() {
      // Reset warnings
      this.showBuktiWarning = false;
      this.showAgreementWarning = false;
      this.recaptchaError = null;

      if (!this.validateForm()) {
        return;
      }
      
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
      
      // Get the latest reCAPTCHA response directly
      const recaptchaResponseToken = this.getRecaptchaResponse();
      
      // Validate reCAPTCHA
      if (!recaptchaResponseToken) {
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
      
      // Validate bukti_pelanggaran
      if (this.report.bukti_pelanggaran.length === 0) {
        this.showBuktiWarning = true;
        return;
      }
      
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('judul', this.report.title);
      formData.append('category_id', this.report.category);
      formData.append('deskripsi', this.report.description);
      formData.append('tanggal_kejadian', this.report.incidentDate);
      formData.append('nama_pelapor', this.report.reporterName);
      formData.append('nim_pelapor', this.report.nim);
      formData.append('nomor_telepon', this.report.phone);
      formData.append('current_datetime', this.formattedDateTime);
      formData.append('username', this.currentUser || 'miftahul01');
      
      // Use the most recent reCAPTCHA token
      formData.append('g-recaptcha-response', recaptchaResponseToken);
      
      // Tambahkan field baru
      formData.append('profesi', this.report.profesi);
      formData.append('jenis_kelamin', this.report.jenis_kelamin);
      formData.append('umur_pelapor', this.report.umur_pelapor);
      
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
      formData.append('agreement', this.report.agreement ? 1 : 0);
      
      // Show loading state
      this.isSubmitting = true;
      
      // Create XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      // Configure request
      xhr.open('POST', '/api/laporan_kekerasan/add_laporan', true);
      
      // Set timeout (30 seconds)
      xhr.timeout = 30000;
      
      // Handle successful completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success response
          this.isSubmitting = false;
          
          // Parse response if needed
          let responseData;
          try {
            responseData = JSON.parse(xhr.responseText);
            console.log('Response data:', responseData);
          } catch (e) {
            console.log('Response is not JSON:', xhr.responseText);
          }
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Laporan berhasil dikirimkan.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.$router.push('/pelaporan/kekerasan-seksual');
          });
          
          this.resetForm();
        } else {
          // Error response
          this.isSubmitting = false;
          
          let errorMessage = 'Terjadi kesalahan:';
          
          // Try to parse error response
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            console.log('Error response:', errorResponse);
            
            // Check if the error response has a detailed message
            if (errorResponse && errorResponse.message) {
              errorMessage += '\n- ' + errorResponse.message;
            }
            
            // Check for validation errors
            if (errorResponse && errorResponse.errors) {
              const errors = errorResponse.errors;
              Object.keys(errors).forEach(key => {
                if (Array.isArray(errors[key])) {
                  errorMessage += '\n- ' + errors[key].join(', ');
                } else {
                  errorMessage += '\n- ' + errors[key];
                }
              });
            }
          } catch (e) {
            console.log('Error parsing response:', e);
            errorMessage += '\n- ' + xhr.statusText;
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Form Submission Error',
            text: errorMessage
          });
          
          console.log('Status:', xhr.status);
          console.log('Response:', xhr.responseText);
        }
      };
      
      // Handle network errors
      xhr.onerror = () => {
        this.isSubmitting = false;
        console.log('Network error occurred');
        
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Server tidak merespon. Periksa koneksi internet Anda.'
        });
      };
      
      // Handle timeouts
      xhr.ontimeout = () => {
        this.isSubmitting = false;
        console.log('Request timed out');
        
        Swal.fire({
          icon: 'error',
          title: 'Timeout Error',
          text: 'Permintaan melebihi batas waktu. Silakan coba lagi.'
        });
      };
      
      // Add a progress indicator for larger files
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && this.report.evidenceFiles && this.report.evidenceFiles.length > 0) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
          
          // You could update a progress bar here if you have one
        }
      };
      
      // Log when request starts
      console.log('Starting XHR request');
      
      // Send the request
      try {
        xhr.send(formData);
      } catch (error) {
        this.isSubmitting = false;
        console.error('Error sending form:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat mengirim form: ' + error.message
        });
      }
    },
    
    // Modified resetForm method with improved reCAPTCHA reset
    resetForm() {
      this.report = {
        title: '',
        category: '',
        description: '',
        reporterName: this.report.reporterName,
        nim: this.report.nim,
        phone: this.report.phone,
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
          unit_kerja: '',
          jenis_kelamin: '',
          umur_terlapor:''
        }],
        saksi: [{ 
          nama_lengkap: '',
          email: '',
          nomor_telepon: ''
        }],
        // Reset field baru
        profesi: '',
        jenis_kelamin: '',
        umur_pelapor: ''
      };
      
      this.selectedFiles = [];
      this.selectedBukti = [];
      this.showLainnyaInput = false;
      this.buktiLainnya = '';
      this.showBuktiWarning = false;
      this.showAgreementWarning = false;
      this.imagePreviews = [];
      
      // Reset file input
      const fileInput = document.getElementById('evidence');
      if (fileInput) fileInput.value = '';
      
      // Reset reCAPTCHA - using our improved reset method
      this.resetRecaptcha();
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
/* Additional styling if needed */
.text-red-500 {
  color: #f56565;
}
</style>