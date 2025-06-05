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
        <div class="flex items-center justify-between">
          <p class="body2-bold text-blackText">{{ headText }}</p>
          <button
            @click="close"
            class="p-2 rounded-full hover:bg-placeholder/20 text-blackText"
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
        <p class="mt-2 body4-bold text-black/60">{{ bodyText }}</p>
        <div class="flex gap-2 mt-4">
          <Button
            v-if="showCancel"
            variant="danger"
            @click="close"
            class="flex-1"
          >
            {{ cancelText }}
          </Button>
          <Button
            v-if="showSubmit"
            variant="primary"
            :disabled="countdown > 0"
            @click="submit"
            class="relative flex-1"
          >
            {{ submitText }} <span v-if="countdown > 0">({{ countdown }})</span>
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";

const props = defineProps({
  headText: {
    type: String,
    default: "Pastikan blablabla!",
  },
  bodyText: {
    type: String,
    default: "Anda tidak dapat blablabla.",
  },
  submitText: {
    type: String,
    default: "Submit",
  },
  cancelText: {
    type: String,
    default: "Batal",
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showSubmit: {
    type: Boolean,
    default: true,
  },
  enableTimer: {
    type: Boolean,
    default: true,
  },
  timerDuration: {
    type: Number,
    default: 5,
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
});

// Event emitter
const emit = defineEmits(["submit", "close"]);

// State
const countdown = ref(0);
const isVisible = ref(false);
let timerInterval = null;

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
const startTimer = () => {
  if (props.enableTimer) {
    countdown.value = props.timerDuration;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value -= 1;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
};

// PERBAIKAN: Ubah implementasi close untuk mencegah rekursi
const close = () => {
  clearInterval(timerInterval);
  unlockScroll();
  isVisible.value = false;

  // Hanya emit event jika modal masih visible
  if (isVisible.value) {
    emit("close");
  }
};

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    close();
  }
};

const submit = () => {
  if (countdown.value === 0) {
    emit("submit");
    close();
  }
};

// Clean up timer when component is unmounted
onUnmounted(() => {
  clearInterval(timerInterval);
});

onBeforeUnmount(() => {
  if (isVisible.value) {
    unlockScroll();
  }
});

// Expose methods untuk diakses dari komponen induk
defineExpose({
  open: () => {
    isVisible.value = true;
    lockScroll();
    startTimer();
  },
  close,
});
</script>

<style scoped>
/* Optional: Add animation for countdown */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.absolute {
  animation: pulse 1s infinite;
}

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
