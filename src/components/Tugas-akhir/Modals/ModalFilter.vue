<template>
  <div class="relative">
    <!-- Tombol untuk mobile -->
    <ButtonPrimary
      size="sm"
      class="w-full py-2 font-normal sm:hidden"
      ref="triggerMobileRef"
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

    <!-- Tombol untuk desktop -->
    <ButtonPrimary
      size="md"
      class="hidden w-full font-normal sm:py-2.5 sm:flex"
      ref="triggerDesktopRef"
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

    <!-- Modal tunggal (teleport ke body) -->
    <teleport to="body">
      <div v-if="showModal">
        <!-- Overlay -->
        <div class="fixed inset-0 z-40" @click="closeModal"></div>

        <!-- Modal content -->
        <div
          ref="modalRef"
          class="fixed z-50 bg-white border shadow-lg p-6 card-rounded max-h-[80vh] overflow-y-auto"
          :class="
            isMobile
              ? 'w-[90vw] max-w-[600px]'
              : 'w-[95%] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]'
          "
          :style="modalPositionStyle"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between w-full mb-4">
            <span class="body3-bold">{{ title }}</span>
          </div>

          <!-- Konten filter -->
          <div class="flex flex-wrap gap-2 mt-4 max-h-[40vh] overflow-y-auto">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="flex-grow flex-shrink sm:basis-[120px] sm:min-w-[120px] px-2 py-2 text-center duration-200 border rounded-full cursor-pointer body5 active:scale-90"
              :class="
                isSelected(item.value || item)
                  ? 'border-secondary bg-secondary text-white hover:opacity-90'
                  : 'border-placeholder hover:bg-secondary hover:text-white hover:border-secondary'
              "
              @click="toggleSelection(item.value || item)"
            >
              <span class="block w-full">{{ item.label || item }}</span>
            </div>
          </div>

          <div v-if="title2 && items2 && items2.length > 0">
            <div class="flex items-center justify-between w-full mt-4 mb-4">
              <span class="body3-bold">{{ title2 }}</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-4 max-h-[40vh] overflow-y-auto">
              <div
                v-for="(item, index) in items2"
                :key="index"
                class="flex-grow flex-shrink sm:basis-[120px] sm:min-w-[120px] px-2 py-2 text-center duration-200 border rounded-full cursor-pointer body5 active:scale-90"
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
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between mt-6">
            <span class="body5 text-placeholder">{{ hint }}</span>
            <div class="flex justify-end gap-2">
              <!-- Tombol Clear Filter -->
              <ButtonPrimary
                v-if="internalSelectedValues.length > 0"
                variant="outlined-danger"
                size="sm"
                @click="clearAllFilters"
              >
                Clear
              </ButtonPrimary>
              <ButtonPrimary
                variant="primary"
                size="md"
                @click="applyAndClose"
                class="self-end"
              >
                {{ buttonText }}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </teleport>
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
  title2: {
    type: String,
    default: "Filter",
  },
  items: {
    type: Array,
    default: () => [],
  },
  items2: {
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
const triggerMobileRef = ref(null);
const triggerDesktopRef = ref(null);

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

// Mencegah scroll dengan keyboard (arrow keys, space, page up/down)
const preventScrollKeys = (e) => {
  // Kunci arrow up, arrow down, space, page up, page down
  const keys = [32, 33, 34, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
    return false;
  }
};
const clearAllFilters = () => {
  internalSelectedValues.value = [];
  emit("apply", {
    type: props.filterType,
    values: [],
  });
  showModal.value = false;
};

// Toggle modal state
const toggleModal = () => {
  showModal.value = !showModal.value;
};

// Metode untuk menutup modal
const closeModal = () => {
  if (props.closeModalOnBackdrop) {
    syncInternalValues(); // Reset to preselected values
    showModal.value = false;
  }
};

// Terapkan pilihan dan tutup modal
const applyAndClose = () => {
  emit("apply", {
    type: props.filterType,
    values: [...internalSelectedValues.value], // Gunakan shallow copy
  });
  showModal.value = false;
};
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => window.innerWidth < 640);
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => {
  window.addEventListener("resize", handleResize);
  // Inisialisasi nilai pertama
  windowWidth.value = window.innerWidth;
});
const updateModalPosition = () => {
  // Pilih trigger yang sesuai dengan mode saat ini
  const triggerEl = isMobile.value
    ? triggerMobileRef.value?.$el || triggerMobileRef.value
    : triggerDesktopRef.value?.$el || triggerDesktopRef.value;

  const modalEl = modalRef.value;
  if (!triggerEl || !modalEl) return;
  nextTick(() => {
    const triggerRect = triggerEl.getBoundingClientRect();
    const modalRect = modalEl.getBoundingClientRect();

    if (isMobile.value) {
      // Mobile: posisikan modal tepat di bawah tombol mobile
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;
      let width = Math.max(triggerRect.width, 280);

      // Adjust untuk layar mobile
      if (left + width > window.innerWidth - 16) {
        left = window.innerWidth - width - 16;
      }
      if (left < 16) {
        left = 16;
        width = Math.min(width, window.innerWidth - 32);
      }

      // Pastikan tidak keluar layar bawah
      if (top + modalRect.height > window.innerHeight - 16) {
        if (triggerRect.top - modalRect.height - 8 > 56) {
          top = triggerRect.top - modalRect.height - 8;
        } else {
          top = Math.max(56, window.innerHeight - modalRect.height - 16);
        }
      }

      modalPositionStyle.value = {
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        maxWidth: "90vw",
        zIndex: 9999,
      };
      return;
    }

    // Desktop: posisi seperti biasa
    let top, left;
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

    // Adjust untuk desktop agar tidak keluar layar
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + modalRect.width > viewportWidth - 16) {
      left = viewportWidth - modalRect.width - 16;
    }
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
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
    };
  });
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
      // Event listeners
      window.addEventListener("resize", updateModalPosition);
      window.addEventListener("scroll", updateModalPosition, true);
      document.addEventListener("keydown", handleKeyDown);
    });
  } else {
    // Cleanup
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
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
// Watch untuk perubahan mode mobile/desktop
watch(isMobile, () => {
  if (showModal.value) {
    nextTick(() => updateModalPosition());
  }
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
