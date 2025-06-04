<template>
  <Transition name="modal-fade">
    <div
      v-if="isVisible"
      @mousedown.self="handleBackdropClick"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-backdrop"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="w-11/12 max-w-md p-6 bg-white card-rounded modal-content">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 mr-2 rounded-full bg-warning/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6 text-warning"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
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
        <h2 class="body2-bold">{{ headText }}</h2>
        <div class="mt-2 text-black/60 body4-bold">
          <slot />
        </div>
        <div class="flex justify-between gap-2 mt-4">
          <Button
            class="w-full sm:hidden"
            variant="danger"
            size="md"
            @click="reject"
            >Tolak</Button
          >
          <Button
            class="w-full sm:hidden"
            variant="success"
            size="md"
            @click="accept"
            >Terima</Button
          >
          <Button
            class="hidden w-full sm:block"
            variant="danger"
            size="lg"
            @click="reject"
            >Tolak</Button
          >
          <Button
            class="hidden w-full sm:block"
            variant="success"
            size="lg"
            @click="accept"
            >Terima</Button
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";

// Definisikan props dengan benar dan simpan dalam variabel props
const props = defineProps({
  headText: {
    type: String,
    default: "Verifikasi blablabla.",
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

// Simpan posisi scroll awal
const scrollPosition = ref(0);
const originalStyle = ref(null);

// Fungsi untuk mencegah scroll dengan event listener
const preventScroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// Mencegah scroll dengan keyboard (arrow keys, space, page up/down)
const preventScrollKeys = (e) => {
  // Kunci arrow up, arrow down, space, page up, page down
  const keys = [32, 33, 34, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
    return false;
  }
};

// Fungsi untuk mengatur scroll lock
const lockScroll = () => {
  // Simpan posisi scroll saat ini
  scrollPosition.value =
    window.pageYOffset || document.documentElement.scrollTop;

  // Simpan style asli
  originalStyle.value = {
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    top: document.body.style.top,
    width: document.body.style.width,
    paddingRight: document.body.style.paddingRight,
    height: document.body.style.height,
  };

  // Hitung lebar scrollbar untuk mencegah layout shift
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  // Terapkan style ke body secara agresif
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition.value}px`;
  document.body.style.width = "100%";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.height = "100vh";

  // Tambahkan event listener untuk wheel, touchmove, dan keydown
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventScrollKeys, { passive: false });
};

const unlockScroll = () => {
  // Kembalikan style body ke aslinya
  if (originalStyle.value) {
    for (const [key, value] of Object.entries(originalStyle.value)) {
      if (value) {
        document.body.style[key] = value;
      } else {
        document.body.style.removeProperty(key);
      }
    }
  } else {
    // Fallback jika tidak ada originalStyle
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("height");
  }

  // Hapus event listener
  window.removeEventListener("wheel", preventScroll);
  window.removeEventListener("touchmove", preventScroll);
  window.removeEventListener("keydown", preventScrollKeys);

  // Kembalikan posisi scroll
  window.scrollTo(0, scrollPosition.value);
};

// Methods
const closeModal = () => {
  unlockScroll();
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
    lockScroll();
  },
});

// Pastikan scroll terbuka kembali saat komponen dihapus
onBeforeUnmount(() => {
  if (isVisible.value) {
    unlockScroll();
  }
});
</script>

<style scoped>
.modal-backdrop {
  touch-action: none; /* Mencegah touch scroll pada iOS */
  overscroll-behavior: contain;
}

.modal-content {
  max-height: 90vh;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(30px);
  animation: slideIn 0.3s forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animasi untuk backdrop (fade) */
.modal-fade-enter-active {
  transition: opacity 0.3s ease;
}

.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
