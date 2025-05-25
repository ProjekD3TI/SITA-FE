<template>
  <div class="relative w-full">
    <label :for="id" class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold">{{ label
      }}</label>
    <input :id="id" type="number"
      class="w-full px-4 py-3 bg-white border no-spinner border-placeholder input-rounded sm:px-6 body5 sm:body4"
      :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))"
      :disabled="disabled" />
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  modelValue: { type: Number, required: true },
  disabled: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
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
