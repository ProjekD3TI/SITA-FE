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

  // // ✅ DEBUG: Log untuk melihat perbandingan
  // console.log("🔍 Checking date:", {
  //   originalDate: date,
  //   formattedString: dateString,
  //   availableDates: props.availableDates.slice(0, 5), // Show first 5 for debug
  //   isIncluded: props.availableDates.includes(dateString),
  // });

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
    >
      <template #input-icon>
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 ms-6 text-blackText"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg> -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 sm:ms-6 ms-4 text-blackText"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
      </template>
      <template #clear-icon="{ clear }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 bg-white me-4 sm:me-4 lg:me-6 text-blackText hover:text-secondary"
          @click="clear"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </template>
    </VueDatePicker>
  </div>
</template>

<style scoped>
/* ✅ Custom styling untuk date picker */

:deep(.dp__input) {
  @apply w-full px-4 ps-10 sm:ps-12  min-h-[46px] sm:min-h-[47px] bg-white border border-placeholder;
  @apply text-[13px] sm:text-base text-blackText focus:border-primary focus:outline-none;

  border-radius: 12px;
}
#clear-icon {
  @apply w-5 h-5 pe-10 text-blackText;
}
:deep(.dp__input:disabled) {
  @apply cursor-not-allowed opacity-50 bg-gray-100;
}

:deep(.dp__input:focus) {
  @apply border-primary;
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
  @apply text-primary font-medium;
}

:deep(.dp__today) {
  @apply bg-blue-100 text-primary font-medium;
}

:deep(.dp__date_hover) {
  @apply bg-blue-50;
}

:deep(.dp__active_date) {
  @apply bg-primary text-white font-medium;
}

:deep(.dp__disabled) {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

:deep(.dp__cell_disabled) {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

:deep(.dp__month_year_select) {
  @apply text-primary font-medium;
}

:deep(.dp__arrow_top) {
  @apply text-primary;
}

:deep(.dp__arrow_bottom) {
  @apply text-primary;
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
