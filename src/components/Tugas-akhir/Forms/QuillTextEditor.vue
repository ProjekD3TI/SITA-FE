<template>
  <!-- 1. Tambahkan class binding untuk state disabled -->
  <div class="relative w-full" :class="{ 'is-disabled': disabled }">
    <!-- Label ini yang menjadi sumber masalah, tapi kita akan akali -->
    <label
      :for="id"
      class="absolute z-10 bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[250px] sm:max-w-none truncate text-blackText"
    >
      {{ label }} <span v-if="required" class="text-secondary">*</span>
    </label>

    <!-- Editor Quill dibungkus dalam container yang memiliki border -->
    <div class="quill-wrapper">
      <div ref="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  modelValue: { type: String, default: "" },
  disabled: { type: Boolean, default: false }, // 2. Tambahkan prop 'disabled'
});

const emit = defineEmits(["update:modelValue"]);

const editor = ref(null);
let quillInstance = null;

onMounted(() => {
  if (editor.value) {
    quillInstance = new Quill(editor.value, {
      theme: "snow",
      placeholder: "Masukkan catatan di sini...",
      modules: {
        toolbar: [
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline"],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
    });

    // 3. Atur state awal disabled saat komponen dimuat
    quillInstance.enable(!props.disabled);

    if (props.modelValue) {
      quillInstance.root.innerHTML = props.modelValue;
    }

    quillInstance.on("text-change", () => {
      if (quillInstance.root.innerHTML !== props.modelValue) {
        emit("update:modelValue", quillInstance.root.innerHTML);
      }
    });
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (quillInstance && newValue !== quillInstance.root.innerHTML) {
      quillInstance.root.innerHTML = newValue;
    }
  }
);

// 4. Tambahkan watcher untuk prop 'disabled'
watch(
  () => props.disabled,
  (isDisabled) => {
    if (quillInstance) {
      quillInstance.enable(!isDisabled);
    }
  }
);
</script>

<style scoped>
/* Wrapper ini yang akan memiliki border */
.quill-wrapper {
  border: 1px solid #9a9a9a;
  border-radius: 0.75rem;
  overflow: hidden; /* Penting agar sudutnya rapi */
  transition: background-color 0.2s; /* Tambahkan transisi untuk disabled state */
}

/* 
  --- INI BAGIAN PALING PENTING ---
  Kita beri padding-top pada toolbar itu sendiri.
  Ini akan mendorong tombol-tombolnya ke bawah, memberi ruang untuk label
  tanpa menyembunyikan seluruh toolbar.
*/

:deep(.ql-editor) {
  font-family: "poppins", sans-serif; /* Ganti dengan font yang Anda inginkan */
}

:deep(.ql-toolbar.ql-snow) {
  display: block !important; /* Paksa untuk ditampilkan sebagai blok */
  visibility: visible !important; /* Paksa untuk terlihat */
  opacity: 1 !important; /* Paksa untuk tidak transparan */
  height: auto !important; /* Biarkan tingginya menyesuaikan konten */
  min-height: 42px !important;
  padding: 12px 16px !important; /* Paksa beri padding di atas */
  border: none; /* Hapus border asli toolbar */
  border-bottom: 1px solid #9a9a9a; /* Beri garis pemisah */
}

/* Hapus border asli dari container area tulis */
:deep(.ql-container.ql-snow) {
  border: none;
  min-height: 150px;
  font-size: 14px;
  /* padding: 16px 24px; */
}
/* --- TAMBAHKAN BLOK INI --- */
/* Menargetkan placeholder secara spesifik */
:deep(.ql-editor.ql-blank::before) {
  /* Posisikan placeholder secara absolut relatif terhadap editor */
  position: absolute;

  /* Anda juga bisa mengubah gaya lain di sini */
  color: #9a9a9a; /* Warna placeholder lebih pudar */
  font-style: italic;

  /* Pastikan tidak melewati batas */
  right: 1rem;
  pointer-events: none; /* Agar bisa diklik tembus */
}

@media (max-width: 640px) {
  :deep(.ql-toolbar.ql-snow) {
    padding: 12px 8px !important; /* Paksa beri padding di atas */
  }

  :deep(.ql-container.ql-snow) {
    font-size: 12px;
    /* padding: 16px 16px; */
  }
}

/* 5. Tambahkan style untuk state disabled */
.is-disabled .quill-wrapper {
  background-color: #f3f4f6; /* Tailwind's gray-100 */
  cursor: not-allowed;
}

.is-disabled :deep(.ql-toolbar.ql-snow) {
  background-color: #f3f4f6;
}

.is-disabled :deep(.ql-editor) {
  background-color: #f3f4f6;
}

.is-disabled label {
  color: #6b7280; /* Tailwind's gray-500 */
}
</style>
