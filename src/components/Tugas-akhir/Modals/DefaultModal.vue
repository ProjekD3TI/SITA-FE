<script setup>
import { ref, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
    headText: {
        type: String,
        default: 'Judul Tugas Akhir'
    },
    bodyText: {
        type: String,
        default: 'Judul Tugas Akhir'
    },
    closeOnClickOutside: {
        type: Boolean,
        default: true
    }
})

// Methods
const closeModal = () => {
    // isVisible.value = false; // HAPUS ini
    emit('close');
};


    // Akses closeOnClickOutside melalui objek props
    const handleBackdropClick = () => {
    if (props.closeOnClickOutside) {
      closeModal();
    }
  };
</script>
<template>
    <div @mousedown.self="handleBackdropClick" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white card-rounded p-8 w-11/12 max-w-screen-md">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <h5 class="heading5">{{ headText }}</h5>
                    <p class="body4">{{ bodyText }}</p>
                </div>
                <button @click="closeModal" class="hover:bg-placeholder/20 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 align-top">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <slot></slot>
        </div>

    </div>
</template>