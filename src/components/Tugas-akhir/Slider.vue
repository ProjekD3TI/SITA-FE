<template>
  <div class="flex items-center sm:min-w-[170px]">
    <!-- Toggle Switch -->
    <div
      class="relative inline-flex items-center w-12 h-6 transition-colors duration-200 ease-in-out rounded-full"
      :class="{
        'bg-secondary': isOn && !disabled,
        'bg-gray-200': !isOn && !disabled,
        'bg-gray-300': disabled,
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-60': disabled,
      }"
      @click="!disabled && toggleSwitch()"
    >
      <span
        class="absolute justify-center w-4 h-4 m-1 transition-transform duration-200 ease-in-out transform bg-white rounded-full"
        :class="isOn ? 'translate-x-6' : 'translate-x-0'"
      />
      <span class="sr-only">Toggle Switch</span>
    </div>
    <span
      class="ml-2 sm:ml-4 body4-bold sm:body3-bold"
      :class="{ 'text-blackText': !disabled, 'text-gray-500': disabled }"
    >
      {{ isOn ? "Form Dibuka" : "Form Ditutup" }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

// isOn hanya computed dari modelValue, tidak pernah diubah lokal!
const isOn = computed(() => props.modelValue == 1);

const toggleSwitch = () => {
  // Only emit if not disabled
  if (!props.disabled) {
    emit("update:modelValue", isOn.value ? 0 : 1);
  }
};
</script>
