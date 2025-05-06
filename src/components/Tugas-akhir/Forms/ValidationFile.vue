<template>
    <div class="relative w-full">
      <label :for="id" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold lg:body4-bold">{{ label }}</label>
      <div class="flex">
        <div
          :id="id"
          class="border border-placeholder input-rounded px-6 py-3 body4 w-full flex items-center text-black justify-between"
        >
          <div
            class="flex items-center gap-2 cursor-pointer active:scale-95 duration-200"
            @click="downloadFile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4 lg:w-5 lg:h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span>{{ fileName || 'File gagal ditampilkan' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Radio Button 1 -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="validation"
                value="2"
                class="hidden peer"
                v-model="validationValue"
              />
              <div
                class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-danger peer-checked:bg-danger peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-danger/25 ring-offset-0 active:scale-90 duration-200"
              >
                <!-- Ikon untuk radio button -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-white peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </label>
  
            <!-- Radio Button 2 -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="validation"
                value="1"
                class="hidden peer"
                v-model="validationValue"
              />
              <div
                class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-success peer-checked:bg-success peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-success/25 ring-offset-0 active:scale-90 duration-200"
              >
                <!-- Ikon untuk radio button -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-white peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  fileFromDatabase: { 
    type: Object, 
    default: () => ({ name: '', url: '' })
  },
});

// Reactive variables
const fileName = ref('');
const fileUrl = ref(null);
const validationValue = ref(null);

// Watch for changes in fileFromDatabase - FIXED
watch(
  () => props.fileFromDatabase,
  (newFile) => {
    if (newFile) {
      fileName.value = newFile.name;
      fileUrl.value = newFile.url;
    }
  },
  { immediate: true }
);

// Methods
const downloadFile = () => {
  if (fileUrl.value) {
    const link = document.createElement('a');
    link.href = fileUrl.value;
    link.download = fileName.value || 'downloaded-file'; // Tambahkan nama default jika tidak ada
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>