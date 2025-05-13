<template>
    <div class="tooltip-container" @mouseenter="showTooltip" @mouseleave="hideTooltip">
      <!-- Konten yang diberi tooltip -->
      <slot></slot>
      
      <!-- Tooltip -->
      <div 
        v-show="isVisible" 
        class="tooltip" 
        :class="[positionClass, sizeClass, customClass]"
        :style="tooltipStyle"
      >
        {{ text }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    position: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    delay: {
      type: Number,
      default: 200
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    customClass: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  });
  
  const isVisible = ref(false);
  let timeoutId = null;
  
  // Fungsi untuk menampilkan tooltip dengan delay
  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      isVisible.value = true;
    }, props.delay);
  };
  
  // Fungsi untuk menyembunyikan tooltip
  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    isVisible.value = false;
  };
  
  // Computed property untuk kelas position
  const positionClass = computed(() => {
    return `tooltip-${props.position}`;
  });
  
  // Computed property untuk kelas size
  const sizeClass = computed(() => {
    return `tooltip-${props.size}`;
  });
  
  // Computed property untuk style tooltip
  const tooltipStyle = computed(() => {
    return props.width ? { width: props.width } : {};
  });
  </script>
  
  <style scoped>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }
  
  .tooltip {
    position: absolute;
    background-color: rgba(247, 128, 82, 1);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    z-index: 50;
    text-align: center;
    pointer-events: none;
    white-space: nowrap;
    font-size: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: opacity 0.2s ease-in-out;
  }
  
  /* Posisi */
  .tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
  }
  
  .tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
  }
  
  .tooltip-left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(-8px);
  }
  
  .tooltip-right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(8px);
  }
  
  /* Ukuran */
  .tooltip-sm {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  }
  
  .tooltip-md {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
  
  .tooltip-lg {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }
  
  /* Arrows */
  .tooltip-top::after {
    content: "";
    position: absolute;
    top: 93%;
    left: 45%;
    border-radius: 30%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    rotate: 45deg;
    border-color: rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1);  }
  
  .tooltip-bottom::after {
    content: "";
    position: absolute;
    bottom: 80%;
    left: 45%;
    border-radius: 30%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    rotate: 45deg;
    border-color: rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1);  }
  
  .tooltip-left::after {
    content: "";
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 95%;
    border-radius: 30%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    rotate: 45deg;
    border-color: rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1);
  }
  
  .tooltip-right::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 93%;
    border-radius: 30%;
    margin-top: -7px;
    border-width: 7px;
    border-style: solid;
    rotate: 45deg;
    border-color: rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1) rgba(247, 128, 82, 1);  }
  </style>