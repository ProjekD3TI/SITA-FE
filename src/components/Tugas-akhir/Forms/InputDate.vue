<template>
  <div class="relative w-full">
    <label :for="id" class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold">{{ label
      }}</label>
    <input :id="id" type="date"
      :class="`border bg-white input-rounded px-4 sm:px-6 py-3 body5 sm:body4 w-full border-placeholder`" :value="value"
      @input="$emit('update:value', $event.target.value)" :disabled="disabled" />
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  disabled: { type: Boolean, default: false }
});

defineEmits(['update:value']);
</script>