<template>
    <header class="bg-white shadow-sm p-4 flex justify-between items-center">
      <div class="flex items-center">
        <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg @click="toggleNavbar" v-show="!showNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div class="flex items-center">
        <div class="relative mr-2">
            <button id="notification-button" @click="toggleNotification" class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none flex active:scale-90 duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            </button>
            <div id="notification-menu" class="absolute top-6 right-0 mt-2 w-64 lg:w-96 bg-white shadow-lg rounded-lg z-50 duration-200" v-show="showNotification">
                <div class="p-4">
                <h3 class="text-lg font-semibold">Notifikasi</h3>
                <ul class="mt-2">
                    <li class="py-2 border-b border-gray-200">Notifikasi 1</li>
                    <li class="py-2 border-b border-gray-200">Notifikasi 2</li>
                    <li class="py-2">Notifikasi 3</li>
                </ul>
                </div>
            </div>
        </div>

    <!-- user-dropdown  -->
        <div class="flex items-center">
            <span class="text-sm font-medium mr-2">Dosen 1</span>
            <button id="user-button" @click="toggleUser" class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center active:scale-90 duration-150">
                <span class="text-sm font-medium text-gray-600">D</span>
            </button>
            <div id="user-menu" class="absolute top-12 right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 duration-200" v-show="showUser">
                <div class="p-4">
                    <ul>
                        <li class="px-2 hover:bg-gray-100 rounded duration-200">
                            <button class="py-2 active:scale-95 duration-150">Profile</button>
                        </li>
                        <li class="px-2 hover:bg-gray-100 rounded duration-200">
                            <button class="py-2 text-red-500">Log Out</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'  
  
  const showNotification = ref(false)
  const showNavbar = ref(false)
  const showUser = ref(false)
  
  const toggleNotification = () => {
    showNotification.value = !showNotification.value
    showNavbar.value = false
  }
  
  const toggleNavbar = () => {
    showNavbar.value = !showNavbar.value
  }

  const toggleUser = () => {
    showUser.value = !showUser.value
    showNavbar.value = false
  }

    const closeDropdownOnClickOutside = (event) => {
        const notificationMenu = document.getElementById('notification-menu');
        const userMenu = document.getElementById('user-menu');
        const notificationButton = document.getElementById('notification-button');
        const userButton = document.getElementById('user-button');

        // Tutup dropdown jika klik di luar menu dan tombol terkait
        if (
            notificationMenu &&
            !notificationMenu.contains(event.target) &&
            notificationButton &&
            !notificationButton.contains(event.target)
        ) {
            showNotification.value = false;
        }

        if (
            userMenu &&
            !userMenu.contains(event.target) &&
            userButton &&
            !userButton.contains(event.target)
        ) {
            showUser.value = false;
        }
    };

    // Tambahkan event listener untuk resize
    onMounted(() => {
    document.addEventListener('click', closeDropdownOnClickOutside);

    })

    onUnmounted(() => {
    document.removeEventListener('click', closeDropdownOnClickOutside);

    })
  </script>