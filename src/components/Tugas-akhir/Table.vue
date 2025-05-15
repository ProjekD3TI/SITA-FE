<template>
    <div class="overflow-x-auto">
        <div class="min-w-[700px]">
            <table class="w-full">
                <thead>
                <tr class="bg-primary text-white rounded-full body5-bold sm:body4-bold">
                    <th
                    v-for="(header, index) in headers"
                    :key="index"
                    class="sm:py-4 py-3 sm:px-4 px-1"
                    :class="{ 'rounded-l-lg': index === 0, 'rounded-r-lg': index === headers.length - 1 }"
                    >
                    {{ header }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(item, index) in paginatedItems"
                    :key="index"
                    class="even:bg-even odd:bg-odd hover:bg-gray-200 text-center body5 sm:body4 rounded-lg active:scale-[0.99] duration-200 cursor-pointer"
                    @click="handleRowClick(item)"
                >
                    <slot name="row" :item="item" />
                </tr>
                </tbody>
            </table>
        
            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-4">
                <div>
                <span class="text-secondary body5">
                    Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ items.length }}
                </span>
                </div>
                <div class="flex">
                <button
                    class="border border-secondary text-secondary hover:text-white hover:bg-secondary px-2 py-2 rounded-l-lg active:scale-90 duration-200"
                    :disabled="currentPage === 1"
                    @click="prevPage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    class="border border-secondary text-secondary hover:text-white hover:bg-secondary px-2 py-2 rounded-r-lg active:scale-90 duration-200"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                </div>
            </div>
        </div>

    </div>
  </template>
  
  <script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';

// Store the props in a variable
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

// Emit for row click events
const emit = defineEmits(['rowClick']);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

// Use props.items instead of items
const totalPages = computed(() => Math.ceil(props.items.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.items.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.items.length));

// Handle row click
const handleRowClick = (item) => {
  emit('rowClick', item);
};

// Navigation functions
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>