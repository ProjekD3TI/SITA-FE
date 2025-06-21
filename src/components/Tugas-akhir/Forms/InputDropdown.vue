<template>
  <div class="relative w-full">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold text-blackText"
      >{{ label }} <span v-if="required" class="text-secondary">*</span></label
    >
    <div
      class="flex items-center w-full px-4 py-3 bg-white border border-placeholder input-rounded sm:px-6 body5 sm:body4"
      :class="{ 'border-primary': isDropdownOpen }"
      @click="toggleDropdown"
    >
      <!-- Input utama (read-only) -->
      <input
        :id="id"
        type="text"
        class="w-full outline-none cursor-pointer"
        :class="{
          'text-gray-400': !selectedValue,
          'text-blackText': selectedValue,
        }"
        :placeholder="placeholder"
        :value="displayText"
        readonly
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-black transition-transform duration-300 cursor-pointer"
        :class="isDropdownOpen ? 'rotate-180' : 'rotate-0'"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>

    <!-- Dropdown panel yang muncul di bawah input -->
    <Transition name="dropdown">
      <div
        v-if="isDropdownOpen"
        ref="dropdownPanel"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-100 shadow-lg card-rounded"
        :style="{ maxHeight: maxHeight }"
      >
        <!-- Search input di dalam dropdown (sekarang kondisional) -->
        <div v-if="searchable" class="sticky top-0 z-10 p-2 bg-white border-b">
          <div class="flex items-center p-2 border border-gray-300 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5 mr-2 text-placeholder"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              class="w-full outline-none text-blackText body4 sm:body3"
              placeholder="Cari..."
              v-model="searchQuery"
              ref="searchInput"
              autocomplete="off"
              @click.stop
            />
          </div>
        </div>

        <!-- Daftar opsi hasil pencarian -->
        <div class="overflow-y-auto" :style="{ maxHeight: listMaxHeight }">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="px-6 py-2 cursor-pointer body5 sm:body4 hover:bg-gray-100"
            :class="[
              option.disabled
                ? 'cursor-not-allowed text-gray-400 bg-gray-50'
                : 'cursor-pointer hover:bg-gray-100',
              selectedValue === option.value && !option.disabled
                ? 'text-primary font-medium bg-blue-50'
                : option.disabled
                ? 'text-gray-400'
                : option.isDefault
                ? 'text-gray-500 italic' // ✅ TAMBAHAN: Styling khusus untuk default option
                : 'text-blackText',
            ]"
            @click.stop="!option.disabled && selectOption(option)"
          >
            {{ option.label }}
          </div>
          <div
            v-if="filteredOptions.length === 0"
            class="p-8 text-center text-gray-500"
          >
            Tidak ada opsi ditemukan
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";

const emit = defineEmits(["update:modelValue"]);

// Define props properly
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: "Pilih" },
  modelValue: { type: [String, Number], default: "" },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showDefaultOption: { type: Boolean, default: true }, // ✅ TAMBAHAN: Show default option
  defaultOptionText: { type: String, default: "-- Pilih --" }, // ✅ TAMBAHAN: Customizable default text
  searchable: { type: Boolean, default: true }, // Tambahkan prop ini
  maxHeight: { type: String, default: "300px" }, // Tambahkan prop ini
});

const selectedValue = ref(props.modelValue ?? null);
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const searchInput = ref(null);
const dropdownPanel = ref(null);

// Hitung max-height untuk list secara dinamis
const listMaxHeight = computed(() => {
  const outerHeight = parseInt(props.maxHeight);
  if (isNaN(outerHeight)) {
    return "250px"; // Fallback
  }
  // Perkirakan tinggi search bar ~50px
  const searchBarHeight = props.searchable ? 100 : 0;
  return `${outerHeight - searchBarHeight}px`;
});

// Filtered options based on search query
const filteredOptions = computed(() => {
  let opts = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (props.showDefaultOption) {
    opts = [
      {
        value: null,
        label: props.defaultOptionText,

        isDefault: true,
      },
      ...opts,
    ];
  }
  return opts;
});

// Compute display text for the input field
const displayText = computed(() => {
  if (!selectedValue.value) return props.defaultOptionText;
  const selectedOption = props.options.find(
    (option) => option.value === selectedValue.value
  );
  return selectedOption ? selectedOption.label : props.defaultOptionText;
});

// Set initial display value based on modelValue
onMounted(() => {
  if (props.modelValue) {
    selectedValue.value = props.modelValue;
  }

  // Add event listener to close dropdown when clicking outside
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const container = dropdownPanel.value;
  const inputContainer = event.target.closest(".relative");

  // If click is outside of the dropdown container and its parent
  if (
    isDropdownOpen.value &&
    container &&
    !container.contains(event.target) &&
    (!inputContainer || inputContainer !== dropdownPanel.value?.parentNode)
  ) {
    isDropdownOpen.value = false;
  }
};

// Watch for changes to modelValue from parent
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue;
  }
);

// Function to select an option
const selectOption = (option) => {
  // ✅ Cegah selection jika option disabled
  if (option.disabled) {
    return;
  }

  selectedValue.value = option.value;
  isDropdownOpen.value = false;
  emit("update:modelValue", option.value);
};

// Toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;

  if (isDropdownOpen.value) {
    searchQuery.value = "";
    nextTick(() => {
      // Fokus hanya jika search input ada
      if (props.searchable && searchInput.value) {
        searchInput.value.focus();
      }
    });
  }
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
