<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div  
      class="w-64 bg-white border-r shadow-sm duration-200 hidden lg:block">
      <div class="p-4 flex justify-between items-center">
        <div class="text-blue-500 font-bold text-2xl">D3TI</div>
        <button class="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden">
            <svg @click="toggleNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
      </div>
      <nav class="mt-5">
        <div class="px-4 py-2">
          <router-link to="/" class="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            DASHBOARD
          </router-link>
        </div>

        <div class="mt-2" >
          <div @click="toggleBimbingan" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>BIMBINGAN</span>
            </div>
            <svg :class="{'transform rotate-180': showBimbingan}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showBimbingan" class="pl-8 py-1">
            <router-link to="/request-pembimbing" class="block py-2 text-gray-700 hover:text-blue-700">
              Request Pembimbing
            </router-link>
            <router-link to="/daftar-bimbingan" class="block py-2 text-gray-700 hover:text-blue-700">
              Daftar Bimbingan
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <div @click="toggleProposal" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>PROPOSAL</span>
            </div>
            <svg :class="{'transform rotate-180': showProposal}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showProposal" class="pl-8 py-1">
            <router-link to="/jadwal-sempro" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Sempro
            </router-link>
            <router-link to="/input-nilai-sempro" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Sempro
            </router-link>
            <router-link to="/jadwal-semhas" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Semhas
            </router-link>
            <router-link to="/input-nilai-semhas" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Semhas
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <div @click="toggleTugasAkhir" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>TUGAS AKHIR</span>
            </div>
            <svg :class="{'transform rotate-180': showTugasAkhir}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showTugasAkhir" class="pl-8 py-1">
            <router-link to="/jadwal-menguji" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Menguji
            </router-link>
            <router-link to="/input-nilai-ujian-ta" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Ujian TA
            </router-link>
            <router-link to="/revisi-tugas-akhir" class="block py-2 text-gray-700 hover:text-blue-700">
              Revisi Tugas Akhir
            </router-link>
          </div>
        </div>
      </nav>
    </div>

      <!-- Sidebar -->
  <div 
    v-bind:class="{'translate-x-0': showNavbar, '-translate-x-full': !showNavbar}" 
    class="fixed top-0 left-0 w-64 h-full bg-white border-r shadow-sm z-50 transform transition-transform duration-300">
    <div class="p-4 flex justify-between items-center">
      <div class="text-blue-500 font-bold text-2xl">D3TI</div>
      <button @click="toggleNavbar" class="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <nav class="mt-5">
        <div class="px-4 py-2">
          <router-link to="/" class="flex items-center text-blue-600 hover:bg-blue-50 px-2 py-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            DASHBOARD
          </router-link>
        </div>

        <div class="mt-2" >
          <div @click="toggleBimbingan" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>BIMBINGAN</span>
            </div>
            <svg :class="{'transform rotate-180': showBimbingan}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showBimbingan" class="pl-8 py-1">
            <router-link to="/request-pembimbing" class="block py-2 text-gray-700 hover:text-blue-700">
              Request Pembimbing
            </router-link>
            <router-link to="/daftar-bimbingan" class="block py-2 text-gray-700 hover:text-blue-700">
              Daftar Bimbingan
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <div @click="toggleProposal" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>PROPOSAL</span>
            </div>
            <svg :class="{'transform rotate-180': showProposal}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showProposal" class="pl-8 py-1">
            <router-link to="/jadwal-sempro" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Sempro
            </router-link>
            <router-link to="/input-nilai-sempro" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Sempro
            </router-link>
            <router-link to="/jadwal-semhas" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Semhas
            </router-link>
            <router-link to="/input-nilai-semhas" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Semhas
            </router-link>
          </div>
        </div>

        <div class="mt-2">
          <div @click="toggleTugasAkhir" class="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>TUGAS AKHIR</span>
            </div>
            <svg :class="{'transform rotate-180': showTugasAkhir}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div v-show="showTugasAkhir" class="pl-8 py-1">
            <router-link to="/jadwal-menguji" class="block py-2 text-gray-700 hover:text-blue-700">
              Jadwal Menguji
            </router-link>
            <router-link to="/input-nilai-ujian-ta" class="block py-2 text-gray-700 hover:text-blue-700">
              Input Nilai Ujian TA
            </router-link>
            <router-link to="/revisi-tugas-akhir" class="block py-2 text-gray-700 hover:text-blue-700">
              Revisi Tugas Akhir
            </router-link>
          </div>
        </div>
      </nav>
  </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center">
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden">
            <svg @click="toggleNavbar" v-show="!showNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative mr-2">
            <button @click="toggleNotification" class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <svg :class="{'transform rotate-180': showNotification}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div class="flex items-center">
            <span class="text-sm font-medium mr-2">Dosen 1</span>
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-sm font-medium text-gray-600">D</span>
            </div>
          </div>
        </div>

        <!-- notifikasi -->
         <div class="absolute top-12 right-5  mt-2 w-64 bg-white shadow-lg rounded-lg z-50" v-show="showNotification">
          <div class="p-4">
            <h3 class="text-lg font-semibold">Notifikasi</h3>
            <ul class="mt-2">
              <li class="py-2 border-b border-gray-200">Notifikasi 1</li>
              <li class="py-2 border-b border-gray-200">Notifikasi 2</li>
              <li class="py-2">Notifikasi 3</li>
            </ul>
          </div>

         </div>
      </header>

      <!-- Dashboard Content -->
      <main class="flex-1 p-6">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, } from 'vue'

const showBimbingan = ref(false)
const showProposal = ref(false)
const showTugasAkhir = ref(false)
const showNavbar = ref(false)
const showNotification = ref(false)
const isLgScreen = ref(false)


const checkScreenSize = () => {
  isLgScreen.value = window.innerWidth >= 1024 // Tailwind lg breakpoint
}
// Tambahkan event listener untuk resize
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
const toggleBimbingan = () => {
  showBimbingan.value = !showBimbingan.value
}

const toggleProposal = () => {
  showProposal.value = !showProposal.value
}

const toggleTugasAkhir = () => {
  showTugasAkhir.value = !showTugasAkhir.value
}

const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value
  showNotification.value = false

}
const toggleNotification = () => {
  showNotification.value = !showNotification.value
  showNavbar.value = false
}
</script>