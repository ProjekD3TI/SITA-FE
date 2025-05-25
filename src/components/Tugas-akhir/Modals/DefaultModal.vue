<script setup>
import { ref } from 'vue';

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
    <div @mousedown.self="handleBackdropClick"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-11/12 max-w-screen-md p-8 bg-white card-rounded">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <h5 class="heading5">{{ headText }}</h5>
                    <p class="body4">{{ bodyText }}</p>
                </div>
                <button @click="closeModal" class="p-2 rounded-full hover:bg-placeholder/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-6 h-6 align-top">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <slot></slot>
        </div>

    </div>
</template>