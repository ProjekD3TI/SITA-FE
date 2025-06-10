<script setup>
import { ref, computed, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  minDate: { type: String, default: "" },
  maxDate: { type: String, default: "" },
  disabledDates: { type: Function, default: null },
  availableDates: { type: Array, default: () => [] },
  placeholder: { type: String, default: "Pilih tanggal" },
});

const emit = defineEmits(["update:value"]);

// ✅ Parse string date as local date (bukan UTC)
function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// ✅ Convert Date object ke string tanpa timezone offset
function formatLocalDateString(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const internalValue = ref(parseLocalDate(props.value));

const minDateObj = computed(() =>
  props.minDate ? parseLocalDate(props.minDate) : null
);

const maxDateObj = computed(() =>
  props.maxDate ? parseLocalDate(props.maxDate) : null
);

// ✅ PERBAIKAN: Gunakan formatLocalDateString instead of toISOString
const isDateDisabled = (date) => {
  const dateString = formatLocalDateString(date); // ✅ Ganti dari toISOString

  // ✅ DEBUG: Log untuk melihat perbandingan
  console.log("🔍 Checking date:", {
    originalDate: date,
    formattedString: dateString,
    availableDates: props.availableDates.slice(0, 5), // Show first 5 for debug
    isIncluded: props.availableDates.includes(dateString),
  });

  if (props.availableDates.length > 0) {
    return !props.availableDates.includes(dateString);
  }
  if (props.disabledDates) {
    return props.disabledDates(date);
  }
  return false;
};

// ✅ PERBAIKAN: Watch internal value dengan formatLocalDateString
watch(internalValue, (newValue) => {
  if (newValue) {
    const dateString = formatLocalDateString(newValue); // ✅ Ganti dari toISOString
    emit("update:value", dateString);
  } else {
    emit("update:value", "");
  }
});

// ✅ PERBAIKAN: Watch props value
watch(
  () => props.value,
  (newValue) => {
    if (
      newValue &&
      newValue !== formatLocalDateString(internalValue.value) // ✅ Ganti dari toISOString
    ) {
      internalValue.value = parseLocalDate(newValue);
    } else if (!newValue) {
      internalValue.value = null;
    }
  }
);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <div class="relative w-full">
    <label
      :for="id"
      class="absolute bg-white left-3 sm:left-5 -top-2.5 px-1 body5-bold sm:body4-bold text-blackText z-10"
    >
      {{ label }} <span v-if="required" class="text-secondary">*</span>
    </label>

    <VueDatePicker
      :id="id"
      v-model="internalValue"
      :disabled="disabled"
      :min-date="minDateObj"
      :max-date="maxDateObj"
      :disabled-dates="isDateDisabled"
      :placeholder="placeholder"
      :format="formatDate"
      :enable-time-picker="false"
      :auto-apply="true"
      :clearable="true"
      :close-on-scroll="false"
      :month-change-on-scroll="false"
      :prevent-min-max-navigation="true"
      input-class-name="w-full px-4 py-3 bg-white border border-placeholder rounded-lg body5 sm:body4 text-blackText focus:border-primary focus:outline-none"
      menu-class-name="dp-custom-menu"
      class="custom-datepicker"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
    />
  </div>
</template>

<style scoped>
/* ✅ Custom styling untuk date picker */
:deep(.dp__input) {
  @apply w-full px-4 py-3 bg-white border border-gray-300;
  @apply text-sm text-gray-900 focus:border-blue-500 focus:outline-none;
  border-radius: 12px;
  min-height: 48px;
  font-size: 14px;
}

:deep(.dp__input:disabled) {
  @apply cursor-not-allowed opacity-50 bg-gray-100;
}

:deep(.dp__input:focus) {
  @apply border-blue-500;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

:deep(.dp__menu) {
  @apply border border-gray-200 rounded-lg shadow-lg bg-white;
  z-index: 1000;
}

:deep(.dp__calendar_header) {
  @apply bg-blue-50;
}

:deep(.dp__calendar_header_item) {
  @apply text-blue-800 font-medium;
}

:deep(.dp__today) {
  @apply bg-blue-100 text-blue-800 font-medium;
}

:deep(.dp__date_hover) {
  @apply bg-blue-50;
}

:deep(.dp__active_date) {
  @apply bg-blue-500 text-white font-medium;
}

:deep(.dp__disabled) {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

:deep(.dp__cell_disabled) {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

:deep(.dp__month_year_select) {
  @apply text-blue-600 font-medium;
}

:deep(.dp__arrow_top) {
  @apply text-blue-600;
}

:deep(.dp__arrow_bottom) {
  @apply text-blue-600;
}

.custom-datepicker {
  width: 100%;
}

/* Style untuk menu dropdown */
.dp-custom-menu {
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
