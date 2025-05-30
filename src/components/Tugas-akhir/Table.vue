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
          <template v-if="items.length">
            <tr v-for="(item, index) in items" :key="index"
              class="even:bg-even odd:bg-odd hover:bg-gray-200 text-left body5 sm:body4 rounded-lg active:scale-[0.99] duration-200 cursor-pointer"
              @click="handleRowClick(item)">
              <slot name="row" :item="item" />
            </tr>
          </template>
          <template v-else>
            <slot name="empty">
              <tr>
                <td :colspan="headers.length">
                  <div class="py-8 text-center text-placeholder">Tidak ada data</div>
                </td>
              </tr>
            </slot>
          </template>
        </tbody>
      </table>

      <!-- Pagination Controls (backend) -->
      <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between mt-4">
        <span class="text-secondary body5">
          Menampilkan {{ pagination.per_page * (pagination.current_page - 1) + 1 }}-
          {{ Math.min(pagination.per_page * pagination.current_page, pagination.total) }}
          dari {{ pagination.total }}
        </span>
        <div class="flex">
          <button type="button"
            class="px-2 py-2 duration-200 border rounded-l-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :disabled="pagination.current_page === 1" @click="emitPageChange(pagination.current_page - 1)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button type="button" v-for="page in pagination.last_page" :key="page"
            class="px-2 py-2 duration-200 border-t border-b border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :class="{ 'bg-secondary text-white': pagination.current_page === page }" @click="emitPageChange(page)">
            {{ page }}
          </button>
          <button type="button"
            class="px-2 py-2 duration-200 border rounded-r-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :disabled="pagination.current_page === pagination.last_page"
            @click="emitPageChange(pagination.current_page + 1)">
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
import { computed } from 'vue';

const props = defineProps({
  headers: Array,
  items: Array,
  minWidth: {
    type: String,
    default: 'min-w-[800px]',
  },
  pagination: Object, // backend pagination object
});
const minWidthClass = computed(() => props.minWidth);

const emit = defineEmits(['rowClick', 'pageChange']);

const handleRowClick = (item) => {
  emit('rowClick', item);
};
const emitPageChange = (page) => {
  if (page !== props.pagination.current_page && page >= 1 && page <= props.pagination.last_page) {
    emit('pageChange', page);
  }
};
</script>