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
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-black">×</button>
      </div>

      <!-- Isi konten modal -->
      <slot />

      <!-- Tombol aksi -->
      <div class="flex justify-end gap-2 mt-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">Batal</button>
        <button @click="$emit('submit')" class="px-4 py-2 text-white bg-blue-600 rounded">
          {{ submitText }}
        </button>
      </div>
    </div>
  </div>
</template>


