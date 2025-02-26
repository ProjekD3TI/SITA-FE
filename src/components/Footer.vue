<template>
  <div>
    <footer class="bg-white text-center fixed inset-x-0 bottom-0 z-10 shadow-md">
      <!-- Separator -->
      <div class="border-t border-b border-black bg-[rgba(247,128,82,0.12)] h-[150px] flex items-center justify-between px-4">
        <div class="container mx-auto flex items-center justify-between px-4">
          <!-- Logo -->
          <div>
            <img src="/src/assets/images/d3ti-logo.png" alt="D3TI UNS Logo" class="h-24 w-auto" />
          </div>

          <!-- Website Links -->
          <div class="flex flex-col space-y-2 text-left">
            <p class="font-bold text-gray-800">Website Lain</p>
            <a href="https://d3ti.vokasi.uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">D3 TI UNS</a>
            <a href="https://vokasi.uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">SV UNS</a>
            <a href="https://uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">Universitas Sebelas Maret</a>
          </div>

          <!-- Social Media Icons -->
          <div class="flex flex-col space-y-2 text-left">
            <p class="font-bold text-gray-800">Media Sosial</p>
            <div class="flex space-x-4">
              <a href="https://instagram.com" class="text-gray-600 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2m0-12v2a3 3 0 005.356 1.857M7 20v-2c0-.656.126-1.283.356-1.857M17 20v-2a3 3 0 00-5.356-1.857M17 20v2m0-12v2a3 3 0 005.356 1.857M17 20v-2c0-.656-.126-1.283-.356-1.857"></path>
                </svg>
              </a>
              <a href="https://youtube.com" class="text-gray-600 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </a>
              <a href="https://tiktok.com" class="text-gray-600 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="container mx-auto p-2">
        <p class="text-gray-600 text-sm">Copyright &copy; 2025</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style>
/* Tambahkan styling tambahan jika diperlukan */
</style>