<template>
  <div class="relative w-full">
    <label
      :for="id"
      :class="`absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold max-w-[210px] sm:max-w-none truncate text-blackText`"
    >
      {{ label }}
    </label>
    <div class="flex w-full">
      <div
        :id="id"
        :class="`border-y border-l border-placeholder rounded-l-[12px] px-4 sm:px-6 py-3 body5 sm:body4 flex-1 min-w-0 flex items-center overflow-hidden ${
          !hasFile ? 'text-placeholder' : 'text-blackText'
        }`"
      >
        <div
          class="flex items-center w-full min-w-0 gap-2 overflow-hidden"
          :class="hasFile ? 'cursor-pointer active:scale-95 duration-200' : ''"
          @click="hasFile ? viewFile() : null"
        >
          <svg
            v-show="hasFile"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="flex-shrink-0 w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <span class="overflow-hidden truncate sm:max-w-none">
            {{ hasFile ? currentFileName : "Tidak ada file terpilih" }}
          </span>
        </div>
      </div>
      <template v-if="disabled">
        <div
          class="bg-secondary text-white rounded-r-[12px] px-2 sm:px-4 body5 sm:body4 flex items-center justify-center whitespace-nowrap flex-shrink-0 cursor-not-allowed"
        >
          Choose File
        </div>
      </template>
      <template v-else>
        <label
          :for="id + '-upload'"
          class="bg-secondary rounded-r-[12px] px-2 sm:px-4 text-white body5 sm:body4 flex items-center justify-center whitespace-nowrap flex-shrink-0 cursor-pointer"
        >
          <span class="duration-200 active:scale-90">Choose File</span>
        </label>
      </template>
    </div>
    <input
      :id="id + '-upload'"
      type="file"
      class="hidden"
      @change="handleFileChange"
      :disabled="disabled"
      required
      accept=".pdf"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { secureFilePreview } from "@/services/TugasAkhir/Mhs/proposal.js";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [File, null], default: null },
  disabled: { type: Boolean, default: false },
  existingFileName: { type: String, default: "" },
  existingFileUrl: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const uploadedFile = ref(null);
const uploadedFileUrl = ref(null);

// Jika parent mengubah modelValue, sinkronkan uploadedFile
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      uploadedFile.value = null;
      if (uploadedFileUrl.value) {
        URL.revokeObjectURL(uploadedFileUrl.value);
        uploadedFileUrl.value = null;
      }
    }
  }
);

// Ada file jika ada file baru atau file existing dari backend
const hasFile = computed(() => {
  return !!uploadedFile.value || !!props.existingFileUrl;
});

// Nama file: file baru jika ada, jika tidak nama file existing dari backend
const currentFileName = computed(() => {
  return uploadedFile.value ? uploadedFile.value.name : props.existingFileName;
});

const handleFileChange = (event) => {
  if (props.disabled) return;
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
    if (uploadedFileUrl.value) {
      URL.revokeObjectURL(uploadedFileUrl.value);
    }
    uploadedFileUrl.value = URL.createObjectURL(file);
    emit("update:modelValue", file);
  } else {
    if (uploadedFileUrl.value) {
      URL.revokeObjectURL(uploadedFileUrl.value);
    }
    uploadedFile.value = null;
    uploadedFileUrl.value = null;
    emit("update:modelValue", null);
  }
};

// Buka file: file baru jika ada, jika tidak file existing dari backend
const viewFile = () => {
  if (uploadedFile.value && uploadedFileUrl.value) {
    window.open(uploadedFileUrl.value, "_blank");
  } else if (props.existingFileUrl) {
    // Buka file di tab baru TANPA download otomatis
    secureFilePreview(
      props.existingFileUrl,
      props.existingFileName || "file.pdf"
    );
  }
};
</script>
