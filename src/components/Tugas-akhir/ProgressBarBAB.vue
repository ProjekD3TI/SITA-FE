<template>
  <div class="w-full max-w-4xl py-4">
    <div class="flex items-center justify-between">
      <template v-for="(step, index) in steps" :key="index">
        <!-- Step Circle -->
        <div class="flex flex-col items-center">
          <div :class="[
            'relative rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center body4-bold sm:body3-bold',
            currentStep > 0 && currentStep >= index + 1 ? 'bg-orange-500 text-white  ring-4 sm:ring-8 ring-secondary/20' : 'border border-placeholder text-placeholder'
          ]">
            <template v-if="currentStep > 0 && currentStep >= index + 1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 lg:h-8 lg:w-8 sm:w-6 sm:h-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </template>
            <template v-else>
              {{ index + 1 }}
            </template>
          </div>
          <!-- Step Label -->
          <div class="mt-2 text-black uppercase body5">
            {{ step }}
          </div>
        </div>

        <!-- Connector Line (except after the last step) -->
        <div v-if="index < steps.length - 1" :class="[
          'flex-1 h-[2px] mx-0.5 sm:mx-1 lg:mx-2 mb-6',
          currentStep > 0 && currentStep > index + 1 ? 'bg-orange-500' : 'bg-placeholder'
        ]"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 1
  },
  steps: {
    type: Array,
    default: () => ['BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V']
  }
});
</script>