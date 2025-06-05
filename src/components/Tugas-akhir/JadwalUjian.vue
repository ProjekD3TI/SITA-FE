<script setup>
import DefaultAvatar from "@/assets/images/Profile Avatar.svg";

// Definisikan props yang diperlukan
const props = defineProps({
  // Array objek penguji
  examiners: {
    type: Array,
    default: () => [],
    // Format: [{ name: 'Nama Dosen', role: 'Ketua' }]
  },
  // Informasi jadwal
  jadwal: {
    type: Object,
    default: () => ({
      date: "",
      time: "",
      room: "",
    }),
  },
});
</script>

<template>
  <div class="flex flex-col gap-4 mx-auto max-w-screen-2xl">
    <h5 class="body2-bold sm:body1-bold text-primary">Dosen Penguji</h5>
    <div class="flex flex-col items-center md:flex-row">
      <!-- Daftar penguji -->
      <div class="flex flex-col w-full gap-4 basis-7/12 md:w-auto">
        <div
          v-for="(examiner, index) in examiners"
          :key="index"
          class="flex items-center gap-4"
        >
          <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg> -->
          <img :src="DefaultAvatar" alt="" class="w-10 h-10 sm:w-14 sm:h-14" />
          <div class="">
            <p class="body4 sm:body2 text-blackText">{{ examiner.name }}</p>
            <p class="capitalize body4-bold sm:body2-bold text-primary">
              {{ examiner.role }}
            </p>
          </div>
        </div>
      </div>
      <!-- <div class="w-full h-px mt-4 border border-black md:hidden"></div> -->
      <div class="self-stretch w-auto h-px mt-4 bg-black md:hidden"></div>

      <div class="self-stretch hidden w-px h-auto mx-4 bg-black md:block"></div>

      <!-- Informasi jadwal -->
      <div class="flex flex-col w-full gap-4 mt-4 basis-5/12 md:mt-0 md:w-auto">
        <div v-if="jadwal.date">
          <p class="body4-bold sm:body2-bold text-blackText">Hari & Tanggal</p>
          <p class="body4 sm:body2 text-primary">{{ jadwal.date }}</p>
        </div>
        <div v-if="jadwal.time">
          <p class="body4-bold sm:body2-bold text-blackText">Sesi</p>
          <p class="body4 sm:body2 text-primary">{{ jadwal.time }}</p>
        </div>
        <div v-if="jadwal.room">
          <p class="body4-bold sm:body2-bold text-blackText">Ruang</p>
          <p class="body4 sm:body2 text-primary">{{ jadwal.room }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
