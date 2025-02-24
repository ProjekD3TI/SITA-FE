<template>
    <div>
      <!-- Header -->
      <header>
        <div class="bg-gray-700 text-white fixed inset-x-0 top-0 z-10 shadow-md">
          <div class="container mx-auto flex items-center justify-between p-3">
            <!-- Logo -->
            <div class="flex items-center">
              <div class="mr-3">
                <span class="text-white font-bold text-2xl">Portal D3TI UNS</span>
              </div>
            </div>
  
            <!-- Navigation Menu -->
            <nav class="hidden md:flex space-x-6 relative">
              <router-link to="/beranda" class="hover:text-gray-300">Beranda</router-link>
  
              <!-- Dropdown Menu for "Lapor!" -->
              <div class="relative group">
                <span class="hover:text-gray-300 cursor-pointer">Lapor!</span>
                <!-- Sub-navbar (Dropdown) -->
                <div
                  class="absolute top-full left-0 mt-2 bg-gray-800 text-white rounded-lg shadow-lg py-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible"
                >
                  <router-link
                    to="/laporkejadian"
                    class="block px-4 py-2 hover:bg-gray-700"
                  >
                    Lapor Kejadian
                  </router-link>
                  <router-link
                    to="/laporkekerasanseksual"
                    class="block px-4 py-2 hover:bg-gray-700"
                  >
                    Lapor Kekerasan Seksual
                  </router-link>
                </div>
              </div>
  
              <router-link to="/inventaris" class="hover:text-gray-300">Inventaris</router-link>
              <router-link to="/tugasakhir" class="hover:text-gray-300">Tugas Akhir</router-link>
              <router-link to="/tentangkami" class="hover:text-gray-300">About</router-link>
            </nav>
  
            <!-- Login Button -->
            <div class="flex items-center">
              <router-link :to="{ name: 'loginpelapor' }">
                <button
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-sm"
                >
                  Login
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </header>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
  };
  </script>
  
  <style>
  /* Tambahkan styling tambahan jika diperlukan */
  </style>