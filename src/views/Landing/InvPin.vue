<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <Header />
      
      <!-- Main Content -->
      <div class="flex-grow container mx-auto px-4 py-28">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2 space-y-6 animate-fade-in">
            <h1 class="text-4xl font-bold text-primary">Inventaris & Peminjaman</h1>
            <p class="text-lg text-gray-700">
              Sistem Inventaris dan Peminjaman D3 Teknik Informatika UNS memudahkan mahasiswa dan staff
              dalam proses peminjaman peralatan laboratorium, alat peraga, dan perangkat elektronik untuk
              keperluan akademik dan kegiatan kemahasiswaan.
            </p>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Prosedur Peminjaman</h2>
              <ol class="list-decimal pl-5 space-y-2">
                <li>Periksa ketersediaan barang melalui sistem</li>
                <li>Ajukan permintaan peminjaman minimal 2 hari sebelumnya</li>
                <li>Dapatkan persetujuan dari penanggung jawab inventaris</li>
                <li>Tanda tangani formulir peminjaman saat pengambilan barang</li>
                <li>Kembalikan barang sesuai tanggal yang ditentukan</li>
              </ol>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Informasi Penting</h2>
              <ul class="space-y-2">
                <li><span class="font-semibold">Jam Peminjaman:</span> Senin-Jumat, 08.00-16.00</li>
                <li><span class="font-semibold">Durasi Maksimal:</span> 7 hari kerja</li>
                <li><span class="font-semibold">Keterlambatan:</span> Dikenakan denda sesuai ketentuan</li>
              </ul>
            </div>
            
            <div class="mt-4 mb-6">
              <a href="#" class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Lihat Katalog Barang
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2 relative">
            <img
              src="/src/assets/images/image_landing.png"
              alt="Sistem Inventaris dan Peminjaman D3TI UNS"
              class="w-3/4 mx-auto rounded-lg shadow-lg animate-fade-in"
            />
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <Footer class="mt-auto" />
    </div>
  </template>
  
  
<script setup>
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import Footer from "../../components/Footer.vue";
import VueCookies from "vue-cookies";
import { getUserData } from "@/services/authMahasiswa";

// State
const isAuthenticated = ref(false);
const userData = ref(null);

// Functions
const checkAuthentication = () => {
  const authToken = VueCookies.get("auth_token");
  const user = getUserData();
  
  if (authToken && user) {
    isAuthenticated.value = true;
    userData.value = user;
  } else {
    isAuthenticated.value = false;
    userData.value = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  checkAuthentication();
  console.log("Routing is working!");
});
</script>
  
  <style>
  /* Animasi fade-in */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in-out;
  }
  
  /* Styling tambahan */
  .container {
    max-width: 1200px;
  }
  </style>