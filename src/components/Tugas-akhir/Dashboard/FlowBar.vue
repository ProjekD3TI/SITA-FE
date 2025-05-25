<template>
  <div class="flex items-center min-w-[600px] px-8 pb-16 max-w-screen-lg">
    <template v-for="(step, index) in steps" :key="step.name">
      <!-- Step Circle -->
      <div :class="[
        'rounded-full p-2 relative',
        index <= currentStep
          ? 'bg-success ring-4 ring-success-bg'
          : index === currentStep + 1
            ? 'border-2 p-3.5 border-success'
            : 'border-2 p-3.5 border-placeholder/20'
      ]">
        <!-- Checkmark for completed steps -->
        <svg v-if="index <= currentStep" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>

        <!-- Step Name Below Circle -->
        <div class="absolute flex items-center justify-center rounded-full top-10 -left-8">
          <span class="w-24 text-center body5 lg:body4">{{ step.name }}</span>
        </div>
      </div>

      <!-- Connecting Line (except after last step) -->
      <div v-if="index < steps.length - 1" :class="[
        'flex-1 h-2',
        index < currentStep + 1 ? 'bg-success-bg' : 'bg-placeholder/20'
      ]"></div>
    </template>
  </div>
</template>

<script setup>
// Define props using defineProps
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
    default: 0
  },
  steps: {
    type: Array,
    required: true,
    default: () => [
      { name: 'Request Pembimbing' },
      { name: 'Daftar Proposal' },
      { name: 'Seminar Proposal' },
      { name: 'Seminar Hasil' },
      { name: 'Daftar Ujian Tugas Akhir' },
      { name: 'Ujian Tugas Akhir' }
    ]
  }
});
</script>