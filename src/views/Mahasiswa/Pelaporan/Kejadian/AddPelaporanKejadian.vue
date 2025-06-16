<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header :userData="userData" />
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
  <!-- Label and Input -->
  <label for="lampiran" class="block text-sm font-medium text-gray-700 mb-1">
    Lampiran Foto <span class="text-red-500" aria-hidden="true">*</span>
    <span class="sr-only">wajib</span>
  </label>
  
  <input 
    type="file" 
    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
    :class="{ 
      'border-red-500 focus:ring-red-500 focus:border-red-500': errors.image_path || errors['image_path.0'],
      'cursor-pointer': !loading
    }"
    id="lampiran" 
    accept="image/jpeg,image/jpg,image/png"
    @change="handleFileUpload"
    multiple
    required
    :disabled="loading"
    aria-describedby="lampiran-help lampiran-error"
  >
  
  <!-- Help Text -->
  <p 
    id="lampiran-help" 
    class="text-xs text-gray-500 mt-1 flex items-center gap-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>
      Anda dapat memilih beberapa foto sekaligus (Format: JPG, PNG, maks. 2MB per file)
    </span>
  </p>

  <!-- Error Messages -->
  <div 
    v-if="errors.image_path || errors['image_path.0']" 
    id="lampiran-error" 
    class="text-red-500 text-sm mt-1"
    role="alert"
  >
    <p v-if="errors.image_path">{{ Array.isArray(errors.image_path) ? errors.image_path[0] : errors.image_path }}</p>
    <p v-if="errors['image_path.0']">{{ Array.isArray(errors['image_path.0']) ? errors['image_path.0'][0] : errors['image_path.0'] }}</p>
  </div>
  
  <!-- Image Preview Grid -->
  <div 
    v-if="imagePreviews.length > 0" 
    class="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
    role="list"
    aria-label="Pratinjau foto yang diunggah"
  >
    <div 
      v-for="(preview, index) in imagePreviews" 
      :key="index" 
      class="relative group"
      role="listitem"
    >
      <!-- Image Preview -->
      <div class="relative aspect-square">
        <img 
          :src="preview" 
          :alt="`Preview foto ${index + 1}`"
          class="h-full w-full object-cover rounded-md border border-gray-300 transition-opacity duration-200"
          :class="{ 'group-hover:opacity-75': !loading }"
        >
        
        <!-- Loading Overlay -->
        <div 
          v-if="loading" 
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md"
        >
          <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <!-- Remove Button -->
      <button 
        type="button" 
        @click="removeImage(index)" 
        class="absolute top-1 right-1 bg-white rounded-full p-1.5 shadow-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
        :disabled="loading"
        :aria-label="`Hapus foto ${index + 1}`"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 text-red-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Empty State -->
  <div 
    v-if="!imagePreviews.length && !errors.image_path" 
    class="mt-3 text-center p-6 border-2 border-dashed border-gray-300 rounded-md"
  >
    <svg 
      class="mx-auto h-12 w-12 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
    <p class="mt-1 text-sm text-gray-500">
      Pilih atau seret foto ke sini
    </p>
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
        { value: 'dokumen_rekaman', label: 'Dokumen dan/atau rekaman video' },
        { value: 'foto_dokumentasi', label: 'Foto dokumentasi kejadian' },
        { value: 'surat_pernyataan', label: 'Surat pernyataan kejadian' },
        { value: 'laporan_saksi', label: 'Keterangan saksi kejadian' },
        { value: 'identitas_sumber', label: 'Identitas sumber informasi pihak ketiga' },
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
  created() {
    // Set the base URL for all axios requests
    axios.defaults.baseURL = 'https://v3422040.mhs.d3tiuns.com';
    
    // Get the auth token
    if (!this.getAuthTokenFromCookie()) {
      // If no token is found, show a notification
      this.$nextTick(() => {
        this.showNotification('Sesi Login', 'Sesi login Anda mungkin sudah berakhir. Silakan login kembali.', false);
        
        // Optional: Redirect to login after a delay
        setTimeout(() => {
          this.$router.push('/mahasiswa/login');
        }, 2000);
      });
    }
  },
  mounted() {
    this.fetchCategories();
    this.loadUserData();
  },
  methods: {
    getAuthTokenFromCookie() {
      try {
        // First try auth_token cookie (this is what your auth services use)
        let authToken = VueCookies.get('auth_token');
        if (authToken) {
          this.token = authToken;
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          return true;
        }
        
        // Then check from user_session
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          try {
            const userData = decryptData(encryptedUserData);
            if (userData && userData.token) {
              this.token = userData.token;
              axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
              console.log('Token set from user_session');
              return true;
            }
          } catch (decryptError) {
            console.error('Error decrypting user_session:', decryptError);
          }
        }
        
        console.warn('No auth token found in cookies');
        return false;
      } catch (error) {
        console.error('Error getting auth token:', error);
        return false;
      }
    },
    // Add this to your existing loadUserData method
    loadUserData() {
      try {
        const encryptedUserData = VueCookies.get("user_session");
        if (encryptedUserData) {
          const userData = decryptData(encryptedUserData);
          this.form.nama_pelapor = userData.name || '';
          this.form.nim_pelapor = userData.nim || userData.nik || '';
          this.form.nomor_telepon = userData.no_telp || '';
          
          // Auto-select profession based on email domain
          if (userData.email && userData.email.includes('@student')) {
            this.form.profesi = 'Mahasiswa';
            console.log('Auto-selected profession: Mahasiswa based on student email');
          }
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
      
      axios.get('https://v3422040.mhs.d3tiuns.com/api/category', config)
        .then(response => {
          
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
  const fileInput = event.target;
  const files = fileInput.files;
  
  // Clear previous errors
  this.errors.image_path = null;
  delete this.errors['image_path.0'];
  delete this.errors['image_path.1'];
  
  // Validate files
  if (!files || files.length === 0) {
    this.errors.image_path = ['Tidak ada file yang dipilih'];
    return;
  }
  
  // Reset arrays
  this.form.image_path = [];
  this.imagePreviews = [];
  
  // Define restrictions
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  let hasError = false;
  
  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Validate file object
    if (!file || !(file instanceof File)) {
      this.errors.image_path = ['File tidak valid'];
      hasError = true;
      break;
    }
    
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      this.errors.image_path = [`File "${file.name}" memiliki format yang tidak didukung. Gunakan format JPG atau PNG.`];
      hasError = true;
      break;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      this.errors.image_path = [
        `File "${file.name}" terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maksimal 2MB per file.`
      ];
      hasError = true;
      break;
    }
    
    // Add file to array
    this.form.image_path.push(file);
    
    // Create image preview with error handling
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target && e.target.result) {
          this.imagePreviews.push(e.target.result);
        }
      } catch (error) {
        console.error('Error creating preview:', error);
        // Don't break the upload process for preview errors
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      // Don't break the upload process for preview errors
    };
    
    // Start reading the file
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error initiating file read:', error);
      // Continue with next file if preview fails
    }
  }
  
  // If error occurred, clear the file input and arrays
  if (hasError) {
    fileInput.value = '';
    this.form.image_path = [];
    this.imagePreviews = [];
    return;
  }
  
  // Validate final state
  if (this.form.image_path.length === 0) {
    this.errors.image_path = ['Tidak ada file yang berhasil diunggah'];
    fileInput.value = '';
    return;
  }
  
  // Log success for debugging
  console.log(`Successfully processed ${this.form.image_path.length} files:`, 
    this.form.image_path.map(f => ({
      name: f.name,
      type: f.type,
      size: `${(f.size / (1024 * 1024)).toFixed(2)}MB`
    }))
  );
},
removeImage(index) {
  try {
    // Validate index
    if (index < 0 || index >= this.form.image_path.length) {
      console.error('Invalid image index:', index);
      return;
    }

    // Store file info for logging
    const removedFile = this.form.image_path[index];
    const fileName = removedFile ? removedFile.name : 'unknown';

    // Remove from both arrays
    this.imagePreviews.splice(index, 1);
    this.form.image_path.splice(index, 1);

    // Update error states
    if (this.form.image_path.length === 0) {
      this.errors.image_path = ['Lampiran foto harus diunggah'];
      
      // Clear any indexed error messages
      delete this.errors['image_path.0'];
      delete this.errors['image_path.1'];
      
      // Reset file input if it exists
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    } else {
      // Clear any existing error messages since we still have files
      this.errors.image_path = null;
      delete this.errors['image_path.0'];
      delete this.errors['image_path.1'];
    }

    // Log for debugging
    console.log(`File "${fileName}" removed successfully. Remaining files: ${this.form.image_path.length}`);

  } catch (error) {
    console.error('Error removing image:', error);
    // Don't throw the error to prevent UI disruption
  }
},
    checkFileValidity(file) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        return {
          valid: false,
          message: `File "${file.name}" memiliki format ${file.type} yang tidak didukung. Format yang didukung: JPG, PNG.`
        };
      }
      
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          message: `File "${file.name}" berukuran ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maksimal 2MB per file.`
        };
      }
      
      return { valid: true };
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
      try {
        // Validate form first
        if (!this.validateForm()) {
          this.$nextTick(() => {
            const firstError = document.querySelector('.border-red-500');
            if (firstError) {
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
          return;
        }
        
        // Extra validation for images
        if (!this.form.image_path || !Array.isArray(this.form.image_path) || this.form.image_path.length === 0) {
          this.errors.image_path = ['Lampiran foto harus diunggah'];
          return;
        }

        // Initialize FormData here, before any usage
        const formData = new FormData();
        
        // CRITICAL FIX: Validate each image before attempting to upload
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
        
        // Check each image for size and format issues
        for (let i = 0; i < this.form.image_path.length; i++) {
          const file = this.form.image_path[i];
          
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            this.showNotification(
              'File Terlalu Besar', 
              `File "${file.name}" berukuran ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maksimal 2MB per file.`,
              false
            );
            return;
          }
          
          // Check file type
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
        if (!this.getAuthTokenFromCookie()) {
          this.loading = false;
          this.showNotification('Error Autentikasi', 'Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.', false);
          setTimeout(() => {
            this.$router.push('/mahasiswa/login');
          }, 2000);
          return;
        }
        
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
        
        // // Append images using the correct format
        // if (this.form.image_path.length > 0) {
        //   this.form.image_path.forEach((file, index) => {
        //     formData.append('image_path[]', file);
        //   });
        // }

        // NEW CODE:
        this.form.image_path.forEach((file, index) => {
          formData.append(`image_path[${index}]`, file);
        });
        
        // Process terlapor data
        const validTerlapor = this.form.terlapor.filter(item => 
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
        const validSaksi = this.form.saksi.filter(item => 
          item.nama_lengkap || item.email || item.nomor_telepon
        );
        
        if (validSaksi.length > 0) {
          validSaksi.forEach((item, index) => {
            if (item.nama_lengkap) formData.append(`saksi[${index}][nama_lengkap]`, item.nama_lengkap);
            if (item.email) formData.append(`saksi[${index}][email]`, item.email);
            if (item.nomor_telepon) formData.append(`saksi[${index}][nomor_telepon]`, item.nomor_telepon);
          });
        }

        // Process image uploads - Complete rewrite with simplicity in mind
        if (this.form.image_path && this.form.image_path.length > 0) {
          // Try the simplest approach possible
          this.form.image_path.forEach((file, index) => {
            // Use a simple string key without brackets
            formData.append('image_path_' + index, file);
            console.log(`Appending image with simplified key: image_path_${index}`, file.name, file.type, file.size);
          });
          
          // Add a field to tell the server how many files we sent
          formData.append('image_path_count', this.form.image_path.length);
        } else {
          this.errors.image_path = ['Lampiran foto harus diunggah'];
          this.loading = false;
          return;
        }

        // Make a test to confirm FormData content
        const formDataContent = {};
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            formDataContent[key] = `File: ${value.name}, type: ${value.type}, size: ${value.size} bytes`;
          } else {
            formDataContent[key] = value;
          }
        }
        console.log('FormData content:', formDataContent);

        // Process bukti_pelanggaran array
        if (this.form.bukti_pelanggaran && this.form.bukti_pelanggaran.length > 0) {
          this.form.bukti_pelanggaran.forEach((item, index) => {
            formData.append(`bukti_pelanggaran[${index}]`, item);
          });
        }

        // Get auth token
        const authToken = this.token || this.$cookies.get('auth_token');
        if (!authToken) {
          this.loading = false;
          this.showNotification('Error Autentikasi', 'Token autentikasi tidak ditemukan. Silakan login kembali.', false);
          
          setTimeout(() => {
            this.$router.push('/mahasiswa/login');
          }, 2000);
          return;
        }

        // Debug FormData contents
        console.log('Submitting form with files:', this.form.image_path.length);
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        // Send the request using axios
        this.debugFormDataRequest(formData);

        // Try using XHR instead of axios
        this.uploadWithXHR(formData, authToken)
          .then(response => {
            this.loading = false;
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
          })
          .catch(error => {
            console.error('XHR error:', error);
            this.loading = false;
            
            if (error.status === 401) {
              this.$cookies.remove("auth_token");
              this.$cookies.remove("user_session");
              this.token = null;
              
              this.showNotification('Error Autentikasi', 'Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.', false);
              
              setTimeout(() => {
                this.$router.push('/mahasiswa/login');
              }, 2000);
            } else {
              try {
                const errorData = JSON.parse(error.response);
                this.errors = errorData;
                
                if (errorData['image_path'] || errorData['image_path.0'] || errorData['image_path.1']) {
                  const errorMsg = errorData['image_path'] || errorData['image_path.0'] || errorData['image_path.1'];
                  this.errors.image_path = Array.isArray(errorMsg) ? errorMsg : [errorMsg];
                  
                  this.showNotification(
                    'Gagal Mengunggah Gambar', 
                    'Terdapat masalah dengan unggahan gambar. Pastikan ukuran file tidak terlalu besar dan format file didukung.',
                    false
                  );
                } else {
                  const errorMessage = typeof errorData === 'string' ? errorData : 'Terjadi kesalahan saat mengirim laporan.';
                  this.showNotification('Error', errorMessage, false);
                }
              } catch (parseError) {
                this.showNotification('Error', 'Terjadi kesalahan saat memproses respons server.', false);
              }
            }
          });
      } catch (error) {
        console.error('Error in submitForm:', error);
        this.loading = false;
        this.showNotification('Error', 'Terjadi kesalahan tak terduga. Silakan coba lagi.', false);
      }
    },
    // Alternative upload using XMLHttpRequest directly
    uploadWithXHR(formData, authToken) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', 'https://v3422040.mhs.d3tiuns.com/api/laporan/add_laporan', true);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText,
              response: xhr.response
            });
          }
        };
        
        xhr.onerror = function() {
          reject({
            status: this.status,
            statusText: xhr.statusText,
            response: xhr.response
          });
        };
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
          }
        };
        
        xhr.send(formData);
      });
    },
    // Add this debug function
    debugFormDataRequest(formData) {
      console.log('---DEBUG REQUEST START---');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Create a test request to check what's actually being sent
      const testFormData = new FormData();
      testFormData.append('test_file', this.form.image_path[0]);
      
      fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testFormData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Test FormData upload result:', data);
      })
      .catch(error => {
        console.error('Test FormData upload error:', error);
      });
      
      console.log('---DEBUG REQUEST END---');
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