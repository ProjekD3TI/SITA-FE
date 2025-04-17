<template>
    <div v-bind:class="{'translate-x-0 opacity-100 w-64': showNavbar, '-translate-x-full opacity-0 w-0': !showNavbar}" 
      class="bg-white border-r shadow-sm duration-200 fixed top-0 left-0 h-full z-50 transform lg:static lg:h-auto">
      <div class="p-4 flex justify-between items-center">
        <img :src="D3TILogo" alt="" class="h-8">
        <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg @click="toggleNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav class="mt-5">
        <slot />
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import D3TILogo from '@/assets/images/d3ti-logo.png'
  
  const showNavbar = ref(false)
  
  const toggleNavbar = () => {
    showNavbar.value = !showNavbar.value
  }
  </script>