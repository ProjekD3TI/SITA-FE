<script setup>
import { ref } from 'vue';
import HeroAsset from '@/assets/images/blue-dashboard.svg';
const studentName = ref('Mahasiswa 1');
const bimbinganProgress = ref({
  completed: 5,
  total: 9,
});
const proposalStatus = ref('Terverifikasi');
const pendaftaranStatus = ref('Belum Tersedia');
const revisiStatus = ref('Belum Tersedia');
</script>
<template>
  <div id="app" class=" mx-auto p-4 bg-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Welcome Card -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden col-span-1 md:col-span-2 relative">
        <img :src="HeroAsset" alt="" class="z-10 -left-1/4 md:top-0 md:right-0 md:left-0 absolute max-w-xs md:max-w-none md:w-auto">
        <div class="flex flex-col md:flex-row items-center duration-200">
          <div class="p-6 md:w-1/2">
            <h2 class="text-sky-500 text-4xl font-bold max-w-xs xl:max-w-md mx-auto duration-200">Welcome Back!</h2>
            <h3 class="text-gray-800 text-2xl font-bold mt-2 max-w-xs xl:max-w-md mx-auto duration-200">{{ studentName }}</h3>
          </div>
          <div class="md:w-1/2 flex justify-center p-4">
            <img src="/src/assets/images/header-dashbord-mahasiswa.svg" alt="Student working on computer" class="h-52 md:h-64" />
          </div>
        </div>
      </div>

      <!-- Total Bimbingan Card -->
      <div class="bg-white rounded-lg shadow-md shadow-orange-400/10 p-6">
        <h3 class="text-gray-800 font-semibold mb-4">Total Bimbingan</h3>
        <div class="flex items-center justify-center h-36">
          <div class="text-4xl font-bold mr-4">5/9</div>
          <div class="relative w-24 h-24 sm:w-36 sm:h-36">
            <!-- Circle background -->
            <div class="absolute inset-0 rounded-full bg-gray-200"></div>
            <!-- Progress circle (approximately 55%) -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-orange-300 to-orange-400" style="clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 50%, 100% 100%, 50% 100%, 50% 50%);"></div>
            <!-- Inner white circle -->
            <div class="absolute inset-5 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      <!-- Proposal Tugas Akhir Card -->
      <div v-bind:class="{'shadow-green-600/10' : verifiedProposal, 'shadow-red-500/10': !verifiedProposal}"  class="bg-white rounded-lg shadow-md shadow-yellow-600/10 p-6">
        <h3 class="text-gray-800 shadow-yellow-600/10 font-semibold mb-4">Proposal Tugas Akhir</h3>
        <div class="flex flex-col items-center justify-center h-36">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span v-bind:class="{'text-green-600 bg-green-100' : verifiedProposal, 'text-red-500 bg-red-100': !verifiedProposal}" class=" bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-sm">Memvalidasi</span>
        </div>
      </div>

      <!-- Pendaftaran Ujian Card -->
      <div v-bind:class="{'shadow-green-600/10' : verifiedProposal, 'shadow-red-500/10': !verifiedProposal}" class="bg-white rounded-lg shadow-yellow-600/10 shadow-md p-6">
        <h3 class="text-gray-800 font-semibold mb-4">Pendaftaran Ujian Tugas Akhir</h3>
        <div class="flex flex-col items-center justify-center lg:h-36">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-sm">Belum Tersedia</span>
        </div>
      </div>

      <!-- Revisi Ujian Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-gray-800 font-semibold mb-4">Revisi Ujian Tugas Akhir</h3>
        <div class="flex flex-col items-center justify-center lg:h-36">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-sm">Belum Tersedia</span>
        </div>
      </div>
    </div>
  </div>


</template>