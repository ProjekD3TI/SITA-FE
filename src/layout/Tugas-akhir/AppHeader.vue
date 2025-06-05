<template>
  <header
    class="fixed z-40 flex items-center justify-between w-full p-4 bg-white shadow-sm"
  >
    <div class="flex items-center gap-4">
      <router-link to="/">
        <img :src="logo" alt="Logo" class="w-16 lg:hidden" />
      </router-link>
      <!-- Tombol hamburger di header -->
      <button
        @click="toggleNavbar"
        class="p-1 duration-150 rounded-full hover:bg-gray-100 lg:hidden active:scale-90 sidebar-toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 lg:hidden text-[#384551]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>

    <div class="flex items-center">
      <!-- Notification Button -->
      <div class="relative mr-2">
        <button
          id="notification-button"
          @click="toggleNotification"
          class="flex p-1 px-2 text-[#384551] duration-150 hover:bg-gray-100 rounded-full focus:outline-none active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <svg
            :class="{ 'transform rotate-180': showNotification }"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <div
            v-show="hasNotification"
            class="absolute top-0 w-3 h-3 border-2 border-white rounded-full right-6 bg-secondary"
          ></div>
        </button>
      </div>

      <!-- User Profile Button -->
      <div class="flex items-center">
        <span class="hidden mr-2 text-sm font-medium sm:inline">{{
          user.name
        }}</span>
        <button
          id="user-button"
          @click="toggleUser"
          class="flex items-center justify-center w-8 h-8 duration-150 bg-gray-200 rounded-full active:scale-90"
        >
          <span class="text-sm font-medium text-gray-600">{{
            user.name.charAt(0)
          }}</span>
        </button>
      </div>
    </div>

    <!-- User Menu Dropdown -->
    <div
      id="user-menu"
      class="absolute z-50 w-64 mt-2 duration-200 bg-white rounded-lg shadow-lg top-12 right-5"
      v-show="showUser"
    >
      <div class="p-4">
        <ul>
          <li>
            <router-link
              to="/"
              class="flex items-center w-full px-4 py-2 text-left duration-200 active:scale-90 hover:bg-gray-100 button-rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <button>Home</button>
            </router-link>
          </li>
          <li>
            <router-link
              to=""
              class="flex items-center w-full px-4 py-2 text-left duration-200 active:scale-90 hover:bg-gray-100 button-rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <button>Profile</button>
            </router-link>
          </li>
          <li>
            <button
              class="flex items-center w-full px-4 py-2 text-left duration-200 text-danger active:scale-90 hover:bg-gray-100 button-rounded"
              @click="handleLogout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  showNavbar: Boolean,
  toggleNavbar: Function,
  user: Object,
  logo: String,
  showNotification: Boolean,
  toggleNotification: Function,
  hasNotification: Boolean,
  showUser: Boolean,
  toggleUser: Function,
  handleLogout: Function,
});
</script>

<style scoped>
.button-rounded {
  border-radius: 0.375rem;
}
</style>
