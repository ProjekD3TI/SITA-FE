<template>
    <div class="relative w-full">
      <label :for="id" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold">{{ label }}</label>
      <input
        :id="id"
        type="text"
        class="border border-placeholder input-rounded px-6 py-3 body4 w-full"
        :placeholder="placeholder"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    value: { type: String, required: true },
  });
  </script>