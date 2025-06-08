<template>
  <div class="relative">
    <!-- Tombol untuk menampilkan modal -->
    <ButtonPrimary
      size="sm"
      class="w-full py-2 font-normal sm:hidden"
      ref="triggerRef"
      v-if="showTrigger"
      @click="toggleModal"
      :variant="triggerVariant"
      :leftIconPath="computedTriggerLeftIconPath"
      :rightIconPath="computedTriggerRightIconPath"
    >
      {{ triggerText }}
      <span
        v-if="preselectedValues.length > 0"
        class="ml-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs"
      >
        {{ preselectedValues.length }}
      </span>
    </ButtonPrimary>
    <ButtonPrimary
      size="md"
      class="hidden w-full font-normal sm:py-3 sm:flex"
      ref="triggerRef"
      v-if="showTrigger"
      @click="toggleModal"
      :variant="triggerVariant"
      :leftIconPath="computedTriggerLeftIconPath"
      :rightIconPath="computedTriggerRightIconPath"
    >
      {{ triggerText }}
      <span
        v-if="preselectedValues.length > 0"
        class="ml-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs"
      >
        {{ preselectedValues.length }}
      </span>
    </ButtonPrimary>

    <!-- Desktop modal (teleport) -->
    <teleport to="body" v-if="!isMobile">
      <div v-if="showModal">
        <!-- Overlay untuk menangkap klik di luar modal -->
        <div class="fixed inset-0 z-40" @click="closeModal"></div>
        <!-- Modal content -->
        <div
          ref="modalRef"
          class="fixed z-50 bg-white border shadow-lg p-6 card-rounded w-[95%] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] max-h-[80vh] overflow-y-auto"
          :style="modalPositionStyle"
          @click.stop
        >
          <!-- Header dengan judul dan tombol tutup -->
          <div class="flex items-center justify-between w-full mb-4">
            <span class="body3-bold">Pilih {{ title }}</span>
          </div>

          <!-- Konten filter -->
          <div class="flex flex-wrap gap-2 mt-4 max-h-[40vh] overflow-y-auto">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="flex-grow px-4 py-2 text-center duration-200 border rounded-full cursor-pointer body5 active:scale-90"
              :class="
                isSelected(item.value || item)
                  ? 'border-secondary bg-secondary text-white hover:opacity-90'
                  : 'border-placeholder hover:bg-secondary hover:text-white hover:border-secondary'
              "
              @click="toggleSelection(item.value || item)"
            >
              <span>{{ item.label || item }}</span>
            </div>
          </div>

          <!-- Footer dengan hint dan tombol terapkan -->
          <div
            class="absolute bottom-[72px] left-0 w-full border-t border-placeholder opacity-20"
          ></div>
          <div class="flex items-center justify-between mt-6">
            <span class="body5 text-placeholder">{{ hint }}</span>
            <div class="flex gap-2">
              <ButtonPrimary variant="primary" size="md" @click="applyAndClose">
                {{ buttonText }}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Mobile modal (no teleport, absolute under trigger) -->
    <div v-if="isMobile && showModal" class="absolute left-0 right-0 z-50">
      <div
        ref="modalRef"
        class="bg-white border shadow-lg p-6 card-rounded w-[85vw] sm:w-[50vw] md:w-[50vw] lg:w-[45vw] xl:w-[35vw] max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header dengan judul dan tombol tutup -->
        <div class="flex items-center justify-between w-full mb-4">
          <span class="body3-bold">Pilih {{ title }}</span>
        </div>

        <!-- Konten filter -->
        <div class="flex flex-wrap gap-2 mt-4 max-h-[40vh] overflow-y-auto">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex-grow px-4 py-2 text-center duration-200 border rounded-full cursor-pointer body5 active:scale-90"
            :class="
              isSelected(item.value || item)
                ? 'border-secondary bg-secondary text-white hover:opacity-90'
                : 'border-placeholder hover:bg-secondary hover:text-white hover:border-secondary'
            "
            @click="toggleSelection(item.value || item)"
          >
            <span>{{ item.label || item }}</span>
          </div>
        </div>

        <!-- Footer dengan hint dan tombol terapkan -->
        <div
          class="absolute bottom-[72px] left-0 w-full border-t border-placeholder opacity-20"
        ></div>
        <div class="flex items-center justify-between mt-6">
          <span class="body5 text-placeholder">{{ hint }}</span>
          <div class="flex gap-2">
            <ButtonPrimary variant="primary" size="md" @click="applyAndClose">
              {{ buttonText }}
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div class="fixed inset-0 z-40" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
} from "vue";
import ButtonPrimary from "@/components/Tugas-akhir/Button.vue";

const props = defineProps({
  title: {
    type: String,
    default: "Filter",
  },
  items: {
    type: Array,
    default: () => [],
  },
  hint: {
    type: String,
    default: "*Anda dapat memilih banyak",
  },
  buttonText: {
    type: String,
    default: "Terapkan",
  },
  multiSelect: {
    type: Boolean,
    default: true,
  },
  preselectedValues: {
    type: Array,
    default: () => [],
  },
  filterType: {
    type: String,
    default: "general",
  },
  showTrigger: {
    type: Boolean,
    default: true,
  },
  triggerText: {
    type: String,
    default: "Filter",
  },
  triggerVariant: {
    type: String,
    default: "outlined-black",
  },
  // Mengganti properties trigger icon lama
  triggerLeftIconPath: {
    type: String,
    default:
      "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  },
  triggerRightIconPath: {
    type: String,
    default: "m19.5 8.25-7.5 7.5-7.5-7.5",
  },
  // Untuk backward compatibility
  triggerIconPath: {
    type: String,
    default: null,
  },
  triggerIconPosition: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value),
  },
  closeModalOnBackdrop: {
    type: Boolean,
    default: true,
  },
  modalPosition: {
    type: String,
    default: "bottom", // 'bottom', 'top', 'left', 'right'
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["apply", "update:modelValue"]);

// Refs
const triggerRef = ref(null);
const modalRef = ref(null);

// IMPORTANT: Define all reactive variables first
const modalPositionStyle = ref({});
const internalSelectedValues = ref([]);
const showModal = ref(props.modelValue);

// Computed properties untuk trigger icon (untuk backward compatibility)
const computedTriggerLeftIconPath = computed(() => {
  if (props.triggerLeftIconPath) return props.triggerLeftIconPath;
  if (props.triggerIconPath && props.triggerIconPosition === "left")
    return props.triggerIconPath;
  return null;
});

const computedTriggerRightIconPath = computed(() => {
  if (props.triggerRightIconPath) return props.triggerRightIconPath;
  if (props.triggerIconPath && props.triggerIconPosition === "right")
    return props.triggerIconPath;
  return null;
});

// Function to sync internal values with preselected ones
const syncInternalValues = () => {
  if (props.preselectedValues && props.preselectedValues.length > 0) {
    internalSelectedValues.value = [...props.preselectedValues];
  } else {
    internalSelectedValues.value = [];
  }
};

// Memeriksa apakah item terpilih
const isSelected = (value) => {
  return internalSelectedValues.value.includes(value);
};

// Toggle selection
const toggleSelection = (value) => {
  if (isSelected(value)) {
    // Hapus dari pilihan jika sudah terpilih
    internalSelectedValues.value = internalSelectedValues.value.filter(
      (item) => item !== value
    );
  } else {
    // Tambahkan ke pilihan jika belum terpilih
    if (props.multiSelect) {
      // Multi-select: tambahkan ke array pilihan
      internalSelectedValues.value.push(value);
    } else {
      // Single-select: ganti array dengan item tunggal
      internalSelectedValues.value = [value];
    }
  }
};

// Handler untuk keyboard event (Escape)
const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

// Tambahkan fungsi scroll lock
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
// const lockScroll = () => {
//   // Simpan posisi scroll saat ini
//   scrollPosition.value =
//     window.pageYOffset || document.documentElement.scrollTop;

//   // Simpan style asli
//   originalStyle.value = {
//     overflow: document.body.style.overflow,
//     position: document.body.style.position,
//     top: document.body.style.top,
//     width: document.body.style.width,
//     paddingRight: document.body.style.paddingRight,
//     height: document.body.style.height,
//   };

//   // Hitung lebar scrollbar untuk mencegah layout shift
//   const scrollbarWidth =
//     window.innerWidth - document.documentElement.clientWidth;

//   // Terapkan style ke body secara agresif
//   document.body.style.overflow = "hidden";
//   document.body.style.position = "fixed";
//   document.body.style.top = `-${scrollPosition.value}px`;
//   document.body.style.width = "100%";
//   document.body.style.paddingRight = `${scrollbarWidth}px`;
//   document.body.style.height = "100vh";

//   // Tambahkan event listener untuk wheel, touchmove, dan keydown
//   window.addEventListener("wheel", preventScroll, { passive: false });
//   window.addEventListener("touchmove", preventScroll, { passive: false });
//   window.addEventListener("keydown", preventScrollKeys, { passive: false });
// };

// const unlockScroll = () => {
//   // Kembalikan style body ke aslinya
//   if (originalStyle.value) {
//     for (const [key, value] of Object.entries(originalStyle.value)) {
//       if (value) {
//         document.body.style[key] = value;
//       } else {
//         document.body.style.removeProperty(key);
//       }
//     }
//   } else {
//     // Fallback jika tidak ada originalStyle
//     document.body.style.removeProperty("overflow");
//     document.body.style.removeProperty("position");
//     document.body.style.removeProperty("top");
//     document.body.style.removeProperty("width");
//     document.body.style.removeProperty("padding-right");
//     document.body.style.removeProperty("height");
//   }

//   // Hapus event listener
//   window.removeEventListener("wheel", preventScroll);
//   window.removeEventListener("touchmove", preventScroll);
//   window.removeEventListener("keydown", preventScrollKeys);

//   // Kembalikan posisi scroll
//   window.scrollTo(0, scrollPosition.value);
// };

// Toggle modal state
const toggleModal = () => {
  showModal.value = !showModal.value;
  // if (showModal.value) {
  //   lockScroll();
  // } else {
  //   unlockScroll();
  // }
};

// Metode untuk menutup modal
const closeModal = () => {
  if (props.closeModalOnBackdrop) {
    syncInternalValues(); // Reset to preselected values
    showModal.value = false;
    // unlockScroll();
  }
};

// Terapkan pilihan dan tutup modal
const applyAndClose = () => {
  emit("apply", {
    type: props.filterType,
    values: [...internalSelectedValues.value], // Gunakan shallow copy
  });
  showModal.value = false;
  // unlockScroll();
};

const isMobile = computed(() => window.innerWidth < 640);

const updateModalPosition = () => {
  const triggerEl = triggerRef.value?.$el || triggerRef.value;
  const modalEl = modalRef.value;
  if (!triggerEl || !modalEl || !triggerEl.getBoundingClientRect) return;

  const triggerRect = triggerEl.getBoundingClientRect();
  const modalRect = modalEl.getBoundingClientRect();

  let top, left;

  // Pada mobile, modal fixed di bawah trigger, lebar penuh
  if (isMobile.value) {
    top = triggerRect.bottom + 8;
    left = window.innerWidth / 2 - modalRect.width / 2;
    // Pastikan tidak keluar layar
    if (top + modalRect.height > window.innerHeight - 16) {
      top = window.innerHeight - modalRect.height - 16;
    }
    if (top < 56) top = 56;
    modalPositionStyle.value = {
      top: `${top}px`,
      left: `50%`,
      transform: "translateX(-50%)",
    };
    return;
  }

  // Desktop: posisi seperti biasa
  switch (props.modalPosition) {
    case "top":
      top = triggerRect.top - modalRect.height - 8;
      left = triggerRect.left;
      break;
    case "right":
      top = triggerRect.top;
      left = triggerRect.right + 8;
      break;
    case "left":
      top = triggerRect.top;
      left = triggerRect.left - modalRect.width - 8;
      break;
    case "bottom":
    default:
      top = triggerRect.bottom + 8;
      left = triggerRect.left;
      break;
  }

  // Adjust agar tidak keluar layar
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  if (left + modalRect.width > viewportWidth - 16)
    left = viewportWidth - modalRect.width - 16;
  if (left < 16) left = 16;
  if (top + modalRect.height > viewportHeight - 16) {
    if (
      props.modalPosition === "bottom" &&
      triggerRect.top > modalRect.height
    ) {
      top = triggerRect.top - modalRect.height - 8;
    } else {
      top = viewportHeight - modalRect.height - 16;
    }
  }
  if (top < 56) top = 56;

  modalPositionStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    transform: "",
  };
};

// Watch untuk preselectedValues
watch(
  () => props.preselectedValues,
  () => {
    // Hanya sync jika modal tidak sedang terbuka (mencegah reset selama pengguna memilih)
    if (!showModal.value) {
      syncInternalValues();
    }
  },
  { deep: true }
);

// Watch untuk modelValue
watch(
  () => props.modelValue,
  (value) => {
    showModal.value = value;
    if (value) {
      // Ketika modal dibuka, pindahkan preselectedValues ke state internal
      syncInternalValues();
      nextTick(() => {
        updateModalPosition();
        // lockScroll();
      });
    } else {
      // unlockScroll();
    }
  }
);

// Watch untuk showModal
watch(showModal, (value) => {
  emit("update:modelValue", value);
  if (value) {
    nextTick(() => {
      updateModalPosition();
      // lockScroll();
      // Tambahkan event listener untuk resize
      window.addEventListener("resize", updateModalPosition);
      // Tambahkan event listener untuk scroll
      window.addEventListener("scroll", updateModalPosition, true);
      // Tambahkan event listener untuk Escape key
      document.addEventListener("keydown", handleKeyDown);
    });
  } else {
    // Reset selection saat modal ditutup tanpa mengklik Apply
    syncInternalValues();
    // unlockScroll();

    // Hapus event listener saat modal ditutup
    window.removeEventListener("resize", updateModalPosition);
    window.removeEventListener("scroll", updateModalPosition, true);
    document.removeEventListener("keydown", handleKeyDown);
  }
});

// Cleanup event listeners when component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateModalPosition);
  window.removeEventListener("scroll", updateModalPosition, true);
  document.removeEventListener("keydown", handleKeyDown);
  // if (showModal.value) {
  //   unlockScroll();
  // }
});
</script>

<style scoped>
/* ...existing styles... */

/* Tambahkan animasi modal */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: slideIn 0.25s forwards;
}
</style>
