<template>
  <Transition name="modal-fade">
    <div
      v-if="isVisible"
      @mousedown.self="handleBackdropClick"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-backdrop"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="w-11/12 max-w-xl p-6 bg-white card-rounded modal-content">
        <div class="flex items-center justify-between mb-4">
          <div class="flex justify-between w-full">
            <div class="flex items-center">
              <div class="p-2 mr-2 rounded-full bg-success/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-6 h-6 text-success"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <h2 class="body2-bold">{{ title }}</h2>
            </div>
            <StatusLabel
              class="self-center hidden sm:flex h-fit"
              :status="status"
              :label="statusLabel"
              size="md"
            />
            <StatusLabel
              class="self-center sm:hidden h-fit"
              :status="status"
              :label="statusLabel"
              size="sm"
            />
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
        <div class="mt-2 text-black/60 body4-bold">
          <p>Bimbingan ke : {{ bimbinganKe }}</p>
          <p>Tanggal : {{ tanggalBimbingan }}</p>
          <p>Progress : BAB {{ bab }}</p>
          <p class="mt-2">
            Catatan : <br />
            {{ catatan }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";

// Definisikan props dengan benar dan simpan dalam variabel props
const props = defineProps({
  title: {
    type: String,
    default: "Bimbingan",
  },
  bimbinganKe: {
    type: [Number, String],
    default: 0,
  },
  tanggalBimbingan: {
    type: String,
    default: "01 Januari 2000",
  },
  bab: {
    type: [Number, String],
    default: 0,
  },
  catatan: {
    type: String,
    default: "Tidak ada catatan",
  },
  status: {
    type: String,
    default: "success", // 'success', 'warning', 'danger'
  },
  statusLabel: {
    type: String,
    default: "Diterima",
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
  isVisible.value = false;
  unlockScroll();
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

// Pastikan scroll terbuka kembali saat komponen dihapus
onBeforeUnmount(() => {
  if (isVisible.value) {
    unlockScroll();
  }
});

// Expose methods untuk diakses dari komponen induk
defineExpose({
  closeModal,
  open: () => {
    isVisible.value = true;
    lockScroll();
  },
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
