<script setup>
defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    value: { type: String, required: true },
});
</script>
<template>
            <div class="relative w-full">
                <label for="textarea-input" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold">{{label}}</label>
                <textarea :id="id"  class="border border-placeholder input-rounded px-6 py-3  body4 w-full" :placeholder="placeholder" :value="value"></textarea>
            </div>
</template>