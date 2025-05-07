<template>
  <div v-if="isVisible" @mousedown.self="handleBackdropClick" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white card-rounded p-6 w-11/12 max-w-md">
      <div class="flex justify-between items-center mb-4">
        <div class="bg-warning/20 rounded-full p-2 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-warning">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>
        <button @click="closeModal" class="hover:bg-placeholder/20 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 align-top">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <h2 class="body2-bold">{{ headText }}</h2>
      <div class="text-black/60 body4-bold mt-2">
          <slot/>
      </div>
      <div class="flex justify-between gap-2 mt-4">
        <Button 
        class="w-full sm:hidden"
        variant="danger"
        size="md"
        @click="reject" 
        >Tolak</Button>
        <Button 
        class="w-full sm:hidden"
        variant="success"
        size="md"
        @click="accept" 
        >Terima</Button>
        <Button 
        class="w-full hidden sm:block"
        variant="danger"
        size="lg"
        @click="reject" 
        >Tolak</Button>
        <Button 
        class="w-full hidden sm:block"
        variant="success"
        size="lg"
        @click="accept" 
        >Terima</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import Button from '@/components/Tugas-akhir/Button.vue';
// Definisikan props dengan benar dan simpan dalam variabel props
const props = defineProps({
  headText: {
    type: String,
    default: 'Verifikasi blablabla.'
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

// State
const isVisible = ref(false);

// Events
const emit = defineEmits(['accept', 'reject', 'close']);

// Methods
const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

// Akses closeOnClickOutside melalui objek props
const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {  // Perbaikan: Gunakan props.closeOnClickOutside
    closeModal();
  }
};

const accept = () => {
  emit('accept');
  closeModal();
};

const reject = () => {
  emit('reject');
  closeModal();
};

// Expose methods untuk diakses dari komponen induk
defineExpose({
  closeModal,
  open: () => { isVisible.value = true; }
});
</script>