  <script setup>
  defineProps({
    show: Boolean,
    title: String,
    submitText: {
      type: String,
      default: 'Simpan'
    }
  })
  defineEmits(['close', 'submit'])
  </script>
<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-black">×</button>
        </div>
  
        <!-- Isi konten modal -->
        <slot />
  
        <!-- Tombol aksi -->
        <div class="mt-4 flex justify-end gap-2">
          <button @click="$emit('close')" class="bg-gray-300 px-4 py-2 rounded">Batal</button>
          <button @click="$emit('submit')" class="bg-blue-600 text-white px-4 py-2 rounded">
            {{ submitText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  

  