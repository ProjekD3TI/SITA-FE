<script setup>
defineProps({
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
  isOpen: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  subItems: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle']);
</script>

<template>
  <div class="">
    <!-- Dropdown Header -->
    <div 
      @click="$emit('toggle')" 
      :class="active ? 'text-primary hover:bg-primary-bg px-4 rounded' : 'hover:bg-gray-50'" 
      class="cursor-pointer items-center py-2 px-2"
    >
      <div 
        :class="active ? 'border-l-4 border-primary bg-primary-bg rounded' : 'hover:bg-gray-50'" 
        class="px-2 duration-150 flex items-center justify-between cursor-pointer active:scale-95"
      >
        <div class="flex items-center">
          <div class="py-1">
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
            v-bind:class="{'inline': showLabel, 'hidden': !showLabel}" 
            class="uppercase"
          >{{ label }}</span>
        </div>
        <svg 
          v-bind:class="{
            'inline': showLabel,
            'hidden': !showLabel,
            'transform rotate-180': isOpen
          }" 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 transition-transform" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Dropdown Content -->
    <div 
      v-show="isOpen" 
      :class="active ? 'pl-10 py-1' : 'pl-8 py-1'" 
      class="text-gray-700 py-1 flex flex-col gap-2 duration-200"
    >
      <div 
        v-for="item in subItems" 
        :key="item.path"
        :class="item.active ? 'pe-4' : 'block hover:text-primary'" 
        class="py-1"
      >
        <router-link 
          :to="item.path" 
          :class="item.active ? 'text-primary hover:bg-primary-bg rounded' : 'hover:text-primary'" 
          class="px-2 block active:scale-95 duration-150"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </div>
</template>