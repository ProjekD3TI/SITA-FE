<script setup>
// Define props to accept data
defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  showNotification: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div
    id="notification-menu"
    class="absolute top-12 right-5 mt-2 w-72 sm:w-80 md:w-96 bg-white shadow-lg rounded-lg z-50 duration-200"
    v-show="showNotification"
  >
    <div>
      <h3 class="text-lg font-bold border-b p-2 px-4">Notifikasi</h3>
      <ul class="px-4 overflow-auto h-64">
        <li
          v-for="notification in notifications" 
          :key="notification.id"
          :class="{'opacity-70': !notification.isNew}"
          class="border-b border-gray-200 py-2"
        >
          <button
            @click="$emit('markAsRead', notification.id)"
            class="p-3 lg:p-4 hover:bg-gray-100 rounded-lg duration-200 w-full"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-6 h-5 w-5 p-1 lg:h-6 lg:w-6 bg-white rounded-full shadow lg:p-1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <h4
                  class="font-semibold text-xs lg:text-sm text-left text-secondary w-32 sm:w-40 lg:w-44 truncate"
                >
                  {{ notification.title }}
                </h4>
              </div>
              <span class="text-[8px] lg:text-[10px] text-gray-400">
                {{ notification.time }}
              </span>
            </div>
            <div class="flex items-center justify-between relative">
              <div
                v-show="notification.isNew"
                class="absolute right-0 w-4 h-4 bg-secondary rounded-full border-2 border-white"
              ></div>
              <p class="text-xs lg:text-sm ms-1 mt-1 me-4 text-left">
                {{ notification.message }}
              </p>
            </div>
          </button>
        </li>
      </ul>
      <div>
        <button
          @click="$emit('markAllAsRead')"
          class="w-full border-t text-center text-sm py-4 hover:bg-gray-100 duration-200"
        >
          Tanda semua sudah dibaca
        </button>
      </div>
    </div>
  </div>
</template>