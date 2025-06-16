<template>
  <div class="relative w-full">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold"
      >{{ label }}</label
    >
    <input
      :id="id"
      type="number"
      class="w-full px-4 py-3 bg-white border no-spinner border-placeholder input-rounded sm:px-6 body5 sm:body4"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      :disabled="disabled"
      min="0"
      max="100"
    />
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  modelValue: { type: Number, required: true },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
  let value = Number(event.target.value);

  // Show toast error if value exceeds 100
  if (value > 100) {
    toast.error("Nilai tidak boleh lebih dari 100!");
  }

  // Limit to the range 0-100
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  emit("update:modelValue", value);
};
</script>

<style scoped>
/* Remove spinner buttons */
input[type="number"].no-spinner::-webkit-inner-spin-button,
input[type="number"].no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type="number"].no-spinner {
  -moz-appearance: textfield;
}
</style>
