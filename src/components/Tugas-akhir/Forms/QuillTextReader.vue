<template>
  <!-- 1. Salin struktur wrapper dan label dari editor -->
  <div class="relative w-full">
    <label
      :for="id"
      class="absolute z-10 bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[250px] sm:max-w-none truncate text-blackText"
    >
      {{ label }} <span v-if="required" class="text-secondary">*</span>
    </label>

    <!-- 2. Buat bingkai dengan border, sama seperti editor -->
    <div class="reader-frame">
      <!-- Konten v-html sekarang berada di dalam bingkai -->
      <div class="ql-editor" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

// 3. Tambahkan props yang diperlukan untuk label
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  content: {
    type: String,
    required: true,
    default: "",
  },
});
</script>

<style>
/* Style tetap tidak 'scoped' agar bisa menata konten v-html */
@import "quill/dist/quill.snow.css";

/* 4. Tambahkan style untuk bingkai agar cocok dengan editor */
.reader-frame {
  border: 1px solid #9a9a9a;
  border-radius: 0.75rem;
  min-height: 150px; /* Samakan tinggi minimal dengan editor */
}

/* 5. Sesuaikan style .ql-editor agar memiliki padding di dalam bingkai */
.ql-editor {
  border: none !important;
  padding: 16px 24px !important; /* Beri padding internal */
  line-height: 1.6;
  font-family: "poppins", sans-serif; /* Samakan font dengan editor */
  font-size: 14px; /* Samakan ukuran font dengan editor */
}

.ql-toolbar {
  display: none !important;
}

/* Tambahkan media query agar responsif seperti editor */
@media (max-width: 640px) {
  .ql-editor {
    font-size: 12px;
    padding: 16px 16px !important;
  }
}
</style>
