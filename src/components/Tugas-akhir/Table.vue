<template>
  <div class="overflow-x-auto">
    <div :class="minWidthClass">
      <table class="w-full">
        <thead>
          <tr
            class="text-white rounded-full bg-primary body5-bold sm:body4-bold"
          >
            <!-- Checkbox Header -->
            <th
              v-if="showCheckbox"
              class="w-10 text-center border-r rounded-l-lg accent-cyan-800"
            >
              <input
                type="checkbox"
                :checked="isAllChecked"
                @change="toggleAll"
                data-testid="header-checkbox"
              />
            </th>
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="px-3 py-3 text-left border-r sm:px-6"
              :class="{
                'rounded-l-lg': index === 0 && !showCheckbox,
                'rounded-r-lg': index === headers.length - 1,
              }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="items.length">
            <tr
              v-for="(item, index) in items"
              :key="item.id || index"
              class="even:bg-even odd:bg-odd hover:bg-gray-200 text-left body5 sm:body4 rounded-lg active:scale-[0.99] duration-200 cursor-pointer"
              @click="
                showCheckbox ? toggleItem(item.id) : $emit('rowClick', item)
              "
            >
              <!-- Checkbox Row -->
              <td
                v-if="showCheckbox"
                class="w-10 text-center accent-cyan-800"
                @click.stop
              >
                <input
                  type="checkbox"
                  :checked="checkedItems.includes(item.id)"
                  @change.stop="toggleItem(item.id)"
                  data-testid="body-checkbox"
                />
              </td>
              <slot name="row" :item="item" />
            </tr>
          </template>
          <template v-else>
            <slot name="empty">
              <tr>
                <td :colspan="headers.length + (showCheckbox ? 1 : 0)">
                  <div class="py-8 text-center text-placeholder">
                    Tidak ada data
                  </div>
                </td>
              </tr>
            </slot>
          </template>
        </tbody>
      </table>

      <!-- Pagination Controls (backend) -->
      <div
        v-if="showPagination && pagination.total > 0"
        class="flex items-center justify-between mt-4"
      >
        <span class="text-secondary body5">
          Menampilkan
          {{ pagination.per_page * (pagination.current_page - 1) + 1 }} -
          {{
            Math.min(
              pagination.per_page * pagination.current_page,
              pagination.total
            )
          }}
          dari {{ pagination.total }}
        </span>
        <div class="flex">
          <button
            type="button"
            class="px-2 py-2 duration-200 border rounded-l-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :class="
              pagination.current_page === 1
                ? 'cursor-not-allowed opacity-50'
                : ''
            "
            @click="emitPageChange(pagination.current_page - 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            class="px-2 py-2 duration-200 border rounded-r-lg border-secondary text-secondary hover:text-white hover:bg-secondary active:scale-90"
            :class="
              pagination.current_page === pagination.last_page
                ? 'cursor-not-allowed opacity-50'
                : ''
            "
            @click="emitPageChange(pagination.current_page + 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  headers: Array,
  items: Array,
  minWidth: {
    type: String,
    default: "min-w-[800px]",
  },
  pagination: {
    type: Object,
    default: () => ({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    }),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  checkedItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["rowClick", "pageChange", "update:checkedItems"]);

const minWidthClass = computed(() => props.minWidth);

const emitPageChange = (page) => {
  if (
    page !== props.pagination.current_page &&
    page >= 1 &&
    page <= props.pagination.last_page
  ) {
    emit("pageChange", page);
  }
};

// Checkbox logic
const isAllChecked = computed(() => {
  return (
    props.items.length > 0 &&
    props.items.every((item) => props.checkedItems.includes(item.id))
  );
});

const toggleAll = (e) => {
  if (e.target.checked) {
    emit(
      "update:checkedItems",
      props.items.map((item) => item.id)
    );
  } else {
    emit("update:checkedItems", []);
  }
};
const toggleItem = (id) => {
  const newChecked = props.checkedItems.includes(id)
    ? props.checkedItems.filter((i) => i !== id)
    : [...props.checkedItems, id];
  emit("update:checkedItems", newChecked);
};
</script>
