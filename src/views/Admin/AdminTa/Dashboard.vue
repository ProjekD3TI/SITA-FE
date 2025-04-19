<script setup>
import { ref } from 'vue';
import HeroAsset from '@/assets/images/blue-dashboard1.svg';
import HeroAsset1 from '@/assets/images/header-dashboard-admin.svg';
const adminName = ref('Admin 1');

const proposalCount = ref(13);
const tugasAkhirCount = ref(13);
const verifiedCount = ref(14);
const totalDocuments = ref(26);
</script>
<template>
  <div id="app" class=" mx-auto p-4 bg-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Welcome Card -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden col-span-1 md:col-span-2 relative">
        <img :src="HeroAsset" alt="" class="z-10 scale-125 right-8 md:top-0 md:scale-100 md:right-0 absolute">
        <div class="flex flex-col md:flex-row items-center duration-200">
          <div class="p-6 md:w-1/2 z-20">
            <h2 class="text-sky-500 text-4xl font-bold max-w-xs xl:max-w-md mx-auto duration-200">Welcome Back!</h2>
            <h3 class="text-gray-800 text-2xl font-bold mt-2 max-w-xs xl:max-w-md mx-auto duration-200">{{ adminName }}</h3>
          </div>
          <div class="md:w-1/2 flex justify-center p-4 z-20">
            <img :src="HeroAsset1" alt="Student working on computer" class="h-52 md:h-64" />
          </div>
        </div>
      </div>

      <!-- Total Bimbingan Card -->
      <div class="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-red-50 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Pengajuan Proposal TA</p>
            <p class="text-2xl font-bold">{{ proposalCount }}</p>
          </div>
        </div>
      </div>

      <!-- Proposal Tugas Akhir Card -->
      <div class="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-green-50 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
          <div>
            <p class="text-sm text-gray-600">Total Pengajuan Tugas Akhir</p>
            <p class="text-2xl font-bold">{{ tugasAkhirCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm min-h-64">
        <h3 class="text-gray-700 text-sm">Aktivitas</h3>
        <!-- Empty area for future content -->
      </div>

      <!-- Verification Status Card -->
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-gray-700 text-sm mb-4">Total Berkas Belum Terverifikasi</h3>
        <div class="flex justify-center items-center">
          <div class="relative w-40 h-40">
            <!-- Donut Chart Background -->
            <div class="absolute inset-0 rounded-full bg-gray-200"></div>
            <!-- Donut Chart Fill -->
            <div class="absolute inset-0 rounded-full bg-orange-400" 
                 style="clip-path: polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)"></div>
            <!-- Center Circle -->
            <div class="absolute inset-0 w-28 h-28 bg-white rounded-full m-auto flex items-center justify-center">
              <p class="text-center">
                <span class="text-lg font-bold">Total</span><br>
                <span class="text-lg font-bold">{{ verifiedCount }}/{{ totalDocuments }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
            <span class="text-sm">Belum Terverifikasi</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <span class="text-sm">Terverifikasi</span>
          </div>
        </div>
      </div>

    </div>
  </div>


</template>