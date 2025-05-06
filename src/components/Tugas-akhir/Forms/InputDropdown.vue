<template>
    <div class="relative w-full">
      <label :for="id" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold">{{ label }}</label>
      <div class="border border-placeholder bg-white input-rounded px-6 py-3 body4 w-full flex items-center">
        <input
          :id="id"
          type="text"
          class="w-full outline-none"
          :placeholder="placeholder"
          v-model="searchQuery"
          ref="inputRef"
          @focus="isDropdownOpen = true"
          @blur="handleBlur"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-black transition-transform duration-300"
          :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div
        v-if="isDropdownOpen"
        class="absolute z-10 w-full bg-white border border-placeholder input-rounded shadow-md mt-1 max-h-40 overflow-y-auto"
      >
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="px-4 py-2 hover:bg-placeholder/10 cursor-pointer"
          @mousedown="selectOption(option)"
        >
          {{ option.label }}
        </div>
        <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-placeholder">
          Tidak ada opsi ditemukan
        </div>
      </div>
    </div>
  </template>
  
// In InputDropdown.vue
<script setup>
import { ref, computed } from 'vue';

// Define props properly
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, required: true },
  options: {
    type: Array,
    required: true,
    default: () => []
  }
});

const selectedValue = ref('');
const searchQuery = ref('');
const isDropdownOpen = ref(false);

// Fix the computed property to use props.options instead of options
const filteredOptions = computed(() =>
  props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const selectOption = (option) => {
  selectedValue.value = option.value;
  searchQuery.value = option.label;
  isDropdownOpen.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 0);
};
</script>