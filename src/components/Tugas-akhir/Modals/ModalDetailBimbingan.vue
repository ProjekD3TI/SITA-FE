<template>
    <div v-if="isVisible" @mousedown.self="handleBackdropClick" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white card-rounded p-6 w-11/12 max-w-md">
        <div class="flex justify-between items-center mb-4">
          <div class="flex justify-between w-full">
            <div class="flex items-center">
              <div class="bg-success/20 rounded-full p-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-success">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h2 class="body2-bold">{{ title }}</h2>
            </div>
            <StatusLabel 
                class="hidden sm:flex h-fit self-center"
                :status="status"
                :label="statusLabel"
                size="md"
            />
            <StatusLabel 
                class="sm:hidden h-fit self-center"
                :status="status"
                :label="statusLabel"
                size="sm"
            />
          </div>
  
          <button @click="closeModal" class="hover:bg-placeholder/20 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 align-top">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="text-black/60 body4-bold mt-2">
          <p>{{ bimbinganKe }}, {{ tanggalBimbingan }}</p>
          <p></p>
          <p>{{ bab }}</p>
          <p class="mt-2">          
            Catatan : <br>
            {{ catatan }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Button from '@/components/Tugas-akhir/Button.vue';
  import StatusLabel from '@/components/Tugas-akhir/Label.vue';
  
  // Definisikan props dengan benar dan simpan dalam variabel props
  const props = defineProps({
    title: {
      type: String,
      default: 'Bimbingan'
    },
    bimbinganKe: {
      type: String,
      default: 'Bimbingan Keberapa'
    },
    tanggalBimbingan: {
      type: String,
      default: '01 Januari 2000'
    },
    bab: {
      type: String,
      default: 'BAB I'
    },
    catatan: {
      type: String,
      default: 'Tidak ada catatan'
    },
    status: {
      type: String,
      default: 'success' // 'success', 'warning', 'danger'
    },
    statusLabel: {
      type: String,
      default: 'Diterima'
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
    if (props.closeOnClickOutside) {
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