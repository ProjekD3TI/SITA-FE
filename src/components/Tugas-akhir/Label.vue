<template>
  <div
    class="flex items-center label-rounded"
    :class="[bgColorClass, sizeClass]"
  >
    <span class="capitalize" :class="textColorClass">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
      [
        "success",
        "danger",
        "warning",
        "success-outline",
        "danger-outline",
        "warning-outline",
        "inactive",
      ].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
  customLabel: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
  },
});

// Menentukan teks label berdasarkan status jika customLabel false
const displayLabel = computed(() => {
  if (props.customLabel) return props.label;

  switch (props.status) {
    case "success":
      return props.label || "Diterima";
    case "danger":
      return props.label || "Ditolak";
    case "warning":
      return props.label || "Menunggu";
    case "success-outline":
      return props.label || "Diterima";
    case "danger-outline":
      return props.label || "Ditolak";
    case "warning-outline":
      return props.label || "Menunggu";
    case "inactive":
      return props.label || "Inactive";
    default:
      return props.label;
  }
});

// Menentukan kelas background berdasarkan status
const bgColorClass = computed(() => {
  switch (props.status) {
    case "success":
      return "bg-success-bg";
    case "danger":
      return "bg-danger-bg/20";
    case "warning":
      return "bg-warning-bg/20";
    case "success-outline":
      return "border border-success";
    case "danger-outline":
      return "border border-danger-bg";
    case "warning-outline":
      return "border border-warning-bg";
    case "inactive":
      return "bg-placeholder/20";
    default:
      return "";
  }
});

// Menentukan kelas warna teks berdasarkan status
const textColorClass = computed(() => {
  switch (props.status) {
    case "success":
      return "text-success";
    case "danger":
      return "text-danger";
    case "warning":
      return "text-warning";
    case "success-outline":
      return "text-success";
    case "danger-outline":
      return "text-danger";
    case "warning-outline":
      return "text-warning";
    case "inactive":
      return "text-placeholder";
    default:
      return "";
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "body5-bold px-3 py-1";
    case "lg":
      return "body3-bold px-5 py-2";
    case "xl":
      return "body2-bold px-5 py-3";
    default:
      return "body4-bold px-4 py-1";
  }
});
</script>
