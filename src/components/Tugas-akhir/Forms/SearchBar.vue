<template>
  <div class="relative flex-grow">
    <div
      class="absolute top-2 sm:top-2.5 left-0 flex items-center pl-3 pointer-events-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 sm:w-6 sm:h-6 text-placeholder"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      class="w-full py-2 pl-10 pr-4 border border-placeholder input-rounded sm:py-3 body5 sm:body4"
    />
    <div
      v-if="showClearButton && modelValue"
      class="absolute cursor-pointer top-3 right-3"
      @click="clearSearch"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-placeholder hover:text-secondary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Cari...",
  },
  debounce: {
    type: Number,
    default: 250, // waktu debounce dalam milliseconds
  },
  showClearButton: {
    type: Boolean,
    default: true, // tampilkan tombol clear
  },
  filterKey: {
    type: String,
    default: "", // kunci untuk membedakan search filter (jika ada beberapa search dalam satu halaman)
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

// Untuk debounce search
let debounceTimeout = null;

const handleInput = (event) => {
  const value = event.target.value;

  // Update v-model langsung
  emit("update:modelValue", value);

  // Clear existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Set new timeout for search function
  debounceTimeout = setTimeout(() => {
    emit("search", {
      value: value,
      key: props.filterKey,
    });
  }, props.debounce);
};

// Reset value
const clearSearch = () => {
  emit("update:modelValue", "");
  emit("search", {
    value: "",
    key: props.filterKey,
  });
};

// Clean up debounce on component unmount
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    // Optional: tambahkan logika spesifik disini jika perlu
    // Misalnya: jika value dihapus dari luar komponen
    if (newValue === "" && oldValue !== "") {
      emit("search", {
        value: "",
        key: props.filterKey,
      });
    }
  }
);
</script>
