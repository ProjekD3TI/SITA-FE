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
        @input="handleSearch"
        placeholder="Cari..."
        class="w-full px-3 py-2 border-b text-sm focus:outline-none"
      />
      <div v-if="loading" class="flex justify-center py-4">
        <div
          class="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"
        ></div>
      </div>
      <div v-else class="py-1">
        <div
          v-for="option in displayOptions"
          :key="option[valueKey]"
          @click="selectOption(option)"
          class="px-3 py-2 cursor-pointer hover:bg-secondary text-sm"
        >
          {{ formatOptionLabel(option) }}
        </div>
        <div
          v-if="displayOptions.length === 0 && searchQuery.length > 0"
          class="px-3 py-2 text-sm text-muted-foreground"
        >
          Tidak ada data untuk "{{ searchQuery }}"
        </div>
        <div
          v-if="displayOptions.length === 0 && searchQuery.length === 0"
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
import axios from "axios";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
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
  apiEndpoint: {
    type: String,
    default: "",
  },
  useServerSearch: {
    type: Boolean,
    default: false,
  },
  additionalParams: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const searchQuery = ref("");
const searchInput = ref(null);
const loading = ref(false);
const displayOptions = ref([]);
const selectedOption = ref(null);
const debounceTimeout = ref(null);

const handleSearch = () => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }

  debounceTimeout.value = setTimeout(async () => {
    if (props.apiEndpoint && props.useServerSearch) {
      await fetchOptions(searchQuery.value);
    } else {
      filterOptions();
    }
  }, 300);
};

const filterOptions = () => {
  if (!props.options) {
    displayOptions.value = [];
    return;
  }

  if (searchQuery.value.trim() === "") {
    displayOptions.value = props.options;
    return;
  }

  displayOptions.value = props.options.filter((option) => {
    const label = formatOptionLabel(option).toLowerCase();
    return label.includes(searchQuery.value.toLowerCase());
  });
};

const fetchOptions = async (search = "") => {
  if (!props.apiEndpoint && !props.useServerSearch) {
    filterOptions();
    return;
  }

  loading.value = true;
  try {
    const params = {
      ...props.additionalParams,
    };

    params.search = search;

    const response = await axios.get(props.apiEndpoint, { params });

    if (response.data && response.data.data) {
      displayOptions.value = response.data.data;
    } else {
      displayOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching options:", error);
    displayOptions.value = [];
  } finally {
    loading.value = false;
  }
};

const formatOptionLabel = (option) => {
  if (!option) return "";

  if (option.nim) {
    return `${option[props.labelKey]} - ${option.nim}`;
  } else if (option.nik) {
    return `${option[props.labelKey]} - ${option.nik}`;
  } else {
    return option[props.labelKey];
  }
};

const getSelectedLabel = computed(() => {
  if (!props.modelValue) return "";

  if (
    selectedOption.value &&
    selectedOption.value[props.valueKey] === props.modelValue
  ) {
    return formatOptionLabel(selectedOption.value);
  }

  let selected = displayOptions.value.find(
    (option) => option[props.valueKey] === props.modelValue
  );

  if (!selected && props.options) {
    selected = props.options.find(
      (option) => option[props.valueKey] === props.modelValue
    );
  }

  if (selected) {
    selectedOption.value = selected;
  }

  return selected ? formatOptionLabel(selected) : "";
});

const handleClick = () => {
  if (props.disabled) return;
  toggleDropdown();
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = "";

    if (props.apiEndpoint && props.useServerSearch) {
      fetchOptions("");
    } else {
      displayOptions.value = props.options || [];
    }

    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  }
};

const selectOption = (option) => {
  selectedOption.value = option;
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
  () => props.modelValue,
  async (newValue) => {
    if (
      newValue &&
      props.useServerSearch &&
      props.apiEndpoint &&
      !selectedOption.value
    ) {
      try {
        const response = await axios.get(`${props.apiEndpoint}/${newValue}`);
        if (response.data && response.data.data) {
          selectedOption.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching selected option:", error);
      }
    }
  },
  { immediate: true }
);

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
  (newOptions) => {
    if (!props.useServerSearch && isOpen.value) {
      displayOptions.value = newOptions || [];
    }
  }
);

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value);
  }
});
</script>
