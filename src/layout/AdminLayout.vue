<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <div v-bind:class="{'translate-x-0 opacity-100 w-64': showNavbar, '-translate-x-full opacity-0 w-0': !showNavbar}" 
      class=" bg-white border-r shadow-sm duration-200 fixed top-0 left-0 h-full z-50 transform lg:static lg:h-auto">
      <div class="p-4 flex justify-between items-center">
        <img :src="D3TILogo" alt="" class="h-8">
        <button class="text-gray-500 hover:text-gray-700 focus:outline-none ">
            <svg @click="toggleNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
      </div>
      <nav class="mt-5">
        <div class="px-4 py-2">
          <router-link :class="isActive(['/']) ? 'text-blue-600 hover:bg-blue-50 px-2 ' : ' text-gray-700 hover:text-blue-700 '" class="rounded duration-150 flex items-center active:scale-95" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            DASHBOARD
          </router-link>
        </div>

        <div class="" >
          <div @click="toggleBimbingan" :class="isActive(['/request-pembimbing','/daftar-bimbingan']) ? ' text-blue-600 hover:bg-blue-50  px-4 rounded' : 'hover:bg-gray-50'" class="cursor-pointer items-center py-2 px-4 ">
            <div :class="isActive(['/request-pembimbing','/daftar-bimbingan']) ? '  ps-2 rounded ' : '   hover:bg-gray-50'" class="duration-150 flex items-center justify-between cursor-pointer active:scale-95">
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
          </div>
          <div v-show="showBimbingan" :class="isActive(['/request-pembimbing','/daftar-bimbingan']) ? 'pl-10 py-1 ': 'pl-8 py-1 '" class="py-1 flex flex-col gap-2 duration-200">
            <div :class="isActive(['/request-pembimbing']) ? 'pe-4' : 'block text-gray-700 hover:text-blue-700'" class="py-1">
              <router-link to="/request-pembimbing"  :class="isActive(['/request-pembimbing']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block active:scale-95 duration-150">
              Request Pembimbing
              </router-link>
            </div>
            <div :class="isActive(['/daftar-bimbingan']) ? 'pe-4' : 'block text-gray-700 hover:text-blue-700'" class="py-1">
              <router-link to="/daftar-bimbingan" :class="isActive(['/daftar-bimbingan']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block active:scale-95 duration-150">
              Daftar Bimbingan
              </router-link>
            </div>
          </div>
        </div>
        <div class="px-4 py-2">
          <router-link :class="isActive(['/seminar-proposal']) ? 'text-blue-600 hover:bg-blue-50 px-2 ' : ' text-gray-700 hover:text-blue-700 '" class="rounded flex items-center active:scale-95 duration-150" to="/seminar-proposal">
            <img :src="SemproIcon" alt="" class="h-5 w-5 mr-2">
            SEMINAR PROPOSAL
          </router-link>
        </div>
        <div class="px-4 py-2">
          <router-link :class="isActive(['/seminar-hasil']) ? 'text-blue-600 hover:bg-blue-50 px-2 ' : ' text-gray-700 hover:text-blue-700 '" class="rounded flex items-center active:scale-95 duration-150" to="/seminar-hasil">
            <img :src="SemhasIcon" alt="" class="h-5 w-5 mr-2">
            SEMINAR HASIL
          </router-link>
        </div>
        <div class="">
          <div @click="toggleProposal" :class="isActive(['/jadwal-menguji','/input-nilai-ujian','/revisi-ujian','/jadwal-sempro']) ? ' text-blue-600 hover:bg-blue-50  px-4 rounded' : 'hover:bg-gray-50'" class="cursor-pointer items-center py-2 px-4">
            <div :class="isActive(['/jadwal-menguji','/input-nilai-ujian','/revisi-ujian','/jadwal-sempro']) ? '  ps-2 rounded ' : '   hover:bg-gray-50'" class="flex items-center justify-between cursor-pointer active:scale-95 duration-150">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Ujian TA</span>
              </div>
              <svg :class="{'transform rotate-180': showProposal}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
          </div>
          <div v-show="showProposal" :class="isActive(['/jadwal-menguji','/input-nilai-ujian','/revisi-ujian','/jadwal-sempro']) ? 'pl-10 py-1 ': 'pl-8 py-1 '" class="py-1 flex flex-col gap-2 duration-200">
            <div :class="isActive(['/jadwal-menguji']) ? 'pe-4 ' : 'block  text-gray-700 hover:text-blue-700'" class="block">
              <router-link to="/jadwal-menguji" :class="isActive(['/jadwal-menguji']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block active:scale-95 duration-150">
              Jadwal Menguji
              </router-link>
            </div>
            <div :class="isActive(['/input-nilai-ujian']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="block">
              <router-link to="/input-nilai-ujian" :class="isActive(['/input-nilai-ujian']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block active:scale-95 duration-150">
              Input Nilai Ujian TA
              </router-link>
            </div>
            <div :class="isActive(['/revisi-ujian']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="block">
              <router-link to="/revisi-ujian" :class="isActive(['/revisi-ujian']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block  active:scale-95 duration-150">
              Revisi Ujian TA
              </router-link>
            </div>
            <div :class="isActive(['/jadwal-sempro']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="block">
              <router-link to="/jadwal-sempro" :class="isActive(['/jadwal-sempro']) ? ' text-blue-600 hover:bg-blue-50 rounded' : ' text-gray-700 hover:text-blue-700'" class="px-2 block  active:scale-95 duration-150">
              Jadwal Sempro
              </router-link>
            </div>  
          </div>
        </div>

      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">

      <!-- Header -->
      <header class="bg-white shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center">
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none ">
            <svg @click="toggleNavbar" v-show="!showNavbar" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative mr-2">
            <button id="notification-button"
              @click="toggleNotification" 
              class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none flex active:scale-90 duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <svg :class="{'transform rotate-180': showNotification}" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <div v-show="hasNotification" class="absolute top-0 right-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
            </button>
          </div>
          <div class="flex items-center">
            <span class="text-sm font-medium mr-2">Dosen 1</span>
            <button id="user-button" @click="toggleUser" class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center active:scale-90 duration-150">
              <span class="text-sm font-medium text-gray-600">D</span>
            </button>
          </div>
        </div>

        <!-- notifikasi -->
         <div id="notification-menu" class="absolute top-12 right-5  mt-2 w-64 lg:w-96 bg-white shadow-lg rounded-lg z-50 duration-200" v-show="showNotification">
          <div class="">
            <h3 class="text-lg font-bold border-b p-2 px-4">Notifikasi</h3>
            <ul class="px-4 overflow-auto h-64">
              <li :class="{'opacity-70': !newNotification2}" class="py-2 border-b border-gray-200">
                <button @click="toggleReadNotification2" class="p-1 lg:p-4 hover:bg-gray-100 rounded-lg duration-200">
                  <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-sm lg:text-base text-left">Validasi Proposal</h4>
                    <span class="text-[10px] lg:text-xs text-gray-400">12/03/2024 12:03</span>
                  </div>
                  <div class="flex items-center justify-between relative">
                    <p class="text-sm me-4 text-left">lorem ipsum dolor sit amet lorem ipsum dolor sit amet </p>
                    <div v-show="newNotification2" class="absolute right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>
              </li>
              <li :class="{'opacity-70': !newNotification}" class="py-2 border-b border-gray-200">
                <button @click="toggleReadNotification" class="p-4 hover:bg-gray-100 rounded-lg duration-200">
                  <div class="flex items-center justify-between">
                  <h4 class="font-semibold">Validasi Proposal</h4>
                  <span class="text-xs text-gray-400">12-03-2024 12:03</span>
                  </div>
                  <div class="flex items-center justify-between relative">
                    <p class="text-sm me-4 text-left">lorem ipsum dolor sit amet lorem ipsum dolor sit amet </p>
                    <div v-show="newNotification" class="absolute right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>
              </li>
              <li :class="{'opacity-70': !newNotification1}" class="py-2  border-gray-200">
                <button @click="toggleReadNotification1" class="p-4 hover:bg-gray-100 rounded-lg duration-200">
                  <div class="flex items-center justify-between">
                  <h4 class="font-semibold">Requst Pembimbing</h4>
                  <span class="text-xs text-gray-400">12-03-2024 12:03</span>
                  </div>
                  <div class="flex items-center justify-between relative">
                    <p class="text-sm me-4 text-left">lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>
                    <div v-show="newNotification1" class="absolute right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>
              </li>              
            </ul>
            <div>
              <button @click="toggleReadAll" class="w-full border-t text-center py-4 hover:bg-gray-100 duration-200">
                Tanda semua sudah dibaca
              </button>
            </div>
          </div>
         </div>
         <div id="user-menu" class="absolute top-12 right-5  mt-2 w-64 bg-white shadow-lg rounded-lg z-50 duration-200" v-show="showUser">
          <div class="p-4">
            <ul class="">
              <li class="px-2 hover:bg-gray-100 rounded duration-200">
                <button class="py-2 active:scale-95 duration-150">Profile</button>
              </li>
              <li class=" px-2 hover:bg-gray-100 rounded duration-200">
                <button class="py-2 text-red-500">Log Out</button>
              </li>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute} from 'vue-router'

import SemproIcon from '@/assets/images/document-arrow-up.svg'
import SemhasIcon from '@/assets/images/document-check.svg'
import D3TILogo from '@/assets/images/d3ti-logo.png'

const route = useRoute()

const showBimbingan = ref(false)
const showProposal = ref(false)
const showTugasAkhir = ref(false)
const showNavbar = ref(false)
const showNotification = ref(false)
const showUser = ref(false)
const isLgScreen = ref(false)
const hasNotification = ref(false)
const newNotification = ref(true) 
const newNotification1 = ref(true) 
const newNotification2 = ref(true) 

const isActive = (paths) => {
  return paths.some((path) => path === route.path)
}
const checkNotification = () => {
  if(newNotification.value || newNotification1.value || newNotification2.value) {
    hasNotification.value = true
    console.log('ada notifikasi')
  } else {
    hasNotification.value = false
    console.log('tidak ada notifikasi')
  }
}
const checkScreenSize = () => {
  isLgScreen.value = window.innerWidth >= 1024 
  showNavbar.value = isLgScreen.value
}
// Tambahkan event listener untuk resize
onMounted(() => {
  checkScreenSize()
  checkNotification()
  // window.addEventListener('notif', checkNotification)
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('click', closeDropdownOnClickOutside);

})

onUnmounted(() => {
  window.removeEventListener('notif', checkScreenSize)
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', closeDropdownOnClickOutside);
})

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
  showUser.value = false
  if (isLgScreen.value == false) {
    showNavbar.value = false
  }
}
const toggleUser = () => {
  showUser.value = !showUser.value
  showNotification.value = false
  if (isLgScreen.value == false) {
    showNavbar.value = false
  }
}

const toggleReadNotification = () => {
  newNotification.value = false
  checkNotification()

}
const toggleReadNotification1 = () => {
  newNotification1.value = false
  checkNotification()
}
const toggleReadNotification2 = () => {
  newNotification2.value = false
  checkNotification()
}

const toggleReadAll = () => {
  newNotification.value = false
  newNotification1.value = false
  newNotification2.value = false
  checkNotification()
}
</script>