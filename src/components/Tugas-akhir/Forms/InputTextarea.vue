<script setup>
// Definisikan props dengan modelValue sebagai pengganti value untuk v-model
const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    modelValue: { type: String, default: '' }, // Ganti value dengan modelValue untuk v-model
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
});

// Definisikan emits untuk update:modelValue yang diperlukan oleh v-model
const emit = defineEmits(['update:modelValue']);

// Function untuk update nilai saat textarea berubah
const updateValue = (event) => {
    emit('update:modelValue', event.target.value);
};
</script>

<template>
    <div class="relative w-full">
        <label :for="id"
            class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[250px] sm:max-w-none truncate">
            {{ label }}
        </label>
        <textarea :id="id"
            class="w-full px-4 py-3 bg-white border border-placeholder input-rounded sm:px-6 body5 sm:body4"
            :placeholder="placeholder" :value="modelValue" :disabled="disabled" :required="required"
            @input="updateValue"></textarea>
    </div>
</template>