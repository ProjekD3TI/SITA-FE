<template>
  <div class="flex w-full gap-2 mx-auto sm:gap-4">
    <img
      :src="DefaultAvatar"
      alt=""
      class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
    />
    <div
      class="flex flex-wrap items-center self-center justify-between w-full gap-2"
    >
      <div class="">
        <span class="body5 sm:body4-bold text-blackText">{{ headText }}</span>
        <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
          {{ bodyText }}
        </h5>
      </div>
      <div class="border-blackText lg:border-l-2 lg:pl-4">
        <span class="body5 sm:body4-bold text-blackText">{{ headText2 }}</span>
        <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
          {{ bodyText2 }}
        </h5>
      </div>
      <div class="border-blackText lg:border-l-2 lg:pl-4">
        <span class="body5 sm:body4-bold text-blackText">{{ headText3 }}</span>
        <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
          {{ bodyText3 }}
        </h5>
      </div>
      <div>
        <span class="body5 sm:body4-bold text-blackText">{{ tahunLabel }}</span>
        <h5 class="body5-bold sm:body3-bold lg:body2-bold text-secondary">
          {{ tahunAjaran }}
        </h5>
      </div>
      <div v-if="showStatus" class="text-center">
        <span class="body5 sm:body4-bold text-blackText">Status</span>

        <!-- Gunakan slot jika disediakan, jika tidak gunakan built-in status -->
        <slot name="status" v-if="useCustomStatus">
          <!-- Slot untuk konten kustom -->
        </slot>

        <!-- Status bawaan dengan Label component -->
        <div v-else class="mt-1">
          <!-- Gunakan Label component dengan responsive sizes -->
          <Label
            :status="mappedStatus"
            :label="statusLabel || ''"
            :customLabel="!!statusLabel"
            class="hidden w-fit h-fit lg:block"
            size="md"
          />
          <Label
            :status="mappedStatus"
            :label="statusLabel || ''"
            :customLabel="!!statusLabel"
            class="block w-fit h-fit lg:hidden"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Label from "@/components/Tugas-akhir/Label.vue";
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";

const props = defineProps({
  bodyText: {
    type: String,
    required: true,
  },
  headText: {
    type: String,
    default: "Dosen Pembimbing",
  },
  bodyText2: {
    type: String,
    default: "",
  },
  headText2: {
    type: String,
    default: "",
  },
  bodyText3: {
    type: String,
    default: "",
  },
  headText3: {
    type: String,
    default: "",
  },
  tahunAjaran: {
    type: String,
    default: "",
  },
  tahunLabel: {
    type: String,
    default: "Tahun Ajaran",
  },
  status: {
    type: String,
    default: "pending",
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
  useCustomStatus: {
    type: Boolean,
    default: false,
  },
  statusLabel: {
    type: String,
    default: "",
  },
});

// Map status dari berbagai format ke format yang diterima komponen Label
const mappedStatus = computed(() => {
  switch (props.status.toLowerCase()) {
    case "approved":
    case "success":
    case "active":
    case "diterima":
      return "success";
    case "rejected":
    case "error":
    case "danger":
    case "ditolak":
      return "danger";
    case "warning":
    case "waiting":
    case "pending":
    case "menunggu":
      return "warning";
    case "warning-outline":
      return "warning-outline";
    case "success-outline":
      return "success-outline";
    case "danger-outline":
      return "danger-outline";
    case "inactive":
    case "nonaktif":
      return "inactive";
    default:
      return "warning";
  }
});
</script>
