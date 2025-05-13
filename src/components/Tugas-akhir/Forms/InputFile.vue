<template>
  <div class="relative w-full">
    <label 
      :for="id" 
      :class="`absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold`"
    >
      {{ label }}
    </label>
    <div class="flex w-full">
      <div
        :id="id"
        :class="`border-y border-l border-placeholder rounded-l-[12px] px-4 sm:px-6 py-3 body5 sm:body4 flex-1 min-w-0 flex items-center overflow-hidden ${!hasFile ? 'text-placeholder' : 'text-black'}`"
      >
        <div
          class="flex items-center gap-2 w-full min-w-0 overflow-hidden"
          :class="hasFile ? 'cursor-pointer active:scale-95 duration-200' : ''"
          @click="hasFile ? downloadFile() : null"
        >
          <svg v-show="hasFile" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span class="max-w-[150px] sm:max-w-none truncate overflow-hidden">
            {{ hasFile ? currentFileName : 'Tidak ada file terpilih' }}
          </span>
        </div>
      </div>
      <!-- PERBAIKAN DISINI: Gunakan div saat disabled dan label saat enabled -->
      <template v-if="disabled">
        <div class="bg-secondary text-white rounded-r-[12px] px-2 sm:px-4 body5 sm:body4 flex items-center justify-center whitespace-nowrap flex-shrink-0 cursor-not-allowed">
          Choose File
        </div>
      </template>
      <template v-else>
        <label 
          :for="id + '-upload'" 
          class="bg-secondary rounded-r-[12px] px-2 sm:px-4 text-white body5 sm:body4 flex items-center justify-center whitespace-nowrap flex-shrink-0 cursor-pointer"
        >
          <span class="active:scale-90 duration-200">Choose File</span> 
        </label>
      </template>
    </div>
    <input
      :id="id + '-upload'"
      type="file"
      class="hidden"
      @change="handleFileChange"
      :disabled="disabled"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [File, null], default: null },
  disabled: { type: Boolean, default: false },
  existingFileName: { type: String, default: '' },
  existingFileUrl: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);

// Simpan file yang diupload user
const uploadedFile = ref(null);
const uploadedFileUrl = ref(null);

// Computed untuk menentukan apakah ada file (baru atau existing)
const hasFile = computed(() => {
  return !!uploadedFile.value || !!props.existingFileUrl;
});

// Computed untuk menentukan nama file yang ditampilkan
const currentFileName = computed(() => {
  return uploadedFile.value ? uploadedFile.value.name : props.existingFileName;
});

// Handler saat file berubah
const handleFileChange = (event) => {
  if (props.disabled) return;
  
  const file = event.target.files[0];
  if (file) {
    // Jika ada file yang dipilih, simpan file dan buat URL-nya
    uploadedFile.value = file;
    
    // Revoke URL lama jika ada untuk mencegah memory leak
    if (uploadedFileUrl.value) {
      URL.revokeObjectURL(uploadedFileUrl.value);
    }
    
    uploadedFileUrl.value = URL.createObjectURL(file);
    emit('update:modelValue', file);
    
    console.log('File baru diupload:', file.name);
  } else {
    // Jika tidak ada file yang dipilih, reset ke default
    if (uploadedFileUrl.value) {
      URL.revokeObjectURL(uploadedFileUrl.value);
    }
    
    uploadedFile.value = null;
    uploadedFileUrl.value = null;
    emit('update:modelValue', null);
  }
};

// Fungsi download/view file
const downloadFile = () => {
  // Prioritas ke file yang diupload user
  if (uploadedFile.value && uploadedFileUrl.value) {
    console.log('Downloading uploaded file:', uploadedFile.value.name);
    
    try {
      // Gunakan FileReader untuk file yang diupload user
      const reader = new FileReader();
      reader.onload = (e) => {
        const link = document.createElement('a');
        link.href = e.target.result;
        link.download = uploadedFile.value.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(uploadedFile.value);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: Gunakan window.open dengan URL objek
      window.open(uploadedFileUrl.value, '_blank');
    }
  }
  // Fallback ke file existing jika tidak ada file yang diupload
  else if (props.existingFileUrl) {
    console.log('Opening existing file:', props.existingFileName);
    window.open(props.existingFileUrl, '_blank');
  }
};
</script>