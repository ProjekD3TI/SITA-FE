<template>
  <div>
    <!-- Header -->
    <header>
      <div class="bg-[rgba(223,245,255,0.5)] text-gray-800 fixed inset-x-0 top-0 z-10 shadow-md">
        <div class="container mx-auto flex items-center justify-between p-3">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="mr-3">
              <img src="/src/assets/images/d3ti-logo.png" alt="D3TI UNS Logo" class="h-10 w-auto" />
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex space-x-6 relative">
            <router-link to="/beranda" class="hover:text-gray-600">Home</router-link>
            <router-link to="/tugasakhir" class="hover:text-gray-600">TA</router-link>
            <router-link to="/inventaris" class="hover:text-gray-600">Ruang dan Inventaris</router-link>

            <!-- Dropdown Menu for "Lapor!" -->
            <div class="relative group">
              <span class="hover:text-gray-600 cursor-pointer">Pelaporan</span>
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
          </nav>

          <!-- Login and Register Buttons -->
          <div class="flex items-center space-x-3">
            <router-link :to="{ name: 'loginpelapor' }">
              <button
                class="border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md shadow-md text-sm"
              >
                Login
              </button>
            </router-link>
            <router-link :to="{ name: 'registerpelapor' }">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md text-sm"
              >
                Register
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