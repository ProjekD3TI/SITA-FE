<template>
  <div class="relative">
    <div
      @click="handleClick"
      :class="[
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      ]"
    >
      <span v-if="modelValue" class="flex-1">{{ getSelectedLabel }}</span>
      <span v-else class="text-muted-foreground flex-1">{{ placeholder }}</span>
      <span class="ml-2" :class="{ 'opacity-50': disabled }">▼</span>
    </div>

    <div
      v-if="isOpen && !disabled"
      class="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <input
        ref="searchInput"
        type="text"
        v-model="searchQuery"
        @click.stop
        placeholder="Cari..."
        class="w-full px-3 py-2 border-b text-sm focus:outline-none"
      />
      <div class="py-1">
        <div
          v-for="option in filteredOptions"
          :key="option[valueKey]"
          @click="selectOption(option)"
          class="px-3 py-2 cursor-pointer hover:bg-secondary text-sm"
        >
          {{ formatOptionLabel(option) }}
        </div>
        <div
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-sm text-muted-foreground"
        >
          Tidak ada data
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  labelKey: {
    type: String,
    default: "label",
  },
  valueKey: {
    type: String,
    default: "value",
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // Add type property to determine display format
  type: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const searchQuery = ref("");
const searchInput = ref(null);

const filteredOptions = computed(() => {
  if (!props.options) return [];
  return props.options.filter((option) => {
    // Check if searching by name, NIM, or NIK
    const label = formatOptionLabel(option).toLowerCase();
    return label.includes(searchQuery.value.toLowerCase());
  });
});

// Format the display label based on the option type
const formatOptionLabel = (option) => {
  if (!option) return "";

  // Check if the option has nim (student) or nik (staff)
  if (option.nim) {
    return `${option[props.labelKey]} - ${option.nim}`;
  } else if (option.nik) {
    return `${option[props.labelKey]} - ${option.nik}`;
  } else {
    return option[props.labelKey];
  }
};

const getSelectedLabel = computed(() => {
  if (!props.options) return "";
  const selected = props.options.find(
    (option) => option[props.valueKey] === props.modelValue
  );
  return selected ? formatOptionLabel(selected) : "";
});

const handleClick = () => {
  if (props.disabled) return;
  toggleDropdown();
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  }
};

const selectOption = (option) => {
  emit("update:modelValue", option[props.valueKey]);
  isOpen.value = false;
  searchQuery.value = "";
};

const closeDropdown = (e) => {
  if (!e.target.closest(".relative")) {
    isOpen.value = false;
    searchQuery.value = "";
  }
};

watch(
  () => props.disabled,
  (newValue) => {
    if (newValue) {
      isOpen.value = false;
      searchQuery.value = "";
    }
  }
);

watch(
  () => props.options,
  () => {
    searchQuery.value = "";
  }
);

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
