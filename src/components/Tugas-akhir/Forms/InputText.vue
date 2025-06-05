<template>
  <div class="relative">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[250px] sm:max-w-none truncate text-blackText"
      >{{ label }}</label
    >
    <input
      :id="id"
      :type="type"
      class="w-full px-4 py-3 bg-white border border-placeholder input-rounded sm:px-6 body5 sm:body4 text-blackText"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  modelValue: { type: [String, Number], required: true },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "text" },
});
</script>
