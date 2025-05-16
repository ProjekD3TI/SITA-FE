<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Yakin'
  }
});

const emit = defineEmits(['close', 'confirm']);
</script>
<template>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
          <!-- Tombol Close -->
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-black"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
  
          <!-- Judul -->
          <h2 class="text-lg font-semibold mb-1 text-gray-900">
            {{ title || 'Apakah anda yakin menghapus item ini?' }}
          </h2>
          <!-- Deskripsi -->
          <p class="text-sm text-gray-500 mb-6">
            {{ description || 'Anda tidak dapat mengembalikan item yang telah dihapus.' }}
          </p>
  
          <!-- Tombol Yakin -->
          <button
            @click="emit('confirm')"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {{ confirmText || 'Yakin' }}
          </button>
        </div>
      </div>
    </Transition>
  </template>
  
