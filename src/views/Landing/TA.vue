<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <Header />
      
      <!-- Main Content -->
      <div class="flex-grow container mx-auto px-4 py-28">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="md:w-1/2 space-y-6 animate-fade-in">
            <h1 class="text-4xl font-bold text-primary">Informasi Tugas Akhir</h1>
            <p class="text-lg text-gray-700">
              Program Tugas Akhir (TA) merupakan syarat wajib bagi mahasiswa D3 Teknik Informatika
              untuk menyelesaikan studi. Tugas Akhir bertujuan untuk menilai kemampuan mahasiswa
              dalam menerapkan ilmu yang telah dipelajari selama perkuliahan.
            </p>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Prosedur Pengajuan TA</h2>
              <ol class="list-decimal pl-5 space-y-2">
                <li>Mahasiswa telah menyelesaikan minimal 90 SKS</li>
                <li>Mengajukan proposal TA kepada koordinator TA</li>
                <li>Mendapatkan persetujuan dosen pembimbing</li>
                <li>Melakukan bimbingan secara rutin</li>
                <li>Menyerahkan laporan final dan melakukan ujian TA</li>
              </ol>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-semibold text-primary mb-4">Jadwal Penting</h2>
              <ul class="space-y-2">
                <li><span class="font-semibold">Pendaftaran Proposal:</span> Awal semester</li>
                <li><span class="font-semibold">Batas Akhir Bimbingan:</span> 2 bulan sebelum ujian</li>
                <li><span class="font-semibold">Ujian TA:</span> Akhir semester</li>
              </ul>
            </div>
            
            <div class="mt-4 mb-6">
              <a href="#" class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Download Panduan TA
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2 relative">
            <img
              src="/src/assets/images/image_landing.png"
              alt="Tugas Akhir D3 Teknik Informatika UNS"
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
    name: "TAComponent",
    components: {
      Header,
      Footer,
    },
    mounted() {
      console.log("TA information page loaded!");
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