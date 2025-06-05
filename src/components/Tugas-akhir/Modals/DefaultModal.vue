<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  headText: {
    type: String,
    default: "",
  },
  bodyText: {
    type: String,
    default: "",
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
});

// Simpan posisi scroll awal
const scrollPosition = ref(0);
const originalStyle = ref(null);

// Methods
const closeModal = () => {
  unlockScroll(); // Pastikan scroll dilepas saat menutup modal
  emit("close");
};

// Akses closeOnClickOutside melalui objek props
const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeModal();
  }
};

// Fungsi untuk mencegah scroll dengan event listener
const preventScroll = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// Fungsi untuk mengatur scroll lock dengan pendekatan yang sangat agresif
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

// Mencegah scroll dengan keyboard (arrow keys, space, page up/down)
const preventScrollKeys = (e) => {
  // Kunci arrow up, arrow down, space, page up, page down
  const keys = [32, 33, 34, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
    return false;
  }
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

// Lock scroll saat mounting & unlock saat unmount
onMounted(() => {
  lockScroll();
});

onBeforeUnmount(() => {
  unlockScroll();
});
</script>

<template>
  <Transition name="modal-fade">
    <div
      @mousedown.self="handleBackdropClick"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-backdrop text-blackText"
      @wheel.prevent
      @touchmove.prevent
    >
      <div
        class="w-11/12 max-w-screen-md p-8 bg-white card-rounded modal-content"
        :class="{ 'modal-slide-active': true }"
      >
        <div class="flex items-center justify-between mb-2">
          <div>
            <h5 class="body1-bold lg:heading5">{{ headText }}</h5>
            <p class="body5 lg:body4">{{ bodyText }}</p>
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
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

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
