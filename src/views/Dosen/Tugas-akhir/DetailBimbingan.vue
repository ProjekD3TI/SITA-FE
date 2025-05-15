<script setup>
import Breadcrumb from "@/components/Tugas-akhir/Breadcrumb.vue";
import ProgressBarBAB from "@/components/Tugas-akhir/ProgressBarBAB.vue";
import Button from "@/components/Tugas-akhir/Button.vue";
import Table from "@/components/Tugas-akhir/Table.vue";
import StatusLabel from "@/components/Tugas-akhir/Label.vue";
</script>
<template>
  <Breadcrumb :items="breadcrumbItems" />
  <div>
    <!-- Header: Info Dosen & Progress BAB -->
    <div class="card-rounded bg-white p-6 lg:p-8">
      <!-- Info Dosen Pembimbing -->
      <div class="flex gap-2 sm:gap-4 max-w-screen-xl mx-auto">
        <!-- Icon Dosen -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

        <!-- Detail Informasi -->
        <div class="self-center flex flex-wrap justify-between w-full">
          <!-- Dosen Pembimbing -->
          <div>
            <span class="body5 sm:body4-bold">John Batubara</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              V3423000
            </h5>
          </div>

          <!-- Kategori TA -->
          <div class="lg:border-l-2 border-black lg:pl-4">
            <span class="body5 sm:body5-bold">Internet of Things</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              Pengembangan El Pikir
            </h5>
          </div>

          <!-- Tahun Ajaran -->
          <div>
            <span class="body5 sm:body4-bold">Tahun Ajaran</span>
            <h5 class="body5-bold sm:body3-bold lg:body2-bold text-primary">
              2024/2025
            </h5>
          </div>
        </div>
      </div>

      <!-- Progress BAB & Tombol Tambah -->
      <div
        class="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto"
      >
        <!-- Progress Bar BAB -->
        <ProgressBarBAB class="sm:ms-3" :currentStep="highestChapter" />

        <!-- Tombol Tambah Bimbingan -->
        <router-link to="/mahasiswa/tugas-akhir/bimbingan/tambah-bimbingan">
          <!-- Desktop Button -->
          <Button
            class="hidden lg:flex"
            variant="primary"
            size="xl"
            left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
          >
            Tambah
          </Button>

          <!-- Mobile Button -->
          <Button
            class="lg:hidden"
            variant="primary"
            size="md"
            left-icon-path="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
          >
            Tambah
          </Button>
        </router-link>
      </div>
    </div>
  </div>
</template>
