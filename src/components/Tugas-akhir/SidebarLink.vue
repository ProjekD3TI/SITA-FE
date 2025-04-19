<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="ms-4 me-4 py-2">
    <router-link 
      :to="to"
      :class="active ? 'border-l-4 border-primary bg-primary-bg text-primary hover:bg-primary-bg px-2' : 'hover:text-primary'" 
      class="rounded duration-150 justify-start flex items-center active:scale-95"
    >
      <div class="mr-0 py-1">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          v-html="icon"
        ></svg>
      </div>
      <span 
        :class="{'inline': showLabel, 'hidden': !showLabel}" 
        class="uppercase"
      >{{ label }}</span>
    </router-link>
  </div>
</template>