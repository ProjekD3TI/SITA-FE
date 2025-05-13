<template>
    <div class="flex gap-2 sm:gap-4 mx-auto w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <div class="self-center flex flex-wrap justify-between w-full items-center">
        <div class="">
          <span class="body5 sm:body4-bold">{{ headText }}</span>
          <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">{{ bodyText }}</h5>
        </div>
        <div class="lg:border-l-2 border-black lg:pl-4">
          <span class="body5 sm:body4-bold">{{ headText2 }}</span>
          <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">{{ bodyText2 }}</h5>
        </div>
        <div>
          <span class="body5 sm:body4-bold">{{ tahunLabel }}</span>
          <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">{{ tahunAjaran }}</h5>
        </div>
        <div v-if="showStatus" class="text-center">
          <span class="body5 sm:body4-bold">Status</span>
          
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
              class="w-fit h-fit hidden lg:block"
              size="md"
            />
            <Label
              :status="mappedStatus"
              :label="statusLabel || ''"
              :customLabel="!!statusLabel"
              class="w-fit h-fit lg:hidden block"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import Label from '@/components/Tugas-akhir/Label.vue';
  
  const props = defineProps({
    bodyText: {
      type: String,
      required: true
    },
    headText: {
      type: String,
      default: 'Dosen Pembimbing'
    },
    bodyText2: {
      type: String,
      default: ''
    },
    headText2: {
      type: String,
      default: 'Kategori TA'
    },
    tahunAjaran: {
      type: String,
      default: ''
    },
    tahunLabel: {
      type: String,
      default: 'Tahun Ajaran'
    },
    status: {
      type: String,
      default: 'pending'
    },
    showStatus: {
      type: Boolean,
      default: false
    },
    useCustomStatus: {
      type: Boolean,
      default: false
    },
    statusLabel: {
      type: String,
      default: ''
    }
  });
  
  // Map status dari berbagai format ke format yang diterima komponen Label
  const mappedStatus = computed(() => {
    // Pemetaan status ke format yang didukung komponen Label
    switch (props.status.toLowerCase()) {
      case 'approved':
      case 'success':
      case 'active':
      case 'diterima':
        return 'success';
        
      case 'rejected':
      case 'error':
      case 'danger':
      case 'ditolak':
        return 'danger';
        
      case 'warning':
      case 'waiting':
      case 'pending':
      case 'menunggu':
        return 'warning';
        
      case 'inactive':
      case 'nonaktif':
        return 'inactive';
        
      default:
        return 'warning'; // Default fallback
    }
  });
  </script>