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

          <!-- Website Links -->
          <div class="flex flex-col space-y-2 text-left">
            <p class="font-bold text-gray-800">Sosial Media</p>
            <a href="https://d3ti.vokasi.uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">Instagram</a>
            <a href="https://vokasi.uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">Youtube</a>
            <a href="https://uns.ac.id" class="text-gray-600 hover:text-blue-500 text-sm">Tiktok</a>
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