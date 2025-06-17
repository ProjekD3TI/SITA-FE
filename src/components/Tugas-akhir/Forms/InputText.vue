<template>
  <div class="relative">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[250px] sm:max-w-none truncate text-blackText"
      >{{ label }} <span v-if="required" class="text-secondary">*</span></label
    >
    <input
      :id="id"
      :type="type"
      class="w-full px-4 py-3 bg-white border border-placeholder input-rounded sm:px-6 body5 sm:body4 text-blackText"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeyDown"
      :disabled="disabled"
      :required="required"
      :min="type === 'number' ? 0 : undefined"
      :max="type === 'number' ? 100 : undefined"
      ref="inputElement"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const inputElement = ref(null);

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  modelValue: { type: [String, Number], required: true },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "text" },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

// Mencegah input karakter "-" dan "e" pada input number
function onKeyDown(e) {
  if (props.type === "number") {
    // Mencegah karakter "-", "e", "E", "+", dll yang tidak diinginkan pada input number
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  }
}

function validateNumberRange(value) {
  if (value === "" || value === null || value === undefined) return value;

  let numValue = Number(value);
  if (isNaN(numValue)) return "";

  // Pastikan nilai selalu positif
  numValue = Math.abs(numValue);

  if (numValue > 100) return "100";
  if (numValue < 0) return "0";

  return String(numValue);
}

function onInput(e) {
  let value = e.target.value;

  if (props.type === "number") {
    // Hapus karakter "-" jika ada
    if (value.includes("-")) {
      value = value.replace("-", "");
      e.target.value = value;
    }

    // Jika nilai > 100 atau < 0, batasi sesuai range dan update tampilan
    if (value !== "") {
      const numValue = Number(value);
      if (numValue > 100) {
        e.target.value = "100";
        value = "100";
      } else if (numValue < 0) {
        e.target.value = "0";
        value = "0";
      }
    }
  }

  emit("update:modelValue", value);
}

// Fungsi tambahan untuk memastikan nilai tetap valid saat focus keluar
function onBlur(e) {
  if (props.type === "number") {
    const validValue = validateNumberRange(e.target.value);
    e.target.value = validValue;
    emit("update:modelValue", validValue);
  }
}
</script>
