<template>
  <div class="relative">
    <!-- Tombol untuk menampilkan modal -->
    <ButtonPrimary 
      class="w-full py-3 font-normal"
      ref="triggerRef"
      v-if="showTrigger"
      @click="toggleModal" 
      :variant="triggerVariant"
      :leftIconPath="computedTriggerLeftIconPath"
      :rightIconPath="computedTriggerRightIconPath"
    >
      {{ triggerText }}
      <span v-if="preselectedValues.length > 0" class="ml-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs">
        {{ preselectedValues.length }}
      </span>
    </ButtonPrimary>

    <!-- Modal dan overlay di-teleport ke body -->
    <teleport to="body">
      <div v-if="showModal">
        <!-- Overlay untuk menangkap klik di luar modal -->
        <div 
          class="fixed inset-0 z-40"
          @click="closeModal"
        ></div>
        <!-- Modal content -->
        <div 
          ref="modalRef"
          class="fixed z-50 bg-white border shadow-lg p-6 card-rounded w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] max-h-[80vh] overflow-y-auto"
          :style="modalPositionStyle"
          @click.stop
        >
          <!-- Header dengan judul dan tombol tutup -->
          <div class="flex justify-between items-center mb-4 w-full">
            <span class="body3-bold">Pilih {{ title }}</span>
          </div>

          <!-- Konten filter -->
          <div class="flex flex-wrap gap-2 mt-4 max-h-[40vh] overflow-y-auto">
            <div 
              v-for="(item, index) in items" 
              :key="index"
              class="border rounded-full px-4 py-2 text-center body5 flex-grow cursor-pointer active:scale-90 duration-200"
              :class="isSelected(item.value || item) ? 
                'border-secondary bg-secondary text-white hover:opacity-90' : 
                'border-placeholder hover:bg-secondary hover:text-white hover:border-secondary'"
              @click="toggleSelection(item.value || item)"
            >
              <span>{{ item.label || item }}</span>
            </div>
          </div>

          <!-- Footer dengan hint dan tombol terapkan -->
          <div class="absolute bottom-[72px] left-0 w-full border-t border-placeholder opacity-20"></div>
          <div class="flex justify-between items-center mt-6">
            <span class="body5 text-placeholder">{{ hint }}</span>
            <div class="flex gap-2">
              <ButtonPrimary
                variant="primary"
                size="md"
                @click="applyAndClose"
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
import { ref, defineEmits, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import ButtonPrimary from '@/components/Tugas-akhir/Button.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Filter'
  },
  items: {
    type: Array,
    default: () => []
  },
  hint: {
    type: String,
    default: '*Anda dapat memilih banyak'
  },
  buttonText: {
    type: String,
    default: 'Terapkan'
  },
  multiSelect: {
    type: Boolean,
    default: true
  },
  preselectedValues: {
    type: Array,
    default: () => []
  },
  filterType: {
    type: String,
    default: 'general'
  },
  showTrigger: {
    type: Boolean,
    default: true
  },
  triggerText: {
    type: String,
    default: 'Filter'
  },
  triggerVariant: {
    type: String,
    default: 'outlined-black'
  },
  // Mengganti properties trigger icon lama
  triggerLeftIconPath: {
    type: String,
    default: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
  },
  triggerRightIconPath: {
    type: String,
    default: 'm19.5 8.25-7.5 7.5-7.5-7.5'
  },
  // Untuk backward compatibility
  triggerIconPath: {
    type: String,
    default: null
  },
  triggerIconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  closeModalOnBackdrop: {
    type: Boolean,
    default: true
  },
  modalPosition: {
    type: String,
    default: 'bottom' // 'bottom', 'top', 'left', 'right'
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['apply', 'update:modelValue']);

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
  if (props.triggerIconPath && props.triggerIconPosition === 'left') return props.triggerIconPath;
  return null;
});

const computedTriggerRightIconPath = computed(() => {
  if (props.triggerRightIconPath) return props.triggerRightIconPath;
  if (props.triggerIconPath && props.triggerIconPosition === 'right') return props.triggerIconPath;
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
    internalSelectedValues.value = internalSelectedValues.value.filter(item => item !== value);
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
  if (event.key === 'Escape') {
    closeModal();
  }
};

// Metode untuk menutup modal
const closeModal = () => {
  if (props.closeModalOnBackdrop) {
    syncInternalValues(); // Reset to preselected values
    showModal.value = false;
  }
};

// Toggle modal state
const toggleModal = () => {
  showModal.value = !showModal.value;
};

// Terapkan pilihan dan tutup modal
const applyAndClose = () => {
  emit('apply', {
    type: props.filterType,
    values: [...internalSelectedValues.value] // Gunakan shallow copy
  });
  showModal.value = false;
};

// Update posisi modal relatif terhadap tombol trigger
const updateModalPosition = () => {
  const triggerEl = triggerRef.value?.$el || triggerRef.value;
  const modalEl = modalRef.value;
  if (!triggerEl || !modalEl || !triggerEl.getBoundingClientRect) return;

  const triggerRect = triggerEl.getBoundingClientRect();
  const modalRect = modalEl.getBoundingClientRect();
  
  let top, left;
  
  switch (props.modalPosition) {
    case 'top':
      top = triggerRect.top - modalRect.height - 8;
      left = triggerRect.left;
      break;
    case 'right':
      top = triggerRect.top;
      left = triggerRect.right + 8;
      break;
    case 'left':
      top = triggerRect.top;
      left = triggerRect.left - modalRect.width - 8;
      break;
    case 'bottom':
    default:
      top = triggerRect.bottom + 8;
      left = triggerRect.left;
      break;
  }
  
  // Ensure modal is fully visible within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Adjust horizontal position if needed
  if (left + modalRect.width > viewportWidth - 16) {
    left = viewportWidth - modalRect.width - 16;
  }
  if (left < 16) {
    left = 16;
  }
  
  // Adjust vertical position if needed
  if (top + modalRect.height > viewportHeight - 16) {
    // If modal doesn't fit below, try to place it above
    if (props.modalPosition === 'bottom' && triggerRect.top > modalRect.height) {
      top = triggerRect.top - modalRect.height - 8;
    } else {
      // Otherwise, just make sure it doesn't go off-screen
      top = viewportHeight - modalRect.height - 16;
    }
  }
  if (top < 16) {
    top = 16;
  }
  
  modalPositionStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
};

// Watch untuk preselectedValues
watch(() => props.preselectedValues, () => {
  // Hanya sync jika modal tidak sedang terbuka (mencegah reset selama pengguna memilih)
  if (!showModal.value) {
    syncInternalValues();
  }
}, { deep: true });

// Watch untuk modelValue
watch(() => props.modelValue, (value) => {
  showModal.value = value;
  if (value) {
    // Ketika modal dibuka, pindahkan preselectedValues ke state internal
    syncInternalValues();
    nextTick(updateModalPosition);
  }
});

// Watch untuk showModal
watch(showModal, (value) => {
  emit('update:modelValue', value);
  if (value) {
    nextTick(() => {
      updateModalPosition();
      // Tambahkan event listener untuk resize
      window.addEventListener('resize', updateModalPosition);
      // Tambahkan event listener untuk scroll
      window.addEventListener('scroll', updateModalPosition, true);
      // Tambahkan event listener untuk Escape key
      document.addEventListener('keydown', handleKeyDown);
    });
  } else {
    // Reset selection saat modal ditutup tanpa mengklik Apply
    syncInternalValues();
    
    // Hapus event listener saat modal ditutup
    window.removeEventListener('resize', updateModalPosition);
    window.removeEventListener('scroll', updateModalPosition, true);
    document.removeEventListener('keydown', handleKeyDown);
  }
});

// Initialize on mount
onMounted(() => {
  syncInternalValues();
  
  if (showModal.value) {
    nextTick(updateModalPosition);
  }
});

// Cleanup event listeners when component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateModalPosition);
  window.removeEventListener('scroll', updateModalPosition, true);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>