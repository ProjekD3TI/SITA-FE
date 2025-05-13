<template>
  <div class="relative w-full">
    <label :for="id" class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold">{{ label }}</label>
    <div class="border border-placeholder bg-white input-rounded px-4 sm:px-6 py-3 body5 sm:body4 w-full flex items-center">
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
        class="w-5 h-5 text-black transition-transform duration-300 cursor-pointer"
        :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        @click="toggleDropdown"
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
        :class="{ 'bg-placeholder/20': selectedValue === option.value }"
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['update:modelValue']);

// Define props properly
const props = defineProps({
id: { type: String, required: true },
label: { type: String, required: true },
placeholder: { type: String, required: true },
modelValue: { type: [String, Number], default: '' },
options: {
  type: Array,
  required: true,
  default: () => []
}
});

const selectedValue = ref(props.modelValue);
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const inputRef = ref(null);

// Set initial display value based on modelValue
onMounted(() => {
if (props.modelValue) {
  const selectedOption = props.options.find(option => option.value === props.modelValue);
  if (selectedOption) {
    searchQuery.value = selectedOption.label;
  }
}
});

// Watch for changes to modelValue from parent
watch(() => props.modelValue, (newValue) => {
selectedValue.value = newValue;
const selectedOption = props.options.find(option => option.value === newValue);
if (selectedOption) {
  searchQuery.value = selectedOption.label;
}
});

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
emit('update:modelValue', option.value);
};

const toggleDropdown = () => {
isDropdownOpen.value = !isDropdownOpen.value;
if (isDropdownOpen.value) {
  inputRef.value.focus();
}
};

const handleBlur = () => {
setTimeout(() => {
  // If user input doesn't match any option, reset to selected value
  const matchedOption = props.options.find(
    option => option.label.toLowerCase() === searchQuery.value.toLowerCase()
  );
  
  if (!matchedOption && selectedValue.value) {
    const selectedOption = props.options.find(option => option.value === selectedValue.value);
    if (selectedOption) {
      searchQuery.value = selectedOption.label;
    }
  } else if (!matchedOption) {
    searchQuery.value = '';
  }
  
  isDropdownOpen.value = false;
}, 150); // Increased timeout to ensure click events on options are processed
};
</script>