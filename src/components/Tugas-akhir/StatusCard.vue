<script setup>
import StatusLabel from '@/components/Tugas-akhir/Label.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'success'
  },
  statusLabel: {
    type: String,
    required: true
  },
  statusType: {
    type: String,
    default: 'success'
  },
  labelSize: {
    type: String,
    default: 'lg'
  }
});

// Mapping for predefined background colors
const bgColorMap = {
  success: 'bg-success/20 text-success',
  danger: 'bg-danger/20 text-danger',
  warning: 'bg-warning/20 text-warning',
  placeholder: 'bg-placeholder/20 text-placeholder',
  primary: 'bg-primary/20 text-primary',
  black: 'border border-black text-black',
};

// Get appropriate background class based on iconColor
const getBgClass = (color) => {
  // Check if the color is one of our predefined colors
  if (bgColorMap[color]) {
    return bgColorMap[color];
  }
  
  // Handle custom colors (like purple-500, blue-400, etc.)
  if (color.includes('-')) {
    return `bg-${color}/20 text-${color}`;
  }
  
  // Default fallback
  return bgColorMap.success;
};
</script>

<template>
  <div class="flex flex-col h-full gap-4 justify-between min-w-[240px]">
    <h5 class="body2-bold sm:body1-bold">{{ title }}</h5>
    <div class="flex flex-col gap-4 self-center">
      <div :class="[getBgClass(iconColor), 'rounded-full p-4 w-fit mx-auto']">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
        </svg>
      </div>
      <StatusLabel
        class="self-center"
        :status="statusType"
        :label="statusLabel"
        :size="labelSize"
      />
    </div>
  </div>
</template>