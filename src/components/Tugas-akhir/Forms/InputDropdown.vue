<template>
  <div class="relative w-full">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold text-blackText"
      >{{ label }}</label
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
        style="max-height: 300px"
      >
        <!-- Search input di dalam dropdown -->
        <div class="sticky top-0 z-10 p-2 bg-white border-b">
          <div class="flex items-center p-2 border border-gray-300 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5 mr-2 text-gray-500"
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
              class="w-full outline-none text-blackText"
              placeholder="Cari..."
              v-model="searchQuery"
              ref="searchInput"
              autocomplete="off"
              @click.stop
            />
          </div>
        </div>

        <!-- Daftar opsi hasil pencarian -->
        <div class="overflow-y-auto" style="max-height: 200px">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            class="px-6 py-2 cursor-pointer hover:bg-gray-100"
            :class="
              selectedValue === option.value
                ? 'text-primary font-medium'
                : 'text-blackText'
            "
            @click.stop="selectOption(option)"
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
});

const selectedValue = ref(props.modelValue);
const searchQuery = ref("");
const isDropdownOpen = ref(false);
const searchInput = ref(null);
const dropdownPanel = ref(null);

// Compute display text for the input field
const displayText = computed(() => {
  if (!selectedValue.value) return "";
  const selectedOption = props.options.find(
    (option) => option.value === selectedValue.value
  );
  return selectedOption ? selectedOption.label : "";
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

// Filtered options based on search query
const filteredOptions = computed(() =>
  props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Function to select an option
const selectOption = (option) => {
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
      if (searchInput.value) {
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
