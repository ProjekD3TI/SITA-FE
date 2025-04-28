<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <div class="p-4">
        <div class="bg-white shadow rounded-lg p-6 mb-4">
          <h1 class="text-2xl font-semibold text-gray-800">Tambah Laporan Kejadian</h1>
          <p class="text-gray-600 mt-2">Silakan isi formulir berikut untuk menambahkan laporan kejadian baru.</p>
        </div>
        
        <!-- Form Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="submitForm">
            <!-- Section 1: Detail Laporan -->
            <div class="mb-8 border-b pb-6">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Detail Laporan</h2>
            
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div>
                  <div class="mb-4">
                    <label for="judul" class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.judul }"
                      id="judul" 
                      v-model="form.judul" 
                      required
                    >
                    <div v-if="errors.judul" class="text-red-500 text-sm mt-1">{{ errors.judul[0] }}</div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="category_id" class="block text-sm font-medium text-gray-700 mb-1">Kategori <span class="text-red-500">*</span></label>
                    <select 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.category_id }"
                      id="category_id" 
                      v-model="form.category_id" 
                      required
                    >
                      <option value="" disabled selected>Pilih Kategori</option>
                      <option v-for="category in filteredCategories" :key="category.id || category.category_id" :value="category.id || category.category_id">
                        {{ category.nama || category.name }}
                      </option>
                    </select>
                    <div v-if="errors.category_id" class="text-red-500 text-sm mt-1">{{ errors.category_id[0] }}</div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="lampiran" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Foto <span class="text-red-500">*</span></label>
                    <input 
                      type="file" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.image_path || errors['image_path.0'] }"
                      id="lampiran" 
                      accept="image/*"
                      @change="handleFileUpload"
                      multiple
                      required
                    >
                    <p class="text-xs text-gray-500 mt-1">Anda dapat memilih beberapa foto sekaligus</p>
                    <div v-if="errors.image_path" class="text-red-500 text-sm mt-1">{{ errors.image_path[0] }}</div>
                    <div v-if="errors['image_path.0']" class="text-red-500 text-sm mt-1">{{ errors['image_path.0'][0] }}</div>
                    
                    <!-- Image previews with remove buttons -->
                    <div v-if="imagePreviews.length > 0" class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div v-for="(preview, index) in imagePreviews" :key="index" class="relative">
                        <img :src="preview" alt="Preview" class="h-32 w-full object-cover rounded-md border border-gray-300">
                        <button 
                          type="button" 
                          @click="removeImage(index)" 
                          class="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bukti Pelanggaran Section (new) -->
                  <div class="mb-4">
                    <h3 class="text-base font-medium text-gray-700 mb-2">Bukti Pelanggaran <span class="text-red-500">*</span></h3>
                    <div v-if="errors.bukti_pelanggaran" class="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                      {{ typeof errors.bukti_pelanggaran === 'string' ? errors.bukti_pelanggaran : 'Harap pilih minimal satu alat bukti' }}
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-md border">
                      <div v-for="(option, index) in buktiOptions" :key="index" class="mb-2 last:mb-0">
                        <div class="flex items-start">
                          <input 
                            type="checkbox" 
                            :id="`bukti-${index}`"
                            :value="option.value" 
                            v-model="form.bukti_pelanggaran"
                            class="mt-1 mr-2"
                          />
                          <label :for="`bukti-${index}`" class="text-sm">
                            {{ option.label }}
                            <span v-if="option.description" class="block text-xs text-gray-500">{{ option.description }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div>
                  <div class="mb-4">
                    <label for="lampiran_link" class="block text-sm font-medium text-gray-700 mb-1">Lampiran Link</label>
                    <input 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.lampiran_link }"
                      id="lampiran_link" 
                      v-model="form.lampiran_link" 
                      placeholder="http://example.com"
                    >
                    <div v-if="errors.lampiran_link" class="text-red-500 text-sm mt-1">{{ errors.lampiran_link[0] }}</div>
                    <p class="text-xs text-gray-500 mt-1">Opsional: Masukkan URL yang berkaitan dengan laporan</p>
                  </div>
                  
                  <div class="mb-4">
                    <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span class="text-red-500">*</span></label>
                    <textarea 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.deskripsi }"
                      id="deskripsi" 
                      v-model="form.deskripsi" 
                      rows="5" 
                      placeholder="Berikan Deskripsi atau Kronologi Kejadian"
                      required
                    ></textarea>
                    <div v-if="errors.deskripsi" class="text-red-500 text-sm mt-1">{{ errors.deskripsi[0] }}</div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="tanggal_kejadian" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu Kejadian <span class="text-red-500">*</span></label>
                    <input 
                      type="datetime-local" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      :class="{ 'border-red-500': errors.tanggal_kejadian }"
                      id="tanggal_kejadian" 
                      v-model="form.tanggal_kejadian" 
                      required
                    >
                    <div v-if="errors.tanggal_kejadian" class="text-red-500 text-sm mt-1">{{ errors.tanggal_kejadian[0] }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Section 2: Informasi Pelapor -->
            <div class="mb-8 border-b pb-6">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Informasi Pelapor</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div>
                  <div class="mb-4">
                    <label for="nama_pelapor" class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                    <input 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                      id="nama_pelapor" 
                      v-model="form.nama_pelapor" 
                      disabled
                    >
                  </div>
                  
                  <div class="mb-4">
                    <label for="nim_pelapor" class="block text-sm font-medium text-gray-700 mb-1">NIM/NIK Pelapor</label>
                    <input 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                      id="nim_pelapor" 
                      v-model="form.nim_pelapor" 
                      disabled
                    >
                  </div>
                  
                  <div class="mb-4">
                    <label for="nomor_telepon" class="block text-sm font-medium text-gray-700 mb-1">Nomor HP Pelapor</label>
                    <input 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" 
                      id="nomor_telepon" 
                      v-model="form.nomor_telepon" 
                      disabled
                    >
                  </div>
                  
                  <div class="mb-4">
                    <label for="profesi" class="block text-sm font-medium text-gray-700 mb-1">Profesi <span class="text-red-500">*</span></label>
                    <select
                      id="profesi"
                      v-model="form.profesi"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :class="{ 'border-red-500': errors.profesi }"
                      required
                    >
                      <option value="" disabled selected>Pilih Profesi</option>
                      <option value="Mahasiswa">Mahasiswa</option>
                      <option value="Dosen">Dosen</option>
                      <option value="Staff">Staff</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <div v-if="errors.profesi" class="text-red-500 text-sm mt-1">{{ errors.profesi[0] }}</div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div>
                  <!-- Jenis Kelamin Radio Buttons -->
                  <div class="mb-4">
                    <span class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin <span class="text-red-500">*</span></span>
                    <div class="space-y-2" :class="{ 'border-red-500 border rounded-md p-2': errors.jenis_kelamin }">
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="laki-laki"
                          v-model="form.jenis_kelamin"
                          value="laki-laki"
                          class="mr-2"
                          required
                        />
                        <label for="laki-laki" class="text-sm text-gray-700">Laki-laki</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="perempuan"
                          v-model="form.jenis_kelamin"
                          value="perempuan"
                          class="mr-2"
                        />
                        <label for="perempuan" class="text-sm text-gray-700">Perempuan</label>
                      </div>
                    </div>
                    <div v-if="errors.jenis_kelamin" class="text-red-500 text-sm mt-1">{{ errors.jenis_kelamin[0] }}</div>
                  </div>
                  
                  <!-- Umur Pelapor Radio Buttons -->
                  <div class="mb-4">
                    <span class="block text-sm font-medium text-gray-700 mb-2">Rentang Umur <span class="text-red-500">*</span></span>
                    <div class="space-y-2" :class="{ 'border-red-500 border rounded-md p-2': errors.umur_pelapor }">
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="below20"
                          v-model="form.umur_pelapor"
                          value="<20"
                          class="mr-2"
                          required
                        />
                        <label for="below20" class="text-sm text-gray-700">Kurang dari 20 tahun</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="20to40"
                          v-model="form.umur_pelapor"
                          value="20-40"
                          class="mr-2"
                        />
                        <label for="20to40" class="text-sm text-gray-700">20 - 40 tahun</label>
                      </div>
                      <div class="flex items-center">
                        <input
                          type="radio"
                          id="above40"
                          v-model="form.umur_pelapor"
                          value="40<"
                          class="mr-2"
                        />
                        <label for="above40" class="text-sm text-gray-700">Lebih dari 40 tahun</label>
                      </div>
                    </div>
                    <div v-if="errors.umur_pelapor" class="text-red-500 text-sm mt-1">{{ errors.umur_pelapor[0] }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Section 3: Identitas Terlapor/Terduga -->
            <div class="mb-8 border-b pb-6">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Identitas Terlapor/Terduga</h2>
              <div v-if="errors.terlapor" class="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {{ typeof errors.terlapor === 'string' ? errors.terlapor : 'Harap isi data terlapor dengan benar' }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Opsional: Anda dapat mengosongkan semua field terlapor jika tidak ingin mengisikan.</p>
              
              <div v-for="(item, index) in form.terlapor" :key="`terlapor-${index}`" class="mb-5 bg-gray-50 p-4 rounded-md border">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="font-medium text-gray-700">Terlapor #{{ index + 1 }}</h3>
                  <button 
                    type="button" 
                    class="text-red-500 hover:bg-red-100 p-1 rounded-full"
                    @click="removeTerlapor(index)" 
                    :disabled="form.terlapor.length <= 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Left Column -->
                  <div>
                    <div class="mb-4">
                      <label :for="`terlapor-nama-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        :id="`terlapor-nama-${index}`"
                        v-model="item.nama_lengkap"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`terlapor.${index}.nama_lengkap`] }"
                      />
                      <div v-if="errors[`terlapor.${index}.nama_lengkap`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.nama_lengkap`][0] }}
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label :for="`terlapor-email-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        :id="`terlapor-email-${index}`"
                        v-model="item.email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`terlapor.${index}.email`] }"
                      />
                      <div v-if="errors[`terlapor.${index}.email`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.email`][0] }}
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label :for="`terlapor-telepon-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        :id="`terlapor-telepon-${index}`"
                        v-model="item.nomor_telepon"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`terlapor.${index}.nomor_telepon`] }"
                      />
                      <div v-if="errors[`terlapor.${index}.nomor_telepon`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.nomor_telepon`][0] }}
                      </div>
                    </div>
                    
                    <!-- Gender Radio for Terlapor -->
                    <div class="mb-4">
                      <span class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</span>
                      <div class="space-y-2" :class="{ 'border-red-500 border rounded-md p-2': errors[`terlapor.${index}.jenis_kelamin`] }">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-laki-${index}`"
                            v-model="item.jenis_kelamin"
                            value="laki-laki"
                            class="mr-2"
                          />
                          <label :for="`terlapor-laki-${index}`" class="text-sm text-gray-700">Laki-laki</label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-perempuan-${index}`"
                            v-model="item.jenis_kelamin"
                            value="perempuan"
                            class="mr-2"
                          />
                          <label :for="`terlapor-perempuan-${index}`" class="text-sm text-gray-700">Perempuan</label>
                        </div>
                      </div>
                      <div v-if="errors[`terlapor.${index}.jenis_kelamin`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.jenis_kelamin`][0] }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Right Column -->
                  <div>
                    <!-- Age Radio for Terlapor -->
                    <div class="mb-4">
                      <span class="block text-sm font-medium text-gray-700 mb-1">Rentang Umur</span>
                      <div class="space-y-2" :class="{ 'border-red-500 border rounded-md p-2': errors[`terlapor.${index}.umur_terlapor`] }">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-below20-${index}`"
                            v-model="item.umur_terlapor"
                            value="<20"
                            class="mr-2"
                          />
                          <label :for="`terlapor-below20-${index}`" class="text-sm text-gray-700">Kurang dari 20 tahun</label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-20to40-${index}`"
                            v-model="item.umur_terlapor"
                            value="20-40"
                            class="mr-2"
                          />
                          <label :for="`terlapor-20to40-${index}`" class="text-sm text-gray-700">20 - 40 tahun</label>
                        </div>
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`terlapor-above40-${index}`"
                            v-model="item.umur_terlapor"
                            value="40<"
                            class="mr-2"
                          />
                          <label :for="`terlapor-above40-${index}`" class="text-sm text-gray-700">Lebih dari 40 tahun</label>
                        </div>
                      </div>
                      <div v-if="errors[`terlapor.${index}.umur_terlapor`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.umur_terlapor`][0] }}
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label :for="`terlapor-status-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Status Warga UNS</label>
                      <select
                        :id="`terlapor-status-${index}`"
                        v-model="item.status_warga"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`terlapor.${index}.status_warga`] }"
                      >
                        <option value="" disabled selected>Pilih Status</option>
                        <option value="dosen">Dosen</option>
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="staff">Staff</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                      <div v-if="errors[`terlapor.${index}.status_warga`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.status_warga`][0] }}
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label :for="`terlapor-unit-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
                      <select
                        :id="`terlapor-unit-${index}`"
                        v-model="item.unit_kerja"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`terlapor.${index}.unit_kerja`] }"
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
                      <div v-if="errors[`terlapor.${index}.unit_kerja`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`terlapor.${index}.unit_kerja`][0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                type="button" 
                class="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 flex items-center justify-center"
                @click="addTerlapor"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tambah Terlapor
              </button>
            </div>
            
            <!-- Section 4: Saksi -->
            <div class="mb-8 border-b pb-6">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Saksi</h2>
              <div v-if="errors.saksi" class="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {{ typeof errors.saksi === 'string' ? errors.saksi : 'Harap isi data saksi dengan benar' }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Opsional: Anda dapat mengosongkan semua field saksi jika tidak ingin mengisikan.</p>
              
              <div v-for="(item, index) in form.saksi" :key="`saksi-${index}`" class="mb-5 bg-gray-50 p-4 rounded-md border">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="font-medium text-gray-700">Saksi #{{ index + 1 }}</h3>
                  <button 
                    type="button" 
                    class="text-red-500 hover:bg-red-100 p-1 rounded-full"
                    @click="removeSaksi(index)" 
                    :disabled="form.saksi.length <= 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="mb-4">
                    <label :for="`saksi-nama-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      :id="`saksi-nama-${index}`"
                      v-model="item.nama_lengkap"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :class="{ 'border-red-500': errors[`saksi.${index}.nama_lengkap`] }"
                    />
                    <div v-if="errors[`saksi.${index}.nama_lengkap`]" class="text-red-500 text-sm mt-1">
                      {{ errors[`saksi.${index}.nama_lengkap`][0] }}
                    </div>
                  </div>
                  
                  <div>
                    <div class="mb-4">
                      <label :for="`saksi-email-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        :id="`saksi-email-${index}`"
                        v-model="item.email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`saksi.${index}.email`] }"
                      />
                      <div v-if="errors[`saksi.${index}.email`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`saksi.${index}.email`][0] }}
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label :for="`saksi-telepon-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        :id="`saksi-telepon-${index}`"
                        v-model="item.nomor_telepon"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :class="{ 'border-red-500': errors[`saksi.${index}.nomor_telepon`] }"
                      />
                      <div v-if="errors[`saksi.${index}.nomor_telepon`]" class="text-red-500 text-sm mt-1">
                        {{ errors[`saksi.${index}.nomor_telepon`][0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                type="button" 
                class="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 flex items-center justify-center"
                @click="addSaksi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tambah Saksi
              </button>
            </div>
            
            <!-- Section 5: Pernyataan -->
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Pernyataan</h2>
              <div class="bg-gray-50 border border-gray-200 rounded-md p-6">
                <p class="font-medium text-gray-700 mb-3">Dengan ini saya menyatakan bahwa:</p>
                <ol class="list-decimal pl-5 mb-4 space-y-2">
                  <li>Segala informasi yang saya berikan dalam laporan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                  <li>Saya bersedia memberikan keterangan lebih lanjut apabila diperlukan untuk proses penanganan laporan.</li>
                  <li>Saya memahami bahwa memberikan laporan palsu dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.</li>
                </ol>
                <div class="flex items-start mt-4">
                  <input
                    type="checkbox"
                    id="agreement"
                    v-model="form.agreement"
                    class="mt-1 mr-2"
                    required
                  />
                  <label for="agreement" class="text-sm">
                    Saya menyetujui pernyataan di atas <span class="text-red-500">*</span>
                  </label>
                </div>
                <div v-if="errors.agreement" class="text-red-500 text-sm mt-1">{{ errors.agreement[0] }}</div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="goBack"
              >
                Kembali
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="loading || !form.agreement"
              >
                <span v-if="loading">Mengirim...</span>
                <span v-else>Kirim Laporan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" :class="{ 'text-green-600': isSuccess, 'text-red-600': !isSuccess }">
                  {{ modalTitle }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ modalMessage }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';
import { decryptData } from '../../../../services/encrypt';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2';

export default {
  name: 'AddPelaporanKejadian',
  components: {
    Sidebar,
    Header,
    Footer
  },
  data() {
    return {
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
      // Define bukti pelanggaran options
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
  computed: {
    filteredCategories() {
      // Pastikan categories ada sebelum melakukan filter
      if (!this.categories || !Array.isArray(this.categories) || this.categories.length === 0) {
        return [];
      }
      
      // Filter kategori, sesuaikan dengan property yang tersedia
      return this.categories.filter(category => {
        const name = category.nama || category.name || '';
        return !name.startsWith('Kekerasan');
      });
    }
  },
  created() {
    // Coba ambil token dari cookie
    this.getAuthTokenFromCookie();
  },
  mounted() {
    this.fetchCategories();
    this.loadUserData();
  },
  methods: {
    getAuthTokenFromCookie() {
      try {
        // Cek jika ada cookie token langsung
        let token = VueCookies.get('token');
        if (token) {
          this.token = token;
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          console.log('Token set from direct cookie');
          return;
        }
        
        // Cek dari user_session
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          if (userData && userData.token) {
            this.token = userData.token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            console.log('Token set from user_session');
          }
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    },
    loadUserData() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.form.nama_pelapor = userData.name || '';
          this.form.nim_pelapor = userData.nim || userData.nik || '';
          this.form.nomor_telepon = userData.no_telp || '';
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    fetchCategories() {
      // Tambahkan header otorisasi jika ada token
      const config = {};
      if (this.token) {
        config.headers = {
          'Authorization': `Bearer ${this.token}`
        };
      }
      
      axios.get('http://localhost:8000/api/category', config)
        .then(response => {
          console.log('Categories response:', response.data);
          
          // Handle berbagai format respons
          if (Array.isArray(response.data)) {
            this.categories = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            this.categories = response.data.data;
          } else {
            console.warn('Unexpected category response format:', response.data);
            this.categories = [];
          }
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
          if (error.response && error.response.status === 401) {
            this.showNotification('Error Autentikasi', 'Sesi login telah berakhir. Silakan login kembali.', false);
          } else {
            this.showNotification('Error', 'Gagal memuat kategori laporan.', false);
          }
        });
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }
      
      // Initialize image_path as array if it's not already
      if (!this.form.image_path) {
        this.form.image_path = [];
      }
      
      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.errors.image_path = ['Ukuran file maksimal 5MB'];
          continue; // Skip this file but continue with others
        }
        
        // Add file to image_path array
        this.form.image_path.push(file);
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage(index) {
      // Remove both the preview and the file from arrays
      this.imagePreviews.splice(index, 1);
      this.form.image_path.splice(index, 1);
    },
    // Methods for terlapor management
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
      // Ensure we always have at least one terlapor
      if (this.form.terlapor.length > 1) {
        this.form.terlapor.splice(index, 1);
      }
    },
    // Methods for saksi management
    addSaksi() {
      this.form.saksi.push({
        nama_lengkap: '',
        email: '',
        nomor_telepon: ''
      });
    },
    removeSaksi(index) {
      // Ensure we always have at least one saksi
      if (this.form.saksi.length > 1) {
        this.form.saksi.splice(index, 1);
      }
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
        this.errors.deskripsi = ['Deskripsi kejadian harus diisi'];
        isValid = false;
      }
      
      if (!this.form.tanggal_kejadian) {
        this.errors.tanggal_kejadian = ['Tanggal dan waktu kejadian harus diisi'];
        isValid = false;
      }
      
      if (!this.form.image_path || this.form.image_path.length === 0) {
        this.errors.image_path = ['Lampiran foto harus diunggah'];
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
      
      // Validate bukti_pelanggaran (at least one must be selected)
      if (!this.form.bukti_pelanggaran || this.form.bukti_pelanggaran.length === 0) {
        this.errors.bukti_pelanggaran = ['Harap pilih minimal satu alat bukti'];
        isValid = false;
      }
      
      if (!this.form.agreement) {
        this.errors.agreement = ['Anda harus menyetujui pernyataan untuk melanjutkan'];
        isValid = false;
      }
      
      // Terlapor dan saksi are optional, but if filled must be valid
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
    submitForm() {
      // Validate form first
      if (!this.validateForm()) {
        // Scroll to first error
        this.$nextTick(() => {
          const firstError = document.querySelector('.border-red-500');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }
      
      this.loading = true;
      this.errors = {};
      
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
      
      // Append optional link if provided
      if (this.form.lampiran_link) {
        formData.append('lampiran_link', this.form.lampiran_link);
      }
      
      // Append bukti_pelanggaran to the form data as individual items
      this.form.bukti_pelanggaran.forEach((bukti, index) => {
        formData.append(`bukti_pelanggaran[${index}]`, bukti);
      });
      
      // Append multiple images with array notation
      if (this.form.image_path && this.form.image_path.length > 0) {
        for (let i = 0; i < this.form.image_path.length; i++) {
          formData.append('image_path[]', this.form.image_path[i]);
        }
      }
      
      // Process terlapor data - only include valid entries
      const validTerlapor = this.form.terlapor.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon || item.status_warga || 
        item.unit_kerja || item.jenis_kelamin || item.umur_terlapor
      );
      
      if (validTerlapor.length > 0) {
        validTerlapor.forEach((item, index) => {
          // Only add fields that have values
          if (item.nama_lengkap) formData.append(`terlapor[${index}][nama_lengkap]`, item.nama_lengkap);
          if (item.email) formData.append(`terlapor[${index}][email]`, item.email);
          if (item.nomor_telepon) formData.append(`terlapor[${index}][nomor_telepon]`, item.nomor_telepon);
          if (item.status_warga) formData.append(`terlapor[${index}][status_warga]`, item.status_warga);
          if (item.unit_kerja) formData.append(`terlapor[${index}][unit_kerja]`, item.unit_kerja);
          if (item.jenis_kelamin) formData.append(`terlapor[${index}][jenis_kelamin]`, item.jenis_kelamin);
          if (item.umur_terlapor) formData.append(`terlapor[${index}][umur_terlapor]`, item.umur_terlapor);
        });
      }
      
      // Process saksi data - only include valid entries
      const validSaksi = this.form.saksi.filter(item => 
        item.nama_lengkap || item.email || item.nomor_telepon
      );
      
      if (validSaksi.length > 0) {
        validSaksi.forEach((item, index) => {
          // Only add fields that have values
          if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
          if (item.email) formData.append(`saksi[${index}][email]`, item.email);
          if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
        });
      }

      // Log for debugging
      console.log('Submitting form with data:', {
        judul: this.form.judul,
        category_id: this.form.category_id,
        deskripsi: this.form.deskripsi,
        tanggal_kejadian: this.form.tanggal_kejadian,
        lampiran_link: this.form.lampiran_link,
        profesi: this.form.profesi,
        jenis_kelamin: this.form.jenis_kelamin,
        umur_pelapor: this.form.umur_pelapor,
        bukti_pelanggaran: this.form.bukti_pelanggaran,
        image_count: this.form.image_path ? this.form.image_path.length : 0,
        terlapor_count: validTerlapor.length,
        saksi_count: validSaksi.length,
        agreement: this.form.agreement
      });

      // Siapkan konfigurasi dengan header yang benar
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      };
      
      // Tambahkan token jika tersedia
      if (this.token) {
        config.headers['Authorization'] = `Bearer ${this.token}`;
        console.log('Adding token to request');
      } else {
        console.warn('No token available for request');
        
        // Coba refresh token sekali lagi
        this.getAuthTokenFromCookie();
        if (this.token) {
                    // Refresh token if necessary
          config.headers['Authorization'] = `Bearer ${this.token}`;
          console.log('Token refreshed and added to request');
        }
      }

      // Kirim permintaan ke backend dengan header yang sudah disiapkan
      axios.post('http://localhost:8000/api/laporan/add_laporan', formData, config)
        .then(response => {
          this.loading = false;
          console.log('Success response:', response);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Laporan berhasil ditambahkan.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // After the timer finishes or alert is closed
            this.$router.push('/pelaporan/kejadian');
          });
          this.resetForm();
        })
        .catch(error => {
          this.loading = false;
          console.error('Error submitting form:', error);
          
          if (error.response) {
            if (error.response.status === 401) {
              this.showNotification('Error Autentikasi', 'Sesi login telah berakhir. Silakan login kembali untuk melanjutkan.', false);
              
              // Optional: Redirect to login after a delay
              setTimeout(() => {
                this.$router.push('/mahasiswa/login');
              }, 3000);
            } else if (error.response.status === 400) {
              this.errors = error.response.data;
            } else if (error.response.status === 422 && error.response.data.errors) {
              // Handle Laravel validation errors
              const validationErrors = error.response.data.errors;
              this.errors = {};
              
              // Convert Laravel validation errors to our format
              Object.keys(validationErrors).forEach(key => {
                this.errors[key] = validationErrors[key];
              });
            } else {
              this.showNotification('Error', `Terjadi kesalahan saat mengirim laporan. (${error.response.status})`, false);
            }
          } else if (error.request) {
            this.showNotification('Error Koneksi', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', false);
          } else {
            this.showNotification('Error', 'Terjadi kesalahan saat mengirim laporan.', false);
          }
        });
    },
    resetForm() {
      this.form = {
        judul: '',
        category_id: '',
        deskripsi: '',
        tanggal_kejadian: '',
        image_path: [],
        nama_pelapor: this.form.nama_pelapor,
        nim_pelapor: this.form.nim_pelapor,
        nomor_telepon: this.form.nomor_telepon,
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
        this.$router.push('/pelaporan/kejadian');
      }
    }
  }
};
</script>

<style scoped>
/* Adding focused styles for form elements */
input:focus, select:focus, textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  outline: none;
}

/* Style for disabled inputs */
input:disabled, select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

/* Required field indicator */
.text-red-500 {
  color: #ef4444;
}

/* Button hover effects */
button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Custom checkbox styles */
input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Custom radio button styles */
input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Section styling */
.border-b {
  border-bottom-width: 1px;
  border-color: #e5e7eb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>