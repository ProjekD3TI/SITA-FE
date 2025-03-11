<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <Header />
      
      <!-- Main Content -->
      <div class="flex-grow container mx-auto px-4 py-28">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2 space-y-6 animate-fade-in">
            <h1 class="text-4xl font-bold text-primary">Laporan Kejadian</h1>
            <p class="text-lg text-gray-700">
              Sistem Laporan Kejadian D3 Teknik Informatika UNS memungkinkan mahasiswa dan staff
              untuk melaporkan insiden, kerusakan fasilitas, atau permasalahan teknis yang terjadi
              di lingkungan kampus secara cepat dan terstruktur.
            </p>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Prosedur Pelaporan</h2>
              <ol class="list-decimal pl-5 space-y-2">
                <li>Identifikasi jenis kejadian yang ingin dilaporkan</li>
                <li>Lengkapi formulir laporan dengan detail yang jelas</li>
                <li>Lampirkan foto atau bukti pendukung (jika ada)</li>
                <li>Kirimkan laporan melalui sistem</li>
                <li>Pantau status penanganan laporan Anda</li>
              </ol>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Kategori Laporan</h2>
              <ul class="space-y-2">
                <li><span class="font-semibold">Kerusakan Fasilitas:</span> Gedung, ruang kelas, laboratorium</li>
                <li><span class="font-semibold">Gangguan Teknis:</span> Jaringan, listrik, peralatan lab</li>
                <li><span class="font-semibold">Insiden Keamanan:</span> Kehilangan barang, pelanggaran keamanan</li>
              </ul>
            </div>
            
            <div class="mt-4 mb-6">
              <a href="#" class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Buat Laporan Baru
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2 relative">
            <img
              src="/src/assets/images/image_landing.png"
              alt="Sistem Laporan Kejadian D3TI UNS"
              class="w-3/4 mx-auto rounded-lg shadow-lg animate-fade-in"
            />
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <Footer class="mt-auto" />
    </div>
  </template>
  
  <script>
  import Header from "../../components/Header.vue";
  import Footer from "../../components/Footer.vue";
  
  export default {
    name: "LaKejComponent",
    components: {
      Header,
      Footer,
    },
    mounted() {
      console.log("Laporan kejadian information page loaded!");
    },
  };
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