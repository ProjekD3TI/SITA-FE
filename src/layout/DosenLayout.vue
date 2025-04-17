<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar>
      <!-- Pass navigation links as slot -->
      <div class="px-4 py-2">
        <router-link
          :class="isActive('/') ? 'text-blue-600 hover:bg-blue-50 px-2 ' : 'text-gray-700 hover:text-blue-700'"
          class="rounded duration-150 flex items-center active:scale-95"
          to="/"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          DASHBOARD
        </router-link>
      </div>
      <!-- Add other navigation links here -->
    </Sidebar>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <Header />

      <!-- Dashboard Content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const route = useRoute()

// Function to check if the current route matches the given path
const isActive = (path) => {
  return route.path === path
}
</script>