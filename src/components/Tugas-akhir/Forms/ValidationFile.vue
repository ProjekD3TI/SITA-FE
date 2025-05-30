<template>
  <div class="relative w-full">
    <label :for="id" class="absolute bg-white left-5 -top-2.5 px-1 body4-bold lg:body4-bold">{{ label }}</label>
    <div class="flex">
      <div :id="id"
        class="flex items-center justify-between w-full px-6 py-3 text-black border border-placeholder input-rounded body4">
        <button type="button" @click="openFile"
          class="flex items-center gap-2 duration-200 cursor-pointer active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-4 h-4 lg:w-5 lg:h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span>{{ fileName || 'File gagal ditampilkan' }}</span>
        </button>
        <div class="flex items-center gap-2">
          <template v-if="isDisabled">
            <!-- Jika statusValid 1 (valid), tampilkan radio centang saja dan sudah terpilih -->
            <template v-if="statusValid === 1">
              <label class="flex items-center gap-2 ">
                <input type="radio" :name="`validation-${id}`" value="1" class="hidden peer" v-model="localValue"
                  checked disabled />
                <div
                  class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-success peer-checked:bg-success peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-success/25 ring-offset-0 active:scale-90 duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
            </template>
            <!-- Jika statusValid 2 (tidak valid), tampilkan radio silang saja dan sudah terpilih -->
            <template v-else-if="statusValid === 2">
              <label class="flex items-center gap-2 ">
                <input type="radio" :name="`validation-${id}`" value="2" class="hidden peer" v-model="localValue"
                  checked disabled />
                <div
                  class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-danger peer-checked:bg-danger peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-danger/25 ring-offset-0 active:scale-90 duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </label>
            </template>
          </template>
          <!-- Jika statusValid 0 (menunggu), tampilkan dua radio -->
          <template v-else>
            <!-- Radio Button Silang -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" :name="`validation-${id}`" value="2" class="hidden peer" v-model="localValue" />
              <div
                class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-danger peer-checked:bg-danger peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-danger/25 ring-offset-0 active:scale-90 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </label>
            <!-- Radio Button Centang -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" :name="`validation-${id}`" value="1" class="hidden peer" v-model="localValue" />
              <div
                class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-placeholder rounded-full flex items-center justify-center peer-checked:border-success peer-checked:bg-success peer-checked:ring-[4px] sm:peer-checked:ring-[6px] ring-success/25 ring-offset-0 active:scale-90 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { secureFilePreview } from '@/services/TugasAkhir/Mhs/proposal.js';
const emit = defineEmits();
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  fileFromDatabase: {
    type: Object,
    default: () => ({ name: '', url: '' })
  },
  statusValid: {
    type: Number,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});
const localValue = ref(props.statusValid);
defineExpose({ localValue });
// Fungsi untuk emit ke parent saat submit
function submitValidation() {
  emit('update:statusValid', Number(localValue.value));
}

const fileName = ref('');
const fileUrl = ref(null);

watch(
  () => props.statusValid,
  (val) => {
    localValue.value = val;
  }
);

watch(
  () => props.fileFromDatabase,
  (newFile) => {
    const file = newFile && typeof newFile === 'object' && 'value' in newFile ? newFile.value : newFile;
    if (file) {
      fileName.value = file.name;
      fileUrl.value = file.url && !file.url.startsWith('/storage/') && !file.url.startsWith('http')
        ? `/storage/${file.url}`
        : file.url;
    } else {
      fileName.value = '';
      fileUrl.value = null;
    }
  },
  { immediate: true }
);

// Fungsi untuk membuka file PDF dari backend
function openFile() {
  if (fileUrl.value) {
    secureFilePreview(fileUrl.value, fileName.value || 'file.pdf');
  }
}
</script>