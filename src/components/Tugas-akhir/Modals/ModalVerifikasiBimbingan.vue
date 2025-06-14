<template>
  <div
    v-if="isVisible"
    @mousedown.self="handleBackdropClick"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-11/12 max-w-md p-6 bg-white card-rounded">
      <div class="flex items-center justify-between mb-4">
        <div class="flex justify-between w-full">
          <div class="flex items-center">
            <div class="p-2 mr-2 rounded-full bg-secondary/20">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 20H12V16L24 4L28 8L16 20Z"
                  stroke="#F78052"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 7L25 11"
                  stroke="#F78052"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M27 15V26C27 26.2652 26.8946 26.5196 26.7071 26.7071C26.5196 26.8946 26.2652 27 26 27H6C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H17"
                  stroke="#F78052"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h2 class="body2-bold">{{ title }}</h2>
          </div>
        </div>

        <button
          @click="closeModal"
          class="p-2 rounded-full hover:bg-placeholder/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6 align-top"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="mt-2 text-black/60 body4">
        <p><span class="body4-bold">Bimbingan ke : </span>{{ bimbinganKe }}</p>
        <p><span class="body4-bold">Tanggal : </span>{{ tanggalBimbingan }}</p>
        <p><span class="body4-bold">Progress :</span> BAB {{ bab }}</p>
        <p class="mt-2">
          <span class="body4-bold">Catatan : </span>
          <br />
          {{ catatan }}
        </p>
      </div>
      <div class="flex justify-between gap-4 mt-4">
        <Button class="flex-1" variant="danger" @click="reject"> Tolak </Button>
        <Button class="flex-1" variant="success" @click="accept">
          Terima
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";

// Definisikan props dengan benar dan simpan dalam variabel props
const props = defineProps({
  title: {
    type: String,
    default: "Verifikasi Bimbingan",
  },
  bimbinganKe: {
    type: Number,
    default: 0,
  },
  tanggalBimbingan: {
    type: String,
    default: "01 Januari 2000",
  },
  bab: {
    type: Number,
    default: 0,
  },
  catatan: {
    type: String,
    default: "Tidak ada catatan",
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
});

// State
const isVisible = ref(false);

// Events
const emit = defineEmits(["accept", "reject", "close"]);

// Methods
const closeModal = () => {
  isVisible.value = false;
  emit("close");
};

// Akses closeOnClickOutside melalui objek props
const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeModal();
  }
};

const accept = () => {
  emit("accept");
  closeModal();
};

const reject = () => {
  emit("reject");
  closeModal();
};

// Expose methods untuk diakses dari komponen induk
defineExpose({
  closeModal,
  open: () => {
    isVisible.value = true;
  },
});
</script>
