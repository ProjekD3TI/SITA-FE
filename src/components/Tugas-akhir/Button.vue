<template>
  <button
    :class="[
      'button-rounded focus:outline-none transition-all flex items-center justify-center gap-2 active:scale-90 duration-200 ',
      variantClass,
      sizeClass,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <!-- Icon di sebelah kiri (jika ada) -->
    <span v-if="leftIconPath" class="flex-shrink-0">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
        class="w-5 h-5"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          :d="leftIconPath" 
        />
      </svg>
    </span>
    
    <slot />
    
    <!-- Icon di sebelah kanan (jika ada) -->
    <span v-if="rightIconPath" class="flex-shrink-0">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
        class="w-5 h-5"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          :d="rightIconPath" 
        />
      </svg>
    </span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

// Props untuk fleksibilitas tombol
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // Variasi tombol: primary, secondary, danger
  },
  size: {
    type: String,
    default: 'md', // Ukuran tombol: sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false, // Apakah tombol dinonaktifkan
  },
  // Untuk kompatibilitas dengan kode lama
  iconPath: {
    type: String,
    default: null, // Path untuk SVG icon
  },
  iconPosition: {
    type: String,
    default: 'left', // Posisi ikon: left, right
    validator: (value) => ['left', 'right'].includes(value)
  },
  // Properties baru untuk mendukung ikon di kedua sisi
  leftIconPath: {
    type: String,
    default: null, // Path untuk SVG icon di sebelah kiri
  },
  rightIconPath: {
    type: String,
    default: null, // Path untuk SVG icon di sebelah kanan
  }
});

// Komputasi nilai left/right icon path yang sebenarnya digunakan
// Mendukung baik model lama (iconPath + iconPosition) maupun model baru (leftIconPath/rightIconPath)
const actualLeftIconPath = computed(() => {
  if (props.leftIconPath) return props.leftIconPath;
  if (props.iconPath && (props.iconPosition === 'left')) return props.iconPath;
  return null;
});

const actualRightIconPath = computed(() => {
  if (props.rightIconPath) return props.rightIconPath;
  if (props.iconPath && (props.iconPosition === 'right')) return props.iconPath;
  return null;
});

// Emit event klik
const emit = defineEmits(['click']);
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};

// Kelas berdasarkan variasi tombol
const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-secondary text-white hover:opacity-90';
    case 'danger':
      return 'bg-danger text-white hover:opacity-90';
    case 'primary':
      return 'bg-primary text-white hover:opacity-90';
    case 'success':
      return 'bg-success text-white hover:opacity-90';
    case 'black':
      return 'bg-black text-white hover:opacity-90';
    case 'outlined-primary':
      return 'border border-primary text-primary hover:bg-primary hover:text-white';
    case 'outlined-secondary':
      return 'border border-secondary text-secondary hover:bg-secondary hover:text-white';
    case 'outlined-success':
      return 'border border-success text-success hover:bg-success hover:text-white';
    case 'outlined-danger':
      return 'border border-danger text-danger hover:bg-danger hover:text-white';
    case 'outlined-black':
      return 'border border-placeholder text-black ';
    default:
      return 'bg-primary text-white hover:opacity-90';
  }
});

// Kelas berdasarkan ukuran tombol
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'body5-bold px-3 py-1 min-w-[100px]';
    case 'lg':
      return 'body3-bold px-5 py-2 min-w-[150px]';
    case 'xl':
      return 'body2-bold px-5 py-3 min-w-[150px]';
    default:
      return 'body4-bold px-4 py-2 min-w-[125px]';
  }
});
</script>