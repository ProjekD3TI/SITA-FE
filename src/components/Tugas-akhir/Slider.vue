<template>
  <div class="flex items-center sm:min-w-[170px]">
    <!-- Toggle Switch -->
    <div 
      class="relative inline-flex h-6 w-12 cursor-pointer rounded-full transition-colors ease-in-out duration-200 items-center"
      :class="isOn ? 'bg-secondary' : 'bg-gray-200'"
      @click="toggleSwitch"
    >
      <span 
        class="absolute justify-center h-4 w-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out m-1"
        :class="isOn ? 'translate-x-6' : 'translate-x-0'"
      />
      <span class="sr-only">Toggle Switch</span>
    </div>
    <span class="ml-4 body3-bold ">
      {{ isOn ? 'Form Dibuka' : 'Form Ditutup' }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// Props: value (0/1)
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 1,
  }
});
const emit = defineEmits(['update:modelValue']);

// Local state
const isOn = ref(props.modelValue == 1);

// Watch for external changes
watch(() => props.modelValue, (val) => {
  isOn.value = val == 1;
});

// Emit value when toggled
const toggleSwitch = () => {
  isOn.value = !isOn.value;
  emit('update:modelValue', isOn.value ? 1 : 0);
};
</script>