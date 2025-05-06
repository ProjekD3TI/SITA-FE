<template>
    <div class="relative w-full">
      <label :for="id" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold">{{ label }}</label>
      <div class="flex w-full">
        <div
          :id="id"
          class="border-y border-l border-placeholder rounded-l-[12px] px-6 py-3 body4 flex-1 min-w-0 flex items-center overflow-hidden"
          :class="{ 'text-placeholder': !fileUrl, 'text-black': fileUrl }"
        >
          <div
            class="flex items-center gap-2 w-full min-w-0 overflow-hidden"
            :class="fileUrl ? 'cursor-pointer active:scale-95 duration-200' : ''"
            @click="downloadFile"
          >
            <svg v-show="fileUrl" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 flex-shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span class="max-w-[150px] sm:max-w-none truncate overflow-hidden">{{ fileName || 'Tidak ada file terpilih' }}</span>
          </div>
        </div>
        <label :for="id + '-upload'" class="cursor-pointer rounded-r-[12px] bg-secondary px-4 text-white body4 flex items-center justify-center whitespace-nowrap flex-shrink-0">Choose File</label>
      </div>
      <input
        :id="id + '-upload'"
        type="file"
        class="hidden"
        @change="handleFileChange"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
  });
  
  const fileName = ref('');
  const fileUrl = ref(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      fileName.value = file.name;
      fileUrl.value = URL.createObjectURL(file);
    } else {
      fileName.value = 'Tidak ada file terpilih.';
      fileUrl.value = null;
    }
  };
  
  const downloadFile = () => {
    if (fileUrl.value) {
      const link = document.createElement('a');
      link.href = fileUrl.value;
      link.download = fileName.value;
      link.click();
    }
  };
  </script>
  