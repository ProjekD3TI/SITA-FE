<template>
  <div class="overflow-x-auto">
    <div :class="minWidthClass">
      <table class="w-full">
        <thead>
          <tr class="text-white rounded-full bg-primary body5-bold sm:body4-bold">
            <th v-for="(header, index) in headers" :key="index" class="px-3 py-2 text-left border-r sm:py-4 sm:px-6"
              :class="{ 'rounded-l-lg': index === 0, 'rounded-r-lg': index === headers.length - 1 }">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedItems.length">
            <tr v-for="(item, index) in paginatedItems" :key="index"
              class="even:bg-even odd:bg-odd hover:bg-gray-200 text-left body5 sm:body4 rounded-lg active:scale-[0.99] duration-200 cursor-pointer"
              @click="handleRowClick(item)">
              <slot name="row" :item="item" />
            </tr>
          </template>
          <template v-else>
            <slot name="empty">
              <tr>
                <td :colspan="headers.length">
                  <div class="text-center text-placeholder py-8">Tidak ada data</div>
                </td>
              </tr>
            </slot>
          </template>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div v-if="showPagination" class="flex items-center justify-between mt-4">
        <div>
          <span class="text-secondary body5">
            Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ items.length }}
          </span>
        </div>
        <div class="flex">
          <button
            class="px-2 py-2 duration-200 border rounded-l-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :disabled="currentPage === 1" @click="prevPage">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            class="px-2 py-2 duration-200 border rounded-r-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :disabled="currentPage === totalPages" @click="nextPage">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  minWidth: {
    type: String,
    default: 'min-w-[800px]',
  },
});

const minWidthClass = computed(() => props.minWidth);

const emit = defineEmits(['rowClick']);

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(props.items.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return props.items.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.items.length));

const handleRowClick = (item) => {
  emit('rowClick', item);
};

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