<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white card-rounded p-6 max-w-md w-full">
        <div class="flex justify-between items-center">
          <p class="mt-4 body3-bold">Pastikan salah satu penguji adalah dosen pembimbing!</p>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-2 body5 text-black">Anda tidak dapat membuat jadwal tanpa dosen pembimbing.</p>
        <button 
          @click="close" 
          class="mt-6 w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition">
          Kembali
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // State
  const isOpen = ref(false);
  
  // Methods
  const open = () => {
    isOpen.value = true;
  };
  
  const close = () => {
    isOpen.value = false;
  };
  
  // Expose methods to parent components
  defineExpose({
    open,
    close
  });
  </script>