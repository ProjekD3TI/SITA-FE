<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'danger'
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: 'Progress'
  }
});

// Computed map for background colors based on the iconColor prop
const bgColorMap = {
  danger: 'bg-danger/20 text-danger',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
  primary: 'bg-primary/20 text-primary'
};

// Returns appropriate background class based on iconColor
const getBgClass = (color) => {
  return bgColorMap[color] || bgColorMap.danger;
};
</script>

<template>
  <div class="flex flex-col justify-center gap-8 items-center px-6 lg:px-6 py-6">
    <div :class="[getBgClass(iconColor), 'rounded-full p-3 w-fit']">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
      </svg>
    </div>
    <h5 class="heading3 text-center">{{ title }}</h5>
    <p class="body3 text-placeholder text-center">{{ subtitle }}</p>
  </div>
</template>